---
title: RevoSurge 合作夥伴 Postback API
sidebar_label: 合作夥伴 Postback API
description: 合作夥伴 Postback 參考 — 端點、金鑰認證、宏參數、回應約定、去重及重試規則。
---

# RevoSurge 合作夥伴 Postback API

**對象：** 工程師、技術整合人員、聯盟／合作夥伴經理

合作夥伴 Postback API 讓營運方或聯盟平台可以從自己的後台，把轉換**回傳給 RevoSurge**。Postback 是帶查詢字串宏的普通 HTTP `GET` 回呼 — 聯盟後台本來就通用的格式 — 所以這次整合只是一次性的 URL 註冊，而不是你那邊的程式碼改動。

- 想從自己的伺服器傳送事件？請使用[伺服器事件 API (v3)](/hk/tracking/s2s/v3/server-events-api)。
- 初次接觸 RevoSurge 追蹤？請從[追蹤概述](/hk/tracking/overview)開始。

## Postback 與伺服器事件 API 的分別

| | 合作夥伴 Postback | [伺服器事件 API (v3)](/hk/tracking/s2s/v3/server-events-api) |
|---|---|---|
| 由誰發起呼叫 | 你的聯盟後台 | 你的後端 |
| 傳輸方式 | `GET` + 查詢字串宏 | `POST` + JSON 信封 |
| 認證 | `k` 參數中的靜態金鑰 | `X-API-KEY` 標頭 |
| 接入方式 | 按事件類型各註冊一條 URL | 自行撰寫一套整合 |
| 適用於 | 後台本身已會發出 postback 的營運方 | 需要完全掌控事件目錄與負載 |

> [!TIP]
> 兩者並不互斥。Postback 通常用於營運方後台掌握的結算事件（註冊、存款、收入分成），而伺服器事件 API 承載更豐富的產品內事件流。

## 基礎 URL

| 環境 | 基礎 URL |
|-------------|----------|
| Production  | `https://mmp.revosurge.com` |

> [!NOTE]
> 你的**夥伴代號 (partner slug)** 與**金鑰**由 RevoSurge 在對接時發放。下文路徑中的 `{partner}` 代表你的代號，註冊 URL 前請先替換。

## 認證

每一條 postback 都必須在 `k` 查詢參數中帶上 RevoSurge 發給你的靜態金鑰。

| 參數 | 必填 | 值 |
|-----------|----------|-------|
| `k` | 是 | 你的 postback 金鑰 |

- 金鑰以固定時間比較；不吻合會回 `403`，該 postback **不會**被儲存。
- RevoSurge 亦可能把你的 postback 限制在**出口 IP 白名單**內。請在對接時告知你的對外位址，以免日後你方的網絡變更變成無聲的 `403`。
- `k` 會從已儲存的事件中剝除，並在請求日誌中遮蔽，永遠不會進入事件記錄。

> [!WARNING]
> 金鑰以明文出現在 URL 中，並會保存在你的後台。請當作中等敏感度的共用密鑰處理：不要在別處重用；一旦外洩，請向 RevoSurge 申請輪換。**輪換需要雙方配合** — 我們會先放行新金鑰，你再切換，否則單方面輪換會令所有 postback 在後台更新前全部變成 `403`。

## 端點

RevoSurge 採用**本地 postback (local postback)**：每種事件類型一條 URL。**事件類型由 path 決定** — `event` 宏只作為交叉核對記錄下來，絕不用於判定轉換類型，所以你方模板展開值的變化，不會悄悄把我們的轉換重新分類。

<HttpMethod method="GET" path="/v1/pb/{partner}/registration" />

<HttpMethod method="GET" path="/v1/pb/{partner}/first-deposit" />

<HttpMethod method="GET" path="/v1/pb/{partner}/repeat-deposit" />

<HttpMethod method="GET" path="/v1/pb/{partner}/revenue" />

| 端點 | 記錄為 | `reported_first` | 何時觸發 |
|----------|-------------|------------------|--------------|
| `/registration` | `register` | — | 玩家帳號建立 — 第一個帶有玩家 id 的事件 |
| `/first-deposit` | `deposit` | `1` | 你的系統認定為該玩家首次存款的那一筆 |
| `/repeat-deposit` | `deposit` | `0` | 之後的任何一筆存款 |
| `/revenue` | `partner_revenue` | — | 一次收入分成結算事件 |

四條 URL 的**參數集完全一致** — 只有 path 不同 — 所以可以用同一份模板註冊。

關於記錄方式，有兩點需要說明：

- **`first-deposit` 與 `repeat-deposit` 都存為 `deposit`**，你對「首存」的判斷會保留為一個旗標，而不是當成事實。RevoSurge 會獨立計算首存，兩個口徑之間的差額就是零成本的對帳訊號。
- **`revenue` 存為 `partner_revenue`，而不是 GGR。** 它是佣金金額，與營運方 GGR 相差一個分成比率；把兩者混為一談是單位錯誤，不是命名喜好。

> [!WARNING]
> **已註冊 `first-deposit` 與 `repeat-deposit` 之後，請不要再註冊 "all deposits"** — 否則每一筆存款都會被重複計算。
>
> **請不要註冊 global postback**（一條 URL、事件類型放在宏裏）。事件類型已經在 path 內。日後若新增事件類型，我們會另外發一條 URL 給你。

## 參數

所有端點接受同一套參數。請把你後台的宏對應到這些參數名上 — 左邊的參數名是契約，右邊的宏語法是你方的。

| 參數 | 必填 | 說明 |
|-----------|----------|-------------|
| `k` | 是 | 你的 postback 金鑰（參閱[認證](#認證)） |
| `click_id` | 是\* | RevoSurge 的 click id，由投放時攜帶的 sub 參數原樣回傳（通常是 `{sub1}`）。唯一的活動層級歸因錨點 |
| `user_id` | 是\* | 你方的假名化玩家 id，用來把同一玩家的事件串連起來 |
| `ctx` | 建議 | RevoSurge 的投放脈絡，原樣回傳（通常是 `{sub2}`）。click id 過窗後的後備歸因 |
| `event_id` | 建議 | 你方全域唯一的事件 id，用作去重鍵 — 參閱[去重](#去重) |
| `txid` | 建議 | 交易 id，去重鍵的第二選擇 |
| `event` | 建議 | 你自己的事件類型宏。只作為與端點 path 的交叉核對記錄，不用於判定類型 |
| `amount` | 存款與收入必填 | 金額，十進位數。**帶正負號** — 參閱[數值如何被解讀](#數值如何被解讀) |
| `ts` | 建議 | 事件時間，**unix 毫秒** |
| `country` | 選填 | 玩家國家 |
| `hash_id`、`hash_name` | 建議 | 你方的連結／帳號分類識別碼 |
| `source_id`、`source_name` | 建議 | 你方的流量來源分類識別碼 |

\* **`click_id` 與 `user_id` 至少要有其一。** 兩者皆無的 postback 無法對應到任何對象，會被丟棄（並回 `200` — 參閱[回應](#回應)）。

未在此列出的參數會**原樣保留**在已儲存的事件上，所以你日後新增的宏，毋須我們改動即可送達。

### 為甚麼我們要那幾個分類欄位

對單一帳號的整合而言，`hash_id`、`hash_name`、`source_id`、`source_name` 通常是**常數**，今天並不參與歸因。我們仍然要求帶上，原因是：

1. 出現不屬於我們的值，代表流量接錯了 — 要麼別人的流量被指向我們的 URL，要麼我們的流量被登記在別的帳號下。這一項已接上監控與告警。
2. 一旦整合擴展到多條連結，它們立即就有意義。
3. 事後補一個宏，代表要在你的後台重新註冊這些 URL。由第一天就帶齊便宜得多。

## 範例

### URL 模板

註冊以下四條 URL，替換當中的夥伴代號與金鑰。`{...}` 內的值是**你後台的宏名稱** — 下例採用常見的 `sub1`／`sub2` 慣例。

```text
https://mmp.revosurge.com/v1/pb/{partner}/registration?k=<KEY>&click_id={sub1}&ctx={sub2}&event={event}&user_id={user_id}&event_id={event_id}&txid={transaction_id}&amount={amount}&ts={date}&country={country}&hash_id={hash_id}&hash_name={hash_name}&source_id={source_id}&source_name={source_name}

https://mmp.revosurge.com/v1/pb/{partner}/first-deposit?k=<KEY>&…相同的查詢字串…

https://mmp.revosurge.com/v1/pb/{partner}/repeat-deposit?k=<KEY>&…相同的查詢字串…

https://mmp.revosurge.com/v1/pb/{partner}/revenue?k=<KEY>&…相同的查詢字串…
```

### 一次實際觸發

::: code-group

```bash [cURL]
curl -sS -o /dev/null -w '%{http_code}\n' -G \
  "https://mmp.revosurge.com/v1/pb/{partner}/first-deposit" \
  --data-urlencode "k=$REVOSURGE_POSTBACK_KEY" \
  --data-urlencode "click_id=8f1c2d5e-4a7b-4c31-9e0d-6b2f7a1c93de" \
  --data-urlencode "ctx=ctx_9931" \
  --data-urlencode "event=first_deposit" \
  --data-urlencode "user_id=p_88213" \
  --data-urlencode "event_id=evt_5f3c9a10" \
  --data-urlencode "txid=txn_554433" \
  --data-urlencode "amount=100.00" \
  --data-urlencode "ts=1718280000000" \
  --data-urlencode "country=BR"
```

```text [最終 URL]
https://mmp.revosurge.com/v1/pb/{partner}/first-deposit
  ?k=<KEY>
  &click_id=8f1c2d5e-4a7b-4c31-9e0d-6b2f7a1c93de
  &ctx=ctx_9931
  &event=first_deposit
  &user_id=p_88213
  &event_id=evt_5f3c9a10
  &txid=txn_554433
  &amount=100.00
  &ts=1718280000000
  &country=BR
```

:::

## 回應

我們會在**確認寫入持久化儲存之後**才作答。因此 `200` 代表這筆轉換已被記錄，而不只是被收到。

| 狀態碼 | 回應內容 | 意思 | 是否重發 |
|--------|------|---------|---------|
| `200` | `{ "status": "ok" }` | 已儲存並確認 | 否 |
| `200` | `{ "status": "ignored" }` | 負載沒有可用的身分識別，沒有可記錄的對象 | 否 — 重發結果完全一樣 |
| `503` | `{ "status": "unavailable" }` | 我們無法確認寫入 | **是** — 這是唯一重發有意義的情況 |
| `403` | — | 金鑰錯誤，或來源 IP 不在白名單內 | 否 — 請先修正設定 |

> [!IMPORTANT]
> **我們絕不會因為負載問題而回 `4xx`。** `4xx` 一般會被理解為永久性錯誤，可能導致整條 postback 被停用 — 而原始 URL 已經保存在我們的請求日誌內，格式有問題的 postback 實際上就是在那裏被診斷的。若有 postback 被丟棄，你會從我們這邊收到通知，而不是靠狀態碼看出來。

### 我們期望的重試策略

- 在 `503`、連線錯誤與逾時的情況下重試。
- 使用指數退避，並且每次嘗試都**帶同一個 `event_id`**，讓重試折疊回原記錄。
- 收到 `200` 或 `403` 時不要重試。

## 去重

每條 postback 都會被歸約為一個**去重鍵 (dedup key)**，產生相同鍵的重發會折疊到同一筆記錄上，而不是新增一筆。鍵按以下順序選取：

1. 有 `event_id` 就用 `event_id`；
2. 沒有 `event_id` 就用 `txid`；
3. 兩者皆無，則取整條查詢字串的雜湊，並加上 `h:` 前綴。

後備方案刻意保守：它只能折疊**逐位元組相同**的重發（參數次序除外）。它是安全網，不能取代一個真正的 id。

> [!IMPORTANT]
> **請傳送全域唯一而穩定的 `event_id`，並在每次重試時原樣重複。** 沒有它，一條重試的收入事件與第二條真實的收入事件無法區分 — 而重試的存款會直接虛增結算金額。`event_id` 必須**跨事件類型唯一**，不只是在單一類型內唯一。

## 數值如何被解讀

| 欄位 | 規則 |
|-------|------|
| `amount` | 按帶正負號的十進位數解析。**負值是合法的** — 在收入分成之下，營運方虧損的期間對應一次負的收入事件。原始字串一律與解析值一併保留，所以解析失敗也不會遺失這個數字 |
| 幣別 | 結算幣別為 **USD**，我們不預期 currency 宏。若你傳來的 `currency` 參數不是 `USD`，它會被記錄並當作契約變更上報，而不會被靜默換算 |
| `ts` | **unix 毫秒。** 我們不會自動判斷是秒還是毫秒：契約寫的是毫秒，所以一個秒級的值本身就是「某處發生了偏移」的訊號，猜測只會把它掩蓋。超出合理區間的時間會存為空值，同時保留原始字串 |
| 事件時效 | 超過 **30 天**的舊事件，或超過未來 **60 分鐘**的事件，會被記錄並標記，而不會被拒絕。在終身收入分成之下，舊玩家的收入事件正是這條整合存在的意義 |
| 未替換的宏 | 以字面宏形式到達的值（例如 `click_id={sub1}`）會視為缺失，而不是一個字串。見下文 |

### 未替換的宏

URL 被貼進電郵或工單後，會被連結掃描器抓取，此時宏仍是字面值。若不處理，`click_id={sub1}` 就是一個非空字串，會憑空造出一筆看來完全合法的轉換。因此：

- `click_id` 或 `user_id` 出現字面宏，**整條 postback 會被丟棄**（`200 ignored`）。
- 其他參數出現字面宏，只損失那一個欄位；事件其餘部分照常記錄，字面值原樣保留以便排查。

## 驗證整合

在切入真實流量之前，請確認以下四種行為：

```bash
KEY="<your-key>"

# 1. 正常路徑 — 預期 200 {"status":"ok"}
curl -s "https://mmp.revosurge.com/v1/pb/{partner}/registration?k=$KEY&click_id=test-click-001&user_id=p_test"

# 2. 錯誤金鑰 — 預期 403
curl -s -o /dev/null -w '%{http_code}\n' "https://mmp.revosurge.com/v1/pb/{partner}/revenue?k=WRONG"

# 3. 沒有身分識別 — 預期 200 {"status":"ignored"}
curl -s "https://mmp.revosurge.com/v1/pb/{partner}/registration?k=$KEY"

# 4. 未替換的宏 — 預期 200 {"status":"ignored"}
curl -s "https://mmp.revosurge.com/v1/pb/{partner}/registration?k=$KEY&click_id=%7Bsub1%7D"
```

之後請透過你的後台送出一筆真實的測試轉換，並請我們逐欄核對。有三項特別值得明確確認，因為當中任何一項出錯，都會產出「看來乾淨、實際錯誤」的數據：

1. **`ts` 的單位與時區** — 秒／毫秒混用可以正常解析，卻會落到幾十年之外。
2. **`event_id` 是否真的送達** — 我們能量度雜湊後備被使用的比例，這個數字應該是零。
3. **`hash_id` 與 `source_id` 的實際值** — 在我們記錄你的基準值之前，漂移告警是靜默的。
