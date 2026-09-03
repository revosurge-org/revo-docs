---
title: 合作夥伴權限
sidebar_label: 合作夥伴權限
description: 應授予 RevoSurge 哪些 AppsFlyer 廣告渠道權限，分為運行所需的最小集與建議用於最佳化的完整集 — 逐項列出開關名稱，而不是截圖。
---

# 合作夥伴權限

**對象：** AppsFlyer 帳戶管理員、代客戶營運 RevoSurge 的代理商

權限決定 RevoSurge 在你的 AppsFlyer 帳戶中**能看到什麼、能設定什麼**。它們在與 postback 相同的 RevoSurge tile 上授予，按 App 分別設定。

> [!IMPORTANT]
> 無論這裡授予什麼，postback 都照常傳輸。權限不會開啟或關閉整合 — 它決定的是 RevoSurge 能否直接**核對並修正**你的設定，還是每一次修正都要以說明和截圖的形式繞回你這邊。一個沒有授予任何權限的正常整合，是一個沒人能支援的正常整合。

## 在哪裡設定

**Collaborate → Partner Marketplace → RevoSurge tile → Permissions**。

與[設定 postback](/hk/mmp/appsflyer/postbacks) 是同一個 tile，並且和該設定的其餘部分一樣是**按 App** 的 — 在 Android 上授予不等於在 iOS 上也授予了。

## 應授予哪些權限

| 權限 | 它讓 RevoSurge 能做什麼 | 運行所需最小集 | 建議授予 |
|---|---|---|---|
| **Ad network permissions**（主開關） | 本身不提供任何能力 — 它是下方所有權限的總閘 | 是 | 是 |
| **Access aggregate conversions** | 看到 AppsFlyer 統計的安裝，而不只是 postback 送達的那部分 | 是 | 是 |
| **Access aggregate in-app events** | 同上，針對安裝後事件 | 是 | 是 |
| **Access aggregate revenue** | 同上，針對收入 — 核對 ROAS 與你的數字時需要 | 是 | 是 |
| **Configure integration** | 直接修正 tile（漏開的開關、設錯的回溯窗口），無需給你發操作說明 | — | 是 |
| **Configure in-app event postbacks** | 隨你漏斗的變化修正與擴充事件對應 | — | 是 |
| **View validation rules** | 查看 AppsFlyer 對該整合給出的驗證狀態，在設定錯誤造成預算損失之前發現它 | — | 是 |
| **Access Protect360 dashboard and raw data** | 查看哪些安裝被 AppsFlyer 判定為詐欺並攔截，以及原因 | — | 是，如果你購買了 Protect360 |

### 為什麼讀取類權限屬於最小集

沒有彙總數據存取權限，RevoSurge 只能看到 postback 送來的部分。當你的 AppsFlyer 數字與 RevoSurge 數字不一致時 — [兩者本來就會有設計層面的差異](/hk/mmp/appsflyer/macros#appsflyer-與-revosurge-對帳) — 我們無法區分「真實的歸因缺口」和「某個 postback 根本沒到」。每一次差異都會變成一輪截圖往返。

### 如果你有 Protect360，為什麼它的存取權限重要

被 Protect360 判定為詐欺並攔截的安裝不會以 postback 到達我們這裡。沒有看板存取權限時，它們與「從未發生過的安裝」無法區分 — 於是 RevoSurge 會繼續購買產生它們的流量。有了存取權限，我們能看到攔截原因並切掉該來源。

## 授予 tile 權限，而不是帳戶席位

請使用 RevoSurge tile 上的權限。**不要**把 RevoSurge 員工邀請為你 AppsFlyer 帳戶的團隊成員，除非某項具體任務確實需要；任務完成後請移除該存取權限。

兩者並不等價：

| | tile 權限 | 團隊成員席位 |
|---|---|---|
| 範圍 | 該 App 上的 RevoSurge 整合 | 你的整個 AppsFlyer 帳戶 |
| 粒度 | 上表中逐項列出的權限 | 該席位角色允許的一切 |
| 撤銷 | 關掉開關 | 移除用戶，並指望有人記得這件事 |

tile 權限就是為此設計的機制。帳戶席位是一次範圍更大的授權，而且往往比建立它的理由活得更久。

## 代理商

- **由廣告主授予，不是代理商自己授予。** 只有 App 所有者能在 tile 上設定權限。如果你代客戶營運 RevoSurge，本頁是你要發給客戶的東西，而不是你自己去操作的東西。
- **RevoSurge 的點擊不攜帶 `af_prt`。** AppsFlyer 的代理商維度對 RevoSurge 流量不會被填入 — 見[完整參數集](/hk/mmp/appsflyer/macros#各參數說明)。請在廣告主的 AppsFlyer 帳戶中、或在 RevoSurge 報表中查看 RevoSurge 的成效，而不要指望代理商透明度報表。
- 如果客戶期望由你來完成 AppsFlyer 的設定，你仍然需要 tile 上的 **Configure integration** 權限。

## 檢查清單

在認為權限設定完成之前，按每個 App 逐項確認：

- [ ] Ad network permissions 已打開
- [ ] 三項彙總數據存取權限均已授予
- [ ] Configure integration 與 Configure in-app event postbacks 已授予，或者你已接受每次修正都要經由你的團隊
- [ ] View validation rules 已授予
- [ ] 如果你購買了 Protect360，其存取權限已授予
- [ ] 沒有 RevoSurge 員工佔用一個本可由 tile 權限涵蓋的團隊成員席位

## 下一步

- [設定 postback](/hk/mmp/appsflyer/postbacks) 與[點擊轉發](/hk/mmp/appsflyer/click-forwarding) 是整合的兩半設定。
- [整合驗證](/hk/mmp/appsflyer/validation)會檢查整套設定，權限也在其中（[AF-O-05](/hk/mmp/appsflyer/validation#af-o-05) 至 [AF-O-08](/hk/mmp/appsflyer/validation#af-o-08)）。
