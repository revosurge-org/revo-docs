---
title: 核心概念
description: 决定你的转化能否被计入、能否归到正确的广告系列、且只计一次的五条规则 —— 身份、点击关联、归因窗口、去重与首充。
---

# 核心概念

**受众：** 所有人。投放人员请阅读第 1、3、5 节；开发者请通读全部五节。

无论你用四种方式中的哪一种，你发来的事件最终如何处理，都由同样的五条规则决定。把这些做对，选哪种方式只是实现细节。做错了，每个请求照样成功，数字却一直悄无声息地出错 —— 这是追踪中代价最高的失败方式，因为没有任何东西会提醒你。

<nav class="article-toc" aria-label="本文内容">
<p class="article-toc-title">本文内容</p>

- [1. 一个用户，一个 ID](#_1-one-user-one-id)
- [2. 转化如何关联回广告](#_2-how-a-conversion-joins-back-to-an-ad)
- [3. 归因窗口](#_3-the-attribution-window)
- [4. 去重](#_4-deduplication)
- [5. 首充](#_5-first-deposits)
- [契约汇总](#the-contract-in-one-place)

</nav>

## 1. 一个用户，一个 ID {#_1-one-user-one-id}

**同一个人在你使用的每种方式中都必须带有相同的标识符。**

| 方式 | 字段 | 由谁设置 |
| --- | --- | --- |
| Web 追踪器 | `user_id` | 你，在登录或注册时 |
| S2S | `identity.client_user_id` | 你，在每个事件上 |
| AppsFlyer | Customer User ID | 你，在 SDK 中 |
| Partner Postback | `user_id` | 你的联盟平台 |

同一个字符串。同样的大小写。不能一处加前缀而其他处不加。在我们看来，`player_88213` 和 `88213` 是两个不同的人。

### 为什么这是本页代价最高的规则 {#why-this-is-the-most-expensive-rule-on-the-page}

ID 不一致时，什么都不会失败。每个请求都返回成功，每个事件都会被存下，只是报表是错的：

- 浏览器知道发生了一次点击，你的后台知道发生了一笔充值，但两者之间没有任何关联，于是这笔充值不会被计入带来它的广告系列。
- 同一个玩家以两个档案存在，一次注册可能被计两次。
- 玩家价值模型在割裂的历史上训练，恰恰在你购买它的那项工作上表现更差。

::: warning 事后修正无法修复过去
修正 ID 只能让新事件不再分裂。它不会合并已经分开创建的档案，也不会对入库时未能关联的充值重新归因。请在上线前检查，而不是等数字看起来不对时再查。
:::

### 用户尚未注册账户时 {#before-the-user-has-an-account}

改为发送 `identity.anonymous_id` —— 一个由你生成的稳定假名 ID，通常是第一方 cookie 或设备 ID。identity 中至少要带有 `client_user_id` 或 `anonymous_id` 之一。

玩家注册后，开始发送 `client_user_id`。如果你有 `anonymous_id`，继续同时发送。

## 2. 转化如何关联回广告 {#_2-how-a-conversion-joins-back-to-an-ad}

只有我们能判断出是哪条广告带来的转化，这个转化才有用。这种关联只有一个强关联键。

### `click_id` 是强关联键 {#click-id-is-the-strong-key}

访客从 RevoSurge 广告进入时，落地 URL 中会带有一个点击标识符。如果你用过 `fbclid` 或 `gclid`，原理相同。

**你需要这样处理它：**

1. 从落地 URL 中读取它
2. 把它与访客的会话关联存储，访客注册后再与其账户关联存储
3. 在第一个能识别用户的事件（通常是 `register`）上，以 `identity.click_id` 回传

Web 追踪器会替你捕获点击。**S2S 不会** —— 你的后台只知道你传给它的内容，所以点击 ID 必须一路从落地页经过数据库，完整传到事件中。大多数集成正是在这段交接中把它弄丢的。

::: info `click_id` 不能替代用户 ID
它把转化锚定到广告，`client_user_id` 把转化锚定到人。两者都需要 —— 只发送 `click_id` 并不满足身份要求。
:::

### 没有 `click_id` 时 {#when-there-is-no-click-id}

**没有回退方案。**

`click_id` 是 RevoSurge 支持的唯一确定性归因关联键。哈希邮箱、哈希手机号以及 IP + user-agent 匹配都**不**用于归因，`click_id` 之后也没有任何回退链。

没有 `click_id` 的转化仍会被记录 —— 只是可能不会被计入任何广告系列。

::: danger 这是归因丢失的头号原因
如果你把 `click_id` 当作可选项，就等于选择让你的转化不被归因。它是一条必需规则（`S2S-R-16`），而不是建议规则。

脆弱的环节不是 API 调用，而是交接：落地页 → 会话 → 数据库 → 事件。上线前，请用一次真实点击专门测试这条路径。
:::

### 不需要每个事件都带 `click_id` {#you-do-not-need-click-id-on-every-event}

点击把**用户**绑定到广告系列。在第一个能识别用户的事件上发送一次 `click_id`，之后同一个 `client_user_id` 的所有事件都会继承这个绑定。

| 事件 | 是否带 `click_id` | 是否归因？ |
| --- | --- | --- |
| `register` | 是 | 是 —— 正是它把用户绑定到广告系列 |
| `login` | 否 | 是，通过同一个 `client_user_id` |
| `deposit` | 否 | 是，通过同一个 `client_user_id` |

正因如此，第 1 节是整套规则的基石，而不只是锦上添花。**绑定随用户标识符传递。** 如果你的 `deposit` 带的 `client_user_id` 与已归因的 `register` 不同，在我们看来它属于另一个人，什么也继承不到。

所以这两条规则的影响会叠加：`click_id` 出错损失一个转化；`client_user_id` 出错损失该用户今后的所有转化。

::: warning 绑定不会超出窗口
绑定与归因窗口是两个独立的限制，二者同时生效。已绑定用户的充值如果在广告互动 14 天之后才到达，仍会被记录，但不会被归因 —— 参见 [3. 归因窗口](#_3-the-attribution-window)。

对 iGaming 而言，值得用你自己的数据核对这一点。如果首充通常在点击两周之后才发生，已绑定也救不了它们。
:::

## 3. 归因窗口 {#_3-the-attribution-window}

**转化在广告互动后 14 天内到达，才会被归因到 RevoSurge 广告系列。** 点击和展示都会开启窗口。

注册与首充的窗口相同，都是 14 天。

### 用户既点击过又看过广告时 {#when-a-user-both-clicked-and-saw-an-ad}

**计入点击。** 只有在窗口内的路径中没有点击时，才会计入展示。

因此，用户第 1 天点击、第 10 天看到一次展示、第 12 天充值，这笔充值计入第 1 天的点击。

### 迟到的转化 {#conversions-that-arrive-late}

**它们仍会被记录，只是不会归因到广告系列。** 它们保留在你的事件数据和你自己的报表中，但不会计入任何广告系列。

这带来一个实际影响，而且与大家通常以为的恰恰相反：

::: tip 迟到的事件照样发送 —— 不要按时间过滤
一笔因为"看起来太旧、无关紧要"而被你扣下的充值，是永久丢失的数据。你发出的充值无论如何都会被记录，并且仍会参与首充判定（第 5 节）、玩家价值以及你自己的对账。

时间长短唯一影响的，是广告系列能否获得归因。
:::

## 4. 去重 {#_4-deduplication}

不同方式对重复发送的处理方式不同。在构建重试逻辑之前，先弄清楚你依赖的是哪一种。

| 方式 | 去重键 | 同一事件重发时 |
| --- | --- | --- |
| Partner Postback | `event_id`，其次 `txid`，再次查询字符串的哈希 | 合并到原事件 |
| S2S —— 资金类事件 | `context.transaction_id` | 合并到原事件 |
| S2S —— 其他事件 | 无 | **产生第二个事件** |
| Web 追踪器 | 无 | 产生第二个事件 |

### 实际意味着什么 {#what-this-means-in-practice}

- **使用 Partner Postback 时**，请发送全局唯一且稳定的 `event_id`，并在每次重试时原样重复。查询字符串哈希只是最后的回退手段，不是安全网 —— 参数顺序一变，同一个转化就会被计两次。
- **使用 S2S 时**，`deposit`、`withdraw` 和 `bet` 可以安全重试，因为 `context.transaction_id` 能识别它们。其他事件**不具备幂等性** —— 只在请求确实失败时才重试，绝不要预防性地重试。

### 两种方式上报同一个转化时 {#when-two-methods-report-the-same-conversion}

按优先级处理：**S2S → Partner Postback → Web 追踪器**，金额只取自 S2S。

但优先级是安全网，不是设计。用两种方式上报同一事件，意味着同样的东西要建两遍，并且永远要对账两个来源。请为每个事件选定一个系统作为唯一可信来源 —— 参见[选择你的方案](/cn/tracking/overview#_2-2-which-system-holds-your-conversion-data)。

## 5. 首充 {#_5-first-deposits}

**S2S 中没有首充事件，也没有首充标记。** 每笔充值都以 `deposit` 发送，首充由此推导为**我们为该用户收到的最早一笔 `deposit`**。

Partner Postback 是例外：它有独立的 `/first-deposit` 和 `/repeat-deposit` 端点，你向哪个路径发送就决定了分类。

`deposit_initiated` 永远不是首充。它记录的是一次进入收银台的尝试，而不是一笔已结算的支付。

### 如果你已有存量玩家，上线前请阅读 {#if-you-already-have-players-read-this-before-you-launch}

首充是**我们见到的**最早一笔 —— 而不是实际存在的最早一笔。

在你开启追踪的那天，存量玩家的下一笔充值是我们为其收到的第一笔，因此会被计为首充。拥有大量存量用户的运营方会在第一周看到一波首充激增，但这并不是真实的获客 —— 如果某个广告系列以首充为优化目标，出价就会去追逐它。

**先回填。** 上线前，通过 `/v3/s2s/batch` 发送你的历史充值。超出归因窗口的数据会被记录但不会被归因（第 3 节），因此它能确立真实的首充，又不会把功劳记给并未带来这些充值的广告系列。

如果无法回填，请与你的客户经理商定一个截止日期，并在第一个报告周期内剔除已知玩家的首充。

## 契约汇总 {#the-contract-in-one-place}

以上内容汇总为一份清单：

- [ ] 同一个人在每种方式中都带有相同的标识符
- [ ] 每个事件都有已注册的 `event` 名称和有效的毫秒级 `timestamp`
- [ ] 每个事件都带有 `client_user_id`，注册前则带 `anonymous_id`
- [ ] 在落地时捕获 `click_id`，并在 `register` 和第一笔 `deposit` 上回传
- [ ] 资金类事件带有 `context.transaction_id`，重试时合并而不是重复
- [ ] Partner Postback 事件带有稳定的 `event_id`，重试时原样重复
- [ ] 事件在发生时即发送 —— 包括迟到的事件
- [ ] 如果产品已有存量玩家，上线前已回填历史充值
- [ ] 每个事件只有一个系统作为唯一可信来源

## 下一步 {#next-steps}

- [追踪概述](/cn/tracking/overview) —— 四种方式，以及你需要哪种组合
- [S2S 集成校验](/cn/tracking/s2s/validation) · [Partner Postback 集成校验](/cn/tracking/postback/validation) ——
  上线前检查的规则
- [标准事件](/cn/tracking/s2s/v3/events-standard) · [iGaming 事件](/cn/tracking/s2s/v3/events-igaming) ——
  事件目录
