---
title: "Partner Postback overview"
description: "Compare Partner Postback v2 and v1 and choose the version your affiliate platform supports."
---

<a id="revosurge-partner-postback-api"></a>

# Partner Postback overview

Partner Postback lets your affiliate platform or back office report business events to RevoSurge through server-side HTTP GET callbacks. Use it when that system records the actions and can provide their required source fields.

## Choose a version {#choose-version}

|                      | Postback v2 (recommended)                                                                                                              | Postback v1                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Best fit             | Platforms that can send canonical event names, dotted field names and all fields required by the Product catalog                       | Platforms that support the five predefined event URLs and flat query parameters                    |
| Event selection      | One `/v2/pb/{connectionId}/events` path; `event` selects an enabled canonical event                                                    | URL path selects registration, first deposit, repeat deposit, revenue or app launch                |
| Event coverage       | Product event catalog shared with S2S v3, including enabled industry events                                                            | The five v1 routes and their defined business meanings                                             |
| URL template         | `/v2/pb/{connectionId}/events`; active Connection bound to exactly one Product                                                         | `/v1/pb/{partner}/{event-path}`; `{partner}` can be a Connection ID or an issued legacy identifier |
| Authentication       | Matching Connection key in `k`                                                                                                         | Matching key in `k`                                                                                |
| Field names          | Canonical names such as `identity.client_user_id`, `identity.click_id`, `timestamp`, `context.transaction_id`; v1 aliases do not apply | Flat names such as `user_id`, `click_id`, `ts`, `txid`; configured Connection aliases apply        |
| User identity        | `identity.client_user_id` or `identity.anonymous_id`, plus event-specific requirements; click ID alone is insufficient                 | Usable `click_id` or `user_id`; a click-based fallback exists                                      |
| Occurrence time      | `timestamp` must be actual UTC integer milliseconds; seconds and ISO strings are rejected                                              | `ts` in milliseconds; tolerant parsing can correct seconds and flag deviations                     |
| Amounts and currency | Original amounts/currencies in catalog fields; no automatic USD conversion                                                             | v1 source-value and optional conversion-enrichment rules                                           |
| Invalid input        | Strict parsing/catalog failures return `400` or `422` with the applicable verdict                                                      | Some admission failures return `200 ignored`; inspect the body                                     |
| Dry-run verdict      | `status=validated` or the rejection verdict; no business publication                                                                   | `decision=accepted` or `dropped`; no business publication                                          |
| Setup URLs           | Assemble the v2 path with the confirmed origin, Connection ID and key                                                                  | Current portal generator returns v1 URLs                                                           |
| Reference            | [v2 API](/en/tracking/postback/v2-api)                                                                                                          | [v1 API](/en/tracking/postback/v1-api)                                                                                |

### Check what your platform supports

**We recommend v2** if your platform can supply canonical dotted parameter names, stable user/anonymous identity, actual occurrence time and every required field for your intended Product events.

**Use v1** when its predefined event routes cover your use case and your platform supplies the corresponding flat macros or supported aliases.

An existing v1 integration may keep using v1. Before choosing, confirm with your platform or technical owner:

1. Which business actions and macro values it can provide.
2. Whether URL query names can include dotted paths, with correct URL encoding.
3. Whether it can send the required identity, occurrence time and business fields.
4. Which version and Product configuration are available for the intended environment.

## Follow the guide

1. [Set up and test the chosen version](/en/tracking/postback/setup-postback).
2. Use the matching [v2 API](/en/tracking/postback/v2-api) or [v1 API](/en/tracking/postback/v1-api).
3. [Validate the integration](/en/tracking/postback/validation) before launch.
