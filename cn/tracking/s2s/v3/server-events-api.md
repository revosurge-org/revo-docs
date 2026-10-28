---
title: RevoSurge 服务器事件 API（v3）
sidebar_label: 服务器事件 API（v3）
description: S2S Events v3 参考——信封、端点、认证、批量接入、校验响应与限流。
---

# RevoSurge 服务器事件 API（v3）

**受众：** 工程师、技术集成方、管理团队

服务器事件 API 让合作伙伴能够直接从其服务器安全地向 DataPulse 平台发送用户事件。**v3** 引入了**型别化事件目录**——事件与字段均预先登记并在接入时校验——以及结构化的请求**信封**。

- 第一次接触？从[请求信封与基础属性](/cn/tracking/s2s/v3/mandatory-properties)开始。
- 浏览事件：[标准事件](/cn/tracking/s2s/v3/events-standard) · [iGaming 事件](/cn/tracking/s2s/v3/events-igaming) · [Crypto 事件](/cn/tracking/s2s/v3/events-crypto)。
- 校验如何运作：[事件目录与校验](/cn/tracking/s2s/v3/catalog-governance)。
- 目前在用 v2？参见[从 v2 迁移](/cn/tracking/s2s/v3/migration)。

## 基础 URL

基础 URL 与 v2 保持不变。

| 环境 | 基础 URL |
|-------------|----------|
| 生产环境  | `https://datapulse-api.revosurge.com/` |

## 认证

每个请求都必须在 `X-API-KEY` 头中包含你的 API 密钥。

| 头 | 必填 | 值 |
|--------|----------|-------|
| `X-API-KEY` | 是 | 你的 API 密钥 |
| `Content-Type` | 是 | `application/json` |

> 关于如何获取密钥，请参见 [API 密钥](/cn/api/api-key)。认证与 v2 保持不变。

## 请求信封

一个 v3 事件是一个包含四个部分的 JSON 对象——`event`、`timestamp`、`identity` 和 `context`：

```json
{
  "event": "deposit",
  "timestamp": 1718280000000,
  "identity": {
    "client_user_id": "user_001",
    "click_id": "RS_clk_998877"
  },
  "context": {
    "ip_address": "203.0.113.1",
    "transaction_id": "txn_554433",
    "amount": 100.0,
    "currency": "USD",
    "is_crypto": false,
    "payment_method": "pix"
  }
}
```

完整的字段规则参见[请求信封与基础属性](/cn/tracking/s2s/v3/mandatory-properties)。简而言之：

- `event`（String，必填）——一个**已登记**的事件名称。未知名称会被拒绝。
- `timestamp`（Number，必填）——**UTC 纪元毫秒**（13 位数字）。
- `identity`（Object，必填）——必须**至少包含** `client_user_id` 或 `anonymous_id` 之一。仅有 `click_id` 是不够的。
- `context`（Object）——事件特定字段。PII 放在 `context.privacy.*` 下，且必须经过 SHA-256 哈希。

## 接入端点

### 单个事件

<HttpMethod method="POST" path="/v3/s2s/event" />

请求体是一个单独的信封对象。

::: code-group

```bash [cURL]
curl -X POST "https://datapulse-api.revosurge.com/v3/s2s/event" \
  -H "Content-Type: application/json" \
  -H "X-API-KEY: dp_test_key_123" \
  -d '{
    "event": "deposit",
    "timestamp": 1718280000000,
    "identity": { "client_user_id": "user_001", "click_id": "RS_clk_998877" },
    "context": {
      "ip_address": "203.0.113.1",
      "transaction_id": "txn_554433",
      "amount": 100.0,
      "currency": "USD"
    }
  }'
```

```js [Node.js]
const res = await fetch("https://datapulse-api.revosurge.com/v3/s2s/event", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-API-KEY": process.env.REVOSURGE_API_KEY,
  },
  body: JSON.stringify({
    event: "deposit",
    timestamp: Date.now(),
    identity: { client_user_id: "user_001", click_id: "RS_clk_998877" },
    context: {
      ip_address: "203.0.113.1",
      transaction_id: "txn_554433",
      amount: 100.0,
      currency: "USD",
    },
  }),
});
```

```python [Python]
import os, time, requests

requests.post(
    "https://datapulse-api.revosurge.com/v3/s2s/event",
    headers={"X-API-KEY": os.environ["REVOSURGE_API_KEY"]},
    json={
        "event": "deposit",
        "timestamp": int(time.time() * 1000),
        "identity": {"client_user_id": "user_001", "click_id": "RS_clk_998877"},
        "context": {
            "ip_address": "203.0.113.1",
            "transaction_id": "txn_554433",
            "amount": 100.0,
            "currency": "USD",
        },
    },
)
```

:::

### 批量

<HttpMethod method="POST" path="/v3/s2s/batch" />

请求体是一个**裸 JSON 数组**，由信封组成（而不是带 `events` 键的对象）。每个请求最多 **600** 个事件。

```json
[
  { "event": "login",   "timestamp": 1718280000000, "identity": { "client_user_id": "user_001" }, "context": { "ip_address": "203.0.113.1" } },
  { "event": "deposit", "timestamp": 1718280001000, "identity": { "client_user_id": "user_001" }, "context": { "ip_address": "203.0.113.1", "transaction_id": "txn_1", "amount": 100.0, "currency": "USD" } }
]
```

> [!NOTE]
> 超过 600 个事件会返回 `400 BATCH_TOO_LARGE`。

## 响应

成功时，事件会被**异步排队**（HTTP `202`）。

| 端点 | 状态 | 响应体 |
|----------|--------|------|
| 单个 | `202 Accepted` | `{ "status": "accepted", "eventId": "..." }` |
| 批量 | `202 Accepted` | `{ "status": "accepted", "requestId": "...", "count": 150 }` |

带 `?dryrun=1` 或 `X-Test-Mode: true` 时，成功的调用返回 `200`——参见 [Dry run](#dry-run) 与 [测试模式](#test-mode)。

### 错误

`/v3/s2s/*` 上的错误会返回一个结构化的响应体，包含一个 `code` 和一个 `violations[]` 数组：

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Envelope validation failed",
  "violations": [
    { "field": "timestamp", "rule": "not_milliseconds", "event": "deposit" },
    { "field": "context.amount", "rule": "type", "event": "deposit" }
  ]
}
```

| 状态 | 代码 | 含义 |
|--------|------|---------|
| `400` | `VALIDATION_ERROR` | 缺失/无效字段、错误的时间戳、格式错误的 PII、类型不匹配 |
| `400` | `BATCH_TOO_LARGE` | 一个批量中超过 600 个事件 |
| `422` | `UNKNOWN_EVENT_TYPE` | `event` 不是已登记的目录事件 |
| `422` | `EVENT_DISABLED` | 事件存在但对你的产品已禁用 |
| `429` | — | 超出限流（`{ "error": "Too Many Requests" }`） |

关于目录如何驱动这些检查，参见[事件目录与校验](/cn/tracking/s2s/v3/catalog-governance)。

## Dry run

在任一接入端点上加 `?dryrun=1`，即可端到端地检查一条请求而不产生任何数据。我们会完全按生产路径解析、鉴权、按目录校验并富化它，把将要写入的那条记录原样回显，然后什么都不存。

| 端点 | Dry run URL |
|----------|-------|
| 单条 | `POST /v3/s2s/event?dryrun=1` |
| 批量 | `POST /v3/s2s/batch?dryrun=1` |

裸写 `dryrun` 与 `dryrun=true` 含义相同。`dryrun=0`、`dryrun=false`、`dryrun=no` 表示不启用。

### 如何把 dry run 与真实写入区分开

| 调用 | 状态 | 响应体 | 响应头 |
|----------|--------|------|------|
| 真实写入 | `202 Accepted` | `{ "status": "accepted", ... }` | — |
| Dry run | `200 OK` | 回显的那条记录 | `X-Ingest-Mode: dryrun` |

> [!WARNING]
> dry run 返回 `200`，绝不会返回 `202`。你拿到 `202`，那就是一次真实写入。**dry run 通过不等于写入成功**——带 `dryrun=1` 发出的内容永远不会被存下来。

dry run **照常鉴权**，也**照常计入限流**——一次批量请求算一次请求。它不是压测入口。

### 回显的那条记录 {#the-echoed-record}

::: code-group

```bash [cURL]
curl -X POST "https://datapulse-api.revosurge.com/v3/s2s/event?dryrun=1" \
  -H "Content-Type: application/json" \
  -H "X-API-KEY: dp_test_key_123" \
  -d '{
    "event": "register",
    "timestamp": 1718280000000,
    "identity": { "client_user_id": "u-ua-1", "click_id": "rs-ua-1" },
    "context": {
      "ip_address": "203.0.113.1",
      "user_agent": "Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36"
    }
  }'
```

```json [响应（节选）]
{
  "requestId": "s2s.event-...",
  "apiKey": "dp_test_key_...",
  "clickId": "rs-ua-1",
  "country": "USA",
  "userAgentInfo": {
    "device_class": "Mobile",
    "device_name": "Samsung SM-G991B",
    "operating_system_name": "Android",
    "operating_system_version": "13",
    "agent_name": "Android",
    "agent_class": "Browser"
  },
  "eventData": {
    "client_user_id": "u-ua-1",
    "click_id": "rs-ua-1",
    "event_name": "register",
    "user_agent": "Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36",
    "recv_timestamp": 1789541015965,
    "catalog_version": "...",
    "request_id": "..."
  },
  "misspelledFields": []
}
```

:::

### 你发的 vs. 我们记的

你的信封与回显之间的差异，大部分是我方补充的富化项：

| 你发的 | 我们记的 |
|----------|-------|
| `context.ip_address` | 由该 IP 解析出的国家与城市 |
| `context.user_agent` | `userAgentInfo`——设备类别与型号、操作系统名称与版本、客户端名称与类别 |
| `context.amount` + `context.currency` | 按我方公布的汇率换算后的金额 |
| `context.game_type` | 归一化后的游戏类型 |
| `context.transaction_id`（你未提供时） | 由我方生成的 `transaction_id` |
| — | `recv_timestamp`——**我方**接收到该事件的时间，单位毫秒 |
| — | `catalog_version`——本次校验所依据的事件目录版本 |
| — | `request_id` / `requestId`——本次调用的追踪 id。就此次调用询问我们时请带上它 |

接下来两节是这张表的反面——**哪些东西我们没有按你以为的样子记下来**。

### 两种拼法

> [!WARNING]
> **绝对不要把回显里的字段名抄回你的请求里。** 你发送的字段是 `snake_case`（`client_user_id`、`click_id`、`ip_address`、`user_agent`）；**回显的顶层字段是 `camelCase`**（`requestId`、`clickId`、`userAgentInfo`），而嵌在其中的 `eventData` 又回到 `snake_case`。

拼错一个键的代价取决于该字段是否必填——而且损害程度与响度正好相反：

- **必填**字段拼错返回 `400 VALIDATION_ERROR`。很响亮，几分钟就修好了。
- **可选**字段拼错返回 `202`，事件照常落库，而那个字段静默消失。把 `context.user_agent` 写成 `context.userAgent`，`userAgentInfo` 整个为空——设备与操作系统维度全丢，而且哪里都不会报错。
- **`identity.click_id` 属于后一类。** 拼成 `clickId` 会得到 `202`、事件落库、看起来一切正常——只是这条转化永远归因不上。

### misspelledFields

每一份 dry run 回显里都带有一个 `misspelledFields` 列表。它列出你发来的、明显是我方字段但拼法不同的键——正是它让上面那种静默失败在上线前变得可见：

```json
"misspelledFields": [{ "sent": "clickId", "expected": "click_id" }]
```

`sent` 是你原样发来的键名，`expected` 是我方本来会匹配到的字段。请把你的载荷改成 `expected` 的写法。

**空数组就是你想要的答案。** 单条请求干净通过时返回的是 `"misspelledFields": []`。这个键恒定存在，所以 `[]` 的含义是*我们检查过了、没发现问题*，而不是*这个端点还没有这项检查*。（批量的呈现方式不同，见下文。）

#### v3 检查哪些位置

这项检查覆盖两层：**信封顶层**，以及 **`identity` 内部**的键。其中两种情形值得单独点出来：

1. **`identity` 里的键拼错，会在解析时直接被丢弃。** `identity.clickId` 根本到不了事件里——与别处不认识的键不同，它连自定义属性都留不下，后续没有任何地方能看出你曾经发过它。dry run 是唯一能看见它的地方。
2. **本该嵌在 `identity` 里、却被平铺到顶层的字段同样会被报出来。** 在顶层写 `clientUserId`，你会得到 `{ "sent": "clientUserId", "expected": "client_user_id" }`。要改的既是拼法*也是*位置——这个字段应当嵌在 `identity` 对象内。

**`context` 不做这项检查。** 它是由事件目录定义的开放 map，出现我方不认识的键是正常的，而不是可疑的。`context` 里缺少的必填字段改由目录校验以 [`violations[]`](#错误) 的形式报告——这也正是为什么 `context` 里*可选*字段拼错不会出现在这里。参见[事件目录与校验](/cn/tracking/s2s/v3/catalog-governance)。

#### 我们不拒绝未知字段

**自定义属性是我方支持的能力，不是错误。** `context` 是由目录定义的开放 map，出现我方不认识的键本就在预期之内。

所以这项检查刻意做得很窄：它只报那些看起来**是我方字段、只是拼法不同**的键。比对前会先把名字统一成小写并去掉分隔符，只有这样处理之后与我方已知字段撞名的键才会被报出来。

| 你发的 | 是否报告 | 原因 |
|----------|-----------|-----|
| `identity.clickId`、`identity.Click-Id` | 报告 | 与 `click_id` 撞名 |
| 顶层的 `clientUserId` 或 `CLIENTUSERID` | 报告 | 与 `client_user_id` 撞名 |
| `identity.click_id` | 不报告 | 拼写正确 |
| `context.bonus_round_id`、`context.vip_tier`、`context.table_id` | 不报告 | 开放 map 里正当的自定义字段 |

> [!IMPORTANT]
> **你自己的自定义属性没有出现在这个列表里，正是应有的结果，并不代表它被忽略了。** 不要因为 dry run 没提到某个自定义字段，就把你本来要用的这个字段删掉。

### 批量 dry run {#batch-dry-run}

`POST /v3/s2s/batch?dryrun=1` 会同步返回逐条结果，而不是平时的 `202`：

```json
{
  "requestId": "s2s.batch-...",
  "mode": "dryrun",
  "total": 3,
  "successCount": 2,
  "failureCount": 1,
  "successEvents": ["... 富化后的事件 ..."],
  "errors": [
    {
      "index": 2,
      "violations": [
        { "field": "context.ip_address", "rule": "required", "event": "deposit" },
        { "field": "context.amount", "rule": "required", "event": "deposit" }
      ]
    }
  ],
  "misspelledFields": { "1": [{ "sent": "clickId", "expected": "click_id" }] }
}
```

- `errors[].index` 是该条目在你发送的数组中的下标，从 `0` 数起；每个 `violations[]` 条目给出字段路径与违反的规则——两者合起来告诉你*第几条、哪个字段、违反哪条规则*。
- **`misspelledFields` 是一个顶层对象，按同一套下标索引。** 它不挂在 `successEvents` 里的各个事件上。上例是：第 `1` 条（也就是你发的第二条）在 `identity` 里把 `click_id` 拼成了 `clickId`。
- **全部拼对时这个键整个不出现**——不是空对象，也不是空数组。这一点与单条不同：单条恒定返回 `misspelledFields: []`。所以不要拿"键是否存在"当判断依据。

## 测试模式 {#test-mode}

dry run 回答的是"这一条对不对"，什么都不留。测试模式回答的是"**我的接入这段时间都发了什么**"：加上请求头 `X-Test-Mode: true`，我们会完全按生产路径处理这条请求，然后把事件存成一条**测试事件**，你可以在 14 天内回头查看。测试事件永远不会进入生产。

| 请求头 | 值 |
|--------|-----|
| `X-Test-Mode` | `true` |

两个接入端点都支持，单条和批量都可以。线上流量不要带这个请求头。

### dry run 还是测试模式？ {#dry-run-or-test-mode}

| | Dry run —— `?dryrun=1` | 测试模式 —— `X-Test-Mode: true` |
|---|---|---|
| 回答的问题 | *这一条请求对不对？* | *我的接入这段时间都发了什么？* |
| 存了什么 | 什么都不存 | 每一条被接受的事件，以测试事件的形式保留 14 天 |
| 事后还能回看吗 | 不能——你只有当时的响应 | 能——参见[查看测试事件](#viewing-your-test-events) |
| 进入报表、归因或计费 | 否 | 否 |
| 适合用来 | 构造和检查请求体、CI 断言 | 预发环境；在[上线测试](/cn/tracking/s2s/handoff#the-go-live-test)之前确认你真实的处理逻辑确实会发事件 |

**同一条请求两个都带时，以 dry run 为准。** 什么都不会存下来，响应头为 `X-Ingest-Mode: dryrun`。

### 发送测试事件 {#sending-a-test-event}

```bash
curl -i -X POST "https://datapulse-api.revosurge.com/v3/s2s/event" \
  -H "Content-Type: application/json" \
  -H "X-API-KEY: dp_test_key_123" \
  -H "X-Test-Mode: true" \
  -d '{
    "event": "register",
    "timestamp": 1718280000000,
    "identity": { "client_user_id": "u-test-1", "click_id": "rs-test-1" },
    "context": { "ip_address": "203.0.113.1" }
  }'
```

测试模式的响应和 dry run 一样，而不是和真实写入一样：

| 调用 | 状态 | 响应体 | `X-Ingest-Mode` | 是否存储 |
|------|------|--------|-----------------|----------|
| 真实写入 | `202 Accepted` | `{ "status": "accepted", ... }` | — | 是，进入生产 |
| 测试模式 | `200 OK` | [回显的那条记录](#the-echoed-record)，或带 `"mode": "test"` 的[批量逐条结果](#batch-dry-run) | `test` | 以测试事件形式保留 14 天 |
| Dry run | `200 OK` | 回显的那条记录，或带 `"mode": "dryrun"` 的批量逐条结果 | `dryrun` | 否 |

回显内容与 dry run 完全相同，`misspelledFields` 也在其中。

> [!WARNING]
> **在 v3 上，接入端点返回 `200` 一律表示这条事件没有进入生产。** 看 `X-Ingest-Mode` 才能知道你命中的是哪种模式。如果你的生产代码收到的是 `X-Ingest-Mode: test`，说明请求头还没去掉，这些事件一条都不算数——参见 [`S2S-R-12`](/cn/tracking/s2s/validation#s2s-r-12-—-still-in-dry-run)。

测试事件的校验与线上事件完全一致。校验不通过时，你会收到与生产相同的 `400` 或 `422`，**这条事件不会被存下来**。批量请求中，通过校验的条目会被存下，没通过的列在 `errors[]` 里，不会被存。

测试模式的请求**照常鉴权**，也**照常计入限流**。

### 测试事件去了哪里 {#where-test-events-go}

- **不进任何报表**、看板或转化计数。
- **不参与归因、优化和计费。** 测试事件永远不会匹配到点击，不会被用于出价，也不会产生费用。
- **保留 14 天**，之后删除。

### 查看测试事件 {#viewing-your-test-events}

在 DataPulse 中打开你的 Product，进入 **最近测试事件**。事件按时间倒序排列，默认显示最近 1 小时，最多可往前查 14 天。每一行显示事件名、我们收到的时间、`click_id`、`client_user_id`、交易字段、国家、事件所用的 API Key（昵称与前 8 位）以及 request ID。

同样的列表也可以通过 API 获取：

<HttpMethod method="GET" path="/api/v1/datapulse/adwave-products/{productId}/test-events" />

这个端点属于 RevoSurge 后台 API，使用你的 **RevoSurge 账号登录态**鉴权，与后台一致——而不是你发送事件时用的 `X-API-KEY`。

| 参数 | 说明 |
|------|------|
| `from`、`to` | ISO-8601 时间点，例如 `2026-10-05T08:00:00Z`。默认最近 1 小时，时间窗口最长 14 天。 |
| `since` | ISO-8601 时间点。只返回在此之后收到的事件，按时间正序——测试时可以用它轮询新事件。 |
| `eventName`、`clickId`、`clientUserId`、`requestId` | 只返回该字段等于此值的事件。 |
| `limit` | 每页条数，`1`–`100`，默认 `20`。 |
| `cursor` | 上一页返回的 `nextCursor`。 |

传入其他任何参数都会返回 `400`。

```json
{
  "events": [
    {
      "eventKey": "...",
      "source": "s2s",
      "receivedAt": "2026-10-05T08:00:12.345Z",
      "eventName": "deposit",
      "eventTimeDeclared": 1791158400,
      "clickId": "rs-test-1",
      "clientUserId": "u-test-1",
      "transactionId": "txn_1",
      "amount": 12.5,
      "currency": "USD",
      "sourceAmount": 1000,
      "sourceCurrency": "INR",
      "country": "IND",
      "apiKey": { "nickname": "staging", "prefix": "rs-RhVlT" },
      "requestId": "s2s.event-..."
    }
  ],
  "nextCursor": "...",
  "meta": { "retentionDays": 14, "freshnessSeconds": 10, "rejectedVisible": false }
}
```

`GET /api/v1/datapulse/adwave-products/{productId}/test-events/{eventKey}` 返回单条事件，以及我们为它存下的完整请求体。

### 限制 {#test-mode-limits}

- **被拒收的测试事件不会出现在列表里。** 被我们拒收的测试事件——返回 `400` 或 `422` 的，或批量中失败的条目——从未被存下，所以不会出现在列表中。拒收原因以你发送时收到的 HTTP 响应为准，测试期间请把这些响应记到日志里。（`meta.rejectedVisible: false` 说的就是这件事。）
- **列表大约有 10 秒延迟。** 测试事件发出后，大约要 10 秒才会出现在列表中（`meta.freshnessSeconds`）。
- **14 天是上限**——既是测试事件的保留时长，也是单次查询时间窗口的最大跨度。

## 限流

- 限制是**按 API 密钥**应用的，采用滚动的 1 分钟窗口。
- 超出限制会返回 `429`。
- 在 `429` 和 `5xx` 上使用指数退避。
