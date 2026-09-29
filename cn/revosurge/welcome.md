---
title: 欢迎使用 RevoSurge
description: RevoSurge 是什么、各产品的文档在哪里，以及一个账户如何在各产品间通用。
---

# 欢迎使用 RevoSurge

**面向：** 所有刚接触 RevoSurge 的人，包括广告主、媒介采买、分析师、开发者和发布商。

<nav class="article-toc" aria-label="本文内容">
<p class="article-toc-title">本文内容</p>

- [1. RevoSurge 是什么](#_1-what-is-revosurge)
- [2. 文档导航](#_2-where-to-find-the-docs)
- [3. 一个账户，所有产品通用](#_3-one-account-shared-across-products)

</nav>

::: info 新广告主？
直接看[新手投放手册](/cn/handbook/)，它会一步步带你从注册走到广告系列上线。
:::

## 1. RevoSurge 是什么 {#_1-what-is-revosurge}

RevoSurge（RS）是为效果营销人员打造的广告平台，对 iGaming 的支持尤其深入。它用三款产品连通广告市场的买卖双方：

| 产品 | 面向 | 作用 |
| --- | --- | --- |
| **AdWave** | 广告主 | **买量。** 在大量网站和 App 上投放广告系列。AdWave 对每次广告展示实时出价，并从你的转化中学习，找到更多和你最优质的玩家相似的人 |
| **DataPulse** | 广告主 | **衡量效果。** 用你自己的一方数据，追踪点击之后发生的一切，从注册、充值一直到玩家价值，再把这些转化回传给 AdWave |
| **AdFlow** | 发布商 | **流量变现。** 只需一段脚本 `adflow.js`，就能在网站上展示广告，支持横幅、弹窗（pop-under）、推送、页内推送和原生等格式 |

AdWave 和 DataPulse 配合使用：DataPulse 衡量转化，AdWave 据此优化投放。AdFlow 则引入发布商的广告库存，供 AdWave 广告系列购买。

## 2. 文档导航 {#_2-where-to-find-the-docs}

| 产品 | 作用 | 使用者 | 从这里开始 |
| --- | --- | --- | --- |
| **AdWave** | 创建、投放和优化广告系列 | 广告主、媒介采买 | [新手投放手册](/cn/handbook/) · [创建广告系列](/cn/handbook/create-campaign) |
| **DataPulse** | 为每个产品配置追踪，并分析注册、充值、同期群（cohort）和玩家价值等效果数据 | 广告主、分析师 | [追踪 → 概述](/cn/tracking/overview) |
| **追踪** | 通过 Web 追踪器（浏览器端）、S2S（你的后端）、Partner Postback（联盟平台）或 AppsFlyer（App），把转化发送给 RevoSurge | 开发者 | [手册 → 接入追踪](/cn/tracking/overview) |
| **受众** | 创建玩家分群，用于定向和再营销 | 广告主 | [受众 → 受众细分](/cn/audience/segments) |
| **AdFlow** | 一个 JavaScript SDK（`adflow.js`），发布商用它在自己的网站上展示 RevoSurge 广告，每种广告格式都配有调试工具 | 发布商、发布商开发者 | [AdFlow → 接入指南](/cn/adflow/integration-guide) |
| **Supply** | 接入向 RevoSurge 出售广告库存的 SSP（供应方平台），通过服务器对服务器方式竞价 | SSP、广告网络 | [Supply → 概述](/cn/supply/overview) |
| **API** | 在你自己的系统里管理广告系列、报表和受众 | 开发者 | [API → 快速入门](/cn/api/quickstart) |

## 3. 一个账户，所有产品通用 {#_3-one-account-shared-across-products}

你只需要**一个 RevoSurge 账户**，就能使用所有产品，AdWave 和 DataPulse 共用这个账户。

| 共用内容 | 说明 |
| --- | --- |
| **登录** | 每个账户只有一个登录邮箱，[AdWave](https://adwave.revosurge.com) 和 [DataPulse](https://datapulse.revosurge.com) 都用它登录。目前还不支持添加团队成员，如果需要多人访问，请使用共享的工作邮箱 |
| **钱包** | 所有广告系列和服务共用一个余额，充值由客户经理处理 |
| **产品** | 产品（Product）只需在任一工具中创建一次，两边都会显示 |
| **追踪与数据** | 发送到产品的事件，既用于 AdWave 的投放优化，也用于 DataPulse 的报表 |

**下一步：** [新手投放手册](/cn/handbook/)
