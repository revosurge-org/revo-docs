---
title: RevoSurge Server Events API (v3)
sidebar_label: Server Events API (v3)
description: S2S Events v3 reference — envelope, endpoints, authentication, batch ingest, validation responses, and rate limits.
---

# RevoSurge Server Events API (v3)

**Audience:** Engineers, technical integrators, Admin teams

The Server Events API lets partners securely send user events directly from their servers to the DataPulse platform. **v3** introduces a **typed event catalog** — events and fields are pre-registered and validated on ingest — and a structured request **envelope**.

- New here? Start with the [request envelope & base properties](/en/tracking/s2s/v3/mandatory-properties).
- Browse events: [Standard events](/en/tracking/s2s/v3/events-standard) · [iGaming events](/en/tracking/s2s/v3/events-igaming).
- How validation works: [Event catalog & validation](/en/tracking/s2s/v3/catalog-governance).
- On v2 today? See [Migrating from v2](/en/tracking/s2s/v3/migration).

## Base URL

The base URL is unchanged from v2.

| Environment | Base URL |
|-------------|----------|
| Production  | `https://datapulse-api.revosurge.com/` |

## Authentication

Every request must include your API key in the `X-API-KEY` header.

| Header | Required | Value |
|--------|----------|-------|
| `X-API-KEY` | Yes | Your API key |
| `Content-Type` | Yes | `application/json` |

> See [API Key](/en/api/api-key) for how to obtain a key. Authentication is unchanged from v2.

## The request envelope

A v3 event is a JSON object with four parts — `event`, `timestamp`, `identity`, and `context`:

```json
{
  "event": "deposit",
  "timestamp": 1718280000000,
  "identity": {
    "client_user_id": "user_001",
    "click_id": "RS_clk_998877"
  },
  "context": {
    "ip_address": "203.0.113.1",
    "transaction_id": "txn_554433",
    "amount": 100.0,
    "currency": "USD",
    "is_crypto": false,
    "payment_method": "pix"
  }
}
```

Full field rules are on [Request envelope & base properties](/en/tracking/s2s/v3/mandatory-properties). In short:

- `event` (String, required) — a **registered** event name. Unknown names are rejected.
- `timestamp` (Number, required) — **UTC epoch milliseconds** (13 digits).
- `identity` (Object, required) — must include **at least one** of `client_user_id` or `anonymous_id`. `click_id` alone is not enough.
- `context` (Object) — event-specific fields. PII goes under `context.privacy.*` and must be SHA-256 hashed.

## Ingestion endpoints

### Single event

<HttpMethod method="POST" path="/v3/s2s/event" />

The body is a single envelope object.

::: code-group

```bash [cURL]
curl -X POST "https://datapulse-api.revosurge.com/v3/s2s/event" \
  -H "Content-Type: application/json" \
  -H "X-API-KEY: dp_test_key_123" \
  -d '{
    "event": "deposit",
    "timestamp": 1718280000000,
    "identity": { "client_user_id": "user_001", "click_id": "RS_clk_998877" },
    "context": {
      "ip_address": "203.0.113.1",
      "transaction_id": "txn_554433",
      "amount": 100.0,
      "currency": "USD"
    }
  }'
```

```js [Node.js]
const res = await fetch("https://datapulse-api.revosurge.com/v3/s2s/event", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-API-KEY": process.env.REVOSURGE_API_KEY,
  },
  body: JSON.stringify({
    event: "deposit",
    timestamp: Date.now(),
    identity: { client_user_id: "user_001", click_id: "RS_clk_998877" },
    context: {
      ip_address: "203.0.113.1",
      transaction_id: "txn_554433",
      amount: 100.0,
      currency: "USD",
    },
  }),
});
```

```python [Python]
import os, time, requests

requests.post(
    "https://datapulse-api.revosurge.com/v3/s2s/event",
    headers={"X-API-KEY": os.environ["REVOSURGE_API_KEY"]},
    json={
        "event": "deposit",
        "timestamp": int(time.time() * 1000),
        "identity": {"client_user_id": "user_001", "click_id": "RS_clk_998877"},
        "context": {
            "ip_address": "203.0.113.1",
            "transaction_id": "txn_554433",
            "amount": 100.0,
            "currency": "USD",
        },
    },
)
```

:::

### Batch

<HttpMethod method="POST" path="/v3/s2s/batch" />

The body is a **bare JSON array** of envelopes (not an object with an `events` key). Maximum **600** events per request.

```json
[
  { "event": "login",   "timestamp": 1718280000000, "identity": { "client_user_id": "user_001" }, "context": { "ip_address": "203.0.113.1" } },
  { "event": "deposit", "timestamp": 1718280001000, "identity": { "client_user_id": "user_001" }, "context": { "ip_address": "203.0.113.1", "transaction_id": "txn_1", "amount": 100.0, "currency": "USD" } }
]
```

> [!NOTE]
> Exceeding 600 events returns `400 BATCH_TOO_LARGE`.

## Responses

On success, events are **queued asynchronously** (HTTP `202`).

| Endpoint | Status | Body |
|----------|--------|------|
| Single | `202 Accepted` | `{ "status": "accepted", "eventId": "..." }` |
| Batch | `202 Accepted` | `{ "status": "accepted", "requestId": "...", "count": 150 }` |

With `?dryrun=1` or `X-Test-Mode: true`, a successful call answers `200` instead — see [Dry run](#dry-run) and [Test mode](#test-mode).

### Errors

Errors on `/v3/s2s/*` return a structured body with a `code` and a `violations[]` array:

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Envelope validation failed",
  "violations": [
    { "field": "timestamp", "rule": "not_milliseconds", "event": "deposit" },
    { "field": "context.amount", "rule": "type", "event": "deposit" }
  ]
}
```

| Status | Code | Meaning |
|--------|------|---------|
| `400` | `VALIDATION_ERROR` | Missing/invalid fields, bad timestamp, malformed PII, type mismatch |
| `400` | `BATCH_TOO_LARGE` | More than 600 events in a batch |
| `422` | `UNKNOWN_EVENT_TYPE` | `event` is not a registered catalog event |
| `422` | `EVENT_DISABLED` | The event exists but is disabled for your product |
| `429` | — | Rate limit exceeded (`{ "error": "Too Many Requests" }`) |

See [Event catalog & validation](/en/tracking/s2s/v3/catalog-governance) for how the catalog drives these checks.

## Dry run

Add `?dryrun=1` to either ingestion endpoint to check a request end to end without creating any data. We parse, authenticate, validate against the catalog and enrich it exactly as we would in production, echo back the record we would have written, and then store nothing.

| Endpoint | Dry-run URL |
|----------|-------------|
| Single | `POST /v3/s2s/event?dryrun=1` |
| Batch | `POST /v3/s2s/batch?dryrun=1` |

`dryrun` on its own and `dryrun=true` mean the same thing. `dryrun=0`, `dryrun=false` and `dryrun=no` turn it off.

### Telling a dry run apart from a real write

| Call | Status | Body | Response header |
|------|--------|------|-----------------|
| Real write | `202 Accepted` | `{ "status": "accepted", ... }` | — |
| Dry run | `200 OK` | The echoed record | `X-Ingest-Mode: dryrun` |

> [!WARNING]
> A dry run answers `200`, never `202`. If you got a `202`, that was a real write. **A dry run that passes is not a write** — nothing sent with `dryrun=1` is ever stored.

A dry run is authenticated as usual and **counts against your rate limit as usual** — one batch request counts as one request. It is not a load-testing entry point.

### The echoed record

::: code-group

```bash [cURL]
curl -X POST "https://datapulse-api.revosurge.com/v3/s2s/event?dryrun=1" \
  -H "Content-Type: application/json" \
  -H "X-API-KEY: dp_test_key_123" \
  -d '{
    "event": "register",
    "timestamp": 1718280000000,
    "identity": { "client_user_id": "u-ua-1", "click_id": "rs-ua-1" },
    "context": {
      "ip_address": "203.0.113.1",
      "user_agent": "Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36"
    }
  }'
```

```json [Response (abridged)]
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
    "catalog_version": "...",
    "request_id": "..."
  },
  "misspelledFields": []
}
```

:::

### What you send vs. what we record

Most of the difference between your envelope and the echo is enrichment we add:

| You send | We record |
|----------|-----------|
| `context.ip_address` | The country and city resolved from that IP |
| `context.user_agent` | `userAgentInfo` — device class and name, OS name and version, agent name and class |
| `context.amount` + `context.currency` | The amount converted with our published exchange rates |
| `context.game_type` | The normalized game type |
| `context.transaction_id`, when you omit it | A `transaction_id` we generate |
| — | `recv_timestamp` — the time **we** received the event, in milliseconds |
| — | `catalog_version` — the event-catalog version this event was validated against |
| — | `request_id` / `requestId` — the trace id for this call. Quote it when you ask us about it |

The next two sections are the other side of that table — **what we did not record the way you meant it**.

### The two spellings

> [!WARNING]
> **Never copy a field name out of the echo into your request.** What you send is `snake_case` (`client_user_id`, `click_id`, `ip_address`, `user_agent`). The **top level of the echo is `camelCase`** (`requestId`, `clickId`, `userAgentInfo`), and the `eventData` nested inside it is `snake_case` again.

What a misspelled key costs you depends on whether the field is required — and the damage runs opposite to the noise:

- A misspelled **required** field returns `400 VALIDATION_ERROR`. Loud, and fixed in minutes.
- A misspelled **optional** field returns `202`, the event is stored, and the field silently disappears. Send `context.userAgent` instead of `context.user_agent` and `userAgentInfo` comes back empty — the whole device and operating-system dimension is gone, with no error anywhere.
- **`identity.click_id` belongs to the second group.** `clickId` gets you a `202`, a stored event and something that looks entirely normal — except that conversion is never attributed.

### misspelledFields

Every dry-run echo carries a `misspelledFields` list. It names the keys you sent that are recognizably ours but spelled differently — which is what makes the silent failure above visible, before you go live:

```json
"misspelledFields": [{ "sent": "clickId", "expected": "click_id" }]
```

`sent` is the key exactly as you sent it; `expected` is the field we would have matched it to. Change your payload to use `expected`.

**An empty array is the answer you want.** A clean single-event dry run returns `"misspelledFields": []`. The key is always there, so `[]` means *we ran the check and found nothing* — not *this endpoint has no such check*. (Batch reports this differently — see below.)

#### What v3 checks

The check runs on two levels: the **top of the envelope**, and the keys inside **`identity`**. Two cases are worth calling out:

1. **A misspelled key inside `identity` is discarded at parse time.** `identity.clickId` never reaches the event at all — unlike an unrecognized key elsewhere, it is not even kept as a custom property, so nothing downstream records that you sent it. A dry run is the only place it is visible.
2. **A field flattened onto the top of the envelope is reported too.** Send `clientUserId` at the top level and you get `{ "sent": "clientUserId", "expected": "client_user_id" }`. The fix is the spelling *and* the position — that field belongs inside the `identity` object.

**`context` is not checked.** It is an open map defined by the event catalog, where a key we do not recognize is normal rather than suspect. Required `context` fields that are missing are reported by catalog validation as [`violations[]`](#errors) instead — which is also why a typo in an *optional* `context` field does not appear here. See [Event catalog & validation](/en/tracking/s2s/v3/catalog-governance).

#### We do not reject unknown fields

**Custom properties are a supported feature, not a mistake.** `context` is an open map defined by the catalog, so a key we do not recognize there is expected.

So this check is deliberately narrow: it reports only keys that look like **ours, spelled differently**. Names are compared after folding to lower case and dropping separators, and a key is reported only if it then collides with a field we know.

| You send | Reported? | Why |
|----------|-----------|-----|
| `identity.clickId`, `identity.Click-Id` | Yes | Collides with `click_id` |
| `clientUserId` or `CLIENTUSERID` at the top level | Yes | Collides with `client_user_id` |
| `identity.click_id` | No | Spelled correctly |
| `context.bonus_round_id`, `context.vip_tier`, `context.table_id` | No | Legitimate custom fields in an open map |

> [!IMPORTANT]
> **Your own custom properties not showing up in this list is the correct outcome, not a sign that they were ignored.** Do not delete a custom field you rely on because a dry run stayed quiet about it.

### Batch dry run

`POST /v3/s2s/batch?dryrun=1` answers synchronously with a per-item result instead of the usual `202`:

```json
{
  "requestId": "s2s.batch-...",
  "mode": "dryrun",
  "total": 3,
  "successCount": 2,
  "failureCount": 1,
  "successEvents": ["... the enriched events ..."],
  "errors": [
    {
      "index": 2,
      "violations": [
        { "field": "context.ip_address", "rule": "required", "event": "deposit" },
        { "field": "context.amount", "rule": "required", "event": "deposit" }
      ]
    }
  ],
  "misspelledFields": { "1": [{ "sent": "clickId", "expected": "click_id" }] }
}
```

- `errors[].index` is the position of the item in the array you sent, counting from `0`, and each `violations[]` entry gives the field path and the rule it broke — together they tell you *which item, which field, which rule*.
- **`misspelledFields` is a top-level object keyed by that same index.** It is not attached to the individual events inside `successEvents`. Above, item `1` — the second one you sent — spelled `click_id` as `clickId` inside `identity`.
- **When nothing is misspelled the key is absent entirely** — not an empty object, not an empty array. This differs from a single event, which always returns `misspelledFields: []`, so do not use the presence of the key as your signal.

## Test mode

A dry run tells you whether one request is right, and keeps nothing. Test mode tells you **what your integration has been sending**: add the `X-Test-Mode: true` header and we process the request exactly as we would in production, then store the event as a **test event** that you can go back and review for 14 days. Test events never reach production.

| Header | Value |
|--------|-------|
| `X-Test-Mode` | `true` |

It works on both ingestion endpoints, single and batch. Leave the header off for live traffic.

### Dry run or test mode?

| | Dry run — `?dryrun=1` | Test mode — `X-Test-Mode: true` |
|---|---|---|
| Answers | *Is this one request right?* | *What has my integration been sending?* |
| What is stored | Nothing | Every accepted event, as a test event, for 14 days |
| Can you look back at it later? | No — the response is all you get | Yes — see [Viewing your test events](#viewing-your-test-events) |
| Reaches reports, attribution or billing | No | No |
| Use it for | Building and checking payloads, CI assertions | Staging, and confirming your real handlers fire before the [go-live test](/en/tracking/s2s/handoff#the-go-live-test) |

**If a request carries both, dry run wins.** Nothing is stored and the response header reads `X-Ingest-Mode: dryrun`.

### Sending a test event

```bash
curl -i -X POST "https://datapulse-api.revosurge.com/v3/s2s/event" \
  -H "Content-Type: application/json" \
  -H "X-API-KEY: dp_test_key_123" \
  -H "X-Test-Mode: true" \
  -d '{
    "event": "register",
    "timestamp": 1718280000000,
    "identity": { "client_user_id": "u-test-1", "click_id": "rs-test-1" },
    "context": { "ip_address": "203.0.113.1" }
  }'
```

Test mode answers the way a dry run does, not the way a live write does:

| Call | Status | Body | `X-Ingest-Mode` | Stored |
|------|--------|------|-----------------|--------|
| Live | `202 Accepted` | `{ "status": "accepted", ... }` | — | Yes, in production |
| Test mode | `200 OK` | The [echoed record](#the-echoed-record), or the [per-item batch result](#batch-dry-run) with `"mode": "test"` | `test` | As a test event, for 14 days |
| Dry run | `200 OK` | The echoed record, or the per-item batch result with `"mode": "dryrun"` | `dryrun` | No |

The echo is the same one a dry run returns, `misspelledFields` included.

> [!WARNING]
> **On v3, a `200` from an ingestion endpoint always means the event did not go to production.** Read `X-Ingest-Mode` to tell which mode you hit. If your production code sees `X-Ingest-Mode: test`, the header is still being sent and none of those events count — see [`S2S-R-12`](/en/tracking/s2s/validation#s2s-r-12-—-still-in-dry-run).

A test event is validated exactly like a live one. If it fails, you get the same `400` or `422` as in production, and **the event is not stored**. In a batch, the items that pass are stored and the ones that fail are listed in `errors[]` and are not.

Test-mode requests are authenticated as usual and **count against your rate limit as usual**.

### Where test events go

- **Not into any report**, dashboard or conversion count.
- **Not into attribution, optimisation or billing.** A test event is never matched to a click, never bid on and never charged for.
- **Kept for 14 days**, then deleted.

### Viewing your test events

In DataPulse, open your Product and go to **Recent test events**. Events are listed newest first, from the last hour by default and up to 14 days back. Each row shows the event name, when we received it, `click_id`, `client_user_id`, the transaction fields, the country, the API key it arrived on (nickname and first 8 characters) and its request ID.

The same list is available from the API:

<HttpMethod method="GET" path="/api/v1/datapulse/adwave-products/{productId}/test-events" />

This endpoint is part of the RevoSurge dashboard API. It is authenticated with your **RevoSurge account sign-in**, the same as the dashboard — not with the `X-API-KEY` you send events with.

| Parameter | Description |
|-----------|-------------|
| `from`, `to` | ISO-8601 instants, e.g. `2026-10-05T08:00:00Z`. Default: the last hour. The window can be up to 14 days. |
| `since` | ISO-8601 instant. Returns only events received after it, oldest first — use it to poll for new events while you test. |
| `eventName`, `clickId`, `clientUserId`, `requestId` | Return only events with this value. |
| `limit` | Page size, `1`–`100`. Default `20`. |
| `cursor` | The `nextCursor` from the previous page. |

Any other parameter returns `400`.

```json
{
  "events": [
    {
      "eventKey": "...",
      "source": "s2s",
      "receivedAt": "2026-10-05T08:00:12.345Z",
      "eventName": "deposit",
      "eventTimeDeclared": 1791158400,
      "clickId": "rs-test-1",
      "clientUserId": "u-test-1",
      "transactionId": "txn_1",
      "amount": 12.5,
      "currency": "USD",
      "sourceAmount": 1000,
      "sourceCurrency": "INR",
      "country": "IND",
      "apiKey": { "nickname": "staging", "prefix": "rs-RhVlT" },
      "requestId": "s2s.event-..."
    }
  ],
  "nextCursor": "...",
  "meta": { "retentionDays": 14, "freshnessSeconds": 10, "rejectedVisible": false }
}
```

`GET /api/v1/datapulse/adwave-products/{productId}/test-events/{eventKey}` returns a single event together with the full payload we stored for it.

### Limits

- **Rejected test events are not listed.** A test event we rejected — a `400` or `422`, or a failed item in a batch — was never stored, so it will not appear in the list. The reason is in the HTTP response you received when you sent it. Log those responses while you test. (`meta.rejectedVisible: false` says the same thing.)
- **The list runs about 10 seconds behind.** A test event can take around 10 seconds to appear after you send it (`meta.freshnessSeconds`).
- **14 days is the limit** both for how long a test event is kept and for how wide one query window can be.

## Rate limits

- Limits are applied **per API key**, on a rolling 1-minute window.
- Exceeding the limit returns `429`.
- Use exponential backoff on `429` and `5xx`.
