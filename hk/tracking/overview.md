---
title: 追蹤概述
description: 向 RevoSurge 發送轉化的四種方式——Web 追蹤器、S2S、Partner Postback 和 AppsFlyer——以及你的廣告系列目標如何決定你需要哪幾種。
---

# 追蹤概述

**對象：** 廣告主、媒體採購、UA 經理、開發者、聯盟及合作夥伴經理

RevoSurge 依據你發送給我們的轉化來優化你的廣告系列。本頁說明如何完成這項設定：建立產品，確定你要優化的目標，再接入能承載這些數據的方式。

<nav class="article-toc" aria-label="本文內容">
<p class="article-toc-title">本文內容</p>

- [1. 建立你的產品](#_1-create-your-product)
- [2. 選擇你的設定方案](#_2-choose-your-setup)
- [3. 四種方式](#_3-the-four-methods)
- [4. 每種方式能解鎖什麼](#_4-what-each-method-unlocks)
- [5. 常見問題](#_5-faq)
- [6. 開始接入](#_6-getting-started)

</nav>

::: details 從 Meta 或 Google 轉過來？從這裡開始

你已經熟悉的大部分概念都能一一對應。名字變了，模型沒變。

| 你已經熟悉的 | 在 RevoSurge 上 |
| --- | --- |
| Meta Pixel · Google `gtag.js` | **Web 追蹤器**——同樣的思路，一段腳本，六個事件 |
| Conversions API · GA4 Measurement Protocol | **S2S 伺服器事件 (v3)**——你的後端向我們發送 POST 請求 |
| 標準事件（Purchase、CompleteRegistration） | **事件目錄**——24 個事件：9 個標準事件、15 個 iGaming 事件 |
| `fbclid` · `gclid` | `identity.click_id`——在到達時擷取，再回傳給我們 |
| Advanced Matching · Enhanced Conversions | `context.privacy.email_hash` / `phone_hash`——SHA-256，與它們的做法相同 |
| Purchase `value` + `currency` | `context.amount` + `context.currency`——`deposit` 必填 |
| Test Events · Tag Assistant | 在任意端點加 `?dryrun=1`——傳回完整判定結果，不儲存任何數據 |
| `event_id` 去重 | **Partner Postback**：`event_id`，附有文件化的優先級階梯。**S2S**：資金類事件使用 `context.transaction_id` |

**有三點對你來說是新的：**

- **iGaming 事件目錄。** 充值、投注、KYC、獎金、VIP 等級和工作階段都是一等事件，而不是需要你自己定義的自訂轉化。正因如此，才能按玩家價值出價。
- **iGaming 事件按產品啟用。** 與 Meta 標準事件不同，`deposit` 並不是一發送就生效——RevoSurge 需要先為你的產品啟用 iGaming 預設。參見 [7. 事件目錄](/hk/tracking/s2s/overview#_7-the-event-catalog)。
- **Partner Postback 沒有對應物。** 如果你的轉化數據存放在聯盟平台的後台，而不是你自己的後端，你無需編寫任何程式碼即可完成整合。參見 [2.2](#_2-2-which-system-holds-your-conversion-data)。

:::

## 1. 建立你的產品 {#_1-create-your-product}

在它存在之前，其他一切都無法運作。**產品**（Product）就是 RevoSurge 眼中的你的網站或 App。建立產品會登記你的網域，並簽發每種方式都依賴的憑證：Web 追蹤器用的 **Tracker ID**，以及 S2S 用的 **API 金鑰**。

在任一後台中前往 **Product → Manage Product**：

| 後台 | URL |
| --- | --- |
| **AdWave** | [adwave.revosurge.com/product](https://adwave.revosurge.com/product) |
| **DataPulse** | [datapulse.revosurge.com/product](https://datapulse.revosurge.com/product) |

::: info 一個產品，兩個後台通用
AdWave 和 DataPulse 共用同一份產品列表。在其中一個建立後，它會出現在另一個裡——無需建立兩次。右上角的 **Open DataPulse** / **Open AdWave** 按鈕可在兩者之間切換。
:::

頁面頂部的 **Setup Wizard**（設定精靈）會按順序引導你完成整個整合，每一步都要在上一步完成後才能進行。在你的產品建立之前，第 2–4 步會顯示 **Locked · Complete Step 1 first**。

![產品頁面上的設定精靈](/img/tracking/02-setup-wizard-4-steps.png)

### 1.1 填寫表單 {#_1-1-fill-in-the-form}

在設定精靈中或 Manage Product 表格上方點擊 **+ Create Product**。

![建立產品表單](/img/tracking/03-create-product-form.png)

| 欄位 | 必填 | 填寫內容 |
| --- | --- | --- |
| **Product Domain** | 是 | 你的主網域，包含協定——`https://yourbrand.com`。RevoSurge 會把流量歸因到這個網域。 |
| **Product Name** | 是 | 便於識別的名稱。用於報表和產品切換器。 |
| **Landing Page URL** | 否 | 你投放付費流量的任何其他網域或 URL。為每一個選擇 **Funnel Type**。**+** 新增一行，垃圾桶圖示刪除一行。 |
| **Deposit Currency** | 是 | 你的充值結算貨幣——**Fiat**（可搜尋）或 **Crypto**。我們報告的每一筆金額都會換算成該貨幣。 |

然後點擊 **Submit**。精靈進度變為 `1/4`，第 1 步顯示 **Created**。

::: warning 登記你投放的每一個網域
> 所有已登記的網域都需要安裝 Web 追蹤器。廣告系列的 Destination URL 必須與一個處於有效狀態的網域相符，才能投放。

如果廣告系列指向一個未在此登記的網域，**它將無法投放**。現在就把預到達頁、鏡像網域和跳轉網域都加上。
:::

::: tip 選擇你後台實際結算所用的充值貨幣
我們報告的每一筆金額都會換算成該貨幣。如果它與你的實際結算貨幣不一致，你的總額和我們的總額之間就會出現與匯率波動相當的差異。以加密貨幣結算的營運方應選擇加密貨幣，而不是等值的法定貨幣。
:::

### 1.2 選擇正確的 Funnel Type {#_1-2-choose-the-right-funnel-type}

每個 Landing Page URL 都需要一個 Funnel Type，這樣 RevoSurge 才知道這個頁面的用途。

![Funnel Type 下拉選單](/img/tracking/04-funnel-type-dropdown.png)

| Funnel Type | 適用情況 |
| --- | --- |
| **Direct Register** | 訪客直接在該到達頁上註冊。 |
| **Redirect Register** | 該頁面跳轉到註冊頁。請把兩個 URL 登記在同一個產品下。 |
| **Direct Download** | 訪客直接從該頁面下載 App。 |
| **Redirect Download** | 該頁面跳轉到 App 下載頁。請把兩個 URL 登記在同一個產品下。 |
| **AI Companion Home Page** | AI Companion 產品的首頁。 |
| **AI Companion Survey Funnel** | 問卷式的 AI Companion 獲客漏斗。 |

::: info 跳轉類型需要先有 Direct 頁面
在你至少新增一個 **Direct** 到達頁 URL 之前，**Redirect Register** 和 **Redirect Download** 會一直顯示為灰色不可選——後台會提示 *"Add a Direct landing page URL first."*（請先新增一個 Direct 到達頁 URL）。先新增目標頁面，再新增跳轉頁。
:::

### 1.3 你會得到什麼 {#_1-3-what-you-get}

| 識別碼 | 格式 | 用途 |
| --- | --- | --- |
| **Product ID** | `AWP-20260827-052659-007-3119` | 內部參照、支援工單 |
| **Tracker ID** | `TRA-AWP-20260827-052659-007-3119` | 填入 Web 追蹤器程式碼片段 |

Tracker ID 就是 Product ID 加上 `TRA-` 前綴。

## 2. 選擇你的設定方案 {#_2-choose-your-setup}

RevoSurge 支援**四種整合方式**——Web 追蹤器、S2S 伺服器事件、Partner Postback 和 AppsFlyer。你會用到不止一種，但幾乎沒有人四種全用。

**那麼哪種組合適合你？** 我們用三個問題來回答。

| | 問題 | 你的答案決定什麼 |
| --- | --- | --- |
| **2.1** | 你的玩家落在哪裡？ | AppsFlyer 是否需要參與 |
| **2.2** | 哪個系統掌握你的轉化數據？ | Partner Postback **或** S2S——兩者是二選一，而不是疊加 |
| **2.3** | 你的廣告系列優化什麼目標？ | 接入要做多深，以及要發送哪些事件 |

回答完這三個問題，[路由表](#the-routing-table)就會給出你的設定方案。如果你已經知道答案，可以直接跳過去。

### 2.1 你的玩家落在哪裡？ {#_2-1-where-do-your-players-land}

| | |
| --- | --- |
| **網站** | Web 追蹤器負責承載點擊和瀏覽器事件 |
| **流動 App** | 你還需要一個 MMP。RevoSurge 與 **AppsFlyer** 整合 |
| **兩者都有** | 以上兩者都要——它們在同一個產品下並行運作 |

沒有 MMP 的 App 安裝廣告系列無法歸因安裝。應用程式商店橫在點擊和安裝之間，我們所能控制的任何東西都看不到另一側。

### 2.2 哪個系統掌握你的轉化數據？ {#_2-2-which-system-holds-your-conversion-data}

這是多數設定出錯的地方，因為它關乎**誰能發送這個事件**，而不是你更傾向於哪種。

| 充值和註冊記錄在哪裡 | 方式 | 需要你提供什麼 |
| --- | --- | --- |
| **你自己的後端**——由你的平台確認付款 | **S2S** | 一名開發者，約 2–5 天 |
| **聯盟平台的後台**——Income Access、Affilka、MyAffiliates 或你自建的聯盟系統 | **Partner Postback** | 一位能存取該平台 postback 設定的人。無需工程投入。 |
| **你的 MMP**——應用內事件已經在流向 AppsFlyer | **AppsFlyer postback** | 在 AppsFlyer 中完成設定，並在 RevoSurge tile 上授予權限 |

::: warning 每個事件只選一個權威來源
S2S 和 Partner Postback 做的是同一件事。如果兩者上報了同一筆充值，會按優先順序處理——參見 [核心概念 → 去重](/hk/tracking/core-concepts#when-two-methods-report-the-same-conversion)——但你等於花了兩份成本去構建同一樣東西，對帳也會更難，而不是更容易。

只有當兩者確實涵蓋不同事件或不同品牌時，才同時運行。
:::

如果你既有工程資源**又**有聯盟平台，請選擇 S2S。它是唯一能承載金額和 `bet` 的方式，因此也是唯一一種在你的目標加深後仍然夠用的方式。

### 2.3 你的廣告系列優化什麼目標？ {#_2-3-what-do-your-campaigns-optimise-for}

你選的不是追蹤方式，而是**你的廣告系列優化什麼目標**，這決定了設定要做多深。

- **App 安裝**——新安裝量
- **註冊**——新帳戶數量
- **首存**——首次充值的玩家數
- **充值價值**——按玩家充值金額出價
- **玩家價值**——一段時間內的 GGR 和 LTV

選出所有適用的目標。它們是累加的：優化玩家價值並不代表你不再統計註冊。往下找到你**最深**的目標——那一行設定了下限，比它淺的目標都會隨之涵蓋。

### 路由表 {#the-routing-table}

找到與你三個答案相符的那一行。

| 落在 | 最深目標 | 數據位於 | 你的設定方案 | 工作量 |
| --- | --- | --- | --- | --- |
| 網頁 | 註冊 | 瀏覽器 | Web 追蹤器 | 當天 |
| 網頁 | 首存 | 聯盟平台 | Web 追蹤器 **+** Partner Postback | 當天 |
| 網頁 | 首存 | 你自己的後端 | Web 追蹤器 **+** S2S（Basic） | 約 2–3 天 |
| 網頁 | 充值價值 | 你自己的後端 | Web 追蹤器 **+** S2S（Basic，帶金額） | 約 2–3 天 |
| 網頁 | 玩家價值——GGR、LTV | 你自己的後端 | Web 追蹤器 **+** S2S（完整目錄） | 約 3–5 天 |
| App | 安裝 | 你的 MMP | Web 追蹤器（點擊轉發）**+** AppsFlyer | 約 3–5 天 |
| App | 註冊、應用內事件 | 你的 MMP | 上述設定 **+** AppsFlyer 應用內事件 postback | 約 3–5 天 |
| App | 充值價值或玩家價值 | 你自己的後端 | 上述設定 **+** S2S | 在此基礎上再加約 3–5 天 |
| 網頁**和** App | 任意 | 混合 | Web 追蹤器 **+** AppsFlyer **+** S2S 或 Partner Postback 中與你後台相符的那一種 | 以上各行之和 |

::: warning 每種設定方案都必須包含 Web 追蹤器
廣告點擊最初就是由它擷取的。沒有其他任何方式能看到是哪條廣告帶來了訪客——而在 App 側，也是它負責把你的點擊轉發給 AppsFlyer。
:::

## 3. 四種方式 {#_3-the-four-methods}

### 3.1 Web 追蹤器——瀏覽器端 {#_3-1-web-tracker-—-browser-side}

放在你網站上的一段 JavaScript 程式碼片段。它上報瀏覽器中發生的事情——頁面瀏覽、註冊、登入、充值、進入遊戲、下載點擊——並擷取**歸因上下文**：哪條廣告、哪個來源、哪個到達頁。

- **由誰實施：** 你的網頁開發者
- **憑證：** Tracker ID（`TRA-AWP-…`）
- **指南：** [安裝 Web 追蹤器](/hk/tracking/web-tracker/install)

### 3.2 S2S 伺服器事件——後端 {#_3-2-s2s-server-events-—-backend-side}

你的後端把事件 POST 到我們的 API。沒有任何東西在瀏覽器中運行，因此不會因廣告攔截器、防追蹤功能或關閉分頁而遺失數據。

**資金數據應該走這裡。** 支付服務商確認過的充值，是你的伺服器確切掌握的事實；瀏覽器可能根本沒看到它。

- **由誰實施：** 你的後端開發者
- **憑證：** API 金鑰，透過 `X-API-KEY` 請求標頭發送
- **指南：** [伺服器到伺服器 (S2S) 概述](/hk/tracking/s2s/overview)

### 3.3 Partner Postback——由你的平台呼叫我們 {#_3-3-partner-postback-—-your-platform-calls-us}

一個在轉化發生時由你的後台或聯盟平台呼叫的 URL。你把它貼上進去，由對方觸發。**無需工程投入。**

- **由誰實施：** 你本人，或你的聯盟平台管理員
- **憑證：** postback 金鑰，透過 `k` 查詢參數發送
- **指南：** [合作夥伴 Postback API](/hk/tracking/postback/partner-postback)

### 3.4 AppsFlyer——App 安裝與應用內事件 {#_3-4-appsflyer-—-app-installs-and-in-app-events}

如果你推廣的是流動 App，AppsFlyer 會把安裝和應用內事件回報給我們，而 Web 追蹤器會把你的廣告點擊轉發給 AppsFlyer。大部分設定在 **AppsFlyer 自己的控制台**中完成，而不是在 RevoSurge 中。

- **由誰實施：** 你的 UA 經理，在 AppsFlyer 中完成
- **憑證：** 合作夥伴 tile 名稱和 `pid`，由你的客戶經理提供
- **指南：** [AppsFlyer 概述](/hk/mmp/appsflyer/overview)

::: info 向你的客戶經理索取三樣東西
在 AppsFlyer Partner Marketplace 中搜尋用的確切**合作夥伴 tile 名稱**、用於對應你事件的**合作夥伴事件名稱**，以及你的 **`pid`**。沒有第一項就無法開始。
:::

### 橫向比較 {#side-by-side}

| | Web 追蹤器 | S2S | Partner Postback | AppsFlyer |
| --- | --- | --- | --- | --- |
| **運行位置** | 訪客的瀏覽器 | 你的後端 | 合作夥伴的系統 | AppsFlyer 的伺服器 |
| **由誰實施** | 網頁開發者 | 後端開發者 | 你本人，無需工程投入 | UA 經理 |
| **能否看到廣告歸因** | 能，原生支援 | 能，透過 `click_id` | 能，透過 `click_id` | 能，透過轉發的點擊 |
| **會被廣告攔截器攔截** | 有可能 | 否 | 否 | 否 |
| **資金數據是否權威** | 否 | **是** | 是 | 是 |
| **涵蓋範圍** | 網頁 | 網頁 + App | 網頁 + App | **僅 App** |
| **設定工作量** | 當天 | 約 3–5 天 | 當天 | 約 3–5 天 |

::: info 不熟悉這些術語？
**瀏覽器端 / 用戶端**——在訪客瀏覽器中運行的程式碼。能看到廣告點擊和用戶旅程，但可能被攔截。
**伺服器到伺服器（S2S）**——你的伺服器直接與我們的伺服器通訊。無法被攔截，但看不到瀏覽器。
**Postback**——由其他人呼叫、用來通知你某件事已發生的 URL。
**MMP**——流動歸因合作夥伴（mobile measurement partner）。像 AppsFlyer 這樣的第三方，負責歸因 App 安裝並將其上報給廣告平台。
:::

## 4. 每種方式能解鎖什麼 {#_4-what-each-method-unlocks}

隨著你的事件涵蓋範圍擴大，功能會逐步開啟。設定精靈會即時顯示這一點——每一步都列出了它能解鎖的功能。

| 你發送的內容 | 解鎖 |
| --- | --- |
| 透過 Web 追蹤器發送 `page_view` | Source Traffic |
| `register`、`login` | Registration Funnel |
| 透過 S2S 或 Postback 發送 `deposit`、`withdraw` | FTD 報表 |
| 透過 S2S 發送帶金額的 `deposit`、`withdraw`、`bet` | True LTV · ROAS |
| 透過 S2S 發送完整的標準 + iGaming 事件目錄 | Predicted LTV · Churn · Bonus Engine |
| 透過 AppsFlyer 發送安裝和應用內事件 | App 安裝歸因 · App 側漏斗 |
| 在 DataPulse 中接入的廣告來源 | Source Intelligence |

## 5. 常見問題 {#_5-faq}

::: details 四種方式我都需要嗎？
不需要。大多數廣告主使用的是 **Web 追蹤器 + 一種轉化方式**。只有在推廣流動 App 時才需要加上 AppsFlyer。參見[路由表](#the-routing-table)。
:::

::: details 可以先用一種，之後再加嗎？
可以。新增方式不會遺失任何數據——多出來的事件只是開始陸續到達。常見路徑是先用 Web 追蹤器 + Partner Postback 上線，等工程團隊有時間再接入 S2S。
:::

::: details 我沒有工程資源，能怎麼做？
**Partner Postback。** 只需把兩個 URL 貼到你的後台或聯盟平台，當天就能上線。它能涵蓋首存，這已經足夠用來優化。Web 追蹤器程式碼片段本身仍需要開發者安裝，但那只是一個 script 標籤。
:::

::: details 收入數據應該信任哪種方式？
**S2S。** 瀏覽器上報的充值會少算——廣告攔截器、關閉的分頁和支付跳轉都會導致事件遺失。如果你基於瀏覽器上報的收入來優化，就是在基於一個不完整的數字優化。
:::

::: details 各處都必須發送同一個用戶 ID 嗎？
**是的，這也是最常見的整合錯誤。** 無論你的系統用什麼 ID 識別一個帳戶，都要把這個完全相同的值在 Web 追蹤器中作為 `user_id`、在 S2S 中作為 `client_user_id` 發送。如果兩者不同，我們會把它看作兩個不同的人，你的歸因就會出錯。

**不要**使用工作階段 ID、cookie ID 或匿名訪客 ID。
:::

::: details 如果兩種方式上報了同一筆充值，會怎樣？
我們會把兩條都存下來，但只計一次。離資金最近的來源勝出：你的後台知道一筆充值已經結算，而瀏覽器只知道一個按鈕被點擊了。實際上，對於 `deposit` 而言，優先順序是 **S2S > Partner Postback > Web 追蹤器**，且金額只採用 S2S 的數據。
:::

::: details 需要在每個後台各建立一次產品嗎？
不需要。AdWave 和 DataPulse 共用一份產品列表。
:::

::: details 我只推廣 App，還需要 Web 追蹤器嗎？
需要。當你在追蹤器的初始化選項中設定了 AppsFlyer App ID 後，程式碼片段會**把每一次廣告點擊轉發給 AppsFlyer**，這樣安裝才能歸因到我們。沒有安裝程式碼片段的到達頁不會轉發任何點擊，它帶來的每一次安裝都會被計為自然量。
:::

::: details 廣告系列要多久才能優化到位？
點擊會立即開始投放。安裝和註冊優化通常在 1–2 週內趨於穩定；首存優化需要 2–4 週，因為 FTD 比較稀疏；基於價值的優化需要 4–8 週。在第三天就評判一個基於價值的廣告系列，看到的只是雜訊，而不是成效。
:::

::: details 我的廣告系列沒有投放，是追蹤的問題嗎？
有可能。廣告系列的 Destination URL 必須與該產品下一個**已登記且處於有效狀態**的網域相符。請把預到達頁、鏡像網域和跳轉網域作為 Landing Page URL 新增，並為每一個設定 Funnel Type。參見 [1. 建立你的產品](#_1-create-your-product)。
:::

## 6. 開始接入 {#_6-getting-started}

按從上到下的順序進行。每一步都依賴於上一步。

1. **建立你的產品**——網域、到達頁、充值貨幣——[見上文第 1 節](#_1-create-your-product)
2. **複製你的 Tracker ID**——[步驟 1](/hk/tracking/web-tracker/install#step-1-find-your-tracker-id)
3. **安裝 Web 追蹤器**，並觸發 `register`、`login`、`deposit`——
   [步驟 2–4](/hk/tracking/web-tracker/install#step-2-add-the-tracker-script)
4. **確認 Tracker Status 顯示為 Active**——
   [步驟 5](/hk/tracking/web-tracker/install#step-5-verify-in-the-portal)
5. **接入你的轉化方式**——[S2S](/hk/tracking/s2s/overview) 或
   [Partner Postback](/hk/tracking/postback/partner-postback)
6. 如果你推廣 App，**接入 AppsFlyer**——[AppsFlyer 概述](/hk/mmp/appsflyer/overview)
7. **上線你的第一個廣告系列**——[AdWave 廣告系列設定](/hk/adwave/campaign-setup)

從這裡開始：**[安裝 Web 追蹤器](/hk/tracking/web-tracker/install)**。
