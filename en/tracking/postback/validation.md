---
title: "Partner Postback validation"
description: "Validate Partner Postback v1 and v2 callbacks and check receipts and live campaign outcomes."
---

# Partner Postback validation

Check the version your platform calls. **v2 is recommended when supported.** Fix every required item before launch; record an owner and reason for any skipped recommendation.

Use this page as a checklist. Field definitions, parsing limits, response codes and retry behavior are in the [v2 API](/en/tracking/postback/v2-api) and [v1 API](/en/tracking/postback/v1-api).

## v2 validation {#v2-validation}

### Required checks

| ID | Confirm |
| --- | --- |
| `PB2-R-01` | Active Connection, valid key and exactly one intended Product |
| `PB2-R-02` | Enabled canonical event and authorized field paths; no v1 aliases |
| `PB2-R-03` | Real user/anonymous identity satisfying the event contract; click/event IDs alone are insufficient |
| `PB2-R-04` | Actual business occurrence time in integer UTC milliseconds, within the API’s allowed range |
| `PB2-R-05` | All required base/event fields satisfy their types, enums and formats |
| `PB2-R-06` | Expanded macros, unique query names, non-conflicting paths and once-only UTF-8 URL encoding |
| `PB2-R-07` | Amounts, currencies, fees and payouts match their source business meanings |
| `PB2-R-08` | Response-aware retry handling preserves original IDs/time; uncertain publication is reconciled |
| `PB2-R-09` | Server-side firing, protected key and correct dryrun/test/live mode |

### Recommended checks

| ID | Confirm |
| --- | --- |
| `PB2-O-01` | Stable unique `event_id` and real transaction ID where applicable; unchanged on retry |
| `PB2-O-02` | Original RevoSurge click ID, separate from the affiliate platform’s ID |
| `PB2-O-03` | Catalog/macro changes trigger re-validation; requests do not pin the catalog version |

### Required probes and evidence {#v2-probes}

Start with a complete valid source template. Change one condition per probe after authentication, Product binding and catalog readiness are confirmed.

| Probe | Pass condition |
| --- | --- |
| Valid `dryrun=1` | `validated`; correct typed values; no business publication |
| Missing user identity or required field; invalid type/enum/time | Rejected under the [v2 response rules](/en/tracking/postback/v2-api#v2-responses) |
| Literal macro, unknown/duplicate/conflicting path, invalid encoding | Rejected; the offending input is identified |
| Wrong key or non-single-Product binding | Rejected; fix configuration before continuing |
| Catalog-valid `false`, genuine zero, permitted negative fee and precise decimal | Values preserved; compare with decimal-aware tooling |
| Authorized strings containing `+`, `&`, `%` and Unicode | Exactly-once decoding preserves the original text |
| Valid `testmode=1` without dryrun | Confirmed publication and matching isolated business-message readback |

Keep the [setup guide’s evidence record](/en/tracking/postback/setup-postback#_4-test-the-complete-path), including `requestId` and `catalogVersion`. Confirm no business publication for dryrun/rejections. Audit alone is insufficient. Test publication failure/timeouts only in a controlled environment; follow the API’s catalog-outage and retry rules.

## v1 validation {#v1-validation}

### Four v1 dry-run probes

Send real expanded templates with `dryrun=1`; inspect the echo and `X-Ingest-Mode`. Dry runs publish no business event and count toward rate limits.

| Probe | Pass condition |
| --- | --- |
| Valid key and usable identity | `decision=accepted`; correct identity, millisecond time, signed amount and source event ID |
| Wrong key | `403` |
| Neither usable click ID nor user ID | `decision=dropped` |
| Literal macro in `click_id`, such as `{sub1}` | `decision=dropped` |

Remove both mode flags from live templates, including bare flags and `dryrun=true`. For full verdicts and retry handling, use [v1 responses](/en/tracking/postback/v1-api#responses) and [dry run](/en/tracking/postback/v1-api#dry-run).

<a id="next-steps"></a>
<a id="pb-o-01-—-no-ctx"></a>
<a id="pb-o-02-—-no-txid"></a>
<a id="pb-o-03-—-empty-taxonomy-fields"></a>
<a id="pb-o-04-—-no-country"></a>
<a id="pb-o-05-—-no-event-macro"></a>
<a id="pb-o-06-—-no-ftd-declaration"></a>
<a id="pb-o-07-—-no-attribution-share"></a>
<a id="pb-r-01-—-bad-or-missing-key"></a>
<a id="pb-r-02-—-wrong-endpoint-for-the-event"></a>
<a id="pb-r-03-—-no-usable-identity"></a>
<a id="pb-r-04-—-unsubstituted-macros"></a>
<a id="pb-r-05-—-first-and-repeat-deposits-on-the-same-path"></a>
<a id="pb-r-06-—-timestamp-in-seconds"></a>
<a id="pb-r-07-—-missing-or-wrongly-signed-amount"></a>
<a id="pb-r-08-—-no-stable-event_id"></a>
<a id="pb-r-09-—-wrong-retry-behaviour"></a>
<a id="pb-r-10-—-dry-run-left-on"></a>
<a id="pb-r-11-—-identifier-does-not-match-your-other-tracking"></a>
<a id="pb-r-12-—-postbacks-fired-from-the-browser"></a>
<a id="recommended-resolutions"></a>
<a id="required-resolutions"></a>
<a id="two-things-this-page-cannot-check"></a>

### Required rules

| ID | Confirm |
| --- | --- |
| `PB-R-01` | Correct key and authorized source; check any legacy IP allowlist |
| `PB-R-02` | Endpoint path matches the action; `event` does not override it. An app launch is not an install |
| `PB-R-03` | At least one usable `click_id` or `user_id`; inspect the body, not HTTP 200 alone |
| `PB-R-04` | Identity macros expand correctly; a literal click macro drops the event |
| `PB-R-05` | First/repeat deposits use their respective paths and pass the real-journey check |
| `PB-R-06` | Actual occurrence time in milliseconds; do not rely on automatic seconds correction |
| `PB-R-07` | Deposit/revenue amounts have the correct sign and source currency; reconcile any FX result separately |
| `PB-R-08` | Globally unique stable `event_id`, reused on retry; source keys do not guarantee deduplication |
| `PB-R-09` | Version-correct retry/confirmation handling; preserve original IDs and business values |
| `PB-R-10` | Dryrun/test flags removed from production templates |
| `PB-R-11` | Player ID matches Web Tracker/S2S exactly, including casing and prefixes |
| `PB-R-12` | Rules fire server-side; keys never appear in browser code |

### Recommended rules

| ID | Confirm |
| --- | --- |
| `PB-O-01` | Genuine `ctx` delivery context where available |
| `PB-O-02` | Real `txid` for reconciliation and source-key fallback |
| `PB-O-03` | Genuine link/account and traffic-source taxonomy; document unavailable fields |
| `PB-O-04` | Player country where available |
| `PB-O-05` | Source `event` macro for path cross-checking |
| `PB-O-06` | Known first-customer/first-deposit declarations; do not invent unknown values |
| `PB-O-07` | Attribution share where applicable; a declaration does not rescale amount |

For field mappings and special cases, use [v1 parameters](/en/tracking/postback/v1-api#parameters) and [value interpretation](/en/tracking/postback/v1-api#how-values-are-interpreted).

## Complete verification

Continue with the [real journey and evidence checks](/en/tracking/postback/setup-postback#_4-test-the-complete-path), then [launch and re-check requirements](/en/tracking/postback/setup-postback#_5-before-launch-and-after-changes). A valid request does not prove the platform fires its rule, that reporting totals reconcile or that attribution succeeded. Match source events and transactions rather than comparing totals alone.
