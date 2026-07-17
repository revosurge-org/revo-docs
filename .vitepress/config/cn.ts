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
            { text: '安装', link: '/cn/tracking/web-tracker/install' },
            { text: 'Web 追踪器 SDK 参考', link: '/cn/tracking/web-tracker/reference' }
          ]
        },
        {
          text: '服务器到服务器 (S2S)',
          link: '/cn/tracking/s2s/overview',
          items: [
            { text: '概述', link: '/cn/tracking/s2s/overview' },
            { text: '服务器事件 API (v2)', link: '/cn/tracking/s2s/server-events-api' },
            {
              text: '服务器事件 API (v3)',
              link: '/cn/tracking/s2s/v3/server-events-api',
              items: [
                { text: 'API 参考', link: '/cn/tracking/s2s/v3/server-events-api' },
                { text: '信封与基础属性', link: '/cn/tracking/s2s/v3/mandatory-properties' },
                { text: '目录与校验', link: '/cn/tracking/s2s/v3/catalog-governance' },
                { text: '标准事件', link: '/cn/tracking/s2s/v3/events-standard' },
                { text: 'iGaming 事件', link: '/cn/tracking/s2s/v3/events-igaming' },
                { text: '从 v2 迁移', link: '/cn/tracking/s2s/v3/migration' }
              ]
            }
          ]
        },
      ]
    },
    {
      text: 'AdWave',
      link: '/cn/adwave/campaign-setup',
      collapsed: false,
      items: [
        { text: '广告系列设置', link: '/cn/adwave/campaign-setup' },
        { text: '素材要求与范例', link: '/cn/adwave/creative-requirements' }
      ]
    },
    {
      text: 'AdFlow',
      link: '/cn/adflow/integration-guide',
      collapsed: false,
      items: [
        { text: '接入指南', link: '/cn/adflow/integration-guide' },
        { text: 'Banner 调试器', link: '/cn/adflow/banner-debugger' },
        { text: 'Pop 调试器', link: '/cn/adflow/pop-debugger' },
        { text: 'Push 调试器', link: '/cn/adflow/push-debugger' },
        { text: 'In-page Push 调试器', link: '/cn/adflow/inpage-push-debugger' },
        { text: 'Native 调试器', link: '/cn/adflow/native-debugger' },
        { text: 'S2S 调试器', link: '/cn/adflow/s2s-debugger' },
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
      text: '供应端（SSP 接入）',
      link: '/cn/supply/overview',
      collapsed: false,
      items: [
        { text: '概述', link: '/cn/supply/overview' },
        { text: '快速开始', link: '/cn/supply/getting-started' },
        { text: '竞价接口参考', link: '/cn/supply/bid-endpoint' },
        { text: '通知回调', link: '/cn/supply/notifications' },
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
    },
    {
      text: '参考数据',
      link: '/cn/reference-data/exchange-rates',
      collapsed: false,
      items: [
        { text: '汇率参考', link: '/cn/reference-data/exchange-rates' }
      ]
    },
    {
      text: 'LLM 资源',
      link: '/llms.txt',
      collapsed: false,
      items: [
        { text: 'llms.txt', link: '/llms.txt', target: '_blank', rel: 'noopener noreferrer' },
        { text: 'llms-full.txt', link: '/llms-full.txt', target: '_blank', rel: 'noopener noreferrer' }
      ]
    }
  ],
}
