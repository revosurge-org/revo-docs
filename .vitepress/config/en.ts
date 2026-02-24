import type { DefaultTheme } from 'vitepress'

export const en: DefaultTheme.Config = {
  nav: [
    { text: 'Install', link: '/en/tracking/web-tracker/install' },
    { text: 'Reference', link: '/en/tracking/web-tracker/reference' }
  ],
  sidebar: [
    {
      text: 'RevoSurge',
      link: '/en/revosurge/welcome',
      collapsed: false,
      items: [
        { text: 'Welcome to RevoSurge', link: '/en/revosurge/welcome' },
      ]
    },
    {
      text: 'Growth',
      link: '/en/growth/getting-started',
      collapsed: false,
      items: [
        { text: 'Getting started', link: '/en/growth/getting-started' },
        { text: 'Creating your account', link: '/en/growth/account' },
        { text: 'Funding & wallet', link: '/en/growth/funding-wallet' }
      ]
    },
    {
      text: 'Tracking',
      link: '/en/tracking/overview',
      collapsed: false,
      items: [
        { text: 'Overview', link: '/en/tracking/overview' },
        {
          text: 'Web Tracker',
          link: '/en/tracking/web-tracker',
          items: [
            { text: 'Install the Web Tracker', link: '/en/tracking/web-tracker/install' },
            { text: 'Web Tracker SDK Reference', link: '/en/tracking/web-tracker/reference' }
          ]
        },
        {
          text: 'Server-to-server (S2S)',
          link: '/en/tracking/s2s/overview',
          items: [
            { text: 'Overview', link: '/en/tracking/s2s/overview' },
            { text: 'Server Events API', link: '/en/tracking/s2s/server-events-api' }
          ]
        },
      ]
    },
    {
      text: 'AdWave',
      link: '/en/adwave/guided-campaign-setup',
      collapsed: false,
      items: [
        { text: 'Guided Campaign Setup', link: '/en/adwave/guided-campaign-setup' }
      ]
    },
    {
      text: 'Audience',
      link: '/en/audience/segments',
      collapsed: false,
      items: [
        { text: 'Segments', link: '/en/audience/segments' },
        { text: 'Segment Details', link: '/en/audience/segment-details' },
        { text: 'Create Audience Segment', link: '/en/audience/create-audience-segment' }
      ]
    },
    {
      text: 'API',
      link: '/en/api/quickstart',
      collapsed: false,
      items: [
        { text: 'API Quickstart', link: '/en/api/quickstart' },
        { text: 'API Key', link: '/en/api/api-key' }
      ]
    }
  ],
}
