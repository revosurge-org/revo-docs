---
title: Migrating from v2 to v3
sidebar_label: Migrating from v2
description: What changed between S2S Events v2 and v3 — envelope, milliseconds, typed catalog — with a field mapping and cutover steps.
---

# Migrating from v2 to v3

**Audience:** Engineers maintaining an existing v2 integration

v2 and v3 are **independent endpoints** — v2 keeps working unchanged, so you can migrate at your own pace. There is no automatic conversion: callers send the v3 contract directly.

## What changed at a glance

| Area | v2 | v3 |
|------|----|----|
| Endpoints | `/v2/s2s/event`, `/v2/s2s/batch` | `/v3/s2s/event`, `/v3/s2s/batch` |
| Auth header | `X-API-KEY` | `X-API-KEY` (unchanged) |
| Payload shape | Flat object | [Envelope](/en/tracking/s2s/v3/mandatory-properties): `event` · `timestamp` · `identity` · `context` |
| Event field | `event_name` | `event` |
| `timestamp` | Unix **seconds** | Unix **milliseconds** (13 digits) |
| Identity | `client_user_id` at top level | `identity{}` — at least one of `client_user_id` / `anonymous_id` |
| Attribution | `click_id` at top level | `identity.click_id` |
| Event-specific fields | top level | inside `context` |
| PII | (none) | hashed under `context.privacy.*` (SHA-256) |
| Event names | free string | **registered** catalog event (typed & validated) |
| Batch | JSON array | JSON array, **max 600** |
| Success | `200` | `202` (`{ "status": "accepted", ... }`) |
| Errors | plain | structured `code` + `violations[]` (`400` / `422` / `429`) |

## Payload transformation

The same `deposit` event, before and after:

::: code-group

```json [v2 (flat)]
{
  "client_user_id": "user_001",
  "click_id": "clk_998877",
  "event_name": "deposit",
  "timestamp": 1702963200,
  "ip_address": "203.0.113.1",
  "transaction_id": "tx_554433",
  "amount": 50.00,
  "currency": "USD"
}
```

```json [v3 (envelope)]
{
  "event": "deposit",
  "timestamp": 1702963200000,
  "identity": {
    "client_user_id": "user_001",
    "click_id": "clk_998877"
  },
  "context": {
    "ip_address": "203.0.113.1",
    "transaction_id": "tx_554433",
    "amount": 50.00,
    "currency": "USD"
  }
}
```

:::

## Field mapping

| v2 (flat) | v3 (envelope) |
|-----------|---------------|
| `event_name` | `event` |
| `timestamp` (seconds) | `timestamp` (× 1000 → milliseconds) |
| `client_user_id` | `identity.client_user_id` |
| `click_id` | `identity.click_id` |
| `ip_address` | `context.ip_address` |
| `amount`, `currency`, `transaction_id`, `is_crypto`, … | `context.*` |
| _(new in v3)_ | `identity.anonymous_id`, `context.privacy.email_hash`, … |

## Gaming: bet settlement

v3 models a settled bet as a **single `bet` event** with embedded `bet_result` and `bet_result_amount` — there are no standalone `win` / `loss` events. If your v2 integration sent separate settlement events, collapse them into one `bet` per ticket. See [iGaming events → `bet`](/en/tracking/s2s/v3/events-igaming#bet).

## Cutover steps

1. Confirm your `X-API-KEY` works against v3 (same key, same base URL). For iGaming events, confirm your product is [subscribed](/en/tracking/s2s/v3/catalog-governance#standard-vs-igaming).
2. Switch endpoints from `/v2/...` to `/v3/...`.
3. Restructure payloads into the envelope (`event` / `timestamp` / `identity` / `context`).
4. Convert `timestamp` from seconds to **milliseconds**.
5. Move PII to `context.privacy.*` as **SHA-256** hashes.
6. Validate with [test mode](/en/tracking/s2s/v3/server-events-api#test-mode) (`X-Test-Mode: true`) — fix any `violations[]`.
7. Cut over one event type at a time; keep v2 running until v3 is verified.

## Reference

- [Server Events API (v3)](/en/tracking/s2s/v3/server-events-api)
- [Request envelope & base properties](/en/tracking/s2s/v3/mandatory-properties)
- [Event catalog & validation](/en/tracking/s2s/v3/catalog-governance)
- [Standard events](/en/tracking/s2s/v3/events-standard) · [iGaming events](/en/tracking/s2s/v3/events-igaming)
- [Server Events API (v2)](/en/tracking/s2s/server-events-api)
