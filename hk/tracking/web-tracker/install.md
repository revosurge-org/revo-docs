---
title: 安裝 Web 追蹤器
sidebar_label: 安裝 Web 追蹤器
description: 安裝 Web 追蹤器 — 建立產品、添加腳本、配置事件。
---

# 安裝 Web 追蹤器

**對象：** 開發者、追蹤工程師、BI/分析負責人

## 開始前
確保您有：
- 具有產品管理權限的 RevoSurge 帳戶
- 為網站網域建立的產品
- 網站程式碼庫或標籤管理器的存取權限
- 要追蹤的關鍵事件列表(如 Register、FirstTimeDeposit、Deposit)

## 步驟 1 — 建立產品(網域)
1. 前往 **產品管理 → 產品**
2. 點擊 **建立產品**
3. 輸入網站網域(如 `www.example.com`)
4. 儲存

這將建立產品並分配**追蹤器 ID**。

## 步驟 2 — 安裝追蹤器程式碼(示例 / 草稿)
> **示例 / 草稿(可能變更)**  
> 使用產品追蹤設定中提供的追蹤器程式碼片段。

```html
<script src="https://assets.revosurge.com/js/web-tracker.js"></script>
```

## 步驟 3 — 初始化追蹤器(示例 / 草稿)
```js
const tracker = new WebTracker({
  trackerId: "your-tracker-id",
  // env: "prod" | "test" | "dev"
});
```

## 步驟 4 — 發送關鍵事件(示例 / 草稿)
```js
tracker.trackRegister("user_123", { identifier: "hashed_email_or_phone" });

tracker.trackDeposit("user_123", {
  currency: "USDT",
  network: "TRON",
  amount: 100
});
```

## 步驟 5 — 驗證追蹤器與事件狀態
前往追蹤/狀態頁面驗證：
- **追蹤器狀態**
  - Active / In-use：事件正在流入
  - Inactive：近期無數據
- **事件狀態**
  - Live：可作為廣告系列優化目標
  - Inactive / Not ready：數據不足或近期無數據

關鍵事件為 Live 後，您的產品即可用於 AdWave 廣告系列。
