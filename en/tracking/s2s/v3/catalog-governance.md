---
title: Event catalog & validation (v3)
sidebar_label: Catalog & validation
description: How the typed event catalog works — registered events, field typing, Standard vs iGaming, and validation behavior.
---

# Event catalog & validation

**Audience:** Engineers, technical integrators

v3 is governed by a **typed event catalog**: events and their fields are pre-registered, and every incoming event is validated against the catalog before it is stored.

## Why typed?

In v2, `event_name` was a free string and events could carry arbitrary properties of any type — so `deposit`, `Deposit`, and `depo` all landed, and `amount` could arrive as the string `"50"`. v3 fixes this:

1. **Registered events** — only catalog events are accepted; unknown names are rejected.
2. **Typed fields** — each field has a fixed type (`String` / `Number` / `Boolean`) and, where relevant, an allowed-values list.
3. **Validate on ingest** — each event is checked against the catalog; only conforming events are stored.

This keeps downstream analytics, attribution, and AI features working on clean, trustworthy data.

## Standard vs iGaming

Events are organized into **presets**. Your product's effective catalog is the Standard preset plus any industry presets it is subscribed to.

| Preset | Scope | Availability | Categories |
|--------|-------|--------------|------------|
| **Standard** (`general.core`) | General | **Auto-enabled** for every product | User Lifecycle · Verification & Consent · App Lifecycle |
| **iGaming** (`igaming`) | Industry | **By subscription** — enabled for your product by the RevoSurge team | User Lifecycle · Verification & Consent · Financial · Gaming · Bonus Lifecycle |
| Legacy (`legacy`) | General | Compatibility (lenient) | `page_view`, `purchase`, `download_click` |

- **Standard** events ([browse](/en/tracking/s2s/v3/events-standard)) work for all advertisers out of the box.
- **iGaming** events ([browse](/en/tracking/s2s/v3/events-igaming)) require your product to be subscribed to the iGaming preset. If you send an iGaming event without the subscription, it is rejected as `EVENT_DISABLED` — contact your RevoSurge representative to enable it.

## Field requirement levels

Each field carries a requirement level:

| Level | Meaning |
|-------|---------|
| **Required** | Must be present and correctly typed, or the event is rejected. |
| **Suggested** | Strongly recommended for data quality / attribution; not enforced. |
| **Optional** | Nice to have. |

## What gets validated

Validation runs in two stages:

1. **Structural** — the envelope is well-formed: `event` and `timestamp` present, `timestamp` in valid UTC ms, `identity` has a stable ID, and any PII matches the SHA-256 format.
2. **Catalog** — the event is registered and enabled for your product, every required field is present and correctly typed, and enum fields use allowed values.

| Failure | Response |
|---------|----------|
| Bad envelope / type / PII format | `400 VALIDATION_ERROR` |
| Unknown event name | `422 UNKNOWN_EVENT_TYPE` |
| Event not enabled for your product | `422 EVENT_DISABLED` |

All field violations are collected and returned together in `violations[]` (no fail-fast), so you can fix everything in one pass. See the [API reference](/en/tracking/s2s/v3/server-events-api#errors) for the response shape.

> [!TIP]
> Use [test mode](/en/tracking/s2s/v3/server-events-api#test-mode) (`X-Test-Mode: true`) during integration to see exactly which fields fail validation, without storing anything.

## Catalog updates

The catalog is managed centrally by the RevoSurge team. When events or fields change, the update propagates to ingestion automatically (typically within a minute) — no redeploy on your side. If the catalog is briefly unavailable, ingestion degrades gracefully rather than dropping your traffic.

## Custom events

Beyond the built-in presets, the RevoSurge team can register **custom events** scoped to your product when you have a use case the standard catalog doesn't cover. Reach out with the event name, its fields, and their types.
