---
title: 整合驗證
sidebar_label: 整合驗證
description: RevoSurge AppsFlyer 整合的必要與建議驗證規則，每條都有穩定的規則 ID 和確切修復方式 — 哪些會阻止上線，哪些會靜默地損耗成效。
---

# AppsFlyer 整合驗證

**對象：** UA 經理、廣告主、代理商，以及任何要為上線簽核的人

上線前跑一遍本頁；此後每當有人改動 AppsFlyer tile、到達頁或事件清單，再跑一遍。

規則分兩檔：

- **必要** — 整合無法運作，或送來的數據 RevoSurge 無法使用。**阻止上線。**
- **建議** — 整合能運作，但最佳化或支援能力受損。**不阻止上線。**

> [!NOTE]
> [必要設定一覽](/hk/mmp/appsflyer/overview#必要設定一覽)中列出的每一項都是 RevoSurge 的要求。本頁增加的是第二個維度：哪些失敗會讓整合無法運轉，哪些會靜默地損耗你的成效。落在「建議」檔的規則依然是你應當修復的設定，只是它不會卡住上線。

每條規則都有**穩定 ID**。RevoSurge 看板的報錯會引用這些 ID 並連結到下方對應的修復條目，且這些 ID 在本頁的所有語言版本中完全一致。

## 必要規則

| ID | 規則 | 失敗會導致什麼 |
|---|---|---|
| [AF-R-01](#af-r-01) | RevoSurge tile 上合作夥伴已啟用 | 沒有歸因、沒有 postback — 什麼都到不了 RevoSurge |
| [AF-R-02](#af-r-02) | 機率性歸因已開啟（應用層級） | 多數 RevoSurge 安裝會落成自然量；為何後果嚴重見修復條目 |
| [AF-R-03](#af-r-03) | Advanced Privacy 已關閉（iOS 應用） | postback 到達時不帶裝置 ID 與點擊 ID，無法與產生它的點擊關聯 |
| [AF-R-04](#af-r-04) | 點擊歸因回溯期為 7 天 | 縮短後落在窗口之外的安裝會被歸給別人或歸為自然量 |
| [AF-R-05](#af-r-05) | 預設安裝 postback 已開啟 | RevoSurge 收不到任何安裝 |
| [AF-R-06](#af-r-06) | 應用內事件 postback 已開啟 | 沒有安裝後訊號，也就沒有轉換衡量與最佳化 |
| [AF-R-07](#af-r-07) | AppsFlyer 事件名與 RevoSurge 合作夥伴事件名精確對應 | postback 會被投遞，然後因無法識別被丟棄 — 與「沒有轉換」無法區分 |
| [AF-R-08](#af-r-08) | 收入類事件已設為 Values & revenue | 事件到達但沒有金額；ROAS 與基於價值的最佳化都無法進行 |
| [AF-R-09](#af-r-09) | 到達頁上 web tracker 已生效，且產品顯示 Active | 沒有點擊被轉發，且該產品無法在 AdWave 中被選擇 |
| [AF-R-10](#af-r-10) | 你推廣的每個平台都填了 AppsFlyer App ID | 該平台不會有點擊被轉發；AppsFlyer 把這些安裝記成自然量 |
| [AF-R-11](#af-r-11) | AdWave 中該產品的 MMP 來源為 AppsFlyer | 無論到達頁填了什麼，都不會有點擊被轉發 |

## 建議規則

| ID | 規則 | 代價是什麼 |
|---|---|---|
| [AF-O-01](#af-o-01) | 應用內事件 postback 窗口為 Lifetime（下限 6 個月） | 漏斗後段事件落在窗口之外，永遠不會進入模型訓練 |
| [AF-O-02](#af-o-02) | 預設 postback 發送所有媒體渠道，包含自然量 | 最佳化只能對著 RevoSurge 自己的輸出跑，沒有基線可比 |
| [AF-O-03](#af-o-03) | 應用內 postback 發送所有媒體渠道，包含自然量 | 同上，針對安裝後事件 |
| [AF-O-04](#af-o-04) | 瀏覽歸因已開啟，瀏覽回溯期為 24 小時 | 目前沒有代價 — 屬於設定衛生，見修復條目 |
| [AF-O-05](#af-o-05) | RevoSurge 擁有三項彙總數據讀取權限 | 每一次數據差異都會變成一輪截圖往返 |
| [AF-O-06](#af-o-06) | RevoSurge 擁有兩項設定權限 | 每一次修正都要以書面說明的形式經由你的團隊 |
| [AF-O-07](#af-o-07) | RevoSurge 擁有 View validation rules 權限 | 設定錯誤會在花掉預算之後才被發現，而不是之前 |
| [AF-O-08](#af-o-08) | 若你購買了 Protect360，RevoSurge 擁有其存取權限 | 詐欺安裝看起來就像從未發生過的安裝，於是該來源會被繼續購買 |

## 必要項修復方式

### AF-R-01 — 合作夥伴未啟用 {#af-r-01}

**修復：** Collaborate → Partner Marketplace → RevoSurge tile → Integration → 把 **Activate partner** 設為 **ON**。

只要廣告在跑就保持開啟。關掉它是斷連，不是暫停。

### AF-R-02 — 機率性歸因未開啟 {#af-r-02}

**修復：** 該 App 的 App Settings → 開啟**機率性歸因**（probabilistic attribution，即原本的「fingerprinting」）。這是應用層級的設定，不在 RevoSurge tile 內。

**為什麼它屬於必要而不是建議：** RevoSurge 的點擊是從你**瀏覽器**中的到達頁到達 AppsFlyer 的，而瀏覽器無法提供確定性配對所需的裝置廣告 ID。這項關閉時，確定性配對只能抓到一小部分真實安裝，其餘都以自然量到達 — 整合在技術上是通的，實質上卻沒有用。

### AF-R-03 — Advanced Privacy 處於開啟狀態 {#af-r-03}

**修復：** RevoSurge tile → Integration → 把 **Advanced Privacy**、以及帳戶中若顯示的 **Aggregated Advanced Privacy** 設為 **OFF**。僅 iOS 應用。

如果這項設定由你的法務或合規團隊負責，請在上線前就與他們解決，而不要等到上線當天。

### AF-R-04 — 點擊歸因回溯期短於 7 天 {#af-r-04}

**修復：** RevoSurge tile → 歸因設定 → 把**點擊歸因回溯期**設為 **7 天**。

如果你其他合作夥伴使用不同的窗口，請與你的 RevoSurge 客戶經理商議，而不要單方面改動 — 窗口不一致會表現為兩邊看板之間的差異，而不會報錯。

### AF-R-05 — 預設安裝 postback 未開啟 {#af-r-05}

**修復：** RevoSurge tile → **Default postbacks** → 開啟 **Install**。

順手也把 **Re-engagement** 開上。發送範圍見 [AF-O-02](#af-o-02)。

### AF-R-06 — 應用內事件 postback 未開啟 {#af-r-06}

**修復：** RevoSurge tile → 把**應用內事件 postback** 設為 **ON**，然後對應你的漏斗事件。

AdWave 廣告系列會朝一個目標事件最佳化（註冊或充值）。沒有應用內 postback，該事件永遠不會到達，廣告系列也就沒有可最佳化的對象。

### AF-R-07 — 事件名不匹配 {#af-r-07}

**修復：** RevoSurge tile → 應用內事件 postback 對應 → 把每個 AppsFlyer 事件對應到客戶經理給你的準確 RevoSurge 合作夥伴事件名。

配對是精確且區分大小寫的：`deposit` 與 `Deposit` 是兩個不同的事件。不匹配不會報錯 — postback 會被投遞，然後因無法識別被丟棄，在你的看板上這與「沒有轉換」長得一模一樣。如果你的 App 從未觸發過某個事件，它根本不會出現在對應介面裡；請先在你這邊解決。

### AF-R-08 — 收入類事件不帶數值 {#af-r-08}

**修復：** RevoSurge tile → 應用內事件 postback 對應 → 對每一個購買、充值或收入類事件，把數值選項設為 **Values & revenue**。

任何帶充值、購買或收入目標的廣告系列都必需。非金額類事件保持僅數值即可。

### AF-R-09 — web tracker 未生效 {#af-r-09}

**修復：** 在到達頁安裝 tracker — 見[安裝 Web 追蹤器](/hk/tracking/web-tracker/install) — 並確認 **Manage Product** 中該產品顯示 **Active**。

產品在其 tracker 收到第一個事件之前一直是 Inactive，而未啟用的產品無法在 AdWave 建廣告系列的流程中被選擇。還要確認 tracker 在 RevoSurge 流量可能落到的每一個路徑上都會觸發，而不只是你測試過的那一頁。

### AF-R-10 — 缺少 AppsFlyer App ID {#af-r-10}

**修復：** 在到達頁的 web tracker 初始化中填入 `androidAppsFlyerId` 及／或 `iOSAppsFlyerId` — 見[點擊轉發](/hk/mmp/appsflyer/click-forwarding#set-app-id)。

按你實際推廣的平台填寫；兩個欄位互相獨立。這個故障在兩個看板上都是靜默的：RevoSurge 有點擊，AppsFlyer 把安裝記成自然量。

### AF-R-11 — AdWave 中的 MMP 來源不是 AppsFlyer {#af-r-11}

**修復：** 在 RevoSurge 中打開 AdWave 裡的該產品，把 **MMP 來源**設為 **AppsFlyer**。

產品層級設定，每個產品設一次。不設定、或設成別的 MMP，到達頁上的 App ID 就永遠不會被用到。

## 建議項修復方式

### AF-O-01 — Postback 窗口短於 Lifetime {#af-o-01}

**修復：** RevoSurge tile → 把**應用內事件 postback 窗口**設為 **Lifetime**。如果你的帳戶無法選擇它，下限是 **6 個月**。

### AF-O-02 — 預設 postback 被限制為僅本合作夥伴 {#af-o-02}

**修復：** RevoSurge tile → **Default postbacks** → 把 **Install** 與 **Re-engagement** 的發送範圍設為**所有媒體渠道，包含自然量**（AppsFlyer 的措辭是「歸因給任意合作夥伴*或*自然量的事件」）。

把 postback 限制在歸因給 RevoSurge 的事件上，等於讓我們的模型對著自己的輸出做最佳化，沒有未歸因與自然量作為基線，也就無法把「我們帶來的量」與「本來也會發生的量」區分開。

### AF-O-03 — 應用內 postback 被限制為僅本合作夥伴 {#af-o-03}

**修復：** 同一介面的應用內事件區域 — 把**發送範圍**設為**所有媒體渠道，包含自然量**。

### AF-O-04 — 瀏覽歸因未開啟 {#af-o-04}

**修復：** RevoSurge tile → 把 **Install view-through attribution** 設為 **ON**，**瀏覽回溯期**設為 **24 小時**。

RevoSurge **只轉發點擊**，因此這不會改變你目前 RevoSurge 流量的歸因方式。把它放進這一檔，是為了之後不必再回來動這個 tile。歸因給 RevoSurge 的瀏覽歸因安裝應當為**零** — 這是預期結果，不是失敗。

### AF-O-05 — RevoSurge 沒有彙總數據讀取權限 {#af-o-05}

**修復：** RevoSurge tile → **Permissions** → 授予 **Access aggregate conversions**、**in-app events** 與 **revenue**。見[合作夥伴權限](/hk/mmp/appsflyer/permissions)。

沒有它，我們只看得到 postback 送來的部分，也就無法區分「真實的歸因缺口」和「某個 postback 根本沒到」。

### AF-O-06 — RevoSurge 無法設定該 tile {#af-o-06}

**修復：** RevoSurge tile → **Permissions** → 授予 **Configure integration** 與 **Configure in-app event postbacks**。

### AF-O-07 — RevoSurge 看不到驗證規則 {#af-o-07}

**修復：** RevoSurge tile → **Permissions** → 授予 **View validation rules**。

### AF-O-08 — RevoSurge 沒有 Protect360 存取權限 {#af-o-08}

**修復：** RevoSurge tile → **Permissions** → 授予 **Access Protect360 dashboard and raw data**。僅在你購買了 Protect360 時適用。

## 本頁無法檢查的兩件事

- **真實流量是否端到端跑通。** 以上每條規則都是設定檢查。全部通過只能證明設定正確，不能證明一次點擊真的產生了安裝 postback。那項測試屬於「交付與上線」。
- **兩邊看板之間的數據差異。** 有一部分差異是設計使然 — 開工單之前請先看[AppsFlyer 與 RevoSurge 對帳](/hk/mmp/appsflyer/macros#appsflyer-與-revosurge-對帳)。

## 下一步

規則全部通過？繼續看[交付與上線](/hk/mmp/appsflyer/handoff) — 那一頁列出了要交給客戶經理什麼、用來證明真實流量可用的端到端測試，以及日後哪些改動會靜默地把這套設定弄壞。
