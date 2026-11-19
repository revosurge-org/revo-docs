---
title: "RevoSurge Server Events API (v3)"
sidebar_label: Server Events API (v3)
description: "Server Events v3 request envelopes, ingestion endpoints, validation modes, diagnostics and retry rules."
---

# RevoSurge Server Events API (v3)

**For:** Backend developers and technical integrators.

Send registered business events from your server to RevoSurge. For the installation and end-to-end test sequence, use [Set up and test S2S](/en/tracking/s2s/setup-s2s).

<a id="base-url"></a>
<a id="authentication"></a>

## 1. Endpoint and authentication

Base URL: `https://datapulse-api.revosurge.com/`

| Header | Required | Value |
| --- | --- | --- |
| `X-API-KEY` | Yes | Your Product-authorized API key |
| `Content-Type` | Yes | `application/json` |

Create or check your key using the [S2S setup guide](/en/tracking/s2s/setup-s2s). Keep it in backend code only.

<a id="the-request-envelope"></a>

## Request envelope

| Part | JSON type | Meaning |
| --- | --- | --- |
| `event` | String | Exact registered event name |
| `timestamp` | Number | Business occurrence time in UTC milliseconds |
| `identity` | Object | Stable user/anonymous identity and available attribution IDs |
| `context` | Object | Base and event-specific fields |

S2S sends a nested JSON object; Postback v2 sends canonical dotted query parameters. Both use the [shared event definitions](/en/tracking/events/choose-events). This page documents S2S only.

<a id="ingestion-endpoints"></a>
<a id="single-event"></a>

## 2. Send one event

<HttpMethod method="POST" path="/v3/s2s/event" />

Send one JSON object containing `event`, `timestamp`, `identity` and `context`:

- `event`: exact registered event name.
- `timestamp`: actual occurrence time in UTC Unix milliseconds.
- `identity`: at least one of `client_user_id` or `anonymous_id`; `click_id` alone does not meet this requirement.
- `context`: the fields required by the event. A deposit needs transaction ID, amount and currency.

See [Common fields & identity](/en/tracking/events/common-fields) for field rules, hashing and event-specific exceptions. Use [Standard](/en/tracking/events/events-standard), [iGaming](/en/tracking/events/events-igaming) or [Crypto](/en/tracking/events/events-crypto) for exact event contracts.

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

Use the actual event time and your own key, identity and business values when sending requests. The example times and identifiers are illustrative.

<a id="batch"></a>

## 3. Send a batch

<HttpMethod method="POST" path="/v3/s2s/batch" />

Send a **bare JSON array** of envelopes, with no `events` wrapper. The maximum is **600 events** per request; exceeding it returns `400 BATCH_TOO_LARGE`.

```json
[
  { "event": "login",   "timestamp": 1718280000000, "identity": { "client_user_id": "user_001" }, "context": { "ip_address": "203.0.113.1" } },
  { "event": "deposit", "timestamp": 1718280001000, "identity": { "client_user_id": "user_001" }, "context": { "ip_address": "203.0.113.1", "transaction_id": "txn_1", "amount": 100.0, "currency": "USD" } }
]
```

<a id="dry-run"></a>
<a id="test-mode"></a>

<a id="telling-a-dry-run-apart-from-a-real-write"></a>
<a id="dry-run-or-test-mode"></a>
<a id="sending-a-test-event"></a>
<a id="where-test-events-go"></a>

## 4. Choose Live, Test or Dry run

Both ingestion endpoints support these modes:

| Mode | Request setting | Successful response | Stored data | Reporting, attribution and billing |
| --- | --- | --- | --- | --- |
| Live | Omit test and dry-run settings | `202 Accepted`; single `eventId` or batch `requestId`/`count` | Production events, queued asynchronously | Eligible for production processing |
| Test | `X-Test-Mode: true` | `200 OK`; `X-Ingest-Mode: test`; echoed result | Accepted test events, retained for 14 days | Excluded |
| Dry run | `?dryrun=1` | `200 OK`; `X-Ingest-Mode: dryrun`; echoed result | Nothing | Excluded |

Use dry run to validate a payload and test mode to inspect what your real handlers send. Remove both settings for production verification. **Test events and dry runs do not verify campaign conversions.** A live `202` confirms queuing, not completed processing or attribution.

- If both settings are present, **dry run wins** and nothing is stored.
- `dryrun` and `dryrun=true` also enable dry run; `dryrun=0`, `dryrun=false` and `dryrun=no` disable it.
- All modes require authentication and count against the same rate limit. A batch counts as one request.
- Test requests use the same validation as Live. Rejected test events are not stored; for a test batch, passing items are stored and failed items appear in `errors[]`.

For test mode, add this header to the single-event or batch example:

```http
X-Test-Mode: true
```

For dry run, append `?dryrun=1` to its endpoint. See [Advanced diagnostics](#advanced-diagnostics) for echoed and per-item responses.

<a id="responses"></a>

## 5. Responses and errors

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

See [Event catalog & validation](/en/tracking/events/catalog-validation) for how the catalog drives these checks.

<a id="rate-limits"></a>

## 6. Rate limits and retries

Limits apply per API key on a rolling one-minute window. Use bounded exponential backoff with jitter for `429` and retryable `5xx` responses. Fix `400` and `422` errors before resending.

A timeout or disconnect leaves the delivery outcome uncertain. Preserve the original timestamp and business identifiers on retry. Check the event’s retry behavior and each batch item before resending. See [retry and batch validation](/en/tracking/s2s/validation) and [repeat delivery](/en/tracking/core-concepts#_4-repeat-delivery-and-overlapping-sources).

## Advanced diagnostics

### The echoed record

Test and dry-run responses show the enriched record. Requests use `snake_case`; top-level echo fields use `camelCase`, while fields inside `eventData` use `snake_case`. **Do not copy echo field names into a request.**

Single-event example, abridged:

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

<a id="the-two-spellings"></a>
<a id="misspelledfields"></a>
<a id="we-do-not-reject-unknown-fields"></a>

### Field spelling and typo detection

Use the field spelling and nesting in the request schema. A missing required field fails validation; a misspelled optional field can pass without producing the intended enrichment or attribution.

`misspelledFields` reports recognized envelope and `identity` keys that have been spelled differently:

```json
{ "misspelledFields": [{ "sent": "clickId", "expected": "click_id" }] }
```

Fix both spelling and position: `client_user_id` and `click_id` belong inside `identity`.

#### What v3 checks

| Input | Typo check | Action |
| --- | --- | --- |
| `identity.clickId` or `identity.Click-Id` | Reported; the misspelled identity key is discarded at parse time | Send `identity.click_id` |
| `clientUserId` at the top level | Reported | Send `identity.client_user_id` |
| Correct `identity.click_id` | No misspelling reported | No correction needed |
| Optional `context` keys | Not checked for spelling | Compare with the event catalog |
| Custom `context` properties | Not flagged merely for being custom | Retain the custom fields your integration needs |

The check compares recognized names after folding case and removing separators. `context` is an open map: required fields are checked by catalog validation, while optional context typos do not appear in `misspelledFields`.

A clean **single-event** echo contains `"misspelledFields": []`. A clean **batch** omits the key. An empty typo result does not prove every context field is correct.

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

### Viewing your test events

In DataPulse, open your Product and go to **Recent test events**. Events are listed newest first, from the last hour by default and up to 14 days back. Each row shows the event name, when we received it, `click_id`, `client_user_id`, the transaction fields, the country, the API key it arrived on (nickname and first 8 characters) and its request ID.

The same list is available from the API:

`GET /api/v1/datapulse/adwave-products/{productId}/test-events`

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

## Verify the integration

Follow the [S2S setup guide](/en/tracking/s2s/setup-s2s) to inspect the event stream, reconcile server logs and verify the intended live campaign conversion. Use [Integration validation rules](/en/tracking/s2s/validation) for the detailed checklist.
