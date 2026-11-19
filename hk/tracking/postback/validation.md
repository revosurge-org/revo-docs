---
title: 合作夥伴 Postback 整合驗證
description: 分版本的 v2／v1 Postback 驗證規則、反例探測、重試及送達證據。
---

# 合作夥伴 Postback 整合驗證

按平台實際呼叫的 API 版本驗證。[v2 canonical 事件](/hk/tracking/postback/v2-api#v2-api)使用 `PB2-*`；下方現有 `PB-R-*` / `PB-O-*` 保留 v1 範圍及歷史主題。必要規則阻擋上線，建議規則記錄資料品質及對帳缺口。

## v2 整合驗證 {#v2-validation}

| ID | 必要規則 | 故障與修復 |
| --- | --- | --- |
| `PB2-R-01` | Connection 啟用、`k` 有效，恰好關聯一個產品 | key 錯誤／過期或 Connection 停用為 `403`；關聯錯誤為 `422 SINGLE_PRODUCT_REQUIRED`。修正 Connection，而不是 query 產品 ID |
| `PB2-R-02` | 精確、已啟用的 canonical `event` 及目錄授權路徑 | `422 UNKNOWN_EVENT_TYPE` / `EVENT_DISABLED`，未知路徑為 `400`。確認產品有效目錄；v1 別名不適用 |
| `PB2-R-03` | 穩定的 `identity.client_user_id` 或 `identity.anonymous_id`，並符合目錄身分要求 | `422`。click ID／event ID 不能取代使用者身分，應向來源方取得真實欄位 |
| `PB2-R-04` | 業務實際發生的 `timestamp`，UTC 整數毫秒 | 秒、ISO 字串、小數、低於 `1000000000000` 或超過未來五分鐘為 `422`。修正來源單位／時間，不使用接收時間 |
| `PB2-R-05` | 所有必填欄位符合型別、列舉及格式 | `422`。包含基礎及事件專屬欄位；Boolean 為小寫 `true/false`；保留真實 `0`、`false`、精確小數及允許的負手續費 |
| `PB2-R-06` | 宏已展開、query 名稱唯一、路徑無衝突、一次 UTF-8 編碼合法 | `400`；檢查 `violations[].field/rule` 或 `INVALID_QUERY`。同值重複也非法，包括 `k` 及模式參數 |
| `PB2-R-07` | 金額、幣別、手續費及 payout 保持業務含義 | 符合 schema 的數字仍可能是錯誤事實。對照來源核驗原幣及獨立手續費；v2 不換算 USD |
| `PB2-R-08` | 按版本處理回應與重試 | 修正 `400/422` 負載及 `403` 憑證；遵循 `429 Retry-After`；`503`／網路錯誤退避重試，保留來源 ID 及時間；`unknown` 可能晚到 |
| `PB2-R-09` | 模式正確且由伺服器端觸發 | dryrun 不發布業務，test 進入隔離串流。經約定的 live 流量移除兩個參數，核對 `accepted`、`stored=true`、`confirmed`；避免瀏覽器暴露 `k` |

| ID | 建議規則 | 驗證方式 |
| --- | --- | --- |
| `PB2-O-01` | 提供穩定唯一的來源 `event_id`，適用時提供真實 `context.transaction_id` | 核對 envelope 保留兩者，重試重用；兩者都不是伺服器 `requestId` |
| `PB2-O-02` | 可取得且目錄允許時回傳 RevoSurge click ID | 核對 `identity.click_id`，與聯盟平台自己的 click ID 分開；不要偽造 |
| `PB2-O-03` | 追蹤有效目錄及平台宏的變更 | 欄位、列舉、授權或模板變更後重跑 dryrun/test；呼叫方不鎖定 `catalogVersion` |

### 必要探測與證據 {#v2-probes}

從產品完整合法的負載開始，每次只改變一個條件。鑑權、關聯及目錄可用性先於部分欄位檢查執行，應先符合這些前提。

| 探測 | 預期結果 |
| --- | --- |
| 合法 `dryrun=1` | `200`、`validated`、`stored=false`、`not_attempted`；檢查 typed envelope |
| 兩個使用者身分都缺失，或目錄必填欄位缺失 | `422 VALIDATION_ERROR` |
| 業務值中的字面宏；未知路徑；同值 query 重複；父子路徑衝突 | `400 VALIDATION_ERROR` |
| 錯誤 `%` 跳脫或非法 UTF-8 | `400 INVALID_QUERY` |
| 秒／小數／超前時間；錯誤型別／列舉；Boolean 使用 `1` | `422 VALIDATION_ERROR` |
| 錯誤 key／非單產品 Connection | `403` / `422 SINGLE_PRODUCT_REQUIRED` |
| 合法 `testmode=1` | `200`、`accepted`、`stored=true`、`confirmed`，並有匹配的隔離業務訊息 |

保留遮罩請求、實際回應、來源 ID、`requestId` 及實際 `catalogVersion`。技術負責人還需分別確認 dryrun／拒收無業務發布，並讀回匹配的 test/live 訊息。僅有稽核記錄不夠。發布失敗／逾時行為應在受控故障測試中驗證，不在共用生產環境製造故障。

v2 以[回應與重試矩陣](/hk/tracking/postback/v2-api#v2-responses)為準。目錄首次載入前不可用回傳 `503`；後續更新失敗保留上次有效快照。目錄契約衝突也回傳 `503`，由 RevoSurge 排查，不能視為驗證成功。

## v1 整合驗證 {#v1-validation}

以下規則僅適用於五條 v1 路徑。規則 ID 及原章節錨點繼續供既有工單使用。v1 的寬容負載回應及 click→user 回填不適用於 v2。

### 必要規則 {#required-rules}

| ID | 規則 | 失敗會導致甚麼 |
| --- | --- | --- |
| `PB-R-01` | 每次呼叫都帶上正確的 `k` | `403`。甚麼都不會被記錄。 |
| `PB-R-02` | **端點路徑**與事件相符 — 事件類型由路徑決定 | `event` 宏只作交叉核對記錄，絕不用於判定類型。把充值發到註冊路徑，它就永遠是一次註冊。 |
| `PB-R-03` | `click_id` 與 `user_id` 至少有一個 | `200 {"status":"ignored"}`。在你的日誌裏看來是成功，但這筆轉換並不存在。 |
| `PB-R-04` | 正確展開身分宏 | 字面 `click_id` 宏會丟棄事件；缺失／未展開的 `user_id` 可由有效 click ID 回填 |
| `PB-R-05` | 首次充值發到 `/first-deposit`，之後的充值發到 `/repeat-deposit` | 首存（FTD）數會雙向出錯，而 FTD 通常正是廣告系列的出價目標。 |
| `PB-R-06` | `ts` 是 unix **毫秒**，不是秒 | 秒級值會被自動修正，並當作契約偏離上報。不會有任何失敗，但你依賴的是我們的修正，而不是傳送你真正想表達的值 — 而且告警會落到你的客戶經理那邊，而不是你。 |
| `PB-R-07` | `/first-deposit`、`/repeat-deposit` 和 `/revenue` 都傳送 `amount`，且正負號正確（`/registration` 與 `/app-launch` 不帶金額） | 沒有可報告的收入，也無從計算 ROAS。 |
| `PB-R-08` | 使用全域唯一且穩定的 `event_id`，重試重用 | 後備為 `txid` 及排序 raw 雜湊；業務值變更可能改變鍵。下游去重須驗證 |
| `PB-R-09` | 重試 `503`／網路錯誤；遵循 `429 Retry-After`；修正 `403` | 保留來源 ID；v1 相容設定下 `200 ok` 不無條件證明 broker ACK |
| `PB-R-10` | 註冊的生產 URL 中**不含** `dryrun` | 每條 postback 都只回傳判定結果，甚麼都不記錄。 |
| `PB-R-11` | `user_id` 與你在 Web 追蹤器和 S2S 中使用的識別碼相同 | 同一玩家變成兩份檔案。充值無法關聯到帶來它的那次點擊。 |
| `PB-R-12` | Postback 從你的後台**伺服器端**觸發，而不是從瀏覽器 | `k` 金鑰以明文出現在 URL 中 — 瀏覽器觸發的 postback 會把它暴露在網頁原始碼裏。用戶端呼叫亦會被廣告攔截器攔掉，並在重新整理時重複觸發。 |

### 建議規則 {#recommended-rules}

| ID | 規則 | 代價是甚麼 |
| --- | --- | --- |
| `PB-O-01` | 傳送 `ctx` | `click_id` 缺失或過期時沒有後備歸因。 |
| `PB-O-02` | 傳送 `txid` 作為第二去重鍵 | 一旦 `event_id` 缺失，去重就會降級為查詢字串雜湊，這很脆弱。 |
| `PB-O-03` | 以真實值填寫 `hash_id` / `hash_name` 和 `source_id` / `source_name` | 沒有按連結或流量來源的細分。廣告系列表現欠佳時，你無法分辨是哪個投放位帶來了這些充值。 |
| `PB-O-04` | 傳送 `country` | 地區報表較弱；我們只能退回到推斷。 |
| `PB-O-05` | 把你自己的事件類型宏作為 `event` 傳送 | 失去能發現端點用錯（`PB-R-02`）的交叉核對。 |
| `PB-O-06` | 在你知道時聲明 `is_new_customer` 和 `first_deposit_ts` | 我們無法用自己的首存判定來印證你的首存分類。 |
| `PB-O-07` | 適用時聲明 `attribution_share` | 缺失聲明就無法與你方共享歸因模型核對 |

### 必要項修復方式 {#required-resolutions}

#### `PB-R-01` — 金鑰錯誤或缺失 {#pb-r-01-—-bad-or-missing-key}

透過帳號可用的設定流程或 RevoSurge 聯絡人取得 Connection 金鑰；legacy partner 金鑰單獨管理。遵循輪換寬限期，不將 `k` 放入瀏覽器程式碼。

#### `PB-R-02` — 事件用錯了端點 {#pb-r-02-—-wrong-endpoint-for-the-event}

**修復：** 使用與事件相符的路徑：

| 事件 | 路徑 |
| --- | --- |
| 玩家帳號建立 | `/v1/pb/{partner}/registration` |
| 首次充值 | `/v1/pb/{partner}/first-deposit` |
| 之後的充值 | `/v1/pb/{partner}/repeat-deposit` |
| 收入分成結算 | `/v1/pb/{partner}/revenue` |
| App 啟動（每一次啟動） | `/v1/pb/{partner}/app-launch` |

沒有其他路徑。App **安裝**不是啟動，也沒有對應的 postback 路徑 — 安裝經由你的 MMP 回傳。從啟動路徑發出的註冊，或從註冊路徑發出的啟動，都會被永久錯誤歸類，與存款走錯路徑一樣。

`/revenue` 上的負 `amount` 是合法的 — 在收入分成之下，虧損的期間就是一次負的收入事件。如果你需要專門上報**退款或追回（chargeback / clawback）**，請與你的客戶經理議定表示方式，而不要想當然地以為一條負收入會被這樣解讀。

把 `event` 宏設對並沒有幫助 — 它只作交叉核對記錄，絕不用於判定類型。只有路徑才算數。

#### `PB-R-03` — 沒有可用的身分識別 {#pb-r-03-—-no-usable-identity}

**修復：** 傳送 `click_id`（首選）或 `user_id`。至少有一個必須解析為真實值。

請對照你的*日誌*檢查，而不是憑假設：回應是 `200`，所以你的後台幾乎肯定會把這些報告為已送達。

#### `PB-R-04` — 未替換的宏 {#pb-r-04-—-unsubstituted-macros}

在 v1 中，缺失或未展開的 `user_id` 視為未提供，有效 `click_id` 可用於回填（`userIdBackfilled=true`）。`click_id` 中出現字面宏時，即使另有身分也會丟棄事件。能提供時請傳送真實穩定的 `user_id`；click 回填不能證明玩家身分穩定。v2 沒有此回填。

- `click_id` 中出現字面宏會**丟棄整條 v1 postback**（`200 ignored`）。
- 缺失／未展開的 `user_id` 視為未提供，有效 click ID 可回填；兩種身分都不可用時忽略事件。
- 其他未展開欄位從解析值略去，原始輸入保留供排查。

#### `PB-R-05` — 首次與後續充值走同一路徑 {#pb-r-05-—-first-and-repeat-deposits-on-the-same-path}

**修復：** 你的後台必須知道一筆充值是否是該玩家的首存，並路由到對應的路徑。如果做不到，就把所有充值都發到 `/repeat-deposit` 並告知你的客戶經理 — 少算的首存可以補救；發到註冊路徑的充值則無法補救。

#### `PB-R-06` — 時間戳用了秒 {#pb-r-06-—-timestamp-in-seconds}

**修復：** `ts` 和 `first_deposit_ts` 都是 unix **毫秒**。把 10 位數的值乘以 1000。

秒級值會被偵測、修正，並視為契約偏離 — 事件以修正後的時間儲存，同時觸發告警。所以它不會在你的日誌裏顯示為失敗，但也不是悄無聲息地出錯：你的客戶經理會收到通知。

另外，超過 30 天的舊事件或超過未來 60 分鐘的事件會被記錄並標記，絕不會被拒絕。

#### `PB-R-07` — 金額缺失或正負號錯誤 {#pb-r-07-—-missing-or-wrongly-signed-amount}

每條存款／收入事件傳送帶正負號的十進位 `amount`，保留正確業務符號及合法零值／負值。傳送原 `amount` 及 `currency`，缺失／空白幣別預設為 USD。啟用換算補充後，受支援幣別使用可用的金融匯率快照；USD 及 USDT 使用明確的同幣／1:1 策略。匯率不可用時來源事件仍傳送。保留來源欄位並檢查 `revosurge_currency_conversion_status`，成功的 `revosurge_target_amount` 才是衍生 USD 金額。舊 `amount` 仍為傳入數字，舊 `currency` 仍為 USD，不能據此判定已經換匯

#### `PB-R-08` — 沒有穩定的 `event_id` {#pb-r-08-—-no-stable-event-id}

來源鍵優先次序為 `event_id`，其次 `txid`，否則為 `h:` 加上解碼後的 raw 參數按名稱排序、以 `k=v` 對串接後的 SHA-256。參數次序變更不改變後備鍵，業務值或時間變更可能改變。鑑權及模式參數排除在外。Connection 加 `<connectionId>:` 前綴，legacy partner 保留無前綴形式。

傳送跨事件類型全域唯一且穩定的 `event_id`，重試時原樣重用。產生鍵本身不合併記錄，業務去重由下游消費者執行。v1/v2 的雜湊表示不同，雙發不保證自動去重。

#### `PB-R-09` — 重試行為錯誤 {#pb-r-09-—-wrong-retry-behaviour}

以下為 **v1 live** 回應。業務目的串流啟用且採用預設同步確認時，`200 ok` 在 broker ACK 後回傳。歷史非同步相容模式或人為關閉業務目的串流時，也可能回傳 `200 ok` 而沒有確認業務發布。交接時核對實際設定及送達證據，單看 `200` 不夠。

| 狀態碼 | 回應體 | 含義 | 是否重發 |
| --- | --- | --- | --- |
| `200` | `{ "status": "ok" }` | 按實際 v1 發布設定接受 | 不自動重試 |
| `200` | `{ "status": "ignored" }` | 無可用身分或 click 宏拒收；無業務事件 | 修正輸入 |
| `503` | `{ "status": "unavailable" }` | 發布未確認；逾時後可能晚到 | 保留來源 ID 重試 |
| `403` | 現有鑑權回應 | key／Connection 錯誤或 legacy IP 不允許 | 修正設定 |
| `429` | 現有限流回應 | 鑑權後限流 | 遵循 `Retry-After` |

v1 的寬容准入失敗不回傳負載 `4xx`；此規則不適用於 v2。



對 `503`、連線錯誤及逾時使用指數退避，保留 `event_id`、`txid`、來源時間及業務值。`429` 遵循 `Retry-After`。修正 `403` 後再發，不自動重試 `200`。來源鍵為下游去重提供依據，不代表去重已經完成。

#### `PB-R-10` — dry run 沒有關掉 {#pb-r-10-—-dry-run-left-on}

**修復：** 從後台註冊的 URL 中移除 dry run 參數。`dryrun`、`dryrun=1` 和 `dryrun=true` 都會被接受，所以請搜尋 `dryrun`，而不是某個確切的字串。dry run 回應帶有回應標頭 `X-Ingest-Mode: dryrun`，且不記錄任何內容。

#### `PB-R-11` — 識別碼與你的其他追蹤不一致 {#pb-r-11-—-identifier-does-not-match-your-other-tracking}

**修復：** 在 Web 追蹤器（`user_id`）、S2S（`identity.client_user_id`）和 postback（`user_id`）中，每個玩家使用同一個識別碼。同樣的字串、同樣的大小寫，不要一處帶前綴而其他地方不帶。

這一項出錯時每條 postback 都會成功，只是數字是錯的。事後修正亦不會合併已經拆分開的檔案。

#### `PB-R-12` — 從瀏覽器觸發 postback {#pb-r-12-—-postbacks-fired-from-the-browser}

**修復：** 使用你聯盟平台的伺服器端 postback 功能來觸發。像素或用戶端呼叫會把 `k` 金鑰放進網頁原始碼，會被廣告攔截器攔掉，而且玩家每次重新整理都會重複觸發。

使用 legacy partner 憑證時，RevoSurge 亦可能限制出口 IP 白名單 — 請向你的客戶經理確認是否已為你啟用，因為啟用後來自瀏覽器的呼叫會以 `403` 失敗。

### 建議項修復方式 {#recommended-resolutions}

#### `PB-O-01` — 沒有 `ctx` {#pb-o-01-—-no-ctx}

**修復：** 傳入你的平台提供的投放情境宏。`click_id` 缺失或過期時，歸因正是靠它還原的。

#### `PB-O-02` — 沒有 `txid` {#pb-o-02-—-no-txid}

**修復：** 把你的交易 ID 作為 `txid` 傳送。它是第二去重鍵，也是你們財務團隊對帳時依據的欄位。

#### `PB-O-03` — 分類欄位為空 {#pb-o-03-—-empty-taxonomy-fields}

使用真實連結／帳號及流量來源值。能夠識別約定帳號的穩定常數是有效值；避免虛構佔位符，並記錄無法提供的欄位。

#### `PB-O-04` — 沒有 `country` {#pb-o-04-—-no-country}

**修復：** 如果你的平台提供玩家國家，請傳送它。

#### `PB-O-05` — 沒有 `event` 宏 {#pb-o-05-—-no-event-macro}

**修復：** 把你自己的事件類型宏作為 `event` 傳送。它絕不會改變轉換的分類方式 — 那是端點路徑的職責 — 但端點用錯這類問題，正是靠它在扭曲一整個月的報表之前被發現。

#### `PB-O-06` — 沒有首存聲明 {#pb-o-06-—-no-ftd-declaration}

**修復：** 當你的系統知道 `is_new_customer` 和 `first_deposit_ts` 時，請傳送它們。我們讀不懂的值會記為空值，而不是 `0`。

#### `PB-O-07` — 沒有歸因份額 {#pb-o-07-—-no-attribution-share}

**修復：** 如果你在多個來源之間分攤歸因，請在 `attribution_share` 中聲明你的份額。它會作為你方的聲明被記錄 — 絕不會被換算標度，也不會被乘進 `amount`。

### 本頁無法檢查的兩件事 {#two-things-this-page-cannot-check}

- **你的後台在真實轉換發生時確實會觸發。** 即使平台的 postback 規則已被停用、套用到錯誤的廣告系列，或被一個永遠不會符合的條件過濾掉，你貼進瀏覽器的 URL 依然能通過本頁的每一條規則。只有[上線測試](/hk/tracking/postback/handoff#the-go-live-test)才能證明它確實會觸發。
- **你的總數與我們的一致。** 歸因窗口、分攤歸因模型和結算時點都會合理地改變數字。請按 `event_id` 和 `txid` 對帳，而不是比較總數。

### 下一步 {#next-steps}

所有必要規則都通過後，前往[交付與上線](/hk/tracking/postback/handoff)。
