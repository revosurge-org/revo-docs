---
title: Server-to-Server (S2S) overview
description: Send conversion events from your backend to RevoSurge. When to use S2S vs Web Tracker, requirements, and authentication.
---

# Server-to-Server (S2S) overview

Server-to-Server (S2S) tracking lets you send conversion events directly from your backend to RevoSurge.

Use S2S when:
- You want backend-confirmed events (payments settled, deposits finalized)
- Client-side tracking is unreliable (ad blockers, browser limitations)
- You need to include secure transactional fields (amount, currency, transaction_id)

## S2S vs Web Tracker

### Web Tracker is best for
- Capturing sessions and web context (URL, referrer)
- Extracting click_id / UTM on landing
- Fast implementation for websites

### S2S is best for
- Confirmed conversions and financial outcomes
- Higher data integrity for revenue-related events
- Environments where client-side scripts are restricted

> Many advertisers use both: Web Tracker for attribution context, S2S for "source of truth" conversion events.

## What S2S requires
- A server integration that can call RevoSurge endpoints
- Authentication (API key/token depending on your environment)
- A consistent user identifier strategy (e.g., user_id)
