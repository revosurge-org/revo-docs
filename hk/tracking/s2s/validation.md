---
title: S2S 整合驗證
description: S2S 整合在投放廣告系列前必須通過的規則、每條規則失敗時會壞掉什麼，以及如何修復。
---

# S2S 整合驗證

**對象：** 完成整合的開發者，以及確認整合可以上線的 AM 或 BD。
請在第一個廣告系列上線**之前**跑一遍本頁，而不是等到它投放不足之後。

::: info 規則分兩檔
**必要**規則會阻止上線 — 任何一條失敗，RevoSurge 用來最優化的數據就是錯的或缺失的。**建議**規則不阻止上線，但每一條都會讓你付出具體的代價。

規則 ID（`S2S-R-01`、`S2S-O-01`…）是穩定的。在工單和發給合作夥伴的電郵裡直接引用它們，不必重新描述問題。
:::

## 必要規則 {#required-rules}

| ID | 規則 | 失敗會導致什麼 |
| --- | --- | --- |
| `S2S-R-01` | 已產生 API Key，且 **S2S Status** 顯示 Active | 每個請求都被拒絕，什麼都不會被儲存。 |
| `S2S-R-02` | 請求發往 **v3** 端點（`/v3/s2s/event`、`/v3/s2s/batch`） | v2 將於 **2026 年 10 月 18 日**棄用。v3 之後加入目錄的任何事件都無法透過 v2 存取，而且沒有任何地方會告訴你它缺失了。 |
| `S2S-R-03` | 每個請求都帶 `X-API-KEY` 標頭，且只從你的後端傳送 | 缺少標頭會被直接拒絕。金鑰一旦出現在前端或 App 程式碼裡就是憑證外洩 — 任何人都能往你的帳戶裡寫入事件。 |
| `S2S-R-04` | `event` 是目錄中的準確名稱 | `422 UNKNOWN_EVENT_TYPE`。事件永遠不會入庫，報表裡也不會有任何提示告訴你它缺失了。 |
| `S2S-R-05` | `timestamp` 是 UTC epoch **毫秒**（13 位） | 被拒絕，回傳 `rule: "not_milliseconds"`。用秒是最常見的整合 bug，沒有之一。 |
| `S2S-R-06` | `timestamp` 比真實時間超前不超過 5 分鐘 | 被拒絕，回傳 `rule: "future_skew"`。通常是伺服器時鐘未同步，或做了本地時間轉換。 |
| `S2S-R-07` | 帶有 `identity.client_user_id` | 事件無法關聯到用戶。它會被計數，但對最優化毫無作用。 |
| `S2S-R-08` | `client_user_id` 與你傳給 Web 追蹤器的 `user_id`、傳給 MMP 的 Customer User ID 是**同一個字串** | 同一個玩家變成兩份畫像。充值掛不到帶來它的那次點擊上，同一筆轉換還可能被計兩次。 |
| `S2S-R-09` | 帶有 `context.ip_address` | 沒有地理位置擴充。國家層級報表與地域定向效果下降。 |
| `S2S-R-10` | 兩個基礎事件都已上線：`register` 和 `deposit` | 達不到這一條，S2S 帶給你的不會比 Web 追蹤器更多。FTD 報表一直為空。 |
| `S2S-R-11` | dry run 沒有報告任何拼錯的欄位，也沒有 `violations` | **選填**欄位上一個差一點就對的名稱（`context.payment_metod`）會被靜默丟棄。請求照樣回傳成功，所以看起來一切正常。 |
| `S2S-R-12` | 正式流量回傳 `202`，而不是 `200` | 回傳 `200` 且帶 `X-Ingest-Mode: dryrun` 表示你仍處於 dry run，什麼都沒有被儲存。 |
| `S2S-R-13` | 電郵和電話號碼以雜湊形式傳送，絕不傳送明文 | 被拒絕，回傳 `rule: "pii_format"`；而且只要傳送過明文 PII，就是你要承擔的合規問題。 |
| `S2S-R-14` | 你的產品已**啟用 iGaming 預設集** | `422 EVENT_DISABLED`。在 RevoSurge 啟用之前，所有 iGaming 事件 — 包括 `deposit` — 都會被拒絕。這不是你能在程式碼裡修復的。 |
| `S2S-R-15` | 每個事件都帶有**該事件**要求的 context 欄位 | `400 VALIDATION_ERROR`，`rule: "required"`。`deposit` 需要 `context.transaction_id`、`context.amount` 和 `context.currency` — 三個都要，每筆充值都要。 |
| `S2S-R-16` | 只要你拿得到，伺服器事件上就傳 `identity.click_id` | 歸因只能退回到單靠用戶 ID 拼接。首個工作階段內的轉換 — 新廣告系列恰恰靠它們來評判 — 最容易被漏掉。 |
| `S2S-R-17` | 如果你有**既有玩家**，上線前已回填歷史充值，或已約定截止點 | FTD 是我們看到的最早一筆充值。每個既有玩家的下一筆充值都會被算作首存，虛高第一週的 FTD，並誤導任何以它為出價目標的廣告系列。 |

## 建議規則 {#recommended-rules}

| ID | 規則 | 代價是什麼 |
| --- | --- | --- |
| `S2S-O-01` | 傳送 `login` | 無法區分回流玩家與新玩家，召回與獲客看起來一模一樣。 |
| `S2S-O-02` | 傳送 `deposit_initiated`，並帶上之後的 `deposit` 或 `deposit_failed` 會重複的 `context.transaction_id` | 看不到收銀台流失 — 這通常是 iGaming 漏斗中可挽回的最大損失。 |
| `S2S-O-03` | 傳送 `context.user_agent` | 裝置識別能力變弱，反欺詐訊號也變弱。 |
| `S2S-O-04` | 回填時使用 `/v3/s2s/batch` | 逐條傳送會耗盡單一金鑰的限流額度，回填要花幾個小時而不是幾分鐘。 |
| `S2S-O-05` | 對 `429` 做指數退避加抖動的重試 | 流量高峰時事件被丟棄 — 而那恰恰是它們最重要的時候。 |
| `S2S-O-06` | 測試環境與正式環境使用不同的 API Key | 測試事件污染線上報表和線上出價。 |

## 必要項修復方式 {#required-resolutions}

### `S2S-R-01` — 沒有有效的 API Key {#s2s-r-01-—-no-active-api-key}

**修復：** Product → Setup Wizard → **Step 3 · S2S Postback** → **Generate API Key**。或者
Manage Product → 你的產品 → **S2S** 卡片。金鑰只以遮罩形式顯示一次 — 請立即複製到你的機密管理工具。

產生新金鑰不會撤銷舊金鑰。請有計劃地輪替，並在停用舊金鑰之前先把它從你的後端移除。

### `S2S-R-02` — 仍在呼叫 v2 {#s2s-r-02-—-still-calling-v2}

**修復：** 把基礎路徑從 `/v2/s2s/…` 改為 `/v3/s2s/…`，並把 `timestamp` 從秒改為毫秒傳送。驗證標頭與信封結構不變。見[從 v2 遷移](/hk/tracking/s2s/v3/migration)。

v2 將於 **2026 年 10 月 18 日**棄用。

v2 的任何問題都不會大聲報錯，這正是很多整合停留在 v2 上好幾個月都沒人察覺的原因。

### `S2S-R-03` — API Key 缺失或已外洩 {#s2s-r-03-—-missing-or-exposed-api-key}

**修復：** 只從伺服器端程式碼向 `https://datapulse-api.revosurge.com/v3/s2s/event` 發出 `POST`，帶上
`X-API-KEY: <your key>` 和 `Content-Type: application/json`。

如果金鑰曾經出現在前端 JavaScript、行動應用安裝檔、標籤管理工具或公開程式碼庫中，就把它視為已外洩：產生新金鑰、切換過去，然後停用舊金鑰。

### `S2S-R-04` — 未知的事件名稱 {#s2s-r-04-—-unknown-event-name}

**修復：** 對照[標準事件](/hk/tracking/s2s/v3/events-standard)和
[iGaming 事件](/hk/tracking/s2s/v3/events-igaming)核對名稱。名稱為小寫加底線，必須精確匹配。`first_deposit` 不是目錄中的事件 — 首存以 `deposit` 傳送。

::: info 首存是推導出來的，不是傳送的
每一筆充值都以 `deposit` 傳送。RevoSurge 把該用戶收到的最早一筆 `deposit` 推導為 FTD — 沒有需要設定的首存事件或標記。

由此帶來的後果見 `S2S-R-17`：如果你有既有玩家，他們的下一筆充值就是我們看到的第一筆，會被算作首存。
:::

### `S2S-R-05` — 時間戳以秒為單位 {#s2s-r-05-—-timestamp-in-seconds}

**修復：** 乘以 1000。有效的 `timestamp` 是 13 位；10 位的值是秒，會被拒絕並回傳 `rule: "not_milliseconds"`。

### `S2S-R-06` — 時間戳在未來 {#s2s-r-06-—-timestamp-in-the-future}

**修復：** 傳送 UTC 而不是本地時間，並檢查傳送主機的 NTP。常見原因是轉換本地時間戳時沒有調整時區 — 它只在時區早於 UTC 的伺服器上失敗，所以看起來像是偶發問題。

### `S2S-R-07` — 缺少 `client_user_id` {#s2s-r-07-—-missing-client-user-id}

**修復：** 把你穩定的帳戶 ID 放進 `identity.client_user_id`。對於確實發生在登入之前的事件，改為傳送 `identity.anonymous_id` — identity 至少要帶其中之一。

對於 `app_install`、`app_open` 和 `app_uninstall`，這項要求會**放寬** — 該欄位從必填變為建議填寫，而不是預設就可以不傳。

### `S2S-R-08` — 各接入方式的用戶 ID 不一致 {#s2s-r-08-—-user-id-does-not-match-across-methods}

**修復：** 所有地方都用同一個 ID — 對同一個人，Web 追蹤器的 `user_id`、S2S 的 `identity.client_user_id` 和你 MMP 的 Customer User ID 必須是同一個字串。大小寫一致，也不能一邊帶前綴而另一邊不帶。

這是本頁代價最高的錯誤，而且完全看不出來：每個請求都成功，事件全部儲存，只是數字是錯的。事後修復也無法把已經分裂的畫像追溯合併。

### `S2S-R-09` — 缺少 IP 位址 {#s2s-r-09-—-missing-ip-address}

**修復：** 在 `context.ip_address` 中放**終端用戶**的 IP，而不是你伺服器的 IP。如果位於代理或 CDN 之後，從 forwarded-for 標頭中讀取。

對 `app_install` 和 `bet` 放寬為建議填寫。`bet` 之所以放寬，是因為伺服器端下注可能確實沒有終端用戶 IP — 這是後備方案，不是可以省略它的許可。

### `S2S-R-10` — 兩個基礎事件沒有都上線 {#s2s-r-10-—-basic-events-not-both-live}

**修復：** `register` 和 `deposit` 是最低要求。如果只有一個在觸發，漏斗就沒有轉換率，FTD 報表也無從計數。

### `S2S-R-11` — dry run 報告了拼錯的欄位 {#s2s-r-11-—-dry-run-reports-misspelled-fields}

**修復：** 把你真實的負載發到 `/v3/s2s/event?dryrun=1`，然後查看回顯。單一事件乾淨通過時回傳 `"misspelledFields": []`。批次請求在沒有拼錯時這個鍵會**完全不存在** — 而不是空陣列 — 所以不要對批次回應斷言 `=== []`，否則會得到誤報的失敗。

列在其中的任何鍵都與某個真實欄位足夠接近，我們能猜出你的本意，但它會被丟棄，而不是被更正。

這項檢查對**選填**欄位才有意義。拼錯的必填欄位會以 `400` 明確報錯；拼錯的 `context.payment_method` 則回傳 `202`，然後就這麼消失了。

### `S2S-R-12` — 仍處於 dry run {#s2s-r-12-—-still-in-dry-run}

**修復：** 從正式 URL 中移除 `?dryrun=1`。真實流量回傳 `202` 和
`{"status":"accepted","eventId":"…"}`。如果你看到的是 `200` 且帶標頭
`X-Ingest-Mode: dryrun`，你傳送的任何內容都沒有被儲存。

### `S2S-R-13` — PII 未雜湊 {#s2s-r-13-—-unhashed-pii}

**修復：** `context.privacy.email_hash` 是電郵轉小寫、去除首尾空白後的 SHA-256。
`context.privacy.phone_hash` 是 E.164 正規化後號碼的 SHA-256。兩者都是小寫十六進位，剛好 64 個字元（`^[a-f0-9]{64}$`）。格式錯誤的雜湊會失敗並回傳 `rule: "pii_format"`。

### `S2S-R-14` — 你的產品未啟用 iGaming 事件 {#s2s-r-14-—-igaming-events-disabled-for-your-product}

**修復：** 這無法在程式碼裡修復。iGaming 預設集由 RevoSurge 按產品啟用 — 請聯絡你的客戶經理開啟，然後重新測試。

標準事件（`general.core`）對每個產品自動啟用。iGaming 事件則不是，而 `deposit` 就是 iGaming 事件。一個在其他方面完美無瑕的整合，在訂閱生效之前，每筆充值都會回傳
`422 EVENT_DISABLED`。在排查其他任何問題之前，**先**檢查這一項。

### `S2S-R-15` — 缺少各事件的必填欄位 {#s2s-r-15-—-missing-per-event-required-fields}

**修復：** 在[標準事件](/hk/tracking/s2s/v3/events-standard)和 [iGaming 事件](/hk/tracking/s2s/v3/events-igaming)中查看你傳送的每個事件的必填欄位清單。最容易踩坑的幾個：

| 事件 | 必填的 context 欄位 |
| --- | --- |
| `deposit` | `context.transaction_id` · `context.amount` · `context.currency` |
| `deposit_initiated` | `context.transaction_id` |
| `deposit_failed` | `context.transaction_id` |
| `withdraw` | `context.transaction_id` · `context.amount` · `context.currency` |
| `bet` | `context.transaction_id` |
| `app_install` · `app_open` · `app_uninstall` | `context.platform`（`ios` / `android` / `web`） |

在 `deposit` 上，`context.amount` 和 `context.currency` **不是選填的**。缺少它們的充值會被拒絕，回傳 `400 VALIDATION_ERROR`、`rule: "required"` — 它不會以一筆缺了金額、但仍可計數的充值到達。

在 `deposit_initiated` → `deposit` / `deposit_failed` 之間使用同一個 `context.transaction_id`，這樣收銀台漏斗才能配對。

### `S2S-R-16` — 伺服器事件上沒有 `click_id` {#s2s-r-16-—-no-click-id-on-server-events}

**修復：** 在訪客到達時擷取 RevoSurge 的點擊 ID，把它與其工作階段或帳戶一起保存，並在伺服器事件上以 `identity.click_id` 傳送。它在 `register` 和第一筆 `deposit` 上最重要。

`click_id` 本身並不滿足 identity 要求 — 你仍然需要 `client_user_id` 或 `anonymous_id`（`S2S-R-07`）。

### `S2S-R-17` — 未處理既有玩家 {#s2s-r-17-—-existing-players-not-accounted-for}

**修復：** 上線前二選一：

- **回填。** 透過 `/v3/s2s/batch`（每個請求 600 條）傳送你的歷史充值，讓真正的首存在即時流量開始之前就已記錄在案。
- **約定截止點**：與你的客戶經理約定，並在第一個報表週期內剔除來自已知玩家的 FTD。

只有當該產品確實是一個沒有既有玩家的全新品牌時，才可以跳過這一步。

這不是程式碼缺陷，也不會有任何報錯。它表現為一個第一週看起來非常漂亮、第二週驟然崩塌的 FTD 數字 — 而在這期間它已經改變了你的出價。

## 建議項修復方式 {#recommended-resolutions}

### `S2S-O-01` — 沒有 `login` {#s2s-o-01-—-no-login}

**修復：** 在驗證成功時傳送 `login`。加上它成本很低，而報表正是靠它來區分召回與獲客。

### `S2S-O-02` — 沒有 `deposit_initiated` {#s2s-o-02-—-no-deposit-initiated}

**修復：** 在玩家進入收銀台時觸發它，並帶上一個 `context.transaction_id`，在隨後產生的 `deposit` 或 `deposit_failed` 上重複使用。沒有匹配的 ID，兩個事件就無法配對，流失率也就無法使用。

### `S2S-O-03` — 沒有 user agent {#s2s-o-03-—-no-user-agent}

**修復：** 在 `context.user_agent` 中傳入終端用戶的 user-agent 字串。

### `S2S-O-04` — 回填時逐條傳送事件 {#s2s-o-04-—-backfills-sent-one-event-at-a-time}

**修復：** 使用 `/v3/s2s/batch`，請求主體為純 JSON 陣列。每個請求 600 條是硬上限 — 601 條會被拒絕並回傳 `400 BATCH_TOO_LARGE`，而不是被截斷。

批次請求回傳 `{"status":"accepted","requestId":…,"count":…}`。批次回應中沒有單一 `eventId`。

### `S2S-O-05` — 遇到限流不重試 {#s2s-o-05-—-no-retry-on-rate-limit}

**修復：** 把 `429` 視為可重試，使用指數退避加抖動。限流按 API Key 計算，採用滾動的一分鐘窗口。不要重試 `400` 或 `422` — 那些是負載問題，無論重試多少次都會以同樣的方式失敗。

### `S2S-O-06` — 所有環境共用一個金鑰 {#s2s-o-06-—-one-key-for-all-environments}

**修復：** 產生第二個金鑰並讓測試環境使用它，或者讓測試環境永久使用 `?dryrun=1`。注意 dry run 同樣計入限流。

## 本頁無法檢查的兩件事 {#two-things-this-page-cannot-check}

- **你的正式程式碼路徑是否真的會觸發。** 本頁每條規則都可能在你在終端機裡手動建構的負載上全部通過，而真正的充值處理邏輯卻什麼都沒傳送。只有[上線測試](/hk/tracking/s2s/handoff#the-go-live-test)才能證明整合真正接入了你的產品。
- **我們的數字與你的是否一致。** 符合所有規則的數據仍可能與你的 BI 對不上 — 時區邊界、歸因窗口和幣種處理都會讓總數發生變化。請有意識地做對帳，而不要預設差異就是 bug。

## 下一步 {#next-steps}

所有必要規則都通過後，前往[交付與上線](/hk/tracking/s2s/handoff)執行端到端測試，並告訴你的客戶經理你已準備就緒。
