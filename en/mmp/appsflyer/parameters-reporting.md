---
title: "Parameters & reporting"
description: "Match AppsFlyer and RevoSurge campaign reports using media source, campaign, ad group and event postback data."
---

# Parameters & reporting

Reference for UA and tracking teams comparing AppsFlyer with RevoSurge. RevoSurge supplies these click parameters automatically; this page adds no advertiser setup step.

## Identify the right traffic

Confirm the RevoSurge **PID** with your AM and use it to filter AppsFlyer reports. Multiple RevoSurge accounts may appear; do not copy another advertiser's PID.

Confirm the same app, platform, date range and timezone before comparing reports. Match by campaign and ad-group IDs rather than names that may change.

## Click parameters

The published parameter reference maps the following fields:

| AppsFlyer field | RevoSurge value | Use in reporting |
| --- | --- | --- |
| App ID in the URL path | Platform App ID from the tracker | Select the app |
| `pid` | RevoSurge media source | Filter to the AM-confirmed PID |
| `af_siteid` | Supply source ID | Compare supply sources |
| `c` | Campaign name | Display label |
| `af_c_id` | Campaign ID | Match the campaign |
| `af_ad_id` | Campaign ID in the documented mapping | Do not treat as a creative ID |
| `af_adset` | Ad-group name | Display label |
| `af_adset_id` | Ad-group ID | Match the ad group |

The published mapping uses the same campaign value for `af_ad_id` and `af_c_id`. Confirm this behavior with your AM if your reporting depends on creative-level attribution; use RevoSurge reporting for creative analysis under that mapping.

## Why counts can differ

A RevoSurge click occurs before the landing page finishes loading. AppsFlyer only receives the forwarded click when the tracker path runs, so interrupted loads or blocked tracking can create differences.

Install and event comparisons also depend on event names, timezone, postback receipt and the windows below:

- **Attribution lookback window:** how far before an install a click or impression can qualify for attribution.
- **In-app event postback window:** how long after an install event postbacks can be sent. AppsFlyer can still record and attribute an event after this window expires without forwarding it to RevoSurge. See [AppsFlyer’s postback-window reference](https://support.appsflyer.com/hc/en-us/articles/208439256-In-app-event-postback-configuration).

Check your saved sending scope. With **This partner only**, organic and other-source events are excluded. Compare the same event population in both systems.

## Investigate a discrepancy

1. Align app/platform, confirmed PID, time range and timezone.
2. Match campaign and ad-group IDs.
3. Align event definitions, attribution lookback windows, event postback windows and sending scope.
4. After campaign launch, correlate a real install/event with its UTC timestamps.
5. If the path fails, follow [Post-launch verification & troubleshooting](/en/mmp/appsflyer/setup-appsflyer#_4-verify-after-campaign-launch).

Do not expect impression-based attribution from a click-only integration. RevoSurge's documented flow does not forward impressions to AppsFlyer.

Reference: [Published click parameters and macros](/en/mmp/appsflyer/macros). The [published source bundle](/llms-full.txt) also contains that page.
