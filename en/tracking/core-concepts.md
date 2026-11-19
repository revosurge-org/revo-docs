---
title: "Core concepts"
description: "Understand stable user IDs, click attribution, overlapping tracking sources and conversion verification."
---

# Core concepts

**For:** Media buyers, marketing managers and developers.

Whichever of the four methods you use, the same four rules decide what happens to the events
you send. Get these right and the method you pick is an implementation detail.

**In this article**
- [1. One user, one ID](#_1-one-user-one-id)
- [2. How a conversion joins back to an ad](#_2-how-a-conversion-joins-back-to-an-ad)
- [3. The attribution window](#_3-the-attribution-window)
- [4. Repeat delivery and overlapping sources](#_4-repeat-delivery-and-overlapping-sources)
- [The contract, in one place](#the-contract-in-one-place)

---

## 1. One user, one ID

**The same person must carry the same identifier in every method you use.**

| Method           | Field                     | Who sets it                   |
| ---------------- | ------------------------- | ----------------------------- |
| Web Tracker      | `user_id`                 | You, on login or registration |
| S2S              | `identity.client_user_id` | You, on every event           |
| AppsFlyer        | Customer User ID          | You, in the SDK               |
| Partner Postback v2 | `identity.client_user_id` | Your affiliate platform |
| Partner Postback v1 | `user_id` (legacy contract) | Your affiliate platform |

Same string. Same casing. No prefix on one and not the others. `player_88213` and `88213` are
two different people as far as we are concerned.

### Why this is the most expensive rule on the page

When the IDs disagree, nothing fails. Every request returns success, every event is stored,
and the reporting is simply wrong:

- The browser knows a click happened. Your backend knows a deposit happened. Nothing connects
  them, so the deposit is not credited to the campaign that produced it.
- The same player exists as two profiles, so one registration can be counted twice.
- Player-value models train on split histories, which makes them worse at exactly the job you
  bought them for.

**Fixing this later does not repair the past**
Correcting the IDs stops new events from splitting. It does not merge profiles that were
already created apart, and it does not re-attribute deposits that already landed unjoined.
Check it before you launch, not after the numbers look odd.

### Before the user has an account

Send `identity.anonymous_id` instead — a stable pseudonymous ID of your own, usually a
first-party cookie or device ID. Identity must carry at least one of `client_user_id` or
`anonymous_id`.

Once the player registers, start sending `client_user_id`. Keep sending `anonymous_id`
alongside it where you have it.

---

## 2. How a conversion joins back to an ad

A conversion is only useful if we can tell which ad produced it. That join has one strong key.

### `click_id` is the strong key

When a visitor arrives from a RevoSurge ad, the landing URL carries a click identifier. If you
have used `fbclid` or `gclid`, it is the same idea.

**What to do with it:**

1. Read it from the landing URL
2. Store it against the visitor's session, and against their account once they register
3. Send it back as `identity.click_id` on the first event that identifies the user — normally
   `register`

The Web Tracker captures the click for you. **S2S does not** — your backend only knows what
you pass it, so the click ID has to survive the trip from landing page to database to event.
That hand-off is where most integrations lose it.

**`click_id` does not replace the user ID**
It anchors the conversion to an ad. `client_user_id` anchors it to a person. You need both —
sending `click_id` alone does not satisfy the identity requirement.

<a id="when-there-is-no-click-id"></a>
<a id="you-do-not-need-click-id-on-every-event"></a>

### When the click ID is missing

Preserve the original RevoSurge click ID where your integration supports it. Partner Postback v1 documents a source-specific fallback through [delivery context](/en/tracking/postback/v1-api#parameters). Follow the identity requirements for your source and check campaign attribution separately from event receipt.

### Keep player IDs consistent

Use the same player ID on registration and later events such as deposits. Verify that the events are linked to the intended campaign using your source’s test procedure.

<a id="when-a-user-both-clicked-and-saw-an-ad"></a>
<a id="conversions-that-arrive-late"></a>

## 3. The attribution window

AdWave uses **last-touch attribution with a 14-day window**. A conversion is credited to the most recent eligible ad interaction in the 14 days before the conversion. Eligible interactions depend on the source and campaign configuration. Check event receipt and campaign credit separately.

<a id="_4-deduplication"></a>
<a id="what-this-means-in-practice"></a>
<a id="when-two-methods-report-the-same-conversion"></a>

## 4. Repeat delivery and overlapping sources

Keep source event IDs and business transaction IDs stable on retries. A receiver accepting a request is not proof that repeated messages will collapse into one reporting row.

| Method | What to preserve | Where to check retry behavior |
| --- | --- | --- |
| S2S v3 | Original event time, identity and transaction ID where applicable | [S2S API response and retry rules](/en/tracking/s2s/v3/server-events-api) |
| Partner Postback v2 | `event_id`, original `context.transaction_id` and occurrence time | [Postback response rules](/en/tracking/postback/v2-api#v2-responses) and [source IDs](/en/tracking/postback/v2-api#v2-deduplication) |
| Partner Postback v1 | Existing v1 source IDs and request contract | [v1 API](/en/tracking/postback/v1-api) |
| Web Tracker / AppsFlyer | Source-specific identifiers | The relevant SDK/integration guide |

For Postback v2, source-key selection is `event_id`, then `context.transaction_id`, then a hash of the sorted decoded raw fields. This is provenance for downstream processing, not a guarantee of receiver deduplication. Publication timeouts can have an unknown outcome; follow the method's recovery procedure before replaying.

Choose one authoritative source per business action. Use one agreed source/version per business action and reconcile counts. Do not assume cross-method or v1/v2 overlap automatically deduplicates. Sharing an event catalog also does not establish an optimization priority or reporting precedence between methods.

---

<a id="if-you-already-have-players-read-this-before-you-launch"></a>

## 5. First deposits

If you already have players, agree how historical deposits will be accounted for with your Account Manager. Without that context, an existing player’s next deposit may look like a first deposit. Follow the setup guide for your tracking source when validating first-time deposit (FTD) reporting.

## The contract, in one place

Everything above, as a checklist:

- [ ] The same person carries the same identifier in every method
- [ ] Every event has a registered `event` name and a valid millisecond `timestamp`
- [ ] Every event carries `client_user_id`, or `anonymous_id` before registration
- [ ] `click_id` is captured on landing and sent back on `register` and the first `deposit`
- [ ] Money events carry their original `context.transaction_id`; retries follow the source API contract
- [ ] Partner Postback events carry a stable `event_id`, repeated verbatim on retries
- [ ] Events are sent when they happen — including late ones
- [ ] Historical deposits are backfilled before launch, if the Product has existing players
- [ ] One system is the source of truth per event

---

## Next steps

1. Open [Tracking overview](/en/tracking/overview) to choose the sources for your Product and review **Campaign conversion events** before choosing your campaign goal.
2. Follow the setup guide for each source. Each includes testing and troubleshooting:

| Source | Setup and testing | Technical reference |
| --- | --- | --- |
| Web Tracker | [Install and test](/en/tracking/web-tracker/install) | [SDK reference](/en/tracking/web-tracker/reference) |
| AppsFlyer | [Set up and verify](/en/mmp/appsflyer/setup-appsflyer) | [Parameters & reporting](/en/mmp/appsflyer/parameters-reporting) |
| Partner Postback | [Set up and test](/en/tracking/postback/setup-postback) | [API v2](/en/tracking/postback/v2-api) |
| S2S Server Events | [Set up and test](/en/tracking/s2s/setup-s2s) | [API reference](/en/tracking/s2s/v3/server-events-api) |

3. Follow the source-specific launch checks and confirm your bidding strategy supports the intended conversion. For AppsFlyer, complete pre-launch configuration checks with your AM and verify the full path after launch using real campaign activity; do not treat saved settings as verification. For other sources, complete the live conversion and attribution checks required by their guides before launch. Receipt acceptance alone does not confirm attribution.

For exact event names and fields, use the [Standard](/en/tracking/events/events-standard), [iGaming](/en/tracking/events/events-igaming) or [Crypto](/en/tracking/events/events-crypto) event reference.
