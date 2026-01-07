---
title: RevoSurge Server Events API
sidebar_label: Server Events API
---

# RevoSurge Server Events API

**Audience:** Engineers, technical integrators, Admin teams

## RevoSurge Server Events API Overview

The Server Events API allows partners to securely send user events and user activities directly from their servers to the DataPulse platform.

This API is designed for high-throughput scenarios and requires strict authentication via API Keys.

### RevoSurge Server Events API Base URL

| Environment | Base URL |
|-------------|----------|
| Production  | https://datapulse-api.revosurge.com/ |

### RevoSurge Server Events API Authentication
 
All requests to the Server Events API must include an API Key in the request header `X-API-Key`.    

#### Required Headers

| Header Name | Description |
|-------------|-------------|
| `X-API-Key` | API Key for authentication |

### Ingestion Endpoints

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
| `ip_address` | String | Yes | IP address of the user (IPv4/IPv6). |
| `user_agent` | String | No | User agent string of the browser or device. |
| `event_name` | String | Yes | Name of the event (e.g., "login", "deposit"). |
| `game_type` | String | No | Type of the game (e.g., "slot", "casino"). |
| `game_provider` | String | No | Provider of the game (e.g., "EA", "GGP"). |
| `transaction_id` | String | *Yes* | Unique ID for the transaction (e.g., purchase ID). |
| `timestamp` | Integer | Yes | Unix timestamp (in seconds) when the event occurred. |
| `amount` | Float | *Yes* | Monetary value of the transaction (e.g., deposit amount). |
| `currency` | String | *Yes* | 3-letter ISO currency code (e.g., USD, EUR) for fiat currency, or any specific code for crypto. |
| `is_crypto` | Boolean | No | Set to `true` if the transaction is crypto-based, otherwise `false`. |
| `<<any_prop>>` | String | No | Additional custom properties as key-value pairs. |

*PS: The `transaction_id`, `amount`, `currency` is not required in non-financial events (eg. login).*

#### 1.2 Example Request (curl)

```bash

    curl -X POST "https://<<our-url>>/v2/s2s/event" \                                                                                
       -H "Content-Type: application/json" \                                                                                                  
       -H "X-API-KEY: dp_test_key_123" \                                                                                                                                                                                       
       -d '{                                                                                                                                  
             "client_user_id": "user_001",                                                                                                    
             "click_id": "clk_998877",                                                                                                        
             "ip_address": "203.0.113.1",                                                                                                     
             "event_name": "deposit",                                                                                                         
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

### Responses

| Status Code | Description |
|-------------|-------------|
| 200 OK | Event successfully queued for processing |
| 400 Bad Request | Missing required fields |
| 401 Unauthorized | Invalid API Key or missing auth headers |
| 429 Too Many Requests | Rate limit exceeded |
| 500 Server Error | Internal processing error. Please retry with backoff |

### Rate Limit

  * Limits are applied per X-API-KEY.                                                                                                            
  * Standard Limit: 60 requests per minute (Default).                                                                                            
  * If you exceed the limit, you will receive a 429 response.                                                                          
  * Retry Strategy: We recommend implementing an exponential backoff strategy when encountering 429 or 500 errors.   

### Use Case Scenarios on Request Body Schema

#### 1. User Login

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

#### 2. User Deposit

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
  "is_crypto": true | false,
}


```

#### 3. User Bet

``` JSON

{
  "client_user_id": "<<THE UNIQUE USER ID>>",
  "click_id": "<<THE UNIQUE CLICK ID>>",
  "event_name": "bet",
  "game_type": "<<THE GAME TYPE>>",
  "game_provider": "<<THE GAME PROVIDER>>",
  "currency": "<<THE CURRENCY, eg: USD | EUR | BTC>>",
  "amount": 5.00,
  "transaction_id": "<<THE UNIQUE TRANSACTION ID>>",
  "timestamp": UTC milliseconds,
  "ip_address": "<<THE END USER IP>>",
  "is_crypto": true | false,

  "bet_result": "win | loss",
  "bet_result_amount": 1.00
}


```

#### 4. User Win/Loss

``` JSON

{
  "client_user_id": "<<THE UNIQUE USER ID>>",
  "click_id": "<<THE UNIQUE CLICK ID>>",
  "event_name": "win | loss",
  "game_type": "<<THE GAME TYPE>>",
  "game_provider": "<<THE GAME PROVIDER>>",
  "currency": "<<THE CURRENCY, eg: USD | EUR | BTC>>",
  "amount": 5.00,
  "transaction_id": "<<THE UNIQUE TRANSACTION ID>>",
  "parent_transaction_id": "<<THE PARENT BET TRANSACTION ID>>" 
  "timestamp": UTC milliseconds,
  "ip_address": "<<THE END USER IP>>",
  "is_crypto": true | false,
}


```

*PS: Could also be sent within `bet` event using `bet_result` and `bet_result_amount` field.*


#### 5. User Withdraw

``` JSON

{
  "client_user_id": "<<THE UNIQUE USER ID>>",
  "click_id": "<<THE UNIQUE CLICK ID>>",
  "event_name": "withdraw",
  "game_type": "<<THE GAME TYPE>>",
  "currency": "<<THE CURRENCY, eg: USD | EUR | BTC>>",
  "amount": 5.00,
  "transaction_id": "<<THE UNIQUE TRANSACTION ID>>",
  "timestamp": UTC milliseconds,
  "ip_address": "<<THE END USER IP>>",
  "is_crypto": true | false,
}


```

