---
title: 將點擊轉發至 AppsFlyer
sidebar_label: 點擊轉發
description: RevoSurge 會替你把點擊註冊到 AppsFlyer。在到達頁安裝 web tracker 並填入 AppsFlyer App ID，然後在 AdWave 的產品上選擇 AppsFlyer 作為 MMP 來源。
---

# 將點擊轉發至 AppsFlyer

**對象：** UA 經理、廣告主、負責到達頁整合的前端開發

Postback 負責把轉換**回傳**給 RevoSurge。本頁負責另一個方向：告訴 AppsFlyer 哪些點擊是我們帶來的，讓隨後的安裝能歸因給 RevoSurge。

> [!IMPORTANT]
> **你不需要為 RevoSurge 產生 AppsFlyer 追蹤連結。** 既不用在 AppsFlyer 裡產生連結，也不用把任何 URL 貼到 RevoSurge。RevoSurge 會自動把點擊轉發給 AppsFlyer，依據的是你在到達頁安裝 web tracker 時填入的 AppsFlyer App ID。如果你的團隊整合過其他 DSP，這一步就是差異所在。

## 運作原理

```
用戶點擊 RevoSurge 廣告
        ↓
你的到達頁載入
        ↓
Web tracker 觸發，攜帶你的 AppsFlyer App ID
        ↓
RevoSurge 將點擊轉發至 AppsFlyer
        ↓
AppsFlyer 把隨後的安裝歸因給 RevoSurge
```

有兩個後果值得多看一遍：

- **到達頁是承重環節。** 點擊是透過該頁上的 web tracker 到達 AppsFlyer 的。任何沒有跑 tracker 的流量路徑 — 直接跳應用商店頁、跳過到達頁的重新導向、tracker 載入失敗的頁面 — 都不會產生轉發的點擊，隨後的安裝會落成自然量或被歸因給別人。
- **只轉發點擊。** RevoSurge 目前不向 AppsFlyer 轉發展示（impression）。RevoSurge 流量的歸因是基於點擊的。

## 你需要做三件事

每個產品各做一次。

### 1. 在到達頁安裝 web tracker

依[安裝 Web 追蹤器](/hk/tracking/web-tracker/install)操作。你的產品必須達到 **Active（已啟用）** 狀態 — 產品在其 tracker 收到第一個事件之前一直是 Inactive，而未啟用的產品無法在 AdWave 建廣告系列的流程中被選擇。

### 2. 在 tracker 中填入 AppsFlyer App ID {#set-app-id}

在 tracker 的初始化選項裡，為你要推廣的每個平台傳入 AppsFlyer App ID：

```js
const tracker = new WebTracker({
  trackerId: "your-product's-tracker-id",

  // AppsFlyer 點擊轉發必需 — 按你推廣的平台填寫。
  androidAppsFlyerId: "your-android-app-id-in-appsflyer",
  iOSAppsFlyerId: "your-ios-app-id-in-appsflyer"
});
```

| 欄位 | 什麼時候要填 |
|---|---|
| `androidAppsFlyerId` | 你推廣 Android 應用 |
| `iOSAppsFlyerId` | 你推廣 iOS 應用 |

兩者互相獨立 — 填你實際在跑的平台，另一個省略即可。請使用 AppsFlyer 後台該應用設定中顯示的 App ID 原樣填寫；欄位細節見[安裝頁的初始化選項](/hk/tracking/web-tracker/install#step-3-initialise-the-tracker)。

> [!WARNING]
> 不填 App ID，web tracker 依然運作，你的 RevoSurge 事件也照舊到達 — 但不會有任何東西轉發給 AppsFlyer，AppsFlyer 永遠不知道這次點擊發生過。這個故障在兩個看板上都是靜默的：RevoSurge 有點擊，AppsFlyer 把安裝記成自然量。如果你的安裝量在 RevoSurge 看起來正常、在 AppsFlyer 卻沒有，先查這個欄位。

### 3. 在 AdWave 中選擇 AppsFlyer 作為 MMP 來源

在 RevoSurge 中打開 AdWave 裡的**產品**，把 **MMP 來源**設為 **AppsFlyer**。

這是**產品層級**的設定 — 每個產品設一次，不是每條廣告系列都設。它告訴 RevoSurge 該把點擊轉發給哪個 MMP。不設定、或設成別的 MMP，到達頁上的 App ID 就永遠不會被用到。

## 驗證

上線之前，請端到端驗證整條鏈路，而不是逐個環節分開看：

1. 打開你的到達頁，確認 tracker 已觸發（**Manage Product** 中該產品顯示 **Active**）。
2. 確認該產品的 MMP 來源顯示為 **AppsFlyer**。
3. 點擊一條線上或測試的 RevoSurge 廣告，進入到達頁，然後安裝 App。
4. 確認這次安裝在 AppsFlyer 中歸因到 RevoSurge 媒體渠道 — 而不是自然量。
5. 確認安裝 postback 已到達 RevoSurge。

第 3–5 步才是真正的測試。第 1–2 步只能證明設定存在。

## 從其他 DSP 遷過來？

如果你的團隊整合過 Moloco、Remerge、Kayzen 之類的平台，以下這些步驟在 RevoSurge **不適用**：

| 在別處 | 在 RevoSurge |
|---|---|
| UA 產生單平台連結，再行銷產生 OneLink | 無連結可產生 — 同一套機制涵蓋兩者 |
| 把追蹤連結宏對應到 DSP 的參數 | 無需對應；點擊由 RevoSurge 建構 — 具體內容見[宏參數](/hk/mmp/appsflyer/macros) |
| 把點擊與展示 URL 複製進 DSP | 無需複製 |
| 改動廣告系列後重新註冊連結 | 無需重新註冊；產品層級設定一直有效 |

你仍然需要在 AppsFlyer 側完成合作夥伴設定本身 — 見[設定 postback](/hk/mmp/appsflyer/postbacks)，回溯窗口也在那一頁。

## 下一步

- 需要知道我們在點擊上具體發送了什麼，或者要把 AppsFlyer 與 RevoSurge 看板對帳？見[宏參數](/hk/mmp/appsflyer/macros)。
- AppsFlyer 後台還沒弄完？[設定 postback](/hk/mmp/appsflyer/postbacks) 是整合的另一半，只做一半整合不會運作。
- 兩半都做完了？先[整合驗證](/hk/mmp/appsflyer/validation)，再[交付與上線](/hk/mmp/appsflyer/handoff)。
- 要在 iOS 上線？沒有額外步驟 — RevoSurge 不使用 SKAN，iOS 與 Android 走的是同樣這兩頁。
- 再行銷廣告與 deep link 不在以上步驟的涵蓋範圍內。上線此類廣告前請先聯繫你的 RevoSurge 客戶經理。
