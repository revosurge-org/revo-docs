---
title: RevoSurge Overview
sidebar_label: Overview
description: RevoSurge platform — AdWave, DataPulse, account, wallet, advertiser workflow.
---

# Welcome to RevoSurge

**For:** Advertisers, Growth teams, UA managers, Operations, Finance, Developers

RevoSurge helps advertisers run programmatic acquisition with **AdWave (DSP)** and understand outcomes with **DataPulse (Analytics)** — all under **one account**, **one wallet**, and **one set of products**.

This guide covers:
- How your RevoSurge account is structured  
- How to fund and manage access  
- How to launch campaigns in AdWave (guided setup)  
- What metrics to monitor during a pilot  
- API quickstart (high-level, non-technical)  

## In this article
- What RevoSurge includes
- Key concepts (Account / Wallet / Product)
- Typical workflow
- Where to go next

## What RevoSurge includes
- **AdWave (DSP):** Create and run campaigns across multiple SSPs via RTB.  
- **DataPulse (Analytics & data setup):** Configure each Product's technical integration — Web Tracker, Server-to-Server (S2S) events, and API keys — through a guided **Setup Wizard**, and view downstream outcomes and reporting. It's the **same account** as AdWave — open it at [datapulse.revosurge.com](https://datapulse.revosurge.com), or click **Open DataPulse** (top-right) in the AdWave dashboard.  
- **Tracking:** Web tracker and Server-to-Server (S2S) events to connect ad exposure to onsite/onsystem outcomes.  

## Key concepts
- **Account:** Your company container in RevoSurge (users, billing, products, campaigns).  
- **Wallet:** Shared balance used by AdWave and (when enabled) DataPulse-related services.  
- **Product:** A website/app destination you promote. Campaigns run against a selected product.  
- **Event:** A tracked action you want to optimize/measure (e.g., Register, Deposit).  
- **Active / Inactive (Product):** A Product turns **Active** only after its Web Tracker receives its first event; only Active Products can run campaigns.  
- **Tracker ID:** The ID DataPulse assigns to a Product; it links the tracker on your site to that Product.  
- **Web Tracker:** A first-party JavaScript snippet on your site that sends events (needs a code change).  
- **S2S (Server-to-Server):** Sending events from your backend via API — the "source of truth" for financial events (needs engineering).  
- **MMP (AppsFlyer):** A mobile measurement partner for App installs and in-app events.  
- **FTD (First-Time Deposit):** A user's first deposit — a common optimization event.  
- **CPM / oCPM:** Bidding by cost per 1,000 impressions (CPM), or optimized toward a target cost per event (oCPM).  
- **Deposit FX:** The exchange-rate setting on a Product, used to normalize deposit amounts.  
- **click_id / UTM:** Identifiers captured from the landing URL that tie a conversion back to its campaign.  

## Typical workflow
1) Create/activate an account at [adwave.revosurge.com](https://adwave.revosurge.com) and add teammates  
2) Create a product (site/app)  
3) Set up tracking in [DataPulse](https://datapulse.revosurge.com) — Web tracker / S2S events  
4) Create a campaign in AdWave (guided setup)  
5) Monitor pilot performance & traffic quality  
6) Scale budgets, refine targeting, and apply kill rules where needed  

## Where to go next
- If you're new: start in [**Growth → Getting started**](/en/growth/getting-started)
- If you're integrating tracking: go to [**Tracking → Overview**](/en/tracking/overview)
- If you're launching ads: go to [**AdWave → Campaign setup**](/en/adwave/campaign-setup)
- If you need audience targeting: go to [**Audience**](/en/audience/segments)
- If you're building integrations: go to [**API → API quickstart**](/en/api/quickstart)
