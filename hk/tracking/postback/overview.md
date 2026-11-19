---
title: Partner Postback 概述
description: 對比 Partner Postback v1 與 v2，並選擇適合聯盟平台的版本。
---

<a id="revosurge-合作夥伴-postback-api"></a>
<a id="revosurge-partner-postback-api"></a>

# Partner Postback 概述

Partner Postback 通過服務端 HTTP GET 回調，將聯盟平台或業務後台記錄的事件發送給 RevoSurge。適用於來源系統能提供相應必填資料的場景。

## 選擇版本 {#choose-version}

| 項目 | Postback v2（推薦） | Postback v1 |
| --- | --- | --- |
| 適用平台 | 可發送規範事件名、點分欄位及產品目錄要求的資料 | 支持五條預定義事件 URL 和平鋪查詢參數 |
| 事件選擇 | `/v2/pb/{connectionId}/events`，由 `event` 指定事件 | URL 路徑區分註冊、首充、復充、收入或啓動應用 |
| 事件範圍 | 與 S2S v3 共用產品事件目錄，含已啓用的行業事件 | 五條 v1 路徑對應的業務事件 |
| 連接 | 使用處於啓用狀態且只關聯一個產品的 Connection | `/v1/pb/{partner}/{event-path}`，`{partner}` 為 Connection ID 或獲發的舊標識 |
| 認證 | 在 `k` 中發送對應的 Connection 密鑰 | 在 `k` 中發送對應密鑰 |
| 欄位 | 規範欄位，如 `identity.client_user_id`、`timestamp`、`context.transaction_id` | 平鋪欄位，如 `user_id`、`click_id`、`ts`、`txid`，支持已設定的別名 |
| 身份 | `identity.client_user_id` 或 `identity.anonymous_id`，並滿足具體事件要求 | 有效的 `click_id` 或 `user_id`，支持點擊身份兜底 |
| 發生時間 | `timestamp` 為實際 UTC 整數毫秒 | `ts` 使用毫秒，解析可糾正秒級值並標記偏差 |
| 金額與幣別 | 原幣金額和幣別，無自動 USD 換算 | 採用 v1 原值和可選的匯率補充規則 |
| 無效輸入 | 按驗證結果返回 `400` 或 `422` | 部分接收失敗返回 `200 ignored`，請檢查回應體 |
| Dry run | `status=validated` 或拒絕結果，不發佈業務事件 | `decision=accepted` 或 `dropped`，不發佈業務事件 |
| URL 獲取 | 使用確認的 origin、Connection ID 和密鑰組裝 | 門戶生成器目前提供 v1 URL |
| 技術參考 | [v2 API](/hk/tracking/postback/v2-api) | [v1 API](/hk/tracking/postback/v1-api) |

### 確認平台能力 {#check-what-your-platform-supports}

平台可提供規範點分參數、穩定身份、真實發生時間及產品所需欄位時，建議選擇 v2。若預定義的事件路徑與平鋪宏已覆蓋需求，可以繼續使用 v1。上線前，與技術負責人確認平台可提供的動作和宏值、URL 編碼能力、欄位完整性及目標環境和產品支持的版本。已有 v1 整合可以繼續使用原版本。

## 接入流程 {#follow-the-guide}

1. [設定並測試 Partner Postback](/hk/tracking/postback/setup-postback)。
2. 查閱對應的 [v2 API](/hk/tracking/postback/v2-api) 或 [v1 API](/hk/tracking/postback/v1-api)。
3. 上線前完成[整合驗證](/hk/tracking/postback/validation)。
