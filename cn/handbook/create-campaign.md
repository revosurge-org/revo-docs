---
title: 创建广告系列
description: 分六步创建并上线你的第一个 AdWave 广告系列，以及每一步该怎么选。
---

# 创建广告系列

**面向：** 在 AdWave 中上线广告系列的广告主和媒介采买。

本页按顺序带你走完 **Create Campaign** 流程的每个部分。先把你在“从这里开始”页面填好的[上线准备表](./#_2-fill-in-your-launch-worksheet)打开：下面每一项怎么选，表里都已经写好了。

<nav class="article-toc" aria-label="本文内容">
<p class="article-toc-title">本文内容</p>

- [开始之前](#before-you-start)
- [1. 产品](#_1-product)
- [2. 目标与广告格式](#_2-objective-and-ad-format)
- [3. 目标地区与再营销](#_3-target-geo-and-retargeting)
- [4. 出价与日预算](#_4-bid-and-daily-budget)
- [5. 排期](#_5-schedule)
- [6. 素材](#_6-creative)
- [7. 上线](#_7-launch)

</nav>

<!-- VIDEO: one 60–90 s clip per section below. Embed slot marked "▶ Video" in each section.
     Host outside YouTube for mainland China viewers (e.g. Bilibili or self-hosted CDN). -->

## 开始之前 {#before-you-start}

数据配置完成之前，**Create Campaign** 会一直处于锁定状态。请先确认：

- ✅ 产品显示为 **Active**（[接入追踪](/cn/tracking/overview)）
- ✅ 钱包有余额（[账户与钱包](./account-and-wallet)）
- ✅ 素材和落地页都已准备好（[素材](./creatives)、[落地页](./landing-page)）

然后进入左侧菜单的 **Campaign**，点击 **+ Create Campaign**；也可以直接在 AdWave 首页点击 **Create Campaign**。

整个流程都在一个长页面里完成。左侧的步骤栏会标出你当前所在的位置，点击任一步骤即可跳转。

## 1. 产品 {#_1-product}

<!-- ▶ Video: 1 · Choose your Product -->

选择你要推广的产品。

![Create Campaign — 第 1 步，选择产品](/img/handbook/create-campaign-product.png)

只能选择 Active 状态的产品，尚未激活的产品显示为灰色。如果你的产品是灰色的，请先完成[追踪设置](/cn/tracking/web-tracker/install#step-5-verify-in-the-portal)。

## 2. 目标与广告格式 {#_2-objective-and-ad-format}

<!-- ▶ Video: 2 · Objective and ad format -->

**广告系列名称。** 建议按 **地区 + 推广内容 + 广告格式 + 开始日期** 的格式命名，例如 `IN_Register_Pop_20261001`，这样看报表时一目了然。

**目标事件。** 选择这个广告系列要优化的转化。AdWave 也会用它来计算 **CPA**（单次获客成本）。

![Create Campaign — Target Event 与 Ad Format](/img/handbook/create-campaign-objective-format.png)

| 目标事件 | 优化目标 | 适用情况 |
| --- | --- | --- |
| **Register** | 新注册 | **第一个广告系列推荐选它。** 你已用 Web 追踪器追踪注册 |
| **FTD（First-Time Deposit，首充）** | 玩家的首次充值 | 充值追踪稳定可靠（S2S 或 Partner Postback） |
| **Bet** | 玩家下注 | 你已通过 S2S 发送 `bet` 事件 |
| **Landing Page Click** | 落地页上的任何点击 | 注册还没追踪起来，你想先用量更大的信号起步。注册是更强的信号，所以能选 **Register** 时优先选它 <!-- TODO (Ops): confirm when to recommend Landing Page Click --> |

**广告格式。** 从 **Pop**、**Push**、**Display** 或 **Native** 中选一种，第 6 步的素材字段会随之变化。拿不准？参见[上线准备表 → 广告格式](./#_2-4-ad-format-bid-and-budget)。

## 3. 目标地区与再营销 {#_3-target-geo-and-retargeting}

<!-- ▶ Video: 3 · Target geo and retargeting -->

![Create Campaign — Target Geo、Retargeting Audience 与 Converted Customer List exclusion](/img/handbook/create-campaign-geo-retargeting.png)

**Target Geo（目标地区）。** 搜索并添加要投放的国家或地区，每个广告系列最多 **20** 个。首次测试建议从 1–3 个市场开始。

**Retargeting Audience（再营销受众，可选）。** 广告只展示给你已创建的某个受众细分中的玩家，例如已注册但未充值的人。第一个广告系列可以先留空。要创建受众细分，点击 **Create Audience**，或参见[受众 → 受众细分](/cn/audience/segments)。

**Converted Customer List exclusion（已转化用户排除）。** 这一项自动开启。AdWave 不再向已完成首充（FTD）的玩家，以及自我禁入和已选择退出的用户展示你的广告，你无需做任何设置。频次上限（同一个人看到你广告的次数）也由平台统一管理。

::: tip 地区和语言要对应
每个市场都需要当地语言的素材。如果你投放的市场语言不同，请按语言分别建广告系列。
:::

## 4. 出价与日预算 {#_4-bid-and-daily-budget}

<!-- ▶ Video: 4 · Bid and daily budget -->

![Create Campaign — 出价策略、Suggested Bid 与 Daily Budget](/img/handbook/create-campaign-bid-budget.png)

**出价策略。** 选择 **oCPM**（标有 *Suggested*）。

| 策略 | 怎么运作 | 适用情况 |
| --- | --- | --- |
| **oCPM**（优化千次展示出价） | 你设定每个目标事件（例如每个注册）愿意付的成本，AdWave 会去找最可能转化的流量 | **大多数广告系列**，包括你的第一个 |
| **CPM** | 你设定每千次展示最多愿意付多少（**Maximum CPM Bid**），AdWave 在这个价格内尽量扩大覆盖 | 注重覆盖和频次的品牌曝光类广告系列 |

**出价。** 使用 oCPM 时，出价就是你**为每个目标事件愿意付的成本**，例如每个注册 $2.50。按你能承受的单次获客成本（CPA）来设。AdWave 还会显示 **Suggested Bid**（建议出价）；如果它和你的目标 CPA 相差很大，上线前请先和客户经理确认。计费仍按千次展示计算，所以实际的单次事件成本可能高于、也可能低于出价。

<!-- TODO (Product): Suggested Bid is wrong for oCPM. Tested 2026-09-28, geo IN: oCPM shows the same values as CPM's Suggested Max Bid for every target event — Pop $100, Push $0.09, Display $0.03, Native $0.02. These are CPM-level prices, not a cost per event, and Pop $100 looks like a fallback value. Fix before publishing; recapture create-campaign-bid-budget.png afterwards (it currently shows $100). -->

**日预算。** 使用 oCPM 时，日预算设为出价的 **100 倍**左右，让 AdWave 每天都有足够的数据学习，最低约为 **50 倍**。使用 CPM 时，日预算最低为出价的 **20 倍**。

| 你的出价 | 建议日预算 | 最低日预算 |
| --- | --- | --- |
| $2.50 | $250 | $125 |
| $5.00 | $500 | $250 |

::: warning 预算太少会拖慢学习
预算太少，AdWave 看到的转化就太少，没法优化，效果也会一直不稳定。如果建议预算超出你的承受范围，宁可减少投放地区，也不要把预算压到最低值以下。
:::

## 5. 排期 {#_5-schedule}

<!-- ▶ Video: 5 · Schedule -->

![Create Campaign — Schedule，已打开 End Date 选择器并选中 14D](/img/handbook/create-campaign-schedule.png)

- **开始日期：** 默认立即开始，也可以选未来的日期。
- **结束日期：** 必填。可以直接选日期，也可以用 **Quick Select Cycle**（**3D / 7D / 14D / 30D / 60D / 90D**），或在 **Custom Cycle** 中输入天数，然后点击 **Confirm**。

::: info 时间为 UTC+0
广告系列按 **UTC+0** 运行（显示为 *Actual publish time*）。可以用选择器里的 **Local time** 查看换算到你所在时区的时间。
:::

首次测试选 **14 天**：AdWave 有足够的时间学习，你也有足够的数据判断效果。

## 6. 素材 {#_6-creative}

<!-- ▶ Video: 6 · Add creatives -->

点击 **Add Creative (format)** 逐个添加广告。需要填写哪些字段取决于广告格式，参见[素材 → 规格](./creatives#_3-specs-by-ad-format)。

**Pop** 只需要语言和 Destination URL，因为 Pop 会直接打开你的落地页：

![Create Campaign — Pop 的素材部分](/img/handbook/create-campaign-creative-pop.png)

**Display、Native 和 Push** 还需要图片。点击 **Upload or Drag your file here** 上传，或点击 **Add from library** 复用已上传的素材。一次最多可上传 **20 张图片**。支持的格式和尺寸会显示在上传框里：

![Create Campaign — Display 的素材部分，含 Main Image 上传框](/img/handbook/create-campaign-creative-display.png)

为每个素材设置：

- **Creative language（素材语言）：** 广告的语言。勾选 **All creatives in this campaign will use this language** 即可应用到全部素材。
- **Destination URL（目标网址）：** 玩家点击后进入的落地页。勾选 **One URL for all creatives in this campaign** 可让所有素材共用一个 URL；也可以点击 **Add Landing Page** 登记新的落地页。

::: warning Destination URL 必须已登记
Destination URL 必须属于产品下已登记且处于激活状态的域名，否则广告系列无法投放。
:::

## 7. 上线 {#_7-launch}

所有部分都填好后，点击右上角的 **Launch**。上线没有单独的审核环节，广告系列会在排期设定的时间开始投放。

<!-- TODO (Product): the retired AdWave → Campaign Setup page said Launch opens a Campaign Summary that must be confirmed (screenshot: /img/onboarding/campaign-launch-summary.png). Confirm whether that step still exists and update this section if so. -->

**最后检查：**

- ✅ 已选择 Active 状态的产品
- ✅ 广告系列名称符合建议格式
- ✅ 已选择目标事件（第一个广告系列选 Register）
- ✅ 已选择一种广告格式
- ✅ 已添加 1–20 个地区，素材语言与之对应
- ✅ oCPM 出价已设为目标单次事件成本；日预算约为出价的 100 倍
- ✅ 已设置排期（首次测试 14 天）
- ✅ 已按规格添加素材，每个素材都设好了语言和已登记的 Destination URL

此时广告系列会出现在 **Campaigns** 列表中，并显示状态、已运行天数、日预算和投放指标。

![Campaigns 列表，显示状态、已运行天数、日预算、花费和投放指标](/img/handbook/campaign-list.png)

| 状态 | 含义 |
| --- | --- |
| **Live** | 广告系列正在投放 |
| **Ended** | 广告系列已结束并完成结算 |
| **Settlement Pending** | 广告系列已结束，最终花费正在结算 |

<!-- TODO (Product): confirm the full status list (e.g. Scheduled, Paused) -->

**下一步：** [投放第一周](./first-week)
