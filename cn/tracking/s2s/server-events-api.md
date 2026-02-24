---
title: RevoSurge 服务器事件 API
sidebar_label: 服务器事件 API
---

# RevoSurge 服务器事件 API

**受众：** 工程师、技术集成方、管理员团队

## 概述

服务器事件 API 允许合作伙伴安全地将其服务器上的用户事件和用户活动直接发送到 DataPulse 平台。

本 API 面向高吞吐场景，需通过 API Key 进行严格认证。

## Base URL

| 环境 | Base URL |
|-------------|----------|
| Production  | `https://datapulse-api.revosurge.com/` |

## 认证
 
所有对服务器事件 API 的请求必须在请求头 `X-API-Key` 中包含 API Key。    

#### 必填请求头

| 请求头名称 | 说明 |
|-------------|-------------|
| `X-API-Key` | 用于认证的 API Key |

## 接入端点

#### 1. 单条事件接入

| 路径 | 方法 | Content-Type |
|-------- |--------|----------|
| `/v2/s2s/event` | POST   | `application/json` |

#### 1.1 请求体 Schema

请求体接受包含以下字段的 JSON 对象：

| 字段 | 类型 | 必填 | 说明 |
|-------------|----------|-------------|-------------|
| `client_user_id` | String | 是 | 您系统中用户的唯一标识符。 |
| `click_id` | String | 是 | 广告点击的唯一 ID。<br > **建议**。 |
| `event_name` | String | 是 | 事件名称（如 "register"、"login"、"deposit"）。 |
| `timestamp` | Integer | 是 | 事件发生的 Unix 时间戳（秒）。 |
| `ip_address` | String | 是 | 用户的 IP 地址（IPv4/IPv6）。 |
| `user_agent` | String | 否 | 浏览器或设备的 User Agent 字符串。 |
| `game_type` | String | 否 | 游戏类型（如 "slot"、"casino"）。 |
| `game_provider` | String | 否 | 游戏提供商（如 "EA"、"GGP"）。 |
| `transaction_id` | String | *是** | 交易唯一 ID（如购买 ID）。 |
| `amount` | Float | *是** | 交易金额（如充值金额）。 |
| `currency` | String | *是** | 法币的 3 字母 ISO 货币代码（如 USD、EUR），或加密货币的任意代码。 |
| `is_crypto` | Boolean | 否 | 若为加密货币交易则为 `true`，否则为 `false`。 |
| `<<any_prop>>` | String | 否 | 其他自定义属性的键值对。 |

*注：非财务事件（如 login）中 `transaction_id`、`amount`、`currency` 非必填。*

#### 1.2 示例请求 (curl)

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

#### 2. 批量事件接入

| 路径 | 方法 | Content-Type |
|-------- |--------|----------|
| `/v2/s2s/batch` | POST   | `application/json` |

#### 2.1 请求体 Schema

请求体接受数组类型的 JSON 对象。数组项定义见 1.1 节。

## 响应

| 状态码 | 说明 |
|-------------|-------------|
| 200 OK | 事件已成功加入处理队列 |
| 400 Bad Request | 缺少必填字段 |
| 401 Unauthorized | API Key 无效或缺少认证头 |
| 429 Too Many Requests | 超出速率限制 |
| 500 Server Error | 内部处理错误。请使用退避策略重试 |

## 速率限制

  * 限制按 X-API-KEY 应用。
  * 标准限制：每分钟 60 次请求（默认）。
  * 超出限制将返回 429 响应。 
  * 重试策略：建议在遇到 429 或 500 错误时实施指数退避策略。   

## 请求体 Schema 使用场景

#### 用户注册

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

#### 用户登录

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

#### 用户充值

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

#### 用户投注

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

#### 用户输赢

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

*注：也可在 `bet` 事件中通过 `bet_result` 和 `bet_result_amount` 字段发送。*


#### 用户提现

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
