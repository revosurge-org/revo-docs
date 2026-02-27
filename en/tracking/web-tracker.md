---
title: Web Tracker
description: Tracking layer connecting AdWave to on-site outcomes. Attribution, click IDs, UTM, events.
---

# Tracking overview

RevoSurge Tracking is the data collection and attribution layer that connects:

- **AdWave delivery** (impressions / clicks / spend)
- **Your on-site outcomes** (registrations, deposits, first-time deposits, etc.)
- **DataPulse reporting** (performance and ROI, when enabled)

This section explains:
- Why tracking is required
- How attribution works at a high level (click IDs / UTM)
- How events are linked across systems (Web Tracker + S2S)

## Why tracking matters

Tracking enables RevoSurge to:
- Attribute conversions back to campaigns, ad groups, creatives, and sources
- Optimize bidding toward business outcomes (e.g., Register / Deposit / FTD)
- Produce consistent reporting across AdWave and DataPulse

Without tracking, you can still buy traffic, but you **cannot** reliably measure or optimize toward outcomes.

## Attribution basics (click IDs & UTM)

RevoSurge associates user sessions and conversions using identifiers captured at the time of the visit.

Common identifiers:
- **click_id** (e.g., `gclid`, `fbclid`, or a platform click id)
- **UTM parameters** (e.g., `utm_source`, `utm_campaign`, etc.)

For AdWave-delivered traffic, required parameters are captured automatically.
For non-AdWave traffic, you may need to ensure tracking parameters are present in destination URLs.

## How events are linked

RevoSurge supports two complementary event sources:

### 1) Web Tracker (client-side)
Best for web products where you can add a script to the website and fire events in the browser.
- Captures sessions and web context (URL, referrer, etc.)
- Can automatically extract click_id / UTM from landing page URLs

### 2) Server-to-Server (S2S)
Best for backend-confirmed events (e.g., payment confirmed, deposit settled), or when client-side tracking is limited.
- You send events directly from your server to RevoSurge
- Supports financial values and (when available) crypto-to-fiat conversion logic

> Recommendation: Use Web Tracker for session attribution + S2S for "source of truth" financial events when possible.

## What you will set up

- A **Product** in RevoSurge (the container for tracking + campaigns)
- A **Tracking method** (Web Tracker and/or S2S)
- A set of **standard events** (e.g., Register, Deposit, FirstTimeDeposit)
