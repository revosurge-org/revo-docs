import type { DefaultTheme } from 'vitepress'

export const hk: DefaultTheme.Config = {
  nav: [
    { text: '安裝', link: '/hk/tracking/web-tracker/install' },
    { text: '參考', link: '/hk/tracking/web-tracker/reference' }
  ],
  sidebar: [
    // A single page at L1. The empty items array renders it as a top-level entry, not inside an unnamed group.
    { text: '歡迎使用 RevoSurge', link: '/hk/revosurge/welcome', items: [] },
    {
      text: '新手投放手冊',
      link: '/hk/handbook/',
      docFooterText: '由這裡開始：上線你的第一個廣告系列',
      collapsed: false,
      items: [
        { text: '由這裡開始：上線你的第一個廣告系列', link: '/hk/handbook/' },
        { text: '1. 帳戶與錢包', link: '/hk/handbook/account-and-wallet' },
        // Step 2 is the Tracking section, nested here unchanged. Its pages keep their /tracking and /mmp URLs.
        {
          text: '2. 接入追蹤',
          link: '/hk/tracking/overview',
          collapsed: true,
          items: [
            { text: '概述 · 我該用哪個？', link: '/hk/tracking/overview' },
            { text: '核心概念', link: '/hk/tracking/core-concepts' },
            {
              text: '1. Web 追蹤器',
              link: '/hk/tracking/web-tracker',
              collapsed: true,
              items: [
                { text: '安裝', link: '/hk/tracking/web-tracker/install' },
                { text: 'Web 追蹤器 SDK 參考', link: '/hk/tracking/web-tracker/reference' }
              ]
            },
            {
              text: '2. AppsFlyer（App MMP）',
              link: '/hk/mmp/appsflyer/overview',
              collapsed: true,
              items: [
                { text: '概述', link: '/hk/mmp/appsflyer/overview' },
                { text: '設定 postback', link: '/hk/mmp/appsflyer/postbacks' },
                { text: '點擊轉發', link: '/hk/mmp/appsflyer/click-forwarding' },
                { text: '宏參數', link: '/hk/mmp/appsflyer/macros' },
                { text: '合作夥伴權限', link: '/hk/mmp/appsflyer/permissions' },
                { text: '整合驗證', link: '/hk/mmp/appsflyer/validation' },
                { text: '交付與上線', link: '/hk/mmp/appsflyer/handoff' }
              ]
            },
            {
              text: '3. S2S 伺服器事件',
              link: '/hk/tracking/s2s/overview',
              collapsed: true,
              items: [
                { text: '概述', link: '/hk/tracking/s2s/overview' },
                {
                  text: '伺服器事件 API (v3)',
                  link: '/hk/tracking/s2s/v3/server-events-api',
                  items: [
                    { text: 'API 參考', link: '/hk/tracking/s2s/v3/server-events-api' },
                    { text: '信封與基礎屬性', link: '/hk/tracking/s2s/v3/mandatory-properties' },
                    { text: '目錄與驗證', link: '/hk/tracking/s2s/v3/catalog-governance' },
                    { text: '標準事件', link: '/hk/tracking/s2s/v3/events-standard' },
                    { text: 'iGaming 事件', link: '/hk/tracking/s2s/v3/events-igaming' },
                    { text: '從 v2 遷移', link: '/hk/tracking/s2s/v3/migration' }
                  ]
                },
                { text: '整合驗證', link: '/hk/tracking/s2s/validation' },
                { text: '交付與上線', link: '/hk/tracking/s2s/handoff' },
                { text: '伺服器事件 API (v2，已棄用)', link: '/hk/tracking/s2s/server-events-api' }
              ]
            },
            {
              text: '4. Partner Postback',
              link: '/hk/tracking/postback/partner-postback',
              collapsed: true,
              items: [
                { text: '合作夥伴 Postback API', link: '/hk/tracking/postback/partner-postback' },
                { text: '整合驗證', link: '/hk/tracking/postback/validation' },
                { text: '交付與上線', link: '/hk/tracking/postback/handoff' }
              ]
            }
          ]
        },
        { text: '3. 落地頁與轉化路徑', link: '/hk/handbook/landing-page' },
        {
          text: '4. 素材',
          link: '/hk/handbook/creatives',
          collapsed: true,
          items: [{ text: '素材要求與範例', link: '/hk/handbook/creative-requirements' }]
        },
        { text: '5. 建立廣告系列', link: '/hk/handbook/create-campaign' },
        { text: '6. 投放第一週', link: '/hk/handbook/first-week' },
        { text: '7. 優化與放量', link: '/hk/handbook/optimise-and-scale' },
        { text: '常見問題', link: '/hk/handbook/faq' }
      ]
    },
    {
      text: 'AdFlow',
      link: '/hk/adflow/integration-guide',
      collapsed: false,
      items: [
        { text: '接入指南', link: '/hk/adflow/integration-guide' },
        { text: 'Banner 調試器', link: '/hk/adflow/banner-debugger' },
        { text: 'Pop 調試器', link: '/hk/adflow/pop-debugger' },
        { text: 'Push 調試器', link: '/hk/adflow/push-debugger' },
        { text: 'In-page Push 調試器', link: '/hk/adflow/inpage-push-debugger' },
        { text: 'Native 調試器', link: '/hk/adflow/native-debugger' },
        { text: 'S2S 調試器', link: '/hk/adflow/s2s-debugger' },
      ]
    },
    {
      text: '受眾',
      link: '/hk/audience/segments',
      collapsed: false,
      items: [
        { text: '受眾細分', link: '/hk/audience/segments' },
        { text: '細分詳情', link: '/hk/audience/segment-details' },
        { text: '建立受眾細分', link: '/hk/audience/create-audience-segment' }
      ]
    },
    {
      text: '供應端（SSP 接入）',
      link: '/hk/supply/overview',
      collapsed: false,
      items: [
        { text: '概述', link: '/hk/supply/overview' },
        { text: '快速開始', link: '/hk/supply/getting-started' },
        { text: '競價接口參考', link: '/hk/supply/bid-endpoint' },
        { text: '通知回調', link: '/hk/supply/notifications' },
      ]
    },
    {
      text: 'API',
      link: '/hk/api/quickstart',
      collapsed: false,
      items: [
        { text: 'API 快速入門', link: '/hk/api/quickstart' },
        { text: 'API 金鑰', link: '/hk/api/api-key' }
      ]
    },
    {
      text: '參考數據',
      link: '/hk/reference-data/exchange-rates',
      collapsed: false,
      items: [
        { text: '匯率參考', link: '/hk/reference-data/exchange-rates' }
      ]
    },
    {
      text: 'LLM 資源',
      link: '/llms.txt',
      collapsed: false,
      items: [
        { text: 'llms.txt', link: '/llms.txt', target: '_blank', rel: 'noopener noreferrer' },
        { text: 'llms-full.txt', link: '/llms-full.txt', target: '_blank', rel: 'noopener noreferrer' }
      ]
    }
  ],
}
