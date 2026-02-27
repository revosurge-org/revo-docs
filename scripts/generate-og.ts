/**
 * Generate Open Graph images at build time.
 * Run manually: npm run generate:og
 *
 * Output: public/og/{locale}/{path}.png
 * Layout: Logo top-left, title below, description at bottom.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import React from 'react'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import matter from 'gray-matter'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const OUT_DIR = path.join(ROOT, 'public', 'og')

const OG_WIDTH = 1200
const OG_HEIGHT = 630

// Truncate text to fit (rough char limits for 1200px width)
function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str
  return str.slice(0, maxLen - 3) + '…'
}

type FontConfig = { name: string; data: ArrayBuffer[] }

async function loadFonts(): Promise<Record<string, FontConfig>> {
  const fontNames: Record<string, string> = {
    en: 'Inter',
    cn: 'Noto Sans SC',
    hk: 'Noto Sans TC',
  }

  // English: single Inter file
  const interPath = path.join(ROOT, 'node_modules/@fontsource/inter/files/inter-latin-400-normal.woff')
  const interData = await fs.promises.readFile(interPath)
  const fonts: Record<string, FontConfig> = {
    en: { name: fontNames.en, data: [interData.buffer] },
  }

  // CJK: use chinese-simplified / chinese-traditional single-file subsets (full CJK coverage)
  const cjkFiles: Record<string, string> = {
    cn: 'noto-sans-sc-chinese-simplified-400-normal.woff',
    hk: 'noto-sans-tc-chinese-traditional-400-normal.woff',
  }
  for (const [locale, pkg] of [
    ['cn', '@fontsource/noto-sans-sc'] as const,
    ['hk', '@fontsource/noto-sans-tc'] as const,
  ]) {
    const filePath = path.join(ROOT, 'node_modules', pkg, 'files', cjkFiles[locale])
    if (!fs.existsSync(filePath)) {
      throw new Error(`CJK font not found: ${filePath}`)
    }
    const buf = await fs.promises.readFile(filePath)
    const arr = new Uint8Array(buf.length)
    arr.set(buf)
    fonts[locale] = { name: fontNames[locale], data: [arr.buffer] }
  }

  return fonts
}

function loadLogoDataUrl(): string | null {
  const candidates = ['og-logo.png', 'logo.png', 'favicon.ico']
  for (const name of candidates) {
    const p = path.join(ROOT, 'public', name)
    if (fs.existsSync(p)) {
      const buf = fs.readFileSync(p)
      const mime = name.endsWith('.ico') ? 'image/x-icon' : 'image/png'
      return `data:${mime};base64,${buf.toString('base64')}`
    }
  }
  return null
}

interface PageMeta {
  locale: string
  relativePath: string
  title: string
  description: string
}

function collectPages(): PageMeta[] {
  const locales = ['en', 'cn', 'hk']
  const defaultDesc = 'Documentation for the RevoSurge platform'
  const pages: PageMeta[] = []

  for (const locale of locales) {
    const localeDir = path.join(ROOT, locale)
    if (!fs.existsSync(localeDir)) continue

    const walk = (dir: string, base = '') => {
      const entries = fs.readdirSync(dir, { withFileTypes: true })
      for (const e of entries) {
        const rel = path.join(base, e.name)
        const full = path.join(dir, e.name)
        if (e.isDirectory()) {
          walk(full, rel)
        } else if (e.name.endsWith('.md') && e.name !== 'README.md') {
          const content = fs.readFileSync(full, 'utf-8')
          const { data } = matter(content)
          const title = data.title ?? data.sidebar_label ?? e.name.replace('.md', '')
          let description =
            data.description ?? (title ? `${title} — RevoSurge documentation` : defaultDesc)
          if (description === defaultDesc && title) {
            description = `${title} — RevoSurge documentation`
          }
          const relativePath = rel.replace(/\.md$/, '').replace(/\/index$/, '')
          pages.push({ locale, relativePath, title, description })
        }
      }
    }
    walk(localeDir, '')
  }

  return pages
}

async function generateImage(
  page: PageMeta,
  font: FontConfig,
  logoDataUrl: string | null
): Promise<Buffer> {
  const title = truncate(page.title, 60)
  const description = truncate(page.description, 120)
  const fontFamily = font.name

  const logoImg = logoDataUrl
    ? React.createElement('img', {
        src: logoDataUrl,
        width: 48,
        height: 48,
        style: { borderRadius: 8, marginRight: 12 },
      })
    : null

  const brandEl = React.createElement(
    'div',
    {
      style: {
        display: 'flex',
        alignItems: 'center',
      },
    },
    logoImg,
    React.createElement(
      'span',
      {
        style: {
          fontSize: 24,
          fontWeight: 700,
          color: '#0f172a',
          fontFamily,
        },
      },
      'RevoSurge'
    )
  )

  const el = React.createElement(
    'div',
    {
      style: {
        display: 'flex',
        flexDirection: 'column',
        width: OG_WIDTH,
        height: OG_HEIGHT,
        padding: 56,
        backgroundImage: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 35%, #7dd3fc 65%, #38bdf8 100%)',
        fontFamily,
      },
    },
    React.createElement(
      'h1',
      {
        style: {
          fontSize: 80,
          fontWeight: 700,
          color: '#0f172a',
          margin: 0,
          marginBottom: 20,
          lineHeight: 1.2,
        },
      },
      title
    ),
    React.createElement(
      'p',
      {
        style: {
          fontSize: 50,
          color: '#1e3a5f',
          margin: 0,
          lineHeight: 1.4,
        },
      },
      description
    ),
    React.createElement('div', { style: { flex: 1 } }),
    brandEl
  )

  const svg = await satori(el, {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts: font.data.map((data) => ({
      name: fontFamily,
      data,
      weight: 400,
      style: 'normal' as const,
    })),
  })

  const resvg = new Resvg(svg)
  const png = resvg.render()
  return Buffer.from(png.asPng())
}

async function main() {
  console.log('Generating OG images...')
  const fonts = await loadFonts()
  const logoDataUrl = loadLogoDataUrl()
  if (!logoDataUrl) {
    console.log('No logo found (public/og-logo.png or public/logo.png). Using text fallback.')
  }

  const pages = collectPages()
  console.log(`Found ${pages.length} pages`)

  let ok = 0
  let err = 0
  for (const page of pages) {
    const outPath = path.join(OUT_DIR, page.locale, `${page.relativePath}.png`)
    const outDir = path.dirname(outPath)
    fs.mkdirSync(outDir, { recursive: true })
    const font = fonts[page.locale] ?? fonts.en
    try {
      const png = await generateImage(page, font, logoDataUrl)
      fs.writeFileSync(outPath, png)
      ok++
      if (ok <= 3 || ok % 20 === 0) {
        console.log(`  ${page.locale}/${page.relativePath}.png`)
      }
    } catch (e) {
      err++
      console.error(`  FAIL ${page.locale}/${page.relativePath}:`, e)
    }
  }

  console.log(`Done. ${ok} generated, ${err} failed.`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
