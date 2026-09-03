---
title: Click parameters and macros
sidebar_label: Macros
description: Reference for the AppsFlyer click RevoSurge sends — every parameter, the RevoSurge macro behind it, and which AppsFlyer report dimension it lands in.
---

# Click parameters and macros

**Audience:** Tracking/BI engineers, UA managers reconciling AppsFlyer against RevoSurge

Reference page, not a click path. RevoSurge builds the AppsFlyer click for you — see [Click forwarding](/en/mmp/appsflyer/click-forwarding) for the two settings that switch it on. Read this page when you need to know **what we send**, so you can read your AppsFlyer reports and reconcile them against your RevoSurge dashboard.

> [!NOTE]
> There is nothing to configure here. Every value below is populated by RevoSurge at click time.

## The click URL

```
https://app.appsflyer.com/{app_id}
  ?pid={pid}
  &af_siteid={site_id}
  &c={campaign}
  &af_c_id={cid}
  &af_ad_id={cid}
  &af_adset={group}
  &af_adset_id={gid}
```

This is the complete set — RevoSurge sends no other parameters on the click.

`{app_id}` is **your** AppsFlyer App ID, taken from the `androidAppsFlyerId` or `iOSAppsFlyerId` you set on your landing page's web tracker. Android and iOS clicks are identical apart from that value, so a wrong App ID sends real clicks to the wrong app — or to no app at all.

## Parameters

| AppsFlyer parameter | RevoSurge macro | What it carries | Appears in AppsFlyer as |
|---|---|---|---|
| `{app_id}` (in the path) | — | Your AppsFlyer App ID, from the web tracker config | The app the click is attributed to |
| `pid` | — (fixed) | RevoSurge, as the media source | **Media Source** |
| `af_siteid` | `{site_id}` | The RevoSurge supply source the click came from | **Site ID** |
| `c` | `{campaign}` | Your RevoSurge campaign **name** | **Campaign** |
| `af_c_id` | `{cid}` | Your RevoSurge campaign **ID** | **Campaign ID** |
| `af_ad_id` | `{cid}` | Your RevoSurge campaign **ID** — see below | **Ad ID** |
| `af_adset` | `{group}` | Your RevoSurge ad group **name** | **Adset** |
| `af_adset_id` | `{gid}` | Your RevoSurge ad group **ID** | **Adset ID** |

The `pid` value is fixed for every RevoSurge advertiser and is not something you set. Ask your RevoSurge contact for the exact string — you will need it to filter AppsFlyer reports down to RevoSurge traffic.

> [!IMPORTANT]
> **`af_ad_id` carries the campaign ID, not an ad or creative ID** — the same value as `af_c_id`. AppsFlyer's **Ad ID** dimension therefore duplicates **Campaign ID** for RevoSurge traffic, and ad-level or creative-level breakouts are not available on the AppsFlyer side. Use RevoSurge reporting for creative performance.

## Example

A campaign named `IN_Register_Display_20260126` (campaign ID `48213`) with an ad group named `IN_Android_Tier1` (group ID `9074`), clicked from supply source `pub_44120`:

```
https://app.appsflyer.com/{app_id}?pid={pid}&af_siteid=pub_44120&c=IN_Register_Display_20260126&af_c_id=48213&af_ad_id=48213&af_adset=IN_Android_Tier1&af_adset_id=9074
```

Substitute your own App ID for the platform, and the `pid` your account manager gave you. Note `af_c_id` and `af_ad_id` both reading `48213`.

## Clicks only

RevoSurge does not send impressions to AppsFlyer. There is no impression URL, nothing is sent to `impression.appsflyer.com`, and RevoSurge attribution in AppsFlyer is click-based.

If you are auditing the integration, view-through installs attributed to RevoSurge should be **zero**. That is expected — see [the note on the view-through settings](/en/mmp/appsflyer/overview#required-settings-at-a-glance).

## Reconciling AppsFlyer against RevoSurge

To pull RevoSurge traffic out of an AppsFlyer report:

1. Filter **Media Source** to the RevoSurge `pid`.
2. Break out by **Campaign ID** to match a RevoSurge campaign, and **Adset ID** to match an ad group.
3. Join on **IDs, not names**.

> [!TIP]
> Names travel as they read in RevoSurge at click time. Rename a campaign or ad group and AppsFlyer receives the new name on subsequent clicks while historical rows keep the old one — so a join on `Campaign` or `Adset` silently splits one campaign into two. `af_c_id` and `af_adset_id` are stable across renames; use those.

Two numbers that will not match exactly, no matter how clean the setup:

- **Clicks.** RevoSurge counts the click when it happens. AppsFlyer only learns about it once your landing page loads and the web tracker fires, so anything lost between the two — bounces before load, blocked scripts, abandoned page loads — shows in RevoSurge and not in AppsFlyer.
- **Installs.** RevoSurge sees only what AppsFlyer's postbacks send, under AppsFlyer's attribution rules and lookback windows. AppsFlyer is the source of truth for attribution; RevoSurge is the source of truth for delivery.

## Next steps

- Haven't switched click forwarding on yet? [Click forwarding](/en/mmp/appsflyer/click-forwarding).
- Postbacks not configured? [Set up postbacks](/en/mmp/appsflyer/postbacks).
