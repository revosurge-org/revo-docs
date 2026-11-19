---
title: "Connect tracking"
description: "Choose your tracking sources in the AdWave Setup Wizard and check live events and campaign conversion readiness."
---

<a id="tracking-overview"></a>

# Connect tracking

Choose the system that records your conversions, connect it to your Product, then follow its setup and verification steps. AppsFlyer full-path verification takes place after campaign launch; other sources include pre-launch testing.

<a id="_1-create-your-product"></a>
<a id="_1-1-fill-in-the-form"></a>
<a id="_1-2-choose-the-right-funnel-type"></a>
<a id="_1-3-what-you-get"></a>

## 1. Select your Product

Open **Product**. Create or select the website/app you want to promote.

<a id="_2-choose-your-setup"></a>
<a id="_2-1-where-do-your-players-land"></a>
<a id="_2-2-which-system-holds-your-conversion-data"></a>
<a id="the-routing-table"></a>
<a id="_3-the-four-methods"></a>
<a id="_3-1-web-tracker-—-browser-side"></a>
<a id="_3-2-s2s-server-events-—-backend-side"></a>
<a id="_3-3-partner-postback-—-your-platform-calls-us"></a>
<a id="_3-4-appsflyer-—-app-installs-and-in-app-events"></a>
<a id="side-by-side"></a>

## 2. Choose the sources

1. Open **Choose your setup**.
2. Select **Our own back office**, **An affiliate platform**, or **AppsFlyer**.
3. Review the recommended sources.
4. Select **Use this setup** when ready to apply it.

AppsFlyer is available for app Products, not Web Products.

| Source | Use it for | Guide |
| --- | --- | --- |
| Web Tracker | Browser visits, clicks and supported website actions | [Overview](/en/tracking/web-tracker) |
| AppsFlyer | Mobile-app installs and mapped in-app events | [Overview](/en/mmp/appsflyer/overview) |
| S2S Server Events | Canonical business events from your backend, using POST JSON | [Overview](/en/tracking/s2s/overview) |
| Partner Postback v2 | Canonical business events from an affiliate platform, using GET callbacks | [Overview](/en/tracking/postback/overview) |

S2S v3 and Postback v2 share [Events & fields](/en/tracking/events/choose-events). Choose the transport by your source system, then use the same Product-specific event definitions. Receipt of a catalog event does not itself establish bidding-strategy or reporting support.

<img class="doc-screenshot" src="/img/handbook/wizard-v4/source-system-options.png" alt="Choose the system that records your conversions" width="416" height="237">

<img class="doc-screenshot" src="/img/handbook/wizard-v4/choose-setup-s2s.png" alt="Recommended sources for your own back office" width="416" height="268">

<a id="_6-getting-started"></a>

## 3. Connect and verify your sources

Open **Verify Your Source**, then follow the setup guide for each selected source. AppsFlyer has pre-launch configuration checks and post-launch verification because of its IP allowlist restrictions; its full path cannot be verified with a manual pre-launch test.
If the **Installation Guide** prompt appears, open the relevant source guides and acknowledge that you have read the setup and test procedure before using **Continue**. Reading a guide does not verify the integration.

<img class="doc-screenshot" src="/img/handbook/wizard-v4/installation-guide.png" alt="Installation Guide and source guide links" width="496" height="154">

<img class="doc-screenshot" src="/img/handbook/wizard-v4/installation-guide-acknowledgement.png" alt="Acknowledge the selected source guides before continuing" width="496" height="115">

The **Live** and **Test** tabs separate traffic evidence. Source status, historical receipts and Product activation can differ. In particular, **Historical events received (traffic type unknown)** does not establish that those historical events were accepted Live traffic.

Check these separately:

| Signal                     | What it tells you                                                                                      |
| -------------------------- | ------------------------------------------------------------------------------------------------------ |
| Product activated          | Campaign-creation eligibility under the activation basis                                               |
| Source status              | Source's connection and verification history                                                           |
| Campaign conversion events | Accepted live-event verification for the specific conversion, with its verifying source |

<a id="_2-3-what-do-your-campaigns-optimise-for"></a>
<a id="_4-what-each-method-unlocks"></a>

## 4. Campaign conversion events

Use **Campaign conversion events** to check which actions AdWave has received and accepted as live conversions for this Product.

Choose an event with accepted **Live** verification that your campaign bidding strategy supports. Test receipts and dry runs do not verify a campaign conversion.

<img class="doc-screenshot" src="/img/handbook/wizard-v4/campaign-conversion-events.png" alt="Campaign Conversion Events, verified conversions and pending setup" width="520" height="250">
<img class="doc-screenshot" src="/img/handbook/wizard-v4/campaign-conversion-details.png" alt="Verification Details by Source for the five app conversion events" width="560" height="396">

### Read the verification status

| Part of the panel                  | How to use it                                                                                                                                                                                             |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Verified** count and event cards | See the conversions with accepted live-event verification and the source that verified each one. This count is the number of verified conversion types, not the number of conversions received.           |
| **Awaiting verification**          | Find the actions that still need a matching live event. Complete the action through your integration and send the corresponding live event. Test events and dry runs do not verify a campaign conversion. |
| **Verification details by source** | Use **Verification Details by Source** to check each event against each source shown. An event verified through one source can still be **Not yet verified** through another.                                                       |
| **Last checked / recent activity** | Check when each source was last inspected. No recent activity does not erase past verification; investigate event freshness separately when you expect new conversions.                                   |

<a id="_5-faq"></a>

## Before launch

Complete the testing and launch checks in each source's setup guide. Use [Core concepts](/en/tracking/core-concepts) to check identity and attribution before investigating report differences.
