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
| `attribution_share` | 選填 | 你方聲明的本次轉換歸因份額 — 參閱[你方聲明欄位的含義](#你方聲明欄位的含義) |
| `is_new_customer` | 選填 | 你方聲明該玩家對**你們**是新客。接受 `1`/`0`、`true`/`false`、`yes`/`no` |
| `first_deposit_ts` | 選填 | 你方聲明的首存時刻，**unix 毫秒** — 與 `ts` 同單位、同解析規則 |
| `hash_id`、`hash_name` | 建議 | 你方的連結／帳號分類識別碼 |
| `source_id`、`source_name` | 建議 | 你方的流量來源分類識別碼 |

\* **`click_id` 與 `user_id` 至少要有其一。** 兩者皆無的 postback 無法對應到任何對象，會被丟棄（並回 `200` — 參閱[回應](#回應)）。

未在此列出的參數會**原樣保留**在已儲存的事件上，所以你日後新增的宏，毋須我們改動即可送達。

### 你方聲明欄位的含義

`attribution_share`、`is_new_customer`、`first_deposit_ts` 是**你方的聲明**。RevoSurge 會把它們記錄在我方自行計算的結果**旁邊**，而不是用來取代它。

三者都是**選填**的，而且**新增它們毋須重新註冊現有 URL** — 已註冊的連結一切照舊，我方收不到的參數只會記為空值。若你是首次註冊，建議現在就把它們加進模板，以免日後再付一次重新註冊的成本：

```text
&attribution_share={attribution_share}&is_new_customer={is_new_customer}&first_deposit_ts={first_deposit_ts}
```

- **`attribution_share` 原樣儲存。** 契約並未聲明它的標度 — `0.5` 與 `50` 都讀作「一半」 — 因此 RevoSurge 既不換算，也不會用它去乘任何金額。在有人依賴這個數字之前，請先與我們明確約定標度。
- **`is_new_customer` 是你方的判斷，不是我方的首存計算。** 我方仍然獨立判定首次存款；兩者的差值是對帳訊號，不是錯誤。我方讀不懂的值會記為空值，絕不記為 `0` — 「你說不是」與「我方讀不懂」不能塌縮成同一個答案。
- **`first_deposit_ts` 完全遵循 `ts` 的規則。** 參閱[數值如何被解讀](#數值如何被解讀)。

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
| `ts` | **unix 毫秒**，這一點沒有變。若我方收到秒級值，會歸一化後記錄事件時間 — 但這次修正會被視為**契約偏離**：它會觸發我方告警，我們會與你聯絡。它不是第二種受支援的格式，請不要依賴它。兩種讀法都不成立的值（超出合理範圍、負數、非數字）**無法還原事件時間**：該事件將沒有時間戳，只保留原始字串 |
| `first_deposit_ts` | 與 `ts` 的規則完全一致 — 同單位、同修正、同告警 |
| `attribution_share` | 原樣記錄，絕不換算標度，也絕不用它乘任何金額 — 參閱[你方聲明欄位的含義](#你方聲明欄位的含義) |
| 事件時效 | 超過 **30 天**的舊事件，或超過未來 **60 分鐘**的事件，會被記錄並標記，而不會被拒絕。在終身收入分成之下，舊玩家的收入事件正是這條整合存在的意義 |
| 未替換的宏 | 以字面宏形式到達的值（例如 `click_id={sub1}`）會視為缺失，而不是一個字串。見下文 |

### 未替換的宏

URL 被貼進電郵或工單後，會被連結掃描器抓取，此時宏仍是字面值。若不處理，`click_id={sub1}` 就是一個非空字串，會憑空造出一筆看來完全合法的轉換。因此：

- `click_id` 或 `user_id` 出現字面宏，**整條 postback 會被丟棄**（`200 ignored`）。
- 其他參數出現字面宏，只損失那一個欄位；事件其餘部分照常記錄，字面值原樣保留以便排查。

## Dry run

在這四條 postback URL 的任意一條後面加上 `dryrun=1`，就能看到我們會作出的判定，而不記錄任何內容。請求會完全按生產路徑鑑權、解析、驗證並豐富；我們隨後把判定結果回傳給你，而不是把它存下來。

```bash
curl -sS -G "https://mmp.revosurge.com/v1/pb/{partner}/first-deposit" \
  --data-urlencode "k=$REVOSURGE_POSTBACK_KEY" \
  --data-urlencode "click_id=8f1c2d5e-4a7b-4c31-9e0d-6b2f7a1c93de" \
  --data-urlencode "event=sale" \
  --data-urlencode "amount=12.34" \
  --data-urlencode "ts=1789540000" \
  --data-urlencode "dryrun=1"
```

裸寫 `dryrun` 與 `dryrun=true` 意思相同；`dryrun=0`、`dryrun=false`、`dryrun=no` 表示不啟用。dry run 恆回傳 `200`，並帶回應標頭 `X-Ingest-Mode: dryrun`。它照常鑑權 — 金鑰錯誤依然是 `403` — 也照常計入限流。

> [!WARNING]
> **不要把 `dryrun` 留在你註冊的 URL 裏。** 一條註冊了 dry run 的 URL 會對每一筆轉換都回 `200`，而一筆都不記錄。

### 為甚麼需要它

postback 的契約[絕不會因為負載問題而回 `4xx`](#回應)。正是這一點令格式有問題的 postback 不至於被整條停用 — 但它同時也意味著，被丟棄的 postback 與被存下的 postback 從外面看完全一樣：三種被丟棄的情形回傳的都是同一個 `200 {"status":"ignored"}`。dry run 則把判定結果顯式回傳。

### 判定結果

```json
{
  "mode": "dryrun",
  "partner": "1win",
  "route": "first_deposit",
  "decision": "accepted",
  "eventName": "deposit",
  "eventDeclared": "sale",
  "reportedFirst": 1,
  "dedupKey": "h:14e576df...",
  "dedupKeySource": "raw_hash",
  "clickId": "8f1c2d5e-4a7b-4c31-9e0d-6b2f7a1c93de",
  "userId": "8f1c2d5e-4a7b-4c31-9e0d-6b2f7a1c93de",
  "userIdBackfilled": true,
  "unreplacedMacros": [],
  "eventUnixTs": 1789540000,
  "eventTimeRaw": "1789540000",
  "coercedTimeFields": ["ts", "first_deposit_ts"],
  "amount": 12.34,
  "currency": "USD",
  "unexpectedCurrency": "INR",
  "attributionShare": 0.5,
  "isNewCustomer": 1,
  "recorded": { "...": "原樣收下的全部參數" }
}
```

| 欄位 | 它告訴你甚麼 |
|-------|------|
| `decision` | `accepted`；若這條 postback 會被丟棄，則為 `ignored` |
| `reason` | 只在 `decision` 為 `ignored` 時出現：`unreplaced_macro`（宏以字面值形式到達我方 — 通常是連結被掃描器抓取了）、`empty_request`，或 `no_identity`（既沒有 `click_id` 也沒有 `user_id`）。在正式流量裏這三種回傳的都是同一個 `200 {"status":"ignored"}`，只有 dry run 能把它們分開 |
| `eventName` | 我們會記錄的事件類型。它由**端點路徑**決定 |
| `eventDeclared` | 你方 `{event}` 宏的原值，只作交叉核對之用。兩者不一致時以路徑為準 |
| `reportedFirst` | 由路徑推出的首存標記 — 參閱[端點](#端點) |
| `dedupKey` / `dedupKeySource` | 這條 postback 歸約出的去重鍵，以及它的來源：先 `event_id`，再 `transaction_id`（即你的 `txid`），最後後備用 `raw_hash`。**看到 `raw_hash` 代表沒有收到 `event_id`** — 這是應該在上線前就知道的事，而不是等一次重試被重複計數之後才發現。參閱[去重](#去重) |
| `clickId` / `userId` | 我方解析出的身分識別 |
| `userIdBackfilled` | `true` 表示沒有收到 `user_id`，我方用 `click_id` 頂上了 |
| `unreplacedMacros` | 以字面宏形式到達的參數。參閱[未替換的宏](#未替換的宏) |
| `eventUnixTs` / `eventTimeRaw` | 我方解析出的事件時間，以及它所依據的原始取值 |
| `coercedTimeFields` | 你以秒為單位傳送、由我方替你換算過的時間欄位。**空清單才是目標** — 這裏出現任何欄位都是一次契約偏離，會觸發我方告警 |
| `amount` / `currency` | 我們會按結算幣別記帳的數值 |
| `unexpectedCurrency` | 當你聲明了 `USD` 以外的幣別時出現。我方按 `USD` 記帳，**不**做換算 |
| `attributionShare` / `isNewCustomer` | 我方讀到的你方聲明欄位。參閱[你方聲明欄位的含義](#你方聲明欄位的含義) |
| `recorded` | 原樣收下的全部參數 |

## 驗證整合

檢查一條真實負載最快的辦法是 [dry run](#dry-run) — 它會回傳判定結果、去重鍵與我方解析出的身分識別，而不記錄任何內容。

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

1. **`ts`（以及若你傳送 `first_deposit_ts`）的單位與時區** — 請傳毫秒。秒級值會被修正，但那會計為一次契約偏離，我們會來找你；兩種讀法都不成立的值會令該事件完全沒有時間。
2. **`event_id` 是否真的送達** — 我們能量度雜湊後備被使用的比例，這個數字應該是零。
3. **`hash_id` 與 `source_id` 的實際值** — 在我們記錄你的基準值之前，漂移告警是靜默的。
