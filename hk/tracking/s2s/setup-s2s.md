---
title: 設定並測試 S2S 伺服器事件
description: 連接產品和 API 密鑰，實現註冊、充值及正式轉化驗證。
---

# 設定並測試 S2S 伺服器事件

準備目標產品的訪問權限、能修改後端的開發人員、落地頁點擊 ID 和穩定的玩家帳戶 ID。

## 上線前的準備 {#before-you-start}

確認後端能提供實際業務發生時間和對應事件的必填資料。

## 1. 接入最低要求事件 {#_1-implement-the-minimum-required-events}

正式上線前接入 **`register`** 和 **`deposit`**。

| 事件 | 觸發時機 | 用途 |
| --- | --- | --- |
| `register` | 成功建立帳戶後 | 衡量註冊 |
| `deposit` | 每筆充值確認成功後，包括復充 | 衡量充值金額和首充 |

每筆成功充值均發送 `deposit`，並提供 `context.transaction_id`、`context.amount` 和 `context.currency`。RevoSurge 判定首充。其他事件根據廣告系列目標和報表需求選擇。

## 2. 連接產品與 API 密鑰 {#_2-connect-your-product-and-api-key}

打開 **Product → Choose your setup → Our own back office**，檢查 Web Tracker 和 S2S，然後選擇 **Use this setup**。

![建議的 Web Tracker 和 S2S 接入方案](/img/handbook/wizard-v4/choose-setup-s2s.png)

1. 打開 **Account menu → API Keys & Postbacks → API Keys**。
2. 選擇 **Create API Key**。在 **Generate new API key** 選擇產品、輸入名稱並生成密鑰。

![選擇目標產品並生成 API 密鑰](/img/handbook/wizard-v4/api-key-create.png)

## 3. 構造事件請求 {#_3-build-the-event-request}

請求地址為 `https://datapulse-api.revosurge.com/v3/s2s/event`，請求頭包含 `X-API-KEY` 和 `Content-Type: application/json`。

| 對象 | 內容 |
| --- | --- |
| `event` | 精確的已登記事件名 |
| `timestamp` | 真實發生時間，UTC Unix 毫秒 |
| `identity` | 至少提供 `client_user_id` 或 `anonymous_id`，點擊 ID 僅用于歸因 |
| `context` | 該事件要求的欄位 |

`identity.click_id` 使用原始落地頁點擊 ID，`identity.client_user_id` 使用與 Web 追蹤器一致的穩定帳戶 ID。欄位名以 [API 範例](/hk/tracking/s2s/v3/server-events-api)及[產品事件定義](/hk/tracking/events/choose-events)為準。

## 4. 驗證請求負載 {#_4-validate-the-payload-safely}

| 模式 | 成功回應 | 作用 |
| --- | --- | --- |
| `?dryrun=1` | `200`，`X-Ingest-Mode: dryrun` | 驗證並回顯，未寫入業務事件 |
| `X-Test-Mode: true` | `200`，test 模式 | 測試記錄保留 14 天，不參與報表、歸因或計費 |
| Live | `202 Accepted` | 進入正式處理隊列 |

單條 dry run 成功時返回 `misspelledFields: []`，批量成功時可省略。可選 context 欄位需要根據目錄另行核對。詳見 [S2S 驗證](/hk/tracking/s2s/validation)。

## 5. 接入實際後端處理程式 {#_5-connect-the-real-backend-handlers}

註冊成功後發送 `register`，支付確認成功後發送 `deposit`。金額事件重試時保留原交易 ID。部署真實處理邏輯並驗證其觸發條件。

## 6. 驗證正式轉化路徑 {#_6-verify-the-live-conversion-path}

1. 記錄目標產品、事件及預期身份和業務值。
2. 使用約定點擊和真實業務流程，由廣告主執行已批准的註冊或支付操作。
3. 確認實際後端發送請求，記錄 `eventId` 或批量 `requestId` 和 `count`。
4. 打開 **Verify Your Source → S2S Server Events → View event stream**，選擇正確的流量模式和 UTC 時段。
5. 核對事件類型、用戶、點擊、交易、金額和幣別。
6. 檢查 **Campaign conversion events**，確認所用出價策略支持目標轉化。測試事件與 dry run 不計入正式轉化驗證。

### 排查問題 {#troubleshooting}

| 現象 | 優先檢查 |
| --- | --- |
| `400` 且含 `violations` | 錯誤欄位及規則、時間戳單位、該事件的必填欄位 |
| `422 EVENT_DISABLED` | 產品市場類別及事件可用性 |
| `422 UNKNOWN_EVENT_TYPE` | 精確事件名，首充使用 `deposit` |
| 正式請求返回 `200` | 是否保留 dryrun 或測試標記 |
| `429` | 檢查單個密鑰的流量，使用帶隨機抖動的退避 |
| 已接收但未歸因 | 原始點擊 ID、產品、穩定玩家 ID |
| 首充異常偏高 | 既有玩家歷史充值及回補或截止時間 |

來源顯示 **Active** 或 **Previously verified** 時，仍需分別檢查註冊和充值是否已通過這次 Live 驗證。

![檢查原始接收記錄](/img/handbook/wizard-v4/event-stream.png)

## 7. 完成上線檢查 {#_7-complete-the-launch-checks}

確認實際後端上報的 `register` 和 `deposit` 已由 Live 流量驗證。核對[驗證規則](/hk/tracking/s2s/validation)、產品授權、市場類別和正式環境密鑰。清除正式請求中的測試標記。確認老玩家歷史充值處理，以及事件接收和報表監控的負責人。

向客戶經理提供產品與域名、事件名、UTC 時間、請求標識、預期和實測結果及未驗證項。密鑰保持私有。密鑰、處理邏輯、欄位結構、產品、域名或身份欄位變更後重新核對。

[伺服器事件 API](/hk/tracking/s2s/v3/server-events-api) · [事件可用性](/hk/tracking/events/catalog-validation)
