---
title: Publisher 接入文檔
description: 比較網站、Telegram 小程式和原生 App 使用 RevoSurge 實現廣告變現的六種接入方式。
---

# Publisher 接入文檔

根據廣告展示的平台，以及你對競價和渲染的控制需求，選擇合適的接入方式。網站可以由 AdFlow 自動處理 Prebid.js 競價和廣告渲染，也可以自行設定 Prebid.js。Telegram 小程式和原生 App 使用各自適配的 SDK。

## 六種接入方式

### [adflow.js 一鍵接入](./adflow-sdk) {#adflow-sdk}

在網頁中加入指令碼和 iframe 廣告版位，由 SDK 自動競價和渲染。支援 Banner、Pop、Push、In-page Push 和 Native。

### [adflow-tma.js（Telegram 小程式）](./adflow-tma-sdk) {#adflow-tma-sdk}

使用適配 Telegram WebApp 的 AdFlow SDK。它從 Telegram 讀取平台與裝置信號，跳過 Cookie 同步，並透過 Telegram 開啟廣告外部連結。

### [S2S 配置接入](./s2s-integration) {#s2s-integration}

自行設定 Prebid.js，細部控制廣告格式、價格、使用者同步和第一方資料，也可以將競價結果交給 Google Ad Manager（GAM）。

### [Prebid Mobile SDK（App 內接入）](./prebid-mobile-sdk) {#prebid-mobile-sdk}

在原生 iOS 或 Android App 中使用 Prebid Mobile SDK。SDK 可直接渲染得標廣告，也可以將競價結果交給 Google Ad Manager。

### [Prebid.js + GAM](./gam-prebid) {#gam-prebid}

將 RevoSurge S2S 出價傳給 GAM，並配置五種廣告格式的素材。

### [GAM + adflow.js](./gam-adflow-sdk) {#gam-adflow-sdk}

通過 GAM 選擇 adflow.js 素材，接入五種網站廣告格式。

## 網站接入模式對比

| 對比維度 | adflow.js 一鍵接入 | S2S 配置接入 |
| --- | --- | --- |
| **接入難度** | 極簡 — 兩行 HTML 即可 | 中等 — 需編寫 JS 代碼 |
| **需要了解 Prebid.js** | 否 | 是 |
| **支持廣告格式** | Banner / Pop / Push / In-page Push / Native | Banner / Video / Native / Multi-Format |
| **渲染方式** | iframe 自动渲染 | 靈活控制，支持自定义渲染 |
| **配置方式** | HTML data 属性 | Prebid.js API 完整配置 |
| **Preferred Deal** | 支持 | 支持 |
| **高级功能** | 基础配置 | Price Granularity、User Sync、First Party Data 等 |
| **推薦场景** | 快速上线、简单页面、无前端开发资源 | 生产环境、复杂需求、需要精细控制 |
