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
      themeConfig: { nav: en.nav }
    },
    cn: {
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: { nav: cn.nav }
    },
    hk: {
      label: '繁體中文',
      lang: 'zh-HK',
      themeConfig: { nav: hk.nav }
    }
  },
  themeConfig: {
    search: {
      provider: 'local'
    },
    // SidebarMulti: path-specific sidebars ensure each locale shows only its content
    sidebar: {
      '/en/': en.sidebar,
      '/cn/': cn.sidebar,
      '/hk/': hk.sidebar
    }
  }
})
