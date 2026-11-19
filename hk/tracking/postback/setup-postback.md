---
title: 設定並測試 Partner Postback
description: 連接聯盟平台、設定事件回調並驗證真實轉化路徑。
---

# 設定並測試 Partner Postback

先確認平台支持的[版本](/hk/tracking/postback/overview#choose-version)。條件允許時建議使用 v2。準備產品訪問權限、服務端回調設定權限和源事件資料。

## 1. 選擇聯盟平台 {#_1-choose-the-affiliate-setup}

打開 **Product → Choose your setup → An affiliate platform → Use this setup**。

<img class="doc-screenshot" src="/img/handbook/wizard-v4/affiliate-setup.png" alt="聯盟平台接入建議" width="416" height="268">

## 2. 建立或選擇連接 {#_2-create-or-select-a-connection}

打開 **Account menu → API Keys & Postbacks → Postback Connections → Create Connection**。填寫名稱、平台和授權產品。v2 要求 Connection 恰好綁定一個產品。

<img class="doc-screenshot" src="/img/handbook/wizard-v4/postback-form.png" alt="建立 Connection 的表單" width="480" height="218">

獲取 Connection ID 和密鑰，並與 RevoSurge 確認目標 origin 和接收端是否就緒。v2 還須核對接收路徑及產品有效目錄。密鑰僅保存在服務端，分享驗收材料時須遮蓋。

## 3. 設定聯盟平台 {#_3-configure-your-platform}

- **v2**　使用確認的 origin、Connection ID 和密鑰組裝 `/v2/pb/{connectionId}/events`。門戶當前生成的是 v1 URL。選擇[產品事件](/hk/tracking/events/choose-events)，按 [v2 欄位規則](/hk/tracking/postback/v2-api#v2-parameters)映射源宏。
- **v1**　使用已分配的 URL，請按相應[事件路徑](/hk/tracking/postback/v1-api#endpoints)和[平鋪參數](/hk/tracking/postback/v1-api#parameters)設定宏。URL 路徑決定事件。
- 為每種事件記錄來源欄位、目標欄位、類型、單位、精度、必填級別和負責人。使用穩定的玩家和來源事件 ID、原始 RevoSurge 點擊 ID 及真實業務時間。重試時保留原值。
- 在目標產品或廣告系列中啓用服務端規則。即使 v2 只有一個接收路徑，平台仍可能要求每種事件設定單獨模板。

## 4. 測試完整流程 {#_4-test-the-complete-path}

按版本參考[驗證清單](/hk/tracking/postback/validation)。

| 階段 | 操作 | 檢查結果 |
| --- | --- | --- |
| Dry run | 使用真實展開的模板發送，帶上 `dryrun=1` | 解析值正確，未發佈業務事件 |
| 隔離測試 | 移除 dryrun，設定 `testmode=1` 並使用獨立測試 ID | 隔離流中的業務消息與源資料一致 |
| 正式驗證 | 確認上線條件後移除兩個標記，使用真實點擊並完成正常業務流程 | 對照正式回傳，分別檢查報表、首充和廣告系列歸因 |

按 [v2](/hk/tracking/postback/v2-api#v2-responses) 或 [v1](/hk/tracking/postback/v1-api#responses) 的回應和重試規則處理結果。真實回傳和歸因需單獨核對。

### 驗證真實業務流程 {#check-the-real-journey}

- **v2**　觸發約定的真實業務動作，逐項對照收到的欄位與來源資料。
- **v1 充值**　用新測試帳戶完成約定的小額真實首充和第二筆充值。檢查註冊、首充、復充路徑，核對玩家和點擊 ID、獨立事件 ID、金額及時間。第二筆充值不應被計為另一筆首充。
- **v1 應用啓動**　適用時重新打開應用兩次，確認同一玩家有兩條獨立的啓動事件。用 dry run 檢查註冊前啓動，缺少可用身份時應拒絕該事件。

在 AdWave 打開 **Verify Your Source → Partner Postback → View event stream**，選擇對應的來源、模式和 UTC 時段。圖中是 Web 追蹤器的控件，請切換到 Partner Postback。

![事件流控件](/img/handbook/wizard-v4/event-stream.png)

保留已脫敏的完整 URL、版本和環境、平台版本、產品及 Connection、事件列表、來源 ID、時間、回應及請求 ID。v2 還應記錄 `catalogVersion`。技術負責人比對業務消息中的值，包括小數精度，並記錄可追蹤的目標引用。為未驗證或缺失的階段指定負責人。

## 5. 上線前與變更後 {#_5-before-launch-and-after-changes}

在 **Campaign conversion events** 確認廣告系列目標是否可用，並與客戶經理確認監控、恢復負責人及尚未發送的欄位或事件。共享歸因時，交付驗證證據和計入規則。

平台運營方負責密鑰和後台規則。代理方需要平台授權才能修改。每類業務動作使用約定的來源和版本。更換密鑰、產品、目錄、模板、域名、身份、付款渠道或歸因規則後重新檢查。對結果不確定的請求，先根據原始來源 ID 對賬，再決定是否重發。
