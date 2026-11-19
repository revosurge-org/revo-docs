---
title: "Event availability & validation"
description: "Check event availability, Product market categories and validation rules for the shared event catalog."
---

# Event availability & validation

**For:** Advertisers, integration developers and platform administrators.

S2S v3 and Partner Postback v2 use the Product's effective event catalog: event names, field paths, types, required levels and allowed values. Their transport versions do not require you to choose a catalog version or preset in a request.

## Why typed?

Registered names and typed fields keep business events consistent across S2S v3 and Postback v2. Each transport first parses its request format, then validates the event against the Product contract. Follow its API for exact errors and publication behavior.

<a id="standard-and-industry-presets"></a>

## Standard and industry events

| Event collection | Availability | Reference |
| --- | --- | --- |
| Standard | Enabled for every Product | [Standard events](/en/tracking/events/events-standard) |
| iGaming | Enabled by the Product's iGaming market category | [iGaming events](/en/tracking/events/events-igaming) |
| Crypto | Enabled by the Product's Crypto market category; the inspected portal label is Crypto & Trading | [Crypto events](/en/tracking/events/events-crypto) |
| Custom | Confirm Product-specific availability and the registered field contract with your Account Manager | See Custom events below |

Check your Product's category and actual available events. A listed event is not evidence that every Product has the same contract or that all downstream reporting/optimization features consume it. You do not manually select an industry preset or catalog version in the event request.

## Field requirement levels

| Level | Meaning |
| --- | --- |
| Required | Must be supplied and satisfy its type and constraints |
| Suggested | Recommended for quality/attribution; when supplied it must satisfy its rules |
| Optional | May be omitted; supplied values must still satisfy applicable rules |

Conditional requirements are described in the event table. Do not invent missing business values to pass validation.

## What gets validated

Check the exact event name, usable identity, occurrence time, required event fields and field types/enums. [Common fields](/en/tracking/events/common-fields) describe the shared base rules. The method then applies its own request encoding and parsing rules.

| Concern | Where to check |
| --- | --- |
| What the event means and which fields it needs | The event's shared definition |
| Product event availability | Product category and effective event catalog |
| S2S JSON, batch handling, response codes and dryrun/test headers | [S2S API reference](/en/tracking/s2s/v3/server-events-api) |
| Postback dotted paths, URL encoding, response verdicts and query mode flags | [Postback v2 reference](/en/tracking/postback/v2-api#v2-api) |
| Full real-system test and launch checks | Your integration method's setup guide |

**Shared fields do not imply identical parsing or HTTP responses.** S2S and Postback differ in unknown-field handling and validation status codes. A dry-run success checks a request; it is not stored traffic or a verified campaign conversion.

## Catalog updates

Both canonical methods consume the Product catalog. Event definitions or availability can change when that catalog changes. Confirm the effective contract during testing rather than assuming a fixed event count or a historical page guarantees current availability. Persistent catalog conflicts/unavailability require RevoSurge investigation; use the method's documented failure and retry behavior.

## Custom events

Contact your Account Manager with the business action, trigger, source fields, types and required levels. Only send a custom event after its Product-specific definition and supported field paths are confirmed. S2S's open context map is not a guarantee that Postback accepts arbitrary query paths.

**Next:** [Choose your events](/en/tracking/events/choose-events), then return to [S2S setup](/en/tracking/s2s/setup-s2s) or [Postback setup](/en/tracking/postback/setup-postback).

<a id="event-catalog-validation"></a>
