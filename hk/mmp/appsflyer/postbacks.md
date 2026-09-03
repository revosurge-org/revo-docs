---
title: 設定 AppsFlyer postback
sidebar_label: 設定 postback
description: 在 AppsFlyer 中啟用 RevoSurge 合作夥伴 tile，並設定預設 postback 與應用內事件 postback，包括必要的窗口、發送範圍與收入設定。
---

# 設定 AppsFlyer postback

**對象：** UA 經理、廣告主、擁有 [Configure integration 權限](/hk/mmp/appsflyer/permissions)的代理商

本頁的操作**全部在 AppsFlyer 後台完成**。它會啟用 RevoSurge 合作夥伴，並讓安裝與安裝後事件開始回傳給我們。本頁不需要你打開 RevoSurge。

每個 App 各做一次 — Android 與 iOS 應用要分別設定。

> [!IMPORTANT]
> Postback 是 RevoSurge 廣告可衡量的前提。在它開啟之前，RevoSurge 收不到任何安裝與事件，無論廣告系列怎麼設定，最佳化都無法啟動。

## 開始之前

有兩件事必須先成立，否則合作夥伴設定不會生效。它們都不在 RevoSurge 的 tile 裡，因此很容易被漏掉。

### 1. 機率性歸因已打開

在 AppsFlyer 中進入你要設定的 App 的 **App Settings（應用設定）**，確認**機率性歸因**（probabilistic attribution，即原本的「fingerprinting」）已**開啟**。

這是**應用層級**的設定，不是按合作夥伴設定的：它不在 RevoSurge 的 tile 內，一旦打開就對該 App 的所有媒體渠道生效。

> [!NOTE]
> 這一項對 RevoSurge 比對多數合作夥伴更關鍵。RevoSurge 的點擊是從你**瀏覽器中的到達頁**到達 AppsFlyer 的，而瀏覽器無法交出確定性配對所需的裝置廣告 ID — 因此有相當一部分真實安裝只能靠機率性配對，iOS 上尤其如此。這個設定關閉時，那些安裝會以自然量的形式落庫，RevoSurge 學不到它們，你看到的成效也會低於實際成效。

### 2. 已在自己的產品中設定好 postback 的事件清單

先確定你希望 RevoSurge 收到哪些應用內事件，並確認你的 **App 已經在向 AppsFlyer 上報這些事件** — 透過 AppsFlyer SDK 或你的伺服器到伺服器事件整合 — 再來做本頁的設定。

順序之所以重要，有兩個原因：

- 應用內事件 postback 介面對應的是 **AppsFlyer 實際已經收到過的事件名**。你的 App 從未觸發過的事件，在那裡根本沒有選項。
- 你發什麼名字，我們就收什麼名字。之後改名會靜默地破壞對應關係：postback 照舊到達，但帶的是 RevoSurge 不認識的名字。

請把清單準備好 — 至少包含註冊、充值／購買，以及任何收入類事件 — 並向你的 RevoSurge 對接人確認我們接受的**合作夥伴事件名**，讓每個 AppsFlyer 事件都精確對應到其中一個。

## 1. 打開 RevoSurge 合作夥伴 tile

1. 在 AppsFlyer 中進入 **Collaborate → Partner Marketplace**。
2. 搜尋你的 RevoSurge 對接人給你的**準確的 RevoSurge tile 名稱**。
3. 點擊 **Set up integration**。

> [!WARNING]
> 不要選名稱相似的 tile。Partner Marketplace 裡有數千個合作夥伴，其中幾個名字與我們很接近，選錯會得到一份能正常儲存、但什麼都不發給我們的設定。

## 2. 啟用合作夥伴

在 **Integration** 標籤頁，把 **Activate partner** 打到 **ON**。

只要廣告在跑就保持開啟。關掉它會立即停止歸因與 postback — 這不是暫停，而是斷連。

## 3. 關閉 Advanced Privacy（iOS）

iOS 應用請把 **Advanced Privacy** — 以及帳戶中若顯示 **Aggregated Advanced Privacy** — 設為 **OFF**。

保持開啟會從我們收到的 postback 中移除裝置 ID 與點擊 ID。到達我們這裡的只是一行聚合數據，無法回溯到產生它的那次點擊，歸因核對與最佳化都無從談起。

> [!NOTE]
> 這是你帳戶上的隱私設定決策。如果該設定由你的法務或合規團隊負責，請在上線前就與他們確認，而不要等到上線當天。

## 4. 設定歸因回溯窗口

在合作夥伴 tile 的歸因設定中設為：

| 窗口 | 必要值 |
|---|---|
| 點擊歸因回溯期 | **7 天** |
| 瀏覽歸因回溯期 | **24 小時** |

這兩個值讓 RevoSurge 與你其他渠道使用的窗口保持一致。如果你其他合作夥伴用的窗口不同，請在上線前告知你的 RevoSurge 客戶經理，而不要單方面改動 — 窗口不一致會表現為兩邊看板之間的歸因差異，而不會報錯。

## 5. 開啟瀏覽歸因

把 **Install view-through attribution** 設為 **ON**。

> [!NOTE]
> RevoSurge 目前**只轉發點擊**，因此這個開關不會改變你目前 RevoSurge 流量的歸因方式 — RevoSurge 的歸因是基於點擊的。把它放進必要設定，是為了之後不必再回來動這個 tile。如果你在核對整合時發現 RevoSurge 沒有任何瀏覽歸因安裝，這是預期結果，不是設定錯誤。

## 6. 預設 postback — 所有媒體渠道，包含自然量

在 **Default postbacks** 區域開啟 **Install** 與 **Re-engagement**，並把兩者的發送範圍都設為**所有媒體渠道，包含自然量**（AppsFlyer 的措辭是「歸因給任意合作夥伴*或*自然量的事件」）。

| Postback | 是否開啟 | 發送範圍 |
|---|---|---|
| Install | 是 | 所有媒體渠道，包含自然量 |
| Re-engagement | 是 | 所有媒體渠道，包含自然量 |

這是要求，不是偏好。我們的模型需要一張完整的圖 — 歸因給 RevoSurge 的、歸因給其他合作夥伴的、以及自然量 — 才能把「我們帶來的量」與「本來也會發生的量」區分開。把 postback 限制在「僅歸因給本合作夥伴」，等於讓我們拿自己的輸出當最佳化依據。

## 7. 應用內事件 postback

1. 把**應用內事件 postback** 打到 **ON**。
2. 把**應用內事件 postback 窗口**設為 **Lifetime（終身）**。如果你的帳戶無法選 Lifetime，下限是 **6 個月** — 再短就會截斷我們用於學習的安裝後行為。
3. 把**發送範圍**設為**所有媒體渠道，包含自然量**，與預設 postback 一致。
4. 按你準備好的清單對應事件。逐個選擇 AppsFlyer 事件，對應到它所屬的 RevoSurge 合作夥伴事件名。或者，如果你希望把整條事件流都轉發過來，也可以使用 **Send all events**。

| 設定項 | 必要值 |
|---|---|
| 應用內事件 postback | ON |
| Postback 窗口 | Lifetime（下限 6 個月） |
| 發送範圍 | 所有媒體渠道，包含自然量 |
| 事件對應 | 清單中的每個漏斗事件，或 Send all events |

> [!WARNING]
> 名稱要精確對應。對我們來說 `deposit` 和 `Deposit` 是兩個不同的事件。不匹配不會報錯 — postback 會被投遞，然後因無法識別而被丟棄，在你的看板上這與「沒有轉換」長得一模一樣。

## 8. 在變現事件上發送數值與收入

對應關係中每一個購買、充值或收入類事件，都要把數值選項設為 **Values & revenue**。

否則我們只會收到事件、收不到金額，ROAS 與任何基於價值的最佳化都無法進行。非金額類事件保持僅數值即可。

## 9. 儲存

儲存整合設定。設定對新流量生效 — 它不會回補你儲存之前發生的事件。

## RevoSurge 會收到什麼、不會收到什麼

| 我們會收到 | 我們不會收到 |
|---|---|
| 安裝，包含自然量與歸因給其他合作夥伴的 | 你儲存本設定之前的任何數據 |
| 再行銷（re-engagement） | 你的 App 從未發給 AppsFlyer 的事件 |
| 你對應的應用內事件，涵蓋整個窗口 | 窗口之外的事件（若你設定了短於 Lifetime 的窗口） |
| 設為 Values & revenue 的事件上的收入數值 | 裝置 ID 與點擊 ID（若 Advanced Privacy 開啟） |

## 下一步

Postback 負責把轉換**回傳**給 RevoSurge。它不會告訴 AppsFlyer 哪些點擊是我們的 — 那是整合的另一半，缺了它整合並未完成。

繼續看[點擊轉發](/hk/mmp/appsflyer/click-forwarding)。你不需要產生任何 AppsFlyer 追蹤連結：RevoSurge 會替你轉發點擊，依據的是你到達頁 web tracker 上的 AppsFlyer App ID，加上 AdWave 裡一個產品層級的設定。
