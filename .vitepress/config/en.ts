import type { DefaultTheme } from 'vitepress'

export const en: DefaultTheme.Config = {
  nav: [
    { text: 'Install', link: '/en/tracking/web-tracker/install' },
    { text: 'Reference', link: '/en/tracking/web-tracker/reference' }
  ],
  sidebar: [
    // A single page at L1. The empty items array renders it as a top-level entry, not inside an unnamed group.
    { text: 'Welcome to RevoSurge', link: '/en/revosurge/welcome', items: [] },
    {
      text: 'AdWave Advertiser Handbook',
      link: '/en/handbook/',
      docFooterText: 'Start here: launch your first campaign',
      collapsed: false,
      items: [
        { text: 'Start here: launch your first campaign', link: '/en/handbook/' },
        { text: '1. Account and wallet', link: '/en/handbook/account-and-wallet' },
        // Step 2 is the Tracking section, nested here unchanged. Its pages keep their /tracking and /mmp URLs.
        {
          text: '2. Connect tracking',
          link: '/en/tracking/overview',
          collapsed: true,
          items: [
            { text: 'Overview · Which one to use?', link: '/en/tracking/overview' },
            { text: 'Core concepts', link: '/en/tracking/core-concepts' },
            {
              text: '1. Web Tracker',
              link: '/en/tracking/web-tracker',
              collapsed: true,
              items: [
                { text: 'Install', link: '/en/tracking/web-tracker/install' },
                { text: 'Web Tracker SDK Reference', link: '/en/tracking/web-tracker/reference' }
              ]
            },
            {
              text: '2. AppsFlyer (App MMP)',
              link: '/en/mmp/appsflyer/overview',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/en/mmp/appsflyer/overview' },
                { text: 'Set up postbacks', link: '/en/mmp/appsflyer/postbacks' },
                { text: 'Click forwarding', link: '/en/mmp/appsflyer/click-forwarding' },
                { text: 'Macros', link: '/en/mmp/appsflyer/macros' },
                { text: 'Partner permissions', link: '/en/mmp/appsflyer/permissions' },
                { text: 'Integration validation', link: '/en/mmp/appsflyer/validation' },
                { text: 'Handoff & go-live', link: '/en/mmp/appsflyer/handoff' }
              ]
            },
            {
              text: '3. S2S Server Events',
              link: '/en/tracking/s2s/overview',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/en/tracking/s2s/overview' },
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
                },
                { text: 'Integration validation', link: '/en/tracking/s2s/validation' },
                { text: 'Handoff & go-live', link: '/en/tracking/s2s/handoff' },
                { text: 'Server Events API (v2, deprecated)', link: '/en/tracking/s2s/server-events-api' }
              ]
            },
            {
              text: '4. Partner Postback',
              link: '/en/tracking/postback/partner-postback',
              collapsed: true,
              items: [
                { text: 'Partner Postback API', link: '/en/tracking/postback/partner-postback' },
                { text: 'Integration validation', link: '/en/tracking/postback/validation' },
                { text: 'Handoff & go-live', link: '/en/tracking/postback/handoff' }
              ]
            }
          ]
        },
        { text: '3. Landing page & conversion path', link: '/en/handbook/landing-page' },
        {
          text: '4. Creatives',
          link: '/en/handbook/creatives',
          collapsed: true,
          items: [{ text: 'Creative Requirements & Examples', link: '/en/handbook/creative-requirements' }]
        },
        { text: '5. Create your campaign', link: '/en/handbook/create-campaign' },
        { text: '6. Your first week', link: '/en/handbook/first-week' },
        { text: '7. Optimise and scale', link: '/en/handbook/optimise-and-scale' },
        { text: 'FAQ', link: '/en/handbook/faq' }
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
