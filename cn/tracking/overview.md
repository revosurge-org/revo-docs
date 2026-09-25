---
title: 追踪概述
description: 向 RevoSurge 发送转化的四种方式——Web 追踪器、S2S、Partner Postback 和 AppsFlyer——以及你的广告系列目标如何决定你需要哪几种。
---

# 追踪概述

**受众：** 广告主、媒介采买、UA 经理、开发者、联盟及合作伙伴经理

RevoSurge 依据你发送给我们的转化来优化你的广告系列。本页说明如何完成这项配置：创建产品，确定你要优化的目标，再接入能承载这些数据的方式。

<nav class="article-toc" aria-label="本文内容">
<p class="article-toc-title">本文内容</p>

- [1. 创建你的产品](#_1-create-your-product)
- [2. 选择你的配置方案](#_2-choose-your-setup)
- [3. 四种方式](#_3-the-four-methods)
- [4. 每种方式能解锁什么](#_4-what-each-method-unlocks)
- [5. 常见问题](#_5-faq)
- [6. 开始接入](#_6-getting-started)

</nav>

::: details 从 Meta 或 Google 转过来？从这里开始

你已经熟悉的大部分概念都能一一对应。名字变了，模型没变。

| 你已经熟悉的 | 在 RevoSurge 上 |
| --- | --- |
| Meta Pixel · Google `gtag.js` | **Web 追踪器**——同样的思路，一段脚本，六个事件 |
| Conversions API · GA4 Measurement Protocol | **S2S 服务器事件 (v3)**——你的后端向我们发送 POST 请求 |
| 标准事件（Purchase、CompleteRegistration） | **事件目录**——24 个事件：9 个标准事件、15 个 iGaming 事件 |
| `fbclid` · `gclid` | `identity.click_id`——在落地时捕获，再回传给我们 |
| Advanced Matching · Enhanced Conversions | `context.privacy.email_hash` / `phone_hash`——SHA-256，与它们的做法相同 |
| Purchase `value` + `currency` | `context.amount` + `context.currency`——`deposit` 必填 |
| Test Events · Tag Assistant | 在任意端点加 `?dryrun=1`——返回完整判定结果，不存储任何数据 |
| `event_id` 去重 | **Partner Postback**：`event_id`，附有文档化的优先级阶梯。**S2S**：资金类事件使用 `context.transaction_id` |

**有三点对你来说是新的：**

- **iGaming 事件目录。** 充值、投注、KYC、奖金、VIP 等级和会话都是一等事件，而不是需要你自己定义的自定义转化。正因如此，才能按玩家价值出价。
- **iGaming 事件按产品启用。** 与 Meta 标准事件不同，`deposit` 并不是一发送就生效——RevoSurge 需要先为你的产品启用 iGaming 预设。参见 [7. 事件目录](/cn/tracking/s2s/overview#_7-the-event-catalog)。
- **Partner Postback 没有对应物。** 如果你的转化数据存放在联盟平台的后台，而不是你自己的后端，你无需写任何代码即可完成集成。参见 [2.2](#_2-2-which-system-holds-your-conversion-data)。

:::

## 1. 创建你的产品 {#_1-create-your-product}

在它存在之前，其他一切都无法工作。**产品**（Product）就是 RevoSurge 眼中的你的网站或 App。创建产品会登记你的域名，并签发每种方式都依赖的凭证：Web 追踪器用的 **Tracker ID**，以及 S2S 用的 **API 密钥**。

在任一后台中前往 **Product → Manage Product**：

| 后台 | URL |
| --- | --- |
| **AdWave** | [adwave.revosurge.com/product](https://adwave.revosurge.com/product) |
| **DataPulse** | [datapulse.revosurge.com/product](https://datapulse.revosurge.com/product) |

::: info 一个产品，两个后台通用
AdWave 和 DataPulse 共用同一份产品列表。在其中一个创建后，它会出现在另一个里——无需创建两次。右上角的 **Open DataPulse** / **Open AdWave** 按钮可在两者之间切换。
:::

页面顶部的 **Setup Wizard**（设置向导）会按顺序引导你完成整个集成，每一步都要在上一步完成后才能进行。在你的产品创建之前，第 2–4 步会显示 **Locked · Complete Step 1 first**。

![产品页面上的设置向导](/img/tracking/02-setup-wizard-4-steps.png)

### 1.1 填写表单 {#_1-1-fill-in-the-form}

在设置向导中或 Manage Product 表格上方点击 **+ Create Product**。

![创建产品表单](/img/tracking/03-create-product-form.png)

| 字段 | 必填 | 填写内容 |
| --- | --- | --- |
| **Product Domain** | 是 | 你的主域名，包含协议——`https://yourbrand.com`。RevoSurge 会把流量归因到这个域名。 |
| **Product Name** | 是 | 便于识别的名称。用于报表和产品切换器。 |
| **Landing Page URL** | 否 | 你投放付费流量的任何其他域名或 URL。为每一个选择 **Funnel Type**。**+** 添加一行，垃圾桶图标删除一行。 |
| **Deposit Currency** | 是 | 你的充值结算货币——**Fiat**（可搜索）或 **Crypto**。我们报告的每一笔金额都会换算成该货币。 |

然后点击 **Submit**。向导进度变为 `1/4`，第 1 步显示 **Created**。

::: warning 登记你投放的每一个域名
> 所有已登记的域名都需要安装 Web 追踪器。广告系列的 Destination URL 必须与一个处于有效状态的域名匹配，才能投放。

如果广告系列指向一个未在此登记的域名，**它将无法投放**。现在就把预落地页、镜像域名和跳转域名都加上。
:::

::: tip 选择你后台实际结算所用的充值货币
我们报告的每一笔金额都会换算成该货币。如果它与你的实际结算货币不一致，你的总额和我们的总额之间就会出现与汇率波动相当的差异。以加密货币结算的运营方应选择加密货币，而不是等值的法币。
:::

### 1.2 选择正确的 Funnel Type {#_1-2-choose-the-right-funnel-type}

每个 Landing Page URL 都需要一个 Funnel Type，这样 RevoSurge 才知道这个页面的用途。

![Funnel Type 下拉菜单](/img/tracking/04-funnel-type-dropdown.png)

| Funnel Type | 适用情形 |
| --- | --- |
| **Direct Register** | 访客直接在该落地页上注册。 |
| **Redirect Register** | 该页面跳转到注册页。请把两个 URL 登记在同一个产品下。 |
| **Direct Download** | 访客直接从该页面下载 App。 |
| **Redirect Download** | 该页面跳转到 App 下载页。请把两个 URL 登记在同一个产品下。 |
| **AI Companion Home Page** | AI Companion 产品的首页。 |
| **AI Companion Survey Funnel** | 问卷式的 AI Companion 获客漏斗。 |

::: info 跳转类型需要先有 Direct 页面
在你至少添加一个 **Direct** 落地页 URL 之前，**Redirect Register** 和 **Redirect Download** 会一直显示为灰色不可选——后台会提示 *"Add a Direct landing page URL first."*（请先添加一个 Direct 落地页 URL）。先添加目标页面，再添加跳转页。
:::

### 1.3 你会得到什么 {#_1-3-what-you-get}

| 标识符 | 格式 | 用途 |
| --- | --- | --- |
| **Product ID** | `AWP-20260827-052659-007-3119` | 内部引用、支持工单 |
| **Tracker ID** | `TRA-AWP-20260827-052659-007-3119` | 填入 Web 追踪器代码片段 |

Tracker ID 就是 Product ID 加上 `TRA-` 前缀。

## 2. 选择你的配置方案 {#_2-choose-your-setup}

RevoSurge 支持**四种集成方式**——Web 追踪器、S2S 服务器事件、Partner Postback 和 AppsFlyer。你会用到不止一种，但几乎没有人四种全用。

**那么哪种组合适合你？** 我们用三个问题来回答。

| | 问题 | 你的答案决定什么 |
| --- | --- | --- |
| **2.1** | 你的玩家落在哪里？ | AppsFlyer 是否需要参与 |
| **2.2** | 哪个系统掌握你的转化数据？ | Partner Postback **或** S2S——两者是二选一，而不是叠加 |
| **2.3** | 你的广告系列优化什么目标？ | 接入要做多深，以及要发送哪些事件 |

回答完这三个问题，[路由表](#the-routing-table)就会给出你的配置方案。如果你已经知道答案，可以直接跳过去。

### 2.1 你的玩家落在哪里？ {#_2-1-where-do-your-players-land}

| | |
| --- | --- |
| **网站** | Web 追踪器负责承载点击和浏览器事件 |
| **移动 App** | 你还需要一个 MMP。RevoSurge 与 **AppsFlyer** 集成 |
| **两者都有** | 以上两者都要——它们在同一个产品下并行运行 |

没有 MMP 的 App 安装广告系列无法归因安装。应用商店横在点击和安装之间，我们所能控制的任何东西都看不到另一侧。

### 2.2 哪个系统掌握你的转化数据？ {#_2-2-which-system-holds-your-conversion-data}

这是多数配置出错的地方，因为它关乎**谁能发送这个事件**，而不是你更倾向于哪种。

| 充值和注册记录在哪里 | 方式 | 需要你提供什么 |
| --- | --- | --- |
| **你自己的后端**——由你的平台确认付款 | **S2S** | 一名开发者，约 2–5 天 |
| **联盟平台的后台**——Income Access、Affilka、MyAffiliates 或你自建的联盟系统 | **Partner Postback** | 一位能访问该平台 postback 设置的人。无需工程投入。 |
| **你的 MMP**——应用内事件已经在流向 AppsFlyer | **AppsFlyer postback** | 在 AppsFlyer 中完成配置，并在 RevoSurge tile 上授予权限 |

::: warning 每个事件只选一个权威来源
S2S 和 Partner Postback 做的是同一件事。如果两者上报了同一笔充值，会按优先级处理——参见 [核心概念 → 去重](/cn/tracking/core-concepts#when-two-methods-report-the-same-conversion)——但你等于花了两份成本去构建同一样东西，对账也会更难，而不是更容易。

只有当两者确实覆盖不同事件或不同品牌时，才同时运行。
:::

如果你既有工程资源**又**有联盟平台，请选择 S2S。它是唯一能承载金额和 `bet` 的方式，因此也是唯一一种在你的目标加深后仍然够用的方式。

### 2.3 你的广告系列优化什么目标？ {#_2-3-what-do-your-campaigns-optimise-for}

你选的不是追踪方式，而是**你的广告系列优化什么目标**，这决定了配置要做多深。

- **App 安装**——新安装量
- **注册**——新账户数量
- **首充**——首次充值的玩家数
- **充值价值**——按玩家充值金额出价
- **玩家价值**——一段时间内的 GGR 和 LTV

选出所有适用的目标。它们是累加的：优化玩家价值并不意味着你不再统计注册。往下找到你**最深**的目标——那一行设定了下限，比它浅的目标都会随之覆盖。

### 路由表 {#the-routing-table}

找到与你三个答案匹配的那一行。

| 落在 | 最深目标 | 数据位于 | 你的配置方案 | 工作量 |
| --- | --- | --- | --- | --- |
| 网页 | 注册 | 浏览器 | Web 追踪器 | 当天 |
| 网页 | 首充 | 联盟平台 | Web 追踪器 **+** Partner Postback | 当天 |
| 网页 | 首充 | 你自己的后端 | Web 追踪器 **+** S2S（Basic） | 约 2–3 天 |
| 网页 | 充值价值 | 你自己的后端 | Web 追踪器 **+** S2S（Basic，带金额） | 约 2–3 天 |
| 网页 | 玩家价值——GGR、LTV | 你自己的后端 | Web 追踪器 **+** S2S（完整目录） | 约 3–5 天 |
| App | 安装 | 你的 MMP | Web 追踪器（点击转发）**+** AppsFlyer | 约 3–5 天 |
| App | 注册、应用内事件 | 你的 MMP | 上述配置 **+** AppsFlyer 应用内事件 postback | 约 3–5 天 |
| App | 充值价值或玩家价值 | 你自己的后端 | 上述配置 **+** S2S | 在此基础上再加约 3–5 天 |
| 网页**和** App | 任意 | 混合 | Web 追踪器 **+** AppsFlyer **+** S2S 或 Partner Postback 中与你后台匹配的那一种 | 以上各行之和 |

::: warning 每种配置方案都必须包含 Web 追踪器
广告点击最初就是由它捕获的。没有其他任何方式能看到是哪条广告带来了访客——而在 App 侧，也是它负责把你的点击转发给 AppsFlyer。
:::

## 3. 四种方式 {#_3-the-four-methods}

### 3.1 Web 追踪器——浏览器端 {#_3-1-web-tracker-—-browser-side}

放在你网站上的一段 JavaScript 代码片段。它上报浏览器中发生的事情——页面浏览、注册、登录、充值、进入游戏、下载点击——并捕获**归因上下文**：哪条广告、哪个来源、哪个落地页。

- **由谁实施：** 你的网页开发者
- **凭证：** Tracker ID（`TRA-AWP-…`）
- **指南：** [安装 Web 追踪器](/cn/tracking/web-tracker/install)

### 3.2 S2S 服务器事件——后端 {#_3-2-s2s-server-events-—-backend-side}

你的后端把事件 POST 到我们的 API。没有任何东西运行在浏览器中，因此不会因广告拦截器、防追踪功能或关闭标签页而丢失数据。

**资金数据应该走这里。** 支付服务商确认过的充值，是你的服务器确切掌握的事实；浏览器可能根本没看到它。

- **由谁实施：** 你的后端开发者
- **凭证：** API 密钥，通过 `X-API-KEY` 请求头发送
- **指南：** [服务器到服务器 (S2S) 概述](/cn/tracking/s2s/overview)

### 3.3 Partner Postback——由你的平台调用我们 {#_3-3-partner-postback-—-your-platform-calls-us}

一个在转化发生时由你的后台或联盟平台调用的 URL。你把它粘贴进去，由对方触发。**无需工程投入。**

- **由谁实施：** 你本人，或你的联盟平台管理员
- **凭证：** postback 密钥，通过 `k` 查询参数发送
- **指南：** [合作方 Postback API](/cn/tracking/postback/partner-postback)

### 3.4 AppsFlyer——App 安装与应用内事件 {#_3-4-appsflyer-—-app-installs-and-in-app-events}

如果你推广的是移动 App，AppsFlyer 会把安装和应用内事件回报给我们，而 Web 追踪器会把你的广告点击转发给 AppsFlyer。大部分配置在 **AppsFlyer 自己的控制台**中完成，而不是在 RevoSurge 中。

- **由谁实施：** 你的 UA 经理，在 AppsFlyer 中完成
- **凭证：** 合作伙伴 tile 名称和 `pid`，由你的客户经理提供
- **指南：** [AppsFlyer 概述](/cn/mmp/appsflyer/overview)

::: info 向你的客户经理索取三样东西
在 AppsFlyer Partner Marketplace 中搜索用的确切**合作伙伴 tile 名称**、用于映射你事件的**合作伙伴事件名**，以及你的 **`pid`**。没有第一项就无法开始。
:::

### 横向对比 {#side-by-side}

| | Web 追踪器 | S2S | Partner Postback | AppsFlyer |
| --- | --- | --- | --- | --- |
| **运行位置** | 访客的浏览器 | 你的后端 | 合作方的系统 | AppsFlyer 的服务器 |
| **由谁实施** | 网页开发者 | 后端开发者 | 你本人，无需工程投入 | UA 经理 |
| **能否看到广告归因** | 能，原生支持 | 能，通过 `click_id` | 能，通过 `click_id` | 能，通过转发的点击 |
| **会被广告拦截器拦截** | 有可能 | 否 | 否 | 否 |
| **资金数据是否权威** | 否 | **是** | 是 | 是 |
| **覆盖范围** | 网页 | 网页 + App | 网页 + App | **仅 App** |
| **配置工作量** | 当天 | 约 3–5 天 | 当天 | 约 3–5 天 |

::: info 不熟悉这些术语？
**浏览器端 / 客户端**——运行在访客浏览器中的代码。能看到广告点击和用户旅程，但可能被拦截。
**服务器到服务器（S2S）**——你的服务器直接与我们的服务器通信。无法被拦截，但看不到浏览器。
**Postback**——由其他人调用、用来通知你某件事已发生的 URL。
**MMP**——移动归因合作伙伴（mobile measurement partner）。像 AppsFlyer 这样的第三方，负责归因 App 安装并将其上报给广告平台。
:::

## 4. 每种方式能解锁什么 {#_4-what-each-method-unlocks}

随着你的事件覆盖范围扩大，功能会逐步开启。设置向导会实时显示这一点——每一步都列出了它能解锁的功能。

| 你发送的内容 | 解锁 |
| --- | --- |
| 通过 Web 追踪器发送 `page_view` | Source Traffic |
| `register`、`login` | Registration Funnel |
| 通过 S2S 或 Postback 发送 `deposit`、`withdraw` | FTD 报表 |
| 通过 S2S 发送带金额的 `deposit`、`withdraw`、`bet` | True LTV · ROAS |
| 通过 S2S 发送完整的标准 + iGaming 事件目录 | Predicted LTV · Churn · Bonus Engine |
| 通过 AppsFlyer 发送安装和应用内事件 | App 安装归因 · App 侧漏斗 |
| 在 DataPulse 中接入的广告来源 | Source Intelligence |

## 5. 常见问题 {#_5-faq}

::: details 四种方式我都需要吗？
不需要。大多数广告主使用的是 **Web 追踪器 + 一种转化方式**。只有在推广移动 App 时才需要加上 AppsFlyer。参见[路由表](#the-routing-table)。
:::

::: details 可以先用一种，之后再加吗？
可以。新增方式不会丢失任何数据——多出来的事件只是开始陆续到达。常见路径是先用 Web 追踪器 + Partner Postback 上线，等工程团队有时间再接入 S2S。
:::

::: details 我没有工程资源，能怎么做？
**Partner Postback。** 只需把两个 URL 粘贴到你的后台或联盟平台，当天就能上线。它能覆盖首充，这已经足够用来优化。Web 追踪器代码片段本身仍需要开发者安装，但那只是一个 script 标签。
:::

::: details 收入数据应该信任哪种方式？
**S2S。** 浏览器上报的充值会少算——广告拦截器、关闭的标签页和支付跳转都会导致事件丢失。如果你基于浏览器上报的收入来优化，就是在基于一个不完整的数字优化。
:::

::: details 各处都必须发送同一个用户 ID 吗？
**是的，这也是最常见的集成错误。** 无论你的系统用什么 ID 标识一个账户，都要把这个完全相同的值在 Web 追踪器中作为 `user_id`、在 S2S 中作为 `client_user_id` 发送。如果两者不同，我们会把它看作两个不同的人，你的归因就会出错。

**不要**使用会话 ID、cookie ID 或匿名访客 ID。
:::

::: details 如果两种方式上报了同一笔充值，会怎样？
我们会把两条都存下来，但只计一次。离资金最近的来源胜出：你的后台知道一笔充值已经结算，而浏览器只知道一个按钮被点击了。实际上，对于 `deposit` 而言，优先级是 **S2S > Partner Postback > Web 追踪器**，且金额只采用 S2S 的数据。
:::

::: details 需要在每个后台各创建一次产品吗？
不需要。AdWave 和 DataPulse 共用一份产品列表。
:::

::: details 我只推广 App，还需要 Web 追踪器吗？
需要。当你在追踪器的初始化选项中设置了 AppsFlyer App ID 后，代码片段会**把每一次广告点击转发给 AppsFlyer**，这样安装才能归因到我们。没有安装代码片段的落地页不会转发任何点击，它带来的每一次安装都会被计为自然量。
:::

::: details 广告系列要多久才能优化到位？
点击会立即开始投放。安装和注册优化通常在 1–2 周内趋于稳定；首充优化需要 2–4 周，因为 FTD 比较稀疏；基于价值的优化需要 4–8 周。在第三天就评判一个基于价值的广告系列，看到的只是噪声，而不是效果。
:::

::: details 我的广告系列没有投放，是追踪的问题吗？
有可能。广告系列的 Destination URL 必须与该产品下一个**已登记且处于有效状态**的域名匹配。请把预落地页、镜像域名和跳转域名作为 Landing Page URL 添加，并为每一个设置 Funnel Type。参见 [1. 创建你的产品](#_1-create-your-product)。
:::

## 6. 开始接入 {#_6-getting-started}

按从上到下的顺序进行。每一步都依赖于上一步。

1. **创建你的产品**——域名、落地页、充值货币——[见上文第 1 节](#_1-create-your-product)
2. **复制你的 Tracker ID**——[步骤 1](/cn/tracking/web-tracker/install#step-1-find-your-tracker-id)
3. **安装 Web 追踪器**，并触发 `register`、`login`、`deposit`——
   [步骤 2–4](/cn/tracking/web-tracker/install#step-2-add-the-tracker-script)
4. **确认 Tracker Status 显示为 Active**——
   [步骤 5](/cn/tracking/web-tracker/install#step-5-verify-in-the-portal)
5. **接入你的转化方式**——[S2S](/cn/tracking/s2s/overview) 或
   [Partner Postback](/cn/tracking/postback/partner-postback)
6. 如果你推广 App，**接入 AppsFlyer**——[AppsFlyer 概述](/cn/mmp/appsflyer/overview)
7. **上线你的第一个广告系列**——[AdWave 广告系列设置](/cn/adwave/campaign-setup)

从这里开始：**[安装 Web 追踪器](/cn/tracking/web-tracker/install)**。
