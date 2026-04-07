---
title: Supply Integration Overview
description: Overview of RevoSurge RTB demand — supported formats, geo, and how SSP integration works.
---

# Supply Integration Overview

**Audience:** SSP engineers and partnership teams looking to connect RevoSurge as a DSP buyer.

RevoSurge is a Demand-Side Platform (DSP) that bids on ad inventory via Real-Time Bidding (RTB). SSPs can connect RevoSurge as a buyer by pointing their OpenRTB traffic to our bid endpoint.

## What we buy

| Dimension | Details |
|---|---|
| **Protocol** | OpenRTB 2.5 |
| **Ad formats** | Banner, Native, Popunder |
| **Auction type** | First-price (`at: 1`) |
| **Currency** | USD |
| **Geographic focus** | Global — Asia, US, EU regions active |

## How it works

1. Your SSP sends an OpenRTB 2.5 bid request to our endpoint via HTTP POST
2. RevoSurge evaluates the request against active campaigns (targeting, budget, bid floor)
3. We return a bid response with price, ad markup, and notification URLs — or HTTP 204 if we don't bid
4. Your SSP runs the auction; if we win, it fires our win notification URL
5. On impression, it fires our billing URL

## Endpoint

```
POST http://rtb.revosurge.com/api/v1/openrtb2/{sspId}/bid
```

Your `sspId` is assigned during onboarding. See [Getting Started](/en/supply/getting-started) for details.

## Regions

Our endpoint uses dynamic DNS and automatically resolves to our nearest server across Asia, US, and EU regions — no regional configuration needed on your side.

## Next steps

- [Getting Started](/en/supply/getting-started) — onboarding steps and test checklist
- [Bid Endpoint Reference](/en/supply/bid-endpoint) — full request/response field spec
- [Notifications](/en/supply/notifications) — win, billing, and loss notification handling
