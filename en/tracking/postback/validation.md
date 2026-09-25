---
title: Partner Postback validation
description: The rules your postback setup must pass before you launch, what breaks when each one fails, and how to fix it.
---

# Partner Postback validation

**For:** Whoever configures postbacks in your affiliate back-office, and the AM or BD
confirming the setup is ready. Run this **before** the first campaign goes live.

Postbacks are plain HTTP `GET` calls to `https://mmp.revosurge.com`, with everything in the
query string.

::: info Two tiers of rule
**Required** rules block a launch. **Recommended** rules do not, but each costs you something
specific — usually attribution quality or the ability to reconcile.

Rule IDs (`PB-R-01`, `PB-O-01`…) are stable. Quote them in tickets and partner emails.
:::

::: warning Postback failures are quiet by design
RevoSurge never returns `4xx` for a payload problem. A postback with no usable identity returns
`200 {"status":"ignored"}` — your back-office logs it as a success and the conversion is gone.
Most of this page exists because of that one behaviour.
:::

## Required rules

| ID | Rule | What breaks if it fails |
| --- | --- | --- |
| `PB-R-01` | `k` is present and correct on every call | `403`. Nothing is recorded. |
| `PB-R-02` | The **endpoint path** matches the event — the path decides the event type | The `event` macro is recorded for cross-checking only and never used to classify. Post a deposit to the registration path and it is a registration, permanently. |
| `PB-R-03` | At least one of `click_id` or `user_id` is present | `200 {"status":"ignored"}`. Looks like a success in your logs. The conversion does not exist. |
| `PB-R-04` | No unsubstituted macros in `click_id` or `user_id` | A literal `{sub1}` drops the whole postback. In other fields only that field is lost. |
| `PB-R-05` | First deposits go to `/first-deposit`, later ones to `/repeat-deposit` | FTD counts are wrong in both directions, and FTD is usually what the campaign is bidding on. |
| `PB-R-06` | `ts` is unix **milliseconds**, not seconds | Seconds are auto-corrected and raised as a contract deviation. Nothing fails, but you are relying on our correction rather than sending what you mean — and the alert lands on your account manager, not you. |
| `PB-R-07` | `amount` is sent on `/first-deposit`, `/repeat-deposit` and `/revenue`, with the correct sign | No revenue to report and nothing to compute ROAS from. |
| `PB-R-08` | `event_id` is globally unique, stable, and repeated **verbatim** on retries | Without it dedup falls back to `txid`, then to a hash of the query string. A retry with any field reordered becomes a second conversion. |
| `PB-R-09` | `503` is retried; `200` and `403` are not | `503` means the write was not confirmed — that conversion is lost unless you resend. Retrying a `200` risks duplicates if `event_id` is missing. |
| `PB-R-10` | `dryrun` is **not** present on the registered production URL | Every postback returns a verdict and records nothing. |
| `PB-R-11` | `user_id` is the same identifier you use in the Web Tracker and S2S | The player becomes two profiles. Deposits do not join to the click that won them. |
| `PB-R-12` | Postbacks fire **server-side** from your back-office, not from a browser | The `k` key travels in the URL in plain text — a browser-fired postback puts it in page source. Client-side calls are also lost to ad blockers and repeat on refresh. |

## Recommended rules

| ID | Rule | What it costs |
| --- | --- | --- |
| `PB-O-01` | Send `ctx` | No fallback attribution when `click_id` is missing or stale. |
| `PB-O-02` | Send `txid` as a secondary dedup key | If `event_id` is ever absent, dedup drops to a query-string hash, which is fragile. |
| `PB-O-03` | Populate `hash_id` / `hash_name` and `source_id` / `source_name` with real values | No link or traffic-source breakdown. When a campaign underperforms you cannot tell which placement produced the deposits. |
| `PB-O-04` | Send `country` | Weaker geo reporting; we fall back to inference. |
| `PB-O-05` | Send your own event-type macro as `event` | Loses the cross-check that catches a wrong-endpoint mistake (`PB-R-02`). |
| `PB-O-06` | Declare `is_new_customer` and `first_deposit_ts` where you know them | We cannot corroborate your FTD classification against ours. |
| `PB-O-07` | Declare `attribution_share` if you operate a shared-credit model | Attribution is treated as whole-credit, overstating both RevoSurge's contribution and yours. |

## Required resolutions

### `PB-R-01` — Bad or missing key

**Fix:** Add `k=<your postback key>` to the URL. The key is issued during onboarding — ask
your account manager if you do not have it.

Treat it as a shared secret: it goes in the server-side postback URL your back-office stores,
never in anything a player's browser can see.

### `PB-R-02` — Wrong endpoint for the event

**Fix:** Use the path that matches the event:

| Event | Path |
| --- | --- |
| Player account created | `/v1/pb/{partner}/registration` |
| First deposit | `/v1/pb/{partner}/first-deposit` |
| Subsequent deposit | `/v1/pb/{partner}/repeat-deposit` |
| Revenue-share settlement | `/v1/pb/{partner}/revenue` |

There is no fifth path. Negative `amount` values are valid on `/revenue` — under a revenue
share, a losing period is a negative income event. If you need to report a **chargeback or
clawback** specifically, agree the representation with your account manager rather than
assuming a negative revenue line will be interpreted that way.

Setting the `event` macro correctly does not help — it is recorded for cross-checking and
never used to classify. Only the path counts.

### `PB-R-03` — No usable identity

**Fix:** Send `click_id` (preferred) or `user_id`. At least one must resolve to a real value.

Check this against your *logs*, not your assumptions: the response is `200`, so your
back-office almost certainly reports these as delivered.

### `PB-R-04` — Unsubstituted macros

**Fix:** Fire one test postback and read back the stored values. If `click_id` arrives as the
literal `{click_id}` or `{sub1}`, the macro name in your back-office does not match what that
platform substitutes.

In fields other than `click_id` and `user_id`, an unsubstituted macro does not drop the
postback: the field is omitted but the literal value is kept for diagnosis, which is exactly
what to look for when working out which macro name is wrong.

This is the most common failure at launch, because a template that looks right in the config
screen only reveals itself when a real conversion runs through it.

### `PB-R-05` — First and repeat deposits on the same path

**Fix:** Your back-office must know whether a deposit is the player's first and route to the
matching path. If it cannot, send everything to `/repeat-deposit` and tell your account
manager — an undercounted FTD is recoverable; a registration-path deposit is not.

### `PB-R-06` — Timestamp in seconds

**Fix:** `ts` and `first_deposit_ts` are unix **milliseconds**. Multiply a 10-digit value by
1000.

Seconds are detected, corrected, and treated as a contract deviation — the event is stored with
the corrected time and an alert is raised. So this will not show up as a failure in your logs,
but it is not silently wrong either: your account manager will hear about it.

Separately, events more than 30 days old or more than 60 minutes in the future are recorded and
flagged, never refused.

### `PB-R-07` — Missing or wrongly signed amount

**Fix:** Send `amount` as a signed decimal on every deposit and revenue postback. Settlement
is in USD and no conversion is performed, so send USD.

Negative values are valid and expected under revenue share: a losing period for the operator is
a negative income event.

### `PB-R-08` — No stable `event_id`

**Fix:** Generate a globally unique ID per conversion in your own system and send it as
`event_id`. On any retry, send the identical value.

Dedup priority is `event_id`, then `txid`, then a byte-identical hash of the query string.
The hash fallback is not a safety net: change the parameter order, add a field, or re-encode a
value and the same conversion is counted twice.

### `PB-R-09` — Wrong retry behaviour

**Fix:**

| Response | Meaning | Retry |
| --- | --- | --- |
| `200 {"status":"ok"}` | Written to durable storage | No |
| `200 {"status":"ignored"}` | No usable identity — fix the payload | No, it will fail identically |
| `503 {"status":"unavailable"}` | Write not confirmed | **Yes** |
| `403` | Bad key or disallowed IP | No |

A `200` confirms the write completed, not merely that we received it.

### `PB-R-10` — Dry run left on

**Fix:** Remove the dry-run parameter from the URL registered in your back-office. `dryrun`,
`dryrun=1` and `dryrun=true` are all accepted, so search for `dryrun` rather than the exact
string. A dry-run response carries the header `X-Ingest-Mode: dryrun` and records nothing.

### `PB-R-11` — Identifier does not match your other tracking

**Fix:** Use one identifier per player across the Web Tracker (`user_id`), S2S
(`identity.client_user_id`) and postbacks (`user_id`). Same string, same casing, no prefix on
one and not the others.

Every postback succeeds when this is wrong, and the numbers are simply incorrect. Fixing it
later does not merge profiles that were already split.

### `PB-R-12` — Postbacks fired from the browser

**Fix:** Fire from your affiliate platform's server-side postback feature. A pixel or
client-side call puts the `k` key into page source, is lost to ad blockers, and repeats every
time the player refreshes.

RevoSurge may also restrict postbacks to your egress IP allowlist — ask your account manager
whether that is enabled for you, because a browser-origin call would then fail `403`.

## Recommended resolutions

### `PB-O-01` — No `ctx`

**Fix:** Pass the delivery-context macro your platform provides. It is what lets attribution
recover when `click_id` is missing or expired.

### `PB-O-02` — No `txid`

**Fix:** Send your transaction ID as `txid`. It is the second dedup key, and the field your
finance team will reconcile against.

### `PB-O-03` — Empty taxonomy fields

**Fix:** Map `hash_id` / `hash_name` to your link or account identifiers, and `source_id` /
`source_name` to your traffic source.

Send real values, not placeholders. A constant here is worse than an empty field, because it
looks populated and quietly breaks every breakdown built on it.

### `PB-O-04` — No `country`

**Fix:** Send the player's country if your platform exposes it.

### `PB-O-05` — No `event` macro

**Fix:** Send your own event-type macro as `event`. It never changes how the conversion is
classified — that is the endpoint path's job — but it is how a wrong-endpoint mistake gets
caught before it distorts a month of reporting.

### `PB-O-06` — No FTD declaration

**Fix:** Send `is_new_customer` and `first_deposit_ts` when your system knows them. Values we
cannot read are recorded as unset rather than as `0`.

### `PB-O-07` — No attribution share

**Fix:** If you split credit across sources, declare your share in `attribution_share`. It is
recorded as your declaration — it is never rescaled or multiplied into `amount`.

## Two things this page cannot check

- **That your back-office actually fires on a real conversion.** Every rule here can pass on a
  URL you pasted into a browser while the platform's postback rule is disabled, scoped to the
  wrong campaign, or filtered by a condition that never matches. Only the
  [go-live test](/en/tracking/postback/handoff#the-go-live-test) proves otherwise.
- **That your totals match ours.** Attribution windows, shared-credit models and settlement
  timing all move numbers legitimately. Reconcile on `event_id` and `txid` rather than
  comparing totals.

## Next steps

Once every required rule passes, go to [Handoff & go-live](/en/tracking/postback/handoff).
