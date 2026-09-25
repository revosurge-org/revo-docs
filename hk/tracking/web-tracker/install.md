---
title: 安裝 Web 追蹤器
description: 分步操作——找到你的追蹤器 ID、安裝 Web 追蹤器腳本、發送事件，並按到達頁逐一驗證。
---

# 安裝 Web 追蹤器

**對象：** 廣告主與 UA 經理（步驟 1、5–6），開發者與追蹤工程師（步驟 2–4）

Web 追蹤器是一個輕量級 JavaScript SDK，將事件從你的網站即時傳輸到
RevoSurge。事件開始流入後，**Registration Funnel** 與 **Source Traffic** 報表就會出現數據，
這些事件也能作為 AdWave 廣告系列的優化目標。

收入類模型——LTV、ROAS、預測 LTV、流失以及 Bonus Engine——還需要接入
[S2S](/hk/tracking/s2s/overview)。Web 追蹤器是 4 步中的第 2 步。

**完成時間：** 約 30 分鐘。

<nav class="article-toc" aria-label="本文內容">
<p class="article-toc-title">本文內容</p>

- [開始前](#before-you-start)
- [步驟 1 — 找到你的追蹤器 ID](#step-1-find-your-tracker-id)
- [步驟 2 — 添加追蹤器腳本](#step-2-add-the-tracker-script)
- [步驟 3 — 初始化追蹤器](#step-3-initialise-the-tracker)
- [步驟 4 — 發送關鍵事件](#step-4-send-key-events)
- [步驟 5 — 在後台驗證](#step-5-verify-in-the-portal)
- [步驟 6 — 正式上線](#step-6-go-live)
- [疑難排查](#troubleshooting)

</nav>

## 開始前 {#before-you-start}

你需要：

- **已為你的網域建立好產品**。如果還沒有，請先閱讀
  [追蹤概述 → 建立你的產品](/hk/tracking/overview#_1-create-your-product)——只需幾分鐘，
  完成後會分配本指南開頭要用到的追蹤器 ID。
- 你的網站網域，以及編輯其 `<head>` 的權限——直接修改程式碼，或透過 Google Tag Manager
  等標籤管理器。
- 你的**穩定用戶 ID**——你的系統用來識別帳戶的主鍵。每次追蹤呼叫都要傳入它。
  參見[如何選擇用戶 ID](#choosing-a-user-id)。

::: info 我該登入哪個後台？
兩個都可以。**AdWave**（[adwave.revosurge.com](https://adwave.revosurge.com)）與 **DataPulse**
（[datapulse.revosurge.com](https://datapulse.revosurge.com)）共用同一份產品列表——
在其中一個建立產品，另一個裡也會出現。使用右上角的 **Open DataPulse** /
**Open AdWave** 按鈕切換。
:::

## 步驟 1 — 找到你的追蹤器 ID {#step-1-find-your-tracker-id}

你的產品的**追蹤器 ID**（Tracker ID）會填進步驟 3 的程式碼片段。它形如
`TRA-AWP-20260827-052659-007-3119`——即帶 `TRA-` 前綴的產品 ID。

有兩個地方可以複製它，兩處的值旁邊都有複製按鈕（⧉）。

### 方式 A — Setup Wizard（最快） {#option-a-—-setup-wizard-fastest}

**Product → Setup Wizard → Step 2 · Setup Web Tracker**

![Setup Wizard step 2 showing the Tracker ID and Tracker Status](/img/tracking/13-dp-webtracker-trackerid.png)

### 方式 B — 產品詳情 {#option-b-—-product-detail}

**Product → Manage Product → 點擊你的產品名稱。** 會開啟一個面板，追蹤器 ID
位於 **Web Tracker** 卡片中。

![Product detail panel with the Web Tracker card and Tracker ID](/img/tracking/05-product-drawer-tracker-id.png)

該面板還會顯示產品 ID、網域名稱、裝置類型、支援的充值幣種，
以及每個已登記的到達頁及其漏斗類型（Funnel Type）。

::: warning 後台不提供可直接複製貼上的程式碼片段
後台**只提供追蹤器 ID**——你需要按下面的步驟 3 和步驟 4 自行組合程式碼片段。
Setup Wizard 中的 **View Integration Guide** 按鈕連結回的就是本頁。
:::

## 步驟 2 — 添加追蹤器腳本 {#step-2-add-the-tracker-script}

將以下程式碼添加到你要追蹤的**每個頁面**的 `<head>` 中，並盡量靠前，
使其在任何用戶動作發生之前載入完成。

```html
<script src="https://assets.revosurge.com/js/web-tracker.js"></script>
```

::: details 使用 Google Tag Manager？
新建一個包含上述程式碼片段的 **Custom HTML** 標籤，將觸發條件設為 **All Pages**，
並把 **Tag firing priority** 設為較大的數值，使追蹤器在任何事件標籤運行之前就緒。
:::

::: details 使用單頁應用（React、Vue、Next.js）？
在根文件或根版面中載入一次腳本即可——不要按路由重複載入。只初始化一次
追蹤器（步驟 3），並在路由切換時重用同一個實例。
:::

## 步驟 3 — 初始化追蹤器 {#step-3-initialise-the-tracker}

在腳本載入完成後初始化一次。把追蹤器 ID 替換為你在步驟 1
複製的那個。

```js
const tracker = new WebTracker({
  trackerId: "TRA-AWP-20260827-052659-007-3119",

  // 可選——僅在使用 AppsFlyer 作為 MMP 時配置。
  // 填 AppsFlyer 後台的 App ID，不是套件名稱 / Bundle ID。
  androidAppsFlyerId: "your-android-app-id-in-appsflyer",
  iOSAppsFlyerId: "your-ios-app-id-in-appsflyer"
});
```

| 參數 | 類型 | 是否必填 | 說明 |
| --- | --- | --- | --- |
| `trackerId` | string | 是 | 你的產品的追蹤器 ID。 |
| `androidAppsFlyerId` | string | 否 | Android 應用的 **AppsFlyer App ID**（不是套件名稱），在 AppsFlyer 後台該應用的設定中查看。 |
| `iOSAppsFlyerId` | string | 否 | iOS 應用的 **AppsFlyer App ID**（不是 Bundle ID），在 AppsFlyer 後台該應用的設定中查看。 |

你發送的所有數據都按線上生產流量計算——不存在需要切換出來的獨立測試
環境。請先在[步驟 5](#step-5-verify-in-the-portal) 驗證事件，
再把廣告預算投向它們。

::: info 使用 AppsFlyer 作為 MMP？
`androidAppsFlyerId` 與 `iOSAppsFlyerId` 僅在你已接入 AppsFlyer 作為 MMP 時才需要配置，
用於歸因 Web 到 App 的用戶路徑。兩者互相獨立——有哪個平台就配哪個，
另一個可以省略。若未使用 AppsFlyer，兩個都不要傳。
:::

::: warning 準確複製追蹤器 ID
追蹤器 ID 填錯時不會有任何提示——腳本照常載入、不出現錯誤，但也收不到任何事件。
後台的 [Web Tracker Help Center](#_5-3-run-the-diagnostics-if-nothing-arrives) 專門為此提供了
**Tracker ID Match** 檢查項。
:::

## 步驟 4 — 發送關鍵事件 {#step-4-send-key-events}

在對應的用戶動作發生時呼叫相應的追蹤方法。將你的**穩定用戶 ID**
作為第一個參數傳入——唯一的例外是 `trackCustomEvent`，它的第一個參數是事件類型，
且不傳用戶 ID。

```js
// 建立新帳戶
tracker.trackRegister("user_123", {
  identifier: "sha256_hash_of_email_or_phone"
});

// 舊用戶登入
tracker.trackLogin("user_123");

// 充值完成
tracker.trackDeposit("user_123", {
  currency: "USDT",
  network: "TRON",
  amount: 100
});

// 用戶進入遊戲
tracker.trackEnterGame("user_123", {
  currency: "USDT",
  game_provider: "Evolution",
  game_id: "lightning-roulette",
  game_name: "Lightning Roulette"
});

// 點擊 App 下載按鈕
tracker.trackDownloadClick("user_123", { store_type: "android" });

// 其他與你業務相關的事件
tracker.trackCustomEvent("mission_complete", { mission_id: "daily_7" });
```

SDK 提供的方法不止這些，但後台的 **Event Stream** 針對每個已登記網域只監控六個
事件——請優先接入這六個：

| 事件 | 觸發時機 |
| --- | --- |
| `page_view` | 自動——被追蹤的頁面載入時 |
| `register` | 建立新帳戶時 |
| `login` | 現有用戶登入時 |
| `deposit` | 在瀏覽器中完成充值時 |
| `enter_game` | 用戶開啟遊戲時 |
| `download_click` | 點擊 App 下載按鈕時 |

完整的方法列表與全部欄位：[Web 追蹤器 SDK 參考](/hk/tracking/web-tracker/reference)。

### 如何選擇用戶 ID {#choosing-a-user-id}

使用你自己系統中識別該帳戶的同一個 ID——即用戶表的主鍵。
**不要**使用工作階段 ID、Cookie ID 或匿名訪客 ID。

同一個值必須在你的 [S2S 事件](/hk/tracking/s2s/overview)中作為 `client_user_id` 使用。
兩者不一致時，RevoSurge 會把網頁活動和伺服器活動當作兩個不同的人，
歸因隨之失效。

::: warning 切勿發送原始 PII
`identifier` 請傳入用戶電郵或電話的 **SHA-256 雜湊**，並在呼叫前於你方完成雜湊。
不要發送原始電郵、電話號碼或姓名。
:::

## 步驟 5 — 在後台驗證 {#step-5-verify-in-the-portal}

部署後，在瀏覽器中開啟一個被追蹤的頁面。

### 5.1 查看 Event Stream {#_5-1-watch-the-event-stream}

前往 **Product → Setup Wizard → Step 2 · Setup Web Tracker**，或開啟產品並
查看 **Web Tracker** 卡片。

每個已登記的網域對應一個區塊——你的產品網域加上每個到達頁。
每個區塊列出六個事件，各帶一個狀態圓點和「最後出現」時間戳，並匯總
**Receiving** / **Errors** / **Not yet seen** 的數量。每個網域還有一個開關——
關閉的網域不會收集任何數據。

::: info 以六個事件為準，而不是徽章
Setup Wizard 徽章顯示的是 **Web Tracker active · n/8**，但後台針對每個已登記網域展示的是**六個**
事件——即上表中的六個。六才是你需要接入和核對的數量。
徽章的分母統計的是別的東西，並不是目標。
:::

![Web Tracker event stream showing events received per domain](/img/tracking/12-dp-webtracker-eventstream.png)

事件通常在一分鐘內出現。`page_view` 應當幾乎立刻變綠。

### 5.2 檢查 Tracker Status {#_5-2-check-tracker-status}

**Tracker Status** 顯示在 Web Tracker 卡片的右上角。

| 狀態 | 含義 |
| --- | --- |
| **Active** | 事件正在流入 |
| **Inactive** | 近期未收到數據 |

### 5.3 若沒有數據，執行診斷 {#_5-3-run-the-diagnostics-if-nothing-arrives}

點擊 **Why is there no Web Tracker data?** 開啟 **Web Tracker Help Center**。它會
針對你的線上流量執行五項檢查，並告訴你哪一項未通過。

![Web Tracker Help Center diagnostic panel](/img/tracking/07-web-tracker-help-center.png)

| 檢查項 | 驗證內容 | 未通過時 |
| --- | --- | --- |
| **Script Loaded** | 過去 7 天內有任何頁面載入了 `web-tracker.js`（來自 `assets.revosurge.com`） | `<script>` 標籤缺失、被攔截或放錯了頁面——重新檢查步驟 2 |
| **Tracker Initialized** | 過去 7 天內 WebTracker SDK 已使用追蹤器 ID 完成初始化 | `new WebTracker({...})` 沒有運行，或在腳本載入前就運行了——重新檢查步驟 3 |
| **Tracker ID Match** | 傳給 `new WebTracker({...})` 的 `trackerId` 與該產品的 `tracker_id` 一致 | 你貼上了錯誤的 ID，或另一個產品的 ID——重新檢查步驟 1 |
| **Recent Events Activity** | 過去 24 小時內收到過任意 `trackXxx` 事件（Register / Login / Deposit / EnterGame / DownloadClick / CustomEvent） | 腳本正常，但你的事件呼叫沒有觸發——重新檢查步驟 4 |
| **Event Status Not Active** | 該產品的 AdWave 事件狀態是否為 active | 這是警告，不會阻擋上線。事件正在流入，但該產品尚未被標記為可用於廣告系列——完成 Setup Wizard 的剩餘步驟 |

## 步驟 6 — 正式上線 {#step-6-go-live}

當關鍵事件已在流入、且 Tracker Status 顯示為 **Active** 時：

- ✅ 接入 [S2S](/hk/tracking/s2s/overview) 或 [Partner Postback](/hk/tracking/postback/partner-postback)，讓充值在伺服器端計算
- ✅ 如果你推廣流動 App，接入 [AppsFlyer](/hk/mmp/appsflyer/overview)
- ✅ 上線你的第一個 [AdWave 廣告系列](/hk/adwave/campaign-setup)

::: warning 不要止步於 Web 追蹤器
瀏覽器上報的充值會少計——廣告攔截器、關閉的分頁和支付跳轉都會
遺失事件。LTV、ROAS、預測 LTV、流失與 Bonus Engine 都需要
[S2S](/hk/tracking/s2s/overview)。Web 追蹤器是 4 步中的第 2 步，而不是終點。
:::

## 疑難排查 {#troubleshooting}

::: details 完全看不到事件
1. 開啟瀏覽器的 **Network** 面板並重新整理一個被追蹤的頁面，查找 `web-tracker.js`
   ——如果沒有，說明腳本標籤缺失或被攔截。
2. 開啟 **Console** 並輸入 `WebTracker`。如果是 undefined，說明腳本尚未載入。
3. 確認 `new WebTracker({...})` 在腳本載入**之後**運行。
4. 逐字元核對追蹤器 ID 與 **Product → Manage Product →
   [你的產品] → Web Tracker** 中的是否一致。
5. 執行 [Web Tracker Help Center](#_5-3-run-the-diagnostics-if-nothing-arrives)——它會
   告訴你是哪個環節出了問題。
:::

::: details page_view 能收到，但 register / deposit 收不到
腳本和追蹤器 ID 都沒問題——是你的事件呼叫沒有觸發。在每個
`tracker.trackXxx(...)` 呼叫旁加一行 `console.log`，確認它確實執行了。常見原因是
在頁面跳轉已經開始後才呼叫追蹤器。
:::

::: details 網域在後台中可見，但開關是關閉的
Web Tracker 卡片中每個已登記網域都有一個開關。關閉的網域
不會收集數據，把它開啟即可。
:::

::: details 廣告系列無法投放——「Destination URL must match an active domain」
你的廣告系列指向的 URL 沒有登記在該產品上。請將其添加為 **Landing
Page URL** 並選擇正確的漏斗類型（[追蹤概述](/hk/tracking/overview#_1-create-your-product)），
在該頁面上安裝 Web 追蹤器，並等待它顯示為 active。
:::

::: details 能否從伺服器而非瀏覽器進行追蹤？
可以——而且對於收入數據，你應當這樣做。參見
[伺服器對伺服器（S2S）概述](/hk/tracking/s2s/overview)。大多數廣告主兩者並用。
:::

::: details 我推廣的是流動 App——Web 追蹤器還重要嗎？
重要，而且比你想像的更重要。在步驟 3 中設定 AppsFlyer App ID 後，程式碼片段會
**把每次廣告點擊轉發給 AppsFlyer**，使安裝能歸因回我們。沒有安裝程式碼片段的
到達頁不會轉發任何點擊，它帶來的每一次安裝都會被計為
自然量。參見 [AppsFlyer 概述](/hk/mmp/appsflyer/overview)。
:::

## 相關內容 {#related}

- [追蹤概述](/hk/tracking/overview) — 四種追蹤方式比較
- [Web 追蹤器 SDK 參考](/hk/tracking/web-tracker/reference) — 每個方法與欄位
- [伺服器對伺服器（S2S）概述](/hk/tracking/s2s/overview) — 從後端發送事件
- [AppsFlyer 概述](/hk/mmp/appsflyer/overview) — App 安裝與應用內事件
- [AdWave 廣告系列設定](/hk/adwave/campaign-setup)
