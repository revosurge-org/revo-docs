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
        {
          text: '2. 接入追蹤',
          link: '/hk/tracking/overview',
          collapsed: true,
          items: [
            { text: '概述', link: '/hk/tracking/overview' },
            { text: '核心概念', link: '/hk/tracking/core-concepts' },
            {
              text: '1. Web 追蹤器',
              link: '/hk/tracking/web-tracker',
              collapsed: true,
              items: [
                { text: '概述', link: '/hk/tracking/web-tracker' },
                { text: '安裝與測試', link: '/hk/tracking/web-tracker/install' },
                { text: 'SDK 參考', link: '/hk/tracking/web-tracker/reference' }
              ]
            },
            {
              text: '2. AppsFlyer（App MMP）',
              link: '/hk/mmp/appsflyer/overview',
              collapsed: true,
              items: [
                { text: '概述', link: '/hk/mmp/appsflyer/overview' },
                { text: '設定與驗證', link: '/hk/mmp/appsflyer/setup-appsflyer' },
                { text: '參數與報表', link: '/hk/mmp/appsflyer/parameters-reporting' }
              ]
            },
            {
              text: '3. S2S 伺服器事件',
              link: '/hk/tracking/s2s/overview',
              collapsed: true,
              items: [
                { text: '概述', link: '/hk/tracking/s2s/overview' },
                { text: '設定與測試', link: '/hk/tracking/s2s/setup-s2s' },
                { text: 'API 參考（v3）', link: '/hk/tracking/s2s/v3/server-events-api' },
                { text: '整合驗證', link: '/hk/tracking/s2s/validation' }
              ]
            },
            {
              text: '4. Partner Postback',
              link: '/hk/tracking/postback/overview',
              collapsed: true,
              items: [
                { text: '概述', link: '/hk/tracking/postback/overview' },
                { text: '設定與測試', link: '/hk/tracking/postback/setup-postback' },
                { text: 'API 參考（v2）', link: '/hk/tracking/postback/v2-api' },
                { text: 'API 參考（v1）', link: '/hk/tracking/postback/v1-api' },
                { text: '整合驗證', link: '/hk/tracking/postback/validation' }
              ]
            },
            {
              text: '事件與欄位',
              link: '/hk/tracking/events/choose-events',
              collapsed: true,
              items: [
                { text: '選擇事件', link: '/hk/tracking/events/choose-events' },
                { text: '通用欄位與身份', link: '/hk/tracking/events/common-fields' },
                { text: '標準事件', link: '/hk/tracking/events/events-standard' },
                { text: 'iGaming 事件', link: '/hk/tracking/events/events-igaming' },
                { text: 'Crypto 事件', link: '/hk/tracking/events/events-crypto' },
                { text: '事件可用性與驗證', link: '/hk/tracking/events/catalog-validation' }
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
      link: '/hk/adflow/',
      collapsed: false,
      items: [
        { text: '從這裡開始：上線你的第一個廣告版位', link: '/hk/adflow/' },
        {
          text: '1. 建立帳號、網站和廣告版位', link: '/hk/adflow/create-placement',
          collapsed: true,
          items: [
            { text: '廣告格式與尺寸', link: '/hk/adflow/ad-formats' }
          ]
        },
        {
          text: '2. 選擇接入方式', link: '/hk/adflow/choose-integration',
          collapsed: true,
          items: [
            { text: '網站直接安裝 AdFlow JS Tag', link: '/hk/adflow/adflow-sdk' },
            { text: '自有 GAM + Prebid.js', link: '/hk/adflow/gam-prebid' },
            { text: '自有 GAM + AdFlow JS Tag（無 Prebid.js）', link: '/hk/adflow/gam-adflow-sdk' },
            { text: '網站透過 Prebid.js 接入 AdFlow S2S', link: '/hk/adflow/s2s-integration' }
          ]
        },
        { text: '3. 驗證接入與上線', link: '/hk/adflow/verify-and-launch' },
        {
          text: '4. 查看報表與收益', link: '/hk/adflow/reporting',
          collapsed: true,
          items: [
            { text: '查看廣告版位資料與報表', link: '/hk/adflow/reports' },
            { text: '查看帳單、更新收款資料與每月對帳', link: '/hk/adflow/billing' }
          ]
        },
        {
          text: '常見問題與排查', link: '/hk/adflow/troubleshooting',
          collapsed: true,
          items: [
            { text: '安裝檢查失敗', link: '/hk/adflow/install-check-qa' },
            { text: '有請求，但沒有廣告顯示', link: '/hk/adflow/no-ad-display' },
            { text: '報表沒有資料或數字不一致', link: '/hk/adflow/report-data-issues' }
          ]
        },
        {
          text: '偵錯工具', link: '/hk/adflow/debuggers',
          collapsed: true,
          items: [
            { text: 'Banner 偵錯工具', link: '/hk/adflow/banner-debugger' },
            { text: 'Pop 偵錯工具', link: '/hk/adflow/pop-debugger' },
            { text: 'Push 偵錯工具', link: '/hk/adflow/push-debugger' },
            { text: 'In-page Push 偵錯工具', link: '/hk/adflow/inpage-push-debugger' },
            { text: 'Native 偵錯工具', link: '/hk/adflow/native-debugger' },
            { text: 'S2S 偵錯工具', link: '/hk/adflow/s2s-debugger' }
          ]
        }
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
