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
        {
          text: '2. Connect tracking',
          link: '/en/tracking/overview',
          collapsed: true,
          items: [
            { text: 'Overview', link: '/en/tracking/overview' },
            { text: 'Core concepts', link: '/en/tracking/core-concepts' },
            {
              text: '1. Web Tracker',
              link: '/en/tracking/web-tracker',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/en/tracking/web-tracker' },
                { text: 'Install & test', link: '/en/tracking/web-tracker/install' },
                { text: 'SDK reference', link: '/en/tracking/web-tracker/reference' }
              ]
            },
            {
              text: '2. AppsFlyer (App MMP)',
              link: '/en/mmp/appsflyer/overview',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/en/mmp/appsflyer/overview' },
                { text: 'Set up & verify', link: '/en/mmp/appsflyer/setup-appsflyer' },
                { text: 'Parameters & reporting', link: '/en/mmp/appsflyer/parameters-reporting' }
              ]
            },
            {
              text: '3. S2S Server Events',
              link: '/en/tracking/s2s/overview',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/en/tracking/s2s/overview' },
                { text: 'Set up & test', link: '/en/tracking/s2s/setup-s2s' },
                { text: 'API reference (v3)', link: '/en/tracking/s2s/v3/server-events-api' },
                { text: 'Integration validation', link: '/en/tracking/s2s/validation' }
              ]
            },
            {
              text: '4. Partner Postback',
              link: '/en/tracking/postback/overview',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/en/tracking/postback/overview' },
                { text: 'Set up & test', link: '/en/tracking/postback/setup-postback' },
                { text: 'API reference (v2)', link: '/en/tracking/postback/v2-api' },
                { text: 'API reference (v1)', link: '/en/tracking/postback/v1-api' },
                { text: 'Integration validation', link: '/en/tracking/postback/validation' }
              ]
            },
            {
              text: 'Events & fields',
              link: '/en/tracking/events/choose-events',
              collapsed: true,
              items: [
                { text: 'Choose your events', link: '/en/tracking/events/choose-events' },
                { text: 'Common fields & identity', link: '/en/tracking/events/common-fields' },
                { text: 'Standard events', link: '/en/tracking/events/events-standard' },
                { text: 'iGaming events', link: '/en/tracking/events/events-igaming' },
                { text: 'Crypto events', link: '/en/tracking/events/events-crypto' },
                { text: 'Event availability & validation', link: '/en/tracking/events/catalog-validation' }
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
        { text: 'Installation Check Troubleshooting', link: '/en/adflow/install-check-qa' },
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
