import { defineConfig } from 'vitepress'
import markdownItKatex from 'markdown-it-katex'

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
  themeConfig: {
    nav: [
      { text: 'Install', link: '/tracking/web-tracker/install' },
      { text: 'Reference', link: '/tracking/web-tracker/reference' }
    ],
    sidebar: [
      {
        text: 'RevoSurge',
        link: '/revosurge/welcome',
        collapsed: false,
        items: [
          { text: 'Welcome to RevoSurge', link: '/revosurge/welcome' },
        ]
      },
      {
        text: 'Growth',
        link: '/growth/getting-started',
        collapsed: false,
        items: [
          { text: 'Getting started', link: '/growth/getting-started' },
          { text: 'Creating your account', link: '/growth/account' },
          { text: 'Funding & wallet', link: '/growth/funding-wallet' }
        ]
      },
      {
        text: 'Tracking',
        link: '/tracking/overview',
        collapsed: false,
        items: [
          { text: 'Overview', link: '/tracking/overview' },
          {
            text: 'Web Tracker',
            link: '/tracking/web-tracker',
            items: [
              { text: 'Install the Web Tracker', link: '/tracking/web-tracker/install' },
              { text: 'Web Tracker SDK Reference', link: '/tracking/web-tracker/reference' }
            ]
          },
          {
            text: 'Server-to-server (S2S)',
            link: '/tracking/s2s/overview',
            items: [
              { text: 'Overview', link: '/tracking/s2s/overview' },
              { text: 'Server Events API', link: '/tracking/s2s/server-events-api' }
            ]
          },
        ]
      },
      {
        text: 'AdWave',
        link: '/adwave/guided-campaign-setup',
        collapsed: false,
        items: [
          { text: 'Guided Campaign Setup', link: '/adwave/guided-campaign-setup' }
        ]
      },
      {
        text: 'Audience',
        link: '/audience/segments',
        collapsed: false,
        items: [
          { text: 'Segments', link: '/audience/segments' },
          { text: 'Segment Details', link: '/audience/segment-details' },
          { text: 'Create Audience Segment', link: '/audience/create-audience-segment' }
        ]
      },
      {
        text: 'API',
        link: '/api/quickstart',
        collapsed: false,
        items: [
          { text: 'API Quickstart', link: '/api/quickstart' },
          { text: 'API Key', link: '/api/api-key' }
        ]
      }
    ],
    search: {
      provider: 'local'
    }
  }
})
