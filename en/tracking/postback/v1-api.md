---
title: "Partner Postback API (v1)"
description: "Partner Postback v1 endpoints, flat query fields, dry run, response and delivery behavior."
---

# Partner Postback API (v1)

Use v1 when its event routes and flat parameter contract fit your platform. Compare [v1 and v2](/en/tracking/postback/overview#choose-version) before configuring your templates; either version can be selected according to platform support.

## v1 API reference {#v1-compatibility}

Everything below applies to the five v1 paths. Use the matching path for each supported business action; changing only query names or adding `event` does not turn it into v2. The original section anchors remain available.

### Postback vs. Server Events API

| | Partner Postback | [Server Events API (v3)](/en/tracking/s2s/v3/server-events-api) |
|---|---|---|
| Who fires the call | Your affiliate back office | Your backend |
| Transport | `GET` + query-string macros | `POST` + JSON envelope |
| Authentication | Static key in the `k` parameter | `X-API-KEY` header |
| Setup | Register a URL per event type | Write an integration |
| Best for | Operators whose back office already emits postbacks | Full control over the event catalog and payload |

> [!TIP]
> The two are not mutually exclusive. Postbacks are typically used for the settlement events an operator's back office owns (registration, deposits, revenue share), while the Server Events API carries the richer in-product event stream.

### Base URL

| Environment | Base URL |
| --- | --- |
| Production | `https://mmp.revosurge.com` |

In v1 paths, `{partner}` is either a Postback Connection ID or a legacy partner slug configured by RevoSurge. Use the identifier and key issued for your integration.

### Authentication

Send the matching key in `k`. Connection IDs use their active/retiring keys, enable/disable state and rotation grace period described [above](/en/tracking/postback/v2-api#v2-authentication); v1 Connections may link multiple products. Parameter aliases configured on a Connection are applied before v1 parsing; the alias wins over the canonical name on conflict, while raw input is retained. `k`, `dryrun` and `testmode` cannot be remapped.

Legacy partner credentials remain separately configured by RevoSurge and may have an egress IP allowlist. The Connection path does not inherit that legacy allowlist. Bad keys, expired keys, disabled Connections or disallowed legacy IPs return `403`. Authenticated rate limiting returns `429` with `Retry-After`.

Keep the key in server-side configuration and redact it when sharing URLs. `k` is excluded from stored business input and redacted in request audit.

### Endpoints

RevoSurge uses **local postbacks**: one URL per event type. The **path decides the event type** — the `event` macro is recorded for cross-checking but is never used to classify the conversion, so a change to what your template expands to cannot silently reclassify our conversions.

`GET /v1/pb/{partner}/registration`

`GET /v1/pb/{partner}/first-deposit`

`GET /v1/pb/{partner}/repeat-deposit`

`GET /v1/pb/{partner}/revenue`

`GET /v1/pb/{partner}/app-launch`

| Endpoint | Recorded as | `reported_first` | Fire it when |
|----------|-------------|------------------|--------------|
| `/registration` | `register` | — | A player account is created — the first event carrying a player id |
| `/first-deposit` | `deposit` | `1` | A deposit your system considers the player's first |
| `/repeat-deposit` | `deposit` | `0` | Any subsequent deposit |
| `/revenue` | `partner_revenue` | — | A revenue-share settlement event |
| `/app-launch` | `app_launch` | — | **Every** launch of your app — see [App launches](#app-launches) |

All five take an **identical parameter set** — only the path differs — so you can register them from one template. Register only the endpoints for events you actually send.

Three notes on how these are recorded:

- **`first-deposit` and `repeat-deposit` both store `deposit`**, with your first-deposit claim kept as a flag rather than as truth. RevoSurge computes first-time deposits independently, and the difference between the two figures is free reconciliation.
- **`revenue` is stored as `partner_revenue`, not as GGR.** It is the commission figure, which differs from operator GGR by the revenue-share rate; conflating them would be a units error.
- **`app-launch` is stored as `app_launch`, never as an install.** It is an activity signal, not a conversion — see below.

> [!WARNING]
> **Do not register an "all deposits" postback** alongside `first-deposit` and `repeat-deposit` — every deposit would be counted twice.
>
> **Do not register a global postback** (one URL with the event type in a macro). The event type is already in the path. If we add an event type later, we will send you a new URL for it.

#### App launches

`/app-launch` reports activity in your app rather than a conversion. Fire it on **every** launch — not only the first one after install, and not once per player.

- **It is not an install.** App installs reach RevoSurge through your MMP (see [AppsFlyer](/en/mmp/appsflyer/overview)). A launch is recorded as `app_launch` and never counted as an install, so a launch postback cannot double-count installs your MMP already reports. Do not point an install postback at this URL.
- **If your back office marks a first launch**, keep sending it to `/app-launch` and add your own flag as an extra parameter, and agree its name with your account manager. Unlisted parameters are [kept verbatim](#parameters), so the flag reaches us without a change on our side — but it does not turn a launch into an install.
- **No `amount`.** A launch carries no monetary value; leave the macro empty or omit it.
- **Identity rules still apply.** A launch with neither `click_id` nor `user_id` — for example one before the player has registered, if your platform has no click id for it — is dropped with `200 {"status":"ignored"}`. Run a [dry run](#dry-run) against your real template to see which identities your launches actually carry.
- **Send a unique `event_id` per launch.** Launches repeat by nature: without `event_id` (or `txid`) and a `ts`, two launches by the same player can produce byte-identical URLs and collapse into one record. See [Deduplication](#deduplication).
- **Same response contract.** `/app-launch` answers exactly like the conversion endpoints, `503` included — retry it the same way, so your back office needs only one retry rule.

### Parameters

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
| `currency` | Recommended with non-USD amounts | Original declared currency; missing/blank defaults to USD. See the conversion rules below |
| `ts` | Recommended | Event time as **unix milliseconds** |
| `country` | Optional | Player country |
| `attribution_share` | Optional | Your declared attribution share for this conversion — see [What your claim fields mean](#what-your-claim-fields-mean) |
| `is_new_customer` | Optional | Your declaration that this player is new **to you**. Accepts `1`/`0`, `true`/`false`, `yes`/`no` |
| `first_deposit_ts` | Optional | Your declared first-deposit time, as **unix milliseconds** — same unit and same parsing as `ts` |
| `hash_id`, `hash_name` | Recommended | Your link/account taxonomy identifiers |
| `source_id`, `source_name` | Recommended | Your traffic-source taxonomy identifiers |

\* **At least one of `click_id` or `user_id` must be present.** A postback with neither cannot be addressed to anything and is dropped (with a `200` — see [Responses](#responses)).

In v1, an absent or unexpanded `user_id` is treated as missing and a usable `click_id` can fill it (`userIdBackfilled=true`). A literal macro in `click_id` drops the event even if another identity was supplied. Send a real stable `user_id` whenever available; click-based fallback does not prove a stable player identity. v2 has no such fallback.

Parameters not listed here are **kept verbatim** on the stored event, so a macro you add later still reaches us without a change on our side.

#### What your claim fields mean

`attribution_share`, `is_new_customer` and `first_deposit_ts` are **what you report**. RevoSurge records them next to what it computes itself, never in place of it.

All three are **optional**, and **adding them does not require re-registering your URLs** — an existing registration keeps working exactly as it does today, and a parameter we never receive is simply recorded as unset. If you are registering for the first time, append them to the template now, so you do not pay for a re-registration later:

```text
&attribution_share={attribution_share}&is_new_customer={is_new_customer}&first_deposit_ts={first_deposit_ts}
```

- **`attribution_share` is stored exactly as sent.** The contract does not declare a scale — `0.5` and `50` both read as "half" — so RevoSurge neither rescales it nor multiplies any amount by it. Agree the scale with us explicitly before anyone relies on the number.
- **`is_new_customer` is your view, not our first-deposit calculation.** We continue to determine first-time deposits independently; the gap between the two is a reconciliation signal, not an error. A value we cannot read is recorded as unset, never as `0` — "no" and "unreadable" must not collapse into the same answer.
- **`first_deposit_ts` follows the `ts` rules exactly.** See [How values are interpreted](#how-values-are-interpreted).

#### Why we ask for the taxonomy fields

`hash_id`, `hash_name`, `source_id` and `source_name` are typically **constants** for a single-account integration, so they attribute nothing today. We ask for them anyway because:

1. A value that is not ours means traffic has been miswired — either someone else's traffic is pointed at our URL, or ours is registered under another account. This is monitored and alerted on.
2. They become meaningful the moment the integration grows past one link.
3. Adding a macro later means re-registering the URLs in your back office. Sending them from day one is far cheaper.

### Example

#### URL template

Register one URL per event you send, substituting your partner slug and key. The `{...}` values are **your back office's macro names** — the example below uses the common `sub1`/`sub2` convention.

```text
https://mmp.revosurge.com/v1/pb/{partner}/registration?k=<KEY>&click_id={sub1}&ctx={sub2}&event={event}&user_id={user_id}&event_id={event_id}&txid={transaction_id}&amount={amount}&ts={date}&country={country}&hash_id={hash_id}&hash_name={hash_name}&source_id={source_id}&source_name={source_name}

https://mmp.revosurge.com/v1/pb/{partner}/first-deposit?k=<KEY>&…same query string…

https://mmp.revosurge.com/v1/pb/{partner}/repeat-deposit?k=<KEY>&…same query string…

https://mmp.revosurge.com/v1/pb/{partner}/revenue?k=<KEY>&…same query string…

https://mmp.revosurge.com/v1/pb/{partner}/app-launch?k=<KEY>&…same query string…
```

#### A fired postback

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

### Responses

These are **v1 live** responses. With the business destination enabled and the default synchronous confirmation active, `200 ok` follows broker ACK. Historical asynchronous compatibility or a deliberately disabled destination can also return `200 ok` without confirmed business publication. Check the actual configuration and delivery evidence before launch; a bare `200` is insufficient.

| Status | Body | Meaning | Resend? |
| --- | --- | --- | --- |
| `200` | `{ "status": "ok" }` | Accepted under the configured v1 publish behavior | No automatic retry |
| `200` | `{ "status": "ignored" }` | No usable identity or fatal click macro; no business event | Fix the input |
| `503` | `{ "status": "unavailable" }` | Publication unconfirmed; may arrive later after timeout | Retry with the same source IDs |
| `403` | Existing auth response | Key/Connection error or disallowed legacy IP | Fix configuration |
| `429` | Existing rate-limit response | Authenticated rate limit | Follow `Retry-After` |

v1 does not return payload `4xx` for its tolerant admission failures. This does not apply to v2.

#### Retry policy we expect

Retry `503`, connection errors and timeouts with exponential backoff, preserving `event_id`, `txid`, source time and business values. Follow `Retry-After` on `429`. Fix `403` before resending; do not automatically retry `200`. Source keys support downstream deduplication but do not establish that it has happened.

### Deduplication

The source-key priority is `event_id`, then `txid`, otherwise `h:` plus SHA-256 of decoded raw parameters canonicalized as sorted `k=v` pairs. Query parameter order does not change the fallback key; changed business values or timestamps can. Authentication and mode controls are excluded. A Connection prefixes the key with `<connectionId>:`; legacy partner traffic retains its unprefixed form.

Send a globally unique, stable `event_id` across event types and repeat it verbatim on retries. Generating the key does not itself collapse records: downstream consumers perform business deduplication. v1/v2 fallback representations differ, so dual sending does not guarantee automatic deduplication.

### How values are interpreted

| Field | Rule |
|-------|------|
| `amount` | Parsed as a signed decimal. **Negative values are valid** — under a revenue share, a losing period for the operator is a negative income event. The raw string is always preserved alongside the parsed value, so a parse failure never loses the number |
| Currency | Send original `amount` and `currency`; missing/blank currency defaults to USD. When conversion enrichment is enabled, supported currencies use the available financial FX snapshot; USD and USDT use explicit identity/1:1 policies. Source delivery continues if FX is unavailable. Keep source fields and check `revosurge_currency_conversion_status`; only a successful `revosurge_target_amount` is the derived USD amount. Legacy `amount` remains the incoming number and legacy `currency` remains USD: that pair is not proof of conversion |
| `ts` | **Unix milliseconds**, and that has not changed. If a value arrives in seconds we correct it and keep the event time — but the correction is treated as a **deviation from the contract**: it raises an alert on our side and we will contact you. It is not a second supported format; do not rely on it. A value that is neither reading (outside a plausible range, negative, non-numeric) **cannot have its event time recovered**: the event is stored with no timestamp, with the raw string kept |
| `first_deposit_ts` | Exactly the same rules as `ts` — same unit, same correction, same alert |
| `attribution_share` | Recorded verbatim, never rescaled, and never multiplied into an amount — see [What your claim fields mean](#what-your-claim-fields-mean) |
| Event age | Events older than **30 days** or more than **60 minutes** in the future are recorded and flagged, never rejected. Under a lifetime revenue share, revenue for an old player is exactly what the integration is for |
| Unsubstituted macros | A value that arrives as a literal macro (e.g. `click_id={sub1}`) is treated as absent, not as a string. See below |

#### Unsubstituted macros

A URL pasted into an email or a ticket gets fetched by link scanners with the macros still literal. Left untreated, `click_id={sub1}` is a non-empty string and would manufacture a conversion that looks entirely legitimate — so:

- A literal macro in `click_id` **drops the v1 postback** (`200 ignored`).
- A missing/unexpanded `user_id` is absent; a usable click ID can fill it. Without either usable identity the postback is ignored.
- Other unexpanded fields are omitted from parsed values while their original input is retained for diagnosis.

### Dry run

Append `dryrun=1` to a v1 URL for a parse/admission verdict without business publication. An authenticated, rate-admitted probe returns `200` and `X-Ingest-Mode: dryrun`; bad authentication remains `403` and limits remain `429`. `dryrun` and `dryrun=true` enable it; `0`, `false` and `no` disable it. Dryrun wins over `testmode`. Remove both flags before the agreed live launch.

#### Why this exists

v1 live admission failures return `200 ignored`; the v1 dryrun verdict distinguishes them using `decision=dropped` and `reason`. A valid verdict uses `decision=accepted`. These are different from the v2 `status=validated/rejected` contract.

#### The verdict

```bash
curl -sS -G "https://mmp.revosurge.com/v1/pb/{partner}/first-deposit" \
  --data-urlencode "k=$REVOSURGE_POSTBACK_KEY" \
  --data-urlencode "click_id=8f1c2d5e-4a7b-4c31-9e0d-6b2f7a1c93de" \
  --data-urlencode "event_id=docs-v1-deposit-1" \
  --data-urlencode "amount=12.34" --data-urlencode "currency=USD" \
  --data-urlencode "ts=1794801600000" --data-urlencode "dryrun=1"
```

```json
{
  "mode": "dryrun",
  "partner": "example-partner",
  "route": "first_deposit",
  "decision": "accepted",
  "stored": false,
  "eventName": "deposit",
  "reportedFirst": 1,
  "dedupKey": "docs-v1-deposit-1",
  "dedupKeySource": "event_id",
  "clickId": "8f1c2d5e-4a7b-4c31-9e0d-6b2f7a1c93de",
  "userId": "8f1c2d5e-4a7b-4c31-9e0d-6b2f7a1c93de",
  "userIdBackfilled": true,
  "unreplacedMacros": [],
  "eventUnixTs": 1794801600,
  "eventTimeRaw": "1794801600000",
  "coercedTimeFields": [],
  "amount": 12.34,
  "currency": "USD"
}
```

This illustrative v1 probe omits `user_id`, so the usable click ID is backfilled. `stored=false` is expected in dryrun. In v1 `testmode`, `stored=true` indicates submission to the enabled isolated stream, not the synchronous confirmation guarantee of v2.

| Field | Meaning |
| --- | --- |
| `route`, `eventName`, `eventDeclared`, `reportedFirst` | Path-selected event and optional source declarations |
| `decision`, `reason` | `accepted` or `dropped`; drop reasons are `unreplaced_macro`, `empty_request`, `no_identity` |
| `dedupKey`, `dedupKeySource` | Source key, Connection-scoped where applicable; `event_id`, `transaction_id` or `raw_hash` |
| `clickId`, `userId`, `userIdBackfilled` | Resolved identity and whether click-to-user fallback was used |
| `eventUnixTs`, `eventTimeRaw`, `coercedTimeFields` | Parsed time, raw value and corrected input fields; an empty correction list is the goal |
| `amount`, `currency`, `unexpectedCurrency` | Legacy parsed number, legacy USD label and a non-USD declaration signal; these do not show the converted target amount |
| `recorded`, `unreplacedMacros` | Original retained business input and macro diagnostics |
| `productResolution`, `flags`, `warnings` | Connection binding and mapping diagnostics where present |

Conversion results must be checked on the business record's `revosurge_source_*`, `revosurge_target_*` and conversion status fields; the v1 verdict does not expose the complete FX result.

### Verifying an integration

The quickest check on a real payload is a [dry run](#dry-run) — it returns the decision, the dedup key and the identities we resolved, without recording anything.

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
