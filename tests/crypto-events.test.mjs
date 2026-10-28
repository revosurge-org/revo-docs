import assert from 'node:assert/strict'
import { before, after, test } from 'node:test'
import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'
import { setTimeout as delay } from 'node:timers/promises'

const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright')
const origin = 'http://127.0.0.1:4176'
let server
let browser

before(async () => {
  server = spawn(process.execPath, ['node_modules/vitepress/bin/vitepress.js', 'dev', '--host', '127.0.0.1', '--port', '4176', '--strictPort'], { stdio: 'pipe' })
  let output = ''
  server.stdout.on('data', chunk => { output += chunk })
  server.stderr.on('data', chunk => { output += chunk })
  let ready = false
  for (let attempt = 0; attempt < 150; attempt++) {
    if (server.exitCode !== null) throw new Error(output)
    try { ready = (await fetch(origin)).ok } catch { /* Server is starting. */ }
    if (ready) break
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

const names = ['vip_tier_changed', 'kyc_completed', 'kyc_rejected', 'deposit', 'withdraw', 'trade', 'trade_daily_summary', 'reward_claimed']
for (const locale of ['en', 'cn', 'hk']) {
  test(`${locale}: Crypto chips generate scoped, typed payloads`, async () => {
    const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] })
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    const payload = async () => JSON.parse(await page.locator('.epx__code code').innerText())
    try {
      await page.goto(`${origin}/${locale}/tracking/s2s/v3/events-crypto`)
      await page.locator('.epx__pill').first().waitFor()
      assert.deepEqual(await page.locator('.epx__pill').allTextContents(), names)
      for (const name of names) {
        await page.locator('.epx__pill').getByText(name, { exact: true }).click()
        const value = await payload()
        assert.equal(value.event, name)
        assert.equal(value.identity.client_user_id, 'user_001')
        assert.equal(typeof value.timestamp, 'number')
        assert.equal(value.context.ip_address, '203.0.113.1')
      }
      await page.locator('.epx__pill').getByText('trade', { exact: true }).click()
      await page.locator('.epx__toggle input').check()
      const trade = await payload()
      assert.deepEqual(Object.keys(trade.context).sort(), ['amount', 'currency', 'fee_amount', 'fee_currency', 'ip_address', 'product_type', 'transaction_id'])
      assert.equal(trade.context.product_type, 'futures')
      assert.equal(typeof trade.context.amount, 'number')
      assert.equal(trade.context.fee_currency, 'USDT')
      await page.locator('.epx__actions button').first().click()
      assert.deepEqual(JSON.parse(await page.evaluate(() => navigator.clipboard.readText())), trade)

      await page.locator('.epx__toggle input').uncheck()
      await page.locator('.epx__pill').getByText('deposit', { exact: true }).click()
      const cryptoDeposit = await payload()
      assert.equal(cryptoDeposit.context.deposit_type, 'onchain')
      assert.equal(cryptoDeposit.context.network, 'TRC20')
      assert.ok(!('is_crypto' in cryptoDeposit.context))
      await page.goto(`${origin}/${locale}/tracking/s2s/v3/events-igaming`)
      await page.locator('.epx__pill').getByText('deposit', { exact: true }).click()
      const gamingDeposit = await payload()
      assert.equal(typeof gamingDeposit.context.is_crypto, 'boolean')
      assert.ok(!('deposit_type' in gamingDeposit.context))
      assert.deepEqual(errors, [])
    } finally { await context.close() }
  })
}
