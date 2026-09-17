---
title: RevoSurge 服务器事件 API
sidebar_label: 服务器事件 API
description: 向 DataPulse 发送 S2S 事件。API 参考、认证、单条/批量接入。
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
| `event_name` | String | 是 | 事件名称(如 "register"、"login"、"deposit")。 |
| `timestamp` | Integer | 是 | 事件发生的 Unix 时间戳(秒)。 |
| `ip_address` | String | 是 | 用户的 IP 地址(IPv4/IPv6)。 |
| `user_agent` | String | 否 | 浏览器或设备的 User Agent 字符串。 |
| `game_type` | String | 否 | 游戏类型(如 "slot"、"casino")。 |
| `game_provider` | String | 否 | 游戏提供商(如 "EA"、"GGP")。 |
| `transaction_id` | String | *是** | 交易唯一 ID(如购买 ID)。 |
| `amount` | Float | *是** | 交易金额(如充值金额)。 |
| `currency` | String | *是** | 法币的 3 字母 ISO 货币代码(如 USD、EUR)，或加密货币的任意代码。 |
| `is_crypto` | Boolean | 否 | 若为加密货币交易则为 `true`，否则为 `false`。 |
| `<<any_prop>>` | String | 否 | 其他自定义属性的键值对。 |

*注：非财务事件(如 login)中 `transaction_id`、`amount`、`currency` 非必填。*

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
  * 标准限制：每分钟 60 次请求(默认)。
  * 超出限制将返回 429 响应。 
  * 重试策略：建议在遇到 429 或 500 错误时实施指数退避策略。   

## Dry run

在任一接入端点上加 `?dryrun=1`，即可端到端地检查一条请求而不产生任何数据。我们会完全按生产路径解析、鉴权、校验并富化它，把将要写入的那条记录原样回显，然后什么都不存。

| 端点 | Dry run URL |
|-------- |----------|
| 单条 | `POST /v2/s2s/event?dryrun=1` |
| 批量 | `POST /v2/s2s/batch?dryrun=1` |

裸写 `dryrun` 与 `dryrun=true` 含义相同。`dryrun=0`、`dryrun=false`、`dryrun=no` 表示不启用。

#### 如何把 dry run 与真实写入区分开

| 调用 | 状态码 | 响应体 | 响应头 |
|-------------|----------|-------------|-------------|
| 真实写入 | 200 OK | `{ "status": "success" }` | — |
| Dry run | 200 OK | 回显的那条记录 | `X-Ingest-Mode: dryrun` |

> [!WARNING]
> 两者都返回 `200`，所以单看状态码分不出你拿到的是哪一种——请看响应体和 `X-Ingest-Mode: dryrun` 响应头。**dry run 通过不等于写入成功。** 带 `dryrun=1` 发出的内容永远不会被存下来。

dry run **照常鉴权**，也**照常计入限流**——一次批量请求算一次请求。它不是压测入口。

#### 回显的那条记录

```bash
curl -X POST "https://<<our-url>>/v2/s2s/event?dryrun=1" \
    -H "Content-Type: application/json" \
    -H "X-API-KEY: dp_test_key_123" \
    -d '{
        "client_user_id": "u-ua-1",
        "click_id": "rs-ua-1",
        "event_name": "register",
        "timestamp": 1702963200,
        "ip_address": "203.0.113.1",
        "user_agent": "Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36"
        }'
```

响应就是我们本来会存下的那条记录：

``` JSON
{
  "requestId": "s2s.event-...",
  "apiKey": "dp_test_key_...",
  "clickId": "rs-ua-1",
  "country": "USA",
  "userAgentInfo": {
    "device_class": "Mobile",
    "device_name": "Samsung SM-G991B",
    "operating_system_name": "Android",
    "operating_system_version": "13",
    "agent_name": "Android",
    "agent_class": "Browser"
  },
  "eventData": {
    "client_user_id": "u-ua-1",
    "click_id": "rs-ua-1",
    "event_name": "register",
    "user_agent": "Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36",
    "recv_timestamp": 1789541015965,
    "request_id": "..."
  },
  "misspelledFields": []
}
```

#### 你发的 vs. 我们记的

你的载荷与回显之间的差异，大部分是我方补充的富化项：

| 你发的 | 我们记的 |
|-------------|-------------|
| `ip_address` | 由该 IP 解析出的国家与城市 |
| `user_agent` | `userAgentInfo`——设备类别与型号、操作系统名称与版本、客户端名称与类别 |
| `amount` + `currency` | 按我方公布的汇率换算后的金额 |
| `game_type` | 归一化后的游戏类型 |
| `transaction_id`（你未提供时） | 由我方生成的 `transaction_id` |
| — | `recv_timestamp`——**我方**接收到该事件的时间，单位毫秒 |
| — | `request_id` / `requestId`——本次调用的追踪 id。就此次调用询问我们时请带上它 |

接下来两节是这张表的反面——**哪些东西我们没有按你以为的样子记下来**。

#### 两种拼法

> [!WARNING]
> **绝对不要把回显里的字段名抄回你的请求里。** 你发送的字段是 `snake_case`（`client_user_id`、`click_id`、`ip_address`、`event_name`、`user_agent`）；**回显的顶层字段是 `camelCase`**（`requestId`、`clickId`、`userAgentInfo`），而嵌在其中的 `eventData` 又回到 `snake_case`。

拼错一个键的代价取决于该字段是否必填——而且损害程度与响度正好相反：

  * **必填**字段拼错返回 `400`。很响亮，几分钟就修好了。
  * **可选**字段拼错返回 `200`，事件照常落库，而那个字段静默消失。把 `user_agent` 写成 `userAgent`，`userAgentInfo` 整个为空——设备与操作系统维度全丢，而且哪里都不会报错。
  * **`click_id` 属于后一类。** 拼成 `clickId` 会得到 `200`、事件落库、看起来一切正常——只是这条转化永远归因不上。

#### misspelledFields

每一份 dry run 回显里都带有一个 `misspelledFields` 列表。它列出你发来的、明显是我方字段但拼法不同的键——正是它让上面那种静默失败在上线前变得可见：

``` JSON
"misspelledFields": [{ "sent": "userAgent", "expected": "user_agent" }]
```

`sent` 是你原样发来的键名，`expected` 是我方本来会匹配到的字段。请把你的载荷改成 `expected` 的写法。

**空数组就是你想要的答案。** 单条请求干净通过时返回的是 `"misspelledFields": []`。这个键恒定存在，所以 `[]` 的含义是*我们检查过了、没发现问题*，而不是*这个端点还没有这项检查*。

##### 我们不拒绝未知字段

**自定义属性是我方支持的能力，不是错误。** 我方不认识的键会被原样收进事件属性里——1.1 节里 `<<any_prop>>` 那一行正是为此而设。

所以这项检查刻意做得很窄：它只报那些看起来**是我方字段、只是拼法不同**的键。比对前会先把名字统一成小写并去掉分隔符，只有这样处理之后与我方已知字段撞名的键才会被报出来。

| 你发的 | 是否报告 | 原因 |
|-------------|-------------|-------------|
| `userAgent`、`User-Agent` | 报告 | 与 `user_agent` 撞名 |
| `CLIENTUSERID` | 报告 | 与 `client_user_id` 撞名 |
| `user_agent` | 不报告 | 拼写正确 |
| `bonus_round_id`、`vip_tier`、`table_id` | 不报告 | 正当的自定义属性——不与我方任何字段撞名 |

> [!IMPORTANT]
> **你自己的自定义属性没有出现在这个列表里，正是应有的结果，并不代表它被忽略了。** 它们会被原样记录下来。不要因为 dry run 没提到某个自定义属性，就把你本来要用的这个字段删掉。

## 请求体 Schema 使用场景

#### 用户注册

``` JSON
{
  "client_user_id": "<<THE UNIQUE USER ID>>",
  "click_id": "<<THE UNIQUE CLICK ID>>",
  "event_name": "register",
  "timestamp": UTC seconds,
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
  "timestamp": UTC seconds,
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
  "timestamp": UTC seconds,
  "ip_address": "<<THE END USER IP>>",
  "is_crypto": true | false
}
```

#### 用户投注与输赢

投注的下注金额（`bet`）与结算结果（`win` / `loss`）需要分别上报。根据游戏的结算时机，**请在以下两种方式中二选一**上报结算结果，**切勿同时使用**，否则会导致重复计入。

- **方式 A — 合并上报（适用于即时结算游戏，如老虎机、轮盘）**：在 `bet` 事件中直接带上 `bet_result` 与 `bet_result_amount`，下注与结算一次性完成。
- **方式 B — 分开上报（适用于延迟结算游戏，如体育投注、扑克）**：先发送不带结算字段的 `bet` 事件，待结算完成后再发送独立的 `win` 或 `loss` 事件，并通过 `parent_transaction_id` 关联到原 `bet` 事件的 `transaction_id`。

##### 方式 A：bet 事件合并上报结算结果

``` JSON
{
  "client_user_id": "<<THE UNIQUE USER ID>>",
  "event_name": "bet",
  "game_type": "<<THE GAME TYPE>>",
  "game_provider": "<<THE GAME PROVIDER>>",
  "currency": "<<THE CURRENCY, eg: USD | EUR | BTC>>",
  "amount": 5.00,
  "transaction_id": "<<THE UNIQUE TRANSACTION ID>>",
  "timestamp": UTC seconds,
  "is_crypto": true | false,

  "bet_result": "win | loss",
  "bet_result_amount": 1.00
}
```

*注：`amount` 为玩家的下注金额；`bet_result_amount` 表示玩家的净输赢结果。当 `bet_result` 为 `win` 时填写**正值**；当 `bet_result` 为 `loss` 时填写**负值**（例如 `-5.00`）。*

##### 方式 B：独立的 win / loss 事件

先发送不含 `bet_result` / `bet_result_amount` 的 `bet` 事件（仅记录下注），结算后再发送对应的 `win` 或 `loss` 事件：

``` JSON
{
  "client_user_id": "<<THE UNIQUE USER ID>>",
  "event_name": "win | loss",
  "game_type": "<<THE GAME TYPE>>",
  "game_provider": "<<THE GAME PROVIDER>>",
  "currency": "<<THE CURRENCY, eg: USD | EUR | BTC>>",
  "amount": 5.00,
  "transaction_id": "<<THE UNIQUE TRANSACTION ID>>",
  "parent_transaction_id": "<<THE PARENT BET TRANSACTION ID>>",
  "timestamp": UTC seconds,
  "is_crypto": true | false
}
```

*注：`amount` 表示玩家的净输赢结果。当 `event_name` 为 `win` 时填写**正值**；当 `event_name` 为 `loss` 时填写**负值**（例如 `-5.00`）。`parent_transaction_id` 必须与对应 `bet` 事件的 `transaction_id` 一致，用于建立关联。*


#### 用户提现

``` JSON
{
  "client_user_id": "<<THE UNIQUE USER ID>>",
  "event_name": "withdraw",
  "currency": "<<THE CURRENCY, eg: USD | EUR | BTC>>",
  "amount": 5.00,
  "transaction_id": "<<THE UNIQUE TRANSACTION ID>>",
  "timestamp": UTC seconds,
  "ip_address": "<<THE END USER IP>>",
  "is_crypto": true | false
}
```
