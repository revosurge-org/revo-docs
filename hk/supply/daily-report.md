---
title: 每日報告 API
description: 按日返回您 SSP 的競價、贏出價、帳單通知、展示次數、收入和平均 CPM(USD),數據來自 RevoSurge 廣告伺服器日誌。UTC 日期,最多 7 天窗口,JWT 鑑權。
---

# 每日報告 API

**適用對象:** 需要與 RevoSurge 核對已交付展示和帳單的 SSP 合作夥伴。

唯讀 HTTP 端點,按 UTC 自然日返回您 SSP 的競價、贏出價、帳單通知和展示次數,
以及收入和平均 CPM(USD)。數據與 RevoSurge 內部報表使用的數據一致。

## 本文內容
- 端點與鑑權
- 參數
- 調用範例
- 回應格式
- 頻率限制與快取
- 錯誤碼
- 如何獲取 token
- 從 v1 遷移
- 常見問題

## 端點 {#endpoint}

```
GET https://rtb.revosurge.com/api/v2/ssp/{sspId}/report?from=YYYY-MM-DD&to=YYYY-MM-DD
Authorization: Bearer <jwt>
```

路徑變數 `{sspId}` **必須**與 token 中的 `sub` 聲明一致,因此一個 token
只能返回其簽發時對應的 SSP id 的數據。

::: tip 報告地址 ≠ 競價地址
這不是您的競價端點(`/api/v1/openrtb2/...`)。競價端點用於接收 OpenRTB
競價請求;本端點用於返回報表數據。
:::

### 傳遞 token {#passing-the-token}

支援兩種方式([RFC 6750](https://www.rfc-editor.org/rfc/rfc6750) §2.1 和 §2.3):

| 方式 | 範例 | 說明 |
|---|---|---|
| `Authorization` 請求標頭 | `Authorization: Bearer <jwt>` | **推薦** |
| `access_token` 查詢參數 | `...&access_token=<jwt>` | 適用於無法設定請求標頭的工具 |

兩者同時提供時以請求標頭為準。查詢參數中的 token 可能被記錄在代理或瀏覽器日誌中,
請盡量使用請求標頭。

## 鑑權 — token 由 RevoSurge 簽發 {#authentication}

Token 由 **RevoSurge 平台團隊生成**並交付給您。

- 簽名密鑰僅限**內部**使用,不會與合作夥伴分享。
- **請勿**嘗試自行簽名 token。
- Token **沒有過期時間**,在簽名密鑰輪換前一直有效;輪換後我們會為您簽發新 token。
- 一個 token 對應一個 SSP id。參見
  [我的 SSP id 覆蓋哪些流量?](#which-traffic-does-my-ssp-id-cover)

參見[如何獲取 token](#how-to-obtain-a-token)。

## 參數 {#parameters}

| 參數 | 位置 | 格式 | 說明 |
|---|---|---|---|
| `sspId` | 路徑 | string | 必須與 token 的 `sub` 聲明一致 |
| `from` | 查詢參數 | `YYYY-MM-DD` | UTC 日期,包含當天 |
| `to` | 查詢參數 | `YYYY-MM-DD` | UTC 日期,包含當天。允許查詢今天(部分數據) |
| `Authorization` | 請求標頭 | `Bearer <jwt>` | 您的 JWT(或使用 `access_token`) |
| `access_token` | 查詢參數 | string | 可選。僅在沒有請求標頭時使用 |

窗口限制:
- 閉區間:`[from, to]`
- 最長 **7 天**(`to - from <= 6`)
- `from` 和 `to` 必須是 UTC 日期(不是時間戳)
- `to` 不能早於 `from`,也不能晚於今天(UTC)
- `to` 可以是今天(部分數據,返回截至當前的計數)

## 調用範例 {#example-call}

```bash
curl "https://rtb.revosurge.com/api/v2/ssp/example-ssp/report?from=2026-10-25&to=2026-10-27" \
  -H "Authorization: Bearer <your-token>"
```

將 token 放在查詢參數中的同一調用:

```bash
curl "https://rtb.revosurge.com/api/v2/ssp/example-ssp/report?from=2026-10-25&to=2026-10-27&access_token=<your-token>"
```

## 回應格式 {#response-format}

`200 OK` — JSON 回應內容:

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

### 頂層欄位 {#top-level-fields}

| 欄位 | 類型 | 含義 |
|---|---|---|
| `ssp` | string | 您的 SSP id(回顯路徑變數) |
| `from`, `to` | string | UTC 日期範圍 `YYYY-MM-DD`(回顯查詢參數) |
| `currency` | string | 固定為 `"USD"` |
| `timezone` | string | 固定為 `"UTC"` |
| `days` | array | 每個 UTC 自然日一條,按日期升序 |

### `days[]` 欄位 {#days-fields}

| 欄位 | 類型 | 含義 |
|---|---|---|
| `date` | string | UTC 當天零點,ISO 8601 格式帶 `Z` 後綴,例如 `2026-10-25T00:00:00Z` |
| `bidCount` | integer | RevoSurge 返回給您 SSP 的競價數 |
| `winCount` | integer | 從您 SSP 收到的贏出價通知數 |
| `billCount` | integer \| `null` | 從您 SSP 收到的帳單通知數。當天沒有收到帳單通知,或帳單數據暫時不可用時為 `null` — 請視為未知,而不是零 |
| `impCount` | integer | 我們展示像素記錄的展示次數,按展示去重,計入展示實際觸發的日期 |
| `revenue.byImp` | number | 已記錄展示的贏出價之和,USD(每次展示為 CPM ÷ 1000)。保留 4 位小數 |
| `revenue.byBill` | number(可選) | 已計費展示的贏出價之和,USD。保留 4 位小數。`billCount` 為 `null` 或無法計算帳單收入時**不返回**該欄位 |
| `averageCpm.byImp` | number | `revenue.byImp × 1000 ÷ impCount`,USD。`impCount` 為 `0` 時為 `0` |
| `averageCpm.byBill` | number(可選) | `revenue.byBill × 1000 ÷ billCount`,USD。`revenue.byBill` 不返回時該欄位亦**不返回** |

沒有任何活動的日期仍會返回(計數為 0,`billCount` 為 `null`,不含 `byBill`
欄位),因此陣列始終有 `(to - from + 1)` 行,調用方可直接遍歷,無需補齊。

::: warning 請將 `byBill` 按可選欄位解析
沒有帳單數據時,`revenue` 和 `averageCpm` 中不會出現 `byBill` 欄位(不會以
`null` 返回)。請將缺失的 `byBill` 視同 `null` 處理。
:::

### `byImp` 與 `byBill` {#byimp-vs-bybill}

收入和 CPM 按兩種獨立口徑返回:

- **`byImp`** — 基於我們像素記錄的展示。所有 SSP 均提供。
- **`byBill`** — 基於您 SSP 發送給我們的帳單通知。僅當您的 SSP 發送帳單通知時
  才會返回。收入只統計能匹配到贏出價的帳單,因此可能略低於
  `billCount` × 您的成交價。

請按與您計費方式一致的口徑對帳:如果您發送帳單通知,使用 `byBill`;否則使用 `byImp`。

## 頻率限制與快取 {#rate-limit-caching}

- 每個 token **每分鐘 10 次**請求,超出返回 `429`。
- 相同的 `(sspId, from, to)` 查詢在服務端**快取 5 分鐘**,
  該時間內的重複查詢返回快取結果。
- 建議輪詢頻率:**每小時一次或更低**。當天結束後,每日匯總不再變化。

## 錯誤碼 {#errors}

| 狀態碼 | `error` | 原因 |
|---|---|---|
| `400` | `bad_date` | `from` 或 `to` 不是 `YYYY-MM-DD` 日期 |
| `400` | `bad_window` | 窗口超過 7 天、`to` 早於 `from`,或 `to` 晚於今天(UTC) |
| `401` | `unauthorized` | 缺少 token、簽名無效、簽發方不正確,或 token 的 `sub` ≠ 路徑中的 `{sspId}` |
| `429` | `rate_limit_exceeded` | 該 token 每分鐘請求超過 10 次 |
| `500` | `internal_error` | 內部錯誤 — 請稍後重試 |

錯誤回應內容格式:

```json
{ "error": "bad_window", "detail": "window exceeds 7 days (got 14)" }
```

僅 `400` 和 `401` 回應包含 `detail`。

## 如何獲取 token {#how-to-obtain-a-token}

請透過您與 RevoSurge **現有的溝通渠道**(Telegram、Microsoft Teams,
或您已在使用的客戶經理對話視窗)聯繫我們,並提供您的 SSP id。我們將:

1. 核實您的身份及您營運的 SSP。
2. 以您的 SSP id 作為 `sub` 聲明,簽發長期有效的 JWT。
3. 透過同一渠道將 token 和您的報告地址交付給您。

請像對待密碼一樣對待 token:
- 不要提交到程式碼倉庫。
- 存放在密鑰管理系統或環境變數中。
- 僅限需要調用該 API 的工程師存取。

## Token 輪換 {#token-rotation}

如果我們輪換簽名密鑰(例如懷疑發生洩露):

1. 所有現有 token 立即失效,每次請求都會返回 `401`。
2. RevoSurge 會透過原交付渠道為您簽發新 token。
3. 請在您的環境中用新 token 替換舊 token。

如需主動申請輪換(例如懷疑您的 token 已洩露),請透過您接收原 token 的
Telegram / Teams 渠道通知我們。

## 從 v1 遷移 {#migrating-from-v1}

v1 端點(`/api/v1/ssp/{sspId}/report`)已不再對外開放。您現有的 token 可直接
用於 v2。欄位對應關係:

| v1 | v2 | 說明 |
|---|---|---|
| — | `timezone` | 新增,固定為 `"UTC"` |
| `days[].date`(`2026-10-25`) | `days[].date`(`2026-10-25T00:00:00Z`) | ISO 8601 帶 `Z` |
| `days[].bids` | `days[].bidCount` | |
| `days[].wins` | `days[].winCount` | |
| — | `days[].billCount` | 新增 |
| `days[].imps` | `days[].impCount` | |
| `days[].totalCpmUsd` | `days[].revenue.byImp` | 計算口徑不同 — 見下文 |
| — | `days[].revenue.byBill`、`days[].averageCpm.*` | 新增 |

v2 的 `revenue.byImp` 與 v1 的 `totalCpmUsd` 計算口徑不同,因此 v1 歷史數據
與 v2 不會完全一致。

## 常見問題 {#faq}

### 為什麼競價、贏出價、帳單和展示計數不一致? {#why-are-my-bid-win-bill-and-impression-counts-different}

為保持透明,我們返回四種計數:

- **bidCount** — RevoSurge 返回的競價(您可能在競價中拒絕了部分競價)。
- **winCount** — 您發送給我們的贏出價通知(競價確認)。
- **billCount** — 您發送給我們的帳單通知。
- **impCount** — 我們展示像素記錄的展示。

這些計數可能相差幾個百分點:
- *贏出價 > 展示*:展示像素未觸發(素材被攔截、廣告攔截外掛、網絡問題)。
- *展示 > 贏出價*:少數重試或多展示場景。
- *帳單 ≠ 展示*:取決於您 SSP 發送帳單通知的時機。

### 我的 SSP id 覆蓋哪些流量? {#which-traffic-does-my-ssp-id-cover}

- 如果您的 SSP id 包含 `-`(例如 `acme-banner`),報告**僅**覆蓋該 id。
- 如果不包含(例如 `acme`),報告覆蓋該 id **以及所有以該 id 加 `-`
  開頭的變體**(`acme-banner`、`acme-pop` 等),一個 token 即可覆蓋您的所有變體。

如需其他維度的拆分,請聯繫我們。

### 數據有多新? {#how-fresh-is-the-data}

- **競價、贏出價和帳單**在事件發生後數秒內即可查詢。
- **展示**在展示像素觸發後數秒內即可查詢。
- **延遲到達的通知**(由 SSP 延遲發送)可能在 UTC 零點後的 1–2 小時內使計數
  變化約 1%,之後計數趨於穩定。

### 可以一次查詢超過 7 天嗎? {#can-i-query-more-than-7-days-at-a-time}

不可以。請按相鄰的 7 天窗口分多次請求。如果您每天運行回填任務,5 分鐘快取
可讓多次請求更有效率。

### 幣種 {#currency}

所有收入和 CPM 均為 USD,我們不做幣種轉換。
