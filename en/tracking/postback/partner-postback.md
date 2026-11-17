---
title: RevoSurge Partner Postback API
sidebar_label: Partner Postback API
description: Partner Postback v2 canonical GET contract, v1 compatibility, identity, modes, responses and migration.
---

# RevoSurge Partner Postback API

Partner Postback sends events from your affiliate platform or back office to RevoSurge using server-side HTTP `GET` callbacks. Choose the API version before registering templates; the versions have different identity, field and response contracts.

## Choose a version {#choose-version}

| | v2 canonical events | v1 compatibility |
| --- | --- | --- |
| Endpoint | `/v2/pb/{connectionId}/events` | Five `/v1/pb/{partner}/...` paths |
| Event selection | Required `event`, resolved against your product's effective catalog | Path decides; `event` is only a cross-check |
| Identity | `identity.client_user_id` or `identity.anonymous_id`, plus catalog requirements | Usable `click_id` or `user_id`; click-to-user fallback exists |
| Fields | Canonical dotted paths and strict scalar types | Flat fields, Connection aliases and tolerant parsing |
| Payload errors | `400` or `422` | Unusable identity returns live `200 ignored` |

For a new canonical integration, use [v2](#v2-api) after confirming your target environment and product are ready. Existing integrations can continue using the [v1 reference](#v1-compatibility). Follow [migration and go-live](/en/tracking/postback/handoff#v2-migration) when switching.

The production MMP origin is `https://mmp.revosurge.com`. Obtain the test origin and confirm v2 availability with your RevoSurge contact; documentation alone does not establish that a particular environment or product is enabled.

## v2 API {#v2-api}

<HttpMethod method="GET" path="/v2/pb/{connectionId}/events" />

`v2` is the transport version. The server selects the current effective product catalog; callers do not choose a preset or catalog version in the URL. Event and field definitions are shared with the [event catalog](/en/tracking/s2s/v3/catalog-governance), [Standard](/en/tracking/s2s/v3/events-standard), [iGaming](/en/tracking/s2s/v3/events-igaming) and [Crypto](/en/tracking/s2s/v3/events-crypto) references. Availability, required fields and enabled custom events depend on your actual product catalog. Use the Postback response rules below rather than the S2S HTTP error table.

### Connection and key {#v2-authentication}

Use an active Postback Connection linked to **exactly one product**, with its key in `k`. Legacy partner slugs cannot use v2. Query parameters cannot select or override the product. Existing parameter-name mappings apply to v1 only: v2 requires canonical paths directly.

Create/select the Connection through your available account setup or your RevoSurge contact. Reveal its key when configuring the server-side template. Active keys and retiring keys within their rotation grace period work; expired/revoked keys and disabled Connections return `403`. A regeneration without a grace period revokes the previous key immediately; a configured grace period can be at most seven days. The legacy partner IP allowlist is a separate v1 configuration, not a Connection setting.

The current Connection URL generator returns v1 URLs. Assemble v2 using the path above and your existing Connection ID/key. **One receiver path does not mean one third-party configuration:** a platform may require a separate event rule and template for each canonical event.

Keep `k` in server-side configuration. It is excluded from the business payload and redacted from request audit. Redact it in shared URLs and evidence.

### Canonical query parameters {#v2-parameters}

| Parameter | Requirement | Meaning |
| --- | --- | --- |
| `k` | Required | Connection key |
| `event` | Required | Exact, enabled canonical event name for this product |
| `event_id` | Recommended; catalog rules also apply | Stable source event ID: 1–256 ASCII characters, first alphanumeric, then alphanumeric or `._:~-` |
| `timestamp` | Required | Actual business event time in UTC epoch **integer milliseconds**, signed 64-bit; at least `1000000000000`, no more than five minutes ahead |
| `identity.client_user_id` / `identity.anonymous_id` | At least one, plus catalog requirements | Stable user or anonymous identity. A catalog can still require a specific identity field |
| `identity.click_id` | When available and allowed by the catalog | RevoSurge click ID for attribution; not a substitute for user identity |
| `context.*`, other `identity.*` | Per effective catalog | Exact canonical paths, types, enums and requirement levels |
| `dryrun`, `testmode` | Optional controls | Validation or isolated test mode; excluded from business `raw` and fallback hashing |

v2 never fills a missing user identity from a click ID. Keep your affiliate platform's own click ID separate from the RevoSurge click ID. Do not manufacture a user ID from each click or substitute receipt time for business event time.

The parser enforces these rules:

- Dotted paths form nested objects, for example `context.privacy.marketing_consent`. Only catalog-authorized scalar paths are accepted; an arbitrary JSON object in a query value is not a nested object.
- Missing, blank and case-insensitive literal `null` values are absent. Optional absent values are omitted from the typed envelope; the decoded input remains in `raw`. Required fields must still be supplied.
- Strings retain their content. Numbers use precise decimal parsing; `0` is retained. Booleans accept only lowercase `true` and `false`; `1`, `0`, `yes` and `TRUE` are not Boolean substitutes. Valid `false` is retained.
- Seconds, ISO time strings and fractional milliseconds are rejected. v1 time correction does not apply.
- Unknown paths, unexpanded macros anywhere in business values, duplicate query names (even equal values, including `k` and mode flags), and parent/child path conflicts are rejected. A conflicting example is `context.reward` together with `context.reward.value`.
- Encode values once using UTF-8 form URL encoding: `+` means a space; use `%2B` for a literal plus, `%26` for `&`, and `%25` for `%`. Invalid percent escapes or UTF-8 are rejected. `%252B` decodes once to the literal `%2B`.

### Registration device fields {#v2-registration-device}

For `register` and `referral_register`, pass `context.device_brand`, `context.device_model`, `context.platform` and `context.os` as canonical dotted query parameters. All four are **String / Suggested**; any subset, including none, is accepted when the rest of the event is valid. `platform` accepts only `web`, `android` or `ios`. The other three fields have no closed enum.

Use the device that completed this registration; for a referral, use the **new user's** device. Preserve the original model identifier and omit unavailable values. See [registration device collection](/en/tracking/s2s/v3/events-standard#registration-device) for the full rules. v2 omits blank values from the typed envelope, but `-` is not automatically removed from the brand, model or OS fields. Clean unavailable values at the source.

### Amounts and currencies {#v2-values}

Send original amounts and currencies in the catalog's canonical fields. v2 does not automatically convert them to USD. For a `trade` contract, `context.amount` / `context.currency` describe the trade; `context.fee_amount` / `context.fee_currency` describe its fee independently. Preserve exact decimals and valid negative fees. Missing amounts are not invented as zero.

`payout` is not an alias for a deposit, trade amount or fee. Only use a payout/reward/summary field if its exact path is authorized in the effective catalog, with the business meaning defined there. Unknown payout parameters are rejected.

### Modes, responses and retries {#v2-responses}

Live is the default. `dryrun=1` validates without publishing a business event; `testmode=1` publishes to the isolated test stream. `dryrun` takes precedence when both are enabled. Present flags other than `0`, case-insensitive `false` or `no` enable the mode; bare flags also enable it. Receiver responses echo the effective mode in `X-Ingest-Mode`.

| HTTP / result | `status` / `code` | `stored` / `publishOutcome` | Action |
| --- | --- | --- | --- |
| `200`, valid dryrun | `validated` / `VALIDATED` | `false` / `not_attempted` | Inspect the envelope; no business event was published |
| `200`, live/test broker ACK | `accepted` / `PUBLISHED` | `true` / `confirmed` | No retry |
| `400`, malformed encoding | `rejected` / `INVALID_QUERY` | `false` / `not_attempted` | Fix encoding |
| `400`, duplicate/macro/unknown or conflicting path | `rejected` / `VALIDATION_ERROR` | `false` / `not_attempted` | Fix the named field/rule |
| `422`, required/type/enum/time/identity error | `rejected` / `VALIDATION_ERROR` | `false` / `not_attempted` | Fix the payload |
| `422`, Connection not bound to one product | `rejected` / `SINGLE_PRODUCT_REQUIRED` | `false` / `not_attempted` | Correct the Connection binding |
| `422`, unavailable event | `rejected` / `UNKNOWN_EVENT_TYPE` or `EVENT_DISABLED` | `false` / `not_attempted` | Check the exact name and product authorization/enabled state |
| `403`, authentication | Existing auth response | No business publish | Fix the key/Connection; do not blindly retry |
| `429`, rate limit | Existing rate-limit response | No business publish | Wait for `Retry-After` |
| `503`, catalog not loaded/conflicting | `rejected` / `CONFIGURATION_UNAVAILABLE` or `CATALOG_EVENT_CONFLICT` | `false` / `not_attempted` | Retry with backoff; have RevoSurge resolve persistent configuration errors |
| `503`, destination disabled/unusable | `rejected` / `PUBLISH_DISABLED` or `TEST_STREAM_UNAVAILABLE` | `false` / `not_attempted` | Have RevoSurge restore the destination; avoid a tight retry loop |
| `503`, send failed | `rejected` / `PUBLISH_FAILED` | `false` / `failed` | Retry with backoff and the same source IDs |
| `503`, ACK deadline expired | `rejected` / `PUBLISH_TIMEOUT` | `false` / `unknown` | May arrive later; retry with the same source IDs |

Receiver verdicts contain `status`, `code`, `mode`, `stored`, `publishOutcome`, `requestId`, `catalogVersion`, `envelope` and `violations` (`field` / `rule`). Authentication and rate-limit responses do not promise this verdict shape. A valid dryrun returns `200`; invalid dryruns can return `400`, `422`, `403`, `429` or `503`.

v2 always waits for broker ACK in live and test modes. `stored=true` means confirmed publication to that stream, not proof of ClickHouse storage, statistical deduplication, reporting or campaign attribution. `stored=false` with `unknown` means unconfirmed at response time; it does not cancel an in-flight send. Audit records are independent of business publication. A `requestId` or an audit record alone is not a delivery receipt.

Retry connection errors/timeouts and retryable `503`s using exponential backoff. Preserve the original `event_id`, transaction ID, event time and business values across attempts; `requestId` identifies a request and must not replace a source business ID.

### Example requests {#v2-examples}

Set `MMP_URL` to the confirmed MMP origin (without a trailing slash), `CONNECTION_ID` to the single-product Connection ID, and `POSTBACK_KEY` to its secret. `TS_MS` below is a synthetic event time generated once for the example; retries reuse it. Real events must use their actual occurrence time.

Use an isolated test product and the confirmed test origin. These are synthetic examples, not evidence of a production conversion. `register` requires its effective catalog's base fields, including `identity.client_user_id` and `context.ip_address` in the documented Standard contract. The `trade` example additionally requires an enabled compatible Crypto contract with transaction ID, product type, amount/currency and fee amount/currency. Confirm those requirements before running; do not drop required fields to make a sample pass.

```bash
TS_MS=$(python3 -c 'import time; print(time.time_ns() // 1000000)')

# Validate register without business publication; false must survive.
curl --get "$MMP_URL/v2/pb/$CONNECTION_ID/events" \
  --data-urlencode "k=$POSTBACK_KEY" --data-urlencode 'dryrun=1' \
  --data-urlencode 'event=register' --data-urlencode 'event_id=docs-register-1' \
  --data-urlencode "timestamp=$TS_MS" \
  --data-urlencode 'identity.client_user_id=测试 + & 用户' \
  --data-urlencode 'context.ip_address=192.0.2.139' \
  --data-urlencode 'context.device_brand=Apple' \
  --data-urlencode 'context.device_model=iPhone15,3' \
  --data-urlencode 'context.platform=ios' \
  --data-urlencode 'context.os=iOS' \
  --data-urlencode 'context.privacy.marketing_consent=false'

# Isolated test: original currency, precise amount and an independent negative fee.
curl --get "$MMP_URL/v2/pb/$CONNECTION_ID/events" \
  --data-urlencode "k=$POSTBACK_KEY" --data-urlencode 'testmode=1' \
  --data-urlencode 'event=trade' --data-urlencode 'event_id=docs-trade-1' \
  --data-urlencode "timestamp=$TS_MS" \
  --data-urlencode 'identity.client_user_id=docs-player' \
  --data-urlencode 'context.ip_address=192.0.2.139' \
  --data-urlencode 'context.transaction_id=docs-order-1' \
  --data-urlencode 'context.product_type=futures' \
  --data-urlencode 'context.amount=0.12345678901234567890123456789' \
  --data-urlencode 'context.currency=BTC' \
  --data-urlencode 'context.fee_amount=-0.000000000000000001' \
  --data-urlencode 'context.fee_currency=USDT'
```

For a zero-fee trade, use a new event/transaction ID and `context.fee_amount=0`. For a deposit, use the enabled product `deposit` contract and its required fields; do not reuse trade-only fields. In an approved controlled live test, omit both mode flags and use a new source event ID. Keep the original timestamp and IDs when retrying that event.

For the approved controlled live step, use the agreed origin and a new event ID, with neither mode flag:

```bash
curl --get "$MMP_URL/v2/pb/$CONNECTION_ID/events" \
  --data-urlencode "k=$POSTBACK_KEY" \
  --data-urlencode 'event=register' --data-urlencode 'event_id=docs-live-register-1' \
  --data-urlencode "timestamp=$TS_MS" \
  --data-urlencode 'identity.client_user_id=docs-player' \
  --data-urlencode 'context.ip_address=192.0.2.139'
```

Illustrative valid dryrun verdict for the first sample (request ID, catalog version and timestamp vary):

```json
{
  "status": "validated",
  "code": "VALIDATED",
  "mode": "dryrun",
  "stored": false,
  "publishOutcome": "not_attempted",
  "requestId": "synthetic-request-example",
  "catalogVersion": 42,
  "envelope": {
    "event": "register",
    "event_id": "docs-register-1",
    "timestamp": 1794801600000,
    "identity": {
      "client_user_id": "测试 + & 用户"
    },
    "context": {
      "ip_address": "192.0.2.139",
      "device_brand": "Apple",
      "device_model": "iPhone15,3",
      "platform": "ios",
      "os": "iOS",
      "privacy": {
        "marketing_consent": false
      }
    }
  },
  "violations": []
}
```

### Source IDs and delivery boundary {#v2-deduplication}

The business key is `<connectionId>:<source-key>`. Source-key precedence is `event_id`, then `context.transaction_id`, then `h:` plus SHA-256 of sorted, decoded, JSON-framed raw business parameters. `k`, mode flags, request ID, protocol and catalog version do not enter that hash. Changing a business value or timestamp can change the fallback key.

Source `event_id` values should be unique across event types within the Connection, not just within one event name. Dryrun requests share the authenticated rate limit.

This key is evidence for downstream deduplication; creating a key and receiving Kafka ACK do not themselves remove duplicates. Cross-v1/v2 double sending is not guaranteed to deduplicate. Agree a cutover boundary and reconcile with preserved source business IDs. Continue with [validation](/en/tracking/postback/validation#v2-validation) and [handoff](/en/tracking/postback/handoff#v2-handoff).

## v1 compatibility reference {#v1-compatibility}

Everything below applies to the five v1 paths. Keep using those paths for an existing v1 integration; changing only query names or adding `event` does not turn it into v2. The original section anchors remain available.

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

Send the matching key in `k`. Connection IDs use their active/retiring keys, enable/disable state and rotation grace period described [above](#v2-authentication); v1 Connections may link multiple products. Parameter aliases configured on a Connection are applied before v1 parsing; the alias wins over the canonical name on conflict, while raw input is retained. `k`, `dryrun` and `testmode` cannot be remapped.

Legacy partner credentials remain separately configured by RevoSurge and may have an egress IP allowlist. The Connection path does not inherit that legacy allowlist. Bad keys, expired keys, disabled Connections or disallowed legacy IPs return `403`. Authenticated rate limiting returns `429` with `Retry-After`.

Keep the key in server-side configuration and redact it when sharing URLs. `k` is excluded from stored business input and redacted in request audit.

### Endpoints

RevoSurge uses **local postbacks**: one URL per event type. The **path decides the event type** — the `event` macro is recorded for cross-checking but is never used to classify the conversion, so a change to what your template expands to cannot silently reclassify our conversions.

<HttpMethod method="GET" path="/v1/pb/{partner}/registration" />

<HttpMethod method="GET" path="/v1/pb/{partner}/first-deposit" />

<HttpMethod method="GET" path="/v1/pb/{partner}/repeat-deposit" />

<HttpMethod method="GET" path="/v1/pb/{partner}/revenue" />

<HttpMethod method="GET" path="/v1/pb/{partner}/app-launch" />

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

These are **v1 live** responses. With the business destination enabled and the default synchronous confirmation active, `200 ok` follows broker ACK. Historical asynchronous compatibility or a deliberately disabled destination can also return `200 ok` without confirmed business publication. Check the actual configuration and delivery evidence during handoff; a bare `200` is insufficient.

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

Append `dryrun=1` to a v1 URL for a parse/admission verdict without business publication. An authenticated, rate-admitted probe returns `200` and `X-Ingest-Mode: dryrun`; bad authentication remains `403` and limits remain `429`. `dryrun` and `dryrun=true` enable it; `0`, `false` and `no` disable it. Dryrun wins over `testmode`. Remove both flags before the agreed live cutover.

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
