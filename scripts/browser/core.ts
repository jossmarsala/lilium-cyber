// Playwright automation core.
// One browser, one context, one page. The browser is launched lazily and can be reused
// across many actions, then closed deterministically by the MCP/HTTP entrypoints.
import { chromium, type Browser, type BrowserContext, type Locator, type Page } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, isAbsolute, resolve } from 'node:path'
import type {
  ClickInput,
  FillInput,
  LocatorInput,
  NavigateInput,
  PressInput,
  ResizeInput,
  ScreenshotInput,
  SnapshotInput,
  WaitInput,
} from './schemas.ts'

export type WaitUntil = 'load' | 'domcontentloaded' | 'networkidle' | 'commit'
export type SnapshotMode = 'aria' | 'text' | 'html'

export interface BrowserConfig {
  /** Base for relative URLs and absolute paths. */
  baseURL: string
  headless: boolean
  viewport: { width: number; height: number }
  timeoutMs: number
  /** Directory where relative screenshot paths are written. */
  artifactsDir: string
  ignoreHTTPSErrors: boolean
  launchArgs: string[]
  executablePath?: string
}

export interface NavigateResult {
  url: string
  title: string
  status: number | null
  waitUntil: WaitUntil
  warnings: string[]
}

export interface SnapshotResult {
  url: string
  title: string
  mode: SnapshotMode
  target: string
  chars: number
  truncated: boolean
  snapshot: string
}

export interface ActionMeta {
  url: string
  title: string
}

interface AfterActionOptions {
  waitForSelector?: string
  settleMs?: number
  timeoutMs?: number
  trackPageChange?: boolean
}

interface RouteState {
  url: string
  mainText: string
}

export interface ClickResult extends ActionMeta {
  action: 'click'
  target: string
}

export interface FillResult extends ActionMeta {
  action: 'fill'
  target: string
  value: string
  submitted: boolean
}

export interface PressResult extends ActionMeta {
  action: 'press'
  target: string
  key: string
}

export interface WaitResult extends ActionMeta {
  waitedFor: string
  elapsedMs: number
}

export interface ScreenshotResult {
  data: Buffer
  mimeType: string
  bytes: number
  path: string | null
}

export interface BrowserStatus {
  open: boolean
  baseURL: string
  headless: boolean
  viewport: { width: number; height: number } | null
  page: { url: string; title: string } | null
}

export type ErrorCode =
  | 'INVALID_INPUT'
  | 'INVALID_URL'
  | 'INVALID_LOCATOR'
  | 'LAUNCH_FAILED'
  | 'NAVIGATION_FAILED'
  | 'SNAPSHOT_FAILED'
  | 'CLICK_FAILED'
  | 'FILL_FAILED'
  | 'PRESS_FAILED'
  | 'WAIT_FAILED'
  | 'SCREENSHOT_FAILED'
  | 'RESIZE_FAILED'
  | 'BROWSER_CLOSED'

export class BrowserToolError extends Error {
  readonly code: ErrorCode
  readonly hint?: string

  constructor(message: string, options: { code?: ErrorCode; hint?: string; cause?: unknown } = {}) {
    super(message, { cause: options.cause })
    this.name = 'BrowserToolError'
    this.code = options.code ?? 'INVALID_INPUT'
    this.hint = options.hint
  }
}

export function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return String(error)
}

function positiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback
}

function booleanEnv(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback
  return !['0', 'false', 'no', 'off'].includes(value.toLowerCase())
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): BrowserConfig {
  return {
    baseURL: env.BROWSER_BASE_URL || 'http://localhost:5173',
    headless: booleanEnv(env.BROWSER_HEADLESS, true),
    viewport: {
      width: positiveInt(env.BROWSER_WIDTH, 1440),
      height: positiveInt(env.BROWSER_HEIGHT, 900),
    },
    timeoutMs: positiveInt(env.BROWSER_TIMEOUT_MS, 30_000),
    artifactsDir: env.BROWSER_ARTIFACTS_DIR || resolve(process.cwd(), '.browser', 'artifacts'),
    ignoreHTTPSErrors: booleanEnv(env.BROWSER_IGNORE_HTTPS_ERRORS, false),
    launchArgs: booleanEnv(env.BROWSER_NO_SANDBOX, false)
      ? ['--no-sandbox', '--disable-dev-shm-usage']
      : [],
    executablePath: env.BROWSER_EXECUTABLE_PATH || undefined,
  }
}

/**
 * Reusable headless-browser session.
 *
 * ```ts
 * const browser = new BrowserAutomation()
 * try {
 *   await browser.navigate({ url: '/' })
 *   console.log(await browser.snapshot({ mode: 'text' }))
 * } finally {
 *   await browser.close()
 * }
 * ```
 */
export class BrowserAutomation {
  readonly #config: BrowserConfig
  #browser: Browser | undefined
  #context: BrowserContext | undefined
  #page: Page | undefined
  #starting: Promise<Page> | undefined

  constructor(config: Partial<BrowserConfig> = {}) {
    const defaults = loadConfig()
    this.#config = {
      ...defaults,
      ...config,
      viewport: { ...defaults.viewport, ...config.viewport },
    }
  }

  get config(): BrowserConfig {
    return this.#config
  }

  get isOpen(): boolean {
    return Boolean(this.#browser?.isConnected())
  }

  get page(): Page | null {
    return this.#page && !this.#page.isClosed() ? this.#page : null
  }

  /** Launch Chromium and return the active page. Idempotent while the browser is healthy. */
  async start(): Promise<Page> {
    if (this.#page && !this.#page.isClosed() && this.#browser?.isConnected()) {
      return this.#page
    }

    await this.close()

    let browser: Browser | undefined
    try {
      browser = await chromium.launch({
        headless: this.#config.headless,
        args: this.#config.launchArgs,
        executablePath: this.#config.executablePath,
      })
    } catch (error) {
      throw new BrowserToolError(`Failed to launch Chromium: ${errorMessage(error)}`, {
        code: 'LAUNCH_FAILED',
        hint: 'Run `npx playwright install chromium` and check BROWSER_EXECUTABLE_PATH.',
        cause: error,
      })
    }

    try {
      const context = await browser.newContext({
        viewport: this.#config.viewport,
        ignoreHTTPSErrors: this.#config.ignoreHTTPSErrors,
      })
      const page = await context.newPage()
      page.setDefaultTimeout(this.#config.timeoutMs)
      page.setDefaultNavigationTimeout(this.#config.timeoutMs)

      browser.on('disconnected', () => {
        this.#browser = undefined
        this.#context = undefined
        this.#page = undefined
      })

      this.#browser = browser
      this.#context = context
      this.#page = page
      return page
    } catch (error) {
      await browser.close().catch(() => undefined)
      throw new BrowserToolError(`Failed to create browser page: ${errorMessage(error)}`, {
        code: 'LAUNCH_FAILED',
        cause: error,
      })
    }
  }

  /** Close the browser and release all resources. Safe to call repeatedly. */
  async close(): Promise<void> {
    const browser = this.#browser
    const context = this.#context
    this.#browser = undefined
    this.#context = undefined
    this.#page = undefined

    if (context) {
      await context.close().catch(() => undefined)
    }
    if (browser) {
      await browser.close().catch(() => undefined)
    }
  }

  /** Drop the current browser and start a fresh one on the next action. */
  async reset(): Promise<void> {
    await this.close()
  }

  async status(): Promise<BrowserStatus> {
    const page = this.page
    const viewport = page ? page.viewportSize() : null
    return {
      open: this.isOpen,
      baseURL: this.#config.baseURL,
      headless: this.#config.headless,
      viewport: viewport ?? (this.isOpen ? this.#config.viewport : null),
      page: page ? { url: page.url(), title: await this.#title(page) } : null,
    }
  }

  async navigate(input: NavigateInput): Promise<NavigateResult> {
    const page = await this.#ensurePage()
    const target = this.#resolveUrl(input.url)
    const timeout = input.timeoutMs ?? this.#config.timeoutMs
    const waitUntil = input.waitUntil ?? 'networkidle'
    const warnings: string[] = []

    let status: number | null
    try {
      const response = await page.goto(target, { waitUntil: 'domcontentloaded', timeout })
      status = response?.status() ?? null
    } catch (error) {
      throw new BrowserToolError(`Navigation to ${target} failed: ${errorMessage(error)}`, {
        code: 'NAVIGATION_FAILED',
        hint: 'Check that the URL is reachable and increase timeoutMs for slow pages.',
        cause: error,
      })
    }

    if (waitUntil === 'load') {
      try {
        await page.waitForLoadState('load', { timeout })
      } catch {
        warnings.push('The page did not reach the "load" state before the timeout.')
      }
    }

    if (waitUntil === 'networkidle') {
      // For SPAs, network idle is a better readiness signal than the load event
      // (large images and analytics often keep `load` pending). Skip `load` here so
      // a single slow asset cannot add the full navigation timeout to every call.
      try {
        await page.waitForLoadState('networkidle', { timeout: Math.min(timeout, 15_000) })
      } catch {
        warnings.push(
          'Network never reached idle (long polling, HMR or streaming). The page is probably still usable; wait for a selector to confirm hydration.'
        )
      }
    }

    if (input.waitForSelector) {
      try {
        const base = page.locator(input.waitForSelector)
        const target = await firstVisible(base)
        await target.waitFor({ state: 'visible', timeout })
      } catch (error) {
        throw new BrowserToolError(
          `Navigation succeeded but selector "${input.waitForSelector}" never became visible: ${errorMessage(error)}`,
          {
            code: 'NAVIGATION_FAILED',
            hint: 'Take a snapshot to inspect the rendered DOM.',
            cause: error,
          }
        )
      }
    }

    await this.#waitForDomStable(page, 1_500, 150)
    await this.#settle(page, input.settleMs ?? 200)

    return {
      url: page.url(),
      title: await this.#title(page),
      status,
      waitUntil,
      warnings,
    }
  }

  async snapshot(input: SnapshotInput = {}): Promise<SnapshotResult> {
    const page = await this.#ensurePage()
    const mode = input.mode ?? 'aria'
    const selector = input.selector ?? 'body'
    const maxChars = input.maxChars ?? 60_000

    let snapshot: string
    try {
      const target = page.locator(selector).first()
      if (mode === 'aria') {
        snapshot = await target.ariaSnapshot({ timeout: this.#config.timeoutMs })
      } else if (mode === 'text') {
        snapshot = await target.innerText({ timeout: this.#config.timeoutMs })
      } else {
        snapshot = await target.evaluate((element) => element.outerHTML)
      }
    } catch (error) {
      throw new BrowserToolError(
        `Could not read a ${mode} snapshot from "${selector}": ${errorMessage(error)}`,
        {
          code: 'SNAPSHOT_FAILED',
          hint: 'The selector may not exist in the rendered DOM. Omit it to snapshot the whole body.',
          cause: error,
        }
      )
    }

    const totalChars = snapshot.length
    const truncated = totalChars > maxChars
    if (truncated) {
      snapshot = `${snapshot.slice(0, maxChars)}\n… [truncated ${totalChars - maxChars} characters]`
    }

    return {
      url: page.url(),
      title: await this.#title(page),
      mode,
      target: selector,
      chars: totalChars,
      truncated,
      snapshot,
    }
  }

  async click(input: ClickInput): Promise<ClickResult> {
    const page = await this.#ensurePage()
    const locator = await this.#locator(page, input)
    const target = describeLocator(input)
    const before = await this.#captureRouteState(page)

    try {
      await locator.click({
        button: input.button ?? 'left',
        clickCount: input.clickCount ?? 1,
        timeout: input.timeoutMs ?? this.#config.timeoutMs,
      })
    } catch (error) {
      throw new BrowserToolError(`Could not click ${target}: ${errorMessage(error)}`, {
        code: 'CLICK_FAILED',
        hint: 'Take a snapshot and check the element role/name, or use a CSS selector.',
        cause: error,
      })
    }

    await this.#afterAction(page, input, before)
    return { action: 'click', target, url: page.url(), title: await this.#title(page) }
  }

  async fill(input: FillInput): Promise<FillResult> {
    const page = await this.#ensurePage()
    const locator = await this.#locator(page, input)
    const target = describeLocator(input)
    const before = await this.#captureRouteState(page)

    try {
      await locator.fill(input.value, { timeout: input.timeoutMs ?? this.#config.timeoutMs })
      if (input.submit) {
        await locator.press('Enter', { timeout: input.timeoutMs ?? this.#config.timeoutMs })
      }
    } catch (error) {
      throw new BrowserToolError(`Could not fill ${target}: ${errorMessage(error)}`, {
        code: 'FILL_FAILED',
        hint: 'Make sure the element is an editable input, textarea or contenteditable.',
        cause: error,
      })
    }

    await this.#afterAction(page, { ...input, trackPageChange: Boolean(input.submit) }, before)
    return {
      action: 'fill',
      target,
      value: input.value,
      submitted: Boolean(input.submit),
      url: page.url(),
      title: await this.#title(page),
    }
  }

  async press(input: PressInput): Promise<PressResult> {
    const page = await this.#ensurePage()
    const timeout = input.timeoutMs ?? this.#config.timeoutMs
    const hasTarget = hasLocator(input)
    const target = hasTarget ? describeLocator(input) : 'page'
    const before = await this.#captureRouteState(page)

    try {
      if (hasTarget) {
        await (await this.#locator(page, input)).press(input.key, { timeout })
      } else {
        await page.keyboard.press(input.key)
      }
    } catch (error) {
      throw new BrowserToolError(
        `Could not press "${input.key}" on ${target}: ${errorMessage(error)}`,
        {
          code: 'PRESS_FAILED',
          cause: error,
        }
      )
    }

    if (input.key.includes('Enter') || page.url() !== before.url) {
      await this.#waitForActionSettled(page, before)
    }
    await this.#settle(page, input.settleMs ?? 150)
    return {
      action: 'press',
      target,
      key: input.key,
      url: page.url(),
      title: await this.#title(page),
    }
  }

  async wait(input: WaitInput): Promise<WaitResult> {
    const page = await this.#ensurePage()
    const timeout = input.timeoutMs ?? this.#config.timeoutMs
    const state = input.state ?? 'visible'
    const startedAt = Date.now()

    if (!input.selector && !input.text && !input.url) {
      throw new BrowserToolError('Wait requires one of: selector, text, or url.', {
        code: 'INVALID_INPUT',
      })
    }

    try {
      if (input.selector) {
        const base = page.locator(input.selector)
        const target = state === 'visible' ? await firstVisible(base) : base.first()
        await target.waitFor({ state, timeout })
      } else if (input.text) {
        const base = page.getByText(input.text, { exact: false })
        const target = state === 'visible' ? await firstVisible(base) : base.first()
        await target.waitFor({ state, timeout })
      } else if (input.url) {
        await page.waitForURL(input.url, { timeout })
      }
    } catch (error) {
      throw new BrowserToolError(`Wait failed: ${errorMessage(error)}`, {
        code: 'WAIT_FAILED',
        hint: 'Take a snapshot to inspect the current page state.',
        cause: error,
      })
    }

    return {
      waitedFor: input.selector
        ? `selector ${input.selector} (${state})`
        : input.text
          ? `text ${JSON.stringify(input.text)} (${state})`
          : `url ${input.url}`,
      elapsedMs: Date.now() - startedAt,
      url: page.url(),
      title: await this.#title(page),
    }
  }

  async screenshot(input: ScreenshotInput = {}): Promise<ScreenshotResult> {
    const page = await this.#ensurePage()
    const type = input.type ?? 'png'
    const timeout = input.timeoutMs ?? this.#config.timeoutMs

    let data: Buffer
    try {
      const options = {
        type,
        quality: type === 'png' ? undefined : input.quality,
        animations: 'disabled' as const,
        caret: 'hide' as const,
        timeout,
      }
      data = input.selector
        ? await page.locator(input.selector).first().screenshot(options)
        : await page.screenshot({ ...options, fullPage: input.fullPage ?? true })
    } catch (error) {
      throw new BrowserToolError(`Screenshot failed: ${errorMessage(error)}`, {
        code: 'SCREENSHOT_FAILED',
        hint: 'If using a selector, make sure it matches a visible element.',
        cause: error,
      })
    }

    const filePath = input.path ? this.#resolveArtifactPath(input.path) : null
    if (filePath) {
      try {
        await mkdir(dirname(filePath), { recursive: true })
        await writeFile(filePath, data)
      } catch (error) {
        throw new BrowserToolError(
          `Could not save screenshot to ${filePath}: ${errorMessage(error)}`,
          {
            code: 'SCREENSHOT_FAILED',
            cause: error,
          }
        )
      }
    }

    return {
      data,
      mimeType: `image/${type}`,
      bytes: data.byteLength,
      path: filePath,
    }
  }

  async resize(
    input: ResizeInput
  ): Promise<ActionMeta & { viewport: { width: number; height: number } }> {
    const page = await this.#ensurePage()
    try {
      await page.setViewportSize({ width: input.width, height: input.height })
    } catch (error) {
      throw new BrowserToolError(`Could not resize the viewport: ${errorMessage(error)}`, {
        code: 'RESIZE_FAILED',
        cause: error,
      })
    }
    await this.#settle(page, 100)
    return {
      viewport: { width: input.width, height: input.height },
      url: page.url(),
      title: await this.#title(page),
    }
  }

  async #ensurePage(): Promise<Page> {
    const current = this.page
    if (current && this.#browser?.isConnected()) return current

    if (!this.#starting) {
      this.#starting = this.start().finally(() => {
        this.#starting = undefined
      })
    }
    return this.#starting
  }

  async #afterAction(page: Page, options: AfterActionOptions, before?: RouteState): Promise<void> {
    if (options.waitForSelector) {
      try {
        const base = page.locator(options.waitForSelector)
        const target = await firstVisible(base)
        await target.waitFor({
          state: 'visible',
          timeout: options.timeoutMs ?? this.#config.timeoutMs,
        })
      } catch (error) {
        throw new BrowserToolError(
          `Action completed but selector "${options.waitForSelector}" never became visible: ${errorMessage(error)}`,
          { code: 'WAIT_FAILED', cause: error }
        )
      }
    } else {
      // A short idle wait catches SPA data fetching, then route/DOM checks catch
      // transitions and hydration renders that happen after the network settles.
      await page.waitForLoadState('networkidle', { timeout: 1_500 }).catch(() => undefined)
      if (before && options.trackPageChange !== false) {
        await this.#waitForActionSettled(page, before)
      }
      await this.#waitForDomStable(page, 1_500, 150)
    }
    await this.#settle(page, options.settleMs ?? 200)
  }

  async #captureRouteState(page: Page): Promise<RouteState> {
    try {
      return await page.evaluate(() => ({
        url: window.location.href,
        mainText: (document.querySelector('main')?.innerText ?? document.body.innerText).slice(
          0,
          4000
        ),
      }))
    } catch {
      return { url: page.url(), mainText: '' }
    }
  }

  async #waitForActionSettled(page: Page, before: RouteState): Promise<void> {
    let signal: string | false

    try {
      const handle = await page.waitForFunction(
        (previous) => {
          const main = document.querySelector('main')
          const text = (main?.innerText ?? document.body.innerText).slice(0, 4000)
          if (window.location.href !== previous.url) return 'url'
          if (text !== previous.mainText) return 'text'
          return false
        },
        before,
        { timeout: 1_000, polling: 100 }
      )
      signal = await handle.jsonValue()
    } catch {
      // No URL/content change (a no-op click) or the context was replaced by a
      // full navigation. In both cases the following stability wait is enough.
      return
    }

    if (signal === 'url') {
      try {
        await page.waitForFunction(
          (previous) => {
            const main = document.querySelector('main')
            const text = (main?.innerText ?? document.body.innerText).slice(0, 4000)
            return text !== previous.mainText
          },
          before,
          { timeout: 4_000, polling: 100 }
        )
      } catch {
        // The new route may legitimately have identical content.
      }
    }
  }

  async #settle(page: Page, ms: number): Promise<void> {
    if (ms > 0) await page.waitForTimeout(ms)
  }

  async #title(page: Page): Promise<string> {
    return page.title().catch(() => '')
  }

  async #locator(page: Page, spec: LocatorInput): Promise<Locator> {
    let locator: Locator | undefined

    if (spec.selector) {
      locator = page.locator(spec.selector)
    } else if (spec.role) {
      locator = page.getByRole(spec.role as Parameters<Page['getByRole']>[0], {
        name: spec.name,
        exact: spec.exact ?? false,
      })
    } else if (spec.label) {
      locator = page.getByLabel(spec.label, { exact: spec.exact ?? false })
    } else if (spec.placeholder) {
      locator = page.getByPlaceholder(spec.placeholder, { exact: spec.exact ?? false })
    } else if (spec.testId) {
      locator = page.getByTestId(spec.testId)
    } else if (spec.text) {
      locator = page.getByText(spec.text, { exact: spec.exact ?? false })
    }

    if (!locator) {
      throw new BrowserToolError(
        'No element locator was provided. Use selector, role (+ name), label, placeholder, testId, or text.',
        { code: 'INVALID_LOCATOR' }
      )
    }

    // Respect an explicit index. Otherwise prefer a visible match, because responsive
    // layouts often render hidden desktop/mobile duplicates of the same control.
    if (spec.index !== undefined) return locator.nth(spec.index)
    return firstVisible(locator)
  }

  async #waitForDomStable(page: Page, maxMs: number, quietMs: number): Promise<void> {
    try {
      await page.evaluate(
        ({ maxMs, quietMs }) =>
          new Promise<void>((resolve) => {
            let quietTimer: number | undefined
            const maxTimer = window.setTimeout(done, maxMs)

            function done() {
              observer.disconnect()
              window.clearTimeout(quietTimer)
              window.clearTimeout(maxTimer)
              resolve()
            }

            const observer = new MutationObserver(() => {
              window.clearTimeout(quietTimer)
              quietTimer = window.setTimeout(done, quietMs)
            })

            observer.observe(document.documentElement, {
              childList: true,
              subtree: true,
              attributes: true,
              characterData: true,
            })
            quietTimer = window.setTimeout(done, quietMs)
          }),
        { maxMs, quietMs }
      )
    } catch {
      // A navigation may destroy the execution context. Playwright's action already
      // waits for navigations, so this is safe to ignore.
    }
  }

  #resolveUrl(input: string): string {
    try {
      if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(input)) return new URL(input).toString()
      if (/^(data|about|file|blob):/i.test(input)) return new URL(input).toString()
      if (input.startsWith('/') || input.startsWith('.')) {
        return new URL(input, this.#config.baseURL).toString()
      }
      // Scheme-less host such as "localhost:5173" or "example.com/path".
      if (input.includes('.') || input.includes(':')) {
        return new URL(`http://${input}`).toString()
      }
      return new URL(input, this.#config.baseURL).toString()
    } catch (error) {
      throw new BrowserToolError(`Invalid URL "${input}": ${errorMessage(error)}`, {
        code: 'INVALID_URL',
        hint: `Use an absolute URL or a path relative to ${this.#config.baseURL}.`,
        cause: error,
      })
    }
  }

  #resolveArtifactPath(input: string): string {
    return isAbsolute(input) ? input : resolve(this.#config.artifactsDir, input)
  }
}

async function firstVisible(locator: Locator): Promise<Locator> {
  const count = await locator.count().catch(() => 0)
  const limit = Math.min(count, 10)
  for (let index = 0; index < limit; index++) {
    const candidate = locator.nth(index)
    if (await candidate.isVisible().catch(() => false)) return candidate
  }
  // No visible match yet: fall back to the first element so Playwright's normal
  // auto-waiting can wait for it to appear or become visible.
  return locator.first()
}

export function hasLocator(spec: LocatorInput): boolean {
  return Boolean(
    spec.selector || spec.role || spec.label || spec.placeholder || spec.testId || spec.text
  )
}

export function describeLocator(spec: LocatorInput): string {
  const index = spec.index ?? 0
  const suffix = index > 0 ? ` [${index}]` : ''
  if (spec.selector) return `selector ${JSON.stringify(spec.selector)}${suffix}`
  if (spec.role) {
    const name = spec.name ? ` name=${JSON.stringify(spec.name)}` : ''
    return `role=${spec.role}${name}${suffix}`
  }
  if (spec.label) return `label ${JSON.stringify(spec.label)}${suffix}`
  if (spec.placeholder) return `placeholder ${JSON.stringify(spec.placeholder)}${suffix}`
  if (spec.testId) return `testId ${JSON.stringify(spec.testId)}${suffix}`
  if (spec.text) return `text ${JSON.stringify(spec.text)}${suffix}`
  return 'page'
}
