// HTTP API for the Playwright automation. Useful from scripts, CI, or any agent that
// cannot speak MCP. Run: node scripts/browser/http.ts
import { createServer, type IncomingMessage } from 'node:http'
import { timingSafeEqual } from 'node:crypto'
import type { z } from 'zod'
import { BrowserAutomation, BrowserToolError, errorMessage } from './core.ts'
import {
  clickSchema,
  fillSchema,
  navigateSchema,
  pressSchema,
  resizeSchema,
  screenshotSchema,
  snapshotSchema,
  waitSchema,
} from './schemas.ts'

const automation = new BrowserAutomation()
const host = process.env.BROWSER_HOST || '127.0.0.1'
const port = Number(process.env.BROWSER_PORT) || 4737
const token = process.env.BROWSER_TOKEN

function sendJson(response: import('node:http').ServerResponse, status: number, payload: unknown) {
  const body = JSON.stringify(payload, null, 2)
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(body),
    'cache-control': 'no-store',
  })
  response.end(body)
}

async function readJson(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = []
  let total = 0

  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as Uint8Array)
    total += buffer.length
    if (total > 1_000_000) {
      throw new BrowserToolError('Request body exceeds the 1 MB limit.', { code: 'INVALID_INPUT' })
    }
    chunks.push(buffer)
  }

  if (total === 0) return {}
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch (error) {
    throw new BrowserToolError(`Request body must be valid JSON: ${errorMessage(error)}`, {
      code: 'INVALID_INPUT',
    })
  }
}

function parseBody<T extends z.ZodType>(schema: T, body: unknown): z.infer<T> {
  const result = schema.safeParse(body)
  if (!result.success) {
    const issue = result.error.issues[0]
    const path = issue.path.length ? issue.path.join('.') : 'body'
    throw new BrowserToolError(`Invalid input at ${path}: ${issue.message}`, {
      code: 'INVALID_INPUT',
    })
  }
  return result.data
}

function isAuthorized(request: IncomingMessage): boolean {
  if (!token) return true
  const actual = Buffer.from(request.headers.authorization ?? '')
  const expected = Buffer.from(`Bearer ${token}`)
  if (actual.length !== expected.length) return false
  return timingSafeEqual(actual, expected)
}

function statusFor(error: unknown): number {
  if (!(error instanceof BrowserToolError)) return 500
  if (['INVALID_INPUT', 'INVALID_URL', 'INVALID_LOCATOR'].includes(error.code)) return 400
  if (error.code === 'LAUNCH_FAILED') return 503
  return 422
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`)

    if (!isAuthorized(request)) {
      sendJson(response, 401, {
        error: 'UNAUTHORIZED',
        message: 'Missing or invalid bearer token.',
      })
      return
    }

    if (request.method === 'GET' && url.pathname === '/health') {
      sendJson(response, 200, { ok: true, ...(await automation.status()) })
      return
    }

    if (request.method !== 'POST') {
      sendJson(response, 404, {
        error: 'NOT_FOUND',
        message: `No route for ${request.method} ${url.pathname}.`,
      })
      return
    }

    switch (url.pathname) {
      case '/navigate': {
        const input = parseBody(navigateSchema, await readJson(request))
        sendJson(response, 200, await automation.navigate(input))
        return
      }
      case '/snapshot': {
        const input = parseBody(snapshotSchema, await readJson(request))
        sendJson(response, 200, await automation.snapshot(input))
        return
      }
      case '/click': {
        const input = parseBody(clickSchema, await readJson(request))
        sendJson(response, 200, await automation.click(input))
        return
      }
      case '/fill': {
        const input = parseBody(fillSchema, await readJson(request))
        sendJson(response, 200, await automation.fill(input))
        return
      }
      case '/press': {
        const input = parseBody(pressSchema, await readJson(request))
        sendJson(response, 200, await automation.press(input))
        return
      }
      case '/wait': {
        const input = parseBody(waitSchema, await readJson(request))
        sendJson(response, 200, await automation.wait(input))
        return
      }
      case '/resize': {
        const input = parseBody(resizeSchema, await readJson(request))
        sendJson(response, 200, await automation.resize(input))
        return
      }
      case '/screenshot': {
        const input = parseBody(screenshotSchema, await readJson(request))
        const shot = await automation.screenshot(input)

        if (url.searchParams.get('format') === 'json') {
          sendJson(response, 200, {
            mimeType: shot.mimeType,
            bytes: shot.bytes,
            path: shot.path,
            data: shot.data.toString('base64'),
          })
          return
        }

        response.writeHead(200, {
          'content-type': shot.mimeType,
          'content-length': String(shot.bytes),
          'cache-control': 'no-store',
          ...(shot.path ? { 'x-screenshot-path': encodeURIComponent(shot.path) } : {}),
        })
        response.end(shot.data)
        return
      }
      case '/reset': {
        await automation.reset()
        sendJson(response, 200, { reset: true })
        return
      }
      case '/close': {
        await automation.close()
        sendJson(response, 200, { closed: true })
        return
      }
      default:
        sendJson(response, 404, {
          error: 'NOT_FOUND',
          message: `No route for POST ${url.pathname}.`,
        })
    }
  } catch (error) {
    sendJson(response, statusFor(error), {
      error: error instanceof BrowserToolError ? error.code : 'INTERNAL_ERROR',
      message: errorMessage(error),
      ...(error instanceof BrowserToolError && error.hint ? { hint: error.hint } : {}),
    })
  }
})

server.on('error', (error) => {
  console.error(`[browser-http] server error: ${errorMessage(error)}`)
  process.exit(1)
})

server.listen(port, host, () => {
  console.log(`[browser-http] listening on http://${host}:${port}`)
  console.log(
    `[browser-http] base=${automation.config.baseURL} headless=${automation.config.headless}`
  )
})

let shuttingDown = false

async function shutdown(signal: string): Promise<void> {
  if (shuttingDown) return
  shuttingDown = true
  console.log(`[browser-http] ${signal} received, shutting down`)
  await new Promise<void>((resolve) => server.close(() => resolve()))
  await automation.close()
  process.exit(0)
}

process.on('SIGINT', () => void shutdown('SIGINT'))
process.on('SIGTERM', () => void shutdown('SIGTERM'))
