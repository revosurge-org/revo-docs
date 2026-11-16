---
title: Partner Postback validation
description: Versioned v2 and v1 Postback validation rules, negative probes, retries and delivery evidence.
---

# Partner Postback validation

Validate the API version your platform actually calls. Use `PB2-*` for [v2 canonical events](/en/tracking/postback/partner-postback#v2-api); the existing `PB-R-*` / `PB-O-*` IDs below retain their v1 scope and historical topics. Required rules block launch; recommended rules document data-quality and reconciliation gaps.

## v2 validation {#v2-validation}

| ID | Required rule | Failure and fix |
| --- | --- | --- |
| `PB2-R-01` | Active Connection, valid `k`, exactly one linked product | `403` for bad/expired key or disabled Connection; `422 SINGLE_PRODUCT_REQUIRED` for invalid binding. Fix the Connection, not a query product ID |
| `PB2-R-02` | Exact enabled canonical `event` and catalog-authorized paths | `422 UNKNOWN_EVENT_TYPE` / `EVENT_DISABLED`, or `400` for unknown paths. Confirm the effective product catalog; v1 aliases do not apply |
| `PB2-R-03` | Stable `identity.client_user_id` or `identity.anonymous_id`, plus catalog identity requirements | `422`. A click ID/event ID is not user identity; obtain the real field from its source |
| `PB2-R-04` | Actual event `timestamp` in integer UTC milliseconds | `422` for seconds, ISO strings, fractions, values below `1000000000000` or more than five minutes ahead. Fix the source unit/time; do not use receipt time |
| `PB2-R-05` | Every required field has its declared type, enum and format | `422`. Include base and event-specific fields. Boolean is lowercase `true/false`; preserve real `0`, `false`, decimals and permitted negative fees |
| `PB2-R-06` | Expanded macros, unique query names, non-conflicting paths, valid once-only UTF-8 encoding | `400`; inspect `violations[].field/rule`, or `INVALID_QUERY`. Equal duplicate values are also invalid, including `k` and modes |
| `PB2-R-07` | Amount, currency, fee and payout retain their business meaning | A schema-valid number can still be the wrong fact. Verify original currency and independent fee fields against the source; v2 does not convert to USD |
| `PB2-R-08` | Version-aware response handling and retries | Fix `400/422` payloads and `403` credentials; honor `429 Retry-After`; back off on `503`/network errors. Preserve source IDs and event time; `unknown` may arrive later |
| `PB2-R-09` | Correct mode and server-side firing | Dryrun publishes no business event; test uses an isolated stream. Remove both flags for approved live traffic and verify `accepted`, `stored=true`, `confirmed`; protect `k` from the browser |

| ID | Recommended rule | Verification |
| --- | --- | --- |
| `PB2-O-01` | Send a stable, unique source `event_id` and a real `context.transaction_id` where applicable | Confirm they survive the envelope. Reuse both on retries; neither is the server `requestId` |
| `PB2-O-02` | Return the RevoSurge click ID when available and authorized | Verify `identity.click_id`, separate from the affiliate platform's own click ID; do not invent one |
| `PB2-O-03` | Track changes to the effective catalog and platform macros | Re-run dryrun/test when a field, enum, authorization or template changes; callers do not pin `catalogVersion` |

### Required probes and evidence {#v2-probes}

Start from a complete valid payload for your product and change one condition per probe. Authentication, binding and catalog availability run before some field checks; correct those prerequisites first.

| Probe | Expected result |
| --- | --- |
| Valid `dryrun=1` | `200`, `validated`, `stored=false`, `not_attempted`; inspect typed envelope |
| Missing both user identity fields, or required catalog field | `422 VALIDATION_ERROR` |
| Literal macro in a business value; unknown path; identical duplicate query parameter; parent/child path conflict | `400 VALIDATION_ERROR` |
| Malformed `%` escape or invalid UTF-8 | `400 INVALID_QUERY` |
| Seconds/fractional/future timestamp; wrong type/enum; Boolean `1` | `422 VALIDATION_ERROR` |
| Wrong key / non-single-product Connection | `403` / `422 SINGLE_PRODUCT_REQUIRED` |
| Valid `testmode=1` | `200`, `accepted`, `stored=true`, `confirmed`, with matching isolated business message |

Keep the redacted request, actual response, source IDs, `requestId` and actual `catalogVersion`. The technical owner must separately establish no business publication for dryrun/rejections and read back the matching test/live message. An audit entry alone is insufficient. Publication failure/timeout behavior belongs in a controlled fault test, not an outage introduced into shared production.

The [response and retry matrix](/en/tracking/postback/partner-postback#v2-responses) is authoritative for v2. A catalog outage before its first load returns `503`; a later refresh failure retains the last good snapshot. Catalog contract conflicts also return `503` and require RevoSurge investigation. Do not treat these as successful validation.

## v1 validation {#v1-validation}

The rules below apply only to the five v1 paths. Their IDs and original section anchors remain available for existing tickets. v1's tolerant payload responses and click-to-user fallback do not apply to v2.

### Required rules

| ID | Rule | What breaks if it fails |
| --- | --- | --- |
| `PB-R-01` | `k` is present and correct on every call | `403`. Nothing is recorded. |
| `PB-R-02` | The **endpoint path** matches the event — the path decides the event type | The `event` macro is recorded for cross-checking only and never used to classify. Post a deposit to the registration path and it is a registration, permanently. |
| `PB-R-03` | At least one of `click_id` or `user_id` is present | `200 {"status":"ignored"}`. Looks like a success in your logs. The conversion does not exist. |
| `PB-R-04` | Expand identity macros correctly | A literal `click_id` macro drops the event; missing/unexpanded `user_id` may be filled from a usable click ID |
| `PB-R-05` | First deposits go to `/first-deposit`, later ones to `/repeat-deposit` | FTD counts are wrong in both directions, and FTD is usually what the campaign is bidding on. |
| `PB-R-06` | `ts` is unix **milliseconds**, not seconds | Seconds are auto-corrected and raised as a contract deviation. Nothing fails, but you are relying on our correction rather than sending what you mean — and the alert lands on your account manager, not you. |
| `PB-R-07` | `amount` is sent on `/first-deposit`, `/repeat-deposit` and `/revenue`, with the correct sign (`/registration` and `/app-launch` carry none) | No revenue to report and nothing to compute ROAS from. |
| `PB-R-08` | Use a globally unique stable `event_id`, repeated on retries | Fallback is `txid`, then sorted raw hashing; changed business values can change that key. Downstream deduplication must be verified |
| `PB-R-09` | Retry `503`/network errors; honor `429 Retry-After`; fix `403` | Preserve source IDs. `200 ok` is not unconditional proof of broker ACK under v1 compatibility settings |
| `PB-R-10` | `dryrun` is **not** present on the registered production URL | Every postback returns a verdict and records nothing. |
| `PB-R-11` | `user_id` is the same identifier you use in the Web Tracker and S2S | The player becomes two profiles. Deposits do not join to the click that won them. |
| `PB-R-12` | Postbacks fire **server-side** from your back-office, not from a browser | The `k` key travels in the URL in plain text — a browser-fired postback puts it in page source. Client-side calls are also lost to ad blockers and repeat on refresh. |

### Recommended rules

| ID | Rule | What it costs |
| --- | --- | --- |
| `PB-O-01` | Send `ctx` | No fallback attribution when `click_id` is missing or stale. |
| `PB-O-02` | Send `txid` as a secondary dedup key | If `event_id` is ever absent, dedup drops to a query-string hash, which is fragile. |
| `PB-O-03` | Populate `hash_id` / `hash_name` and `source_id` / `source_name` with real values | No link or traffic-source breakdown. When a campaign underperforms you cannot tell which placement produced the deposits. |
| `PB-O-04` | Send `country` | Weaker geo reporting; we fall back to inference. |
| `PB-O-05` | Send your own event-type macro as `event` | Loses the cross-check that catches a wrong-endpoint mistake (`PB-R-02`). |
| `PB-O-06` | Declare `is_new_customer` and `first_deposit_ts` where you know them | We cannot corroborate your FTD classification against ours. |
| `PB-O-07` | Declare `attribution_share` where applicable | Missing declarations prevent comparison with your shared-credit model |

### Required resolutions

#### `PB-R-01` — Bad or missing key

Obtain the Connection key through your available account setup or RevoSurge contact; legacy partner keys are managed separately. Follow the rotation grace period and never place `k` in browser code.

#### `PB-R-02` — Wrong endpoint for the event

**Fix:** Use the path that matches the event:

| Event | Path |
| --- | --- |
| Player account created | `/v1/pb/{partner}/registration` |
| First deposit | `/v1/pb/{partner}/first-deposit` |
| Subsequent deposit | `/v1/pb/{partner}/repeat-deposit` |
| Revenue-share settlement | `/v1/pb/{partner}/revenue` |
| App launched (every launch) | `/v1/pb/{partner}/app-launch` |

These are the five v1 paths. An app **install** is not a launch and has no postback path — installs
reach RevoSurge through your MMP. A registration fired from the launch path, or a launch fired
from the registration path, is misclassified permanently, just like a deposit on the wrong path.

Negative `amount` values are valid on `/revenue` — under a revenue
share, a losing period is a negative income event. If you need to report a **chargeback or
clawback** specifically, agree the representation with your account manager rather than
assuming a negative revenue line will be interpreted that way.

Setting the `event` macro correctly does not help — it is recorded for cross-checking and
never used to classify. Only the path counts.

#### `PB-R-03` — No usable identity

**Fix:** Send `click_id` (preferred) or `user_id`. At least one must resolve to a real value.

Check this against your *logs*, not your assumptions: the response is `200`, so your
back-office almost certainly reports these as delivered.

#### `PB-R-04` — Unsubstituted macros

In v1, an absent or unexpanded `user_id` is treated as missing and a usable `click_id` can fill it (`userIdBackfilled=true`). A literal macro in `click_id` drops the event even if another identity was supplied. Send a real stable `user_id` whenever available; click-based fallback does not prove a stable player identity. v2 has no such fallback.

- A literal macro in `click_id` **drops the v1 postback** (`200 ignored`).
- A missing/unexpanded `user_id` is absent; a usable click ID can fill it. Without either usable identity the postback is ignored.
- Other unexpanded fields are omitted from parsed values while their original input is retained for diagnosis.

#### `PB-R-05` — First and repeat deposits on the same path

**Fix:** Your back-office must know whether a deposit is the player's first and route to the
matching path. If it cannot, send everything to `/repeat-deposit` and tell your account
manager — an undercounted FTD is recoverable; a registration-path deposit is not.

#### `PB-R-06` — Timestamp in seconds

**Fix:** `ts` and `first_deposit_ts` are unix **milliseconds**. Multiply a 10-digit value by
1000.

Seconds are detected, corrected, and treated as a contract deviation — the event is stored with
the corrected time and an alert is raised. So this will not show up as a failure in your logs,
but it is not silently wrong either: your account manager will hear about it.

Separately, events more than 30 days old or more than 60 minutes in the future are recorded and
flagged, never refused.

#### `PB-R-07` — Missing or wrongly signed amount

Send a signed decimal `amount` on each deposit/revenue event with the correct business sign. Zero and valid negative values must retain their meaning. Send original `amount` and `currency`; missing/blank currency defaults to USD. When conversion enrichment is enabled, supported currencies use the available financial FX snapshot; USD and USDT use explicit identity/1:1 policies. Source delivery continues if FX is unavailable. Keep source fields and check `revosurge_currency_conversion_status`; only a successful `revosurge_target_amount` is the derived USD amount. Legacy `amount` remains the incoming number and legacy `currency` remains USD: that pair is not proof of conversion

#### `PB-R-08` — No stable `event_id`

The source-key priority is `event_id`, then `txid`, otherwise `h:` plus SHA-256 of decoded raw parameters canonicalized as sorted `k=v` pairs. Query parameter order does not change the fallback key; changed business values or timestamps can. Authentication and mode controls are excluded. A Connection prefixes the key with `<connectionId>:`; legacy partner traffic retains its unprefixed form.

Send a globally unique, stable `event_id` across event types and repeat it verbatim on retries. Generating the key does not itself collapse records: downstream consumers perform business deduplication. v1/v2 fallback representations differ, so dual sending does not guarantee automatic deduplication.

#### `PB-R-09` — Wrong retry behaviour

These are **v1 live** responses. With the business destination enabled and the default synchronous confirmation active, `200 ok` follows broker ACK. Historical asynchronous compatibility or a deliberately disabled destination can also return `200 ok` without confirmed business publication. Check the actual configuration and delivery evidence during handoff; a bare `200` is insufficient.

| Status | Body | Meaning | Resend? |
| --- | --- | --- | --- |
| `200` | `{ "status": "ok" }` | Accepted under the configured v1 publish behavior | No automatic retry |
| `200` | `{ "status": "ignored" }` | No usable identity or fatal click macro; no business event | Fix the input |
| `503` | `{ "status": "unavailable" }` | Publication unconfirmed; may arrive later after timeout | Retry with the same source IDs |
| `403` | Existing auth response | Key/Connection error or disallowed legacy IP | Fix configuration |
| `429` | Existing rate-limit response | Authenticated rate limit | Follow `Retry-After` |

v1 does not return payload `4xx` for its tolerant admission failures. This does not apply to v2.



Retry `503`, connection errors and timeouts with exponential backoff, preserving `event_id`, `txid`, source time and business values. Follow `Retry-After` on `429`. Fix `403` before resending; do not automatically retry `200`. Source keys support downstream deduplication but do not establish that it has happened.

#### `PB-R-10` — Dry run left on

**Fix:** Remove the dry-run parameter from the URL registered in your back-office. `dryrun`,
`dryrun=1` and `dryrun=true` are all accepted, so search for `dryrun` rather than the exact
string. A dry-run response carries the header `X-Ingest-Mode: dryrun` and records nothing.

#### `PB-R-11` — Identifier does not match your other tracking

**Fix:** Use one identifier per player across the Web Tracker (`user_id`), S2S
(`identity.client_user_id`) and postbacks (`user_id`). Same string, same casing, no prefix on
one and not the others.

Every postback succeeds when this is wrong, and the numbers are simply incorrect. Fixing it
later does not merge profiles that were already split.

#### `PB-R-12` — Postbacks fired from the browser

**Fix:** Fire from your affiliate platform's server-side postback feature. A pixel or
client-side call puts the `k` key into page source, is lost to ad blockers, and repeats every
time the player refreshes.

For legacy partner credentials, RevoSurge may also restrict postbacks to your egress IP allowlist — ask your account manager
whether that is enabled for you, because a browser-origin call would then fail `403`.

### Recommended resolutions

#### `PB-O-01` — No `ctx`

**Fix:** Pass the delivery-context macro your platform provides. It is what lets attribution
recover when `click_id` is missing or expired.

#### `PB-O-02` — No `txid`

**Fix:** Send your transaction ID as `txid`. It is the second dedup key, and the field your
finance team will reconcile against.

#### `PB-O-03` — Empty taxonomy fields

Use genuine link/account and traffic-source values. Stable account constants are valid when they identify the agreed account; avoid invented placeholders and document unavailable fields.

#### `PB-O-04` — No `country`

**Fix:** Send the player's country if your platform exposes it.

#### `PB-O-05` — No `event` macro

**Fix:** Send your own event-type macro as `event`. It never changes how the conversion is
classified — that is the endpoint path's job — but it is how a wrong-endpoint mistake gets
caught before it distorts a month of reporting.

#### `PB-O-06` — No FTD declaration

**Fix:** Send `is_new_customer` and `first_deposit_ts` when your system knows them. Values we
cannot read are recorded as unset rather than as `0`.

#### `PB-O-07` — No attribution share

**Fix:** If you split credit across sources, declare your share in `attribution_share`. It is
recorded as your declaration — it is never rescaled or multiplied into `amount`.

### Two things this page cannot check

- **That your back-office actually fires on a real conversion.** Every rule here can pass on a
  URL you pasted into a browser while the platform's postback rule is disabled, scoped to the
  wrong campaign, or filtered by a condition that never matches. Only the
  [go-live test](/en/tracking/postback/handoff#the-go-live-test) proves otherwise.
- **That your totals match ours.** Attribution windows, shared-credit models and settlement
  timing all move numbers legitimately. Reconcile on `event_id` and `txid` rather than
  comparing totals.

### Next steps

Once every required rule passes, go to [Handoff & go-live](/en/tracking/postback/handoff).
