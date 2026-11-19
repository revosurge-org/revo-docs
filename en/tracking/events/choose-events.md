---
title: "Choose your events"
description: "Choose the business events to measure with Server Events v3 or Partner Postback v2."
---

# Choose your events

**For:** Advertisers, media buyers and the team configuring conversion tracking.

Start with the business actions you want to measure. S2S v3 and Partner Postback v2 can send events from the same Product catalog; choose the method your source system can support with the required data.

## 1. Start with your campaign goal

| Need | Start with | What the source must know |
| --- | --- | --- |
| New accounts | `register` | Successful signup and stable player identity |
| Deposits and first-deposit measurement | `deposit` | Every confirmed successful deposit, transaction ID, amount and currency |
| Settled gaming activity | `bet` | Settled stake, result and the required gaming fields |
| Bonus credited | `bonus_claimed` | Actual credited bonus instance, value and applicable terms |
| Withdrawal rejected | `withdraw_rejected` | Formally rejected request, request ID, amount and reason; not a pending review |
| Crypto trading | `trade` | Filled order and the separately defined trade and fee values |

Send every successful deposit, including repeats, as `deposit`; do not invent a separate first-deposit event. Catalog acceptance does not establish that an event is a supported bidding target. Review Campaign conversion events and the chosen bidding strategy separately.

## 2. Check the Product category and contract

Read [event availability](/en/tracking/events/catalog-validation), then open the matching [Standard](/en/tracking/events/events-standard), [iGaming](/en/tracking/events/events-igaming) or [Crypto](/en/tracking/events/events-crypto) definition. The same name, such as `deposit`, can have industry-specific requirements. Use the effective definition for the intended Product.

## 3. Confirm who supplies every field

For each required field, name the business source and its owner. Confirm stable player identity, original RevoSurge click ID, occurrence time, transaction ID and applicable amounts/currencies. If a platform macro is missing, resolve the source-data gap; a different transport does not manufacture the value.

## 4. Configure the method and test

Use [S2S setup](/en/tracking/s2s/setup-s2s) for your own backend or [Partner Postback setup](/en/tracking/postback/setup-postback) for platform callbacks. Validate first, inspect stored test events, then complete the agreed live business journey. Accepted delivery, attribution and campaign conversion verification are separate checks.

Web Tracker and AppsFlyer use their own SDK methods or mappings. Do not paste canonical API field names directly into those interfaces without following their guides.
