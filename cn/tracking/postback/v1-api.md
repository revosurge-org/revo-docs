---
title: "Partner Postback API (v1)"
description: "Partner Postback v1 的预定义事件路径、查询参数、校验、响应及交付规则。"
---

# Partner Postback API (v1)

若平台支持 v1 的预定义事件路径和查询参数，可以继续使用 v1。参见[版本比较](/cn/tracking/postback/overview#choose-version)及[设置与测试指南](/cn/tracking/postback/setup-postback)。

## v1 兼容参考 {#v1-compatibility}

以下内容仅适用于五条 v1 路径。现有 v1 接入可继续使用；只修改 query 名或增加 `event` 不会变成 v2。原章节锚点继续保留。

### Postback 与服务器事件 API 的区别

| | 合作方 Postback | [服务器事件 API（v3）](/cn/tracking/s2s/v3/server-events-api) |
|---|---|---|
| 由谁发起调用 | 你的联盟后台 | 你的后端 |
| 传输方式 | `GET` + 查询串宏 | `POST` + JSON 信封 |
| 认证 | `k` 参数中的静态密钥 | `X-API-KEY` 头 |
| 接入方式 | 按事件类型各注册一条 URL | 编写一套集成 |
| 适用于 | 后台本身就会发 postback 的运营方 | 需要完全掌控事件目录与负载 |

> [!TIP]
> 两者并不互斥。Postback 通常用于运营方后台掌握的结算事件（注册、充值、收入分成），而服务器事件 API 承载更丰富的产品内事件流。

### 基础 URL

| 环境 | 基础 URL |
| --- | --- |
| 生产 | `https://mmp.revosurge.com` |

v1 路径中的 `{partner}` 可以是 Postback Connection ID，也可以是 RevoSurge 配置的 legacy partner slug。使用为你的接入分配的标识和密钥。

### 认证

在 `k` 中发送匹配的密钥。Connection ID 使用[上方](/cn/tracking/postback/v2-api#v2-authentication)说明的 ACTIVE／RETIRING key、启停和轮换宽限规则；v1 Connection 可以关联多个产品。Connection 参数别名在 v1 解析前应用；别名与原名冲突时别名优先，保留原始输入。`k`、`dryrun`、`testmode` 不可重映射。

legacy partner 凭证仍由 RevoSurge 单独配置，可带出口 IP 白名单；Connection 路径不继承此 legacy 白名单。错误／过期 key、停用 Connection 或不允许的 legacy IP 返回 `403`。鉴权后的限流返回 `429` 和 `Retry-After`。

密钥保存在服务端配置中，分享 URL 时遮盖。`k` 不进入业务原始输入，请求审计会脱敏。

<a id="endpoints"></a>

### 端点

RevoSurge 采用**本地 postback（local postback）**：每种事件类型一条 URL。**事件类型由 path 决定**——`event` 宏只作为交叉校验记录下来，绝不用于判定转化类型，因此你侧模板展开值的变化不会悄悄地把我们的转化重新归类。

<HttpMethod method="GET" path="/v1/pb/{partner}/registration" />

<HttpMethod method="GET" path="/v1/pb/{partner}/first-deposit" />

<HttpMethod method="GET" path="/v1/pb/{partner}/repeat-deposit" />

<HttpMethod method="GET" path="/v1/pb/{partner}/revenue" />

<HttpMethod method="GET" path="/v1/pb/{partner}/app-launch" />

| 端点 | 记录为 | `reported_first` | 何时触发 |
|----------|-------------|------------------|--------------|
| `/registration` | `register` | — | 玩家账号创建——第一个带有玩家 id 的事件 |
| `/first-deposit` | `deposit` | `1` | 你的系统认定为该玩家首充的那笔充值 |
| `/repeat-deposit` | `deposit` | `0` | 之后的任意一笔充值 |
| `/revenue` | `partner_revenue` | — | 一次收入分成结算事件 |
| `/app-launch` | `app_launch` | — | App 的**每一次**启动——参见 [App 启动](#app-启动) |

五条 URL 的**参数集完全一致**——只有 path 不同——因此可以用同一份模板注册。只需注册你实际会发送的事件对应的端点。

关于记录方式，有三点需要说明：

- **`first-deposit` 与 `repeat-deposit` 都存为 `deposit`**，你对"首充"的判断作为一个标志位保留，而不是当作事实。RevoSurge 会独立计算首充，两个口径之间的差值就是零成本的对账信号。
- **`revenue` 存为 `partner_revenue`，而不是 GGR。** 它是佣金金额，与运营方 GGR 相差一个分成比例；混为一谈是单位错误，而不是命名口味问题。
- **`app-launch` 存为 `app_launch`，绝不记为安装（install）。** 它是活跃信号，不是转化——详见下文。

> [!WARNING]
> **不要在注册了 `first-deposit` 和 `repeat-deposit` 之后再注册 "all deposits"** ——那样每一笔充值都会被重复计算。
>
> **不要注册 global postback**（一条 URL、事件类型放在宏里）。事件类型已经在 path 里了。日后若新增事件类型，我们会另发一条 URL 给你。

#### App 启动

`/app-launch` 回传的是 App 内的活跃，而不是转化。请在**每一次**启动时触发——不只是安装后的首次启动，也不是每个玩家只发一次。

- **它不是安装。** App 安装通过你的 MMP 回传给 RevoSurge（参见 [AppsFlyer](/cn/mmp/appsflyer/overview)）。启动一律记为 `app_launch`，绝不计入安装，因此启动 postback 不会与 MMP 已上报的安装重复计算。请不要把安装 postback 指向这条 URL。
- **如果你的后台会标记首次启动**，仍然发到 `/app-launch`，并把你自己的标志作为额外参数带上，参数名请与你的客户经理约定。未列出的参数会被[原样保留](#参数)，因此这个标志无需我们改动即可送达——但它不会把一次启动变成安装。
- **不带 `amount`。** 启动没有金额；该宏留空或省略即可。
- **身份规则同样适用。** 既没有 `click_id` 也没有 `user_id` 的启动——例如玩家注册之前、而你的平台又拿不到 click id 的那次启动——会被丢弃，并返回 `200 {"status":"ignored"}`。请用你的真实模板做一次 [dry run](#dry-run)，确认你的启动回传实际带了哪些身份。
- **每次启动发送唯一的 `event_id`。** 启动天然会重复：若没有 `event_id`（或 `txid`）和 `ts`，同一玩家的两次启动可能生成完全相同的 URL，被合并成一条记录。参见[去重](#去重)。
- **响应约定相同。** `/app-launch` 的响应与各转化端点完全一致，包括 `503`——按同样的方式重试，你的后台只需维护一条重试规则。

<a id="parameters"></a>

### 参数

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
| `currency` | 非 USD 金额时建议 | 原声明币种；缺失／空白默认为 USD。参见下方换算规则 |
| `ts` | 建议 | 事件时间，**unix 毫秒** |
| `country` | 可选 | 玩家国家 |
| `attribution_share` | 可选 | 你方声明的本次转化归因份额——参见[你方声明字段的含义](#你方声明字段的含义) |
| `is_new_customer` | 可选 | 你方声明该玩家对**你们**是新客。接受 `1`/`0`、`true`/`false`、`yes`/`no` |
| `first_deposit_ts` | 可选 | 你方声明的首存时刻，**unix 毫秒**——与 `ts` 同单位、同解析规则 |
| `hash_id`、`hash_name` | 建议 | 你侧的链接／账号分类标识 |
| `source_id`、`source_name` | 建议 | 你侧的流量来源分类标识 |

\* **`click_id` 与 `user_id` 至少要有一个。** 两者皆无的 postback 无法定位到任何对象，会被丢弃（并返回 `200`——参见[响应](#响应)）。

在 v1 中，缺失或未展开的 `user_id` 视为未提供，有效 `click_id` 可用于回填（`userIdBackfilled=true`）。`click_id` 中出现字面宏时，即使另有身份也会丢弃事件。能提供时请发送真实稳定的 `user_id`；click 回填不能证明玩家身份稳定。v2 没有此回填。

未在此列出的参数会被**原样保留**在存储的事件上，因此你日后新增的宏无需我们改动即可送达。

#### 你方声明字段的含义

`attribution_share`、`is_new_customer`、`first_deposit_ts` 是**你方的声明**。RevoSurge 会把它们记录在我方自行计算的结果**旁边**，而不是用来替代它。

三者都是**可选**的，且**新增它们不需要重新注册现有 URL**——已注册的链接一切照旧，我方收不到的参数只会记为空值。若你是首次注册，建议现在就把它们加进模板，以免日后再付一次重新注册的成本：

```text
&attribution_share={attribution_share}&is_new_customer={is_new_customer}&first_deposit_ts={first_deposit_ts}
```

- **`attribution_share` 原样存储。** 契约并未声明它的标度——`0.5` 与 `50` 都读作"一半"——因此 RevoSurge 既不做换算，也不会用它去乘任何金额。在有人依赖这个数字之前，请先与我们明确约定标度。
- **`is_new_customer` 是你方的判断，不是我方的首充计算。** 我方仍然独立判定首次充值；两者的差值是对账信号，不是错误。我方读不懂的值会记为空值，绝不记为 `0`——"你说不是"和"我方读不懂"不能塌缩成同一个答案。
- **`first_deposit_ts` 完全遵循 `ts` 的规则。** 参见[取值如何被解读](#取值如何被解读)。

#### 为什么我们要那几个分类字段

对单账号集成而言，`hash_id`、`hash_name`、`source_id`、`source_name` 通常是**常量**，今天并不参与归因。我们仍然要求带上它们，原因是：

1. 出现不属于我们的值，意味着流量接错了——要么别人的流量被指向了我们的 URL，要么我们的流量被登记在了别的账号下。这一项已接入监控与告警。
2. 一旦集成扩展到多条链接，它们立刻就有意义。
3. 事后补一个宏意味着要在你的后台重新注册这些 URL。从第一天就带齐要便宜得多。

### 示例

#### URL 模板

为你发送的每个事件注册一条 URL，替换其中的合作方标识与密钥。`{...}` 里的值是**你后台的宏名**——下例采用常见的 `sub1`／`sub2` 约定。

```text
https://mmp.revosurge.com/v1/pb/{partner}/registration?k=<KEY>&click_id={sub1}&ctx={sub2}&event={event}&user_id={user_id}&event_id={event_id}&txid={transaction_id}&amount={amount}&ts={date}&country={country}&hash_id={hash_id}&hash_name={hash_name}&source_id={source_id}&source_name={source_name}

https://mmp.revosurge.com/v1/pb/{partner}/first-deposit?k=<KEY>&…相同的查询串…

https://mmp.revosurge.com/v1/pb/{partner}/repeat-deposit?k=<KEY>&…相同的查询串…

https://mmp.revosurge.com/v1/pb/{partner}/revenue?k=<KEY>&…相同的查询串…

https://mmp.revosurge.com/v1/pb/{partner}/app-launch?k=<KEY>&…相同的查询串…
```

#### 一次实际触发

::: code-group

```bash [cURL]
curl -sS -o /dev/null -w '%{http_code}\n' -G \
  "https://mmp.revosurge.com/v1/pb/{partner}/first-deposit" \
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
https://mmp.revosurge.com/v1/pb/{partner}/first-deposit
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

<a id="responses"></a>

### 响应

以下为 **v1 live** 响应。业务目的流启用且采用默认同步确认时，`200 ok` 在 broker ACK 后返回。历史异步兼容模式或人为关闭业务目的流时，也可能返回 `200 ok` 而没有确认业务发布。交接时核对实际配置和送达证据，单看 `200` 不够。

| 状态码 | 响应体 | 含义 | 是否重发 |
| --- | --- | --- | --- |
| `200` | `{ "status": "ok" }` | 按实际 v1 发布配置接受 | 不自动重试 |
| `200` | `{ "status": "ignored" }` | 无可用身份或 click 宏拒收；无业务事件 | 修正输入 |
| `503` | `{ "status": "unavailable" }` | 发布未确认；超时后可能晚到 | 保留来源 ID 重试 |
| `403` | 现有鉴权响应 | key／Connection 错误或 legacy IP 不允许 | 修正配置 |
| `429` | 现有限流响应 | 鉴权后限流 | 遵循 `Retry-After` |

v1 的宽容准入失败不返回负载 `4xx`；此规则不适用于 v2。

#### 我们期待的重试策略

对 `503`、连接错误和超时使用指数退避，保留 `event_id`、`txid`、来源时间和业务值。`429` 遵循 `Retry-After`。修正 `403` 后再发，不自动重试 `200`。来源键为下游去重提供依据，不代表去重已经完成。

### 去重

来源键优先级为 `event_id`，其次 `txid`，否则为 `h:` 加上解码后的 raw 参数按名称排序、以 `k=v` 对拼接后的 SHA-256。参数顺序变化不改变兜底键，业务值或时间变化可能改变。鉴权和模式参数排除在外。Connection 加 `<connectionId>:` 前缀，legacy partner 保留无前缀形式。

发送跨事件类型全局唯一且稳定的 `event_id`，重试时原样复用。生成键本身不合并记录，业务去重由下游消费者执行。v1/v2 的哈希表示不同，双发不保证自动去重。

### 取值如何被解读

| 字段 | 规则 |
|-------|------|
| `amount` | 按带符号的十进制数解析。**负值是合法的**——在收入分成下，运营方亏损的周期对应一次负的收入事件。原始字符串始终与解析值一并保留，因此解析失败也不会丢失这个数字 |
| 币种 | 发送原 `amount` 和 `currency`，缺失／空白币种默认为 USD。启用换算补充后，受支持币种使用可用的金融汇率快照；USD 和 USDT 使用明确的同币／1:1 策略。汇率不可用时来源事件仍发送。保留来源字段并检查 `revosurge_currency_conversion_status`，成功的 `revosurge_target_amount` 才是派生 USD 金额。旧 `amount` 仍为传入数字，旧 `currency` 仍为 USD，不能据此判定已经换汇 |
| `ts` | **unix 毫秒**，这一点没有变。若我方收到秒级值，会归一化后记录事件时间——但这次纠正会被视为**契约偏离**：它会触发我方告警，我们会与你联系。它不是第二种受支持的格式，请不要依赖它。两种读法都不成立的值（超出合理范围、负数、非数字）**无法恢复事件时间**：该事件将没有时间戳，仅保留原始字符串 |
| `first_deposit_ts` | 与 `ts` 的规则完全一致——同单位、同纠正、同告警 |
| `attribution_share` | 原样记录，绝不换算标度，也绝不用它乘任何金额——参见[你方声明字段的含义](#你方声明字段的含义) |
| 事件时效 | 超过 **30 天**的历史事件，或超过未来 **60 分钟**的事件，会被记录并标记，而不会被拒绝。在终身收入分成下，老玩家的收入事件正是这条集成存在的意义 |
| 未替换的宏 | 以字面宏形式到达的值（例如 `click_id={sub1}`）被视为缺失，而不是一个字符串。见下文 |

#### 未替换的宏

URL 被粘进邮件或工单后，会被链接扫描器抓取，此时宏仍是字面量。若不处理，`click_id={sub1}` 就是一个非空字符串，会凭空造出一条看上去完全合法的转化。因此：

- `click_id` 中出现字面宏会**丢弃整条 v1 postback**（`200 ignored`）。
- 缺失／未展开的 `user_id` 视为未提供，有效 click ID 可回填；两种身份都不可用时忽略事件。
- 其他未展开字段从解析值省略，原始输入保留供排查。

### Dry run

在 v1 URL 后加 `dryrun=1`，获取解析／准入判定，不发布业务事件。通过鉴权及限流的探测返回 `200` 和 `X-Ingest-Mode: dryrun`；鉴权错误仍为 `403`，限流仍为 `429`。裸 `dryrun` 和 `dryrun=true` 启用，`0`、`false`、`no` 关闭，dryrun 优先于 `testmode`。约定的 live 切换前移除两个参数。

#### 为什么需要它

v1 live 准入失败返回 `200 ignored`，v1 dryrun 通过 `decision=dropped` 和 `reason` 区分原因；合法判定使用 `decision=accepted`。这与 v2 的 `status=validated/rejected` 契约不同。

#### 判定结果

```bash
curl -sS -G "https://mmp.revosurge.com/v1/pb/{partner}/first-deposit" \
  --data-urlencode "k=$REVOSURGE_POSTBACK_KEY" \
  --data-urlencode "click_id=8f1c2d5e-4a7b-4c31-9e0d-6b2f7a1c93de" \
  --data-urlencode "event_id=docs-v1-deposit-1" \
  --data-urlencode "amount=12.34" --data-urlencode "currency=USD" \
  --data-urlencode "ts=1794801600000" --data-urlencode "dryrun=1"
```

```json
{
  "mode": "dryrun",
  "partner": "example-partner",
  "route": "first_deposit",
  "decision": "accepted",
  "stored": false,
  "eventName": "deposit",
  "reportedFirst": 1,
  "dedupKey": "docs-v1-deposit-1",
  "dedupKeySource": "event_id",
  "clickId": "8f1c2d5e-4a7b-4c31-9e0d-6b2f7a1c93de",
  "userId": "8f1c2d5e-4a7b-4c31-9e0d-6b2f7a1c93de",
  "userIdBackfilled": true,
  "unreplacedMacros": [],
  "eventUnixTs": 1794801600,
  "eventTimeRaw": "1794801600000",
  "coercedTimeFields": [],
  "amount": 12.34,
  "currency": "USD"
}
```

此 v1 示意探测未提供 `user_id`，有效 click ID 被回填。dryrun 的 `stored=false` 符合预期。v1 `testmode` 的 `stored=true` 表示已提交到启用的隔离流，不具有 v2 同步确认的保证。

| 字段 | 含义 |
| --- | --- |
| `route`、`eventName`、`eventDeclared`、`reportedFirst` | 路径决定的事件及可选来源声明 |
| `decision`、`reason` | `accepted` 或 `dropped`；丢弃原因为 `unreplaced_macro`、`empty_request`、`no_identity` |
| `dedupKey`、`dedupKeySource` | 来源键，适用时带 Connection 作用域；来源为 `event_id`、`transaction_id` 或 `raw_hash` |
| `clickId`、`userId`、`userIdBackfilled` | 解析后的身份及是否使用 click→user 回填 |
| `eventUnixTs`、`eventTimeRaw`、`coercedTimeFields` | 解析时间、原值和纠正过的输入字段；目标是纠正列表为空 |
| `amount`、`currency`、`unexpectedCurrency` | 旧解析数字、旧 USD 标签及非 USD 声明信号；不表示换算目标金额 |
| `recorded`、`unreplacedMacros` | 原始业务输入及宏诊断 |
| `productResolution`、`flags`、`warnings` | 存在时表示 Connection 关联和映射诊断 |

换算结果须检查业务记录的 `revosurge_source_*`、`revosurge_target_*` 和换算状态，v1 verdict 不展示完整 FX 结果。

### 验证集成

检查一条真实负载最快的办法是 [dry run](#dry-run)——它会返回判定结果、去重键与我方解析出的身份标识，而不记录任何内容。

在切真实流量之前，请确认以下四种行为：

```bash
KEY="<your-key>"

# 1. 正常路径——预期 200 {"status":"ok"}
curl -s "https://mmp.revosurge.com/v1/pb/{partner}/registration?k=$KEY&click_id=test-click-001&user_id=p_test"

# 2. 错误密钥——预期 403
curl -s -o /dev/null -w '%{http_code}\n' "https://mmp.revosurge.com/v1/pb/{partner}/revenue?k=WRONG"

# 3. 无身份标识——预期 200 {"status":"ignored"}
curl -s "https://mmp.revosurge.com/v1/pb/{partner}/registration?k=$KEY"

# 4. 未替换的宏——预期 200 {"status":"ignored"}
curl -s "https://mmp.revosurge.com/v1/pb/{partner}/registration?k=$KEY&click_id=%7Bsub1%7D"
```

随后请通过你的后台发送一条真实的测试转化，并请我们逐字段核对。有三项特别值得明确确认，因为其中任何一项出错都会产出"看起来干净、实则错误"的数据：

1. **`ts`（以及若你发送 `first_deposit_ts`）的单位与时区**——请发毫秒。秒级值会被纠正，但那会计为一次契约偏离，我们会来找你；两种读法都不成立的值会让该事件完全没有时间。
2. **`event_id` 是否真的送达**——我们能测量哈希兜底被使用的比例，这个数字应当为零。
3. **`hash_id` 与 `source_id` 的实际值**——在我们记录下你的基线之前，漂移告警是静默的。
