---
title: 投放第一週
description: 上線後頭 7 天要檢查甚麼、正常情況是怎樣，以及出問題時如何處理。
---

# 投放第一週

**對象：** 剛上線廣告系列的廣告主和媒體採購。

新廣告系列需要時間學習。本頁告訴你頭 7 天應該看甚麼、如何解讀數據，以及甚麼時候該作調整。一週過後，你就能決定是優化、放量還是停投。

<nav class="article-toc" aria-label="本文內容">
<p class="article-toc-title">本文內容</p>

- [1. 甚麼時候看甚麼](#_1-what-to-check-and-when)
- [2. 在哪裡看數據](#_2-where-to-find-your-numbers)
- [3. 常見問題診斷](#_3-diagnose-common-problems)
- [4. 調整規則](#_4-rules-for-changes)

</nav>

## 1. 甚麼時候看甚麼 {#_1-what-to-check-and-when}

| 時間 | 看甚麼 | 健康的表現 |
| --- | --- | --- |
| **頭 2 小時** | 狀態和展示 | 狀態為 **Live**，展示量在上升 |
| **第 1 天** | 花費、展示、點擊和 CTR（Pop 看 Visit Rate） | 花費接近日預算；持續有點擊（Pop 為到訪） |
| **第 2 天** | 註冊 | Analytics 中開始出現註冊 |
| **第 3 天** | 表現最好和最差的素材（CTR 或 Visit Rate、註冊） | 有幾組素材明顯領先 |
| **第 4–6 天** | 花費進度、素材排名 | 廣告系列每天用掉大部分日預算；最弱的素材已暫停 |
| **第 7 天** | **Cohort** 檢視中的 **CPA**，與目標比較 | 可以作決定了：CPA 達標就[優化與放量](./optimise-and-scale)；接近目標就調整一個變數；相差太遠就停投 |

<!-- TODO (Product): Day 7 conflicts with cohort maturity. The Cohort view says cohorts under 14 days "are excluded from the total row", so on day 7 every cohort of a new campaign is still maturing. Say which number to read on day 7 (the campaign's own row, as a provisional CPA?). -->
<!-- TODO (Product): the Cohort columns in analytics-activity.png show FTDs / FTD CPA / GGR / LTV / ROAS, with no cost per registration. Confirm where a Register campaign reads its CPA. -->
<!-- TODO (Product): the Creatives list only has edit and delete actions. Confirm how to pause a single creative in a live campaign (Days 4–6 row, and Rules for changes). -->
<!-- TODO (Ops): add benchmark ranges for CTR and CPA by format and geo tier, so advertisers can tell "normal" from "problem" -->

## 2. 在哪裡看數據 {#_2-where-to-find-your-numbers}

**Campaigns** 顯示每個廣告系列的投放情況：狀態、日預算、花費、展示（Imps）、點擊、CTR、CPM、CPC 和 Visit Rate。

Pop 廣告會直接打開你的落地頁，沒有點擊可計，所以 Clicks 和 CTR 會顯示為 `--`。Pop 廣告請改看 **Visit Rate**，而不是 CTR。<!-- TODO (Product): confirm the Visit Rate definition (landing page visits ÷ impressions?) -->

![有投放指標的 Campaigns 列表](/img/handbook/campaign-list.png)

**Analytics** 顯示成效：花費、註冊（Regs）、首存（FTDs）、GGR（博彩總收入）和綜合成本。

![Analytics — Activity 卡片：Spend、Regs、FTDs、GGR、CPM、CPR、FTD CPA 和 ROAS](/img/handbook/analytics-activity.png)

::: info 兩種計算方式
- **Activity** 按事件發生當天計算，適合用來觀察花費進度。
- **Cohort** 把每個轉化歸到帶來該玩家的廣告系列（最後點擊，14 天窗口），適合用來判斷廣告系列的真實 CPA。未滿 14 天的同期群（cohort）尚未成熟，數字仍會變動。
:::

## 3. 常見問題診斷 {#_3-diagnose-common-problems}

| 現象 | 可能原因 | 怎樣處理 |
| --- | --- | --- |
| 幾個小時後仍然沒有展示 | 出價太低、定向太窄，或錢包沒有餘額 | 檢查餘額；把出價提高 10–20%；加入更多地區 |
| 有展示，但花費遠低於預算 | 以這個市場而言，出價太低 | 逐步提高出價（約 10–20%） |
| 有展示，但點擊很少（CTR 低） | 素材不奏效 | 新增不同優惠或視覺的素材；暫停最弱的素材 |
| Pop：有展示，但 Visit Rate 低 | 落地頁載入太慢，或頁面沒有安裝 Web 追蹤器 | 檢查頁面能否在流動網絡下 2 秒內載入完成，以及 `page_view` 有否出現在 **Event Stream** 中 |
| 有點擊或到訪，但沒有註冊 | 落地頁或追蹤有問題 | 用手機打開頁面，檢查是否載入夠快、與廣告一致；並檢查 `register` 有否出現在 **Event Stream** 中 |
| 你的後台有註冊，但 RevoSurge 沒有 | 追蹤有缺口 | 檢查每個落地頁網域都已安裝 Web 追蹤器，而且註冊時會觸發 `register` |
| 有註冊，但沒有充值 | 沒有追蹤充值，或玩家質素偏低 | 確認充值事件有傳到（S2S 或 Partner Postback）；重新檢視優惠和地區 |
| 廣告系列停止投放 | 錢包餘額用完，或已到結束日期 | 查看 Campaign 頁面右上角的 **Balance**，請客戶經理充值；檢查排期 |

想知道網站正在發送甚麼？到 **Product → Setup Wizard** 查看 **Event Stream**，或參見 [Web 追蹤器 → 在後台驗證](/hk/tracking/web-tracker/install#step-5-verify-in-the-portal)。

![Setup Wizard 中的 Event Stream，顯示每個網域收到哪些事件](/img/handbook/web-tracker-event-stream.png)

## 4. 調整規則 {#_4-rules-for-changes}

- **等滿 24 小時**才作任何改動，除非完全沒有投放。
- **每次只改一處**，這樣才知道結果由哪項改動引起。
- **逐步調整出價**，每次約 10–20%。
- 成效不佳的素材**暫停，不要刪除**，這樣才能保留它們的數據。
- **第 7 天才看 CPA，不要提早。** 廣告系列仍在學習期間，早期 CPA 會大幅波動。請等足一週的數據，並使用 Cohort 檢視。
- **第 7 天才作重大決定。** 要決定放量、換優惠還是停投，最少需要一週的數據。

**下一步：** [優化與放量](./optimise-and-scale)
