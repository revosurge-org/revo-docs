---
title: RevoSurge 伺服器事件 API
sidebar_label: 伺服器事件 API
---

# RevoSurge 伺服器事件 API

**對象：** 工程師、技術整合方、管理員團隊

## 概述

伺服器事件 API 允許合作夥伴安全地將其伺服器上的用戶事件及用戶活動直接發送到 DataPulse 平台。

本 API 面向高吞吐場景，需透過 API Key 進行嚴格認證。

## Base URL

| 環境 | Base URL |
|-------------|----------|
| Production  | `https://datapulse-api.revosurge.com/` |

## 認證
 
所有對伺服器事件 API 的請求必須在請求頭 `X-API-Key` 中包含 API Key。    

#### 必填請求頭

| 請求頭名稱 | 說明 |
|-------------|-------------|
| `X-API-Key` | 用於認證的 API Key |

## 接入端點

#### 1. 單條事件接入

| 路徑 | 方法 | Content-Type |
|-------- |--------|----------|
| `/v2/s2s/event` | POST   | `application/json` |

#### 1.1 請求體 Schema

請求體接受包含以下欄位的 JSON 物件：

| 欄位 | 類型 | 必填 | 說明 |
|-------------|----------|-------------|-------------|
| `client_user_id` | String | 是 | 您系統中用戶的唯一識別碼。 |
| `click_id` | String | 是 | 廣告點擊的唯一 ID。<br > **建議**。 |
| `event_name` | String | 是 | 事件名稱（如 "register"、"login"、"deposit"）。 |
| `timestamp` | Integer | 是 | 事件發生的 Unix 時間戳（秒）。 |
| `ip_address` | String | 是 | 用戶的 IP 地址（IPv4/IPv6）。 |
| `user_agent` | String | 否 | 瀏覽器或裝置的 User Agent 字串。 |
| `game_type` | String | 否 | 遊戲類型（如 "slot"、"casino"）。 |
| `game_provider` | String | 否 | 遊戲提供商（如 "EA"、"GGP"）。 |
| `transaction_id` | String | *是** | 交易唯一 ID（如購買 ID）。 |
| `amount` | Float | *是** | 交易金額（如充值金額）。 |
| `currency` | String | *是** | 法幣的 3 字母 ISO 貨幣代碼（如 USD、EUR），或加密貨幣的任意代碼。 |
| `is_crypto` | Boolean | 否 | 若為加密貨幣交易則為 `true`，否則為 `false`。 |
| `<<any_prop>>` | String | 否 | 其他自訂屬性的鍵值對。 |

*註：非財務事件（如 login）中 `transaction_id`、`amount`、`currency` 非必填。*

#### 1.2 示例請求 (curl)

```bash
curl -X POST "https://<<our-url>>/v2/s2s/event" 
    -H "Content-Type: application/json" 
    -H "X-API-KEY: dp_test_key_123"
    -d '{
        "client_user_id": "user_001", 
        "click_id": "clk_998877",
        "ip_address": "203.0.113.1", 
        "event_name":"deposit",      
        "transaction_id": "tx_554433",   
        "timestamp": 1702963200,   
        "amount": 50.00,          
        "currency": "USD"  
        }'
```

#### 2. 批次事件接入

| 路徑 | 方法 | Content-Type |
|-------- |--------|----------|
| `/v2/s2s/batch` | POST   | `application/json` |

#### 2.1 請求體 Schema

請求體接受陣列類型的 JSON 物件。陣列項定義見 1.1 節。

## 回應

| 狀態碼 | 說明 |
|-------------|-------------|
| 200 OK | 事件已成功加入處理佇列 |
| 400 Bad Request | 缺少必填欄位 |
| 401 Unauthorized | API Key 無效或缺少認證頭 |
| 429 Too Many Requests | 超出速率限制 |
| 500 Server Error | 內部處理錯誤。請使用退避策略重試 |

## 速率限制

  * 限制按 X-API-KEY 應用。
  * 標準限制：每分鐘 60 次請求（預設）。
  * 超出限制將回傳 429 回應。 
  * 重試策略：建議在遇到 429 或 500 錯誤時實施指數退避策略。   

## 請求體 Schema 使用場景

#### 用戶註冊

``` JSON
{
  "client_user_id": "<<THE UNIQUE USER ID>>",
  "click_id": "<<THE UNIQUE CLICK ID>>",
  "event_name": "register",
  "timestamp": UTC milliseconds,
  "ip_address": "<<THE END USER IP>>",
  "user_agent": "<<THE USER AGENT STRING>>"
}
```

#### 用戶登入

``` JSON
{
  "client_user_id": "<<THE UNIQUE USER ID>>",
  "click_id": "<<THE UNIQUE CLICK ID>>",
  "event_name": "login",
  "timestamp": UTC milliseconds,
  "ip_address": "<<THE END USER IP>>",
  "user_agent": "<<THE USER AGENT STRING>>"
}

```

#### 用戶充值

``` JSON
{
  "client_user_id": "<<THE UNIQUE USER ID>>",
  "click_id": "<<THE UNIQUE CLICK ID>>",
  "event_name": "deposit",
  "currency": "<<THE CURRENCY, eg: USD | EUR | BTC>>",
  "amount": 5.00,
  "transaction_id": "<<THE UNIQUE TRANSACTION ID>>",
  "timestamp": UTC milliseconds,
  "ip_address": "<<THE END USER IP>>",
  "is_crypto": true | false
}
```

#### 用戶投注

``` JSON
{
  "client_user_id": "<<THE UNIQUE USER ID>>",
  "event_name": "bet",
  "game_type": "<<THE GAME TYPE>>",
  "game_provider": "<<THE GAME PROVIDER>>",
  "currency": "<<THE CURRENCY, eg: USD | EUR | BTC>>",
  "amount": 5.00,
  "transaction_id": "<<THE UNIQUE TRANSACTION ID>>",
  "timestamp": UTC milliseconds,
  "is_crypto": true | false,

  "bet_result": "win | loss",
  "bet_result_amount": 1.00
}
```

#### 用戶輸贏

``` JSON
{
  "client_user_id": "<<THE UNIQUE USER ID>>",
  "event_name": "win | loss",
  "game_type": "<<THE GAME TYPE>>",
  "game_provider": "<<THE GAME PROVIDER>>",
  "currency": "<<THE CURRENCY, eg: USD | EUR | BTC>>",
  "amount": 5.00,
  "transaction_id": "<<THE UNIQUE TRANSACTION ID>>",
  "parent_transaction_id": "<<THE PARENT BET TRANSACTION ID>>" 
  "timestamp": UTC milliseconds,
  "is_crypto": true | false
}
```

*註：也可在 `bet` 事件中透過 `bet_result` 及 `bet_result_amount` 欄位發送。*


#### 用戶提現

``` JSON
{
  "client_user_id": "<<THE UNIQUE USER ID>>",
  "event_name": "withdraw",
  "currency": "<<THE CURRENCY, eg: USD | EUR | BTC>>",
  "amount": 5.00,
  "transaction_id": "<<THE UNIQUE TRANSACTION ID>>",
  "timestamp": UTC milliseconds,
  "ip_address": "<<THE END USER IP>>",
  "is_crypto": true | false
}
```
