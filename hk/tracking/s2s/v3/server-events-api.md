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

## Dry run

在任一接入端點上加 `?dryrun=1`，即可端到端檢查一條請求而不產生任何數據。我們會完全按生產路徑解析、鑑權、按目錄驗證並豐富它，把將要寫入的那條記錄原樣回顯，然後甚麼都不存。

| 端點 | Dry run URL |
|----------|-------|
| 單一 | `POST /v3/s2s/event?dryrun=1` |
| 批次 | `POST /v3/s2s/batch?dryrun=1` |

裸寫 `dryrun` 與 `dryrun=true` 意思相同。`dryrun=0`、`dryrun=false`、`dryrun=no` 表示不啟用。

### 如何把 dry run 與真實寫入分開

| 調用 | 狀態 | 主體 | 回應標頭 |
|----------|--------|------|------|
| 真實寫入 | `202 Accepted` | `{ "status": "accepted", ... }` | — |
| Dry run | `200 OK` | 回顯的那條記錄 | `X-Ingest-Mode: dryrun` |

> [!WARNING]
> dry run 回 `200`，絕不會回 `202`。你拿到 `202`，那就是一次真實寫入。**dry run 通過不等於寫入成功** — 帶 `dryrun=1` 傳出的內容永遠不會被存下來。

dry run **照常鑑權**，也**照常計入限流** — 一次批次請求算一次請求。它不是壓測入口。

### 回顯的那條記錄

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

```json [回應（節錄）]
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

### 你傳的 vs. 我們記的

你的信封與回顯之間的差異，大部分是我方補上的豐富項：

| 你傳的 | 我們記的 |
|----------|-------|
| `context.ip_address` | 由該 IP 解析出的國家與城市 |
| `context.user_agent` | `userAgentInfo` — 裝置類別與型號、作業系統名稱與版本、用戶端名稱與類別 |
| `context.amount` + `context.currency` | 按我方公布的匯率換算後的金額 |
| `context.game_type` | 正規化後的遊戲類型 |
| `context.transaction_id`（你未提供時） | 由我方產生的 `transaction_id` |
| — | `recv_timestamp` — **我方**接收到該事件的時間，單位毫秒 |
| — | `catalog_version` — 本次驗證所依據的事件目錄版本 |
| — | `request_id` / `requestId` — 本次調用的追蹤 id。就這次調用向我們查詢時請帶上它 |

### 兩種拼法

> [!WARNING]
> **絕對不要把回顯裏的欄位名抄回你的請求。** 你傳送的欄位是 `snake_case`（`client_user_id`、`click_id`、`ip_address`、`user_agent`）；**回顯的頂層欄位是 `camelCase`**（`requestId`、`clickId`、`userAgentInfo`），而嵌在其中的 `eventData` 又回到 `snake_case`。

拼錯一個鍵的代價取決於該欄位是否必填 — 而且損害程度與響度剛好相反：

- **必填**欄位拼錯回傳 `400 VALIDATION_ERROR`。很響亮，幾分鐘就修好了。
- **可選**欄位拼錯回傳 `202`，事件照常落庫，而那個欄位靜默消失。把 `user_agent` 寫成 `userAgent`，`userAgentInfo` 整個為空 — 裝置與作業系統維度全失，而且哪裏都不會報錯。
- **`identity.click_id` 屬於後一類。** 拼成 `clickId` 會得到 `202`、事件落庫、看來一切正常 — 只是這條轉換永遠歸因不上。

### misspelledFields

dry run 會列出那些明顯是我方欄位、只是拼錯了的鍵，把上面那種靜默失敗在上線前變成看得見的：

```json
"misspelledFields": [{ "sent": "userAgent", "expected": "user_agent" }]
```

1. **它只報明顯是我方的鍵。** 鍵會先被正規化 — 轉小寫、去掉底線與連字號 — 之後與我方已知欄位名相同才會被指出。`userAgent`、`User-Agent`、`CLIENTUSERID` 都會被指出來。
2. **你的自訂屬性不會被誤報。** `bonus_round_id`、`vip_tier` 這類是我方支援的自訂欄位，不匹配任何已知名字，因此不會出現在這個清單裏。
3. **單一請求裏這個鍵恆定存在。** 乾淨時就是 `"misspelledFields": []` — 這是一個「我檢查過了、沒發現問題」的正面信號。

v3 會檢查**兩層**：信封頂層與 `identity`。把 `client_user_id` 平鋪在信封頂層、而不是放進 `identity`，同樣會在這裏被指出來。

> [!NOTE]
> **`context` 不做這項檢查。** 它是由事件目錄定義的開放 map，出現我方不認識的鍵是完全正常的。目錄會透過 `violations[]` 報出*它*所要求的那些欄位 — 請參閱[事件目錄與驗證](/hk/tracking/s2s/v3/catalog-governance)。

## 限流

- 限流會**按每個 API 金鑰**套用，以滾動的 1 分鐘視窗計算。
- 超過限制會回傳 `429`。
- 在 `429` 與 `5xx` 時使用指數退避。
