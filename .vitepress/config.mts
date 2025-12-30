import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'RevoSurge Web Tracker',
  description: 'Integration guide for the RevoSurge Web Tracker SDK',
  cleanUrls: true,
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
          { text: 'Methods', link: '/methods' }
        ]
      }
    ],
    search: {
      provider: 'local'
    }
  }
})
