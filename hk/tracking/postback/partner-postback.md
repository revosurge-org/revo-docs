---
title: RevoSurge 合作夥伴 Postback API
sidebar_label: 合作夥伴 Postback API
description: Partner Postback v2 canonical GET 契約、v1 相容、身分、模式、回應及遷移。
---

# RevoSurge 合作夥伴 Postback API

Partner Postback 透過伺服器端 HTTP `GET` 回呼，把聯盟平台或業務後台的事件傳送給 RevoSurge。註冊模板前先選擇 API 版本：兩個版本的身分、欄位及回應約定不同。

## 選擇版本 {#choose-version}

| | v2 canonical 事件 | v1 相容接入 |
| --- | --- | --- |
| 入口 | `/v2/pb/{connectionId}/events` | 五條 `/v1/pb/{partner}/...` 路徑 |
| 事件選擇 | 必填 `event`，按產品有效目錄解析 | 路徑決定；`event` 僅供核對 |
| 身分 | `identity.client_user_id` 或 `identity.anonymous_id`，並符合目錄要求 | 有效 `click_id` 或 `user_id`；存在 click→user 回填 |
| 欄位 | canonical 點分路徑及嚴格純量型別 | 平鋪欄位、Connection 別名及寬容解析 |
| 負載錯誤 | `400` 或 `422` | 無可用身分時 live 回傳 `200 ignored` |

新的 canonical 接入在確認目標環境及產品就緒後使用 [v2](#v2-api)。現有接入可繼續使用 [v1 參考](#v1-compatibility)。切換時遵循[遷移與上線流程](/hk/tracking/postback/handoff#v2-migration)。

生產 MMP origin 為 `https://mmp.revosurge.com`。測試 origin 及目標環境的 v2 可用範圍請向 RevoSurge 聯絡人確認；文件說明本身不代表某個環境或產品已經啟用。

## v2 API {#v2-api}

<HttpMethod method="GET" path="/v2/pb/{connectionId}/events" />

`v2` 是傳輸版本。伺服器選擇產品目前有效的事件目錄，呼叫方不在 URL 中選擇 preset 或目錄版本。事件及欄位定義共用[事件目錄](/hk/tracking/s2s/v3/catalog-governance)、[Standard](/hk/tracking/s2s/v3/events-standard)、[iGaming](/hk/tracking/s2s/v3/events-igaming) 和 [Crypto](/hk/tracking/s2s/v3/events-crypto) 參考。事件可用性、必填欄位及已啟用的自訂事件以實際產品目錄為準。HTTP 回應遵循下方 Postback 規則，不直接套用 S2S 錯誤碼表。

### Connection 與金鑰 {#v2-authentication}

使用處於啟用狀態、**恰好關聯一個產品**的 Postback Connection，在 `k` 中帶上其金鑰。legacy partner slug 不能使用 v2。query 不能選擇或覆寫產品。現有參數名稱對應僅適用於 v1，v2 必須直接傳送 canonical 路徑。

透過帳號可用的設定流程或 RevoSurge 聯絡人建立／選擇 Connection，設定伺服器端模板時取得完整金鑰。ACTIVE key 及輪換寬限期內的 RETIRING key 可用；過期／已撤銷 key 或停用的 Connection 回傳 `403`。重新產生金鑰時若未設定寬限期，舊 key 立即撤銷；設定的寬限期最長七天。legacy partner 的 IP 白名單是獨立的 v1 設定，不是 Connection 設定。

目前 Connection URL 產生器回傳 v1 位址。請使用上述路徑及現有 Connection ID/key 組合 v2 URL。**一個接收路徑不代表第三方平台只需一條設定：**平台可能要求每個 canonical 事件分別設定規則及模板。

將 `k` 保存在伺服器端設定中。它不進入業務負載，請求稽核會遮罩；分享 URL 或驗收證據時也應遮蓋金鑰。

### Canonical query 參數 {#v2-parameters}

| 參數 | 要求 | 含義 |
| --- | --- | --- |
| `k` | 必填 | Connection 金鑰 |
| `event` | 必填 | 產品已啟用的精確 canonical 事件名稱 |
| `event_id` | 建議；同時遵循目錄要求 | 穩定來源事件 ID：1–256 個 ASCII 字元，首字元為字母或數字，後續為字母、數字或 `._:~-` |
| `timestamp` | 必填 | 業務實際發生時間，UTC epoch **整數毫秒**，有符號 64 位元；至少 `1000000000000`，未來偏差不超過五分鐘 |
| `identity.client_user_id` / `identity.anonymous_id` | 至少一個，並符合目錄要求 | 穩定使用者或匿名身分；目錄仍可能要求其中某個特定欄位必填 |
| `identity.click_id` | 可取得且目錄允許時傳送 | 用於歸因的 RevoSurge click ID，不能取代使用者身分 |
| `context.*`、其他 `identity.*` | 按有效目錄 | 精確 canonical 路徑、型別、列舉及必填級別 |
| `dryrun`、`testmode` | 可選控制參數 | 驗證或隔離測試模式；不進入業務 `raw` 及雜湊後備 |

v2 不會用 click ID 回填缺失的使用者身分。聯盟平台自己的 click ID 與 RevoSurge click ID 應分別記錄；不能按每次點擊偽造使用者 ID，也不能用接收時間取代業務發生時間。

解析規則如下：

- 點分路徑形成巢狀物件，例如 `context.privacy.marketing_consent`。只接受目錄授權的純量路徑；在 query 值中放入任意 JSON 物件不會形成巢狀物件。
- 缺失、空白及不區分大小寫的字面值 `null` 視為未提供。可選空值從 typed envelope 略去，解碼後的輸入仍保留在 `raw`；必填欄位仍須提供。
- String 保留原內容；Number 使用精確十進位解析並保留 `0`。Boolean 僅接受小寫 `true`、`false`，`1`、`0`、`yes`、`TRUE` 均不能取代；合法 `false` 會保留。
- 秒級時間、ISO 時間字串及小數毫秒會被拒絕；v1 的時間修正不適用於 v2。
- 未知路徑、業務值中的未展開宏、重複 query 名稱（包括同值重複、`k` 及模式參數）及父子路徑衝突均拒收。例如同時傳送 `context.reward` 和 `context.reward.value`。
- 值只做一次 UTF-8 form URL 編碼：`+` 代表空格，字面加號用 `%2B`，`&` 用 `%26`，`%` 用 `%25`。錯誤百分號跳脫或 UTF-8 會被拒絕；`%252B` 只解碼一次，得到字面值 `%2B`。

### 金額與幣別 {#v2-values}

在目錄規定的 canonical 欄位中傳送原幣金額及幣別，v2 不自動換算成 USD。對於 `trade` 契約，`context.amount` / `context.currency` 表示交易，`context.fee_amount` / `context.fee_currency` 獨立表示手續費。精確小數及合法負手續費會保留；缺失金額不會補成零。

`payout` 不是存款、交易額或手續費的別名。僅當有效目錄授權了精確路徑時，才能按其業務定義使用 payout／reward／summary 欄位。未知 payout 參數會被拒收。

### 模式、回應與重試 {#v2-responses}

預設 live。`dryrun=1` 驗證但不發布業務事件；`testmode=1` 發布至隔離測試串流。兩者同時啟用時 dryrun 優先。參數存在且值不是 `0`、不區分大小寫的 `false` 或 `no` 時啟用，裸參數也啟用。接收器回應透過 `X-Ingest-Mode` 回顯實際模式。

| HTTP／結果 | `status` / `code` | `stored` / `publishOutcome` | 處理方式 |
| --- | --- | --- | --- |
| `200`，合法 dryrun | `validated` / `VALIDATED` | `false` / `not_attempted` | 檢查 envelope；沒有發布業務事件 |
| `200`，live/test broker ACK | `accepted` / `PUBLISHED` | `true` / `confirmed` | 不重試 |
| `400`，錯誤編碼 | `rejected` / `INVALID_QUERY` | `false` / `not_attempted` | 修正編碼 |
| `400`，重複參數／宏／未知或衝突路徑 | `rejected` / `VALIDATION_ERROR` | `false` / `not_attempted` | 修正指出的欄位／規則 |
| `422`，必填／型別／列舉／時間／身分錯誤 | `rejected` / `VALIDATION_ERROR` | `false` / `not_attempted` | 修正負載 |
| `422`，Connection 未恰好綁定一個產品 | `rejected` / `SINGLE_PRODUCT_REQUIRED` | `false` / `not_attempted` | 修正 Connection 關聯 |
| `422`，事件不可用 | `rejected` / `UNKNOWN_EVENT_TYPE` 或 `EVENT_DISABLED` | `false` / `not_attempted` | 核對精確名稱、產品授權及啟用狀態 |
| `403`，鑑權失敗 | 現有鑑權回應 | 不發布業務事件 | 修正 key／Connection，勿盲目重試 |
| `429`，限流 | 現有限流回應 | 不發布業務事件 | 遵循 `Retry-After` |
| `503`，目錄未載入／衝突 | `rejected` / `CONFIGURATION_UNAVAILABLE` 或 `CATALOG_EVENT_CONFLICT` | `false` / `not_attempted` | 退避重試；持續設定錯誤由 RevoSurge 排查 |
| `503`，目的串流關閉／不可用 | `rejected` / `PUBLISH_DISABLED` 或 `TEST_STREAM_UNAVAILABLE` | `false` / `not_attempted` | 聯絡 RevoSurge 恢復目的串流，避免密集重試 |
| `503`，傳送失敗 | `rejected` / `PUBLISH_FAILED` | `false` / `failed` | 退避重試，保留來源 ID |
| `503`，等待 ACK 逾時 | `rejected` / `PUBLISH_TIMEOUT` | `false` / `unknown` | 可能晚到；重試保留來源 ID |

接收器 verdict 包含 `status`、`code`、`mode`、`stored`、`publishOutcome`、`requestId`、`catalogVersion`、`envelope` 及 `violations`（`field` / `rule`）。鑑權及限流回應不承諾此結構。合法 dryrun 回傳 `200`；錯誤 dryrun 可以回傳 `400`、`422`、`403`、`429` 或 `503`。

v2 的 live/test 始終等待 broker ACK。`stored=true` 表示已確認發布至對應串流，不代表已完成 ClickHouse 入庫、統計去重、報表或 Campaign 歸因。`stored=false` 且 outcome 為 `unknown` 只表示回應時尚未確認，不會取消已在途傳送。稽核記錄獨立於業務發布；僅有 `requestId` 或稽核記錄不能證明業務送達。

連線錯誤／逾時及可重試 `503` 使用指數退避。每次嘗試保留原 `event_id`、交易 ID、業務發生時間及業務值；`requestId` 識別請求，不能取代來源業務 ID。

### 請求範例 {#v2-examples}

將 `MMP_URL` 設為已確認的 MMP origin（無結尾斜線），`CONNECTION_ID` 設為單產品 Connection ID，`POSTBACK_KEY` 設為其金鑰。下方 `TS_MS` 為範例產生一次合成事件時間，重試重用；真實事件使用實際發生時間。

使用隔離測試產品及已確認的測試 origin。以下是合成範例，不是生產轉換證據。`register` 必須符合有效目錄的基礎欄位要求，文件中的 Standard 契約包括 `identity.client_user_id` 及 `context.ip_address`。`trade` 還要求已啟用相容的 Crypto 契約，並提供交易 ID、產品類型、金額／幣別及手續費金額／幣別。執行前確認這些要求，不應為通過範例而略去必填欄位。

```bash
TS_MS=$(python3 -c 'import time; print(time.time_ns() // 1000000)')

# 驗證 register，不發布業務事件；false 應保留。
curl --get "$MMP_URL/v2/pb/$CONNECTION_ID/events" \
  --data-urlencode "k=$POSTBACK_KEY" --data-urlencode 'dryrun=1' \
  --data-urlencode 'event=register' --data-urlencode 'event_id=docs-register-1' \
  --data-urlencode "timestamp=$TS_MS" \
  --data-urlencode 'identity.client_user_id=测试 + & 用户' \
  --data-urlencode 'context.ip_address=192.0.2.139' \
  --data-urlencode 'context.privacy.marketing_consent=false'

# 隔離測試：原幣、高精度金額及獨立的負手續費。
curl --get "$MMP_URL/v2/pb/$CONNECTION_ID/events" \
  --data-urlencode "k=$POSTBACK_KEY" --data-urlencode 'testmode=1' \
  --data-urlencode 'event=trade' --data-urlencode 'event_id=docs-trade-1' \
  --data-urlencode "timestamp=$TS_MS" \
  --data-urlencode 'identity.client_user_id=docs-player' \
  --data-urlencode 'context.ip_address=192.0.2.139' \
  --data-urlencode 'context.transaction_id=docs-order-1' \
  --data-urlencode 'context.product_type=futures' \
  --data-urlencode 'context.amount=0.12345678901234567890123456789' \
  --data-urlencode 'context.currency=BTC' \
  --data-urlencode 'context.fee_amount=-0.000000000000000001' \
  --data-urlencode 'context.fee_currency=USDT'
```

零手續費交易使用新的事件／交易 ID，並傳送 `context.fee_amount=0`。存款使用產品已啟用的 `deposit` 契約及其必填欄位，不重用交易專屬欄位。經過約定的受控 live 測試移除兩個模式參數並使用新的來源事件 ID；重試該事件時保留原時間及 ID。

經約定的受控 live 階段使用確認的 origin 及新事件 ID，不帶兩個模式參數：

```bash
curl --get "$MMP_URL/v2/pb/$CONNECTION_ID/events" \
  --data-urlencode "k=$POSTBACK_KEY" \
  --data-urlencode 'event=register' --data-urlencode 'event_id=docs-live-register-1' \
  --data-urlencode "timestamp=$TS_MS" \
  --data-urlencode 'identity.client_user_id=docs-player' \
  --data-urlencode 'context.ip_address=192.0.2.139'
```

第一條範例的合法 dryrun verdict 示意（請求 ID、目錄版本及時間按實際結果變更）：

```json
{
  "status": "validated",
  "code": "VALIDATED",
  "mode": "dryrun",
  "stored": false,
  "publishOutcome": "not_attempted",
  "requestId": "synthetic-request-example",
  "catalogVersion": 42,
  "envelope": {
    "event": "register",
    "event_id": "docs-register-1",
    "timestamp": 1794801600000,
    "identity": {
      "client_user_id": "测试 + & 用户"
    },
    "context": {
      "ip_address": "192.0.2.139",
      "privacy": {
        "marketing_consent": false
      }
    }
  },
  "violations": []
}
```

### 來源 ID 與交付邊界 {#v2-deduplication}

業務鍵為 `<connectionId>:<source-key>`。source-key 優先次序為 `event_id`，其次 `context.transaction_id`，最後為 `h:` 加上排序、解碼後、採用 JSON framing 的 raw 業務參數 SHA-256。`k`、模式、請求 ID、協定及目錄版本不進入雜湊；業務值或時間變更可能改變後備鍵。

來源 `event_id` 應在 Connection 內跨事件類型唯一，不能只在某個事件名稱下唯一。dryrun 請求同樣計入鑑權後的限流。

此鍵為下游去重提供依據，產生鍵及取得 Kafka ACK 本身不會刪除重複事件。跨 v1/v2 雙發不保證自動去重；請約定切換邊界，並用保留的來源業務 ID 對帳。繼續完成[整合驗證](/hk/tracking/postback/validation#v2-validation)及[交付](/hk/tracking/postback/handoff#v2-handoff)。

## v1 相容參考 {#v1-compatibility}

以下內容僅適用於五條 v1 路徑。現有 v1 接入可繼續使用；只修改 query 名稱或增加 `event` 不會變成 v2。原章節錨點繼續保留。

### Postback 與伺服器事件 API 的分別

| | 合作夥伴 Postback | [伺服器事件 API (v3)](/hk/tracking/s2s/v3/server-events-api) |
|---|---|---|
| 由誰發起呼叫 | 你的聯盟後台 | 你的後端 |
| 傳輸方式 | `GET` + 查詢字串宏 | `POST` + JSON 信封 |
| 認證 | `k` 參數中的靜態金鑰 | `X-API-KEY` 標頭 |
| 接入方式 | 按事件類型各註冊一條 URL | 自行撰寫一套整合 |
| 適用於 | 後台本身已會發出 postback 的營運方 | 需要完全掌控事件目錄與負載 |

> [!TIP]
> 兩者並不互斥。Postback 通常用於營運方後台掌握的結算事件（註冊、存款、收入分成），而伺服器事件 API 承載更豐富的產品內事件流。

### 基礎 URL

| 環境 | 基礎 URL |
| --- | --- |
| 生產 | `https://mmp.revosurge.com` |

v1 路徑中的 `{partner}` 可以是 Postback Connection ID，也可以是 RevoSurge 設定的 legacy partner slug。使用為你的接入分配的識別碼及金鑰。

### 認證

在 `k` 中傳送匹配的金鑰。Connection ID 使用[上方](#v2-authentication)說明的 ACTIVE／RETIRING key、啟停及輪換寬限規則；v1 Connection 可以關聯多個產品。Connection 參數別名在 v1 解析前套用；別名與原名衝突時別名優先，保留原始輸入。`k`、`dryrun`、`testmode` 不可重新對應。

legacy partner 憑證仍由 RevoSurge 單獨設定，可帶出口 IP 白名單；Connection 路徑不繼承此 legacy 白名單。錯誤／過期 key、停用 Connection 或不允許的 legacy IP 回傳 `403`。鑑權後的限流回傳 `429` 及 `Retry-After`。

金鑰保存在伺服器端設定中，分享 URL 時遮蓋。`k` 不進入業務原始輸入，請求稽核會遮罩。

### 端點

RevoSurge 採用**本地 postback (local postback)**：每種事件類型一條 URL。**事件類型由 path 決定** — `event` 宏只作為交叉核對記錄下來，絕不用於判定轉換類型，所以你方模板展開值的變化，不會悄悄把我們的轉換重新分類。

<HttpMethod method="GET" path="/v1/pb/{partner}/registration" />

<HttpMethod method="GET" path="/v1/pb/{partner}/first-deposit" />

<HttpMethod method="GET" path="/v1/pb/{partner}/repeat-deposit" />

<HttpMethod method="GET" path="/v1/pb/{partner}/revenue" />

<HttpMethod method="GET" path="/v1/pb/{partner}/app-launch" />

| 端點 | 記錄為 | `reported_first` | 何時觸發 |
|----------|-------------|------------------|--------------|
| `/registration` | `register` | — | 玩家帳號建立 — 第一個帶有玩家 id 的事件 |
| `/first-deposit` | `deposit` | `1` | 你的系統認定為該玩家首次存款的那一筆 |
| `/repeat-deposit` | `deposit` | `0` | 之後的任何一筆存款 |
| `/revenue` | `partner_revenue` | — | 一次收入分成結算事件 |
| `/app-launch` | `app_launch` | — | App 的**每一次**啟動 — 參閱 [App 啟動](#app-啟動) |

五條 URL 的**參數集完全一致** — 只有 path 不同 — 所以可以用同一份模板註冊。只需註冊你實際會傳送的事件所對應的端點。

關於記錄方式，有三點需要說明：

- **`first-deposit` 與 `repeat-deposit` 都存為 `deposit`**，你對「首存」的判斷會保留為一個旗標，而不是當成事實。RevoSurge 會獨立計算首存，兩個口徑之間的差額就是零成本的對帳訊號。
- **`revenue` 存為 `partner_revenue`，而不是 GGR。** 它是佣金金額，與營運方 GGR 相差一個分成比率；把兩者混為一談是單位錯誤，不是命名喜好。
- **`app-launch` 存為 `app_launch`，絕不記為安裝（install）。** 它是活躍訊號，不是轉換 — 詳見下文。

> [!WARNING]
> **已註冊 `first-deposit` 與 `repeat-deposit` 之後，請不要再註冊 "all deposits"** — 否則每一筆存款都會被重複計算。
>
> **請不要註冊 global postback**（一條 URL、事件類型放在宏裏）。事件類型已經在 path 內。日後若新增事件類型，我們會另外發一條 URL 給你。

#### App 啟動

`/app-launch` 回傳的是 App 內的活躍，而不是轉換。請在**每一次**啟動時觸發 — 不只是安裝後的首次啟動，也不是每位玩家只發一次。

- **它不是安裝。** App 安裝經由你的 MMP 回傳給 RevoSurge（參閱 [AppsFlyer](/hk/mmp/appsflyer/overview)）。啟動一律記為 `app_launch`，絕不計入安裝，所以啟動 postback 不會與 MMP 已上報的安裝重複計算。請不要把安裝 postback 指向這條 URL。
- **如果你的後台會標記首次啟動**，仍然發到 `/app-launch`，並把你自己的旗標作為額外參數帶上，參數名稱請與你的客戶經理議定。未列出的參數會[原樣保留](#參數)，所以這個旗標毋須我們改動即可送達 — 但它不會把一次啟動變成安裝。
- **不帶 `amount`。** 啟動沒有金額；該宏留空或省略即可。
- **身份規則同樣適用。** 既沒有 `click_id` 也沒有 `user_id` 的啟動 — 例如玩家註冊之前、而你的平台又拿不到 click id 的那次啟動 — 會被丟棄，並回傳 `200 {"status":"ignored"}`。請用你的真實模板做一次 [dry run](#dry-run)，確認你的啟動回傳實際帶了哪些身份。
- **每次啟動傳送唯一的 `event_id`。** 啟動天生會重複：若沒有 `event_id`（或 `txid`）和 `ts`，同一玩家的兩次啟動可能產生完全相同的 URL，被合併成一條記錄。參閱[去重](#去重)。
- **回應約定相同。** `/app-launch` 的回應與各轉換端點完全一致，包括 `503` — 按同樣方式重試，你的後台只需維護一條重試規則。

### 參數

所有端點接受同一套參數。請把你後台的宏對應到這些參數名上 — 左邊的參數名是契約，右邊的宏語法是你方的。

| 參數 | 必填 | 說明 |
|-----------|----------|-------------|
| `k` | 是 | 你的 postback 金鑰（參閱[認證](#認證)） |
| `click_id` | 是\* | RevoSurge 的 click id，由投放時攜帶的 sub 參數原樣回傳（通常是 `{sub1}`）。唯一的活動層級歸因錨點 |
| `user_id` | 是\* | 你方的假名化玩家 id，用來把同一玩家的事件串連起來 |
| `ctx` | 建議 | RevoSurge 的投放脈絡，原樣回傳（通常是 `{sub2}`）。click id 過窗後的後備歸因 |
| `event_id` | 建議 | 你方全域唯一的事件 id，用作去重鍵 — 參閱[去重](#去重) |
| `txid` | 建議 | 交易 id，去重鍵的第二選擇 |
| `event` | 建議 | 你自己的事件類型宏。只作為與端點 path 的交叉核對記錄，不用於判定類型 |
| `amount` | 存款與收入必填 | 金額，十進位數。**帶正負號** — 參閱[數值如何被解讀](#數值如何被解讀) |
| `currency` | 非 USD 金額時建議 | 原聲明幣別；缺失／空白預設為 USD。參閱下方換算規則 |
| `ts` | 建議 | 事件時間，**unix 毫秒** |
| `country` | 選填 | 玩家國家 |
| `attribution_share` | 選填 | 你方聲明的本次轉換歸因份額 — 參閱[你方聲明欄位的含義](#你方聲明欄位的含義) |
| `is_new_customer` | 選填 | 你方聲明該玩家對**你們**是新客。接受 `1`/`0`、`true`/`false`、`yes`/`no` |
| `first_deposit_ts` | 選填 | 你方聲明的首存時刻，**unix 毫秒** — 與 `ts` 同單位、同解析規則 |
| `hash_id`、`hash_name` | 建議 | 你方的連結／帳號分類識別碼 |
| `source_id`、`source_name` | 建議 | 你方的流量來源分類識別碼 |

\* **`click_id` 與 `user_id` 至少要有其一。** 兩者皆無的 postback 無法對應到任何對象，會被丟棄（並回 `200` — 參閱[回應](#回應)）。

在 v1 中，缺失或未展開的 `user_id` 視為未提供，有效 `click_id` 可用於回填（`userIdBackfilled=true`）。`click_id` 中出現字面宏時，即使另有身分也會丟棄事件。能提供時請傳送真實穩定的 `user_id`；click 回填不能證明玩家身分穩定。v2 沒有此回填。

未在此列出的參數會**原樣保留**在已儲存的事件上，所以你日後新增的宏，毋須我們改動即可送達。

#### 你方聲明欄位的含義

`attribution_share`、`is_new_customer`、`first_deposit_ts` 是**你方的聲明**。RevoSurge 會把它們記錄在我方自行計算的結果**旁邊**，而不是用來取代它。

三者都是**選填**的，而且**新增它們毋須重新註冊現有 URL** — 已註冊的連結一切照舊，我方收不到的參數只會記為空值。若你是首次註冊，建議現在就把它們加進模板，以免日後再付一次重新註冊的成本：

```text
&attribution_share={attribution_share}&is_new_customer={is_new_customer}&first_deposit_ts={first_deposit_ts}
```

- **`attribution_share` 原樣儲存。** 契約並未聲明它的標度 — `0.5` 與 `50` 都讀作「一半」 — 因此 RevoSurge 既不換算，也不會用它去乘任何金額。在有人依賴這個數字之前，請先與我們明確約定標度。
- **`is_new_customer` 是你方的判斷，不是我方的首存計算。** 我方仍然獨立判定首次存款；兩者的差值是對帳訊號，不是錯誤。我方讀不懂的值會記為空值，絕不記為 `0` — 「你說不是」與「我方讀不懂」不能塌縮成同一個答案。
- **`first_deposit_ts` 完全遵循 `ts` 的規則。** 參閱[數值如何被解讀](#數值如何被解讀)。

#### 為甚麼我們要那幾個分類欄位

對單一帳號的整合而言，`hash_id`、`hash_name`、`source_id`、`source_name` 通常是**常數**，今天並不參與歸因。我們仍然要求帶上，原因是：

1. 出現不屬於我們的值，代表流量接錯了 — 要麼別人的流量被指向我們的 URL，要麼我們的流量被登記在別的帳號下。這一項已接上監控與告警。
2. 一旦整合擴展到多條連結，它們立即就有意義。
3. 事後補一個宏，代表要在你的後台重新註冊這些 URL。由第一天就帶齊便宜得多。

### 範例

#### URL 模板

為你傳送的每個事件註冊一條 URL，替換當中的夥伴代號與金鑰。`{...}` 內的值是**你後台的宏名稱** — 下例採用常見的 `sub1`／`sub2` 慣例。

```text
https://mmp.revosurge.com/v1/pb/{partner}/registration?k=<KEY>&click_id={sub1}&ctx={sub2}&event={event}&user_id={user_id}&event_id={event_id}&txid={transaction_id}&amount={amount}&ts={date}&country={country}&hash_id={hash_id}&hash_name={hash_name}&source_id={source_id}&source_name={source_name}

https://mmp.revosurge.com/v1/pb/{partner}/first-deposit?k=<KEY>&…相同的查詢字串…

https://mmp.revosurge.com/v1/pb/{partner}/repeat-deposit?k=<KEY>&…相同的查詢字串…

https://mmp.revosurge.com/v1/pb/{partner}/revenue?k=<KEY>&…相同的查詢字串…

https://mmp.revosurge.com/v1/pb/{partner}/app-launch?k=<KEY>&…相同的查詢字串…
```

#### 一次實際觸發

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

```text [最終 URL]
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

### 回應

以下為 **v1 live** 回應。業務目的串流啟用且採用預設同步確認時，`200 ok` 在 broker ACK 後回傳。歷史非同步相容模式或人為關閉業務目的串流時，也可能回傳 `200 ok` 而沒有確認業務發布。交接時核對實際設定及送達證據，單看 `200` 不夠。

| 狀態碼 | 回應體 | 含義 | 是否重發 |
| --- | --- | --- | --- |
| `200` | `{ "status": "ok" }` | 按實際 v1 發布設定接受 | 不自動重試 |
| `200` | `{ "status": "ignored" }` | 無可用身分或 click 宏拒收；無業務事件 | 修正輸入 |
| `503` | `{ "status": "unavailable" }` | 發布未確認；逾時後可能晚到 | 保留來源 ID 重試 |
| `403` | 現有鑑權回應 | key／Connection 錯誤或 legacy IP 不允許 | 修正設定 |
| `429` | 現有限流回應 | 鑑權後限流 | 遵循 `Retry-After` |

v1 的寬容准入失敗不回傳負載 `4xx`；此規則不適用於 v2。

#### 我們期望的重試策略

對 `503`、連線錯誤及逾時使用指數退避，保留 `event_id`、`txid`、來源時間及業務值。`429` 遵循 `Retry-After`。修正 `403` 後再發，不自動重試 `200`。來源鍵為下游去重提供依據，不代表去重已經完成。

### 去重

來源鍵優先次序為 `event_id`，其次 `txid`，否則為 `h:` 加上解碼後的 raw 參數按名稱排序、以 `k=v` 對串接後的 SHA-256。參數次序變更不改變後備鍵，業務值或時間變更可能改變。鑑權及模式參數排除在外。Connection 加 `<connectionId>:` 前綴，legacy partner 保留無前綴形式。

傳送跨事件類型全域唯一且穩定的 `event_id`，重試時原樣重用。產生鍵本身不合併記錄，業務去重由下游消費者執行。v1/v2 的雜湊表示不同，雙發不保證自動去重。

### 數值如何被解讀

| 欄位 | 規則 |
|-------|------|
| `amount` | 按帶正負號的十進位數解析。**負值是合法的** — 在收入分成之下，營運方虧損的期間對應一次負的收入事件。原始字串一律與解析值一併保留，所以解析失敗也不會遺失這個數字 |
| 幣別 | 傳送原 `amount` 及 `currency`，缺失／空白幣別預設為 USD。啟用換算補充後，受支援幣別使用可用的金融匯率快照；USD 及 USDT 使用明確的同幣／1:1 策略。匯率不可用時來源事件仍傳送。保留來源欄位並檢查 `revosurge_currency_conversion_status`，成功的 `revosurge_target_amount` 才是衍生 USD 金額。舊 `amount` 仍為傳入數字，舊 `currency` 仍為 USD，不能據此判定已經換匯 |
| `ts` | **unix 毫秒**，這一點沒有變。若我方收到秒級值，會歸一化後記錄事件時間 — 但這次修正會被視為**契約偏離**：它會觸發我方告警，我們會與你聯絡。它不是第二種受支援的格式，請不要依賴它。兩種讀法都不成立的值（超出合理範圍、負數、非數字）**無法還原事件時間**：該事件將沒有時間戳，只保留原始字串 |
| `first_deposit_ts` | 與 `ts` 的規則完全一致 — 同單位、同修正、同告警 |
| `attribution_share` | 原樣記錄，絕不換算標度，也絕不用它乘任何金額 — 參閱[你方聲明欄位的含義](#你方聲明欄位的含義) |
| 事件時效 | 超過 **30 天**的舊事件，或超過未來 **60 分鐘**的事件，會被記錄並標記，而不會被拒絕。在終身收入分成之下，舊玩家的收入事件正是這條整合存在的意義 |
| 未替換的宏 | 以字面宏形式到達的值（例如 `click_id={sub1}`）會視為缺失，而不是一個字串。見下文 |

#### 未替換的宏

URL 被貼進電郵或工單後，會被連結掃描器抓取，此時宏仍是字面值。若不處理，`click_id={sub1}` 就是一個非空字串，會憑空造出一筆看來完全合法的轉換。因此：

- `click_id` 中出現字面宏會**丟棄整條 v1 postback**（`200 ignored`）。
- 缺失／未展開的 `user_id` 視為未提供，有效 click ID 可回填；兩種身分都不可用時忽略事件。
- 其他未展開欄位從解析值略去，原始輸入保留供排查。

### Dry run

在 v1 URL 後加 `dryrun=1`，取得解析／准入判定，不發布業務事件。通過鑑權及限流的探測回傳 `200` 及 `X-Ingest-Mode: dryrun`；鑑權錯誤仍為 `403`，限流仍為 `429`。裸 `dryrun` 及 `dryrun=true` 啟用，`0`、`false`、`no` 關閉，dryrun 優先於 `testmode`。約定的 live 切換前移除兩個參數。

#### 為甚麼需要它

v1 live 准入失敗回傳 `200 ignored`，v1 dryrun 透過 `decision=dropped` 及 `reason` 區分原因；合法判定使用 `decision=accepted`。這與 v2 的 `status=validated/rejected` 契約不同。

#### 判定結果

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

此 v1 示意探測未提供 `user_id`，有效 click ID 被回填。dryrun 的 `stored=false` 符合預期。v1 `testmode` 的 `stored=true` 表示已提交至啟用的隔離串流，不具有 v2 同步確認的保證。

| 欄位 | 含義 |
| --- | --- |
| `route`、`eventName`、`eventDeclared`、`reportedFirst` | 路徑決定的事件及可選來源聲明 |
| `decision`、`reason` | `accepted` 或 `dropped`；丟棄原因為 `unreplaced_macro`、`empty_request`、`no_identity` |
| `dedupKey`、`dedupKeySource` | 來源鍵，適用時帶 Connection 作用域；來源為 `event_id`、`transaction_id` 或 `raw_hash` |
| `clickId`、`userId`、`userIdBackfilled` | 解析後的身分及是否使用 click→user 回填 |
| `eventUnixTs`、`eventTimeRaw`、`coercedTimeFields` | 解析時間、原值及修正過的輸入欄位；目標是修正清單為空 |
| `amount`、`currency`、`unexpectedCurrency` | 舊解析數字、舊 USD 標籤及非 USD 聲明訊號；不表示換算目標金額 |
| `recorded`、`unreplacedMacros` | 原始業務輸入及宏診斷 |
| `productResolution`、`flags`、`warnings` | 存在時表示 Connection 關聯及對應診斷 |

換算結果須檢查業務記錄的 `revosurge_source_*`、`revosurge_target_*` 及換算狀態，v1 verdict 不展示完整 FX 結果。

### 驗證整合

檢查一條真實負載最快的辦法是 [dry run](#dry-run) — 它會回傳判定結果、去重鍵與我方解析出的身分識別，而不記錄任何內容。

在切入真實流量之前，請確認以下四種行為：

```bash
KEY="<your-key>"

# 1. 正常路徑 — 預期 200 {"status":"ok"}
curl -s "https://mmp.revosurge.com/v1/pb/{partner}/registration?k=$KEY&click_id=test-click-001&user_id=p_test"

# 2. 錯誤金鑰 — 預期 403
curl -s -o /dev/null -w '%{http_code}\n' "https://mmp.revosurge.com/v1/pb/{partner}/revenue?k=WRONG"

# 3. 沒有身分識別 — 預期 200 {"status":"ignored"}
curl -s "https://mmp.revosurge.com/v1/pb/{partner}/registration?k=$KEY"

# 4. 未替換的宏 — 預期 200 {"status":"ignored"}
curl -s "https://mmp.revosurge.com/v1/pb/{partner}/registration?k=$KEY&click_id=%7Bsub1%7D"
```

之後請透過你的後台送出一筆真實的測試轉換，並請我們逐欄核對。有三項特別值得明確確認，因為當中任何一項出錯，都會產出「看來乾淨、實際錯誤」的數據：

1. **`ts`（以及若你傳送 `first_deposit_ts`）的單位與時區** — 請傳毫秒。秒級值會被修正，但那會計為一次契約偏離，我們會來找你；兩種讀法都不成立的值會令該事件完全沒有時間。
2. **`event_id` 是否真的送達** — 我們能量度雜湊後備被使用的比例，這個數字應該是零。
3. **`hash_id` 與 `source_id` 的實際值** — 在我們記錄你的基準值之前，漂移告警是靜默的。
