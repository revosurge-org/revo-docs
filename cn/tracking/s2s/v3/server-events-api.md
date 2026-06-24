---
title: RevoSurge 服务器事件 API（v3）
sidebar_label: 服务器事件 API（v3）
description: S2S Events v3 参考——信封、端点、认证、批量接入、校验响应与限流。
---

# RevoSurge 服务器事件 API（v3）

**受众：** 工程师、技术集成方、管理团队

服务器事件 API 让合作伙伴能够直接从其服务器安全地向 DataPulse 平台发送用户事件。**v3** 引入了**型别化事件目录**——事件与字段均预先登记并在接入时校验——以及结构化的请求**信封**。

- 第一次接触？从[请求信封与基础属性](/cn/tracking/s2s/v3/mandatory-properties)开始。
- 浏览事件：[标准事件](/cn/tracking/s2s/v3/events-standard) · [iGaming 事件](/cn/tracking/s2s/v3/events-igaming)。
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
| `X-Test-Mode` | 否 | `true` 表示仅校验并回显而不存储（参见[测试模式](#测试模式)） |

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

## 测试模式

发送 `X-Test-Mode: true` 可对事件进行校验和富化而**不**发布它。响应（HTTP `200`）会回显完全富化后的事件（地理信息、解析后的 user-agent、归一化后的金额），让你能够准确检查 DataPulse 将会存储什么。对于批量，响应会包含每项的 `successCount` / `failureCount`，以及一个带有失败索引和原因的 `errors[]` 列表。

## 限流

- 限制是**按 API 密钥**应用的，采用滚动的 1 分钟窗口。
- 超出限制会返回 `429`。
- 在 `429` 和 `5xx` 上使用指数退避。
