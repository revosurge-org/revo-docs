---
title: AppsFlyer integration overview
sidebar_label: Overview
description: How RevoSurge integrates with AppsFlyer — activate the partner and send postbacks, then let RevoSurge forward clicks via your landing page's web tracker. Start here to find the page you need.
---

# AppsFlyer integration overview

**Audience:** UA managers, advertisers, agencies, tracking/BI engineers

Measuring RevoSurge campaigns with AppsFlyer takes two halves: **postbacks out of AppsFlyer**, so we receive your installs and in-app events, and **click forwarding into AppsFlyer**, so AppsFlyer knows which clicks were ours. Neither half works alone.

> [!IMPORTANT]
> **You do not build AppsFlyer tracking links for RevoSurge.** There is no link to generate in AppsFlyer and no URL to paste into RevoSurge. RevoSurge forwards the click for you, driven by the AppsFlyer App ID you set when installing the web tracker on your landing page. If your team has integrated other DSPs, this is the step that works differently here.

RevoSurge is also a **non-SRN** partner (not a self-reporting network): AppsFlyer does not query us for campaign data, so the postbacks you enable are the only way conversions reach RevoSurge.

## Which page do I read?

| I am | Campaign | Read, in this order |
|---|---|---|
| Advertiser | Any | [Set up postbacks](/en/mmp/appsflyer/postbacks) → [Click forwarding](/en/mmp/appsflyer/click-forwarding) → [Handoff & go-live](/en/mmp/appsflyer/handoff) |
| Advertiser | iOS | The same two pages — and turn Advanced Privacy **off**. RevoSurge does not use SKAN |
| Agency | Any | This page + [Partner permissions](/en/mmp/appsflyer/permissions), then the same two pages |
| Tracking / BI engineer | Any | [Macros](/en/mmp/appsflyer/macros) — what RevoSurge sends, and how to reconcile the two dashboards |
| Anyone | After setup | [Integration validation](/en/mmp/appsflyer/validation) → [Handoff & go-live](/en/mmp/appsflyer/handoff) |

User acquisition and re-engagement follow the same two pages. The click path does not differ between them, so there is no separate UA and re-engagement setup to choose between. Deep linking is the exception — see [Not covered here](#not-covered-here).

Agencies: [Partner permissions](/en/mmp/appsflyer/permissions) is the page to send the client, since only the app owner can grant them.

## What you configure, and where

Keep the two consoles separate. Nothing in this section asks you to jump between them mid-step.

| In AppsFlyer | In RevoSurge |
|---|---|
| Turn on probabilistic attribution (app-level) | Install the web tracker on your landing page |
| Activate the RevoSurge partner tile | Set the AppsFlyer App ID for each platform you promote |
| Turn Advanced Privacy off (iOS) | Select AppsFlyer as the MMP source on your product in AdWave |
| Set the attribution lookback windows | Confirm the partner event names your postbacks will carry |
| Enable default postbacks (install, re-engagement) | Check that installs and events are arriving |
| Enable in-app event postbacks and map your funnel events | — |

## Required settings at a glance

These are requirements, not recommendations. Most exist because our optimization models need organic and unattributed events, not only RevoSurge-attributed ones. The setup pages repeat each one with its exact click path.

### In AppsFlyer

| Setting | Required value | Why |
|---|---|---|
| Probabilistic attribution (App Settings) | **ON** | RevoSurge clicks arrive from a browser, which cannot supply a device ID for a deterministic match |
| Activate partner | **ON** for as long as campaigns run | Off means no attribution and no postbacks |
| Advanced Privacy / Aggregated Advanced Privacy (iOS) | **OFF** | On strips the device ID and click ID from postbacks |
| Click-through lookback | **7 days** | Aligns RevoSurge with your other networks |
| View-through lookback | **24 hours** | Aligns RevoSurge with your other networks |
| Install view-through attribution | **ON** | Part of the standard configuration — see the note below |
| Default postbacks (install, re-engagement) | **All media sources, including organic** | Models train on attributed, unattributed, and organic events |
| In-app event postbacks | **ON** | Post-install signal is the optimization target |
| In-app postback window | **Lifetime** (floor: 6 months) | Short windows truncate the events we learn from |
| In-app sending option | **All media sources, including organic** | Same reason as default postbacks |
| Revenue | **Values & revenue** on purchase / deposit / revenue events | Required for ROAS |

> [!NOTE]
> RevoSurge forwards **clicks only** — impressions are not sent to AppsFlyer, and RevoSurge attribution is click-based. The two view-through rows above therefore have no effect on your current RevoSurge traffic; they are in the required set so the tile does not need revisiting later.

### In RevoSurge

| Setting | Required value |
|---|---|
| Web tracker on your landing page | Installed, and the product shows **Active** |
| `androidAppsFlyerId` / `iOSAppsFlyerId` | Your AppsFlyer App ID, for each platform you promote |
| MMP source on the product in AdWave | **AppsFlyer** |

## Before you start

Ask your RevoSurge contact for these. They are issued per account, so do not guess them from a similarly named tile in the Partner Marketplace.

- The **exact RevoSurge partner tile name** to search for in AppsFlyer's Partner Marketplace.
- The **partner event names** RevoSurge accepts, so your AppsFlyer event names can be mapped to them exactly.

And have this from your own AppsFlyer account:

- Your **AppsFlyer App ID** for each platform you promote, from the app's settings in your AppsFlyer dashboard.

## Three IDs, easy to confuse

This integration involves three identifiers. Pasting one where another belongs is the most common cause of a silent integration: pages load, clicks register, and nothing lands.

| ID | What it identifies | Where you get it | Where it goes |
|---|---|---|---|
| **AppsFlyer App ID** | Your app, inside AppsFlyer | AppsFlyer dashboard, app settings | Your landing page's web tracker (`androidAppsFlyerId` / `iOSAppsFlyerId`) |
| **RevoSurge Tracker ID** | Your product, inside RevoSurge | RevoSurge, when you create the product | Your landing page's web tracker (`trackerId`) |
| **`pid`** (AppsFlyer media source) | RevoSurge, as the media source | Set by RevoSurge on the forwarded click | Nothing to configure — you will see it in AppsFlyer reporting |

## Not covered here

- **Sending events from your own servers.** That is the [Server Events API (v3)](/en/tracking/s2s/v3/server-events-api), which runs independently of your MMP.
- **Affiliate back-office postbacks.** Those are covered by the [Partner Postback API](/en/tracking/postback/partner-postback).
- **Re-engagement deep linking.** The pages in this section get re-engagement campaigns measured, but they do not cover deep-link routing into the app. Talk to your account manager before launching one.

## Next steps

Start with [Set up postbacks](/en/mmp/appsflyer/postbacks) — until postbacks are on, RevoSurge receives nothing regardless of what else is configured. Then [Click forwarding](/en/mmp/appsflyer/click-forwarding).

New to RevoSurge measurement generally? Read the [Tracking overview](/en/tracking/overview) first, then come back here.
