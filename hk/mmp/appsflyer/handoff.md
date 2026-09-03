---
title: 交付與上線
sidebar_label: 交付與上線
description: 收尾 AppsFlyer 整合的檢查清單 — 要交給 RevoSurge 客戶經理什麼、端到端上線測試、按症狀定位規則，以及哪些改動需要重新驗證。
---

# 交付與上線

**對象：** UA 經理、廣告主、把客戶整合交付回去的代理商

這是檢查清單，不是操作指南。兩半設定各有專頁 — [設定 postback](/hk/mmp/appsflyer/postbacks) 與[點擊轉發](/hk/mmp/appsflyer/click-forwarding)。本頁負責收尾：交付什麼、如何用真實流量證明它可用，以及日後什麼會靜默地把它弄壞。

## 交付之前

- [ ] [整合驗證](/hk/mmp/appsflyer/validation#必要規則)中每一條必要規則都通過（[AF-R-01](/hk/mmp/appsflyer/validation#af-r-01) — [AF-R-11](/hk/mmp/appsflyer/validation#af-r-11)）
- [ ] 建議規則也通過，或者每一條未通過的都有明確理由
- [ ] **每個 App** 分別完成 — Android 與 iOS 是獨立設定的
- [ ] web tracker 的 `env` 已設為 **`prod`**。`test` 與 `dev` 的流量會被驗證、也能看到，但**不計入最佳化** — 把 `env` 留在 `test` 上線，看起來一切正常，實際上最佳化沒有任何依據
- [ ] 你的應用內事件已在生產環境上線，而不只是在測試環境

## 要交給客戶經理什麼

| 交付物 | 我們為什麼需要它 | 可以省略的條件 |
|---|---|---|
| AppsFlyer **Integration** 與 **Permissions** 標籤頁的截圖 | 確認 tile 與必要設定一致 | 你已授予 [AF-O-05](/hk/mmp/appsflyer/validation#af-o-05) 與 [AF-O-06](/hk/mmp/appsflyer/validation#af-o-06) — 那樣我們直接讀 tile，不需要截圖 |
| 你的**事件對應表** — 每個 AppsFlyer 事件名，以及它對應到的 RevoSurge 合作夥伴事件名 | 本次整合中風險最高的靜默故障。不匹配會讓 postback 被投遞後因無法識別而丟棄，看起來與「零轉換」完全一樣 | 永不省略。即使我們擁有全部權限，也請發這一項 |
| 承載 web tracker 的**到達頁 URL** | 我們從自己這一側看不到你的 tracker 初始化程式碼 | 永不省略 |
| 你推廣的**平台** — Android、iOS，還是兩者 | 決定哪些 App ID 是必需的，以及 Advanced Privacy 是否適用 | 永不省略 |
| 你在 tracker 中填寫的 **AppsFlyer App ID** | 讓我們確認你初始化程式碼裡的值與你預期安裝落到的那個應用一致 | 永不省略 |

事件對應表請以文字形式發送，不要截圖 — 我們會逐字元與我們接受的名稱比對，大小寫完全影響結果。

## 上線測試

設定檢查只能證明設定正確。只有真實流量能證明它可用。

1. 點擊一條線上的 RevoSurge 廣告 — 或由客戶經理為你建的測試廣告系列。
2. 進入承載 web tracker 的到達頁。
3. 從應用商店安裝 App。
4. 打開 App。
5. 觸發一個已對應的漏斗事件 — 通常註冊最快。

應當發生的事：

| 步驟 | 預期結果 | 在哪裡查看 |
|---|---|---|
| 點擊 | 點擊已記錄 | RevoSurge 看板 |
| 點擊 | 點擊已註冊到你的應用上 | AppsFlyer，在 RevoSurge 媒體渠道下 |
| 安裝 | 歸因給 RevoSurge — **而不是**自然量 | AppsFlyer |
| 安裝 | 已收到安裝 postback | RevoSurge 看板 |
| 漏斗事件 | 已收到應用內事件 postback，且是正確的 RevoSurge 合作夥伴事件名 | RevoSurge 看板 |
| 收入類事件（若有） | 帶有金額，而不只是事件本身 | RevoSurge 看板 |

AppsFlyer 是隨事件發生即時發送 postback 的，因此設定正確的安裝 postback 會在幾分鐘內到達。如果過了一小時仍然什麼都沒有，請按故障處理而不是按延遲處理，從下方的定位表開始。

**整合自證的時限：** 交付後 **2 天**內至少一條安裝 postback，**7 天**內第一條應用內事件 postback。兩者都沒產生的整合不算上線，無論設定看起來多正確。

## 測試失敗怎麼辦

從症狀入手，不要從設定的第一項開始翻。

| 症狀 | 從這裡查 |
|---|---|
| RevoSurge 有點擊；AppsFlyer 把安裝記成自然量 | [AF-R-10](/hk/mmp/appsflyer/validation#af-r-10)、[AF-R-11](/hk/mmp/appsflyer/validation#af-r-11)、[AF-R-09](/hk/mmp/appsflyer/validation#af-r-09) |
| AppsFlyer 把安裝歸因給了 RevoSurge；RevoSurge 什麼都沒收到 | [AF-R-05](/hk/mmp/appsflyer/validation#af-r-05)、[AF-R-01](/hk/mmp/appsflyer/validation#af-r-01) |
| 安裝 postback 到了；應用內事件始終不到 | [AF-R-06](/hk/mmp/appsflyer/validation#af-r-06)、[AF-R-07](/hk/mmp/appsflyer/validation#af-r-07) |
| 事件到了，但不帶收入 | [AF-R-08](/hk/mmp/appsflyer/validation#af-r-08) |
| 同等花費下 iOS 安裝量遠低於 Android | [AF-R-02](/hk/mmp/appsflyer/validation#af-r-02)、[AF-R-03](/hk/mmp/appsflyer/validation#af-r-03) |
| 數據都到了，但沒有任何一條計入最佳化 | tracker 的 `env` 不是 `prod` |
| 兩邊看板量級不同，但都有數據 | 一定範圍內屬正常 — 見[AppsFlyer 與 RevoSurge 對帳](/hk/mmp/appsflyer/macros#appsflyer-與-revosurge-對帳) |

## 上線之後：哪些改動需要重新驗證

本整合沒有需要重新註冊的連結，因此設定漂移時不會有任何顯性報錯。以下改動會靜默地把它弄壞 — 每次改動後請重跑對應規則。

| 改動 | 會壞在哪裡 | 重跑 |
|---|---|---|
| 重新命名某個應用內事件，或新增漏斗事件 | 新增或改名的事件以我們不認識的名字到達，被丟棄 | [AF-R-07](/hk/mmp/appsflyer/validation#af-r-07) |
| 替換或重做到達頁 | tracker 或其中的 App ID 可能沒能保留下來 | [AF-R-09](/hk/mmp/appsflyer/validation#af-r-09)、[AF-R-10](/hk/mmp/appsflyer/validation#af-r-10) |
| 新增平台 — 例如在只有 Android 的設定上開 iOS | 新平台沒有 App ID，且 Advanced Privacy 開始適用 | [AF-R-03](/hk/mmp/appsflyer/validation#af-r-03)、[AF-R-10](/hk/mmp/appsflyer/validation#af-r-10) |
| 新增一個 App | 什麼都不會繼承 — tile、postback、權限全部按 App 獨立 | 全部必要規則 |
| 有人把 Advanced Privacy 又打開了 | postback 失去裝置 ID 與點擊 ID | [AF-R-03](/hk/mmp/appsflyer/validation#af-r-03) |
| 改動歸因回溯窗口 | 歸因量發生變化，兩邊看板差異進一步擴大 | [AF-R-04](/hk/mmp/appsflyer/validation#af-r-04) |
| 在 AdWave 中切換該產品的 MMP | 點擊不再到達 AppsFlyer | [AF-R-11](/hk/mmp/appsflyer/validation#af-r-11) |
| 廣告系列暫停期間順手停用合作夥伴 | 那是斷連，不是暫停 — 歸因與 postback 都會停止 | [AF-R-01](/hk/mmp/appsflyer/validation#af-r-01) |
| AppsFlyer 帳戶負責人變更 | 授予 RevoSurge 的權限可能隨前任的存取權一起被撤銷 | [AF-O-05](/hk/mmp/appsflyer/validation#af-o-05) — [AF-O-08](/hk/mmp/appsflyer/validation#af-o-08) |

> [!TIP]
> 請把 RevoSurge 一側那兩項 — 到達頁上的 tracker、以及 AppsFlyer App ID — 加進你團隊發佈網站前本來就在跑的檢查清單。它們活在你的程式碼庫裡，因此最容易在一次與廣告毫無關係的部署中丟掉。

## 代理商

- 請把[合作夥伴權限](/hk/mmp/appsflyer/permissions)這一頁發給客戶。只有 App 所有者能在 tile 上授予權限，你無法給自己授權。
- 你交付回客戶的內容，就是本頁的交付物清單加上上線測試結果。
- RevoSurge 流量不帶 `af_prt`，因此 AppsFlyer 的代理商維度會是空的 — 請從廣告主的 AppsFlyer 帳戶或從 RevoSurge 出 RevoSurge 的成效報表，並且在上線前就把這個預期講清楚，而不要等到第一個報表週期。
