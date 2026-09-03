---
title: Set up AppsFlyer postbacks
sidebar_label: Set up postbacks
description: Activate the RevoSurge partner tile in AppsFlyer and configure default and in-app event postbacks, including the required window, sending options, and revenue settings.
---

# Set up AppsFlyer postbacks

**Audience:** UA managers, advertisers, agencies with the [Configure integration permission](/en/mmp/appsflyer/permissions)

This page is done entirely in the **AppsFlyer console**. It activates RevoSurge as a partner and starts the flow of install and post-install events to us. Nothing here requires you to open RevoSurge.

Do this once per app — an Android app and an iOS app are configured separately.

> [!IMPORTANT]
> Postbacks are what make RevoSurge campaigns measurable. Until they are on, RevoSurge receives no installs and no events, and optimization cannot start regardless of how the campaign is set up.

## Before you start

Two things must be true before the partner configuration will work. Both live outside the RevoSurge partner tile, so they are easy to miss.

### 1. Probabilistic attribution is on

In AppsFlyer, go to **App Settings** for the app you are configuring and make sure **probabilistic attribution** (formerly "fingerprinting") is **enabled**.

This is an **app-level** setting, not a per-partner one: it is not inside the RevoSurge tile, and turning it on applies to every media source on that app.

> [!NOTE]
> This one matters more for RevoSurge than for most partners. RevoSurge clicks reach AppsFlyer from your **landing page in a browser**, and a browser cannot hand over the device advertising ID that a deterministic match needs — so a meaningful share of genuine installs can only be matched probabilistically, especially on iOS. With the setting off, those installs arrive as organic, RevoSurge never learns from them, and your reported performance is lower than your actual performance.

### 2. Your in-app event list is configured in your own product

Decide which in-app events you want RevoSurge to receive, and make sure your **app is already sending them to AppsFlyer** — via the AppsFlyer SDK or your server-to-server event integration — before you come to this page.

Two reasons this order matters:

- The in-app event postback screen maps **event names that AppsFlyer has actually seen**. An event your app has never fired is not there to select.
- The names you send are the names we receive. Renaming an event later breaks the mapping silently: postbacks keep arriving, under a name RevoSurge does not recognize.

Have the finished list ready — at minimum your registration, deposit/purchase, and any revenue events — and confirm with your RevoSurge contact which **partner event names** we accept, so each AppsFlyer event maps to exactly one of them.

## 1. Open the RevoSurge partner tile

1. In AppsFlyer, go to **Collaborate → Partner Marketplace**.
2. Search for the **exact RevoSurge tile name** your RevoSurge contact gave you.
3. Click **Set up integration**.

> [!WARNING]
> Do not pick a similarly named tile. The Partner Marketplace lists thousands of partners, several with names close to ours, and a sibling tile produces a configuration that saves cleanly and sends us nothing.

## 2. Activate the partner

On the **Integration** tab, turn **Activate partner** to **ON**.

Leave it on for as long as campaigns run. Switching it off stops attribution and postbacks immediately — it is not a pause, it is a disconnect.

## 3. Turn Advanced Privacy off (iOS)

On iOS apps, set **Advanced Privacy** — and **Aggregated Advanced Privacy** if your account shows it — to **OFF**.

Leaving it on strips the device ID and the click ID from the postbacks we receive. What arrives is an aggregate row we cannot tie back to the click that produced it, which rules out both attribution checks and optimization.

> [!NOTE]
> This is a privacy-configuration decision on your account. If your legal or compliance team owns that setting, raise it with them before launch rather than at go-live.

## 4. Set the attribution lookback windows

In the partner tile's attribution settings, set:

| Window | Required value |
|---|---|
| Click-through lookback | **7 days** |
| View-through lookback | **24 hours** |

These align RevoSurge with the windows your other networks use. If your other partners run on different windows, tell your RevoSurge account manager before launch rather than changing these unilaterally — mismatched windows surface as an attribution discrepancy between dashboards, not as an error.

## 5. Turn on view-through attribution

Set **Install view-through attribution** to **ON**.

> [!NOTE]
> RevoSurge forwards **clicks only** today, so this toggle does not change how your current RevoSurge traffic is attributed — RevoSurge attribution is click-based. It is part of the required configuration so that the tile does not need revisiting later. If you are auditing the integration and see no view-through installs from RevoSurge, that is expected, not a misconfiguration.

## 6. Default postbacks — all media sources, including organic

In the **Default postbacks** section, enable **Install** and **Re-engagement**, and for each one set the sending option to **all media sources, including organic** (in AppsFlyer's wording, events attributed to any partner *or* organic).

| Postback | Enabled | Sending option |
|---|---|---|
| Install | Yes | All media sources, including organic |
| Re-engagement | Yes | All media sources, including organic |

This is a requirement, not a preference. Our models need a complete picture — RevoSurge-attributed, other-partner-attributed, and organic — to tell the volume we caused apart from the volume that would have happened anyway. Restricting postbacks to "attributed to this partner" leaves us optimizing against our own output.

## 7. In-app event postbacks

1. Turn **in-app event postbacks** to **ON**.
2. Set the **in-app event postback window** to **Lifetime**. If your account cannot select Lifetime, the floor is **6 months** — anything shorter truncates the post-install behaviour we learn from.
3. Set the **sending option** to **all media sources, including organic**, same as the default postbacks.
4. Map the events from your prepared list. Select each AppsFlyer event and map it to the RevoSurge partner event name it corresponds to. Alternatively use **Send all events** if you want the whole stream forwarded.

| Setting | Required value |
|---|---|
| In-app event postbacks | ON |
| Postback window | Lifetime (floor: 6 months) |
| Sending option | All media sources, including organic |
| Event mapping | Every funnel event from your list, or Send all events |

> [!WARNING]
> Map names exactly. `deposit` and `Deposit` are two different events to us. A mismatch does not error — the postback is delivered and then dropped as unrecognised, which looks identical to "no conversions" on your dashboard.

## 8. Send values and revenue on monetization events

For every purchase, deposit, or revenue event in your mapping, set the value option to **Values & revenue**.

Without it we receive the event but not the amount, which makes ROAS and any value-based optimization impossible. Non-monetary events can stay on values-only.

## 9. Save

Save the integration. The configuration takes effect for new traffic — it does not backfill events that occurred before you saved.

## What RevoSurge does and does not receive

| We receive | We do not receive |
|---|---|
| Installs, including organic and other-partner-attributed | Anything from before you saved this configuration |
| Re-engagements | Events your app never sent to AppsFlyer |
| The in-app events you mapped, for the full window | Events outside the postback window, if you set one shorter than Lifetime |
| Revenue values on events set to Values & revenue | Device and click IDs, if Advanced Privacy is on |

## Next steps

Postbacks carry conversions **back** to RevoSurge. They do not tell AppsFlyer which clicks were ours — that is the other half of the integration, and it is not finished without it.

Continue to [Click forwarding](/en/mmp/appsflyer/click-forwarding). You will not generate any AppsFlyer tracking links: RevoSurge forwards the click for you, driven by the AppsFlyer App ID on your landing page's web tracker plus a product-level setting in AdWave.
