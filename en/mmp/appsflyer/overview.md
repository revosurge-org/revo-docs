---
title: "AppsFlyer integration overview"
sidebar_label: Overview
description: "Connect AppsFlyer to AdWave for mobile installs, mapped in-app events and postback verification."
---

# AppsFlyer integration overview

AppsFlyer is a mobile measurement partner (MMP) that measures app installs and in-app actions and identifies which advertising source drove them. Its integration shares install and mapped event postbacks with RevoSurge for app campaign measurement.

## How it works

Two directions of tracking must work:

- **Clicks to AppsFlyer:** a RevoSurge ad opens your landing page. Its web tracker lets RevoSurge forward the click to AppsFlyer.
- **Conversions to RevoSurge:** AppsFlyer sends install and mapped in-app event postbacks back to RevoSurge.

A postback is a notification that an install or event occurred. Configuring only one direction leaves measurement incomplete.

**You do not need to generate an AppsFlyer tracking link for this flow.** Set the AppsFlyer App ID in your landing-page tracker and select AppsFlyer as the product's MMP source in AdWave. RevoSurge currently forwards clicks only, not impressions.

<a id="which-page-do-i-read"></a>
<a id="what-you-configure-and-where"></a>

## Follow the guide

- [Set up and verify AppsFlyer](/en/mmp/appsflyer/setup-appsflyer) — pre-launch configuration checks, post-launch verification and troubleshooting.
- **Reference:** [Parameters & reporting](/en/mmp/appsflyer/parameters-reporting).

## When verification is possible

AppsFlyer’s IP allowlist restrictions prevent manual pre-launch full-path verification for this integration. Prepare and check the configuration before launch; verify attribution and postback delivery after the campaign launches and eligible real installs/events occur. Saved settings alone do not establish a verified source.

<a id="required-settings-at-a-glance"></a>
<a id="in-appsflyer"></a>
<a id="in-revosurge"></a>
<a id="three-ids-easy-to-confuse"></a>

## Before you start

Have the following ready:

- Access to configure the app in AppsFlyer and the product in AdWave.
- Your RevoSurge account manager (AM), who confirms the correct **PID** and accepted partner event names.
- The AppsFlyer App ID for every platform you promote.
- Landing-page URLs and the person who can install or update their tracker.
- Events already reaching AppsFlyer, including your campaign's target conversion and applicable revenue.

<a id="not-covered-here"></a>

## Platform and scope notes

Configure Android and iOS separately. Review iOS attribution/privacy requirements with the responsible owner. Confirm re-engagement and deep-link requirements with your AM before launching those campaigns.

Direct server events and affiliate callbacks have separate documentation: [Server Events API](/en/tracking/s2s/v3/server-events-api) and [Partner Postback API](/en/tracking/postback/overview).

<a id="next-steps"></a>

**Next:** [Set up AppsFlyer](/en/mmp/appsflyer/setup-appsflyer).
