---
title: "Common fields & identity"
description: "Shared identity, timestamps, IP and other event field rules for S2S v3 and Partner Postback v2."
---

# Common fields & identity

**For:** Developers and technical integrators using S2S v3 or Partner Postback v2.

These are shared event meanings and requirements. Send nested JSON through S2S or canonical dotted query parameters through Postback v2. Web Tracker SDK methods, AppsFlyer mappings and Postback v1 retain their own interfaces.

## Base properties

| Canonical field | Meaning | Requirement |
| --- | --- | --- |
| `event` | Exact enabled event name | Required |
| `timestamp` | Actual business occurrence time in UTC integer milliseconds | Required |
| `identity.client_user_id` | Stable account/player ID | Supply this or `identity.anonymous_id`; an event can specifically require account identity |
| `identity.anonymous_id` | Stable anonymous identity before an account exists | Alternative where the event permits it |
| `identity.click_id` | Original RevoSurge click ID | Send when available and allowed; does not replace user identity |
| `context.ip_address` | End-user IPv4/IPv6 address | Required unless the event definition relaxes it |
| `context.user_agent` | End-user browser/device user agent | Suggested unless the event says otherwise |

## Identity

Use the same stable account ID across sources. Preserve a genuine anonymous ID where appropriate before signup. At least one user/anonymous identity is needed; a click ID alone is insufficient. Follow stronger event-level requirements: `bonus_claimed` and `withdraw_rejected` require account identity in the updated iGaming definitions.

An affiliate platform's click ID and the RevoSurge click ID are different identifiers. Return the original RevoSurge value in `identity.click_id`.

## Timestamp

Use actual occurrence time, not send or receipt time. The documented canonical contract uses UTC epoch integer milliseconds, at least `1000000000000` and no more than five minutes ahead. Preserve it on retry. Encoding and rejection responses are explained in each API reference.

## PII & hashing

Never send plaintext contact details where a hashed field is required. `context.privacy.email_hash` is SHA-256 of the lowercased, trimmed email; `context.privacy.phone_hash` is SHA-256 of the E.164-normalized phone. These hashes use lowercase hex, 64 characters. Event-specific hash paths and constraints remain defined in the event table.

## Downgrades

| Event(s) | Exception to the base fields |
| --- | --- |
| `app_install`, `app_open`, `app_uninstall` | `client_user_id` is suggested; use a real anonymous ID before account creation |
| `app_install` | `ip_address` is suggested |
| `bet` | `ip_address` is suggested where a game-server event lacks end-user IP |

This does not mean that `app_open` or `app_uninstall` can omit a required IP. Do not fabricate missing identities or IPs. For `withdraw_rejected`, use the original withdrawal-request IP rather than the server IP.

## Money and source IDs

Use the exact event fields and their units. A transaction ID, source event ID and request trace ID have different roles; keep original business IDs on retries. The transport response is not a promise of statistical deduplication. Follow the relevant method's retry rules.

Currency and amount roles are event-specific. Crypto events may carry an original asset and an independently denominated fee. The updated iGaming bonus/rejection definitions use fiat-valued ISO 4217 amounts. Ingestion conversion behavior is transport-specific; see the API reference instead of assuming that sharing the catalog makes conversion behavior identical.

<a id="envelope-structure"></a>
<a id="minimal-example"></a>

## Examples

The event collections below include paired **S2S JSON** and **Postback v2 query** encoding examples. Field definitions are shared; encoding and response handling are not.

- [Standard events](/en/tracking/events/events-standard)
- [iGaming events](/en/tracking/events/events-igaming)
- [Crypto events](/en/tracking/events/events-crypto)
- [S2S API](/en/tracking/s2s/v3/server-events-api#request-envelope)
- [Postback v2 API](/en/tracking/postback/v2-api#v2-parameters)

<a id="request-envelope-base-properties"></a>
