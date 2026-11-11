// MCP server (stdio transport) exposing the Playwright automation to any MCP client.
// Run: node scripts/browser/mcp.ts
//
// stdout is reserved for the MCP protocol. All diagnostics go to stderr.
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
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
import type { SnapshotResult } from './core.ts'

const automation = new BrowserAutomation()

const server = new McpServer(
  { name: 'browser', version: '1.0.0' },
  {
    instructions: [
      'Headless Chromium automation for the local web app.',
      `Relative URLs resolve against ${automation.config.baseURL}.`,
      'Recommended loop: navigate -> snapshot (mode aria) -> click/fill using role+name or a CSS selector -> wait/snapshot -> screenshot.',
      'The browser starts lazily on the first tool call and stays warm between calls. Call close when finished.',
    ].join(' '),
  }
)

function textResult(value: unknown, isError = false) {
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }],
    ...(isError ? { isError: true } : {}),
  }
}

function errorResult(error: unknown) {
  const payload =
    error instanceof BrowserToolError
      ? { error: error.code, message: error.message, hint: error.hint }
      : { error: 'INTERNAL_ERROR', message: errorMessage(error) }
  return textResult(payload, true)
}

function snapshotResult(result: SnapshotResult) {
  const header = [
    `url: ${result.url}`,
    `title: ${result.title}`,
    `mode: ${result.mode}`,
    `target: ${result.target}`,
    `chars: ${result.chars}${result.truncated ? ' (truncated)' : ''}`,
    '---',
  ].join('\n')
  return { content: [{ type: 'text' as const, text: `${header}\n${result.snapshot}` }] }
}

const readOnly = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: true,
}

const mutating = {
  readOnlyHint: false,
  destructiveHint: false,
  idempotentHint: false,
  openWorldHint: true,
}

server.registerTool(
  'navigate',
  {
    title: 'Navigate',
    description: `Navigate the headless browser and wait for the SPA to load. Accepts an absolute URL or a path relative to ${automation.config.baseURL}. Waits for load and network idle (with a graceful timeout fallback), then optionally for a selector that signals hydration. Returns final URL, title, HTTP status and warnings.`,
    inputSchema: navigateSchema,
    annotations: mutating,
  },
  async (input) => {
    try {
      return textResult(await automation.navigate(input))
    } catch (error) {
      return errorResult(error)
    }
  }
)

server.registerTool(
  'snapshot',
  {
    title: 'Read rendered DOM',
    description:
      'Read the live DOM after client-side JavaScript has run. mode=aria (default) returns the accessibility tree (roles, names, states) and is the best way to pick a locator. mode=text returns visible text. mode=html returns outerHTML. Scope it with a CSS selector when the page is large.',
    inputSchema: snapshotSchema,
    annotations: readOnly,
  },
  async (input) => {
    try {
      return snapshotResult(await automation.snapshot(input))
    } catch (error) {
      return errorResult(error)
    }
  }
)

server.registerTool(
  'click',
  {
    title: 'Click element',
    description:
      'Click an element. Identify it with a CSS selector, ARIA role (+ accessible name), label, placeholder, testId, or visible text. Auto-waits until the element is actionable, then briefly waits for network idle (or for waitForSelector) so SPA updates are visible in the next snapshot.',
    inputSchema: clickSchema,
    annotations: mutating,
  },
  async (input) => {
    try {
      return textResult(await automation.click(input))
    } catch (error) {
      return errorResult(error)
    }
  }
)

server.registerTool(
  'fill',
  {
    title: 'Fill input',
    description:
      'Fill an input, textarea or contenteditable element. Replaces the current value and dispatches input/change events. Set submit=true to press Enter afterwards. Uses the same locator options as click.',
    inputSchema: fillSchema,
    annotations: mutating,
  },
  async (input) => {
    try {
      return textResult(await automation.fill(input))
    } catch (error) {
      return errorResult(error)
    }
  }
)

server.registerTool(
  'press',
  {
    title: 'Press key',
    description:
      'Press a keyboard key or chord ("Enter", "Escape", "Tab", "Control+A"). Optionally target a specific element with a locator; otherwise the key goes to the page.',
    inputSchema: pressSchema,
    annotations: mutating,
  },
  async (input) => {
    try {
      return textResult(await automation.press(input))
    } catch (error) {
      return errorResult(error)
    }
  }
)

server.registerTool(
  'wait',
  {
    title: 'Wait for state',
    description:
      'Wait for a selector, visible text, or URL change. Useful for SPA hydration, route transitions, and async data. state defaults to "visible" and accepts attached, detached, visible, hidden.',
    inputSchema: waitSchema,
    annotations: readOnly,
  },
  async (input) => {
    try {
      return textResult(await automation.wait(input))
    } catch (error) {
      return errorResult(error)
    }
  }
)

server.registerTool(
  'screenshot',
  {
    title: 'Screenshot',
    description:
      'Capture the full page (default) or one element. Returns the image itself for visual inspection. Optionally save it to a path; relative paths resolve inside BROWSER_ARTIFACTS_DIR (.browser/artifacts by default). Supports png, jpeg and webp.',
    inputSchema: screenshotSchema,
    annotations: readOnly,
  },
  async (input) => {
    try {
      const result = await automation.screenshot(input)
      return {
        content: [
          {
            type: 'image' as const,
            data: result.data.toString('base64'),
            mimeType: result.mimeType,
          },
          {
            type: 'text' as const,
            text: `Captured ${result.bytes} bytes${result.path ? `, saved to ${result.path}` : ''}.`,
          },
        ],
      }
    } catch (error) {
      return errorResult(error)
    }
  }
)

server.registerTool(
  'resize',
  {
    title: 'Resize viewport',
    description: 'Set the viewport size in CSS pixels to test responsive layouts.',
    inputSchema: resizeSchema,
    annotations: mutating,
  },
  async (input) => {
    try {
      return textResult(await automation.resize(input))
    } catch (error) {
      return errorResult(error)
    }
  }
)

server.registerTool(
  'close',
  {
    title: 'Close browser',
    description:
      'Close Chromium and free memory. The browser relaunches automatically on the next tool call.',
    annotations: mutating,
  },
  async () => {
    try {
      await automation.close()
      return textResult({ closed: true })
    } catch (error) {
      return errorResult(error)
    }
  }
)

let shuttingDown = false

async function shutdown(signal: string): Promise<void> {
  if (shuttingDown) return
  shuttingDown = true
  console.error(`[browser-mcp] ${signal} received, closing browser`)
  await automation.close()
  process.exit(0)
}

process.on('SIGINT', () => void shutdown('SIGINT'))
process.on('SIGTERM', () => void shutdown('SIGTERM'))

await server.connect(new StdioServerTransport())
server.server.onclose = () => void shutdown('transport closed')
console.error(
  `[browser-mcp] ready — base=${automation.config.baseURL} headless=${automation.config.headless}`
)
