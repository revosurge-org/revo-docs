---
title: 入門指南
description: 帳戶設定、充值、產品配置、啟動首個廣告系列。
---

# 入門指南

**對象：** 帳戶擁有者、管理員、營運、UA 經理、財務

## 本文內容
- 帳戶結構與角色
- 充值與計費基礎
- 產品設定(概覽)
- 啟動首個試點
- 首 72 小時需衡量的指標

## 您的入門路徑

這裡的一切都是**自助式**的——毋須 RevoSurge 代表即可上線。請依序完成以下五個步驟(每步在下方展開說明)：

1. **建立帳戶**——在 [adwave.revosurge.com](https://adwave.revosurge.com) 公開註冊，然後新增團隊成員。→ [建立帳戶](/hk/growth/account)
2. **充值錢包**——存入 AdWave 與 DataPulse 共用的錢包。→ [充值與錢包](/hk/growth/funding-wallet)
3. **在 DataPulse 中設定產品與追蹤**——建立產品並連接追蹤，使其變為 **Active**。→ [選擇追蹤方式](/hk/tracking/overview) · [產品設定](#_3-product-setup-high-level)
4. **啟動首個廣告系列**——產品變為 Active 後，在 AdWave 中建立並啟動。→ [廣告系列設定](/hk/adwave/campaign-setup)
5. **衡量首 72 小時**——在 DataPulse 中觀察投放、質素與轉化。→ [需衡量的指標](#_5-what-to-measure-in-the-first-72-hours)

::: warning 哪些我可以自己做——哪些需要開發者？
步驟 **1、2、4、5 完全可在瀏覽器中自助完成**。**步驟 3(安裝追蹤)是唯一的技術步驟**——把 Web Tracker 加到你的網站，或發送 S2S 事件，會觸及你網站的程式碼。如果你不編輯自己的網站也沒問題：你仍掌控其餘一切，只需把那一步交給管理你網站的人(見[下方步驟 3](#_3-product-setup-high-level))。不熟悉這裡的術語？參見 [核心術語](/hk/revosurge/welcome#key-concepts)。
:::

## 1) 帳戶結構與角色
RevoSurge 帳戶代表您在平台上的業務，包括：
- 公司身份(法定名稱、地區)
- 用戶、角色及權限
- 計費與錢包餘額
- 產品(網站/應用)
- 廣告系列與報表

**常見角色(示例)：**
- **管理員 / 主帳戶：** 完全存取、用戶管理、計費可見性  
- **廣告主管：** 廣告系列與素材管理  
- **數據分析師：** 報表與衡量(在可用時)  
- **財務：** 餘額、發票、交易記錄  

> 提示：至少保留一名管理員/主帳戶用戶，以避免存取鎖定。

## 2) 充值與錢包基礎
RevoSurge 使用**帳戶級共享錢包**。  
在執行廣告系列之前，請確認：
- 錢包有足夠餘額用於計劃支出
- 財務團隊了解充值流程及交易記錄

您應能檢視：
- 目前餘額(錢包)
- 交易歷史 / 充值記錄
- 廣告系列支出總額(在 AdWave 中)

## 3) 產品設定(概覽) {#_3-product-setup-high-level}
**產品**是您推廣的網站/應用。在 AdWave 中註冊後，每個產品的技術整合——追蹤器、伺服器事件與 API 憑證——都在 **DataPulse** 中設定。

::: info 同一個帳戶，兩個進入 DataPulse 的方式
AdWave 與 DataPulse 共用**同一個帳戶**——同一電郵、同一登入。兩種方式皆可進入 DataPulse：
- 直接前往 **[datapulse.revosurge.com](https://datapulse.revosurge.com)** 登入，或
- 在 **AdWave** 儀表板**右上角**點擊 **Open DataPulse**。
:::

![在 AdWave 後台，「Open DataPulse」位於右上角,緊鄰 Currency / Timezone](/img/onboarding/adwave-open-datapulse.png)

你採用哪種轉化方式——Web Tracker、S2S、AppsFlyer 或 Partner Postback——取決於你的設定；請在 [**追蹤概述**](/hk/tracking/overview) 中選擇適合你的方式。

DataPulse 會透過引導式的 **Setup Wizard** 帶你完成：
1. **Create Product**——設定 Domain、Tracker ID 與 Deposit FX。
2. **Setup Web Tracker**——把追蹤器加到你的網站，讓事件開始流入。參見 [**安裝 Web Tracker**](/hk/tracking/web-tracker/install)。
3. **S2S Postback**——**Generate API Key** 並發送伺服器到伺服器事件(初始的 **S2S Status: Pending** 屬正常,直到收到首個事件為止)。參見 [**API 金鑰**](/hk/api/api-key)。
4. **Ad Sources**——連接 AdWave,使廣告投放與成效對齊。

> 產品在其 Web Tracker 收到首個事件之前一直處於 **Inactive** 狀態;只有**已啟用**的產品才能在你建立廣告系列時被選取。

![DataPulse Setup Wizard——Create Product、Setup Web Tracker、S2S Postback、Ad Sources](/img/onboarding/datapulse-setup-wizard.png)

::: tip 你不是編輯網站的人?
安裝 Web Tracker(或發送 S2S 事件)會觸及你網站的程式碼——你不必親自動手。把 [**安裝 Web Tracker**](/hk/tracking/web-tracker/install) 頁面發給管理你網站的人(約 15 分鐘),待你的產品顯示 **Active** 後再回來。本指南中的其餘一切仍保持自助。
:::

## 4) 啟動首個試點(建議清單)
上線前：
- ✅ 已選擇產品**並已啟用**——產品在其 Web Tracker 收到首個事件之前一直處於 **Inactive** 狀態;只有已啟用的產品才能在廣告系列流程中被選取。請在 DataPulse 的 **Product → Manage Product** 下查看 **Tracker Status** 欄(或 Setup Wizard 中的 **Web Tracker active** 指示)。  
- ✅ 已選擇目標事件(根據目前規則必須可用/有效)  
- ✅ 素材已上傳並審核  
- ✅ 已設定地區定向  
- ✅ 已設定日預算及 CPM/出價  
- ✅ 已確定監控計劃(誰負責檢視支出、效果、質素)

## 5) 首 72 小時需衡量的指標 {#_5-what-to-measure-in-the-first-72-hours}
**客戶端效果(廣告主視角)：**
- 曝光、點擊、CTR
- 落地頁工作階段 / 訪問(如已衡量)
- 轉化(如可用)
- 支出、CPM、CPC、CPA(如適用)

**營運與單位經濟(平台視角)：**
- 按 SSP / 發佈商的支出分佈
- 勝率、結算 eCPM 分佈
- 媒體成本 vs 客戶計費支出(加價實現)
- 庫存質素訊號(如「高曝光 / 無點擊」異常)

## 疑難排解

::: details 我的產品卡在「Inactive」
產品只有在其 Web Tracker 收到首個事件後才會變為 **Active**。請確認追蹤器腳本已安裝在正確的頁面上、`trackerId` 與你的產品相符,且沒有廣告攔截器或 CSP 阻擋 `web-tracker.js`。參見 [安裝 Web Tracker](/hk/tracking/web-tracker/install#troubleshooting)。若在真實流量到達後仍長時間維持 Inactive,請聯絡支援。
:::

::: details 為何沒有 Web Tracker 數據?
開啟 **DataPulse → Product** 並查看 **Web Tracker** 事件流(Receiving / Errors / Not-yet-seen)。沒有「Receiving」通常表示腳本未觸發或 Tracker ID 有誤。
:::

::: details 為何 S2S 事件沒有流入?
在 DataPulse **Setup Wizard → S2S Postback** 中,確認你已產生 API 金鑰,且你的伺服器正在向 S2S 端點發送資料。初始的 **S2S Status: Pending** 屬正常,直到收到首個事件為止。參見 [API 金鑰](/hk/api/api-key)。
:::
