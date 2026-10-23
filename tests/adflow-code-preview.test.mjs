import assert from 'node:assert/strict'
import { before, after, test } from 'node:test'
import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'
import { setTimeout as delay } from 'node:timers/promises'

// Supports either a local Playwright installation or the desktop's bundled runtime.
const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright')
const origin = 'http://127.0.0.1:4175'
let server
let browser

before(async () => {
  server = spawn(process.execPath, ['node_modules/vitepress/bin/vitepress.js', 'dev', '--host', '127.0.0.1', '--port', '4175', '--strictPort'], { stdio: 'pipe' })
  let output = ''
  server.stdout.on('data', chunk => { output += chunk })
  server.stderr.on('data', chunk => { output += chunk })
  let ready = false
  for (let attempt = 0; attempt < 150; attempt++) {
    if (server.exitCode !== null) throw new Error(output)
    try {
      ready = (await fetch(origin)).ok
      if (ready) break
    } catch { /* Wait for the local server. */ }
    await delay(200)
  }
  assert.ok(ready, `VitePress did not start: ${output}`)
  browser = await chromium.launch({
    headless: true,
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } : {})
  })
})

after(async () => {
  await browser?.close()
  server?.kill()
})

const formats = [
  { name: 'pop', prefix: 'pop', type: 'pop' },
  { name: 'banner', prefix: 'af', type: null, width: '300', height: '250' },
  { name: 'push', prefix: 'push', type: 'push' },
  { name: 'inpage-push', prefix: 'ipush', type: 'inpage-push', width: '492', height: '328' },
  { name: 'native', prefix: 'nat', type: 'native', width: '492', height: '328' }
]

for (const locale of ['en', 'cn', 'hk']) {
  for (const format of formats) {
    test(`${locale}/${format.name}: separate previews copy current configuration and retain format attributes`, async () => {
      const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] })
      const page = await context.newPage()
      const errors = []
      page.on('pageerror', error => errors.push(error.message))
      try {
        await page.goto(`${origin}/${locale}/adflow/${format.name}-debugger`)
        await page.locator(`#${format.prefix}-runBtn`).waitFor()
        const preview = page.locator('.adflow-code-preview')
        assert.equal(await preview.count(), 1, 'The code preview must have two independently copyable steps')
        const blocks = preview.locator('.code-block')
        assert.equal(await blocks.count(), 2)
        const buttons = preview.getByRole('button')
        assert.equal(await buttons.count(), 2)

        const initialStatus = await page.locator('.test-row').allTextContents()
        const initialLogs = await page.locator(`#${format.prefix}-logBox`).textContent()
        const pid = `#${format.prefix}-placementId${format.name === 'banner' ? '1' : ''}`
        await page.locator(`#${format.prefix}-serverUrl`).fill('https://ads.example.test/?a=1&b=2')
        await page.locator(`#${format.prefix}-accountId`).fill('publisher-42')
        await page.locator(pid).fill('placement-99')
        await page.waitForFunction(() => document.querySelector('.adflow-code-preview')?.textContent.includes('placement-99'))

        const script = (await blocks.nth(0).textContent()).trim()
        const placement = (await blocks.nth(1).textContent()).trim()
        assert.match(script, /<script\s/)
        assert.match(script, /data-server-url="https:\/\/ads\.example\.test\/\?a=1&b=2"/)
        assert.match(script, /data-account-id="publisher-42"/)
        assert.doesNotMatch(script, /<iframe/)
        assert.match(placement, /<iframe\s/)
        assert.match(placement, /data-placement-id="placement-99"/)
        assert.doesNotMatch(placement, /<script/)
        const attributes = await page.evaluate(html => {
          const fragment = document.createElement('template')
          fragment.innerHTML = html
          return Object.fromEntries([...fragment.content.querySelector('iframe').attributes].map(attr => [attr.name, attr.value]))
        }, placement)
        assert.equal(attributes['data-ad-type'] ?? null, format.type)
        assert.equal(attributes.width, format.width)
        assert.equal(attributes.height, format.height)
        assert.equal(attributes['data-adflow-ad'], '')

        for (const [index, expected] of [[0, script], [1, placement]]) {
          await buttons.nth(index).click()
          await page.waitForFunction(expected => navigator.clipboard.readText().then(value => value === expected), expected)
          assert.equal(await page.evaluate(() => navigator.clipboard.readText()), expected)
        }

        // Input markup must stay inert and remain readable/copyable as literal text.
        await page.locator(`#${format.prefix}-accountId`).fill('publisher<&>')
        await page.locator(pid).fill('placement<&>')
        await page.waitForFunction(() => document.querySelector('.adflow-code-preview')?.textContent.includes('placement<&>'))
        assert.equal(await preview.locator('script, iframe').count(), 0)
        await buttons.nth(0).click()
        await page.waitForFunction(() => navigator.clipboard.readText().then(value => value.includes('publisher<&>')))
        await buttons.nth(1).click()
        await page.waitForFunction(() => navigator.clipboard.readText().then(value => value.includes('placement<&>')))
        assert.deepEqual(await page.locator('.test-row').allTextContents(), initialStatus)
        assert.equal(await page.locator(`#${format.prefix}-logBox`).textContent(), initialLogs)
        assert.deepEqual(errors, [])

        // A rejected clipboard write must produce actionable feedback, not success.
        await page.evaluate(() => { navigator.clipboard.writeText = async () => { throw new Error('Clipboard denied') } })
        await buttons.nth(1).click()
        const failure = { en: 'Could not copy', cn: '复制失败', hk: '複製失敗' }[locale]
        await page.waitForFunction(failure => [...document.querySelectorAll('.adflow-code-preview [role="status"]')].some(status => status.textContent.includes(failure)), failure)
        assert.deepEqual(errors, [])
      } finally {
        await context.close()
      }
    })
  }
}
