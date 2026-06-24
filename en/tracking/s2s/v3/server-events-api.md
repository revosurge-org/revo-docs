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
| `X-Test-Mode` | No | `true` to validate & echo without storing (see [Test mode](#test-mode)) |

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

## Test mode

Send `X-Test-Mode: true` to validate and enrich an event **without** publishing it. The response (HTTP `200`) echoes the fully enriched event (geo, parsed user-agent, normalized amounts) so you can inspect exactly what DataPulse would store. For batch, the response includes per-item `successCount` / `failureCount` and an `errors[]` list with the failing index and reason.

## Rate limits

- Limits are applied **per API key**, on a rolling 1-minute window.
- Exceeding the limit returns `429`.
- Use exponential backoff on `429` and `5xx`.
