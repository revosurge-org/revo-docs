---
title: Web Tracker
description: First-party JavaScript SDK for web funnels — captures sessions, click IDs, and conversion events for AdWave and DataPulse.
---

# Web Tracker

The **Web Tracker** is RevoSurge's first-party JavaScript SDK. Add it to your landing page and
advertiser site to capture sessions and fire conversion events (register, deposit, FTD) as users
move through your web funnel. Once your key events read **Live**, they become optimization targets
for AdWave campaigns and power DataPulse reporting.

> **Not sure this is your method?** If you run a mobile App or have your own back-office, compare
> all four options first — see [**Tracking Overview**](/en/tracking/overview).

## When to use it
- Web-only funnels (landing page + site) — no App, no back-office API
- Or alongside [S2S](/en/tracking/s2s/overview) / [Partner Postback](/en/tracking/postback/partner-postback) to capture the **click-side** signal

## How it attributes
- Extracts **click_id** and **UTM** parameters from the landing URL
- Persists `click_id` in a first-party cookie (1-year expiry) — a user who lands, bounces, and
  returns days later still attributes
- For AdWave-delivered traffic these parameters are captured automatically; for non-AdWave traffic,
  make sure they're present in your destination URLs

## What you set up
1. A **Product** in DataPulse — the container for tracking + campaigns (see [Getting started](/en/growth/getting-started#_3-product-setup-high-level))
2. The tracker script + your key events — see **[Install](/en/tracking/web-tracker/install)**
3. Verify events read **Live**, then point campaigns at them

> The Web Tracker handles the client side. For backend-confirmed / financial events (payments
> settled, deposits finalized), use [S2S Server Events](/en/tracking/s2s/overview) — many advertisers
> use both: Web Tracker for attribution context, S2S as the source of truth for conversions.

## Next
- **[Install the Web Tracker](/en/tracking/web-tracker/install)** — add the script, send events, go Live
- **[Web Tracker SDK Reference](/en/tracking/web-tracker/reference)** — every method and field
