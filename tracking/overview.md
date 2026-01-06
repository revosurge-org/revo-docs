---
title: Tracking overview
sidebar_label: Overview
---

# Tracking overview

Tracking is the data collection layer of RevoSurge. It powers:
- **DataPulse analytics** (first-party event visibility)
- **AdWave optimization** (bidding/optimization toward real outcomes such as Register / FTD)

## Key concepts
### Tracker
A tracker (Web / SDK / pixel) collects user events from your website/app and sends them to RevoSurge.

### Tracking codes (UTM)
UTM parameters are added to ad links (especially for non-AdWave traffic) so visits can be attributed to campaigns/ad groups/ads.

### Pixels
Pixels are lightweight tracking mechanisms (e.g., 1×1 image or JS) that can record ad impressions and engagement depending on format and integration.

## What “Ready” means for a Product
A Product is typically considered **Ready** when:
- The tracker is installed and actively sending data
- At least one key event is validated as **Live**

Only Ready Products can be selected in AdWave guided campaign setup.
