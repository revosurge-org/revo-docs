---
title: AppsFlyer 集成概述
sidebar_label: 概述
description: RevoSurge 与 AppsFlyer 的集成方式——激活合作伙伴并发送 postback，再由 RevoSurge 通过落地页的 web tracker 转发点击。从这里开始，找到你需要看的页面。
---

# AppsFlyer 集成概述

**受众：** UA 经理、广告主、代理商、追踪／BI 工程师

用 AppsFlyer 衡量 RevoSurge 广告分两半：**从 AppsFlyer 发出的 postback**，让我们收到你的安装与应用内事件；以及**转发进 AppsFlyer 的点击**，让 AppsFlyer 知道哪些点击是我们的。两半缺一不可。

> [!IMPORTANT]
> **你不需要为 RevoSurge 生成 AppsFlyer 追踪链接。** 既不用在 AppsFlyer 里生成链接，也不用把任何 URL 粘贴到 RevoSurge。RevoSurge 会替你转发点击，依据的是你在落地页安装 web tracker 时填入的 AppsFlyer App ID。如果你的团队集成过其他 DSP，这一步就是差异所在。

RevoSurge 同时是 **非 SRN** 合作伙伴（不是自归因渠道／self-reporting network）：AppsFlyer 不会主动向我们拉取广告数据，因此你开启的 postback 是转化到达 RevoSurge 的唯一途径。

## 我该看哪一页？

| 我的角色 | 广告类型 | 按此顺序阅读 |
|---|---|---|
| 广告主 | 任意 | [配置 postback](/cn/mmp/appsflyer/postbacks) → [点击转发](/cn/mmp/appsflyer/click-forwarding) → [交付与上线](/cn/mmp/appsflyer/handoff) |
| 广告主 | iOS | 同样这两页——同时关闭 Advanced Privacy。RevoSurge 不使用 SKAN |
| 代理商 | 任意 | 本页 + [合作伙伴权限](/cn/mmp/appsflyer/permissions)，然后是同样这两页 |
| 追踪／BI 工程师 | 任意 | [宏参数](/cn/mmp/appsflyer/macros)——我们发送了什么，以及如何对账两边看板 |
| 任何人 | 配置完成后 | [集成校验](/cn/mmp/appsflyer/validation) → [交付与上线](/cn/mmp/appsflyer/handoff) |

用户获取与再营销走的是同样这两页。点击路径在两者之间没有差别，因此不存在"UA 配置"与"再营销配置"两套需要你选择。Deep link 是例外——见[本章节不覆盖的内容](#本章节不覆盖的内容)。

代理商请注意：[合作伙伴权限](/cn/mmp/appsflyer/permissions)是要发给客户的那一页，因为只有 App 所有者能授予权限。

## 各项配置分别在哪里做

请把两个后台分开处理。本章节不会让你在一个步骤中来回切换两个后台。

| 在 AppsFlyer 中 | 在 RevoSurge 中 |
|---|---|
| 开启概率性归因（应用级） | 在落地页安装 web tracker |
| 激活 RevoSurge 合作伙伴 tile | 为你推广的每个平台填入 AppsFlyer App ID |
| 关闭 Advanced Privacy（iOS） | 在 AdWave 的产品上选择 AppsFlyer 作为 MMP 来源 |
| 设置归因回溯窗口 | 确认 postback 将携带的合作方事件名 |
| 开启默认 postback（安装、再营销） | 检查安装与事件是否已到达 |
| 开启应用内事件 postback 并映射你的漏斗事件 | — |

## 必需设置一览

以下是**要求**，不是建议。其中多数源于同一个原因：我们的优化模型需要自然量和未归因事件，而不只是归因给 RevoSurge 的事件。各配置页会连同具体点击路径逐项重复说明。

### 在 AppsFlyer 中

| 设置项 | 必需值 | 原因 |
|---|---|---|
| 概率性归因（App Settings） | **ON** | RevoSurge 的点击来自浏览器，而浏览器无法提供确定性匹配所需的设备 ID |
| Activate partner（激活合作伙伴） | 只要广告在跑就保持 **ON** | 关闭即没有归因、没有 postback |
| Advanced Privacy / Aggregated Advanced Privacy（iOS） | **OFF** | 开启会从 postback 中剥离设备 ID 与点击 ID |
| 点击归因回溯期 | **7 天** | 与你其他渠道保持一致 |
| 浏览归因回溯期 | **24 小时** | 与你其他渠道保持一致 |
| Install view-through attribution | **ON** | 属于标准配置——见下方说明 |
| 默认 postback（安装、再营销） | **所有媒体渠道，包含自然量** | 模型需要归因、未归因与自然量事件共同训练 |
| 应用内事件 postback | **ON** | 安装后信号是优化目标 |
| 应用内 postback 窗口 | **Lifetime（终身）**，下限 6 个月 | 窗口过短会截断我们可学习的事件 |
| 应用内发送范围 | **所有媒体渠道，包含自然量** | 同默认 postback |
| 收入 | 在 purchase／deposit／revenue 类事件上选择 **Values & revenue** | ROAS 必需 |

> [!NOTE]
> RevoSurge **只转发点击**——展示不会发送给 AppsFlyer，RevoSurge 的归因是基于点击的。因此上表中两行浏览归因相关设置不会影响你当前的 RevoSurge 流量；把它们放进必需项，是为了之后不必再回来动这个 tile。

### 在 RevoSurge 中

| 设置项 | 必需值 |
|---|---|
| 落地页上的 web tracker | 已安装，且产品显示 **Active** |
| `androidAppsFlyerId` / `iOSAppsFlyerId` | 你推广的每个平台对应的 AppsFlyer App ID |
| AdWave 中产品的 MMP 来源 | **AppsFlyer** |

## 开始之前

请向你的 RevoSurge 对接人索取以下信息。它们按账户签发，因此不要凭 Partner Marketplace 中名称相似的 tile 猜测。

- 在 AppsFlyer Partner Marketplace 中搜索时使用的**准确的 RevoSurge 合作伙伴 tile 名称**。
- RevoSurge 接受的**合作方事件名**，以便把你的 AppsFlyer 事件名精确映射过去。

另外，从你自己的 AppsFlyer 账户中准备好：

- 你推广的每个平台的 **AppsFlyer App ID**，在 AppsFlyer 后台该应用的设置中查看。

## 三个容易混淆的 ID

本次集成涉及三个标识符。把其中一个填到另一个的位置，是集成"静默失效"最常见的原因：页面能加载、点击能记录，但什么都收不到。

| ID | 它标识什么 | 从哪里获取 | 填到哪里 |
|---|---|---|---|
| **AppsFlyer App ID** | 你的应用，在 AppsFlyer 内部 | AppsFlyer 后台，应用设置 | 你落地页的 web tracker（`androidAppsFlyerId` / `iOSAppsFlyerId`） |
| **RevoSurge Tracker ID** | 你的产品，在 RevoSurge 内部 | RevoSurge，创建产品时获得 | 你落地页的 web tracker（`trackerId`） |
| **`pid`**（AppsFlyer 媒体渠道 ID） | RevoSurge，作为媒体渠道 | 由 RevoSurge 在转发的点击上设置 | 无需配置——你会在 AppsFlyer 报表中看到它 |

## 本章节不覆盖的内容

- **从你自己的服务器发送事件。** 那是[服务器事件 API (v3)](/cn/tracking/s2s/v3/server-events-api)，与你使用哪个 MMP 无关。
- **联盟后台 postback。** 由[合作方 Postback API](/cn/tracking/postback/partner-postback) 覆盖。
- **再营销的 deep link。** 本章节各页能让再营销广告被正确衡量，但不涉及进入 App 的 deep link 路由。上线此类广告前请先联系你的客户经理。

## 下一步

从[配置 postback](/cn/mmp/appsflyer/postbacks) 开始——在 postback 开启之前，无论其他配置如何，RevoSurge 都收不到任何数据。然后是[点击转发](/cn/mmp/appsflyer/click-forwarding)。

如果你刚开始接触 RevoSurge 的衡量体系，建议先看[追踪概述](/cn/tracking/overview)，再回到本页。
