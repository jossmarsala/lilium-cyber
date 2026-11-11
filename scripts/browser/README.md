# Headless browser automation

A small Playwright-powered service that lets agents drive the LILIUM web app like a user:
navigate, read the live rendered DOM, click, fill, and capture screenshots.

It runs in two modes from the same core:

- **MCP server** (stdio) — for OpenCode and other MCP clients. Already configured in
  [`opencode.json`](../../opencode.json) as the `playwright` server.
- **HTTP API** — for scripts, CI, or agents without MCP support.

Playwright was chosen over Puppeteer because it has built-in auto-waiting, a readable
accessibility snapshot, first-class SPA support, and browser lifecycle management.

## Setup

```sh
npm install
npm run browser:install   # downloads the Chromium build used by Playwright
npm run dev               # app at http://localhost:5173 (or the next free port)
```

Node 23.6+ is required to run the `.ts` entrypoints directly through native type stripping.
The rest of this repository already relies on that behavior.

Run the end-to-end fixture test with:

```sh
npm run browser:smoke
```

## MCP server

`opencode.json` starts the server automatically:

```json
{
  "mcp": {
    "servers": {
      "playwright": {
        "type": "local",
        "command": ["node", "scripts/browser/mcp.ts"],
        "environment": { "BROWSER_BASE_URL": "http://localhost:5173" }
      }
    }
  }
}
```

Restart or reload OpenCode, then use the tools as `playwright_navigate`, `playwright_snapshot`,
and so on (or `tools.playwright.navigate` in Code Mode). The server name is `playwright`
rather than `browser` to avoid colliding with OpenCode's built-in browser tools.

For other MCP clients:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "node",
      "args": ["scripts/browser/mcp.ts"],
      "cwd": "/absolute/path/to/cyber-range"
    }
  }
}
```

### Tools

| Tool         | Purpose                                                                  |
| :----------- | :----------------------------------------------------------------------- |
| `navigate`   | Open a URL, wait for load/network idle, optional hydration selector.     |
| `snapshot`   | Read rendered DOM as an ARIA tree (default), visible text, or outerHTML. |
| `click`      | Click by CSS selector, role+name, label, placeholder, testId, or text.   |
| `fill`       | Fill an input/textarea; optionally submit with Enter.                    |
| `press`      | Press a key or chord, optionally scoped to an element.                   |
| `wait`       | Wait for a selector, text, or URL change.                                |
| `screenshot` | Return a full-page or element image (png/jpeg/webp), optionally saved.   |
| `resize`     | Change the viewport to test responsive layouts.                          |
| `close`      | Close Chromium and free memory; it relaunches on the next call.          |

Recommended agent loop:

```text
navigate "/"
snapshot (mode aria)                 # inspect roles, names and states
click { role: "button", name: "Labs" }
wait   { selector: "main" }
screenshot { fullPage: true }
```

Prefer `role` + `name` over brittle CSS selectors. Use `snapshot` after every UI change
instead of guessing. Pass `waitForSelector` to `navigate` when the app exposes a reliable
hydration marker.

Some animated SPAs update the URL before swapping the page content. `click` watches for
both URL and content changes, but an explicit `waitForSelector` for an element unique to
the destination (for example `article` on the docs page) is the deterministic option:

```text
click { role: "radio", name: "Playbook", waitForSelector: "article" }
```

If content is still catching up, call `wait` with destination-specific text before
taking a screenshot.

## HTTP API

```sh
npm run browser:serve
# [browser-http] listening on http://127.0.0.1:4737
```

```sh
curl -s http://127.0.0.1:4737/health

curl -s http://127.0.0.1:4737/navigate \
  -H 'content-type: application/json' \
  -d '{"url":"/","waitUntil":"networkidle"}'

curl -s http://127.0.0.1:4737/snapshot \
  -H 'content-type: application/json' \
  -d '{"mode":"aria","maxChars":20000}'

curl -s http://127.0.0.1:4737/click \
  -H 'content-type: application/json' \
  -d '{"role":"button","name":"Labs"}'

curl -s http://127.0.0.1:4737/fill \
  -H 'content-type: application/json' \
  -d '{"label":"Email","value":"agent@example.com","submit":true}'

# Binary image
curl -s http://127.0.0.1:4737/screenshot \
  -H 'content-type: application/json' \
  -d '{"fullPage":true,"path":"home.png"}' \
  -o home.png

# Base64 JSON instead of binary
curl -s 'http://127.0.0.1:4737/screenshot?format=json' \
  -H 'content-type: application/json' \
  -d '{"fullPage":false}'
```

| Method | Route         | Body schema                                                         |
| :----- | :------------ | :------------------------------------------------------------------ |
| GET    | `/health`     | —                                                                   |
| POST   | `/navigate`   | `url`, `waitUntil?`, `timeoutMs?`, `waitForSelector?`, `settleMs?`  |
| POST   | `/snapshot`   | `mode?`, `selector?`, `maxChars?`                                   |
| POST   | `/click`      | locator + `button?`, `clickCount?`, `waitForSelector?`, `settleMs?` |
| POST   | `/fill`       | locator + `value`, `submit?`, `waitForSelector?`                    |
| POST   | `/press`      | `key`, optional locator                                             |
| POST   | `/wait`       | `selector?`, `text?`, `url?`, `state?`, `timeoutMs?`                |
| POST   | `/resize`     | `width`, `height`                                                   |
| POST   | `/screenshot` | `path?`, `selector?`, `fullPage?`, `type?`, `quality?`              |
| POST   | `/reset`      | — (starts a fresh browser on the next action)                       |
| POST   | `/close`      | —                                                                   |

A locator is any of `selector`, `role` (+ optional `name`), `label`, `placeholder`,
`testId`, or `text`, plus optional `exact` and zero-based `index`.

Errors return JSON with `error` (code), `message`, and an optional `hint`. Input errors are
`400`, launch failures `503`, and action failures `422`.

## Programmatic use

```ts
import { BrowserAutomation } from './scripts/browser/core.ts'

const browser = new BrowserAutomation({ baseURL: 'http://localhost:5173' })

try {
  await browser.navigate({ url: '/', waitUntil: 'networkidle' })

  const page = await browser.snapshot({ mode: 'aria' })
  console.log(page.snapshot)

  await browser.click({ role: 'link', name: 'Labs' })
  await browser.wait({ selector: 'main' })

  const shot = await browser.screenshot({ fullPage: true, path: 'labs.png' })
  console.log(shot.path, shot.bytes)
} finally {
  await browser.close()
}
```

`BrowserAutomation` launches Chromium lazily, reuses one page, relaunches after a crash or
manual close, and makes `close()` idempotent.

## Configuration

| Variable                      | Default                 | Description                              |
| :---------------------------- | :---------------------- | :--------------------------------------- |
| `BROWSER_BASE_URL`            | `http://localhost:5173` | Base for relative URLs.                  |
| `BROWSER_HEADLESS`            | `true`                  | Set `false` to watch the browser.        |
| `BROWSER_WIDTH` / `HEIGHT`    | `1440` / `900`          | Initial viewport.                        |
| `BROWSER_TIMEOUT_MS`          | `30000`                 | Default navigation/action timeout.       |
| `BROWSER_ARTIFACTS_DIR`       | `.browser/artifacts`    | Root for relative screenshot paths.      |
| `BROWSER_HOST` / `PORT`       | `127.0.0.1` / `4737`    | HTTP bind address.                       |
| `BROWSER_TOKEN`               | unset                   | Require `Authorization: Bearer <token>`. |
| `BROWSER_IGNORE_HTTPS_ERRORS` | `false`                 | Accept self-signed certificates.         |
| `BROWSER_NO_SANDBOX`          | `false`                 | Add `--no-sandbox` (containers/CI only). |
| `BROWSER_EXECUTABLE_PATH`     | unset                   | Use a custom Chromium/Chrome binary.     |

## Notes

- **Waiting:** navigation goes to `domcontentloaded`, then explicitly waits for `load` and
  `networkidle`. If the network never idles (polling, HMR, streaming), the call returns a
  warning instead of failing; use `waitForSelector` for a deterministic hydration signal.
- **Lifecycle:** MCP and HTTP entrypoints close the browser on `SIGINT`/`SIGTERM`. The MCP
  `close` tool (or `POST /close`) frees memory between tasks.
- **Artifacts:** screenshots are written under `.browser/` (gitignored) unless an absolute
  path is given.
- **Security:** the HTTP server binds to loopback by default, browses arbitrary URLs, and
  executes page JavaScript. Set `BROWSER_TOKEN` if other local processes should be kept out.
- **Troubleshooting:** if Chromium is missing, run `npm run browser:install`. If port 4737
  is taken, set `BROWSER_PORT`. If the app runs on another Vite port, update
  `BROWSER_BASE_URL`.
