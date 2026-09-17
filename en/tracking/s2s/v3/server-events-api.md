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

## Rate limits

- Limits are applied **per API key**, on a rolling 1-minute window.
- Exceeding the limit returns `429`.
- Use exponential backoff on `429` and `5xx`.
