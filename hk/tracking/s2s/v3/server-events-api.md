---
title: RevoSurge 伺服器事件 API (v3)
sidebar_label: 伺服器事件 API (v3)
description: S2S 事件 v3 參考 — 信封、端點、認證、批次匯入、驗證回應及限流。
---

# RevoSurge 伺服器事件 API (v3)

**對象：** 工程師、技術整合人員、Admin 團隊

伺服器事件 API 讓合作夥伴可以安全地將用戶事件直接從其伺服器傳送到 DataPulse 平台。**v3** 引入了**型別化事件目錄** — 事件及欄位會預先登記，並在匯入時驗證 — 以及一個結構化的請求**信封**。

- 初次使用？請從[請求信封與基礎屬性](/hk/tracking/s2s/v3/mandatory-properties)開始。
- 瀏覽事件：[標準事件](/hk/tracking/s2s/v3/events-standard) · [iGaming 事件](/hk/tracking/s2s/v3/events-igaming)。
- 驗證如何運作：[事件目錄與驗證](/hk/tracking/s2s/v3/catalog-governance)。
- 目前使用 v2？請參閱[從 v2 遷移](/hk/tracking/s2s/v3/migration)。

## 基礎 URL

基礎 URL 與 v2 相同，沒有變更。

| 環境 | 基礎 URL |
|-------------|----------|
| Production  | `https://datapulse-api.revosurge.com/` |

## 認證

每個請求都必須在 `X-API-KEY` 標頭中包含你的 API 金鑰。

| 標頭 | 必填 | 值 |
|--------|----------|-------|
| `X-API-KEY` | 是 | 你的 API 金鑰 |
| `Content-Type` | 是 | `application/json` |
| `X-Test-Mode` | 否 | `true` 表示驗證並回顯而不儲存（參閱下方的「測試模式」） |

> 請參閱 [API 金鑰](/hk/api/api-key)了解如何取得金鑰。認證與 v2 相同，沒有變更。

## 請求信封

v3 事件是一個包含四個部分的 JSON 物件 — `event`、`timestamp`、`identity` 及 `context`：

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

完整的欄位規則請見[請求信封與基礎屬性](/hk/tracking/s2s/v3/mandatory-properties)。簡而言之：

- `event`（String，必填）— 一個**已登記**的事件名稱。未知名稱會被拒絕。
- `timestamp`（Number，必填）— **UTC 紀元毫秒**（13 位數）。
- `identity`（Object，必填）— 必須至少包含 `client_user_id` 或 `anonymous_id` 其中**一個**。單獨的 `click_id` 並不足夠。
- `context`（Object）— 事件特定欄位。PII 放在 `context.privacy.*` 之下，且必須經過 SHA-256 雜湊。

## 匯入端點

### 單一事件

<HttpMethod method="POST" path="/v3/s2s/event" />

請求主體是單一信封物件。

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

### 批次

<HttpMethod method="POST" path="/v3/s2s/batch" />

請求主體是一個**純 JSON 陣列**，內含多個信封（而非帶有 `events` 鍵的物件）。每個請求最多 **600** 個事件。

```json
[
  { "event": "login",   "timestamp": 1718280000000, "identity": { "client_user_id": "user_001" }, "context": { "ip_address": "203.0.113.1" } },
  { "event": "deposit", "timestamp": 1718280001000, "identity": { "client_user_id": "user_001" }, "context": { "ip_address": "203.0.113.1", "transaction_id": "txn_1", "amount": 100.0, "currency": "USD" } }
]
```

> [!NOTE]
> 超過 600 個事件會回傳 `400 BATCH_TOO_LARGE`。

## 回應

成功時，事件會被**非同步排隊**（HTTP `202`）。

| 端點 | 狀態 | 主體 |
|----------|--------|------|
| 單一 | `202 Accepted` | `{ "status": "accepted", "eventId": "..." }` |
| 批次 | `202 Accepted` | `{ "status": "accepted", "requestId": "...", "count": 150 }` |

### 錯誤

`/v3/s2s/*` 上的錯誤會回傳一個結構化主體，內含 `code` 及 `violations[]` 陣列：

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

| 狀態 | Code | 含義 |
|--------|------|---------|
| `400` | `VALIDATION_ERROR` | 缺少／無效欄位、錯誤的時間戳、格式不正確的 PII、類型不符 |
| `400` | `BATCH_TOO_LARGE` | 批次中超過 600 個事件 |
| `422` | `UNKNOWN_EVENT_TYPE` | `event` 不是已登記的目錄事件 |
| `422` | `EVENT_DISABLED` | 事件存在但已為你的產品停用 |
| `429` | — | 超過限流（`{ "error": "Too Many Requests" }`） |

請參閱[事件目錄與驗證](/hk/tracking/s2s/v3/catalog-governance)了解目錄如何驅動這些檢查。

## 測試模式

傳送 `X-Test-Mode: true` 以驗證並豐富一個事件而**不**發佈它。回應（HTTP `200`）會回顯完整豐富後的事件（地理位置、解析後的 user-agent、正規化金額），讓你可以準確檢視 DataPulse 將會儲存的內容。對於批次，回應會包含每個項目的 `successCount` / `failureCount` 以及一個 `errors[]` 清單，列出失敗的索引與原因。

## 限流

- 限流會**按每個 API 金鑰**套用，以滾動的 1 分鐘視窗計算。
- 超過限制會回傳 `429`。
- 在 `429` 與 `5xx` 時使用指數退避。
