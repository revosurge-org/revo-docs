---
title: 投放第一周
description: 上线后前 7 天要检查什么、正常情况是什么样，以及出问题时怎么处理。
---

# 投放第一周

**面向：** 刚上线广告系列的广告主和媒介采买。

新广告系列需要时间学习。本页告诉你前 7 天该看什么、怎么解读数据，以及什么时候该做调整。一周结束时，你就能决定是优化、放量还是停投。

<nav class="article-toc" aria-label="本文内容">
<p class="article-toc-title">本文内容</p>

- [1. 什么时候看什么](#_1-what-to-check-and-when)
- [2. 在哪里看数据](#_2-where-to-find-your-numbers)
- [3. 常见问题诊断](#_3-diagnose-common-problems)
- [4. 调整规则](#_4-rules-for-changes)

</nav>

## 1. 什么时候看什么 {#_1-what-to-check-and-when}

| 时间 | 看什么 | 正常表现 |
| --- | --- | --- |
| **前 2 小时** | 状态和展示 | 状态为 **Live**，展示量在上升 |
| **第 1 天** | 花费、展示、点击和 CTR（Pop 看 Visit Rate） | 花费接近日预算；点击（Pop 看访问）持续进来 |
| **第 2 天** | 注册 | Analytics 中开始出现注册 |
| **第 3 天** | 最好和最差的素材（CTR 或 Visit Rate、注册） | 有几组素材明显领先 |
| **第 4–6 天** | 花费节奏、素材排名 | 广告系列每天能花掉大部分日预算；最弱的素材已暂停 |
| **第 7 天** | **Cohort** 视图中的 **CPA**，与目标对比 | 可以做决定了：CPA 达标就[优化与放量](./optimise-and-scale)；接近目标就调整一个变量；差得太远就停投 |

<!-- TODO (Product): Day 7 conflicts with cohort maturity. The Cohort view says cohorts under 14 days "are excluded from the total row", so on day 7 every cohort of a new campaign is still maturing. Say which number to read on day 7 (the campaign's own row, as a provisional CPA?). -->
<!-- TODO (Product): the Cohort columns in analytics-activity.png show FTDs / FTD CPA / GGR / LTV / ROAS, with no cost per registration. Confirm where a Register campaign reads its CPA. -->
<!-- TODO (Product): the Creatives list only has edit and delete actions. Confirm how to pause a single creative in a live campaign (Days 4–6 row, and Rules for changes). -->
<!-- TODO (Ops): add benchmark ranges for CTR and CPA by format and geo tier, so advertisers can tell "normal" from "problem" -->

## 2. 在哪里看数据 {#_2-where-to-find-your-numbers}

**Campaigns** 显示每个广告系列的投放情况：状态、日预算、花费、展示（Imps）、点击、CTR、CPM、CPC 和 Visit Rate。

Pop 广告直接打开落地页，没有点击可统计，所以 Clicks 和 CTR 显示为 `--`。Pop 请看 **Visit Rate**，而不是 CTR。<!-- TODO (Product): confirm the Visit Rate definition (landing page visits ÷ impressions?) -->

![带投放指标的 Campaigns 列表](/img/handbook/campaign-list.png)

**Analytics** 显示投放效果：花费、注册（Regs）、首充（FTDs）、GGR（博彩总收入）和综合成本。

![Analytics — Activity 卡片：Spend、Regs、FTDs、GGR、CPM、CPR、FTD CPA 和 ROAS](/img/handbook/analytics-activity.png)

::: info 两种统计口径
- **Activity** 按事件发生当天统计，用来观察花费节奏。
- **Cohort** 把每个转化归到带来该玩家的广告系列（最后点击，14 天窗口），用来判断广告系列的真实 CPA。不满 14 天的同期群（cohort）尚未成熟，数字还会继续变化。
:::

## 3. 常见问题诊断 {#_3-diagnose-common-problems}

| 现象 | 可能原因 | 怎么做 |
| --- | --- | --- |
| 几个小时后仍然没有展示 | 出价太低、定向太窄，或钱包余额已用完 | 检查余额；把出价提高 10–20%；增加地区 |
| 有展示，但花费远低于预算 | 在这个市场出价偏低 | 小步提高出价（约 10–20%） |
| 有展示，但点击很少（CTR 低） | 素材没效果 | 新增优惠或视觉不同的素材；暂停最弱的 |
| Pop：有展示，但 Visit Rate 低 | 落地页加载太慢，或页面上没装 Web 追踪器 | 确认页面在移动网络下 2 秒内加载完成，且 **Event Stream** 中能看到 `page_view` |
| 有点击或访问，但没有注册 | 落地页或追踪有问题 | 用手机打开页面，确认加载够快、内容与广告一致；检查 **Event Stream** 中是否出现 `register` |
| 你的后台有注册，RevoSurge 里却没有 | 追踪有遗漏 | 确认每个落地页域名都装了 Web 追踪器，且玩家注册时会触发 `register` |
| 有注册，但没有充值 | 没有接入充值追踪，或玩家质量不高 | 确认能正常收到充值事件（S2S 或 Partner Postback）；重新评估优惠和地区 |
| 广告系列停了 | 钱包余额用完，或已到结束日期 | 查看 Campaign 页面右上角的 **Balance**，请客户经理充值；检查排期 |

想确认网站发送了什么？打开 **Product → Setup Wizard** 中的 **Event Stream**，或参见 [Web 追踪器 → 在后台验证](/cn/tracking/web-tracker/install#step-5-verify-in-the-portal)。

![Setup Wizard 中的 Event Stream，显示每个域名收到了哪些事件](/img/handbook/web-tracker-event-stream.png)

## 4. 调整规则 {#_4-rules-for-changes}

- **等满 24 小时**再做任何改动，除非广告完全没有投放。
- **一次只改一处**，这样才知道结果是由什么引起的。
- **小步调整出价**，每次约 10–20%。
- 效果不好的素材**暂停，不要删除**，这样才能保留它们的数据。
- **第 7 天再看 CPA，别提前。** 广告系列还在学习时，早期 CPA 波动很大。等满一周的数据，再用 Cohort 视图来看。
- **第 7 天再做重大决定。** 要决定放量、换优惠还是停投，至少需要一周的数据。

**下一步：** [优化与放量](./optimise-and-scale)
