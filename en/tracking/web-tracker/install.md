---
title: "Install the Web Tracker"
description: "Install the Web Tracker, connect completed actions and verify live browser conversions in AdWave."
---

# Install the Web Tracker

Install once on each tracked site, then connect the actions your campaign needs.

<a id="before-you-start"></a>
<a id="step-1-find-your-tracker-id"></a>
<a id="option-a-—-setup-wizard-fastest"></a>
<a id="option-b-—-product-detail"></a>

## 1. Copy your Tracker ID

Open **Product** and confirm the intended Product. Copy **Tracker ID** from its header or **Verify Your Source → Web Tracker**. If you open Product details first, use **View in Setup Wizard**.

<a id="step-2-add-the-tracker-script"></a>

## 2. Load the script

Add the script to the head of every tracked page:

```html
<script src="https://assets.revosurge.com/js/web-tracker.js"></script>
```

For a single-page app, load and initialize it once in the root layout. In Google Tag Manager, use a Custom HTML tag on All Pages and ensure initialization follows script loading.

<a id="step-3-initialise-the-tracker"></a>

## 3. Initialize the tracker

```js
const tracker = new WebTracker({
  trackerId: "YOUR_TRACKER_ID"
});
```

Use the exact ID copied from your Product. For the documented AppsFlyer forwarding path, also set the promoted platform's `androidAppsFlyerId` and/or `iOSAppsFlyerId`; follow your [AppsFlyer connection guide](/en/mmp/appsflyer/setup-appsflyer).

<a id="step-4-send-key-events"></a>
<a id="choosing-a-user-id"></a>

## 4. Connect completed actions

```js
tracker.trackRegister("user_123", {
  identifier: "sha256_hash_of_email_or_phone"
});
tracker.trackLogin("user_123");
tracker.trackDeposit("user_123", {
  currency: "USDT",
  network: "TRON",
  amount: 100
});
```

Use your stable player account ID, not a changing session ID. Send the same value as S2S `identity.client_user_id` and as Postback v2 `identity.client_user_id` or Postback v1 `user_id`. Hash contact identifiers before sending them.

At registration, call [`getClickid()`](/en/tracking/web-tracker/reference#getclickid) and store the original RevoSurge click ID with the player record when available. Send it with backend conversions so they can be tied to the correct ad interaction.

The basic browser events to consider are `page_view`, `register`, `login`, `deposit`, `enter_game` and `download_click`. Choose the ones required by your setup; a page view does not prove a conversion handler works. Full signatures are in the [SDK reference](/en/tracking/web-tracker/reference).

<a id="step-5-verify-in-the-portal"></a>
<a id="_5-1-watch-the-event-stream"></a>
<a id="_5-2-check-tracker-status"></a>
<a id="step-6-go-live"></a>

## 5. Deploy and test end to end

1. Deploy the tracker to each registered landing route.
2. Use an agreed RevoSurge test ad/link to reach the actual landing route and confirm the tracker initializes with this Product's Tracker ID.
3. Complete the campaign's target action.
4. Open **Verify Your Source → Web Tracker → View event stream**.
5. Check source, traffic mode, UTC time, event status and reason. Match the event to the expected player identity and business values.
6. Review **Campaign conversion events** for the intended action. A matching accepted live event is needed for conversion verification; test events and dry runs do not verify a campaign conversion.
7. Confirm the campaign's bidding strategy supports the conversion you want to use. Receipt acceptance alone does not establish attribution.


<img class="doc-screenshot" src="/img/handbook/wizard-v4/source-verification.png" alt="Web Tracker source status and received-event controls; sensitive values blurred" width="480" height="256">

![Event-stream search, source and traffic-mode filters](/img/handbook/wizard-v4/event-stream.png)

The Test tab does not establish a supported SDK test-mode switch. Confirm the test procedure before sending browser test traffic; the documented SDK installation treats sends as Live.

| Check | Expected result |
| --- | --- |
| Landing route | Registered destination; tracker executes there |
| User identity | Stable player ID matches the other sources |
| Target action | Correct event arrives once per intended action |
| Values, if applicable | Required business fields match the completed action |
| Campaign readiness | Intended target is available; receipt alone is insufficient |

<a id="troubleshooting"></a>
<a id="_5-3-run-the-diagnostics-if-nothing-arrives"></a>

### If a check fails

| Symptom | First checks |
| --- | --- |
| No browser events | Script request, initialization order, exact Tracker ID and registered destination |
| page_view arrives but register does not | Register handler executes on success and before redirect |
| Event arrives under another Product | Copied Tracker ID and deployed configuration |
| Duplicate events | Handler registered twice, route reinitialization or retry behavior |
| Browser data and server conversions do not join | Same player ID and preserved click identity |
| Active source but no recent conversion | Source history is independent of recent traffic; inspect the target event |

Recheck the real landing route after changing a domain, redirect, Tracker ID, identity mapping or event handler. If an issue persists, share the Product, landing URL, event name, UTC time and observed result with your Account Manager. Keep credentials out of screenshots.

**Done when:** the intended action produces the correct event and identity, and the live conversion and attribution checks required by your campaign pass.

<a id="related"></a>

**Reference:** [Web Tracker SDK reference](/en/tracking/web-tracker/reference) for methods and fields, or [Tracking overview](/en/tracking/overview) to review the other sources.
