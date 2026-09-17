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

接下來兩節是這張表的反面 — **哪些東西我們沒有按你以為的樣子記下來**。

### 兩種拼法

> [!WARNING]
> **絕對不要把回顯裏的欄位名抄回你的請求。** 你傳送的欄位是 `snake_case`（`client_user_id`、`click_id`、`ip_address`、`user_agent`）；**回顯的頂層欄位是 `camelCase`**（`requestId`、`clickId`、`userAgentInfo`），而嵌在其中的 `eventData` 又回到 `snake_case`。

拼錯一個鍵的代價取決於該欄位是否必填 — 而且損害程度與響度剛好相反：

- **必填**欄位拼錯回傳 `400 VALIDATION_ERROR`。很響亮，幾分鐘就修好了。
- **可選**欄位拼錯回傳 `202`，事件照常落庫，而那個欄位靜默消失。把 `context.user_agent` 寫成 `context.userAgent`，`userAgentInfo` 整個為空 — 裝置與作業系統維度全失，而且哪裏都不會報錯。
- **`identity.click_id` 屬於後一類。** 拼成 `clickId` 會得到 `202`、事件落庫、看來一切正常 — 只是這條轉換永遠歸因不上。

### misspelledFields

每一份 dry run 回顯裏都帶有一個 `misspelledFields` 清單。它列出你傳來的、明顯是我方欄位但拼法不同的鍵 — 正是它令上面那種靜默失敗在上線前變得看得見：

```json
"misspelledFields": [{ "sent": "clickId", "expected": "click_id" }]
```

`sent` 是你原樣傳來的鍵名，`expected` 是我方本來會匹配到的欄位。請把你的載荷改成 `expected` 的寫法。

**空陣列就是你想要的答案。** 單一請求乾淨通過時回傳的是 `"misspelledFields": []`。這個鍵恆定存在，所以 `[]` 的意思是*我們檢查過了、沒發現問題*，而不是*這個端點還沒有這項檢查*。（批次的呈現方式不同，見下文。）

#### v3 檢查哪些位置

這項檢查覆蓋兩層：**信封頂層**，以及 **`identity` 內部**的鍵。其中兩種情形值得單獨點出來：

1. **`identity` 裏的鍵拼錯，會在解析時直接被丟棄。** `identity.clickId` 根本到不了事件裏 — 與別處不認識的鍵不同，它連自訂屬性都留不下，之後沒有任何地方能看出你曾經傳過它。dry run 是唯一看得見它的地方。
2. **本該嵌在 `identity` 裏、卻被平鋪到頂層的欄位同樣會被報出來。** 在頂層寫 `clientUserId`，你會得到 `{ "sent": "clientUserId", "expected": "client_user_id" }`。要改的既是拼法*也是*位置 — 這個欄位應當嵌在 `identity` 物件內。

**`context` 不做這項檢查。** 它是由事件目錄定義的開放 map，出現我方不認識的鍵是正常的，而不是可疑的。`context` 裏缺少的必填欄位改由目錄驗證以 [`violations[]`](#錯誤) 的形式報告 — 這也正是為甚麼 `context` 裏*可選*欄位拼錯不會出現在這裏。請參閱[事件目錄與驗證](/hk/tracking/s2s/v3/catalog-governance)。

#### 我們不拒絕未知欄位

**自訂屬性是我方支援的能力，不是錯誤。** `context` 是由目錄定義的開放 map，出現我方不認識的鍵本就在預期之內。

所以這項檢查刻意做得很窄：它只報那些看來**是我方欄位、只是拼法不同**的鍵。比對前會先把名字統一成小寫並去掉分隔符，只有這樣處理之後與我方已知欄位撞名的鍵才會被報出來。

| 你傳的 | 是否報告 | 原因 |
|----------|-----------|-----|
| `identity.clickId`、`identity.Click-Id` | 報告 | 與 `click_id` 撞名 |
| 頂層的 `clientUserId` 或 `CLIENTUSERID` | 報告 | 與 `client_user_id` 撞名 |
| `identity.click_id` | 不報告 | 拼寫正確 |
| `context.bonus_round_id`、`context.vip_tier`、`context.table_id` | 不報告 | 開放 map 裏正當的自訂欄位 |

> [!IMPORTANT]
> **你自己的自訂屬性沒有出現在這個清單裏，正是應有的結果，並不代表它被忽略了。** 不要因為 dry run 沒提到某個自訂欄位，就把你本來要用的這個欄位刪掉。

### 批次 dry run

`POST /v3/s2s/batch?dryrun=1` 會同步回傳逐條結果，而不是平時的 `202`：

```json
{
  "requestId": "s2s.batch-...",
  "mode": "dryrun",
  "total": 3,
  "successCount": 2,
  "failureCount": 1,
  "successEvents": ["... 豐富後的事件 ..."],
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

- `errors[].index` 是該條目在你傳送的陣列中的索引，由 `0` 數起；每個 `violations[]` 條目給出欄位路徑與違反的規則 — 兩者合起來告訴你*第幾條、哪個欄位、違反哪條規則*。
- **`misspelledFields` 是一個頂層物件，按同一套索引編排。** 它不掛在 `successEvents` 裏的各個事件上。上例是：第 `1` 條（也就是你傳的第二條）在 `identity` 裏把 `click_id` 拼成了 `clickId`。
- **全部拼對時這個鍵整個不出現** — 不是空物件，也不是空陣列。這一點與單條不同：單條恆定回傳 `misspelledFields: []`。所以不要拿「鍵是否存在」當判斷依據。

## 限流

- 限流會**按每個 API 金鑰**套用，以滾動的 1 分鐘視窗計算。
- 超過限制會回傳 `429`。
- 在 `429` 與 `5xx` 時使用指數退避。
