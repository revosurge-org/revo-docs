import type { DefaultTheme } from 'vitepress'

export const hk: DefaultTheme.Config = {
  nav: [
    { text: '安裝', link: '/hk/tracking/web-tracker/install' },
    { text: '參考', link: '/hk/tracking/web-tracker/reference' }
  ],
  sidebar: [
    {
      text: 'RevoSurge',
      link: '/hk/revosurge/welcome',
      collapsed: false,
      items: [
        { text: '歡迎使用 RevoSurge', link: '/hk/revosurge/welcome' },
      ]
    },
    {
      text: '增長',
      link: '/hk/growth/getting-started',
      collapsed: false,
      items: [
        { text: '入門指南', link: '/hk/growth/getting-started' },
        { text: '建立帳戶', link: '/hk/growth/account' },
        { text: '充值與錢包', link: '/hk/growth/funding-wallet' }
      ]
    },
    {
      text: '追蹤',
      link: '/hk/tracking/overview',
      collapsed: false,
      items: [
        { text: '概述', link: '/hk/tracking/overview' },
        {
          text: 'Web 追蹤器',
          link: '/hk/tracking/web-tracker',
          items: [
            { text: '安裝 Web 追蹤器', link: '/hk/tracking/web-tracker/install' },
            { text: 'Web 追蹤器 SDK 參考', link: '/hk/tracking/web-tracker/reference' }
          ]
        },
        {
          text: '伺服器到伺服器 (S2S)',
          link: '/hk/tracking/s2s/overview',
          items: [
            { text: '概述', link: '/hk/tracking/s2s/overview' },
            { text: '伺服器事件 API', link: '/hk/tracking/s2s/server-events-api' }
          ]
        },
      ]
    },
    {
      text: 'AdWave',
      link: '/hk/adwave/guided-campaign-setup',
      collapsed: false,
      items: [
        { text: '引導式廣告系列設定', link: '/hk/adwave/guided-campaign-setup' }
      ]
    },
    {
      text: 'AdFlow',
      link: '/hk/adflow/integration-guide',
      collapsed: false,
      items: [
        { text: '接入指南', link: '/hk/adflow/integration-guide' },
        { text: 'adflow.js 調試器', link: '/hk/adflow/adflowjs-debugger' },
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
      text: 'API',
      link: '/hk/api/quickstart',
      collapsed: false,
      items: [
        { text: 'API 快速入門', link: '/hk/api/quickstart' },
        { text: 'API 金鑰', link: '/hk/api/api-key' }
      ]
    }
  ],
}
