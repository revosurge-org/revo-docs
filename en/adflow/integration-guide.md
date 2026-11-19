---
title: Publisher Integration Guide
description: Compare six ways to monetize websites, Telegram Mini Apps, and native apps with RevoSurge.
---

# Publisher Integration Guide

Choose an integration based on where your ads will appear and how much control you need over bidding and rendering. For websites, AdFlow can manage Prebid.js bidding and rendering for you, or you can configure Prebid.js yourself. Telegram Mini Apps and native apps use SDKs designed for their environments.

## Integration methods

### [adflow.js Quick Integration](./adflow-sdk) {#adflow-sdk}

Add a script and iframe ad slots to a website. The SDK handles bidding and renders ads automatically. It supports Banner, Pop, Push, In-page Push, and Native.

### [adflow-tma.js (Telegram Mini App)](./adflow-tma-sdk) {#adflow-tma-sdk}

Use the AdFlow SDK adapted to Telegram WebApp. It reads platform and device signals from Telegram, skips cookie syncing, and opens external ad links through Telegram.

### [S2S Configuration](./s2s-integration) {#s2s-integration}

Configure Prebid.js yourself for finer control over ad formats, pricing, user sync, and first-party data. You can also pass bid results to Google Ad Manager (GAM).

### [Prebid Mobile SDK (In-App)](./prebid-mobile-sdk) {#prebid-mobile-sdk}

Use Prebid Mobile SDK in a native iOS or Android app. The SDK can render the winning ad directly or pass bids to Google Ad Manager.

### [Prebid.js + GAM](./gam-prebid) {#gam-prebid}

Pass RevoSurge S2S bids to GAM and configure creatives for five ad formats.

### [GAM + adflow.js](./gam-adflow-sdk) {#gam-adflow-sdk}

Serve adflow.js creatives through GAM across five web ad formats.

## Website Integration Modes Comparison

| Dimension | adflow.js Quick Integration | S2S Configuration |
| --- | --- | --- |
| **Complexity** | Minimal — just 2 lines of HTML | Moderate — requires JS coding |
| **Prebid.js Knowledge** | Not required | Required |
| **Ad Formats** | Banner / Pop / Push / In-page Push / Native | Banner / Video / Native / Multi-Format |
| **Rendering** | Automatic iframe rendering | Full control, custom rendering supported |
| **Configuration** | HTML data attributes | Full Prebid.js config API |
| **Preferred Deal** | Supported | Supported |
| **Advanced Features** | Basic configuration | Price Granularity, User Sync, First Party Data, etc. |
| **Recommended For** | Quick launch, simple pages, no frontend dev resources | Production environments, complex requirements, fine-grained control |
