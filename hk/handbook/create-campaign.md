---
title: 建立廣告系列
description: 分六步建立並上線你的第一個 AdWave 廣告系列，以及每一步應該怎樣選。
---

# 建立廣告系列

**對象：** 在 AdWave 上線廣告系列的廣告主和媒體採購。

本頁按次序帶你走完 **Create Campaign** 流程的每個部分。請打開你在「由這裡開始」填好的[上線準備表](./#_2-fill-in-your-launch-worksheet)：下面每一項怎樣選，表中都已經寫好。

<nav class="article-toc" aria-label="本文內容">
<p class="article-toc-title">本文內容</p>

- [開始之前](#before-you-start)
- [1. 產品](#_1-product)
- [2. 目標與廣告格式](#_2-objective-and-ad-format)
- [3. 目標地區與再行銷](#_3-target-geo-and-retargeting)
- [4. 出價與日預算](#_4-bid-and-daily-budget)
- [5. 排期](#_5-schedule)
- [6. 素材](#_6-creative)
- [7. 上線](#_7-launch)

</nav>

<!-- VIDEO: one 60–90 s clip per section below. Embed slot marked "▶ Video" in each section.
     Host outside YouTube for mainland China viewers (e.g. Bilibili or self-hosted CDN). -->

## 開始之前 {#before-you-start}

數據設定完成前，**Create Campaign** 會一直鎖定。請先確認：

- ✅ 產品顯示為 **Active**（[接入追蹤](/hk/tracking/overview)）
- ✅ 錢包有餘額（[帳戶與錢包](./account-and-wallet)）
- ✅ 素材和落地頁都已準備好（[素材](./creatives)、[落地頁](./landing-page)）

然後前往左邊選單的 **Campaign**，點擊 **+ Create Campaign**；亦可以在 AdWave 首頁點擊 **Create Campaign**。

整個流程都在同一個長頁面上完成。左邊的步驟會顯示你目前的位置，點擊任何一步即可跳到該處。

## 1. 產品 {#_1-product}

<!-- ▶ Video: 1 · Choose your Product -->

選擇你要推廣的產品。

![Create Campaign — 第 1 步，選擇產品](/img/handbook/create-campaign-product.png)

只能選擇 Active 的產品，未啟用的產品會顯示為灰色。如果你的產品是灰色的，請先完成[追蹤設定](/hk/tracking/web-tracker/install#step-5-verify-in-the-portal)。

## 2. 目標與廣告格式 {#_2-objective-and-ad-format}

<!-- ▶ Video: 2 · Objective and ad format -->

**廣告系列名稱。** 使用建議格式 **地區 + 推廣內容 + 廣告格式 + 開始日期**，例如 `IN_Register_Pop_20261001`，這樣報表會更易看懂。

**目標事件。** 選擇這個廣告系列要優化的轉化。AdWave 亦會用它來計算你的 **CPA**（每次獲客成本）。

![Create Campaign — Target Event 與 Ad Format](/img/handbook/create-campaign-objective-format.png)

| 目標事件 | 優化目標 | 適用情況 |
| --- | --- | --- |
| **Register** | 新註冊 | **第一個廣告系列建議選它。** 你已用 Web 追蹤器追蹤註冊 |
| **FTD（First-Time Deposit，首存）** | 玩家的首次充值 | 充值追蹤穩定可靠（S2S 或 Partner Postback） |
| **Bet** | 玩家下注 | 你透過 S2S 發送 `bet` 事件 |
| **Landing Page Click** | 落地頁上的任何點擊 | 註冊追蹤尚未就緒，你想先取得較大量的訊號。註冊是更強的訊號，所以能用 **Register** 就優先選它 <!-- TODO (Ops): confirm when to recommend Landing Page Click --> |

**廣告格式。** 在 **Pop**、**Push**、**Display** 或 **Native** 中選一種，第 6 步的素材欄位會隨之改變。拿不定主意？參見[上線準備表 → 廣告格式](./#_2-4-ad-format-bid-and-budget)。

## 3. 目標地區與再行銷 {#_3-target-geo-and-retargeting}

<!-- ▶ Video: 3 · Target geo and retargeting -->

![Create Campaign — Target Geo、Retargeting Audience 與 Converted Customer List exclusion](/img/handbook/create-campaign-geo-retargeting.png)

**Target Geo（目標地區）。** 搜尋並加入要投放的國家或地區，每個廣告系列最多 **20** 個。首次測試建議由 1–3 個市場開始。

**Retargeting Audience（再行銷受眾，可選）。** 只向你已建立的受眾細分中的玩家展示廣告，例如已註冊但未充值的人。第一個廣告系列可以留空。如要建立受眾細分，點擊 **Create Audience**，或參見 [受眾 → 受眾細分](/hk/audience/segments)。

**Converted Customer List exclusion（已轉化用戶排除）。** 此項會自動開啟。AdWave 不會再向已完成首存（FTD）的玩家，以及自我禁制和已選擇退出的用戶展示你的廣告，你無需作任何設定。頻次上限（同一個人看到你廣告的次數）亦由平台管理。

::: tip 地區和語言要配合
每個市場都需要本地語言的素材。如果你的各個市場語言不同，請每種語言各建一個廣告系列。
:::

## 4. 出價與日預算 {#_4-bid-and-daily-budget}

<!-- ▶ Video: 4 · Bid and daily budget -->

![Create Campaign — 出價策略、Suggested Bid 與 Daily Budget](/img/handbook/create-campaign-bid-budget.png)

**出價策略。** 選擇 **oCPM**（標有 *Suggested*）。

| 策略 | 如何運作 | 適用情況 |
| --- | --- | --- |
| **oCPM**（優化 CPM） | 你設定每個目標事件（例如每個註冊）願意付的成本，AdWave 就會去找最有可能轉化的流量 | **大部分廣告系列**，包括你的第一個 |
| **CPM** | 你設定每千次展示最多願意付多少（**Maximum CPM Bid**），AdWave 會在這個價格內盡量擴大觸及 | 著重觸及和頻次的品牌認知類廣告系列 |

**出價。** 使用 oCPM 時，出價就是你**願意為每個目標事件支付的成本**，例如每個註冊 $2.50。請把它設為你能承受的每次獲客成本（CPA）。AdWave 亦會顯示 **Suggested Bid**（建議出價）；如果建議出價和你的目標 CPA 相差很遠，上線前請先與客戶經理確認。不過收費仍按每千次展示計算，所以實際的每次事件成本可能高於或低於你的出價。

<!-- TODO (Product): Suggested Bid is wrong for oCPM. Tested 2026-09-28, geo IN: oCPM shows the same values as CPM's Suggested Max Bid for every target event — Pop $100, Push $0.09, Display $0.03, Native $0.02. These are CPM-level prices, not a cost per event, and Pop $100 looks like a fallback value. Fix before publishing; recapture create-campaign-bid-budget.png afterwards (it currently shows $100). -->

**日預算。** 使用 oCPM 時，日預算應設為出價的約 **100 倍**，讓 AdWave 每天都有足夠數據學習；最低約為 **50 倍**。使用 CPM 時，日預算最少為出價的 **20 倍**。

| 你的出價 | 建議日預算 | 最低日預算 |
| --- | --- | --- |
| $2.50 | $250 | $125 |
| $5.00 | $500 | $250 |

::: warning 預算太少會拖慢學習
預算太少，AdWave 看到的轉化就太少，無法有效優化，成效亦會一直不穩定。如果建議預算超出你的承受範圍，請減少投放地區，不要把預算壓到最低值以下。
:::

## 5. 排期 {#_5-schedule}

<!-- ▶ Video: 5 · Schedule -->

![Create Campaign — Schedule，已打開 End Date 選擇器並選中 14D](/img/handbook/create-campaign-schedule.png)

- **開始日期：** 預設即時開始，亦可以選未來的日期。
- **結束日期：** 必填。可以選擇日期、使用 **Quick Select Cycle**（**3D / 7D / 14D / 30D / 60D / 90D**），或在 **Custom Cycle** 輸入天數，然後點擊 **Confirm**。

::: info 時間以 UTC+0 計算
廣告系列按 **UTC+0** 運行（顯示為 *Actual publish time*）。你可以用選擇器中的 **Local time**，查看換算成你所在時區的時間。
:::

首次測試請選 **14 天**，讓 AdWave 有時間學習，你亦有足夠數據判斷成效。

## 6. 素材 {#_6-creative}

<!-- ▶ Video: 6 · Add creatives -->

點擊 **Add Creative (format)** 逐個加入廣告。要填寫的欄位視乎廣告格式而定，參見[素材 → 規格](./creatives#_3-specs-by-ad-format)。

**Pop** 只需要語言和 Destination URL，因為 Pop 會直接打開你的落地頁：

![Create Campaign — Pop 的素材部分](/img/handbook/create-campaign-creative-pop.png)

**Display、Native 和 Push** 還需要圖片。點擊 **Upload or Drag your file here**，或點擊 **Add from library** 重用已上載的素材。每次最多可上載 **20 張圖片**。上載框會列明支援的格式和尺寸：

![Create Campaign — Display 的素材部分及 Main Image 上載框](/img/handbook/create-campaign-creative-display.png)

為每個素材設定：

- **Creative language（素材語言）：** 廣告的語言。剔選 **All creatives in this campaign will use this language** 即可套用到全部素材。
- **Destination URL（目標網址）：** 玩家會到達的落地頁。剔選 **One URL for all creatives in this campaign** 即可讓所有素材共用同一個 URL；或點擊 **Add Landing Page** 登記新的落地頁。

::: warning Destination URL 必須已登記
Destination URL 必須屬於該產品下已登記並啟用的網域，否則廣告系列無法投放。
:::

## 7. 上線 {#_7-launch}

所有部分都填好後，點擊右上角的 **Launch**。這裡不設額外的審核步驟，廣告系列會在排定的時間開始投放。

<!-- TODO (Product): /en/adwave/campaign-setup says Launch opens a Campaign Summary that must be confirmed (screenshot: /img/onboarding/campaign-launch-summary.png). Confirm which is current and align both pages. -->

**最後檢查：**

- ✅ 已選擇 Active 的產品
- ✅ 廣告系列名稱符合建議格式
- ✅ 已選擇目標事件（第一個廣告系列選 Register）
- ✅ 已選擇一種廣告格式
- ✅ 已加入 1–20 個地區，素材語言與地區配合
- ✅ oCPM 出價已設為目標每次事件成本；日預算約為出價的 100 倍
- ✅ 已設定排期（首次測試 14 天）
- ✅ 已按規格加入素材，每個素材都已設定語言和已登記的 Destination URL

你的廣告系列現在會出現在 **Campaigns** 列表中，並顯示狀態、已運行天數、日預算和投放指標。

![Campaigns 列表，顯示狀態、已運行天數、日預算、花費和投放指標](/img/handbook/campaign-list.png)

| 狀態 | 意思 |
| --- | --- |
| **Live** | 廣告系列正在投放 |
| **Ended** | 廣告系列已結束並完成結算 |
| **Settlement Pending** | 廣告系列已結束，最終花費正在結算 |

<!-- TODO (Product): confirm the full status list (e.g. Scheduled, Paused) -->

**下一步：** [投放第一週](./first-week)
