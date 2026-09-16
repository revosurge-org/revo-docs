---
title: 追蹤概述
description: 把轉化數據發給 RevoSurge 的四種方式 —— Web 追蹤器、AppsFlyer、S2S 伺服器事件、Partner Postback。60 秒選出適合你的。
---

# 追蹤概述

把轉化數據發給 RevoSurge 的四種方式。60 秒選出適合你的。

::: tip 在哪裡配置這些
四種方式全部都在 **DataPulse**([datapulse.revosurge.com](https://datapulse.revosurge.com))中你的**產品**裡設定——透過 Setup Wizard 的 **Setup Web Tracker** 與 **S2S Postback** 步驟。剛接觸 RevoSurge?從 [**增長 → 入門指南**](/hk/growth/getting-started) 開始。
:::

## 哪種方式適合你？ {#decide}

回答兩個問題，我們推薦最快的落地路徑。

<TrackingMethodPicker lang="hk" />

## 或者按場景選 {#scenarios}

<div class="scenario-grid">
  <a class="scenario-card" href="#partner-postback">
    <div class="scenario-lead">「我用的是 <strong>Affilka / Cellxpert / Smartico / MyAffiliates / NetRefer</strong>，想今天就上線。」</div>
    <div class="scenario-arrow">→ <strong>Partner Postback</strong> · 當天上線 · 無需工程</div>
  </a>
  <a class="scenario-card" href="#s2s">
    <div class="scenario-lead">「我有<strong>自建後台</strong>，也有能對接 API 的工程團隊。」</div>
    <div class="scenario-arrow">→ <strong>S2S 伺服器事件</strong> · 控制力最強 · 完整 iGaming 事件目錄</div>
  </a>
  <a class="scenario-card" href="#appsflyer">
    <div class="scenario-lead">「我在 Play Store 或 App Store 上有<strong>原生 Android / iOS App</strong>。」</div>
    <div class="scenario-arrow">→ <strong>AppsFlyer</strong> · 業界標準的 App MMP</div>
  </a>
  <a class="scenario-card" href="#web-tracker">
    <div class="scenario-lead">「我只有<strong>落地頁 + 廣告主網站</strong> —— 沒有 App，也沒有後台 API。」</div>
    <div class="scenario-arrow">→ <strong>Web 追蹤器</strong> · 第一方 JS 程式碼片段</div>
  </a>
</div>

## 四種方式 {#methods}

<div class="method">

### 🌐 Web 追蹤器 <Badge type="info" text="網頁" /> {#web-tracker}

<p class="method-tagline">裝在落地頁和廣告主網站上的第一方 JS。</p>

用戶在網頁漏斗中前進時，即時上報轉化事件（註冊、存款、FTD）。`click_id` 存在有效期一年的第一方 cookie 裡 —— 一次點擊落地、跳出、三天後回來，這條轉化仍然歸因得上。

<div class="method-meta">
  <div class="meta-item"><span class="meta-label">適用場景</span>純網頁漏斗，或希望在沒有伺服器端對接的前提下歸因網頁側轉化</div>
  <div class="meta-item"><span class="meta-label">不適用</span>你的漏斗在流動 App 內</div>
  <div class="meta-item"><span class="meta-label">交付形式</span>JS 程式碼片段 + GTM 範本（規劃中）</div>
  <div class="meta-item"><span class="meta-label">關鍵機制</span>第一方 cookie，有效期一年，跳出後回訪仍可歸因</div>
</div>

<a class="method-cta" href="/hk/tracking/web-tracker/install">從 Web 追蹤器開始 →</a>
<a class="method-cta-secondary" href="/hk/tracking/web-tracker/reference">查看 SDK 參考</a>

</div>

<div class="method">

### 📱 AppsFlyer <Badge type="tip" text="App MMP" /> {#appsflyer}

<p class="method-tagline">第三方流動歸因平台，業界標準。</p>

RevoSurge 作為媒體渠道接入，AppsFlyer 把安裝與應用內事件 postback 轉發給我們。你在初始化 web 追蹤器時於落地頁配置 `androidAppsFlyerId` / `iOSAppsFlyerId`，我們會作為合作夥伴卡片出現在你的 AppsFlyer 後台。

Play Store / App Store 分發走 Install Referrer，是確定性歸因。APK 與 H5 套殼分發則回退到概率匹配，匹配率明顯更低。

<div class="method-meta">
  <div class="meta-item"><span class="meta-label">適用場景</span>任何流動 App —— Play Store、App Store、APK 或 H5 套殼</div>
  <div class="meta-item"><span class="meta-label">不適用</span>你完全沒有流動 App（純網頁漏斗）</div>
  <div class="meta-item"><span class="meta-label">交付形式</span>初始化 web 追蹤器時在落地頁配置 · AppsFlyer 後台的合作夥伴卡片</div>
  <div class="meta-item"><span class="meta-label">歸因精度</span>應用商店安裝走 Install Referrer 為確定性 · 其餘為概率匹配</div>
</div>

<a class="method-cta" href="/hk/mmp/appsflyer/overview">從 AppsFlyer 開始 →</a>
<a class="method-cta-secondary" href="/hk/mmp/appsflyer/validation">整合驗證</a>

</div>

<div class="method">

### 🔧 S2S 伺服器事件 <Badge type="info" text="S2S" /> {#s2s}

<p class="method-tagline">你的後台直連我們的 S2S API，控制力最強。</p>

伺服器到伺服器，完全程式化。**分兩檔，按你想衡量什麼來選。** 兩檔共用同一套鑑權與事件契約，可以先上 Basic，之後增量擴到 Full。

<div class="method-subtier">
  <div class="method-subtier-title">S2S-Basic —— 僅註冊 + FTD</div>
  <div class="method-subtier-desc">透過 S2S 通道拿到核心獲客指標。REST API 子集（2 個端點）。比 Partner Postback 控制力更強，但尚不含收入與復存追蹤。</div>
</div>

<div class="method-subtier">
  <div class="method-subtier-title">S2S-Full —— 完整 iGaming 事件目錄</div>
  <div class="method-subtier-desc">包含 Basic 的全部，另加復存、收入事件、跨通道去重與對帳。契約要點：never-4xx 設計 · 去重回退鏈 · 30 天接收窗口 · 營運方的 FTD 主張按 is_claimable 主張收下，不自動裁定為權威。</div>
</div>

<div class="method-meta">
  <div class="meta-item"><span class="meta-label">適用場景</span>自建後台且有工程團隊 —— Basic 做獲客，Full 做 LTV、去重與收入</div>
  <div class="meta-item"><span class="meta-label">不適用</span>沒有工程資源對接 HTTP API</div>
  <div class="meta-item"><span class="meta-label">交付形式</span>REST API（OpenAPI v3 規範規劃中）· 可選 PHP / Node SDK · Full 另有對帳檔案投遞</div>
  <div class="meta-item"><span class="meta-label">升級路徑</span>Basic → Full 只需改程式碼：同一套鑑權、同一份契約、欄位只增不改，無需重新接入</div>
</div>

<a class="method-cta" href="/hk/tracking/s2s/overview">從 S2S 開始 →</a>
<a class="method-cta-secondary" href="/hk/tracking/s2s/v3/server-events-api">查看 API 參考</a>

</div>

<div class="method">

### 🔗 Partner Postback <Badge type="warning" text="上線最快" /> {#partner-postback}

<p class="method-tagline">把兩個 URL 貼到你的聯盟平台，今天就能上線。</p>

一個貼到你的聯盟 / 後台平台的 URL。該平台在註冊與 FTD 發生時向我們發送 postback。無需寫碼、無需工程、無需等待。支援 Affilka、Cellxpert、Smartico、MyAffiliates、NetRefer 以及其他 iGaming 友好的平台。

<div class="method-meta">
  <div class="meta-item"><span class="meta-label">適用場景</span>使用 SaaS 聯盟平台，希望零工程、當天完成接入</div>
  <div class="meta-item"><span class="meta-label">不適用</span>需要與 AppsFlyer 做跨通道去重，或需要上報任意應用內事件 —— 請升級到 S2S</div>
  <div class="meta-item"><span class="meta-label">交付形式</span>從我們後台複製兩個 postback URL（註冊 + FTD）· slug 與密鑰自助獲取</div>
  <div class="meta-item"><span class="meta-label">歸因精度</span>取決於你的聯盟平台的宏參數覆蓋度</div>
</div>

<a class="method-cta" href="/hk/tracking/postback/partner-postback">從 Partner Postback 開始 →</a>
<a class="method-cta-secondary" href="/hk/tracking/postback/partner-postback#parameters">宏參數說明</a>

</div>

::: warning APK / H5 套殼分發
支援，但走概率匹配 —— 因為沒有 Install Referrer，匹配率明顯低於 Play Store / App Store 分發。請評估這個匹配率是否滿足你的 CPA 目標。
:::

## 完整路由表 {#matrix}

先找到你所在的行（你怎麼營運後台），再找到你的列（用戶在哪裡轉化）。

| 後台歸屬 | 只有網頁 | 只有 App | 網頁 + App |
|---|---|---|---|
| **自建後台**（有內部工程團隊） | **S2S + Web 追蹤器**（兩個都要）—— S2S 負責發事件，Web 追蹤器抓點擊側信號 | **S2S** 為主 · **AppsFlyer** 做安裝歸因 | **S2S + Web 追蹤器 + AppsFlyer**（三個都要）—— S2S 作權威事件流，Web 追蹤器抓點擊側，AppsFlyer 做 App 安裝 |
| **聯盟 / SaaS 平台**（Affilka · Cellxpert · Smartico · MyAffiliates · NetRefer 等） | **Partner Postback** 為主 · **Web 追蹤器**抓點擊側信號 | **Partner Postback** + **AppsFlyer** 做安裝歸因 | **Partner Postback + AppsFlyer**（兩個都要）—— Postback 覆蓋平台側，AppsFlyer 處理 App 安裝 |
| **盡快上線 · 無需工程** | **Partner Postback**（當天上線） | 只用 **AppsFlyer**（接受 App 側的缺口） | **Partner Postback + AppsFlyer**（兩個都要）—— 先用 Postback 覆蓋網頁側，AppsFlyer 做 App 安裝 |

**跨方式說明**

- APK / H5 套殼分發透過概率匹配支援 —— 匹配率低於帶 Install Referrer 的 Play Store / App Store 分發。
- 30 天歸因窗口對所有方式一致生效。
- 當 `click_id` 缺失時，`identifier`（SHA-256 電郵或電話號碼）可提升為歸因回退關聯鍵。

## 常見問題 {#faq}

::: details 哪種方式最準？
Web 追蹤器與 S2S 精度最高，因為它們不依賴第三方匹配。AppsFlyer 是 App 歸因的業界標準。Partner Postback 的上限取決於你的聯盟平台的宏參數覆蓋度。
:::

::: details 同一筆 FTD 我同時透過 AppsFlyer *和*自建後台上報了，會怎樣？
兩條都會存下來。Integration Health Score 會把衝突暴露出來。跨通道權威源的裁定策略正在敲定 —— 在此之前，請把兩個信號視為互補，並檢查其中的分歧。
:::

::: details 可以用本地貨幣（INR / MYR / USDT）發 postback 嗎？
可以 —— 我們按公布的匯率換算，你不需要先換成美元。
:::

::: details 時間戳用秒還是毫秒？
**請傳毫秒。** 這是 Partner Postback 與 Server Events API 共同的契約。

不同之處在於你沒照做時會發生什麼。Server Events API（v3）會**拒絕**看來像秒的值。Partner Postback 會修正它並保留事件，但把這次修正視為一次契約偏離 — 它會觸發我方告警，我們會與你聯絡。兩者都不是第二種受支援的格式，所以請固定使用毫秒。
:::

::: details 有測試模式嗎？
有，兩種：

- 測試密鑰會把數據路由到一條可見的事件流，你可以自助驗證，不觸碰生產流量。
- 在 S2S 與 postback 端點上加 `dryrun=1`，我們會解析、驗證並原樣回顯將要記錄的內容 —— 但不落庫。
:::

::: details 怎麼知道我的整合是健康的？
每個產品頁都有 **Integration Health Score** —— `click_id` 覆蓋率、`event_id` 存在率、身份覆蓋率、事件到達時的中位時延、建議欄位完整度。同時給出一份整改清單，並附上對應的 CPA 差值。
:::

::: details 可以先上 S2S-Basic，之後再升級到 S2S-Full 嗎？
可以 —— 這正是設計好的路徑。同一套鑑權、同一份事件契約、欄位只增不改。升級只需改程式碼，無需重新接入。
:::

::: details APK / H5 套殼的 App 支援嗎？
支援，走概率匹配。因為沒有 Install Referrer，匹配率明顯低於 Play Store / App Store 分發。請把這部分精度損失計入你的 CPA 目標。
:::

## 開始接入 {#getting-started}

1. 回答本頁頂部的兩個問題，或在完整路由表中找到你所在的行。
2. 打開對應的方式頁面：[Web 追蹤器](/hk/tracking/web-tracker) · [AppsFlyer](/hk/mmp/appsflyer/overview) · [S2S 伺服器事件](/hk/tracking/s2s/overview) · [Partner Postback](/hk/tracking/postback/partner-postback)。
3. 想最快上線，就從 **Partner Postback**（SaaS 後台）或 **S2S-Basic**（自建後台）起步 —— 等需要收入信號時再擴到 S2S-Full。

<div class="bottom-cta" id="support">
  <div>
    <div class="bottom-cta-title">還是拿不準該用哪種？</div>
    <div class="bottom-cta-text">聯繫你的 RevoSurge BD 對接人，我們會幫你選型並協助上線。</div>
  </div>
</div>
