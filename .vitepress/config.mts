import { defineConfig } from 'vitepress'
import markdownItKatex from 'markdown-it-katex'
import llmstxtPlugin from 'vitepress-plugin-llmstxt'
import { en } from './config/en'
import { cn } from './config/cn'
import { hk } from './config/hk'

const SITE_URL = process.env.SITE_URL ?? 'https://docs.revosurge.com'

// markdown-it has no task-list support, so `- [ ] item` would render the brackets as text.
// Turn those items into checkboxes and tag the list so style.css can draw it as a checklist.
function taskLists(md) {
  md.core.ruler.after('inline', 'task-lists', (state) => {
    const tokens = state.tokens
    for (let i = 2; i < tokens.length; i++) {
      const inline = tokens[i]
      if (inline.type !== 'inline' || tokens[i - 1].type !== 'paragraph_open' || tokens[i - 2].type !== 'list_item_open') continue
      const first = inline.children?.[0]
      const match = first?.type === 'text' && /^\[([ xX])\]\s+/.exec(first.content)
      if (!match) continue

      first.content = first.content.slice(match[0].length)
      const checkbox = new state.Token('html_inline', '', 0)
      checkbox.content = `<input type="checkbox" class="task-list-checkbox"${match[1] === ' ' ? '' : ' checked'}>`
      inline.children.unshift(checkbox)

      const item = tokens[i - 2]
      item.attrJoin('class', 'task-list-item')
      for (let j = i - 3; j >= 0; j--) {
        if (tokens[j].type === 'bullet_list_open' && tokens[j].level === item.level - 1) {
          if (!tokens[j].attrGet('class')?.includes('task-list')) tokens[j].attrJoin('class', 'task-list')
          break
        }
      }
    }
  })
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'RevoSurge Docs',
  description: 'Documentation for the RevoSurge platform',
  cleanUrls: true,
  // Internal specs and plans under docs/ are working documents, not published pages.
  srcExclude: ['docs/**'],
  transformPageData(pageData, { siteConfig }) {
    const path = pageData.relativePath.replace(/\.md$/, '').replace(/\/index$/, '')
    const isRootIndex = !path

    // Root / redirects to /en/ — use same metadata as English index
    const defaultDesc = siteConfig.description ?? 'Documentation for the RevoSurge platform'
    const effectiveDesc = isRootIndex
      ? 'RevoSurge docs. Performance campaigns, first-party tracking, account, API.'
      : pageData.description && pageData.description !== defaultDesc
        ? pageData.description
        : pageData.title
          ? `${pageData.title} — RevoSurge documentation`
          : defaultDesc

    const canonicalUrl = isRootIndex ? `${SITE_URL}/en` : path ? `${SITE_URL}/${path}` : SITE_URL

    pageData.frontmatter.head ??= []
    const head = pageData.frontmatter.head as [string, Record<string, string>][]

    // Index pages: og/en/index.png, og/cn/index.png, og/hk/index.png
    const isLocaleIndex = ['en', 'cn', 'hk'].includes(path)
    const ogImagePath = isRootIndex ? 'og/en/index.png' : path ? (isLocaleIndex ? `og/${path}/index.png` : `og/${path}.png`) : 'og/en/index.png'
    const ogImageUrl = `${SITE_URL}/${ogImagePath}`

    const ogTitle = isRootIndex ? 'RevoSurge Platform Docs' : (pageData.title ?? siteConfig.title)

    head.push(['meta', { property: 'og:type', content: 'website' }])
    head.push(['meta', { property: 'og:title', content: ogTitle }])
    head.push(['meta', { property: 'og:description', content: effectiveDesc }])
    head.push(['meta', { property: 'og:url', content: canonicalUrl }])
    head.push(['meta', { property: 'og:image', content: ogImageUrl }])
    head.push(['meta', { name: 'twitter:card', content: 'summary_large_image' }])
    head.push(['meta', { name: 'twitter:image', content: ogImageUrl }])
    head.push(['meta', { name: 'twitter:title', content: ogTitle }])
    head.push(['meta', { name: 'twitter:description', content: effectiveDesc }])
    head.push(['link', { rel: 'canonical', href: canonicalUrl }])
  },
  markdown: {
    config: (md) => {
      md.use(markdownItKatex)
      md.use(taskLists)
    }
  },
  head: [
    ['link', { rel: 'icon', href: '/icon-192.png', type: 'image/png', sizes: '192x192' }],
    ['link', { rel: 'icon', href: '/icon-512.png', type: 'image/png', sizes: '512x512' }],
    ['link', { rel: 'apple-touch-icon', href: '/icon-192.png', sizes: '192x192' }],
    ['link', { rel: 'manifest', href: '/manifest.webmanifest' }],
    ['meta', { name: 'theme-color', content: '#1c7ae9' }]
  ],
  vite: {
    plugins: [
      llmstxtPlugin({
        hostname: 'https://docs.revosurge.com',
        ignore: ['**/cn/**', '**/hk/**', '**/docs/**'],
        llmsFile: { indexTOC: 'only-llms' },
        llmsFullFile: true,
        mdFiles: false,
        transform: ({ page }) => {
          if (page.path === '/llms.txt') {
            page.content =
              '# RevoSurge Documentation\n\n' +
              '> Documentation for the RevoSurge platform: performance campaigns, first-party tracking, audience segmentation, and API integration.\n\n' +
              page.content
          }
          return page
        },
      }),
    ],
  },
  locales: {
    en: {
      label: 'English',
      lang: 'en',
      title: 'RevoSurge Docs',
      themeConfig: {
        nav: en.nav,
        docFooter: { prev: 'Previous page', next: 'Next page' }
      }
    },
    cn: {
      label: '简体中文',
      lang: 'zh-CN',
      title: 'RevoSurge 文档',
      themeConfig: {
        nav: cn.nav,
        docFooter: { prev: '上一页', next: '下一页' }
      }
    },
    hk: {
      label: '繁體中文',
      lang: 'zh-HK',
      title: 'RevoSurge 文檔',
      themeConfig: {
        nav: hk.nav,
        docFooter: { prev: '上一頁', next: '下一頁' }
      }
    }
  },
  themeConfig: {
    logo: '/icon-192.png',
    search: {
      provider: 'local'
    },
    outline: { level: [2, 3] },
    // SidebarMulti: path-specific sidebars ensure each locale shows only its content
    sidebar: {
      '/en/': en.sidebar,
      '/cn/': cn.sidebar,
      '/hk/': hk.sidebar
    }
  }
})
