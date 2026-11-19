---
title: Publisher 接入文档
description: 比较网站、Telegram 小程序和原生 App 使用 RevoSurge 实现广告变现的六种接入方式。
---

# Publisher 接入文档

根据广告展示的平台，以及你对竞价和渲染的控制需求，选择合适的接入方式。网站可以由 AdFlow 自动处理 Prebid.js 竞价和广告渲染，也可以自行配置 Prebid.js。Telegram 小程序和原生 App 使用各自适配的 SDK。

## 六种接入方式

### [adflow.js 一键接入](./adflow-sdk) {#adflow-sdk}

在网页中加入脚本和 iframe 广告位，由 SDK 自动竞价和渲染。支持 Banner、Pop、Push、In-page Push 和 Native。

### [adflow-tma.js（Telegram 小程序）](./adflow-tma-sdk) {#adflow-tma-sdk}

使用适配 Telegram WebApp 的 AdFlow SDK。它从 Telegram 读取平台与设备信号，跳过 Cookie 同步，并通过 Telegram 打开广告外链。

### [S2S 配置接入](./s2s-integration) {#s2s-integration}

自行配置 Prebid.js，细粒度控制广告格式、价格、用户同步和第一方数据，也可以将竞价结果交给 Google Ad Manager（GAM）。

### [Prebid Mobile SDK（App 内接入）](./prebid-mobile-sdk) {#prebid-mobile-sdk}

在原生 iOS 或 Android App 中使用 Prebid Mobile SDK。SDK 可直接渲染中标广告，也可以将竞价结果交给 Google Ad Manager。

### [Prebid.js + GAM](./gam-prebid) {#gam-prebid}

将 RevoSurge S2S 出价传给 GAM，并配置五种广告格式的素材。

### [GAM + adflow.js](./gam-adflow-sdk) {#gam-adflow-sdk}

通过 GAM 选择 adflow.js 素材，接入五种网站广告格式。

## 网站接入模式对比

| 对比维度 | adflow.js 一键接入 | S2S 配置接入 |
| --- | --- | --- |
| **接入难度** | 极简 — 两行 HTML 即可 | 中等 — 需编写 JS 代码 |
| **需要了解 Prebid.js** | 否 | 是 |
| **支持广告格式** | Banner / Pop / Push / In-page Push / Native | Banner / Video / Native / Multi-Format |
| **渲染方式** | iframe 自动渲染 | 灵活控制，支持自定义渲染 |
| **配置方式** | HTML data 属性 | Prebid.js API 完整配置 |
| **Preferred Deal** | 支持 | 支持 |
| **高级功能** | 基础配置 | Price Granularity、User Sync、First Party Data 等 |
| **推荐场景** | 快速上线、简单页面、无前端开发资源 | 生产环境、复杂需求、需要精细控制 |
