---
title: RevoSurge Server Events API
sidebar_label: Server Events API
description: S2S events to DataPulse. API reference, auth, single/batch ingest.
---

# RevoSurge Server Events API

**Audience:** Engineers, technical integrators, Admin teams

## Overview

The Server Events API allows partners to securely send user events and user activities directly from their servers to the DataPulse platform.

This API is designed for high-throughput scenarios and requires strict authentication via API Keys.

## Base URL

| Environment | Base URL |
|-------------|----------|
| Production  | `https://datapulse-api.revosurge.com/` |

## Authentication
 
All requests to the Server Events API must include an API Key in the request header `X-API-Key`.    

#### Required Headers

| Header Name | Description |
|-------------|-------------|
| `X-API-Key` | API Key for authentication |

## Ingestion Endpoints

#### 1. Single Ingest Event

| Path | Method | Content-Type |
|-------- |--------|----------|
| `/v2/s2s/event` | POST   | `application/json` |

#### 1.1 Request Body Schema

The request body accepts a JSON object with the following fields:

| Field | Type | Required | Description |
|-------------|----------|-------------|-------------|
| `client_user_id` | String | Yes | Unique identifier of the user in your system. |
| `click_id` | String | Yes | Unique ID for the ad click. <br > **Suggested**. |
| `event_name` | String | Yes | Name of the event (e.g., "register", "login", "deposit"). |
| `timestamp` | Integer | Yes | Unix timestamp (in seconds) when the event occurred. |
| `ip_address` | String | Yes | IP address of the user (IPv4/IPv6). |
| `user_agent` | String | No | User agent string of the browser or device. |
| `game_type` | String | No | Type of the game (e.g., "slot", "casino"). |
| `game_provider` | String | No | Provider of the game (e.g., "EA", "GGP"). |
| `transaction_id` | String | *Yes** | Unique ID for the transaction (e.g., purchase ID). |
| `amount` | Float | *Yes** | Monetary value of the transaction (e.g., deposit amount). |
| `currency` | String | *Yes** | 3-letter ISO currency code (e.g., USD, EUR) for fiat currency, or any specific code for crypto. |
| `is_crypto` | Boolean | No | Set to `true` if the transaction is crypto-based, otherwise `false`. |
| `<<any_prop>>` | String | No | Additional custom properties as key-value pairs. |

*PS: The `transaction_id`, `amount`, `currency` is not required in non-financial events (eg. login).*

#### 1.2 Example Request (curl)

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

#### 2. Batch Ingest Event

| Path | Method | Content-Type |
|-------- |--------|----------|
| `/v2/s2s/batch` | POST   | `application/json` |

#### 2.1 Request Body Schema

The request body accepts a JSON object of array type. The array item is referenced as defined in section 1.1.

## Responses

| Status Code | Description |
|-------------|-------------|
| 200 OK | Event successfully queued for processing |
| 400 Bad Request | Missing required fields |
| 401 Unauthorized | Invalid API Key or missing auth headers |
| 429 Too Many Requests | Rate limit exceeded |
| 500 Server Error | Internal processing error. Please retry with backoff |

## Rate Limit

  * Limits are applied per X-API-KEY.
  * Standard Limit: 60 requests per minute (Default).
  * If you exceed the limit, you will receive a 429 response. 
  * Retry Strategy: We recommend implementing an exponential backoff strategy when encountering 429 or 500 errors.   

## Dry run

Add `?dryrun=1` to either ingestion endpoint to check a request end to end without creating any data. We parse, authenticate, validate and enrich it exactly as we would in production, echo back the record we would have written, and then store nothing.

| Endpoint | Dry-run URL |
|-------- |----------|
| Single | `POST /v2/s2s/event?dryrun=1` |
| Batch | `POST /v2/s2s/batch?dryrun=1` |

`dryrun` on its own and `dryrun=true` mean the same thing. `dryrun=0`, `dryrun=false` and `dryrun=no` turn it off.

#### Telling a dry run apart from a real write

| Call | Status Code | Body | Response Header |
|-------------|----------|-------------|-------------|
| Real write | 200 OK | `{ "status": "success" }` | — |
| Dry run | 200 OK | The echoed record | `X-Ingest-Mode: dryrun` |

> [!WARNING]
> Both answer `200`, so the status code alone does not tell you which one you got — read the body and the `X-Ingest-Mode: dryrun` response header. **A dry run that passes is not a write.** Nothing sent with `dryrun=1` is ever stored.

A dry run is authenticated as usual and **counts against your rate limit as usual** — one batch request counts as one request. It is not a load-testing entry point.

#### The echoed record

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

The response is the record we would have stored:

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

#### What you send vs. what we record

Most of the difference between your payload and the echo is enrichment we add:

| You send | We record |
|-------------|-------------|
| `ip_address` | The country and city resolved from that IP |
| `user_agent` | `userAgentInfo` — device class and name, OS name and version, agent name and class |
| `amount` + `currency` | The amount converted with our published exchange rates |
| `game_type` | The normalized game type |
| `transaction_id`, when you omit it | A `transaction_id` we generate |
| — | `recv_timestamp` — the time **we** received the event, in milliseconds |
| — | `request_id` / `requestId` — the trace id for this call. Quote it when you ask us about it |

The next two sections are the other side of that table — **what we did not record the way you meant it**.

#### The two spellings

> [!WARNING]
> **Never copy a field name out of the echo into your request.** What you send is `snake_case` (`client_user_id`, `click_id`, `ip_address`, `event_name`, `user_agent`). The **top level of the echo is `camelCase`** (`requestId`, `clickId`, `userAgentInfo`), and the `eventData` nested inside it is `snake_case` again.

What a misspelled key costs you depends on whether the field is required — and the damage runs opposite to the noise:

  * A misspelled **required** field returns `400`. Loud, and fixed in minutes.
  * A misspelled **optional** field returns `200`, the event is stored, and the field silently disappears. Send `userAgent` instead of `user_agent` and `userAgentInfo` comes back empty — the whole device and operating-system dimension is gone, with no error anywhere.
  * **`click_id` belongs to the second group.** `clickId` gets you a `200`, a stored event and something that looks entirely normal — except that conversion is never attributed.

#### misspelledFields

Every dry-run echo carries a `misspelledFields` list. It names the keys you sent that are recognizably ours but spelled differently — which is what makes the silent failure above visible, before you go live:

``` JSON
"misspelledFields": [{ "sent": "userAgent", "expected": "user_agent" }]
```

`sent` is the key exactly as you sent it; `expected` is the field we would have matched it to. Change your payload to use `expected`.

**An empty array is the answer you want.** A clean single-event dry run returns `"misspelledFields": []`. The key is always there, so `[]` means *we ran the check and found nothing* — not *this endpoint has no such check*.

##### We do not reject unknown fields

**Custom properties are a supported feature, not a mistake.** A key we do not recognize is kept verbatim in the event's properties — that is exactly what the `<<any_prop>>` row in section 1.1 is for.

So this check is deliberately narrow: it reports only keys that look like **ours, spelled differently**. Names are compared after folding to lower case and dropping separators, and a key is reported only if it then collides with a field we know.

| You send | Reported? | Why |
|-------------|-------------|-------------|
| `userAgent`, `User-Agent` | Yes | Collides with `user_agent` |
| `CLIENTUSERID` | Yes | Collides with `client_user_id` |
| `user_agent` | No | Spelled correctly |
| `bonus_round_id`, `vip_tier`, `table_id` | No | Legitimate custom properties — they collide with nothing of ours |

> [!IMPORTANT]
> **Your own custom properties not showing up in this list is the correct outcome, not a sign that they were ignored.** They are recorded exactly as you sent them. Do not delete a custom property you rely on because a dry run stayed quiet about it.

## Use Case Scenarios on Request Body Schema

#### User Register

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

#### User Login

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

#### User Deposit

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

#### User Bet & Win/Loss

The bet stake (`bet`) and its settlement outcome (`win` / `loss`) must both be reported. Depending on when the game settles, **choose one of the two patterns below — do not use both**, or the result will be double-counted.

- **Pattern A — Combined (for instantly-settled games such as slots or roulette):** include `bet_result` and `bet_result_amount` directly in the `bet` event so the stake and the outcome are reported in a single call.
- **Pattern B — Separate (for delayed-settlement games such as sports betting or poker):** first send the `bet` event without the result fields, then send a standalone `win` or `loss` event after settlement, linking it back to the original bet via `parent_transaction_id`.

##### Pattern A: bet event with embedded result

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

*Note: `amount` is the stake placed by the player; `bet_result_amount` represents the player's net result. Send a **positive** value when `bet_result` is `win`, and a **negative** value when `bet_result` is `loss` (e.g. `-5.00`).*

##### Pattern B: standalone win / loss event

Send a `bet` event without `bet_result` / `bet_result_amount` first (recording only the stake), then send the corresponding `win` or `loss` event once the bet settles:

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

*Note: `amount` represents the player's net result. Send a **positive** value when `event_name` is `win`, and a **negative** value when `event_name` is `loss` (e.g. `-5.00`). `parent_transaction_id` must match the `transaction_id` of the original `bet` event so the two can be linked.*


#### User Withdraw

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
