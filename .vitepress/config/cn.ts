import type { DefaultTheme } from 'vitepress'

export const cn: DefaultTheme.Config = {
  nav: [
    { text: '安装', link: '/cn/tracking/web-tracker/install' },
    { text: '参考', link: '/cn/tracking/web-tracker/reference' }
  ],
  sidebar: [
    {
      text: 'RevoSurge',
      link: '/cn/revosurge/welcome',
      collapsed: false,
      items: [
        { text: '欢迎使用 RevoSurge', link: '/cn/revosurge/welcome' },
      ]
    },
    {
      text: '增长',
      link: '/cn/growth/getting-started',
      collapsed: false,
      items: [
        { text: '入门指南', link: '/cn/growth/getting-started' },
        { text: '创建账户', link: '/cn/growth/account' },
        { text: '充值与钱包', link: '/cn/growth/funding-wallet' }
      ]
    },
    {
      text: '追踪',
      link: '/cn/tracking/overview',
      collapsed: false,
      items: [
        { text: '概述', link: '/cn/tracking/overview' },
        {
          text: 'Web 追踪器',
          link: '/cn/tracking/web-tracker',
          items: [
            { text: '安装 Web 追踪器', link: '/cn/tracking/web-tracker/install' },
            { text: 'Web 追踪器 SDK 参考', link: '/cn/tracking/web-tracker/reference' }
          ]
        },
        {
          text: '服务器到服务器 (S2S)',
          link: '/cn/tracking/s2s/overview',
          items: [
            { text: '概述', link: '/cn/tracking/s2s/overview' },
            { text: '服务器事件 API', link: '/cn/tracking/s2s/server-events-api' }
          ]
        },
      ]
    },
    {
      text: 'AdWave',
      link: '/cn/adwave/guided-campaign-setup',
      collapsed: false,
      items: [
        { text: '引导式广告系列设置', link: '/cn/adwave/guided-campaign-setup' }
      ]
    },
    {
      text: '受众',
      link: '/cn/audience/segments',
      collapsed: false,
      items: [
        { text: '受众细分', link: '/cn/audience/segments' },
        { text: '细分详情', link: '/cn/audience/segment-details' },
        { text: '创建受众细分', link: '/cn/audience/create-audience-segment' }
      ]
    },
    {
      text: 'API',
      link: '/cn/api/quickstart',
      collapsed: false,
      items: [
        { text: 'API 快速入门', link: '/cn/api/quickstart' },
        { text: 'API 密钥', link: '/cn/api/api-key' }
      ]
    }
  ],
}
