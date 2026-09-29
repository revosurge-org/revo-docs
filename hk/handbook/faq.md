---
title: 常見問題
description: 新廣告主最常問的問題：入門、錢包、追蹤和廣告系列。
---

# 常見問題

**對象：** 正在使用新手投放手冊的新廣告主。

<nav class="article-toc" aria-label="本文內容">
<p class="article-toc-title">本文內容</p>

- [入門](#getting-started)
- [錢包與帳單](#wallet-and-billing)
- [追蹤](#tracking)
- [廣告系列](#campaigns)

</nav>

## 入門 {#getting-started}

### 上線需要多久？ {#how-long-does-it-take-to-launch}

如果只需要 Web 追蹤器，即日就能上線。如要透過 S2S 追蹤充值，開發約需 2–5 天。參見[由這裡開始 → 運作方式](./#_1-how-it-works)。

### 我需要開發者嗎？ {#do-i-need-a-developer}

需要，開發者要在你的網站安裝 Web 追蹤器（約 30 分鐘）。Partner Postback 則無需編寫程式碼。

### 可以新增團隊成員嗎？ {#can-i-add-my-team}

暫時不可以。每個帳戶只有一個登入電郵。如有多人投放，請用共用的工作電郵。

## 錢包與帳單 {#wallet-and-billing}

### 怎樣充值？ {#how-do-i-add-funds}

聯絡你的客戶經理，目前未支援自助付款。參見[帳戶與錢包 → 為錢包充值](./account-and-wallet#_2-fund-your-wallet)。

### 充值可以退款嗎？ {#are-deposits-refundable}

不可以。只需充值測試週期內打算花費的金額。<!-- TODO: confirm policy -->

### 餘額用完會怎樣？ {#what-happens-when-my-balance-runs-out}

廣告系列會停止投放，直至你充值為止。參見[保持餘額充足](./account-and-wallet#_3-keep-your-balance-topped-up)。

## 追蹤 {#tracking}

### 為甚麼我的產品仍然是 Inactive？ {#why-is-my-product-still-inactive}

Web 追蹤器還未發出第一個事件。請檢查腳本是否已加到網站上、Tracker ID 是否正確，然後瀏覽網站，同時留意 **Event Stream**。

### 為甚麼在 Create Campaign 選不到我的產品？ {#why-can-t-i-select-my-product-in-create-campaign}

只能選擇 Active 的產品。請先完成[追蹤設定](/hk/tracking/overview)。

### 我本身已有玩家，首存數字會出錯嗎？ {#i-already-have-players-will-my-first-deposit-numbers-be-wrong}

有可能。追蹤開始後，現有玩家的下一筆充值看起來會像首存。請先發送歷史充值數據，或與客戶經理商定一個截止日期。參見[核心概念 → 首存](/hk/tracking/core-concepts#_5-first-deposits)。

## 廣告系列 {#campaigns}

### 第一個廣告系列應該選哪個目標事件？ {#which-target-event-should-i-choose-first}

選 **Register**，除非你已經能穩定可靠地追蹤充值。參見[建立廣告系列 → 目標與廣告格式](./create-campaign#_2-objective-and-ad-format)。

### 應該先用哪種廣告格式？ {#which-ad-format-should-i-start-with}

**Pop** 上線最快，因為它只需要一個落地頁。

### 每天應該花多少？ {#how-much-should-i-spend-per-day}

約為出價的 100 倍（最少 50 倍）。參見[建立廣告系列 → 出價與日預算](./create-campaign#_4-bid-and-daily-budget)。

### 廣告系列上線前有審核嗎？ {#is-there-a-review-before-my-campaign-goes-live}

沒有。點擊 **Launch** 後，廣告系列會在排定的時間開始投放。 <!-- TODO (Product): same Launch / Campaign Summary question as create-campaign.md -->

### 廣告系列沒有花費，應該檢查甚麼？ {#my-campaign-isn-t-spending-what-should-i-check}

參見[投放第一週 → 常見問題診斷](./first-week#_3-diagnose-common-problems)。

### 為甚麼 Analytics 的數字一直在變？ {#why-do-my-analytics-numbers-keep-changing}

Cohort 檢視會把點擊後 14 天內發生的轉化都歸到該次點擊，所以近期的數字會一直增加，直至同期群成熟為止。

::: tip 還有其他問題？
聯絡你的客戶經理，並附上填好的[上線準備表](./#_2-fill-in-your-launch-worksheet)。他們想問的問題，表中大多已有答案。
:::
