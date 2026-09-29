---
title: 落地頁與轉化路徑
description: 玩家如何由廣告走到充值、每一步要追蹤甚麼，以及如何製作高轉化的落地頁。
prev:
  text: '2. 接入追蹤'
  link: '/hk/tracking/overview'
---

# 落地頁與轉化路徑

**對象：** 正在準備落地頁（玩家點擊廣告後看到的頁面）的廣告主和營銷人員。

廣告負責爭取點擊，落地頁則負責爭取註冊。本頁介紹玩家的轉化路徑、每一步要追蹤甚麼，以及如何做出能帶來轉化的頁面。

<nav class="article-toc" aria-label="本文內容">
<p class="article-toc-title">本文內容</p>

- [1. 轉化路徑](#_1-the-conversion-path)
- [2. 直達頁還是預落地頁？](#_2-direct-page-or-pre-lander)
- [3. 使用預落地頁範本](#_3-use-a-pre-lander-template)
- [4. 落地頁檢查清單](#_4-landing-page-checklist)
- [5. 在 RevoSurge 登記頁面](#_5-register-the-page-in-revosurge)

</nav>

## 1. 轉化路徑 {#_1-the-conversion-path}

典型的 iGaming 轉化路徑有五步。每一步都會有玩家流失，所以每一步都要追蹤，才知道玩家在哪一步離開。

| 步驟 | 發生甚麼 | 追蹤的事件 | 由誰追蹤 |
| --- | --- | --- | --- |
| **1. 廣告** | 玩家看到並點擊你的廣告 | 展示、點擊 | AdWave（自動） |
| **2. 預落地頁**（可選） | 先用一個簡短頁面為玩家「熱身」：獎賞、問答、轉盤 | `page_view`、`lp_*` 事件 | Web 追蹤器 / 範本 |
| **3. 落地頁** | 玩家看到你的註冊頁 | `page_view` | Web 追蹤器 |
| **4. 註冊** | 玩家建立帳戶 | `register` | Web 追蹤器 |
| **5. 充值** | 玩家完成首次充值（FTD） | `deposit` | S2S 或 Partner Postback（建議），或 Web 追蹤器 |

::: tip 目標事件要配合追蹤深度
如果你只追蹤到**註冊**，就把廣告系列的目標事件設為 Register。只有在充值追蹤穩定可靠時，才選 **FTD**。參見 [接入追蹤](/hk/tracking/overview)。
:::

## 2. 直達頁還是預落地頁？ {#_2-direct-page-or-pre-lander}

| 方式 | 如何運作 | 適用情況 |
| --- | --- | --- |
| **直達頁** | 廣告直接帶玩家到你的註冊頁 | 你的註冊頁載入快、適合手機瀏覽，而且已經展示了優惠 |
| **預落地頁** | 廣告先帶玩家到一個簡短頁面，再由該頁面把玩家送到註冊頁 | 你想先講清楚優惠、加入互動，或在不改動主網站的情況下測試不同切入點 |

在 RevoSurge 中，這兩種方式對應不同的 **Funnel Type**：直達的註冊頁用 **Direct Register**，把玩家轉到下一頁的預落地頁用 **Redirect Register**。兩個頁面都要在同一個產品下登記。

## 3. 使用預落地頁範本 {#_3-use-a-pre-lander-template}

RevoSurge 提供七款免費、以手機優先設計的[預落地頁範本](https://www.revosurge.com/resources/landing-page-templates)：

| 範本 | 作用 | 適合 |
| --- | --- | --- |
| **Form** | 請玩家留下手機號碼 | 留下資料的玩家，之後轉化較好 |
| **Bonus** | 醒目地展示獎賞，無需互動 | **新手**：最簡單的範本 |
| **Quiz** | 問 3 條簡短問題 | 引起興趣，了解玩家想要甚麼 |
| **Wheel** | 轉動轉盤揭曉獎品 | 營造「中獎」的感覺 |
| **Scratch** | 刮開卡面揭曉獎品 | 刮的動作比點擊更有參與感；可與 Wheel 做對比測試 |
| **Games** | 安裝前先展示你的遊戲 | App 安裝廣告系列 |
| **Urgency** | 顯示即時倒數 | 促使玩家更快作決定 |

::: tip 第一次用預落地頁？由 Bonus 或 Form 開始
這兩款最輕巧，風險也最低。
:::

**如何使用範本：**

1. 選一款配合你優惠的範本。
2. 編輯範本的 `CONFIG` 區塊：品牌、Logo、主標題、副標題、按鈕文字和法律聲明。**主標題必須與廣告文案一字不差。**
3. 保持頁面輕快：只用一張主圖（WebP），不載入網頁字型，動畫只用 CSS。
4. 設定 `CONFIG.endpoint`，讓範本把 `lp_*` 事件發送給 RevoSurge。<!-- TODO: document the collector endpoint value and how lp_* events show in DataPulse -->
5. 把檔案放到你的網域上，並把按鈕連結到真正的註冊頁。

## 4. 落地頁檢查清單 {#_4-landing-page-checklist}

上線前，用手機檢查玩家會到達的每一個頁面：

- ✅ **快：** 在流動網絡下 2 秒內載入完成（首屏少於 150 KB）
- ✅ **與廣告一致：** 同樣的優惠、同樣的字眼、同樣的語言。頁面與廣告哪怕只有些微不同，玩家不到一秒就會離開
- ✅ **一個清晰的操作：** 只有一個按鈕（註冊或領取），無需捲動就能看到
- ✅ **表格簡短：** 只收集建立帳戶所需的資料
- ✅ **法律聲明：** 按各市場要求展示年齡限制（例如 18+）、負責任博彩提示和條款連結
- ✅ **已追蹤：** 已安裝 Web 追蹤器，網域亦已在你的產品下登記

## 5. 在 RevoSurge 登記頁面 {#_5-register-the-page-in-revosurge}

1. 前往 **Product → Manage Product**，打開你的產品。
2. 加入每個落地頁 URL 和預落地頁網域，並選好對應的 **Funnel Type**。
3. 確認每個頁面都已安裝 Web 追蹤器，而且事件有出現在 **Event Stream** 中。

::: warning 未登記的頁面無法投放
廣告系列的 Destination URL 必須屬於該產品下已登記並啟用的網域。請在建立廣告系列之前，先加入預落地頁、鏡像網站和轉址網域。
:::

**下一步：** [素材](./creatives)
