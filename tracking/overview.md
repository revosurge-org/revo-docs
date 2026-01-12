# Tracking overview

**For:** Developers, Tracking/BI engineers, UA managers (technical)

Tracking connects advertising delivery to measurable outcomes. In RevoSurge, there are two main ways to send events:
- **Web tracker (browser-side)**
- **Server-to-Server (S2S) events (backend-side)**

## In this article
- What tracking is used for
- Web tracker vs S2S (when to use which)
- Event basics
- Where tracking shows up in the product

## What tracking is used for
Tracking enables:
- Conversion measurement (e.g., Register, Deposit)
- Attribution (tying outcomes to campaigns)
- Optimization toward target events (where enabled)
- Audience building (segments) based on behavior and outcomes

## Web tracker vs S2S (when to use which)
**Web tracker** is best when:
- You can instrument the website
- You want immediate onsite signals (page views, form submits, etc.)

**S2S events** are best when:
- Conversions happen on backend (deposits, orders, account state changes)
- You need reliable revenue and transaction data
- You want to avoid client-side blockers

> Many advertisers use **both**: Web tracker for onsite behavior + S2S for revenue-grade events.

## Event basics (shared)
An **Event** is a named action that can be measured and potentially optimized.  
Common examples:
- Register
- First Time Deposit (FTD)
- Deposit (repeated)

## Where tracking shows up
Depending on your current rollout, tracking-related views may include:
- Product tracker status / readiness
- Event list and event status
- API endpoints and authentication (for S2S)
