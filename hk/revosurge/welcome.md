---
title: 歡迎使用 RevoSurge
description: RevoSurge 是甚麼、各產品的文檔在哪裡，以及一個帳戶如何在各產品間通用。
---

# 歡迎使用 RevoSurge

**對象：** 所有初次接觸 RevoSurge 的人，包括廣告主、媒體採購、分析師、開發者和發布商。

<nav class="article-toc" aria-label="本文內容">
<p class="article-toc-title">本文內容</p>

- [1. RevoSurge 是甚麼](#_1-what-is-revosurge)
- [2. 文檔導覽](#_2-where-to-find-the-docs)
- [3. 一個帳戶，所有產品通用](#_3-one-account-shared-across-products)

</nav>

::: info 新廣告主？
直接前往 [新手投放手冊](/hk/handbook/)，手冊會一步步帶你由註冊走到廣告系列上線。
:::

## 1. RevoSurge 是甚麼 {#_1-what-is-revosurge}

RevoSurge（RS）是為效果營銷人員而設的廣告平台，對 iGaming 的支援尤其深入。平台由三款產品組成，連接廣告市場的買賣兩端：

| 產品 | 對象 | 作用 |
| --- | --- | --- |
| **AdWave** | 廣告主 | **買量。** 在大量網站和 App 上投放廣告系列。AdWave 會為每一次廣告展示實時出價，並從你的轉化數據中學習，找出更多與你最優質玩家相似的人 |
| **DataPulse** | 廣告主 | **衡量成效。** 用你自己的第一方數據，追蹤玩家點擊之後的每一步，由註冊、充值到玩家價值，再把這些轉化回傳給 AdWave |
| **AdFlow** | 發布商 | **流量變現。** 只需一段腳本 `adflow.js`，就能在網站上展示廣告，支援橫幅、彈出式（pop-under）、推送、頁內推送和原生等格式 |

AdWave 和 DataPulse 配合使用：DataPulse 負責衡量轉化，AdWave 據此優化投放。AdFlow 則帶來發布商的廣告庫存，供 AdWave 廣告系列購買。

## 2. 文檔導覽 {#_2-where-to-find-the-docs}

| 產品 | 作用 | 使用者 | 由這裡開始 |
| --- | --- | --- | --- |
| **AdWave** | 建立、投放和優化廣告系列 | 廣告主、媒體採購 | [新手投放手冊](/hk/handbook/) · [廣告系列設定](/hk/adwave/campaign-setup) |
| **DataPulse** | 為每個產品設定追蹤，並分析註冊、充值、同期群（cohort）和玩家價值等成效 | 廣告主、分析師 | [追蹤 → 概述](/hk/tracking/overview) |
| **追蹤** | 透過 Web 追蹤器（瀏覽器端）、S2S（你的後端）、Partner Postback（聯盟平台）或 AppsFlyer（App），把轉化發送給 RevoSurge | 開發者 | [手冊 → 接入追蹤](/hk/tracking/overview) |
| **受眾** | 建立玩家分群，用於定向和再行銷 | 廣告主 | [受眾 → 受眾細分](/hk/audience/segments) |
| **AdFlow** | JavaScript SDK（`adflow.js`），讓發布商在自己的網站上展示 RevoSurge 廣告，並為每種廣告格式提供除錯工具 | 發布商、發布商開發者 | [AdFlow → 接入指南](/hk/adflow/integration-guide) |
| **Supply** | 透過伺服器對伺服器競價，接入向 RevoSurge 出售廣告庫存的 SSP（供應方平台） | SSP、廣告網絡 | [Supply → 概述](/hk/supply/overview) |
| **API** | 在你自己的系統中管理廣告系列、報表和受眾 | 開發者 | [API → 快速入門](/hk/api/quickstart) |

## 3. 一個帳戶，所有產品通用 {#_3-one-account-shared-across-products}

只需**一個 RevoSurge 帳戶**就能使用所有產品，AdWave 和 DataPulse 共用這個帳戶。

| 共用內容 | 說明 |
| --- | --- |
| **登入** | 每個帳戶只有一個登入電郵，[AdWave](https://adwave.revosurge.com) 和 [DataPulse](https://datapulse.revosurge.com) 都用它登入。暫時未能新增團隊成員，如有多人需要使用，請用共用的工作電郵 |
| **錢包** | 所有廣告系列和服務共用一個餘額，充值由你的客戶經理處理 |
| **產品** | 產品（Product）只需在其中一個工具建立一次，兩邊都會顯示 |
| **追蹤與數據** | 發送到產品的事件，會同時用於 AdWave 的投放優化和 DataPulse 的報表 |

**下一步：** [新手投放手冊](/hk/handbook/)
