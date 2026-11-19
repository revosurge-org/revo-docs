import assert from 'node:assert/strict'
import { readdirSync } from 'node:fs'
import { test } from 'node:test'

function markdownPages(locale) {
  return readdirSync(new URL(`../${locale}/`, import.meta.url), { recursive: true })
    .filter(name => name.endsWith('.md'))
    .sort()
}

test('Every documentation route is available in English, Simplified Chinese, and Traditional Chinese', () => {
  const english = markdownPages('en')
  assert.ok(english.length > 0)
  for (const locale of ['cn', 'hk']) {
    assert.deepEqual(markdownPages(locale), english, `Route mismatch for ${locale}`)
  }
})
