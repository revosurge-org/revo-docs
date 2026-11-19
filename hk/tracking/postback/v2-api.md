---
title: "Partner Postback API (v2)"
description: "Partner Postback v2 的 Connection、規範查詢參數、範例、驗證及回應規則。"
---

# Partner Postback API (v2)

先[選擇版本](/hk/tracking/postback/overview#choose-version)，再按[設定與測試指南](/hk/tracking/postback/setup-postback)完成平台設定。生產 MMP origin 為 `https://mmp.revosurge.com`。測試 origin 和接入範圍請與 RevoSurge 確認。

## v2 API {#v2-api}

<HttpMethod method="GET" path="/v2/pb/{connectionId}/events" />

`v2` 是傳輸版本。伺服器選擇產品目前有效的事件目錄，呼叫方不在 URL 中選擇 preset 或目錄版本。事件及欄位定義共用[事件目錄](/hk/tracking/events/catalog-validation)、[Standard](/hk/tracking/events/events-standard)、[iGaming](/hk/tracking/events/events-igaming) 和 [Crypto](/hk/tracking/events/events-crypto) 參考。事件可用性、必填欄位及已啟用的自訂事件以實際產品目錄為準。HTTP 回應遵循下方 Postback 規則，不直接套用 S2S 錯誤碼表。

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

### 註冊裝置欄位 {#v2-registration-device}

`register`、`referral_register` 可透過 canonical 點分 query 參數傳送 `context.device_brand`、`context.device_model`、`context.platform` 及 `context.os`。四個欄位均為 **String / 建議**；其餘負載有效時，可提供任意子集，亦可全部略去。`platform` 僅接受 `web`、`android`、`ios`；其他三個欄位並無封閉列舉。

使用實際完成本次註冊的裝置；推薦註冊使用**新用戶**的裝置。保留原始型號識別碼，並略去無法取得的值，完整規則參見[註冊裝置採集](/hk/tracking/events/events-standard#registration-device)。v2 會從 typed envelope 略去空白值，但不會自動清理品牌、型號及作業系統欄位中的 `-`，應由傳送端清理不可用值。

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
  --data-urlencode 'context.device_brand=Apple' \
  --data-urlencode 'context.device_model=iPhone15,3' \
  --data-urlencode 'context.platform=ios' \
  --data-urlencode 'context.os=iOS' \
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
      "device_brand": "Apple",
      "device_model": "iPhone15,3",
      "platform": "ios",
      "os": "iOS",
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

此鍵為下游去重提供依據，產生鍵及取得 Kafka ACK 本身不會刪除重複事件。跨 v1/v2 雙發不保證自動去重；請約定切換邊界，並用保留的來源業務 ID 對帳。繼續完成[整合驗證](/hk/tracking/postback/validation#v2-validation)及[交付](/hk/tracking/postback/setup-postback#_5-before-launch-and-after-changes)。
