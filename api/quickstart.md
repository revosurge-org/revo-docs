---
title: RevoSurge API quickstart
sidebar_label: API quickstart
---

# RevoSurge API quickstart

**Audience:** Engineers, technical integrators, BI teams

## What you can do with the APIs
RevoSurge APIs enable automation for:

### Account & product
- Fetch account details and status
- List products and check readiness (tracker installed, events live)

### Campaigns
- Create/update campaigns (similar fields as guided setup)
- Adjust budgets and bids within limits
- Pause/resume/query campaign status

### Reporting
- Pull aggregated metrics (imps, clicks, spend, registrations, target events, ROAS, etc.)
- Filter by date range, campaign, product, geo, channel/source

### Audience
- List segments
- Create segments (rule definitions)
- Attach segments to campaigns
- Get estimated sizes and basic stats

> Exact endpoints depend on the current API release.

## Authentication
APIs are protected by secure authentication (e.g., API key or OAuth).
- Keep credentials secret (never commit to git)
- Store in env vars / secrets manager
- Rotate keys regularly

## Example integration flow
1. Pull daily performance data into your warehouse
2. Join with internal CRM / game data
3. Build audiences (high-value, churn-risk, etc.)
4. Push audiences back as segments
5. Launch campaigns targeting those segments
