---
title: 核心概念
description: 決定你的轉化能否被計入、能否歸到正確的廣告系列、且只計一次的五條規則 —— 身份、點擊關聯、歸因窗口、去重與首存。
---

# 核心概念

**對象：** 所有人。投放人員請閱讀第 1、3、5 節；開發人員請通讀全部五節。

無論你用四種方式中的哪一種，你發來的事件最終如何處理，都由同樣的五條規則決定。把這些做對，選哪種方式只是實作細節。做錯了，每個請求照樣成功，數字卻一直悄無聲息地出錯 —— 這是追蹤中代價最高的失敗方式，因為沒有任何東西會提醒你。

<nav class="article-toc" aria-label="本文內容">
<p class="article-toc-title">本文內容</p>

- [1. 一個用戶，一個 ID](#_1-one-user-one-id)
- [2. 轉化如何關聯回廣告](#_2-how-a-conversion-joins-back-to-an-ad)
- [3. 歸因窗口](#_3-the-attribution-window)
- [4. 去重](#_4-deduplication)
- [5. 首存](#_5-first-deposits)
- [契約彙總](#the-contract-in-one-place)

</nav>

## 1. 一個用戶，一個 ID {#_1-one-user-one-id}

**同一個人在你使用的每種方式中都必須帶有相同的識別碼。**

| 方式 | 欄位 | 由誰設定 |
| --- | --- | --- |
| Web 追蹤器 | `user_id` | 你，在登入或註冊時 |
| S2S | `identity.client_user_id` | 你，在每個事件上 |
| AppsFlyer | Customer User ID | 你，在 SDK 中 |
| Partner Postback | `user_id` | 你的聯盟平台 |

同一個字串。同樣的大小寫。不能一處加前綴而其他處不加。在我們看來，`player_88213` 和 `88213` 是兩個不同的人。

### 為甚麼這是本頁代價最高的規則 {#why-this-is-the-most-expensive-rule-on-the-page}

ID 不一致時，甚麼都不會失敗。每個請求都返回成功，每個事件都會被存下，只是報表是錯的：

- 瀏覽器知道發生了一次點擊，你的後台知道發生了一筆充值，但兩者之間沒有任何關聯，於是這筆充值不會被計入帶來它的廣告系列。
- 同一個玩家以兩個檔案存在，一次註冊可能被計兩次。
- 玩家價值模型在割裂的歷史上訓練，恰恰在你購買它的那項工作上表現更差。

::: warning 事後修正無法修復過去
修正 ID 只能讓新事件不再分裂。它不會合併已經分開建立的檔案，也不會對入庫時未能關聯的充值重新歸因。請在上線前檢查，而不是等數字看起來不對時再查。
:::

### 用戶尚未註冊帳戶時 {#before-the-user-has-an-account}

改為發送 `identity.anonymous_id` —— 一個由你產生的穩定假名 ID，通常是第一方 cookie 或裝置 ID。identity 中至少要帶有 `client_user_id` 或 `anonymous_id` 之一。

玩家註冊後，開始發送 `client_user_id`。如果你有 `anonymous_id`，繼續同時發送。

## 2. 轉化如何關聯回廣告 {#_2-how-a-conversion-joins-back-to-an-ad}

只有我們能判斷出是哪條廣告帶來的轉化，這個轉化才有用。這種關聯只有一個強關聯鍵。

### `click_id` 是強關聯鍵 {#click-id-is-the-strong-key}

訪客從 RevoSurge 廣告進入時，落地 URL 中會帶有一個點擊識別碼。如果你用過 `fbclid` 或 `gclid`，原理相同。

**你需要這樣處理它：**

1. 從落地 URL 中讀取它
2. 把它與訪客的工作階段關聯儲存，訪客註冊後再與其帳戶關聯儲存
3. 在第一個能識別用戶的事件（通常是 `register`）上，以 `identity.click_id` 回傳

Web 追蹤器會替你擷取點擊。**S2S 不會** —— 你的後台只知道你傳給它的內容，所以點擊 ID 必須一路從到達頁經過資料庫，完整傳到事件中。大多數整合正是在這段交接中把它弄丟的。

::: info `click_id` 不能取代用戶 ID
它把轉化錨定到廣告，`client_user_id` 把轉化錨定到人。兩者都需要 —— 只發送 `click_id` 並不滿足身份要求。
:::

### 沒有 `click_id` 時 {#when-there-is-no-click-id}

**沒有回退方案。**

`click_id` 是 RevoSurge 支援的唯一確定性歸因關聯鍵。雜湊電郵、雜湊電話號碼以及 IP + user-agent 匹配都**不**用於歸因，`click_id` 之後也沒有任何回退鏈。

沒有 `click_id` 的轉化仍會被記錄 —— 只是可能不會被計入任何廣告系列。

::: danger 這是歸因遺失的頭號原因
如果你把 `click_id` 當作可選項，就等於選擇讓你的轉化不被歸因。它是一條必要規則（`S2S-R-16`），而不是建議規則。

脆弱的環節不是 API 呼叫，而是交接：到達頁 → 工作階段 → 資料庫 → 事件。上線前，請用一次真實點擊專門測試這條路徑。
:::

### 不需要每個事件都帶 `click_id` {#you-do-not-need-click-id-on-every-event}

點擊把**用戶**綁定到廣告系列。在第一個能識別用戶的事件上發送一次 `click_id`，之後同一個 `client_user_id` 的所有事件都會繼承這個綁定。

| 事件 | 是否帶 `click_id` | 是否歸因？ |
| --- | --- | --- |
| `register` | 是 | 是 —— 正是它把用戶綁定到廣告系列 |
| `login` | 否 | 是，透過同一個 `client_user_id` |
| `deposit` | 否 | 是，透過同一個 `client_user_id` |

正因如此，第 1 節是整套規則的基石，而不只是錦上添花。**綁定隨用戶識別碼傳遞。** 如果你的 `deposit` 帶的 `client_user_id` 與已歸因的 `register` 不同，在我們看來它屬於另一個人，甚麼也繼承不到。

所以這兩條規則的影響會疊加：`click_id` 出錯損失一個轉化；`client_user_id` 出錯損失該用戶今後的所有轉化。

::: warning 綁定不會超出窗口
綁定與歸因窗口是兩個獨立的限制，二者同時生效。已綁定用戶的充值如果在廣告互動 14 天之後才到達，仍會被記錄，但不會被歸因 —— 參閱 [3. 歸因窗口](#_3-the-attribution-window)。

對 iGaming 而言，值得用你自己的數據核對這一點。如果首存通常在點擊兩週之後才發生，已綁定也救不了它們。
:::

## 3. 歸因窗口 {#_3-the-attribution-window}

**轉化在廣告互動後 14 天內到達，才會被歸因到 RevoSurge 廣告系列。** 點擊和曝光都會開啟窗口。

註冊與首存的窗口相同，都是 14 天。

### 用戶既點擊過又看過廣告時 {#when-a-user-both-clicked-and-saw-an-ad}

**計入點擊。** 只有在窗口內的路徑中沒有點擊時，才會計入曝光。

因此，用戶第 1 天點擊、第 10 天看到一次曝光、第 12 天充值，這筆充值計入第 1 天的點擊。

### 遲到的轉化 {#conversions-that-arrive-late}

**它們仍會被記錄，只是不會歸因到廣告系列。** 它們保留在你的事件數據和你自己的報表中，但不會計入任何廣告系列。

這帶來一個實際影響，而且與大家通常以為的恰恰相反：

::: tip 遲到的事件照樣發送 —— 不要按時間過濾
一筆因為「看起來太舊、無關緊要」而被你扣下的充值，是永久遺失的數據。你發出的充值無論如何都會被記錄，並且仍會參與首存判定（第 5 節）、玩家價值以及你自己的對帳。

時間長短唯一影響的，是廣告系列能否獲得歸因。
:::

## 4. 去重 {#_4-deduplication}

不同方式對重複發送的處理方式不同。在建構重試邏輯之前，先弄清楚你依賴的是哪一種。

| 方式 | 去重鍵 | 同一事件重發時 |
| --- | --- | --- |
| Partner Postback | `event_id`，其次 `txid`，再次查詢字串的雜湊 | 合併到原事件 |
| S2S —— 資金類事件 | `context.transaction_id` | 合併到原事件 |
| S2S —— 其他事件 | 無 | **產生第二個事件** |
| Web 追蹤器 | 無 | 產生第二個事件 |

### 實際意味著甚麼 {#what-this-means-in-practice}

- **使用 Partner Postback 時**，請發送全域唯一且穩定的 `event_id`，並在每次重試時原樣重複。查詢字串雜湊只是最後的回退手段，不是安全網 —— 參數順序一變，同一個轉化就會被計兩次。
- **使用 S2S 時**，`deposit`、`withdraw` 和 `bet` 可以安全重試，因為 `context.transaction_id` 能識別它們。其他事件**不具備冪等性** —— 只在請求確實失敗時才重試，絕不要預防性地重試。

### 兩種方式上報同一個轉化時 {#when-two-methods-report-the-same-conversion}

按優先順序處理：**S2S → Partner Postback → Web 追蹤器**，金額只取自 S2S。

但優先順序是安全網，不是設計。用兩種方式上報同一事件，意味著同樣的東西要建兩遍，並且永遠要對帳兩個來源。請為每個事件選定一個系統作為唯一可信來源 —— 參閱[選擇你的方案](/hk/tracking/overview#_2-2-which-system-holds-your-conversion-data)。

## 5. 首存 {#_5-first-deposits}

**S2S 中沒有首存事件，也沒有首存標記。** 每筆充值都以 `deposit` 發送，首存由此推導為**我們為該用戶收到的最早一筆 `deposit`**。

Partner Postback 是例外：它有獨立的 `/first-deposit` 和 `/repeat-deposit` 端點，你向哪個路徑發送就決定了分類。

`deposit_initiated` 永遠不是首存。它記錄的是一次進入收銀台的嘗試，而不是一筆已結算的付款。

### 如果你已有存量玩家，上線前請閱讀 {#if-you-already-have-players-read-this-before-you-launch}

首存是**我們見到的**最早一筆 —— 而不是實際存在的最早一筆。

在你開啟追蹤的那天，存量玩家的下一筆充值是我們為其收到的第一筆，因此會被計為首存。擁有大量存量用戶的營運方會在第一週看到一波首存激增，但這並不是真實的獲客 —— 如果某個廣告系列以首存為優化目標，出價就會去追逐它。

**先回填。** 上線前，透過 `/v3/s2s/batch` 發送你的歷史充值。超出歸因窗口的數據會被記錄但不會被歸因（第 3 節），因此它能確立真實的首存，又不會把功勞記給並未帶來這些充值的廣告系列。

如果無法回填，請與你的客戶經理商定一個截止日期，並在第一個報告週期內剔除已知玩家的首存。

## 契約彙總 {#the-contract-in-one-place}

以上內容彙總為一份清單：

- [ ] 同一個人在每種方式中都帶有相同的識別碼
- [ ] 每個事件都有已註冊的 `event` 名稱和有效的毫秒級 `timestamp`
- [ ] 每個事件都帶有 `client_user_id`，註冊前則帶 `anonymous_id`
- [ ] 在落地時擷取 `click_id`，並在 `register` 和第一筆 `deposit` 上回傳
- [ ] 資金類事件帶有 `context.transaction_id`，重試時合併而不是重複
- [ ] Partner Postback 事件帶有穩定的 `event_id`，重試時原樣重複
- [ ] 事件在發生時即發送 —— 包括遲到的事件
- [ ] 如果產品已有存量玩家，上線前已回填歷史充值
- [ ] 每個事件只有一個系統作為唯一可信來源

## 下一步 {#next-steps}

- [追蹤概述](/hk/tracking/overview) —— 四種方式，以及你需要哪種組合
- [S2S 整合驗證](/hk/tracking/s2s/validation) · [Partner Postback 整合驗證](/hk/tracking/postback/validation) ——
  上線前檢查的規則
- [標準事件](/hk/tracking/s2s/v3/events-standard) · [iGaming 事件](/hk/tracking/s2s/v3/events-igaming) ——
  事件目錄
