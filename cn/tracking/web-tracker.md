---
title: Web 追踪器
description: 面向网页漏斗的第一方 JavaScript SDK —— 为 AdWave 与 DataPulse 捕获会话、点击 ID 与转化事件。
---

# Web 追踪器

**Web 追踪器**是 RevoSurge 的第一方 JavaScript SDK。把它加到你的落地页和广告主网站上，即可在用户
沿网页漏斗前进时捕获会话并触发转化事件（注册、充值、FTD）。关键事件一旦显示为 **Live**，即成为 AdWave
广告系列的优化目标，并驱动 DataPulse 报表。

> **不确定这是否是你的方式？** 如果你运营移动 App，或拥有自己的后台，请先比较全部四种方式——参见
> [**追踪概述**](/cn/tracking/overview)。

## 何时使用
- 纯网页漏斗（落地页 + 网站）—— 没有 App，也没有后台 API
- 或与 [S2S](/cn/tracking/s2s/overview) / [Partner Postback](/cn/tracking/postback/partner-postback) 搭配使用，以捕获**点击侧**信号

## 如何归因
- 从落地页 URL 提取 **click_id** 和 **UTM** 参数
- 将 `click_id` 存入第一方 cookie（有效期一年）—— 一位用户落地、跳出、几天后回来，仍能归因
- 对于 AdWave 投放的流量，这些参数会自动捕获；对于非 AdWave 流量，请确保它们存在于你的目标 URL 中

## 你将设置的内容
1. DataPulse 中的一个**产品**—— 追踪 + 广告系列的容器（参见 [入门指南](/cn/growth/getting-started#_3-product-setup-high-level)）
2. 追踪器脚本 + 你的关键事件 —— 参见 **[安装](/cn/tracking/web-tracker/install)**
3. 验证事件显示为 **Live**，然后把广告系列指向它们

> Web 追踪器负责客户端。对于后端确认的 / 财务事件（付款结清、充值完成），请使用
> [S2S 服务器事件](/cn/tracking/s2s/overview) —— 许多广告主两者并用：Web 追踪器提供归因上下文，
> S2S 作为转化的真实来源。

## 下一步
- **[安装 Web 追踪器](/cn/tracking/web-tracker/install)** —— 添加脚本、发送事件、上线 Live
- **[Web 追踪器 SDK 参考](/cn/tracking/web-tracker/reference)** —— 每个方法与字段
