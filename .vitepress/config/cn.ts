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
        {
          text: '2. 接入追踪',
          link: '/cn/tracking/overview',
          collapsed: true,
          items: [
            { text: '概述', link: '/cn/tracking/overview' },
            { text: '核心概念', link: '/cn/tracking/core-concepts' },
            {
              text: '1. Web 追踪器',
              link: '/cn/tracking/web-tracker',
              collapsed: true,
              items: [
                { text: '概述', link: '/cn/tracking/web-tracker' },
                { text: '安装与测试', link: '/cn/tracking/web-tracker/install' },
                { text: 'SDK 参考', link: '/cn/tracking/web-tracker/reference' }
              ]
            },
            {
              text: '2. AppsFlyer（App MMP）',
              link: '/cn/mmp/appsflyer/overview',
              collapsed: true,
              items: [
                { text: '概述', link: '/cn/mmp/appsflyer/overview' },
                { text: '设置与验证', link: '/cn/mmp/appsflyer/setup-appsflyer' },
                { text: '参数与报表', link: '/cn/mmp/appsflyer/parameters-reporting' }
              ]
            },
            {
              text: '3. S2S 服务器事件',
              link: '/cn/tracking/s2s/overview',
              collapsed: true,
              items: [
                { text: '概述', link: '/cn/tracking/s2s/overview' },
                { text: '设置与测试', link: '/cn/tracking/s2s/setup-s2s' },
                { text: 'API 参考（v3）', link: '/cn/tracking/s2s/v3/server-events-api' },
                { text: '集成校验', link: '/cn/tracking/s2s/validation' }
              ]
            },
            {
              text: '4. Partner Postback',
              link: '/cn/tracking/postback/overview',
              collapsed: true,
              items: [
                { text: '概述', link: '/cn/tracking/postback/overview' },
                { text: '设置与测试', link: '/cn/tracking/postback/setup-postback' },
                { text: 'API 参考（v2）', link: '/cn/tracking/postback/v2-api' },
                { text: 'API 参考（v1）', link: '/cn/tracking/postback/v1-api' },
                { text: '集成校验', link: '/cn/tracking/postback/validation' }
              ]
            },
            {
              text: '事件与字段',
              link: '/cn/tracking/events/choose-events',
              collapsed: true,
              items: [
                { text: '选择事件', link: '/cn/tracking/events/choose-events' },
                { text: '通用字段与身份', link: '/cn/tracking/events/common-fields' },
                { text: '标准事件', link: '/cn/tracking/events/events-standard' },
                { text: 'iGaming 事件', link: '/cn/tracking/events/events-igaming' },
                { text: 'Crypto 事件', link: '/cn/tracking/events/events-crypto' },
                { text: '事件可用性与校验', link: '/cn/tracking/events/catalog-validation' }
              ]
            }
          ]
        },
        { text: '3. 落地页与转化路径', link: '/cn/handbook/landing-page' },
        {
          text: '4. 素材',
          link: '/cn/handbook/creatives',
          collapsed: true,
          items: [{ text: '素材要求与范例', link: '/cn/handbook/creative-requirements' }]
        },
        { text: '5. 创建广告系列', link: '/cn/handbook/create-campaign' },
        { text: '6. 投放第一周', link: '/cn/handbook/first-week' },
        { text: '7. 优化与放量', link: '/cn/handbook/optimise-and-scale' },
        { text: '常见问题', link: '/cn/handbook/faq' }
      ]
    },
    {
      text: 'AdFlow',
      link: '/cn/adflow/',
      collapsed: false,
      items: [
        { text: '从这里开始：上线你的第一个广告位', link: '/cn/adflow/' },
        {
          text: '1. 创建账号、网站和广告位', link: '/cn/adflow/create-placement',
          collapsed: true,
          items: [
            { text: '广告格式与尺寸', link: '/cn/adflow/ad-formats' }
          ]
        },
        {
          text: '2. 选择接入方式', link: '/cn/adflow/choose-integration',
          collapsed: true,
          items: [
            { text: '网站直接安装 AdFlow JS Tag', link: '/cn/adflow/adflow-sdk' },
            { text: '自有 GAM + Prebid.js', link: '/cn/adflow/gam-prebid' },
            { text: '自有 GAM + AdFlow JS Tag（无 Prebid.js）', link: '/cn/adflow/gam-adflow-sdk' },
            { text: '网站通过 Prebid.js 接入 AdFlow S2S', link: '/cn/adflow/s2s-integration' }
          ]
        },
        { text: '3. 验证接入与上线', link: '/cn/adflow/verify-and-launch' },
        {
          text: '4. 查看报表与收益', link: '/cn/adflow/reporting',
          collapsed: true,
          items: [
            { text: '查看广告位数据与报表', link: '/cn/adflow/reports' },
            { text: '查看账单、更新收款资料与月度对账', link: '/cn/adflow/billing' }
          ]
        },
        {
          text: '常见问题与排查', link: '/cn/adflow/troubleshooting',
          collapsed: true,
          items: [
            { text: '安装检查失败', link: '/cn/adflow/install-check-qa' },
            { text: '有请求，但没有广告展示', link: '/cn/adflow/no-ad-display' },
            { text: '报表没数据或数据对不上', link: '/cn/adflow/report-data-issues' }
          ]
        },
        {
          text: '调试工具', link: '/cn/adflow/debuggers',
          collapsed: true,
          items: [
            { text: 'Banner 调试器', link: '/cn/adflow/banner-debugger' },
            { text: 'Pop 调试器', link: '/cn/adflow/pop-debugger' },
            { text: 'Push 调试器', link: '/cn/adflow/push-debugger' },
            { text: 'In-page Push 调试器', link: '/cn/adflow/inpage-push-debugger' },
            { text: 'Native 调试器', link: '/cn/adflow/native-debugger' },
            { text: 'S2S 调试器', link: '/cn/adflow/s2s-debugger' }
          ]
        }
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
