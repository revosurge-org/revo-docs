---
title: RevoSurge 伺服器事件 API
sidebar_label: 伺服器事件 API
description: 向 DataPulse 發送 S2S 事件。API 參考、認證、單條/批次接入。
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
| `event_name` | String | 是 | 事件名稱(如 "register"、"login"、"deposit")。 |
| `timestamp` | Integer | 是 | 事件發生的 Unix 時間戳(秒)。 |
| `ip_address` | String | 是 | 用戶的 IP 地址(IPv4/IPv6)。 |
| `user_agent` | String | 否 | 瀏覽器或裝置的 User Agent 字串。 |
| `game_type` | String | 否 | 遊戲類型(如 "slot"、"casino")。 |
| `game_provider` | String | 否 | 遊戲提供商(如 "EA"、"GGP")。 |
| `transaction_id` | String | *是** | 交易唯一 ID(如購買 ID)。 |
| `amount` | Float | *是** | 交易金額(如充值金額)。 |
| `currency` | String | *是** | 法幣的 3 字母 ISO 貨幣代碼(如 USD、EUR)，或加密貨幣的任意代碼。 |
| `is_crypto` | Boolean | 否 | 若為加密貨幣交易則為 `true`，否則為 `false`。 |
| `<<any_prop>>` | String | 否 | 其他自訂屬性的鍵值對。 |

*註：非財務事件(如 login)中 `transaction_id`、`amount`、`currency` 非必填。*

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
  * 標準限制：每分鐘 60 次請求(預設)。
  * 超出限制將回傳 429 回應。 
  * 重試策略：建議在遇到 429 或 500 錯誤時實施指數退避策略。   

## Dry run

在任一接入端點上加 `?dryrun=1`，即可端到端檢查一條請求而不產生任何數據。我們會完全按生產路徑解析、鑑權、驗證並豐富它，把將要寫入的那條記錄原樣回顯，然後甚麼都不存。

| 端點 | Dry run URL |
|-------- |----------|
| 單條 | `POST /v2/s2s/event?dryrun=1` |
| 批次 | `POST /v2/s2s/batch?dryrun=1` |

裸寫 `dryrun` 與 `dryrun=true` 意思相同。`dryrun=0`、`dryrun=false`、`dryrun=no` 表示不啟用。

#### 如何把 dry run 與真實寫入分開

| 調用 | 狀態碼 | 回應內容 | 回應標頭 |
|-------------|----------|-------------|-------------|
| 真實寫入 | 200 OK | `{ "status": "success" }` | — |
| Dry run | 200 OK | 回顯的那條記錄 | `X-Ingest-Mode: dryrun` |

> [!WARNING]
> 兩者都回 `200`，所以單看狀態碼分不出你拿到的是哪一種 — 請看回應內容與 `X-Ingest-Mode: dryrun` 回應標頭。**dry run 通過不等於寫入成功。** 帶 `dryrun=1` 傳出的內容永遠不會被存下來。

dry run **照常鑑權**，也**照常計入限流** — 一次批次請求算一次請求。它不是壓測入口。

#### 回顯的那條記錄

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

回應就是我們本來會存下的那條記錄：

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

#### 你傳的 vs. 我們記的

你的載荷與回顯之間的差異，大部分是我方補上的豐富項：

| 你傳的 | 我們記的 |
|-------------|-------------|
| `ip_address` | 由該 IP 解析出的國家與城市 |
| `user_agent` | `userAgentInfo` — 裝置類別與型號、作業系統名稱與版本、用戶端名稱與類別 |
| `amount` + `currency` | 按我方公布的匯率換算後的金額 |
| `game_type` | 正規化後的遊戲類型 |
| `transaction_id`（你未提供時） | 由我方產生的 `transaction_id` |
| — | `recv_timestamp` — **我方**接收到該事件的時間，單位毫秒 |
| — | `request_id` / `requestId` — 本次調用的追蹤 id。就這次調用向我們查詢時請帶上它 |

接下來兩節是這張表的反面 — **哪些東西我們沒有按你以為的樣子記下來**。

#### 兩種拼法

> [!WARNING]
> **絕對不要把回顯裏的欄位名抄回你的請求。** 你傳送的欄位是 `snake_case`（`client_user_id`、`click_id`、`ip_address`、`event_name`、`user_agent`）；**回顯的頂層欄位是 `camelCase`**（`requestId`、`clickId`、`userAgentInfo`），而嵌在其中的 `eventData` 又回到 `snake_case`。

拼錯一個鍵的代價取決於該欄位是否必填 — 而且損害程度與響度剛好相反：

  * **必填**欄位拼錯回傳 `400`。很響亮，幾分鐘就修好了。
  * **可選**欄位拼錯回傳 `200`，事件照常落庫，而那個欄位靜默消失。把 `user_agent` 寫成 `userAgent`，`userAgentInfo` 整個為空 — 裝置與作業系統維度全失，而且哪裏都不會報錯。
  * **`click_id` 屬於後一類。** 拼成 `clickId` 會得到 `200`、事件落庫、看來一切正常 — 只是這條轉換永遠歸因不上。

#### misspelledFields

每一份 dry run 回顯裏都帶有一個 `misspelledFields` 清單。它列出你傳來的、明顯是我方欄位但拼法不同的鍵 — 正是它令上面那種靜默失敗在上線前變得看得見：

``` JSON
"misspelledFields": [{ "sent": "userAgent", "expected": "user_agent" }]
```

`sent` 是你原樣傳來的鍵名，`expected` 是我方本來會匹配到的欄位。請把你的載荷改成 `expected` 的寫法。

**空陣列就是你想要的答案。** 單條請求乾淨通過時回傳的是 `"misspelledFields": []`。這個鍵恆定存在，所以 `[]` 的意思是*我們檢查過了、沒發現問題*，而不是*這個端點還沒有這項檢查*。（批次的呈現方式不同，見下文。）

##### 我們不拒絕未知欄位

**自訂屬性是我方支援的能力，不是錯誤。** 我方不認識的鍵會被原樣收進事件屬性裏 — 1.1 節裏 `<<any_prop>>` 那一行正是為此而設。

所以這項檢查刻意做得很窄：它只報那些看來**是我方欄位、只是拼法不同**的鍵。比對前會先把名字統一成小寫並去掉分隔符，只有這樣處理之後與我方已知欄位撞名的鍵才會被報出來。

| 你傳的 | 是否報告 | 原因 |
|-------------|-------------|-------------|
| `userAgent`、`User-Agent` | 報告 | 與 `user_agent` 撞名 |
| `CLIENTUSERID` | 報告 | 與 `client_user_id` 撞名 |
| `user_agent` | 不報告 | 拼寫正確 |
| `bonus_round_id`、`vip_tier`、`table_id` | 不報告 | 正當的自訂屬性 — 不與我方任何欄位撞名 |

> [!IMPORTANT]
> **你自己的自訂屬性沒有出現在這個清單裏，正是應有的結果，並不代表它被忽略了。** 它們會被原樣記錄下來。不要因為 dry run 沒提到某個自訂屬性，就把你本來要用的這個欄位刪掉。

#### 批次 dry run

`POST /v2/s2s/batch?dryrun=1` 會同步回傳逐條結果：

``` JSON
{
  "requestId": "s2s.batch-...",
  "mode": "dryrun",
  "total": 3,
  "successCount": 2,
  "failureCount": 1,
  "successEvents": ["... 豐富後的事件 ..."],
  "errors": [
    {
      "index": 2,
      "violations": [
        { "field": "eventName", "rule": "required", "event": "deposit" },
        { "field": "clientUserId", "rule": "required", "event": "deposit" }
      ]
    }
  ],
  "misspelledFields": { "1": [{ "sent": "clickId", "expected": "click_id" }] }
}
```

  * `errors[].index` 是該條目在你傳送的陣列中的索引，由 `0` 數起；每個 `violations[]` 條目指出是哪個欄位出了問題、違反了哪條規則 — 兩者合起來告訴你*第幾條、哪個欄位、違反哪條規則*。
  * **`misspelledFields` 是一個頂層物件，按同一套索引編排。** 它不掛在 `successEvents` 裏的各個事件上。上例是：第 `1` 條（也就是你傳的第二條）把 `click_id` 拼成了 `clickId`。
  * **全部拼對時這個鍵整個不出現** — 不是空物件，也不是空陣列。這一點與單條不同：單條恆定回傳 `misspelledFields: []`。所以不要拿「鍵是否存在」當判斷依據。

> [!NOTE]
> `violations[].field` 告訴你的是*哪個*欄位出了問題，但它的寫法不一定與你請求裏的寫法一致。請按請求側的名字去修 — 請求欄位是 `snake_case`（`event_name`、`client_user_id`）。

## 請求體 Schema 使用場景

#### 用戶註冊

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

#### 用戶登入

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

#### 用戶充值

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

#### 用戶投注與輸贏

投注的下注金額（`bet`）與結算結果（`win` / `loss`）需要分別上報。根據遊戲的結算時機，**請在以下兩種方式中二選一**上報結算結果，**切勿同時使用**，否則會導致重複計入。

- **方式 A — 合併上報（適用於即時結算遊戲，如老虎機、輪盤）**：在 `bet` 事件中直接帶上 `bet_result` 與 `bet_result_amount`，下注與結算一次性完成。
- **方式 B — 分開上報（適用於延遲結算遊戲，如體育博彩、撲克）**：先發送不帶結算欄位的 `bet` 事件，待結算完成後再發送獨立的 `win` 或 `loss` 事件，並透過 `parent_transaction_id` 關聯到原 `bet` 事件的 `transaction_id`。

##### 方式 A：bet 事件合併上報結算結果

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

*註：`amount` 為玩家的下注金額；`bet_result_amount` 表示玩家的淨輸贏結果。當 `bet_result` 為 `win` 時填寫**正值**；當 `bet_result` 為 `loss` 時填寫**負值**（例如 `-5.00`）。*

##### 方式 B：獨立的 win / loss 事件

先發送不含 `bet_result` / `bet_result_amount` 的 `bet` 事件（僅記錄下注），結算後再發送對應的 `win` 或 `loss` 事件：

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

*註：`amount` 表示玩家的淨輸贏結果。當 `event_name` 為 `win` 時填寫**正值**；當 `event_name` 為 `loss` 時填寫**負值**（例如 `-5.00`）。`parent_transaction_id` 必須與對應 `bet` 事件的 `transaction_id` 一致，用於建立關聯。*


#### 用戶提現

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
