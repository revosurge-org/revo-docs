import { defineConfig } from 'vitepress'
import markdownItKatex from 'markdown-it-katex'
import { en } from './config/en'
import { cn } from './config/cn'
import { hk } from './config/hk'

const SITE_URL = process.env.SITE_URL ?? 'https://docs.revosurge.com'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'RevoSurge Docs',
  description: 'Documentation for the RevoSurge platform',
  cleanUrls: true,
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
    }
  },
  head: [
    ['link', { rel: 'icon', href: '/og-logo.png', type: 'image/png' }]
  ],
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
    logo: '/og-logo.png',
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
