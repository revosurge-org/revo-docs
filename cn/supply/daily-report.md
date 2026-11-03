---
title: 每日报告 API
description: 按天返回您 SSP 的竞价、赢出价、账单通知、展示次数、收入和平均 CPM(USD),数据来自 RevoSurge 广告服务器日志。UTC 日期,最多 7 天窗口,JWT 鉴权。
---

# 每日报告 API

**适用对象:** 需要与 RevoSurge 核对已交付展示和账单的 SSP 合作伙伴。

只读 HTTP 端点,按 UTC 自然日返回您 SSP 的竞价、赢出价、账单通知和展示次数,
以及收入和平均 CPM(USD)。数据与 RevoSurge 内部报表使用的数据一致。

## 本文内容
- 端点与鉴权
- 参数
- 调用示例
- 响应格式
- 频率限制与缓存
- 错误码
- 如何获取 token
- 从 v1 迁移
- 常见问题

## 端点 {#endpoint}

```
GET https://rtb.revosurge.com/api/v2/ssp/{sspId}/report?from=YYYY-MM-DD&to=YYYY-MM-DD
Authorization: Bearer <jwt>
```

路径变量 `{sspId}` **必须**与 token 中的 `sub` 声明一致,因此一个 token
只能返回其签发时对应的 SSP id 的数据。

::: tip 报告地址 ≠ 竞价地址
这不是您的竞价端点(`/api/v1/openrtb2/...`)。竞价端点用于接收 OpenRTB
竞价请求;本端点用于返回报表数据。
:::

### 传递 token {#passing-the-token}

支持两种方式([RFC 6750](https://www.rfc-editor.org/rfc/rfc6750) §2.1 和 §2.3):

| 方式 | 示例 | 说明 |
|---|---|---|
| `Authorization` 请求头 | `Authorization: Bearer <jwt>` | **推荐** |
| `access_token` 查询参数 | `...&access_token=<jwt>` | 适用于无法设置请求头的工具 |

两者同时提供时以请求头为准。查询参数中的 token 可能被记录在代理或浏览器日志中,
请尽量使用请求头。

## 鉴权 — token 由 RevoSurge 签发 {#authentication}

Token 由 **RevoSurge 平台团队生成**并交付给您。

- 签名密钥仅限**内部**使用,不会与合作伙伴分享。
- **请勿**尝试自行签名 token。
- Token **没有过期时间**,在签名密钥轮换前一直有效;轮换后我们会为您签发新 token。
- 一个 token 对应一个 SSP id。参见
  [我的 SSP id 覆盖哪些流量?](#which-traffic-does-my-ssp-id-cover)

参见[如何获取 token](#how-to-obtain-a-token)。

## 参数 {#parameters}

| 参数 | 位置 | 格式 | 说明 |
|---|---|---|---|
| `sspId` | 路径 | string | 必须与 token 的 `sub` 声明一致 |
| `from` | 查询参数 | `YYYY-MM-DD` | UTC 日期,包含当天 |
| `to` | 查询参数 | `YYYY-MM-DD` | UTC 日期,包含当天。允许查询今天(部分数据) |
| `Authorization` | 请求头 | `Bearer <jwt>` | 您的 JWT(或使用 `access_token`) |
| `access_token` | 查询参数 | string | 可选。仅在没有请求头时使用 |

窗口限制:
- 闭区间:`[from, to]`
- 最长 **7 天**(`to - from <= 6`)
- `from` 和 `to` 必须是 UTC 日期(不是时间戳)
- `to` 不能早于 `from`,也不能晚于今天(UTC)
- `to` 可以是今天(部分数据,返回截至当前的计数)

## 调用示例 {#example-call}

```bash
curl "https://rtb.revosurge.com/api/v2/ssp/example-ssp/report?from=2026-10-25&to=2026-10-27" \
  -H "Authorization: Bearer <your-token>"
```

将 token 放在查询参数中的同一调用:

```bash
curl "https://rtb.revosurge.com/api/v2/ssp/example-ssp/report?from=2026-10-25&to=2026-10-27&access_token=<your-token>"
```

## 响应格式 {#response-format}

`200 OK` — JSON 响应体:

```json
{
  "ssp": "example-ssp",
  "from": "2026-10-25",
  "to": "2026-10-27",
  "currency": "USD",
  "timezone": "UTC",
  "days": [
    {
      "date": "2026-10-25T00:00:00Z",
      "bidCount": 14523,
      "winCount": 8234,
      "billCount": 7812,
      "impCount": 7980,
      "revenue":    { "byImp": 15.96, "byBill": 15.624 },
      "averageCpm": { "byImp": 2.0,   "byBill": 2.0 }
    },
    {
      "date": "2026-10-26T00:00:00Z",
      "bidCount": 16002,
      "winCount": 9015,
      "billCount": null,
      "impCount": 8721,
      "revenue":    { "byImp": 18.3141 },
      "averageCpm": { "byImp": 2.1 }
    },
    {
      "date": "2026-10-27T00:00:00Z",
      "bidCount": 0,
      "winCount": 0,
      "billCount": null,
      "impCount": 0,
      "revenue":    { "byImp": 0.0 },
      "averageCpm": { "byImp": 0.0 }
    }
  ]
}
```

### 顶层字段 {#top-level-fields}

| 字段 | 类型 | 含义 |
|---|---|---|
| `ssp` | string | 您的 SSP id(回显路径变量) |
| `from`, `to` | string | UTC 日期范围 `YYYY-MM-DD`(回显查询参数) |
| `currency` | string | 固定为 `"USD"` |
| `timezone` | string | 固定为 `"UTC"` |
| `days` | array | 每个 UTC 自然日一条,按日期升序 |

### `days[]` 字段 {#days-fields}

| 字段 | 类型 | 含义 |
|---|---|---|
| `date` | string | UTC 当天零点,ISO 8601 格式带 `Z` 后缀,例如 `2026-10-25T00:00:00Z` |
| `bidCount` | integer | RevoSurge 返回给您 SSP 的竞价数 |
| `winCount` | integer | 从您 SSP 收到的赢出价通知数 |
| `billCount` | integer \| `null` | 从您 SSP 收到的账单通知数。当天没有收到账单通知,或账单数据暂时不可用时为 `null` — 请视为未知,而不是零 |
| `impCount` | integer | 我们展示像素记录的展示次数,按展示去重,计入展示实际触发的日期 |
| `revenue.byImp` | number | 已记录展示的赢出价之和,USD(每次展示为 CPM ÷ 1000)。保留 4 位小数 |
| `revenue.byBill` | number(可选) | 已计费展示的赢出价之和,USD。保留 4 位小数。`billCount` 为 `null` 或无法计算账单收入时**不返回**该字段 |
| `averageCpm.byImp` | number | `revenue.byImp × 1000 ÷ impCount`,USD。`impCount` 为 `0` 时为 `0` |
| `averageCpm.byBill` | number(可选) | `revenue.byBill × 1000 ÷ billCount`,USD。`revenue.byBill` 不返回时该字段也**不返回** |

没有任何活动的日期仍会返回(计数为 0,`billCount` 为 `null`,不含 `byBill`
字段),因此数组始终有 `(to - from + 1)` 行,调用方可直接遍历,无需补齐。

::: warning 请将 `byBill` 按可选字段解析
没有账单数据时,`revenue` 和 `averageCpm` 中不会出现 `byBill` 字段(不会以
`null` 返回)。请将缺失的 `byBill` 视同 `null` 处理。
:::

### `byImp` 与 `byBill` {#byimp-vs-bybill}

收入和 CPM 按两种独立口径返回:

- **`byImp`** — 基于我们像素记录的展示。所有 SSP 均提供。
- **`byBill`** — 基于您 SSP 发送给我们的账单通知。仅当您的 SSP 发送账单通知时
  才会返回。收入只统计能匹配到赢出价的账单,因此可能略低于
  `billCount` × 您的成交价。

请按与您计费方式一致的口径对账:如果您发送账单通知,使用 `byBill`;否则使用 `byImp`。

## 频率限制与缓存 {#rate-limit-caching}

- 每个 token **每分钟 10 次**请求,超出返回 `429`。
- 相同的 `(sspId, from, to)` 查询在服务端**缓存 5 分钟**,
  该时间内的重复查询返回缓存结果。
- 建议轮询频率:**每小时一次或更低**。当天结束后,每日汇总不再变化。

## 错误码 {#errors}

| 状态码 | `error` | 原因 |
|---|---|---|
| `400` | `bad_date` | `from` 或 `to` 不是 `YYYY-MM-DD` 日期 |
| `400` | `bad_window` | 窗口超过 7 天、`to` 早于 `from`,或 `to` 晚于今天(UTC) |
| `401` | `unauthorized` | 缺少 token、签名无效、签发方不正确,或 token 的 `sub` ≠ 路径中的 `{sspId}` |
| `429` | `rate_limit_exceeded` | 该 token 每分钟请求超过 10 次 |
| `500` | `internal_error` | 内部错误 — 请稍后重试 |

错误响应体格式:

```json
{ "error": "bad_window", "detail": "window exceeds 7 days (got 14)" }
```

仅 `400` 和 `401` 响应包含 `detail`。

## 如何获取 token {#how-to-obtain-a-token}

请通过您与 RevoSurge **现有的沟通渠道**(Telegram、Microsoft Teams,
或您已在使用的客户经理对话窗口)联系我们,并提供您的 SSP id。我们将:

1. 核实您的身份及您运营的 SSP。
2. 以您的 SSP id 作为 `sub` 声明,签发长期有效的 JWT。
3. 通过同一渠道将 token 和您的报告地址交付给您。

请像对待密码一样对待 token:
- 不要提交到代码仓库。
- 存放在密钥管理系统或环境变量中。
- 仅限需要调用该 API 的工程师访问。

## Token 轮换 {#token-rotation}

如果我们轮换签名密钥(例如怀疑发生泄露):

1. 所有现有 token 立即失效,每次请求都会返回 `401`。
2. RevoSurge 会通过原交付渠道为您签发新 token。
3. 请在您的环境中用新 token 替换旧 token。

如需主动申请轮换(例如怀疑您的 token 已泄露),请通过您接收原 token 的
Telegram / Teams 渠道通知我们。

## 从 v1 迁移 {#migrating-from-v1}

v1 端点(`/api/v1/ssp/{sspId}/report`)已不再对外开放。您现有的 token 可直接
用于 v2。字段对应关系:

| v1 | v2 | 说明 |
|---|---|---|
| — | `timezone` | 新增,固定为 `"UTC"` |
| `days[].date`(`2026-10-25`) | `days[].date`(`2026-10-25T00:00:00Z`) | ISO 8601 带 `Z` |
| `days[].bids` | `days[].bidCount` | |
| `days[].wins` | `days[].winCount` | |
| — | `days[].billCount` | 新增 |
| `days[].imps` | `days[].impCount` | |
| `days[].totalCpmUsd` | `days[].revenue.byImp` | 计算口径不同 — 见下文 |
| — | `days[].revenue.byBill`、`days[].averageCpm.*` | 新增 |

v2 的 `revenue.byImp` 与 v1 的 `totalCpmUsd` 计算口径不同,因此 v1 历史数据
与 v2 不会完全一致。

## 常见问题 {#faq}

### 为什么竞价、赢出价、账单和展示计数不一致? {#why-are-my-bid-win-bill-and-impression-counts-different}

为保持透明,我们返回四种计数:

- **bidCount** — RevoSurge 返回的竞价(您可能在竞价中拒绝了部分竞价)。
- **winCount** — 您发送给我们的赢出价通知(竞价确认)。
- **billCount** — 您发送给我们的账单通知。
- **impCount** — 我们展示像素记录的展示。

这些计数可能相差几个百分点:
- *赢出价 > 展示*:展示像素未触发(素材被拦截、广告拦截插件、网络问题)。
- *展示 > 赢出价*:少数重试或多展示场景。
- *账单 ≠ 展示*:取决于您 SSP 发送账单通知的时机。

### 我的 SSP id 覆盖哪些流量? {#which-traffic-does-my-ssp-id-cover}

- 如果您的 SSP id 包含 `-`(例如 `acme-banner`),报告**仅**覆盖该 id。
- 如果不包含(例如 `acme`),报告覆盖该 id **以及所有以该 id 加 `-`
  开头的变体**(`acme-banner`、`acme-pop` 等),一个 token 即可覆盖您的所有变体。

如需其他维度的拆分,请联系我们。

### 数据有多新? {#how-fresh-is-the-data}

- **竞价、赢出价和账单**在事件发生后数秒内即可查询。
- **展示**在展示像素触发后数秒内即可查询。
- **延迟到达的通知**(由 SSP 延迟发送)可能在 UTC 零点后的 1–2 小时内使计数
  变化约 1%,之后计数趋于稳定。

### 可以一次查询超过 7 天吗? {#can-i-query-more-than-7-days-at-a-time}

不可以。请按相邻的 7 天窗口分多次请求。如果您每天运行回填任务,5 分钟缓存
可让多次请求更高效。

### 币种 {#currency}

所有收入和 CPM 均为 USD,我们不做币种转换。
