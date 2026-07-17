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
            { text: 'Install', link: '/en/tracking/web-tracker/install' },
            { text: 'Web Tracker SDK Reference', link: '/en/tracking/web-tracker/reference' }
          ]
        },
        {
          text: 'Server-to-server (S2S)',
          link: '/en/tracking/s2s/overview',
          items: [
            { text: 'Overview', link: '/en/tracking/s2s/overview' },
            { text: 'Server Events API (v2)', link: '/en/tracking/s2s/server-events-api' },
            {
              text: 'Server Events API (v3)',
              link: '/en/tracking/s2s/v3/server-events-api',
              items: [
                { text: 'API Reference', link: '/en/tracking/s2s/v3/server-events-api' },
                { text: 'Envelope & base properties', link: '/en/tracking/s2s/v3/mandatory-properties' },
                { text: 'Catalog & validation', link: '/en/tracking/s2s/v3/catalog-governance' },
                { text: 'Standard events', link: '/en/tracking/s2s/v3/events-standard' },
                { text: 'iGaming events', link: '/en/tracking/s2s/v3/events-igaming' },
                { text: 'Migrating from v2', link: '/en/tracking/s2s/v3/migration' }
              ]
            }
          ]
        },
      ]
    },
    {
      text: 'AdWave',
      link: '/en/adwave/campaign-setup',
      collapsed: false,
      items: [
        { text: 'Campaign Setup', link: '/en/adwave/campaign-setup' },
        { text: 'Creative Requirements & Examples', link: '/en/adwave/creative-requirements' }
      ]
    },
    {
      text: 'AdFlow',
      link: '/en/adflow/integration-guide',
      collapsed: false,
      items: [
        { text: 'Integration Guide', link: '/en/adflow/integration-guide' },
        { text: 'Banner Debugger', link: '/en/adflow/banner-debugger' },
        { text: 'Pop Debugger', link: '/en/adflow/pop-debugger' },
        { text: 'Push Debugger', link: '/en/adflow/push-debugger' },
        { text: 'In-page Push Debugger', link: '/en/adflow/inpage-push-debugger' },
        { text: 'Native Debugger', link: '/en/adflow/native-debugger' },
        { text: 'S2S Debugger', link: '/en/adflow/s2s-debugger' },
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
      text: 'Supply (SSP Integration)',
      link: '/en/supply/overview',
      collapsed: false,
      items: [
        { text: 'Overview', link: '/en/supply/overview' },
        { text: 'Getting Started', link: '/en/supply/getting-started' },
        { text: 'Bid Endpoint Reference', link: '/en/supply/bid-endpoint' },
        { text: 'Notifications', link: '/en/supply/notifications' },
        { text: 'Daily Report API', link: '/en/supply/daily-report' },
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
    },
    {
      text: 'Reference Data',
      link: '/en/reference-data/exchange-rates',
      collapsed: false,
      items: [
        { text: 'Exchange Rate Reference', link: '/en/reference-data/exchange-rates' }
      ]
    },
    {
      text: 'LLM Resources',
      link: '/llms.txt',
      collapsed: false,
      items: [
        { text: 'llms.txt', link: '/llms.txt', target: '_blank', rel: 'noopener noreferrer' },
        { text: 'llms-full.txt', link: '/llms-full.txt', target: '_blank', rel: 'noopener noreferrer' }
      ]
    }
  ],
}
