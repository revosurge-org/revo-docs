---
title: RevoSurge Partner Postback API
sidebar_label: Partner Postback API
description: Partner Postback reference — endpoints, key authentication, macro parameters, response contract, deduplication, and retry rules.
---

# RevoSurge Partner Postback API

**Audience:** Engineers, technical integrators, affiliate/partner managers

The Partner Postback API lets an operator or affiliate platform report conversions **back to RevoSurge** from its own back office. Postbacks are plain HTTP `GET` callbacks with macros in the query string — the format affiliate back offices already speak — so the integration is a one-time URL registration rather than a code change on your side.

- Sending events from your own servers instead? Use the [Server Events API (v3)](/en/tracking/s2s/v3/server-events-api).
- New to RevoSurge tracking? Start with the [Tracking overview](/en/tracking/overview).

## Postback vs. Server Events API

| | Partner Postback | [Server Events API (v3)](/en/tracking/s2s/v3/server-events-api) |
|---|---|---|
| Who fires the call | Your affiliate back office | Your backend |
| Transport | `GET` + query-string macros | `POST` + JSON envelope |
| Authentication | Static key in the `k` parameter | `X-API-KEY` header |
| Setup | Register a URL per event type | Write an integration |
| Best for | Operators whose back office already emits postbacks | Full control over the event catalog and payload |

> [!TIP]
> The two are not mutually exclusive. Postbacks are typically used for the settlement events an operator's back office owns (registration, deposits, revenue share), while the Server Events API carries the richer in-product event stream.

## Base URL

| Environment | Base URL |
|-------------|----------|
| Production  | `https://mmp.revosurge.com` |

> [!NOTE]
> RevoSurge issues your **partner slug** and your **key** during onboarding. `{partner}` in the paths below stands for your slug — substitute it before registering the URLs.

## Authentication

Every postback must carry the static key RevoSurge issued you, in the `k` query parameter.

| Parameter | Required | Value |
|-----------|----------|-------|
| `k` | Yes | Your postback key |

- The key is compared in constant time; a mismatch returns `403` and the postback is **not** stored.
- RevoSurge may additionally restrict your postbacks to an **egress IP allowlist**. Tell us your outbound addresses during onboarding so a later network change on your side does not turn into silent `403`s.
- `k` is stripped from the stored event and redacted from request logs. It never reaches the event record.

> [!WARNING]
> The key travels in the URL, in plain text, and it will be stored in your back office. Treat it as a shared secret of medium sensitivity: do not reuse it elsewhere, and ask RevoSurge for a rotation if it leaks. **Rotation is coordinated** — we allow the new key before you switch, because a unilateral rotation turns every postback into a `403` until your back office is updated.

## Endpoints

RevoSurge uses **local postbacks**: one URL per event type. The **path decides the event type** — the `event` macro is recorded for cross-checking but is never used to classify the conversion, so a change to what your template expands to cannot silently reclassify our conversions.

<HttpMethod method="GET" path="/v1/pb/{partner}/registration" />

<HttpMethod method="GET" path="/v1/pb/{partner}/first-deposit" />

<HttpMethod method="GET" path="/v1/pb/{partner}/repeat-deposit" />

<HttpMethod method="GET" path="/v1/pb/{partner}/revenue" />

| Endpoint | Recorded as | `reported_first` | Fire it when |
|----------|-------------|------------------|--------------|
| `/registration` | `register` | — | A player account is created — the first event carrying a player id |
| `/first-deposit` | `deposit` | `1` | A deposit your system considers the player's first |
| `/repeat-deposit` | `deposit` | `0` | Any subsequent deposit |
| `/revenue` | `partner_revenue` | — | A revenue-share settlement event |

All four take an **identical parameter set** — only the path differs — so you can register them from one template.

Two notes on how these are recorded:

- **`first-deposit` and `repeat-deposit` both store `deposit`**, with your first-deposit claim kept as a flag rather than as truth. RevoSurge computes first-time deposits independently, and the difference between the two figures is free reconciliation.
- **`revenue` is stored as `partner_revenue`, not as GGR.** It is the commission figure, which differs from operator GGR by the revenue-share rate; conflating them would be a units error.

> [!WARNING]
> **Do not register an "all deposits" postback** alongside `first-deposit` and `repeat-deposit` — every deposit would be counted twice.
>
> **Do not register a global postback** (one URL with the event type in a macro). The event type is already in the path. If we add an event type later, we will send you a new URL for it.

## Parameters

Every endpoint accepts the same parameters. Map your back office's macros onto these names — the names on the left are the contract, the macro syntax on the right is yours.

| Parameter | Required | Description |
|-----------|----------|-------------|
| `k` | Yes | Your postback key (see [Authentication](#authentication)) |
| `click_id` | Yes\* | The RevoSurge click id, echoed back from the sub-parameter it was delivered in (commonly `{sub1}`). The only campaign-level attribution anchor |
| `user_id` | Yes\* | Your pseudonymous player id. The key that stitches a player's events together |
| `ctx` | Recommended | The RevoSurge delivery context, echoed back (commonly `{sub2}`). Fallback attribution once the click-id window has passed |
| `event_id` | Recommended | Your globally unique event id. Used as the deduplication key — see [Deduplication](#deduplication) |
| `txid` | Recommended | Transaction id. Second choice for the deduplication key |
| `event` | Recommended | Your own event-type macro. Recorded as a cross-check against the endpoint path, never used to classify |
| `amount` | Deposits & revenue | The monetary value, as a decimal. **Signed** — see [How values are interpreted](#how-values-are-interpreted) |
| `ts` | Recommended | Event time as **unix milliseconds** |
| `country` | Optional | Player country |
| `attribution_share` | Optional | Your declared attribution share for this conversion — see [What your claim fields mean](#what-your-claim-fields-mean) |
| `is_new_customer` | Optional | Your declaration that this player is new **to you**. Accepts `1`/`0`, `true`/`false`, `yes`/`no` |
| `first_deposit_ts` | Optional | Your declared first-deposit time, as **unix milliseconds** — same unit and same parsing as `ts` |
| `hash_id`, `hash_name` | Recommended | Your link/account taxonomy identifiers |
| `source_id`, `source_name` | Recommended | Your traffic-source taxonomy identifiers |

\* **At least one of `click_id` or `user_id` must be present.** A postback with neither cannot be addressed to anything and is dropped (with a `200` — see [Responses](#responses)).

Parameters not listed here are **kept verbatim** on the stored event, so a macro you add later still reaches us without a change on our side.

### What your claim fields mean

`attribution_share`, `is_new_customer` and `first_deposit_ts` are **what you report**. RevoSurge records them next to what it computes itself, never in place of it.

All three are **optional**, and **adding them does not require re-registering your URLs** — an existing registration keeps working exactly as it does today, and a parameter we never receive is simply recorded as unset. If you are registering for the first time, append them to the template now, so you do not pay for a re-registration later:

```text
&attribution_share={attribution_share}&is_new_customer={is_new_customer}&first_deposit_ts={first_deposit_ts}
```

- **`attribution_share` is stored exactly as sent.** The contract does not declare a scale — `0.5` and `50` both read as "half" — so RevoSurge neither rescales it nor multiplies any amount by it. Agree the scale with us explicitly before anyone relies on the number.
- **`is_new_customer` is your view, not our first-deposit calculation.** We continue to determine first-time deposits independently; the gap between the two is a reconciliation signal, not an error. A value we cannot read is recorded as unset, never as `0` — "no" and "unreadable" must not collapse into the same answer.
- **`first_deposit_ts` follows the `ts` rules exactly.** See [How values are interpreted](#how-values-are-interpreted).

### Why we ask for the taxonomy fields

`hash_id`, `hash_name`, `source_id` and `source_name` are typically **constants** for a single-account integration, so they attribute nothing today. We ask for them anyway because:

1. A value that is not ours means traffic has been miswired — either someone else's traffic is pointed at our URL, or ours is registered under another account. This is monitored and alerted on.
2. They become meaningful the moment the integration grows past one link.
3. Adding a macro later means re-registering the URLs in your back office. Sending them from day one is far cheaper.

## Example

### URL template

Register these four URLs, substituting your partner slug and key. The `{...}` values are **your back office's macro names** — the example below uses the common `sub1`/`sub2` convention.

```text
https://mmp.revosurge.com/v1/pb/{partner}/registration?k=<KEY>&click_id={sub1}&ctx={sub2}&event={event}&user_id={user_id}&event_id={event_id}&txid={transaction_id}&amount={amount}&ts={date}&country={country}&hash_id={hash_id}&hash_name={hash_name}&source_id={source_id}&source_name={source_name}

https://mmp.revosurge.com/v1/pb/{partner}/first-deposit?k=<KEY>&…same query string…

https://mmp.revosurge.com/v1/pb/{partner}/repeat-deposit?k=<KEY>&…same query string…

https://mmp.revosurge.com/v1/pb/{partner}/revenue?k=<KEY>&…same query string…
```

### A fired postback

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

```text [Resulting URL]
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

## Responses

The write is confirmed to durable storage **before** we answer. A `200` therefore means the conversion is recorded, not merely received.

| Status | Body | Meaning | Resend? |
|--------|------|---------|---------|
| `200` | `{ "status": "ok" }` | Stored and confirmed | No |
| `200` | `{ "status": "ignored" }` | The payload carried no usable identity, so there is nothing to record | No — a resend would be identical |
| `503` | `{ "status": "unavailable" }` | We could not confirm storage | **Yes** — this is the only case where a resend helps |
| `403` | — | Bad key, or a source IP outside the allowlist | No — fix the configuration first |

> [!IMPORTANT]
> **We never return `4xx` for a payload problem.** A `4xx` is commonly read as permanent and can lead to the postback being disabled altogether — and the raw URL is already preserved in our request log, which is where a malformed postback actually gets diagnosed. If a postback is being dropped, you will hear it from us, not from the status code.

### Retry policy we expect

- Retry on `503`, on a connection error, and on a timeout.
- Use exponential backoff, and **carry the same `event_id`** on every attempt so the retry collapses onto the original record.
- Do not retry on `200` or `403`.

## Deduplication

Every postback is reduced to a **dedup key**, and a resend that produces the same key collapses onto the same record instead of creating a second one. The key is chosen in this order:

1. `event_id`, if present.
2. `txid`, if `event_id` is absent.
3. Otherwise a hash of the whole query string, prefixed `h:`.

The fallback is deliberately conservative: it collapses only a **byte-identical** resend (parameter order aside). It is a safety net, not a substitute for an id.

> [!IMPORTANT]
> **Send a globally unique, stable `event_id`, and repeat it verbatim on every retry.** Without one, a retried revenue event is indistinguishable from a second, genuine revenue event — and a retried deposit inflates settlement. `event_id` must be unique **across event types**, not just within one.

## How values are interpreted

| Field | Rule |
|-------|------|
| `amount` | Parsed as a signed decimal. **Negative values are valid** — under a revenue share, a losing period for the operator is a negative income event. The raw string is always preserved alongside the parsed value, so a parse failure never loses the number |
| Currency | Settlement is in **USD**; no currency macro is expected. If you send a `currency` parameter with anything other than `USD`, it is recorded and raised as a contract change rather than silently converted |
| `ts` | **Unix milliseconds**, and that has not changed. If a value arrives in seconds we correct it and keep the event time — but the correction is treated as a **deviation from the contract**: it raises an alert on our side and we will contact you. It is not a second supported format; do not rely on it. A value that is neither reading (outside a plausible range, negative, non-numeric) **cannot have its event time recovered**: the event is stored with no timestamp, with the raw string kept |
| `first_deposit_ts` | Exactly the same rules as `ts` — same unit, same correction, same alert |
| `attribution_share` | Recorded verbatim, never rescaled, and never multiplied into an amount — see [What your claim fields mean](#what-your-claim-fields-mean) |
| Event age | Events older than **30 days** or more than **60 minutes** in the future are recorded and flagged, never rejected. Under a lifetime revenue share, revenue for an old player is exactly what the integration is for |
| Unsubstituted macros | A value that arrives as a literal macro (e.g. `click_id={sub1}`) is treated as absent, not as a string. See below |

### Unsubstituted macros

A URL pasted into an email or a ticket gets fetched by link scanners with the macros still literal. Left untreated, `click_id={sub1}` is a non-empty string and would manufacture a conversion that looks entirely legitimate — so:

- A literal macro in `click_id` or `user_id` **drops the postback** (`200 ignored`).
- A literal macro in any other parameter costs only that field; the rest of the event is recorded, and the literal value is kept verbatim for diagnosis.

## Verifying an integration

Before switching real traffic on, confirm all four behaviours:

```bash
KEY="<your-key>"

# 1. Happy path — expect 200 {"status":"ok"}
curl -s "https://mmp.revosurge.com/v1/pb/{partner}/registration?k=$KEY&click_id=test-click-001&user_id=p_test"

# 2. Wrong key — expect 403
curl -s -o /dev/null -w '%{http_code}\n' "https://mmp.revosurge.com/v1/pb/{partner}/revenue?k=WRONG"

# 3. No identity — expect 200 {"status":"ignored"}
curl -s "https://mmp.revosurge.com/v1/pb/{partner}/registration?k=$KEY"

# 4. Unsubstituted macro — expect 200 {"status":"ignored"}
curl -s "https://mmp.revosurge.com/v1/pb/{partner}/registration?k=$KEY&click_id=%7Bsub1%7D"
```

Then send one real test conversion through your back office and ask us to confirm, field by field. Three things are worth checking explicitly, because each one produces clean-looking but wrong data if it is off:

1. **The unit and timezone of `ts`** (and of `first_deposit_ts`, if you send it) — send milliseconds. A value in seconds is corrected, but it counts as a contract deviation and you will hear from us; a value that is neither leaves the event with no time at all.
2. **Whether `event_id` actually arrives** — we can measure how often the hash fallback is used, and that number should be zero.
3. **The real values of `hash_id` and `source_id`** — the drift alert stays silent until we record your baseline.
