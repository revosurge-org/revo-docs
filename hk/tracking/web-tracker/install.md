---
title: 安裝 Web 追蹤器
sidebar_label: 安裝 Web 追蹤器
description: 安裝 RevoSurge Web 追蹤器——添加腳本、初始化、發送關鍵事件，並驗證其在 AdWave 中變為 Live。
---

# 安裝 Web 追蹤器

**對象：** 開發者、追蹤工程師、BI／分析負責人
**安裝時長：** 約 15 分鐘

Web 追蹤器是一個輕量級 JavaScript SDK，將用戶事件從你的網站即時傳輸到 RevoSurge。關鍵事件一旦變為 **Live**，即可作為 AdWave 廣告系列的優化目標，並驅動 Source Intelligence、LTV、ROAS 與流失模型。

::: tip 摘要（TL;DR）
1. 將[腳本](#step-2-add-the-tracker-script)添加到 `<head>`。
2. 用你的追蹤器 ID 在 `test` 模式下[初始化](#step-3-initialize-the-tracker) `WebTracker`。
3. 在註冊、充值等關鍵動作上[觸發事件](#step-4-send-key-events)。
4. [驗證](#step-5-verify-then-go-live)其顯示為 **Live**，再切換到 `prod`。
:::

## 開始前

確保你已具備：

- 具有**產品管理**權限的 RevoSurge 帳戶
- 為你的網站網域建立的**產品**（這會分配你的追蹤器 ID）
- 網站程式碼庫或標籤管理器的存取權限
- 要追蹤的關鍵事件列表（如 `register`、`deposit`、`withdraw`）

::: info 還沒有追蹤器 ID？
請先建立——參見[步驟 1](#step-1-create-a-product-domain)。你的追蹤器 ID 形如
`TRA-AWP-20251208-051428-001-6734`，顯示在產品的追蹤設定中。
:::

## 步驟 1: 建立產品（網域） {#step-1-create-a-product-domain}

1. 前往 **產品 → 管理產品**。
2. 建立你的產品（輸入網站網域，如 `www.example.com`）。

這會建立產品並分配一個**追蹤器 ID**。你將在步驟 3 把該 ID 貼進程式碼片段，或從 **產品 → 安裝 Web 追蹤器** 複製已預填的程式碼片段。

## 步驟 2: 添加追蹤器腳本 {#step-2-add-the-tracker-script}

將以下程式碼添加到你要追蹤的**每個頁面**的 `<head>` 中，盡量靠前，使其在用戶動作發生前先載入。

```html
<script src="https://assets.revosurge.com/js/web-tracker.js"></script>
```

::: details 使用 Google Tag Manager？
添加一個包含上述程式碼的 **Custom HTML** 標籤，設定為在 **All Pages** 觸發，並將標籤優先級設高，使追蹤器在你的事件標籤運行前就緒。
:::

## 步驟 3: 初始化追蹤器 {#step-3-initialize-the-tracker}

在腳本載入後初始化一次。將追蹤器 ID 替換為你自己的。

```js
const tracker = new WebTracker({
  trackerId: "your-product's-tracker-id",
  env: "test" // "prod" | "test" | "dev"
});
```

整合期間先用 `test`——測試流量會被校驗並顯示在你的儀表板中，但不計入廣告系列優化。僅在事件於[步驟 5](#step-5-verify-then-go-live)驗證通過後再切換到 `prod`。

| `env`  | 何時使用                 | 是否計入優化？ |
| ------ | ------------------------ | -------------- |
| `prod` | 線上生產流量             | 是             |
| `test` | 整合期間的預發佈 / QA    | 否             |
| `dev`  | 本地開發                 | 否             |

## 步驟 4: 發送關鍵事件 {#step-4-send-key-events}

在相應用戶動作發生時呼叫對應的追蹤方法。將**穩定的用戶 ID**作為第一個參數傳入，使事件能長期關聯到同一個人。

```js
// 建立新帳戶
tracker.trackRegister("user_123", {
  identifier: "hashed_email_or_phone"
});

// 充值完成
tracker.trackDeposit("user_123", {
  currency: "USDT",
  network: "TRON",
  amount: 100
});
```

SDK 為目錄中的每個事件提供了帶類型的輔助方法（register、login、deposit、withdraw 等）。完整的方法與欄位列表參見 [Web 追蹤器 SDK 參考](/hk/tracking/web-tracker/reference)。

::: warning 切勿發送原始 PII
將 `identifier` 作為用戶電郵或電話的 **SHA-256 雜湊**傳入——請在你側先雜湊再呼叫追蹤器。不要發送原始電郵、電話號碼或姓名。
:::

::: tip 如何選擇用戶 ID
使用你內部使用的同一 ID（如你的帳戶／用戶主鍵）。在 Web 追蹤器與 [伺服器事件（S2S）](/hk/tracking/s2s/overview) 之間保持一致的 ID，能讓 RevoSurge 將網頁與伺服器活動拼接為同一份用戶畫像。
:::

## 步驟 5: 驗證，然後上線 {#step-5-verify-then-go-live}

打開 **追蹤 → 狀態**，等待事件到達（通常在一分鐘內）。

**追蹤器狀態**

| 狀態                | 含義             |
| ------------------- | ---------------- |
| Active / In-use     | 事件正在流入     |
| Inactive            | 近期無數據       |

**事件狀態**

| 狀態                 | 含義                       |
| -------------------- | -------------------------- |
| Live                 | 可作為廣告系列優化目標     |
| Inactive / Not ready | 數據不足或近期無事件       |

當關鍵事件顯示為 **Live** 時：

1. 在初始化中將 `env` 改為 `"prod"`。
2. 重新部署。
3. 你的產品即可用於 [AdWave 廣告系列](/hk/adwave/guided-campaign-setup)。

## 你的事件能解鎖什麼

你發送的事件決定了哪些 RevoSurge 功能可用：

| 你發送的事件                     | 解鎖                                       |
| -------------------------------- | ------------------------------------------ |
| `register`、`login`              | Source Intelligence · 註冊→FTD 漏斗        |
| `deposit`、`withdraw`、`bet`     | 真實 LTV · ROAS · 預測 LTV／流失 · Bonus Engine |

覆蓋的事件目錄越全，定向與優化就越精準。

## 疑難排查

::: details 事件沒有出現
- 確認腳本標籤位於 `<head>` 中且已載入（在 Network 面板查找 `web-tracker.js`）。
- 確保 `new WebTracker({...})` 在腳本載入**之後**運行。
- 確認 `trackerId` 與產品設定中的完全一致。
- 記住 `test` 事件不會出現在生產／優化視圖中——請查看測試視圖。
:::

::: details 事件顯示為 「Not ready」 ／ 始終不變為 Live
事件需要足夠的近期量級才會被標記為 **Live**。發送真實（或擬真的測試）流量並給它時間累積。稀疏或一次性事件會保持未啟用。
:::

::: details 能否從伺服器而非瀏覽器進行追蹤？
可以。對於後端生成的事件（伺服器端確認的支付、KYC、紅利），請使用 [伺服器事件 API（S2S）](/hk/tracking/s2s/overview) 替代 Web 追蹤器——或與其並用。
:::

## 後續步驟

- [Web 追蹤器 SDK 參考](/hk/tracking/web-tracker/reference) — 每個方法與欄位
- [伺服器事件 API（S2S）](/hk/tracking/s2s/overview) — 從後端發送事件
- [引導式廣告系列設定](/hk/adwave/guided-campaign-setup) — 上線你的第一個 AdWave 廣告系列
