---
title: 伺服器到伺服器 (S2S) 概述
description: S2S 分兩檔 — Basic 涵蓋註冊與首存，Full 涵蓋完整目錄。如何選擇檔位、產生 API Key 並上線。
---

# 伺服器到伺服器 (S2S) 概述

**對象：** 選擇檔位的廣告主與 UA 經理（第 1–4 節）、負責實作的開發者（第 5–8 節）

伺服器到伺服器 (S2S) 追蹤直接從**你的後端**向 RevoSurge 發送事件 —
全程不經過瀏覽器。這是讓已確認的轉化與收入完整送達我們的方式。

<nav class="article-toc" aria-label="本文內容">
<p class="article-toc-title">本文內容</p>

- [1. S2S 是甚麼，為何重要](#_1-what-s2s-is-and-why-it-matters)
- [2. 兩個檔位：Basic 與 Full](#_2-two-tiers-basic-and-full)
- [3. 我需要哪個檔位？](#_3-which-tier-do-i-need)
- [4. S2S vs Web 追蹤器](#_4-s2s-vs-web-tracker)
- [5. 後台設定 — 產生 API Key](#_5-portal-setup-generate-your-api-key)
- [6. 在後台中驗證](#_6-verify-in-the-portal)
- [7. 事件目錄](#_7-the-event-catalog)
- [8. API 版本](#_8-api-versions)
- [後續步驟](#next-steps)

</nav>

## 1. S2S 是甚麼，為何重要 {#_1-what-s2s-is-and-why-it-matters}

Web 追蹤器在訪客的瀏覽器中執行。要了解*用戶從哪裡來*，那裡是對的地方；但要了解*用戶花了多少錢*，
那裡就是錯的地方。

瀏覽器事件會遺失。廣告攔截器會過濾掉它們，瀏覽器的防追蹤機制會丟棄它們，
用戶還會在從付款服務商跳轉回來的途中關閉分頁。在典型的 iGaming 網站上，
瀏覽器回報的充值中有相當一部分根本不會送達。

你的後端沒有這種問題。當付款服務商確認一筆充值時，這是你的伺服器確切掌握的
事實。S2S 就是你把這份確定性交給我們的方式。

**以下情況使用 S2S：**

- 充值、提款，以及任何附帶金額的事件
- 由後端而非瀏覽器確認的事件 — KYC、帳戶狀態、獎金
- 任何準確性比便利性更重要的事件

::: info S2S 不能取代 Web 追蹤器
Web 追蹤器知道廣告點擊；你的後端知道錢。RevoSurge 透過你的用戶 ID 將兩者
合併為同一個用戶檔案。大多數廣告主兩者同時使用 — 參閱
[追蹤概述](/hk/tracking/overview)。
:::

## 2. 兩個檔位：Basic 與 Full {#_2-two-tiers-basic-and-full}

S2S 分為兩個檔位。它們**不是兩個產品，也不是兩個端點** — 相同的 URL、
相同的 API Key、相同的信封、相同的驗證。檔位描述的是**你發送了事件目錄中的多少事件**，
進而決定我們能針對甚麼進行優化。

| | **Basic** | **Full** |
| --- | --- | --- |
| **你發送的事件** | 2 個必填、2 個建議 | 完整目錄 — 24 個事件 |
| **必填** | `register` · `deposit` | Basic 的全部事件，加上目錄中的其餘事件 |
| **建議** | `login` · `deposit_initiated` | — |
| **可統計的內容** | 註冊、首存 | 玩家生命週期的每個階段 |
| **可出價優化的目標** | 註冊、首存、充值金額 | Basic 的全部目標，加上玩家價值 — GGR 與 LTV |
| **解鎖功能** | Registration Funnel · FTD 報表 · 基於充值的 ROAS | Basic 的全部功能，加上 **預測 LTV · 流失 · Bonus Engine** |
| **需要金額嗎？** | 需要 — `deposit` 一律要求 `context.amount` 和 `context.currency` | 需要，另外還需你發送的其他每個事件的必填欄位 |
| **典型開發週期** | 約 2–3 天 | 約 3–5 天 |
| **適合** | 希望盡快擺脫瀏覽器回報的收入 | 按玩家價值出價的營運商 |

### Basic 涵蓋的內容 {#what-basic-covers}

四個事件，其中兩個必填：

| 事件 | 狀態 | 原因 |
| --- | --- | --- |
| `register` | **必填** | 在伺服器端統計註冊，不會被攔截 |
| `deposit` | **必填** | 統計充值。必須攜帶 `context.transaction_id`、`context.amount` 和 `context.currency` |
| `login` | 建議 | 區分回訪玩家與新玩家 |
| `deposit_initiated` | 建議 | 已發起但未結算的充值 — 顯示玩家在收銀台的哪一步流失 |

由於 `deposit` 按定義就攜帶 `context.amount` 和 `context.currency`，Basic 給你的是
**充值金額**，而不只是充值次數 — ROAS 隨檔位附帶，而不是額外的一步。

::: info 首存如何統計
S2S 中沒有首存事件，也沒有首存標記。你把每一筆充值都作為
`deposit` 發送，RevoSurge 將 FTD 判定為**我們收到的該用戶最早的一筆 `deposit`**。

因此你無需自行為充值分類 — 但如果你已有現有玩家，請參閱下方的警告。

`/first-deposit` 與 `/repeat-deposit` 的區分屬於
[Partner Postback](/hk/tracking/postback/partner-postback)，那是另一套 API。如果你兩者都在用，
請告知你的客戶經理，以免兩者被統計為各自獨立的首存。
:::

::: warning 如果你已有現有玩家，第一週的 FTD 會虛高
FTD 是**我們看到的**最早一筆充值，而不是實際存在的最早一筆充值。在你
啟用 S2S 的當天，一位現有玩家的下一筆充值是我們為其收到的第一筆 —
因此會被計為首存。

擁有大量現有用戶的營運商會在第一週看到一個 FTD 高峰，但那並非真實的
獲客。有兩種處理方式：

- **先回填。** 在上線前透過 `/v3/s2s/batch` 發送你的歷史充值，
  讓真正的首存已經在紀錄中。
- **或與客戶經理協定一個截止時間點**，在首個報表週期內剔除已知玩家的
  FTD。

請在啟動以 FTD 為優化目標的廣告系列**之前**決定採用哪種方式 — 否則出價會去追逐這個
高峰。
:::

### Full 增加的內容 {#what-full-adds}

目錄中的其餘事件 — 驗證、帳戶狀態、提款、投注以及完整的獎金
生命週期。每個事件名稱參閱 [7. 事件目錄](#_7-the-event-catalog)。

`bet` 是最重要的一個：**它是唯一攜帶玩家價值的事件**，且其他
追蹤方式都無法發送它。沒有 `bet`，預測 LTV 和流失模型就沒有可建模的
資料。

::: info 從 Basic 升級到 Full 沒有任何成本
無需遷移，也沒有開關要切換。你發送更多事件，它們就開始送達。已統計的
事件不受影響。
:::

## 3. 我需要哪個檔位？ {#_3-which-tier-do-i-need}

由你的廣告系列目標決定。

| 優化目標 | 檔位 |
| --- | --- |
| 僅註冊 | 都不需要 — Web 追蹤器即可涵蓋 |
| 首存 | **Basic**（如果你沒有研發資源，也可用 [Partner Postback](/hk/tracking/postback/partner-postback)） |
| 充值金額 | **Basic** — `deposit` 要求攜帶金額，因此已包含在內 |
| 玩家價值 — GGR、LTV | **Full** |

::: tip 從 Basic 開始
兩個事件就能讓你擺脫瀏覽器回報的收入，這是目前能獲得的最大一項準確性提升。
上線後再補齊其餘事件 — 目錄不會消失。
:::

## 4. S2S vs Web 追蹤器 {#_4-s2s-vs-web-tracker}

| | Web 追蹤器 | S2S |
| --- | --- | --- |
| **執行位置** | 訪客的瀏覽器 | 你的後端 |
| **實作方** | Web／前端團隊 | 後端團隊 |
| **原生取得廣告歸因** | 是 | 僅當你傳入 `click_id` 時 |
| **會被廣告攔截器攔截** | 可能 | 否 |
| **收入資料的權威來源** | 否 | 是 |
| **典型事件** | `page_view`、`register`、`login`、`deposit`、`enter_game` | Standard + iGaming 預設集共 24 個事件 |
| **憑證** | 追蹤器 ID（`TRA-AWP-…`） | API Key（`rs-…`） |
| **設定工作量** | 約 45 分鐘 | 約 1–2 天 |

### S2S 解鎖的功能 {#what-s2s-unlocks}

啟用 S2S 是後台設定精靈 (Setup Wizard) 的第 3 步。它會解鎖需要
可靠收入資料的模型：

| 功能 | 作用 | 檔位 |
| --- | --- | --- |
| **Registration Funnel** | 在伺服器端統計註冊 | Basic |
| **FTD 報表** | 首存玩家，在充值實際結算處統計 | Basic |
| **ROAS** | 基於已確認收入的廣告支出回報率 | Basic |
| **LTV** | 按用戶、來源和廣告系列計算的真實生命週期價值 | Full |
| **pLTV** | 預測生命週期價值 — 及早預測玩家價值 | Full |
| **流失（Churn）** | 流失風險評分 | Full |
| **Bonus Engine** | 由真實充值與獎金行為驅動的獎金定向 | Full |

沒有 S2S，這些功能將維持關閉，AdWave 的自動出價也只能基於
不完整的轉化資料進行優化。

## 5. 後台設定 — 產生 API Key {#_5-portal-setup-generate-your-api-key}

### 5.1 前提條件 {#_5-1-prerequisites}

- ✅ 已為你的網域建立**產品** — 參閱
  [追蹤概述 → 建立你的產品](/hk/tracking/overview#_1-create-your-product)
- ✅ 可在後台存取 **Product**（Admin/Master，或具有 Product 權限的角色）
- ✅ 能夠發出對外 HTTPS POST 請求的後端
- ✅ **已為你的產品啟用 iGaming 預設集**（如果你要發送 `deposit` 或任何其他
  iGaming 事件）— 請與你的客戶經理確認（參閱
  [7. 事件目錄](#_7-the-event-catalog)）

### 5.2 開啟 S2S 面板 {#_5-2-open-the-s2s-panel}

登入 **[AdWave](https://adwave.revosurge.com/product)** 或
**[DataPulse](https://datapulse.revosurge.com/product)**，進入 **Product**。有
兩個入口可以進入 S2S 設定 — 顯示的內容相同：

- **Setup Wizard → Step 3 · S2S Postback**，或
- **Manage Product → 點擊你的產品名稱 → S2S** 卡片

產生金鑰之前，面板顯示 **API Key: No API key yet** 和
**S2S Status: Pending**。

![S2S Postback step in the Setup Wizard before an API key exists](/img/tracking/06-wizard-step3-s2s.png)

### 5.3 產生 API Key {#_5-3-generate-the-api-key}

點擊 **Generate API Key**。

金鑰會即時簽發並以遮罩形式顯示 — `rs-i●●●●●●●●` — 旁邊有一個複製按鈕（⧉）。
請立即複製並儲存到你的密鑰管理系統中。

![S2S panel with an active API key and S2S Status Active](/img/tracking/11-dp-s2s-active.png)

你也可以在 **Manage Product** 表格中產生金鑰：沒有金鑰時 **API Key** 欄顯示
`--`，點擊該列的操作按鈕即可產生。簽發後，該欄會
顯示有效金鑰的數量（例如 **1 Active**）。

::: warning 像對待密碼一樣對待 API Key
它用於認證對你帳戶資料的寫入。請在伺服器端將其儲存在密鑰管理系統中。
**切勿**將其放入前端程式碼、流動應用程式安裝檔、標籤管理工具或公開程式碼儲存庫。
產生新金鑰不會自動撤銷舊金鑰 — 請有計劃地進行輪換。
:::

### 5.4 從後端發送事件 {#_5-4-send-events-from-your-backend}

| | |
| --- | --- |
| **Base host** | `https://datapulse-api.revosurge.com` |
| **端點** | `/v3/s2s/event`（單筆） · `/v3/s2s/batch`（批次） |
| **方法** | `POST` |
| **認證標頭** | `X-API-Key: <your key>` |
| **速率限制** | 每個 API Key 每分鐘 60 次請求 |

每個事件至少需要：

| 欄位 | 原因 |
| --- | --- |
| `identity.client_user_id` | 你的穩定帳戶 ID — **必須與**你傳給 Web 追蹤器的 `user_id` **一致** |
| `identity.click_id` | RevoSurge 點擊識別碼。事件要歸因到廣告系列就必須攜帶 — 凡是你擷取到點擊 ID 的用戶，都要發送。自然流量用戶不會有。 |
| `event` | 目錄中的哪個事件 |
| `timestamp` | 事件發生時間，Unix **毫秒**（13 位） |
| `context.ip_address` | 用戶的 IP，用於地理與防欺詐訊號 |

當 API 回傳 `400` 時，最常缺少的就是這五個欄位。

完整的請求／回應結構、欄位類型及各事件的負載：
[伺服器事件 API (v3)](/hk/tracking/s2s/v3/server-events-api)。

::: warning 使用與 Web 追蹤器相同的用戶 ID
S2S 中的 `client_user_id` 必須與 Web 追蹤器中的 `user_id` 完全相同。如果
兩者不同，RevoSurge 會將其視為兩個不同的用戶，歸因隨之失效。這是
最常見的 S2S 整合錯誤。
:::

::: info click_id 從哪裡來？
Web 追蹤器會從到達頁 URL 中保存它，並透過 `getClickid()` 提供。請在註冊時
擷取它，在你的資料庫中與該帳戶關聯儲存，並隨該用戶的每個
S2S 事件一併發送。參閱
[Web 追蹤器 SDK 參考](/hk/tracking/web-tracker/reference)。
:::

## 6. 在後台中驗證 {#_6-verify-in-the-portal}

回到 **Product → Setup Wizard → Step 3 · S2S Postback**。

- 一旦我們收到一個有效且已認證的事件，**S2S Status** 就會從 **Pending** 變為 **Active**。
- **Event Stream** 欄會顯示最近一個事件的名稱、用戶 ID 和時間戳記。
- 每個預設集都會顯示 **Receiving** / **Errors** / **Not yet seen** 的計數，目錄中的每個事件
  都會顯示最近一次收到的時間。
- 步驟徽章會從 **Waiting for first S2S event** 變為 **S2S Postback active · n/23**。

### 如果沒有收到任何事件 {#if-nothing-arrives}

點擊 **Why are S2S events not flowing?** 開啟 **S2S Help Center**。它會針對你過去 24 小時的流量
執行六項檢查。

![S2S Help Center diagnostic panel](/img/tracking/08-s2s-help-center.png)

| 檢查項 | 檢查內容 | 未通過時 |
| --- | --- | --- |
| **X-API-Key Authenticated** | 認證成功（200）與回傳 401 的 `X-API-Key` 請求佔比 | 金鑰錯誤或已被撤銷，或標頭名稱不完全是 `X-API-Key` |
| **Recent POST Activity** | 是否有 POST 請求到達 `/v2/s2s/event` 或 `/v2/s2s/batch` | 你的後端沒有呼叫該端點 — 檢查對外防火牆規則和 URL |
| **Schema Errors (400)** | 因結構錯誤被拒絕的請求佔比 — 並列出最常缺少的欄位 | 補上缺少的欄位。最常見的是 `client_user_id`、`click_id`、`event_name`、`timestamp` 或 `ip_address` |
| **Rate Limit Hits (429)** | 429 的佔比 — 上限為每個 API Key 60 RPM | 透過 `/v2/s2s/batch` 批次發送事件，並加入帶退避的重試 |
| **Server Errors (5xx)** | 以 5xx 失敗的請求佔比 | 我方的暫時性問題 — 使用指數退避重試。持續出現 5xx：請聯絡支援團隊 |
| **Event Status Not Active** | 該產品在 AdWave 中的事件狀態是否為啟用 | 這是警告而非阻斷 — 事件正在送達，但該產品尚未被標記為可用於廣告系列 |

## 7. 事件目錄 {#_7-the-event-catalog}

兩個預設集共 24 個事件。每個事件在後台中顯示為 *Receiving*、*Errors* 或
*Not yet seen*。

::: warning 必須為你的產品啟用 iGaming 預設集
**Standard**（9 個事件）對每個產品自動啟用。**iGaming**（15 個事件）由 RevoSurge 應要求
按產品啟用。

`deposit` 是 iGaming 事件。在該預設集啟用之前，你發送的每一筆充值都會被拒絕並回傳
`422 EVENT_DISABLED`，無論你的整合多麼正確 — 而且這不是
你能在程式碼裡修正的問題。

**開始開發之前，請先讓你的客戶經理確認 iGaming 已啟用。**
:::

**⭑ 標記的是四個 [Basic](#_2-two-tiers-basic-and-full) 事件。** 其餘均屬於 Full。

### Standard 預設集（9 個事件） {#standard-preset-9-events}

| 分組 | 事件 |
| --- | --- |
| 用戶生命週期 | **⭑ `register`** · ⭑ `login` |
| 驗證與授權 | `email_verified`, `phone_verified`, `marketing_consent_updated` |
| 應用生命週期 | `app_install`, `app_open`, `app_uninstall`, `push_permission_updated` |

### iGaming 預設集（15 個事件） {#igaming-preset-15-events}

| 分組 | 事件 |
| --- | --- |
| 用戶生命週期 | `session_ended`, `vip_tier_changed` |
| 驗證與授權 | `kyc_completed`, `kyc_rejected`, `account_blocked`, `account_unblocked` |
| 資金 | ⭑ `deposit_initiated` · **⭑ `deposit`** · `deposit_failed`, `withdraw` |
| 遊戲 | `bet` |
| 獎金生命週期 | `bonus_offered`, `bonus_claimed`, `bonus_completed`, `bonus_cashed_out` |

::: warning 後台事件網格顯示的數量比目錄接受的少一個
設定精靈目前列出 14 個 iGaming 事件，並顯示 `n/23`。`deposit_initiated`
已被 API 接受且有完整規格 — 只是尚未繪製在該網格中。照常發送即可，
它會被儲存。其欄位參閱 [iGaming 事件](/hk/tracking/s2s/v3/events-igaming)。
:::

**關於 `deposit_initiated`** — 玩家已發起但尚未結算的充值。它能告訴
你玩家在收銀台的哪一步流失。`context.transaction_id` 為**必填**，且必須
與後續 `deposit` 或 `deposit_failed` 上的 `transaction_id` 一致，這樣才能將這次嘗試與其
結果關聯起來。

::: tip 加入事件的順序
從四個 Basic 事件開始。然後是 `withdraw` 和 `bet` — 這兩個事件讓你從 ROAS 走向
真實的玩家價值。驗證類和獎金類事件放在最後；它們能讓預測 LTV、流失模型和
Bonus Engine 更精準，但起步階段沒有任何功能依賴它們。
:::

每個事件的欄位層級定義：
[標準事件](/hk/tracking/s2s/v3/events-standard) · [iGaming 事件](/hk/tracking/s2s/v3/events-igaming)

## 8. API 版本 {#_8-api-versions}

| 版本 | 狀態 | 時間戳記格式 |
| --- | --- | --- |
| **v3** | 目前版本 — 所有整合均使用此版本 | Unix **毫秒** |
| **v2** | 將於 2026 年 10 月 18 日棄用 | Unix **秒** |

新整合請從 **v3** 開始。如果你正在使用 v2，請參閱
[從 v2 遷移](/hk/tracking/s2s/v3/migration)。

::: tip 確認你已上線
S2S 卡片中的 **Event Stream** 欄和各事件的 *last seen* 時間戳記讀取的是
我們實際儲存的事件。無論使用哪個版本，它們都是確認你的整合
正常運作的權威依據。
:::

## 後續步驟 {#next-steps}

- [伺服器事件 API (v3)](/hk/tracking/s2s/v3/server-events-api) — 端點、結構、範例
- [信封與基礎屬性](/hk/tracking/s2s/v3/mandatory-properties) — 每個事件都帶有的欄位
- [目錄與驗證](/hk/tracking/s2s/v3/catalog-governance) — 事件如何被驗證
- [標準事件](/hk/tracking/s2s/v3/events-standard) · [iGaming 事件](/hk/tracking/s2s/v3/events-igaming)
- [從 v2 遷移](/hk/tracking/s2s/v3/migration)

## 相關內容 {#related}

- [追蹤概述](/hk/tracking/overview) — 四種追蹤方式比較
- [安裝 Web 追蹤器](/hk/tracking/web-tracker/install) — 瀏覽器端的另一半
- [合作夥伴 Postback API](/hk/tracking/postback/partner-postback) — 來自聯盟與 MMP 的轉化
