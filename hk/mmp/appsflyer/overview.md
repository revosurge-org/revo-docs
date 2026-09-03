---
title: AppsFlyer 整合概述
sidebar_label: 概述
description: RevoSurge 與 AppsFlyer 的整合方式 — 啟用合作夥伴並發送 postback，再由 RevoSurge 透過到達頁的 web tracker 轉發點擊。由此開始，找到你需要看的頁面。
---

# AppsFlyer 整合概述

**對象：** UA 經理、廣告主、代理商、追蹤／BI 工程師

用 AppsFlyer 衡量 RevoSurge 廣告分兩半：**從 AppsFlyer 發出的 postback**，讓我們收到你的安裝與應用內事件；以及**轉發進 AppsFlyer 的點擊**，讓 AppsFlyer 知道哪些點擊是我們的。兩半缺一不可。

> [!IMPORTANT]
> **你不需要為 RevoSurge 產生 AppsFlyer 追蹤連結。** 既不用在 AppsFlyer 裡產生連結，也不用把任何 URL 貼到 RevoSurge。RevoSurge 會替你轉發點擊，依據的是你在到達頁安裝 web tracker 時填入的 AppsFlyer App ID。如果你的團隊整合過其他 DSP，這一步就是差異所在。

RevoSurge 同時是 **非 SRN** 合作夥伴（並非自歸因渠道／self-reporting network）：AppsFlyer 不會主動向我們拉取廣告數據，因此你開啟的 postback 是轉換到達 RevoSurge 的唯一途徑。

## 我該看哪一頁？

| 我的角色 | 廣告類型 | 依此順序閱讀 |
|---|---|---|
| 廣告主 | 任意 | [設定 postback](/hk/mmp/appsflyer/postbacks) → [點擊轉發](/hk/mmp/appsflyer/click-forwarding) → [交付與上線](/hk/mmp/appsflyer/handoff) |
| 廣告主 | iOS | 同樣這兩頁 — 同時關閉 Advanced Privacy。RevoSurge 不使用 SKAN |
| 代理商 | 任意 | 本頁 + [合作夥伴權限](/hk/mmp/appsflyer/permissions)，然後是同樣這兩頁 |
| 追蹤／BI 工程師 | 任意 | [宏參數](/hk/mmp/appsflyer/macros) — 我們發送了什麼，以及如何對帳兩邊看板 |
| 任何人 | 設定完成後 | [整合驗證](/hk/mmp/appsflyer/validation) → [交付與上線](/hk/mmp/appsflyer/handoff) |

用戶獲取與再行銷走的是同樣這兩頁。點擊路徑在兩者之間沒有差別，因此不存在「UA 設定」與「再行銷設定」兩套需要你選擇。Deep link 是例外 — 見[本章節不涵蓋的內容](#本章節不涵蓋的內容)。

代理商請注意：[合作夥伴權限](/hk/mmp/appsflyer/permissions)是要發給客戶的那一頁，因為只有 App 所有者能授予權限。

## 各項設定分別在哪裡做

請把兩個後台分開處理。本章節不會要你在同一個步驟中來回切換兩個後台。

| 在 AppsFlyer 中 | 在 RevoSurge 中 |
|---|---|
| 開啟機率性歸因（應用層級） | 在到達頁安裝 web tracker |
| 啟用 RevoSurge 合作夥伴 tile | 為你推廣的每個平台填入 AppsFlyer App ID |
| 關閉 Advanced Privacy（iOS） | 在 AdWave 的產品上選擇 AppsFlyer 作為 MMP 來源 |
| 設定歸因回溯窗口 | 確認 postback 將攜帶的合作夥伴事件名 |
| 開啟預設 postback（安裝、再行銷） | 檢查安裝與事件是否已到達 |
| 開啟應用內事件 postback 並對應你的漏斗事件 | — |

## 必要設定一覽

以下是**要求**，不是建議。其中多數出於同一個原因：我們的最佳化模型需要自然量與未歸因事件，而不只是歸因給 RevoSurge 的事件。各設定頁會連同具體點擊路徑逐項重複說明。

### 在 AppsFlyer 中

| 設定項 | 必要值 | 原因 |
|---|---|---|
| 機率性歸因（App Settings） | **ON** | RevoSurge 的點擊來自瀏覽器，而瀏覽器無法提供確定性配對所需的裝置 ID |
| Activate partner（啟用合作夥伴） | 只要廣告在跑就保持 **ON** | 關閉即沒有歸因、沒有 postback |
| Advanced Privacy / Aggregated Advanced Privacy（iOS） | **OFF** | 開啟會從 postback 中移除裝置 ID 與點擊 ID |
| 點擊歸因回溯期 | **7 天** | 與你其他渠道保持一致 |
| 瀏覽歸因回溯期 | **24 小時** | 與你其他渠道保持一致 |
| Install view-through attribution | **ON** | 屬於標準設定 — 見下方說明 |
| 預設 postback（安裝、再行銷） | **所有媒體渠道，包含自然量** | 模型需要歸因、未歸因與自然量事件一起訓練 |
| 應用內事件 postback | **ON** | 安裝後訊號是最佳化目標 |
| 應用內 postback 窗口 | **Lifetime（終身）**，下限 6 個月 | 窗口過短會截斷我們可學習的事件 |
| 應用內發送範圍 | **所有媒體渠道，包含自然量** | 同預設 postback |
| 收入 | 在 purchase／deposit／revenue 類事件上選擇 **Values & revenue** | ROAS 必需 |

> [!NOTE]
> RevoSurge **只轉發點擊** — 展示不會發送給 AppsFlyer，RevoSurge 的歸因是基於點擊的。因此上表中兩行瀏覽歸因相關設定不會影響你目前的 RevoSurge 流量；把它們放進必要項，是為了之後不必再回來動這個 tile。

### 在 RevoSurge 中

| 設定項 | 必要值 |
|---|---|
| 到達頁上的 web tracker | 已安裝，且產品顯示 **Active** |
| `androidAppsFlyerId` / `iOSAppsFlyerId` | 你推廣的每個平台對應的 AppsFlyer App ID |
| AdWave 中產品的 MMP 來源 | **AppsFlyer** |

## 開始之前

請向你的 RevoSurge 對接人索取以下資訊。它們按帳戶簽發，因此不要憑 Partner Marketplace 中名稱相似的 tile 猜測。

- 在 AppsFlyer Partner Marketplace 搜尋時使用的**準確的 RevoSurge 合作夥伴 tile 名稱**。
- RevoSurge 接受的**合作夥伴事件名**，以便把你的 AppsFlyer 事件名精確對應過去。

另外，從你自己的 AppsFlyer 帳戶中準備好：

- 你推廣的每個平台的 **AppsFlyer App ID**，在 AppsFlyer 後台該應用的設定中查看。

## 三個容易混淆的 ID

本次整合涉及三個識別碼。把其中一個填到另一個的位置，是整合「靜默失效」最常見的原因：頁面能載入、點擊能記錄，但什麼都收不到。

| ID | 它識別什麼 | 從哪裡取得 | 填到哪裡 |
|---|---|---|---|
| **AppsFlyer App ID** | 你的應用，在 AppsFlyer 內部 | AppsFlyer 後台，應用設定 | 你到達頁的 web tracker（`androidAppsFlyerId` / `iOSAppsFlyerId`） |
| **RevoSurge Tracker ID** | 你的產品，在 RevoSurge 內部 | RevoSurge，建立產品時取得 | 你到達頁的 web tracker（`trackerId`） |
| **`pid`**（AppsFlyer 媒體渠道 ID） | RevoSurge，作為媒體渠道 | 由 RevoSurge 在轉發的點擊上設定 | 無需設定 — 你會在 AppsFlyer 報表中看到它 |

## 本章節不涵蓋的內容

- **從你自己的伺服器發送事件。** 那是[伺服器事件 API (v3)](/hk/tracking/s2s/v3/server-events-api)，與你使用哪個 MMP 無關。
- **聯盟後台 postback。** 由[合作夥伴 Postback API](/hk/tracking/postback/partner-postback) 涵蓋。
- **再行銷的 deep link。** 本章節各頁能讓再行銷廣告被正確衡量，但不涉及進入 App 的 deep link 路由。上線此類廣告前請先聯繫你的客戶經理。

## 下一步

請從[設定 postback](/hk/mmp/appsflyer/postbacks) 開始 — 在 postback 開啟之前，無論其他設定如何，RevoSurge 都收不到任何數據。然後是[點擊轉發](/hk/mmp/appsflyer/click-forwarding)。

如果你剛開始接觸 RevoSurge 的衡量體系，建議先看[追蹤概述](/hk/tracking/overview)，再回到本頁。
