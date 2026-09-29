---
title: 常见问题
description: 新广告主最常问的问题：入门、钱包、追踪和广告系列。
---

# 常见问题

**面向：** 正在使用新手投放手册的新广告主。

<nav class="article-toc" aria-label="本文内容">
<p class="article-toc-title">本文内容</p>

- [入门](#getting-started)
- [钱包与账单](#wallet-and-billing)
- [追踪](#tracking)
- [广告系列](#campaigns)

</nav>

## 入门 {#getting-started}

### 上线需要多久？ {#how-long-does-it-take-to-launch}

如果只用 Web 追踪器，当天就能上线。如果要通过 S2S 追踪充值，大约需要 2–5 天开发时间。参见[从这里开始 → 运作方式](./#_1-how-it-works)。

### 我需要开发者吗？ {#do-i-need-a-developer}

需要，开发者要在你的网站上安装 Web 追踪器（约 30 分钟）。Partner Postback 则不用写代码。

### 可以添加团队成员吗？ {#can-i-add-my-team}

暂时不行。每个账户只有一个登录邮箱。如果有多人投放，请使用共享的工作邮箱。

## 钱包与账单 {#wallet-and-billing}

### 怎么充值？ {#how-do-i-add-funds}

联系客户经理即可，目前不支持自助付款。参见[账户与钱包 → 为钱包充值](./account-and-wallet#_2-fund-your-wallet)。

### 充值可以退吗？ {#are-deposits-refundable}

不可以。按测试周期的计划花费充值即可。<!-- TODO: confirm policy -->

### 余额用完会怎样？ {#what-happens-when-my-balance-runs-out}

广告系列会停止投放，直到你充值为止。参见[保持余额充足](./account-and-wallet#_3-keep-your-balance-topped-up)。

## 追踪 {#tracking}

### 为什么我的产品还是 Inactive？ {#why-is-my-product-still-inactive}

因为 Web 追踪器还没发出第一个事件。请检查脚本是否已放到网站上、Tracker ID 是否正确，然后访问一下网站，看看 **Event Stream**。

### 为什么在 Create Campaign 里选不了我的产品？ {#why-can-t-i-select-my-product-in-create-campaign}

只能选择 Active 状态的产品。请先完成[追踪设置](/cn/tracking/overview)。

### 我已经有老玩家了，首充数字会不准吗？ {#i-already-have-players-will-my-first-deposit-numbers-be-wrong}

有可能。开启追踪后，老玩家的下一笔充值看起来就像首充。请先回传历史充值数据，或和客户经理商定一个截止日期。参见[核心概念 → 首充](/cn/tracking/core-concepts#_5-first-deposits)。

## 广告系列 {#campaigns}

### 第一个广告系列选哪个目标事件？ {#which-target-event-should-i-choose-first}

选 **Register**，除非充值追踪已经稳定可靠。参见[创建广告系列 → 目标与广告格式](./create-campaign#_2-objective-and-ad-format)。

### 先用哪种广告格式？ {#which-ad-format-should-i-start-with}

**Pop**。它只需要一个落地页，上线最快。

### 每天该花多少？ {#how-much-should-i-spend-per-day}

日预算约为出价的 100 倍（至少 50 倍）。参见[创建广告系列 → 出价与日预算](./create-campaign#_4-bid-and-daily-budget)。

### 广告系列上线前有审核吗？ {#is-there-a-review-before-my-campaign-goes-live}

没有。点击 **Launch** 后，广告系列会在排期设定的时间开始投放。 <!-- TODO (Product): same Launch / Campaign Summary question as create-campaign.md -->

### 广告系列不消耗预算，该检查什么？ {#my-campaign-isn-t-spending-what-should-i-check}

参见[投放第一周 → 常见问题诊断](./first-week#_3-diagnose-common-problems)。

### 为什么 Analytics 的数字一直在变？ {#why-do-my-analytics-numbers-keep-changing}

Cohort 视图会把点击后 14 天内的转化都归到那次点击上，所以最近的数字会持续增长，直到同期群成熟。

::: tip 还有其他问题？
联系客户经理，并附上填好的[上线准备表](./#_2-fill-in-your-launch-worksheet)。他们想问的问题，表里大多已经有答案。
:::
