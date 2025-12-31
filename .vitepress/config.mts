import { defineConfig } from 'vitepress'
import markdownItKatex from 'markdown-it-katex'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'RevoSurge Web Tracker',
  description: 'Integration guide for the RevoSurge Web Tracker SDK',
  cleanUrls: true,
  markdown: {
    config: (md) => {
      md.use(markdownItKatex)
    }
  },
  themeConfig: {
    nav: [
      { text: 'Install', link: '/install' },
      { text: 'Methods', link: '/methods' }
    ],
    sidebar: [
      {
        text: 'Integration Guide',
        items: [
          { text: 'Install', link: '/install' },
          { text: 'Methods', link: '/methods' },
          { text: 'RevoSurge', link: '/revosurge' }
        ]
      }
    ],
    search: {
      provider: 'local'
    }
  }
})
