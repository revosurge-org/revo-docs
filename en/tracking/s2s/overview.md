---
title: Server-to-Server (S2S) overview
description: Send conversion events from backend. S2S vs Web Tracker, requirements, auth.
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

## Choosing an API version

The Server Events API has two versions. Both are supported.

| | v2 | v3 |
|---|----|----|
| Status | Stable | New <Badge type="tip" text="recommended for new integrations" /> |
| Endpoints | `/v2/s2s/event`, `/v2/s2s/batch` | `/v3/s2s/event`, `/v3/s2s/batch` |
| Payload | Flat object, free `event_name` | Envelope (`event`/`identity`/`context`) + typed catalog |
| `timestamp` | Unix seconds | Unix milliseconds |
| Docs | [Server Events API (v2)](/en/tracking/s2s/server-events-api) | [Server Events API (v3)](/en/tracking/s2s/v3/server-events-api) |

- **New integrations:** start with [v3](/en/tracking/s2s/v3/server-events-api).
- **Existing v2 integrations:** see [Migrating from v2](/en/tracking/s2s/v3/migration).
