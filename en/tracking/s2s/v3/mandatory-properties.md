---
title: Request envelope & base properties (v3)
sidebar_label: Envelope & base properties
description: The S2S Events v3 envelope structure and the base properties every event must carry.
---

# Request envelope & base properties

**Audience:** Engineers, technical integrators

Every v3 event is a JSON **envelope** with four parts. A handful of **base properties** are inherited by every event, regardless of type; event-specific fields are documented in [Standard events](/en/tracking/s2s/v3/events-standard) and [iGaming events](/en/tracking/s2s/v3/events-igaming).

## Envelope structure

```json
{
  "event": "<registered event name>",
  "timestamp": 1718280000000,
  "identity": { "client_user_id": "...", "anonymous_id": "...", "click_id": "..." },
  "context": { "ip_address": "...", "...event-specific fields...": "..." }
}
```

| Part | Type | Holds |
|------|------|-------|
| `event` | String | The registered event name. |
| `timestamp` | Number | When the event occurred (UTC ms). |
| `identity` | Object | Who the event is about — stable IDs + attribution click ID. |
| `context` | Object | Event-specific fields (and `ip_address`). |

## Base properties

These are required on **every** event (some can be relaxed — see [Downgrades](#downgrades)):

| Property | Envelope location | Type | Requirement | Notes |
|----------|-------------------|------|-------------|-------|
| `event` | top level | String | **Required** | Must be a registered catalog event, else `422 UNKNOWN_EVENT_TYPE`. |
| `timestamp` | top level | Number | **Required** | UTC epoch **milliseconds** (see [Timestamp](#timestamp)). |
| `client_user_id` | `identity.client_user_id` | String | **Required** | Unique user ID. One of `client_user_id` / `anonymous_id` is required. |
| `ip_address` | `context.ip_address` | String | **Required** | End-user IP (IPv4 / IPv6). Drives geo enrichment. |

Recommended on most events:

| Property | Envelope location | Type | Notes |
|----------|-------------------|------|-------|
| `click_id` | `identity.click_id` | String | Ad click ID — needed for campaign attribution. |
| `anonymous_id` | `identity.anonymous_id` | String | Pre-conversion stitching ID; satisfies the identity requirement before `client_user_id` exists. |
| `user_agent` | `context.user_agent` | String | Browser / device user-agent (parsed for device intelligence). |

## Identity

`identity` **must contain at least one** of `client_user_id` or `anonymous_id`.

- `client_user_id` — your stable, authenticated user ID. Use the same value across all events and, where possible, the same one used by the [Web Tracker](/en/tracking/web-tracker).
- `anonymous_id` — a pre-login/pre-registration ID (e.g. from a device or first-touch). Lets you send events (such as `app_install`) before a user account exists; DataPulse stitches it to the user once `client_user_id` appears.
- `click_id` — links the event to the originating ad click. **It does not satisfy the identity requirement on its own.**

## Timestamp

`timestamp` is a **Number** in **UTC epoch milliseconds** (13 digits, e.g. `1718280000000`).

> [!IMPORTANT]
> v3 uses **milliseconds**, not seconds. Validation rejects values that look like seconds (below `1000000000000`) with `rule: "not_milliseconds"`, and values more than **5 minutes** in the future with `rule: "future_skew"`.

## PII & hashing

Personal data must be **SHA-256 hashed** before sending — never plaintext. Hashed fields live under `context.privacy.*`:

| Field | Notes |
|-------|-------|
| `context.privacy.email_hash` | SHA-256 of the email, lowercased & trimmed first. |
| `context.privacy.phone_hash` | SHA-256 of the E.164-normalized phone. |

The hash must be **lowercase hex, 64 characters** (`^[a-f0-9]{64}$`). A malformed hash is rejected with `rule: "pii_format"`.

## Downgrades

A few events relax the base requirement for `client_user_id` and/or `ip_address` to **suggested**, because the value may not exist yet:

| Event(s) | Relaxed |
|----------|---------|
| `app_install`, `app_open`, `app_uninstall` | `client_user_id` (and `ip_address` for `app_install`) — the user may be anonymous pre-register. |
| `bet` | `ip_address` — bets often arrive from a game server without the end-user IP. |

## Minimal example

```json
{
  "event": "login",
  "timestamp": 1718280000000,
  "identity": { "client_user_id": "user_001", "click_id": "RS_clk_998877" },
  "context": { "ip_address": "203.0.113.1", "user_agent": "Mozilla/5.0 (...)" }
}
```
