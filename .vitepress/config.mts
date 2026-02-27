import { defineConfig } from 'vitepress'
import markdownItKatex from 'markdown-it-katex'
import { en } from './config/en'
import { cn } from './config/cn'
import { hk } from './config/hk'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'RevoSurge Docs',
  description: 'Documentation for the RevoSurge platform',
  cleanUrls: true,
  markdown: {
    config: (md) => {
      md.use(markdownItKatex)
    }
  },
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
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
