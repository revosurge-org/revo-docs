import type { DefaultTheme } from 'vitepress'

export const cn: DefaultTheme.Config = {
  nav: [
    { text: '安装', link: '/cn/tracking/web-tracker/install' },
    { text: '参考', link: '/cn/tracking/web-tracker/reference' }
  ],
  sidebar: [
    // A single page at L1. The empty items array renders it as a top-level entry, not inside an unnamed group.
    { text: '欢迎使用 RevoSurge', link: '/cn/revosurge/welcome', items: [] },
    {
      text: '新手投放手册',
      link: '/cn/handbook/',
      docFooterText: '从这里开始：上线你的第一个广告系列',
      collapsed: false,
      items: [
        { text: '从这里开始：上线你的第一个广告系列', link: '/cn/handbook/' },
        { text: '1. 账户与钱包', link: '/cn/handbook/account-and-wallet' },
        // Step 2 is the Tracking section, nested here unchanged. Its pages keep their /tracking and /mmp URLs.
        {
          text: '2. 接入追踪',
          link: '/cn/tracking/overview',
          collapsed: true,
          items: [
            { text: '概述 · 我该用哪个？', link: '/cn/tracking/overview' },
            { text: '核心概念', link: '/cn/tracking/core-concepts' },
            {
              text: '1. Web 追踪器',
              link: '/cn/tracking/web-tracker',
              collapsed: true,
              items: [
                { text: '安装', link: '/cn/tracking/web-tracker/install' },
                { text: 'Web 追踪器 SDK 参考', link: '/cn/tracking/web-tracker/reference' }
              ]
            },
            {
              text: '2. AppsFlyer（App MMP）',
              link: '/cn/mmp/appsflyer/overview',
              collapsed: true,
              items: [
                { text: '概述', link: '/cn/mmp/appsflyer/overview' },
                { text: '配置 postback', link: '/cn/mmp/appsflyer/postbacks' },
                { text: '点击转发', link: '/cn/mmp/appsflyer/click-forwarding' },
                { text: '宏参数', link: '/cn/mmp/appsflyer/macros' },
                { text: '合作伙伴权限', link: '/cn/mmp/appsflyer/permissions' },
                { text: '集成校验', link: '/cn/mmp/appsflyer/validation' },
                { text: '交付与上线', link: '/cn/mmp/appsflyer/handoff' }
              ]
            },
            {
              text: '3. S2S 服务器事件',
              link: '/cn/tracking/s2s/overview',
              collapsed: true,
              items: [
                { text: '概述', link: '/cn/tracking/s2s/overview' },
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
                },
                { text: '集成校验', link: '/cn/tracking/s2s/validation' },
                { text: '交付与上线', link: '/cn/tracking/s2s/handoff' },
                { text: '服务器事件 API (v2，已弃用)', link: '/cn/tracking/s2s/server-events-api' }
              ]
            },
            {
              text: '4. Partner Postback',
              link: '/cn/tracking/postback/partner-postback',
              collapsed: true,
              items: [
                { text: '合作方 Postback API', link: '/cn/tracking/postback/partner-postback' },
                { text: '集成校验', link: '/cn/tracking/postback/validation' },
                { text: '交付与上线', link: '/cn/tracking/postback/handoff' }
              ]
            }
          ]
        },
        { text: '3. 落地页与转化路径', link: '/cn/handbook/landing-page' },
        { text: '4. 素材', link: '/cn/handbook/creatives' },
        { text: '5. 创建广告系列', link: '/cn/handbook/create-campaign' },
        { text: '6. 投放第一周', link: '/cn/handbook/first-week' },
        { text: '7. 优化与放量', link: '/cn/handbook/optimise-and-scale' },
        { text: '常见问题', link: '/cn/handbook/faq' }
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
