---
title: RevoSurge 合作方 Postback API
sidebar_label: 合作方 Postback API
description: 合作方 Postback 参考——端点、密钥认证、宏参数、响应约定、去重与重试规则。
---

# RevoSurge 合作方 Postback API

**受众：** 工程师、技术集成方、联盟／合作方经理

合作方 Postback API 让运营方或联盟平台能够从自己的后台把转化**回传给 RevoSurge**。Postback 是带查询串宏的普通 HTTP `GET` 回调——联盟后台本来就通用的格式——因此这次集成只是一次性的 URL 注册，而不是你这边的代码改动。

- 想从自己的服务器发送事件？请使用[服务器事件 API（v3）](/cn/tracking/s2s/v3/server-events-api)。
- 第一次接触 RevoSurge 追踪？从[追踪概述](/cn/tracking/overview)开始。

## Postback 与服务器事件 API 的区别

| | 合作方 Postback | [服务器事件 API（v3）](/cn/tracking/s2s/v3/server-events-api) |
|---|---|---|
| 由谁发起调用 | 你的联盟后台 | 你的后端 |
| 传输方式 | `GET` + 查询串宏 | `POST` + JSON 信封 |
| 认证 | `k` 参数中的静态密钥 | `X-API-KEY` 头 |
| 接入方式 | 按事件类型各注册一条 URL | 编写一套集成 |
| 适用于 | 后台本身就会发 postback 的运营方 | 需要完全掌控事件目录与负载 |

> [!TIP]
> 两者并不互斥。Postback 通常用于运营方后台掌握的结算事件（注册、充值、收入分成），而服务器事件 API 承载更丰富的产品内事件流。

## 基础 URL

| 环境 | 基础 URL |
|-------------|----------|
| 生产环境  | `https://<postback-host>` |

> [!NOTE]
> 确切的主机名、你的**合作方标识（partner slug）**与**密钥**由 RevoSurge 在对接时下发。下文一律以 `acme` 作为示例标识。

## 认证

每一条 postback 都必须在 `k` 查询参数中带上 RevoSurge 下发给你的静态密钥。

| 参数 | 必填 | 值 |
|-----------|----------|-------|
| `k` | 是 | 你的 postback 密钥 |

- 密钥采用恒定时间比较；不匹配返回 `403`，且该 postback **不会**被存储。
- RevoSurge 还可能把你的 postback 限制在**出口 IP 白名单**内。请在对接时告知你的出口地址，以免日后你侧的网络变更变成无声的 `403`。
- `k` 会从存储的事件中剥离，并在请求日志中脱敏，永远不会进入事件记录。

> [!WARNING]
> 密钥以明文出现在 URL 中，并且会保存在你的后台。请把它当作中等敏感度的共享密钥：不要在别处复用；一旦泄露，请向 RevoSurge 申请轮换。**轮换需要双方配合**——我们会先放行新密钥，你再切换，否则单方面轮换会让所有 postback 在后台更新前全部变成 `403`。

## 端点

RevoSurge 采用**本地 postback（local postback）**：每种事件类型一条 URL。**事件类型由 path 决定**——`event` 宏只作为交叉校验记录下来，绝不用于判定转化类型，因此你侧模板展开值的变化不会悄悄地把我们的转化重新归类。

<HttpMethod method="GET" path="/v1/pb/{partner}/registration" />

<HttpMethod method="GET" path="/v1/pb/{partner}/first-deposit" />

<HttpMethod method="GET" path="/v1/pb/{partner}/repeat-deposit" />

<HttpMethod method="GET" path="/v1/pb/{partner}/revenue" />

| 端点 | 记录为 | `reported_first` | 何时触发 |
|----------|-------------|------------------|--------------|
| `/registration` | `register` | — | 玩家账号创建——第一个带有玩家 id 的事件 |
| `/first-deposit` | `deposit` | `1` | 你的系统认定为该玩家首充的那笔充值 |
| `/repeat-deposit` | `deposit` | `0` | 之后的任意一笔充值 |
| `/revenue` | `partner_revenue` | — | 一次收入分成结算事件 |

四条 URL 的**参数集完全一致**——只有 path 不同——因此可以用同一份模板注册。

关于记录方式，有两点需要说明：

- **`first-deposit` 与 `repeat-deposit` 都存为 `deposit`**，你对"首充"的判断作为一个标志位保留，而不是当作事实。RevoSurge 会独立计算首充，两个口径之间的差值就是零成本的对账信号。
- **`revenue` 存为 `partner_revenue`，而不是 GGR。** 它是佣金金额，与运营方 GGR 相差一个分成比例；混为一谈是单位错误，而不是命名口味问题。

> [!WARNING]
> **不要在注册了 `first-deposit` 和 `repeat-deposit` 之后再注册 "all deposits"** ——那样每一笔充值都会被重复计算。
>
> **不要注册 global postback**（一条 URL、事件类型放在宏里）。事件类型已经在 path 里了。日后若新增事件类型，我们会另发一条 URL 给你。

## 参数

所有端点接受同一套参数。请把你后台的宏映射到这些参数名上——左侧的参数名是契约，右侧的宏语法是你侧的。

| 参数 | 必填 | 说明 |
|-----------|----------|-------------|
| `k` | 是 | 你的 postback 密钥（参见[认证](#认证)） |
| `click_id` | 是\* | RevoSurge 的 click id，从投放时携带的 sub 参数原样回传（通常是 `{sub1}`）。唯一的活动级归因锚点 |
| `user_id` | 是\* | 你侧的假名化玩家 id，用于把同一玩家的事件串起来 |
| `ctx` | 建议 | RevoSurge 的投放上下文，原样回传（通常是 `{sub2}`）。click id 超窗后的兜底归因 |
| `event_id` | 建议 | 你侧全局唯一的事件 id，用作去重键——参见[去重](#去重) |
| `txid` | 建议 | 交易 id，去重键的第二选择 |
| `event` | 建议 | 你自己的事件类型宏。仅作为与端点 path 的交叉校验记录，不用于判定类型 |
| `amount` | 充值与收入必填 | 金额，十进制数。**带符号**——参见[取值如何被解读](#取值如何被解读) |
| `ts` | 建议 | 事件时间，**unix 毫秒** |
| `country` | 可选 | 玩家国家 |
| `hash_id`、`hash_name` | 建议 | 你侧的链接／账号分类标识 |
| `source_id`、`source_name` | 建议 | 你侧的流量来源分类标识 |

\* **`click_id` 与 `user_id` 至少要有一个。** 两者皆无的 postback 无法定位到任何对象，会被丢弃（并返回 `200`——参见[响应](#响应)）。

未在此列出的参数会被**原样保留**在存储的事件上，因此你日后新增的宏无需我们改动即可送达。

### 为什么我们要那几个分类字段

对单账号集成而言，`hash_id`、`hash_name`、`source_id`、`source_name` 通常是**常量**，今天并不参与归因。我们仍然要求带上它们，原因是：

1. 出现不属于我们的值，意味着流量接错了——要么别人的流量被指向了我们的 URL，要么我们的流量被登记在了别的账号下。这一项已接入监控与告警。
2. 一旦集成扩展到多条链接，它们立刻就有意义。
3. 事后补一个宏意味着要在你的后台重新注册这些 URL。从第一天就带齐要便宜得多。

## 示例

### URL 模板

注册以下四条 URL，替换其中的主机名与密钥。`{...}` 里的值是**你后台的宏名**——下例采用常见的 `sub1`／`sub2` 约定。

```text
https://<postback-host>/v1/pb/acme/registration?k=<KEY>&click_id={sub1}&ctx={sub2}&event={event}&user_id={user_id}&event_id={event_id}&txid={transaction_id}&amount={amount}&ts={date}&country={country}&hash_id={hash_id}&hash_name={hash_name}&source_id={source_id}&source_name={source_name}

https://<postback-host>/v1/pb/acme/first-deposit?k=<KEY>&…相同的查询串…

https://<postback-host>/v1/pb/acme/repeat-deposit?k=<KEY>&…相同的查询串…

https://<postback-host>/v1/pb/acme/revenue?k=<KEY>&…相同的查询串…
```

### 一次实际触发

::: code-group

```bash [cURL]
curl -sS -o /dev/null -w '%{http_code}\n' -G \
  "https://<postback-host>/v1/pb/acme/first-deposit" \
  --data-urlencode "k=$REVOSURGE_POSTBACK_KEY" \
  --data-urlencode "click_id=8f1c2d5e-4a7b-4c31-9e0d-6b2f7a1c93de" \
  --data-urlencode "ctx=ctx_9931" \
  --data-urlencode "event=first_deposit" \
  --data-urlencode "user_id=p_88213" \
  --data-urlencode "event_id=evt_5f3c9a10" \
  --data-urlencode "txid=txn_554433" \
  --data-urlencode "amount=100.00" \
  --data-urlencode "ts=1718280000000" \
  --data-urlencode "country=BR"
```

```text [最终 URL]
https://<postback-host>/v1/pb/acme/first-deposit
  ?k=<KEY>
  &click_id=8f1c2d5e-4a7b-4c31-9e0d-6b2f7a1c93de
  &ctx=ctx_9931
  &event=first_deposit
  &user_id=p_88213
  &event_id=evt_5f3c9a10
  &txid=txn_554433
  &amount=100.00
  &ts=1718280000000
  &country=BR
```

:::

## 响应

我们会在**确认写入持久化存储之后**才作答。因此 `200` 意味着这条转化已被记录，而不只是被收到。

| 状态码 | 响应体 | 含义 | 是否重发 |
|--------|------|---------|---------|
| `200` | `{ "status": "ok" }` | 已存储并确认 | 否 |
| `200` | `{ "status": "ignored" }` | 负载没有可用的身份标识，没有可记录的对象 | 否——重发结果完全相同 |
| `503` | `{ "status": "unavailable" }` | 我们无法确认写入 | **是**——这是唯一重发有意义的情况 |
| `403` | — | 密钥错误，或来源 IP 不在白名单内 | 否——请先修正配置 |

> [!IMPORTANT]
> **我们绝不会因为负载问题返回 `4xx`。** `4xx` 通常会被理解为永久性错误，可能导致 postback 被整条停用——而原始 URL 已经保存在我们的请求日志里，格式有问题的 postback 实际上就是在那里被诊断的。若有 postback 被丢弃，你会从我们这里得到通知，而不是从状态码上看出来。

### 我们期待的重试策略

- 在 `503`、连接错误与超时的情况下重试。
- 使用指数退避，并且每次尝试都**携带同一个 `event_id`**，让重试折叠回原记录。
- 收到 `200` 或 `403` 时不要重试。

## 去重

每条 postback 都会被归约为一个**去重键（dedup key）**，产生相同键的重发会折叠到同一条记录上，而不是新增一条。键按以下顺序选取：

1. 有 `event_id` 就用 `event_id`；
2. 没有 `event_id` 就用 `txid`；
3. 都没有，则取整条查询串的哈希，并加 `h:` 前缀。

兜底方案刻意保守：它只能折叠**逐字节相同**的重发（参数顺序除外）。它是安全网，不能替代一个真正的 id。

> [!IMPORTANT]
> **请发送全局唯一且稳定的 `event_id`，并在每次重试时原样重复它。** 没有它，一条重试的收入事件与第二条真实的收入事件无法区分——而重试的充值会直接虚增结算金额。`event_id` 必须**跨事件类型唯一**，而不只是在单一类型内唯一。

## 取值如何被解读

| 字段 | 规则 |
|-------|------|
| `amount` | 按带符号的十进制数解析。**负值是合法的**——在收入分成下，运营方亏损的周期对应一次负的收入事件。原始字符串始终与解析值一并保留，因此解析失败也不会丢失这个数字 |
| 币种 | 结算币种为 **USD**，我们不期待 currency 宏。若你发来的 `currency` 参数不是 `USD`，它会被记录并作为契约变更上报，而不会被静默换算 |
| `ts` | **unix 毫秒。** 我们不会自动识别是秒还是毫秒：契约写的是毫秒，因此一个秒级的值本身就是"某处发生了偏移"的信号，猜测会把它掩盖掉。超出合理区间的时间会被存为空值，同时保留原始字符串 |
| 事件时效 | 超过 **30 天**的历史事件，或超过未来 **60 分钟**的事件，会被记录并标记，而不会被拒绝。在终身收入分成下，老玩家的收入事件正是这条集成存在的意义 |
| 未替换的宏 | 以字面宏形式到达的值（例如 `click_id={sub1}`）被视为缺失，而不是一个字符串。见下文 |

### 未替换的宏

URL 被粘进邮件或工单后，会被链接扫描器抓取，此时宏仍是字面量。若不处理，`click_id={sub1}` 就是一个非空字符串，会凭空造出一条看上去完全合法的转化。因此：

- `click_id` 或 `user_id` 中出现字面宏，**整条 postback 被丢弃**（`200 ignored`）。
- 其他参数中出现字面宏，只损失那一个字段；事件其余部分照常记录，字面值原样保留以便排查。

## 验证集成

在切真实流量之前，请确认以下四种行为：

```bash
HOST="<postback-host>"; KEY="<your-key>"

# 1. 正常路径——预期 200 {"status":"ok"}
curl -s "https://$HOST/v1/pb/acme/registration?k=$KEY&click_id=test-click-001&user_id=p_test"

# 2. 错误密钥——预期 403
curl -s -o /dev/null -w '%{http_code}\n' "https://$HOST/v1/pb/acme/revenue?k=WRONG"

# 3. 无身份标识——预期 200 {"status":"ignored"}
curl -s "https://$HOST/v1/pb/acme/registration?k=$KEY"

# 4. 未替换的宏——预期 200 {"status":"ignored"}
curl -s "https://$HOST/v1/pb/acme/registration?k=$KEY&click_id=%7Bsub1%7D"
```

随后请通过你的后台发送一条真实的测试转化，并请我们逐字段核对。有三项特别值得明确确认，因为其中任何一项出错都会产出"看起来干净、实则错误"的数据：

1. **`ts` 的单位与时区**——秒／毫秒混用可以正常解析，却会落到几十年之外。
2. **`event_id` 是否真的送达**——我们能测量哈希兜底被使用的比例，这个数字应当为零。
3. **`hash_id` 与 `source_id` 的实际值**——在我们记录下你的基线之前，漂移告警是静默的。
