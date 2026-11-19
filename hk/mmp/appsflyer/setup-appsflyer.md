---
title: 設定並驗證 AppsFlyer
description: 上線前完成 AppsFlyer 和 AdWave 設定，上線後用真實流量驗證歸因和回傳。
---

# 設定並驗證 AppsFlyer

上線前設定 AppsFlyer 和落地頁追蹤器。AppsFlyer 的 IP 白名單限制了本整合的上線前手動端到端測試。先完成設定檢查，待廣告系列產生真實流量後再驗證歸因和回傳。

## 1. 設定 AppsFlyer {#_1-configure-appsflyer}

### 核對歸因設定 {#confirm-attribution-settings-before-setup}

在目標應用打開 **Settings → App Settings**。更改 **Enable view-through attribution via probabilistic modeling** 前，先向應用負責人和客戶經理確認合適的設定。RevoSurge 的接入流程只轉發點擊。

![應用級歸因設定](/img/handbook/wizard-v4/ss03-attribution-settings.png)

### 查找並激活合作夥伴 {#_1-partner-integrations}

1. 打開 **Collaborate → Partner Integrations → Marketplace**。
2. 選擇應用和平台，搜索 **RevoSurge**。
3. 找到客戶經理確認的 PID 後，選擇 **Integrate**。
4. 將 **Activate partner** 設為 ON，啓用歸因和回傳。

![在 Marketplace 查找 RevoSurge](/img/handbook/wizard-v4/ss01-marketplace.png)

![啓用 Activate partner](/img/handbook/wizard-v4/ss04-activation.png)

### 核對安裝回傳 {#_3-check-default-install-postbacks}

在 **Default postbacks** 核對 **Install** 和 **for users from**。範例的 **This partner only** 為只讀，實際應用和 PID 支持的發送範圍由客戶經理確認。

![默認安裝回傳及發送範圍](/img/handbook/wizard-v4/ss05-install-postback.png)

### 啓用並映射應用內事件 {#_4-enable-in-app-event-postbacks}

啓用 **In-app event postbacks**。窗口選擇 **Lifetime**，不可用時至少選擇六個月。點擊 **Add event**，按下列規則填寫每個事件。

![應用內事件回傳窗口](/img/handbook/wizard-v4/ss07-lifetime.png)

![新增事件按鈕](/img/handbook/wizard-v4/ss08-add-event.png)

![事件映射的四個欄位](/img/handbook/wizard-v4/ss09-blank-mapping.png)

| 欄位 | 填寫方式 |
| --- | --- |
| **AppsFlyer event** | 選擇應用已記錄的事件。缺少事件時核對應用、拼寫和接收情況 |
| **mapped to partner event** | 使用約定的目標事件名，保持大小寫一致 |
| **for users from** | 使用約定的發送範圍。**This partner only** 轉發歸因給 RevoSurge 的事件 |
| **including** | 收入事件選擇 **Values & revenue**，並確認來源含金額與幣別 |

選擇 **Save Integration** 保存映射。再打開 **Permissions**，按應用負責人已批准的範圍授權。權限與回傳發送設定分別管理。

![權限標籤及開關](/img/handbook/wizard-v4/ss13-permission-tab.png)

![合作夥伴權限選項](/img/handbook/wizard-v4/partner-permission-options.png)

## 2. 連接 RevoSurge {#_2-connect-revosurge}

### 註冊應用 {#_1-register-your-app}

1. 在目標應用產品選擇 **Choose your setup → AppsFlyer → Use this setup**。
2. 打開 **Verify Your Source → AppsFlyer → Manage mappings**。
3. 輸入準確的 AppsFlyer App ID，選擇 **Register app** 並啓用整合。註冊後此處無法修改 ID。

![AppsFlyer 應用註冊表單](/img/handbook/wizard-v4/appsflyer-app-registration.png)

### 映射事件 {#_2-map-your-events}

核對顯示的 **RevoSurge PID**。**Apply mappings to** 默認為 **All apps**。選擇適用範圍，為各 RevoSurge 事件輸入準確的 AppsFlyer 事件名，然後保存。

![PID 和映射範圍](/img/handbook/wizard-v4/appsflyer-configuration-scope.png)

![事件映射表](/img/handbook/wizard-v4/appsflyer-event-mappings.png)

### 連接落地頁追蹤器 {#_3-connect-the-landing-page-tracker}

按[安裝 Web 追蹤器](/hk/tracking/web-tracker/install)完成設定，填寫產品的 Tracker ID 和投放平台的 AppsFlyer App ID。

```js
const tracker = new WebTracker({
  trackerId: "your-product-tracker-id",
  androidAppsFlyerId: "your-android-appsflyer-id",
  iOSAppsFlyerId: "your-ios-appsflyer-id"
});
```

在真實落地頁檢查追蹤器是否加載。此流程由追蹤器轉發點擊，無需單獨生成 AppsFlyer 跟蹤鏈接。

## 3. 上線前檢查 {#_3-check-before-launch}

確認應用、平台、產品、PID、合作夥伴激活狀態、安裝回傳、事件映射、發送範圍和窗口。對收入事件確認金額、幣別及 **Values & revenue**。同時明確廣告系列目標和上線後驗收負責人。設定保存後，仍需用真實投放資料驗證歸因與回傳。

## 4. 廣告系列上線後驗證 {#_4-verify-after-campaign-launch}

在 AdWave 打開 **Verify Your Source → Live**，檢查 AppsFlyer 卡片的 **Received events**，再通過 **View event stream** 核對實際回傳。

| 檢查項 | 證據 |
| --- | --- |
| 廣告系列點擊 | RevoSurge 中有對應點擊，落地路徑符合預期 |
| 安裝歸因 | AppsFlyer 把真實安裝歸給確認的 RevoSurge PID 與廣告系列 |
| 安裝回傳 | RevoSurge 收到對應安裝回傳 |
| 目標事件 | 實際動作按正確映射到達 AppsFlyer 和 RevoSurge |
| 收入 | 金額和幣別與來源記錄一致 |

尚無符合條件的安裝或目標事件時，標記為待驗證。事件發生後再調查未收到或不一致的記錄。與客戶經理約定檢查時間。

### 排查問題 {#if-a-check-fails}

| 現象 | 優先檢查 |
| --- | --- |
| RevoSurge 有點擊，AppsFlyer 記為自然安裝 | 追蹤器路徑、平台 App ID、AdWave MMP 來源和歸因設定 |
| AppsFlyer 已歸因，RevoSurge 未收到安裝 | PID、激活狀態、默認安裝回傳和發送限制 |
| 收到安裝但缺少目標事件 | 源事件是否到達、回傳開關、準確的映射名稱 |
| 收到事件但缺少金額 | 來源金額和幣別、**Values & revenue** |
| iOS 與預期不同 | 和應用負責人核對 iOS 歸因及隱私設定 |
| 報表不一致 | 對齊應用、PID、時段、時區、窗口、發送範圍和各級 ID |

應用、平台、映射、落地路徑、歸因、隱私、激活或權限變更後，重新檢查設定及下一批匹配的正式活動。

[參數與報表](/hk/mmp/appsflyer/parameters-reporting) · [回傳設定](/hk/mmp/appsflyer/postbacks) · [點擊轉發](/hk/mmp/appsflyer/click-forwarding) · [權限](/hk/mmp/appsflyer/permissions) · [整合驗證](/hk/mmp/appsflyer/validation)
