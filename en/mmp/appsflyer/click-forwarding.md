---
title: Forward clicks to AppsFlyer
sidebar_label: Click forwarding
description: RevoSurge registers the click with AppsFlyer for you. Install the web tracker on your landing page with your AppsFlyer App ID, then select AppsFlyer as the MMP source on your product in AdWave.
---

# Forward clicks to AppsFlyer

**Audience:** UA managers, advertisers, web developers integrating the landing page

Postbacks bring conversions **back** to RevoSurge. This page covers the other direction: telling AppsFlyer which clicks were ours, so the installs that follow can be attributed to RevoSurge.

> [!IMPORTANT]
> **You do not build AppsFlyer tracking links for RevoSurge.** There is no link to generate in AppsFlyer and no URL to paste into RevoSurge. RevoSurge forwards the click to AppsFlyer automatically, using the AppsFlyer App ID you set when you install the web tracker on your landing page. If you have integrated other DSPs, this is the step that works differently here.

## How it works

```
Click on a RevoSurge ad
        ↓
Your landing page loads
        ↓
Web tracker fires, carrying your AppsFlyer App ID
        ↓
RevoSurge forwards the click to AppsFlyer
        ↓
AppsFlyer attributes the resulting install to RevoSurge
```

Two consequences worth reading twice:

- **The landing page is load-bearing.** The click reaches AppsFlyer through the web tracker on that page. Traffic routed anywhere that does not run the tracker — a store listing directly, a redirect that skips the page, a page where the tracker failed to load — produces no forwarded click, and the install that follows lands as organic or gets attributed elsewhere.
- **Clicks only.** RevoSurge does not forward impressions to AppsFlyer today. Attribution of RevoSurge traffic is click-based.

## What you need to do

Three things, done once per product.

### 1. Install the web tracker on your landing page

Follow [Install the Web Tracker](/en/tracking/web-tracker/install). Your product must reach **Active** status — a product stays Inactive until its tracker receives its first event, and an inactive product cannot be selected in the AdWave campaign flow.

### 2. Set your AppsFlyer App ID in the tracker {#set-app-id}

Pass the AppsFlyer App ID for each platform you promote in the tracker's init options:

```js
const tracker = new WebTracker({
  trackerId: "your-product's-tracker-id",

  // Required for AppsFlyer click forwarding — set the platforms you promote.
  androidAppsFlyerId: "your-android-app-id-in-appsflyer",
  iOSAppsFlyerId: "your-ios-app-id-in-appsflyer"
});
```

| Field | Set it when |
|---|---|
| `androidAppsFlyerId` | You promote an Android app |
| `iOSAppsFlyerId` | You promote an iOS app |

The two are independent — set whichever platforms you run and omit the other. Use the App ID exactly as it appears in your AppsFlyer dashboard under the app's settings; see the [field reference on the Install page](/en/tracking/web-tracker/install#step-3-initialize-the-tracker) for details.

> [!WARNING]
> Without the App ID, the web tracker still works and your RevoSurge events still arrive — but nothing is forwarded to AppsFlyer, so AppsFlyer never learns the click happened. This failure is silent on both dashboards: RevoSurge shows clicks, AppsFlyer shows the installs as organic. If your install volume looks right in RevoSurge and absent in AppsFlyer, check this field first.

### 3. Select AppsFlyer as the MMP source in AdWave

In RevoSurge, open your **product** in AdWave and set the **MMP source** to **AppsFlyer**.

This is a **product-level** setting — set once per product, not per campaign. It tells RevoSurge which MMP to forward clicks to. Leaving it unset, or set to a different MMP, means the App ID on the landing page is never used.

## Verify

Before you launch, confirm the chain end to end rather than one link at a time:

1. Open your landing page and confirm the tracker fires (your product shows **Active** in **Manage Product**).
2. Confirm the MMP source on the product reads **AppsFlyer**.
3. Click a live or test RevoSurge ad, land on the page, then install the app.
4. Confirm the install appears in AppsFlyer attributed to the RevoSurge media source — not as organic.
5. Confirm the install postback arrived in RevoSurge.

Steps 3–5 are the real test. Steps 1–2 only prove the configuration exists.

## Coming from another DSP?

If your team has integrated Moloco, Remerge, Kayzen or similar, these steps do **not** apply to RevoSurge:

| Elsewhere | With RevoSurge |
|---|---|
| Generate a single-platform link for UA, a OneLink for re-engagement | No link to generate — one mechanism covers both |
| Map tracking link macros to the DSP's parameters | Nothing to map; RevoSurge builds the click — see [Macros](/en/mmp/appsflyer/macros) for what it contains |
| Copy click and impression URLs into the DSP | Nothing to copy |
| Re-register the link after changing a campaign | Nothing to re-register; the product-level setting persists |

What you do still owe AppsFlyer is the partner configuration itself — see [Set up postbacks](/en/mmp/appsflyer/postbacks), which includes the lookback windows.

## Next steps

- Need to know exactly what we send on the click, or reconcile AppsFlyer against your RevoSurge dashboard? [Macros](/en/mmp/appsflyer/macros).
- Not done with the AppsFlyer console yet? [Set up postbacks](/en/mmp/appsflyer/postbacks) is the other half of the integration, and the integration does not work with only one half.
- Both halves done? [Integration validation](/en/mmp/appsflyer/validation), then [Handoff & go-live](/en/mmp/appsflyer/handoff).
- Launching on iOS? There is no extra step — RevoSurge does not use SKAN, so iOS runs on the same two pages as Android.
- Re-engagement campaigns and deep linking are not covered by the steps above. Talk to your RevoSurge account manager before launching one.
