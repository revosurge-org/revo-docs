---
title: Handoff & go-live
sidebar_label: Handoff & go-live
description: The checklist that closes the AppsFlyer integration — what to send your RevoSurge account manager, the end-to-end go-live test, symptom-to-rule triage, and the changes that require a re-check.
---

# Handoff & go-live

**Audience:** UA managers, advertisers, agencies handing a client integration back

Checklist, not a how-to. Both configuration halves are covered elsewhere — [Set up postbacks](/en/mmp/appsflyer/postbacks) and [Click forwarding](/en/mmp/appsflyer/click-forwarding). This page closes the integration: what to hand over, how to prove it works with real traffic, and what will silently break it later.

## Before you hand off

- [ ] Every required rule in [Integration validation](/en/mmp/appsflyer/validation#required-rules) passes ([AF-R-01](/en/mmp/appsflyer/validation#af-r-01) — [AF-R-11](/en/mmp/appsflyer/validation#af-r-11))
- [ ] The recommended rules pass, or you have a reason for each one that does not
- [ ] Done separately for **each app** — Android and iOS are configured independently
- [ ] Your in-app events are live in production, not just in staging

## What to send your account manager

| Deliverable | Why we need it | You can skip it if |
|---|---|---|
| Screenshots of the AppsFlyer **Integration** and **Permissions** tabs | Confirms the tile matches the required settings | You granted [AF-O-05](/en/mmp/appsflyer/validation#af-o-05) and [AF-O-06](/en/mmp/appsflyer/validation#af-o-06) — then we read the tile directly and need no screenshots |
| Your **event mapping** — each AppsFlyer event name and the RevoSurge partner event name it maps to | The highest-risk silent failure in this integration. A mismatch delivers postbacks that we drop as unrecognised, which looks exactly like zero conversions | Never. Send this even if we hold every permission |
| The **landing page URL(s)** carrying the web tracker | We cannot see your tracker init from our side | Never |
| **Which platforms** you promote — Android, iOS, or both | Determines which App IDs are required, and whether Advanced Privacy applies | Never |
| Your **AppsFlyer App ID(s)**, as set in the tracker | Lets us confirm the value in your init matches the app you expect the installs to land on | Never |

Send the event mapping as text, not a screenshot — we compare it character by character against what we accept, and exact case matters.

## The go-live test

Configuration checks prove the setup is correct. Only real traffic proves it works.

1. Click a live RevoSurge ad — or a test campaign your account manager sets up.
2. Land on the page carrying the web tracker.
3. Install the app from the store.
4. Open the app.
5. Fire one mapped funnel event — a registration is usually the quickest.

What should happen:

| Step | Expected result | Where to check |
|---|---|---|
| Click | Click recorded | RevoSurge dashboard |
| Click | Click registered against your app | AppsFlyer, under the RevoSurge media source |
| Install | Attributed to RevoSurge — **not** organic | AppsFlyer |
| Install | Install postback received | RevoSurge dashboard |
| Funnel event | In-app event postback received, under the correct RevoSurge partner event name | RevoSurge dashboard |
| Revenue event, if you have one | Amount present, not just the event | RevoSurge dashboard |

AppsFlyer sends postbacks as events happen, so a correctly configured install postback arrives within minutes. If an hour passes with nothing, treat it as a failure rather than a delay and start from the triage table below.

**Deadlines for the integration to prove itself:** one install postback within **2 days** of handoff, and the first in-app event postback within **7 days**. An integration that has not produced both is not live, regardless of what the configuration says.

## If the test fails

Work from the symptom, not from the top of the config.

| Symptom | Start here |
|---|---|
| RevoSurge shows clicks; AppsFlyer shows the installs as organic | [AF-R-10](/en/mmp/appsflyer/validation#af-r-10), [AF-R-11](/en/mmp/appsflyer/validation#af-r-11), [AF-R-09](/en/mmp/appsflyer/validation#af-r-09) |
| AppsFlyer attributes the install to RevoSurge; RevoSurge received nothing | [AF-R-05](/en/mmp/appsflyer/validation#af-r-05), [AF-R-01](/en/mmp/appsflyer/validation#af-r-01) |
| Install postback arrives; in-app events never do | [AF-R-06](/en/mmp/appsflyer/validation#af-r-06), [AF-R-07](/en/mmp/appsflyer/validation#af-r-07) |
| Events arrive but carry no revenue | [AF-R-08](/en/mmp/appsflyer/validation#af-r-08) |
| iOS install volume far below Android, same spend | [AF-R-02](/en/mmp/appsflyer/validation#af-r-02), [AF-R-03](/en/mmp/appsflyer/validation#af-r-03) |
| Volumes differ between the two dashboards, but both show data | Expected up to a point — see [Reconciling AppsFlyer against RevoSurge](/en/mmp/appsflyer/macros#reconciling-appsflyer-against-revosurge) |

## After go-live: changes that require a re-check

This integration has no link to re-register, so nothing visibly breaks when the setup drifts. These changes break it silently — re-run the named rules after each.

| Change | What it breaks | Re-run |
|---|---|---|
| Renaming an in-app event, or adding a funnel event | New or renamed events arrive under a name we do not recognise, and are dropped | [AF-R-07](/en/mmp/appsflyer/validation#af-r-07) |
| Replacing or redesigning the landing page | The tracker or its App IDs may not survive the rebuild | [AF-R-09](/en/mmp/appsflyer/validation#af-r-09), [AF-R-10](/en/mmp/appsflyer/validation#af-r-10) |
| Adding a platform — for example launching iOS on an Android-only setup | No App ID for the new platform, and Advanced Privacy now applies | [AF-R-03](/en/mmp/appsflyer/validation#af-r-03), [AF-R-10](/en/mmp/appsflyer/validation#af-r-10) |
| Adding a new app | Nothing carries over — the tile, postbacks, and permissions are all per app | All required rules |
| Anyone toggling Advanced Privacy back on | Postbacks lose the device and click IDs | [AF-R-03](/en/mmp/appsflyer/validation#af-r-03) |
| Changing attribution lookback windows | Attribution volume shifts and the two dashboards diverge further | [AF-R-04](/en/mmp/appsflyer/validation#af-r-04) |
| Switching the product's MMP in AdWave | Clicks stop reaching AppsFlyer | [AF-R-11](/en/mmp/appsflyer/validation#af-r-11) |
| Deactivating the partner during a campaign pause | A disconnect, not a pause — attribution and postbacks stop | [AF-R-01](/en/mmp/appsflyer/validation#af-r-01) |
| Rotating who owns the AppsFlyer account | Permissions granted to RevoSurge may be revoked with the previous owner's access | [AF-O-05](/en/mmp/appsflyer/validation#af-o-05) — [AF-O-08](/en/mmp/appsflyer/validation#af-o-08) |

> [!TIP]
> Put the two RevoSurge-side items — the tracker on the landing page and the AppsFlyer App IDs — into whatever checklist your team already runs before a site release. They live in your codebase, so they are the parts most likely to be lost in a deploy that had nothing to do with advertising.

## Agencies

- Hand the client the [Partner permissions](/en/mmp/appsflyer/permissions) page. Only the app owner can grant permissions on the tile; you cannot grant them to yourself.
- Your handoff back to the client is this page's deliverables plus the go-live test result.
- There is no `af_prt` on RevoSurge traffic, so AppsFlyer's agency dimension stays empty — report RevoSurge performance from the advertiser's AppsFlyer account or from RevoSurge, and set that expectation before launch rather than during the first reporting cycle.
