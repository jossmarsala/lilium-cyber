// End-to-end smoke test for the browser core. Uses a tiny local fixture so it does not
// depend on the Vite dev server: node scripts/browser/smoke.ts
import { createServer } from 'node:http'
import { BrowserAutomation } from './core.ts'

const html = `<!doctype html>
<html lang="en">
  <head><title>Browser fixture</title></head>
  <body>
    <main>
      <h1>Fixture ready</h1>
      <button id="swap">Open labs</button>
      <input aria-label="Search" id="search" />
      <p id="out">idle</p>
    </main>
    <div hidden>
      <h1>Fixture ready</h1>
      <button>Open labs</button>
      <input aria-label="Search" />
    </div>
    <script>
      const out = document.getElementById('out')
      const input = document.getElementById('search')
      input.addEventListener('input', () => { out.textContent = input.value })

      document.getElementById('swap').addEventListener('click', () => {
        setTimeout(() => {
          history.pushState({}, '', '/labs')
          document.querySelector('main').innerHTML =
            '<h1>Labs page</h1><p>Loaded after a delayed transition</p>'
        }, 700)
      })
    </script>
  </body>
</html>`

const server = createServer((_request, response) => {
  response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
  response.end(html)
})

await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
const address = server.address()
if (!address || typeof address === 'string') throw new Error('Could not start fixture server')
const baseURL = `http://127.0.0.1:${address.port}`

const automation = new BrowserAutomation({ baseURL, headless: true })
let failed = false

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

try {
  const navigation = await automation.navigate({ url: '/', waitUntil: 'load' })
  assert(navigation.title === 'Browser fixture', `unexpected title: ${navigation.title}`)
  console.log('PASS navigate')

  const schemeLess = await automation.navigate({
    url: `127.0.0.1:${address.port}`,
    waitUntil: 'load',
  })
  assert(
    schemeLess.url === `${baseURL}/`,
    `scheme-less URL resolved incorrectly: ${schemeLess.url}`
  )
  console.log('PASS navigate (scheme-less host)')

  const aria = await automation.snapshot({ mode: 'aria' })
  assert(aria.snapshot.includes('heading "Fixture ready"'), 'ARIA snapshot missing heading')
  assert(aria.snapshot.includes('button "Open labs"'), 'ARIA snapshot missing button')
  assert(aria.snapshot.includes('textbox "Search"'), 'ARIA snapshot missing textbox')
  console.log('PASS snapshot (aria)')

  await automation.fill({ label: 'Search', value: 'zero trust' })
  const text = await automation.snapshot({ mode: 'text' })
  assert(text.snapshot.includes('zero trust'), 'filled value did not reach the DOM')
  console.log('PASS fill')

  const click = await automation.click({ role: 'button', name: 'Open labs' })
  assert(click.url.endsWith('/labs'), `unexpected URL after click: ${click.url}`)
  const afterClick = await automation.snapshot({ mode: 'text' })
  assert(afterClick.snapshot.includes('Labs page'), 'delayed SPA transition was not awaited')
  console.log('PASS click + SPA transition')

  const screenshot = await automation.screenshot({ fullPage: false, path: 'smoke.png' })
  assert(screenshot.bytes > 1_000, 'screenshot is unexpectedly small')
  assert(screenshot.path?.endsWith('smoke.png'), 'screenshot was not saved')
  console.log(`PASS screenshot (${screenshot.bytes} bytes)`)

  const resized = await automation.resize({ width: 390, height: 844 })
  assert(resized.viewport.width === 390, 'viewport was not resized')
  console.log('PASS resize')
} catch (error) {
  failed = true
  console.error('FAIL', error instanceof Error ? error.message : error)
} finally {
  await automation.close()
  await new Promise<void>((resolve) => server.close(() => resolve()))
}

if (failed) process.exit(1)
console.log('All browser smoke tests passed.')
