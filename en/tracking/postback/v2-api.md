---
title: "Partner Postback API (v2)"
description: "Partner Postback v2 Connection setup, canonical query parameters, examples, validation and delivery outcomes."
---

# Partner Postback API (v2)

**For:** Affiliate-platform administrators and integration developers.

Choose the version your platform supports using [v1 vs v2](/en/tracking/postback/overview#choose-version). Use [Set up and test Partner Postback](/en/tracking/postback/setup-postback) for the portal and real-platform procedure. These are the released transport rules; use the shared event references for event meanings and required fields.

## v2 API {#v2-api}

<HttpMethod method="GET" path="/v2/pb/{connectionId}/events" />

`v2` is the transport version. The server selects the current effective product catalog; callers do not choose a preset or catalog version in the URL. Event and field definitions are shared with the [event catalog](/en/tracking/events/catalog-validation), [Standard](/en/tracking/events/events-standard), [iGaming](/en/tracking/events/events-igaming) and [Crypto](/en/tracking/events/events-crypto) references. Availability, required fields and enabled custom events depend on your actual product catalog. Use the Postback response rules below rather than the S2S HTTP error table.

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

Use the device that completed this registration; for a referral, use the **new user's** device. Preserve the original model identifier and omit unavailable values. See [registration device collection](/en/tracking/events/events-standard#registration-device) for the full rules. v2 omits blank values from the typed envelope, but `-` is not automatically removed from the brand, model or OS fields. Clean unavailable values at the source.

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

This key is evidence for downstream deduplication; creating a key and receiving Kafka ACK do not themselves remove duplicates. Cross-v1/v2 double sending is not guaranteed to deduplicate. Use one agreed version per business action and reconcile with preserved source business IDs. Continue with [validation](/en/tracking/postback/validation#v2-validation) and [before-launch checks](/en/tracking/postback/setup-postback#_5-before-launch-and-after-changes).
