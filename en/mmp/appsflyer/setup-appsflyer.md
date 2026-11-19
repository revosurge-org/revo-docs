---
title: "Set up and verify AppsFlyer"
description: "Configure AppsFlyer and AdWave before launch, then verify attribution and postbacks with live campaign traffic."
---

# Set up and verify AppsFlyer

Configure AppsFlyer and the landing-page tracker before launch, then verify attribution and postback delivery using real campaign traffic after launch.

**Full-path verification is only available after launch.** AppsFlyer’s IP allowlist prevents manual pre-launch verification for this integration. Complete the configuration checks below before launch and verify full path post-launch.

## 1. Configure AppsFlyer

### Confirm attribution settings before setup

Check the app-level attribution setting before configuring RevoSurge.

In AppsFlyer, open the intended app and go to **Settings → App Settings**. Confirm the required setting for **Enable view-through attribution via probabilistic modeling** with your app owner and AM before changing it. The documented RevoSurge flow forwards clicks only; this app-level setting needs confirmation for your configuration.

![App-level attribution settings with view-through probabilistic modeling enabled](/img/handbook/wizard-v4/ss03-attribution-settings.png)

### 1) Partner Integrations

1. In AppsFlyer, open **Collaborate → Partner Integrations**.
2. Select **Marketplace**.
3. Select your app and platform in **App**.
4. Search for **RevoSurge**.
5. Choose the entry matching the **PID confirmed by your AM**.
6. Click **Integrate** on that entry.

![Partner Integrations, Marketplace, RevoSurge search and Integrate](/img/handbook/wizard-v4/ss01-marketplace.png)

### 2) Activate Partner

Turn **Activate partner** ON to enable attribution and send postbacks.

<img class="doc-screenshot" src="/img/handbook/wizard-v4/ss04-activation.png" alt="Activate partner switched ON" width="384" height="81">
### 3) Check default install postbacks

Under **Default postbacks**, review **Install** and its **for users from** value.

<img class="doc-screenshot" src="/img/handbook/wizard-v4/ss05-install-postback.png" alt="Default install postback and sending control" width="448" height="92">

The example shows a read-only **This partner only** setting. Confirm the supported sending scope for your app and PID with your Account Manager.

### 4) Enable in-app event postbacks

Turn **In-app event postbacks** ON to reveal the window and mapping table. Select the event postback window to Lifetime. If it is unavailable, use at least **6 months**.

<img class="doc-screenshot" src="/img/handbook/wizard-v4/ss07-lifetime.png" alt="Lifetime selected for in-app event postbacks" width="448" height="108">
### 5) Add a mapping row

Click **Add event** below the event table.

![Empty event table and Add event button](/img/handbook/wizard-v4/ss08-add-event.png)

A row appears with four fields:

![Blank mapping row with all four columns](/img/handbook/wizard-v4/ss09-blank-mapping.png)

#### Map each source event

1. In **AppsFlyer event**, select your app’s existing event. If no event appears, check the app, spelling and source-event receipt in AppsFlyer.
2. In **mapped to partner event**, enter the destination name supplied for that source event. Preserve spelling and case.
3. In **for users from**, choose the scope agreed with your Account Manager. **This partner only** forwards events attributed to RevoSurge.
4. In **including**, apply **Values & revenue** to monetization rows, and ensure the source event contains the amount and currency.
5. Click **Save Integration** at the bottom of the **Integration** tab.

### 6) Configure partner permissions, if agreed

After saving Integration, open **Permissions** and apply the access agreed with your app owner. Permissions are separate from postback delivery.

<img class="doc-screenshot" src="/img/handbook/wizard-v4/ss13-permission-tab.png" alt="Permissions tab and master permission switch" width="496" height="101">

![Partner permission options](/img/handbook/wizard-v4/partner-permission-options.png)

## 2. Connect RevoSurge

### 1) Register your app

1. Select your app Product in AdWave. Go to **Choose your setup → AppsFlyer → Use this setup**.
2. Open **Verify Your Source → AppsFlyer → Manage mappings**.
3. Enter the exact AppsFlyer App ID and select **Register app**, then enable the integration. Check the ID carefully—it cannot be changed here after registration.

![AppsFlyer app registration fields](/img/handbook/wizard-v4/appsflyer-app-registration.png)

### 2) Map your events

1. Confirm that the displayed **RevoSurge PID** matches the partner selected in AppsFlyer.
2. Choose the **Apply mappings to** scope. The default is **All apps**.
3. Enter the exact AppsFlyer event name for each RevoSurge event you send, then **Save**.

![RevoSurge PID and mapping scope](/img/handbook/wizard-v4/appsflyer-configuration-scope.png)

![AppsFlyer event mappings](/img/handbook/wizard-v4/appsflyer-event-mappings.png)

### 3) Connect the landing-page tracker

Follow [Install the Web Tracker](/en/tracking/web-tracker/install). Use your Product’s Tracker ID and the AppsFlyer App ID for each platform you promote:

```js
const tracker = new WebTracker({
  trackerId: "your-product-tracker-id",
  androidAppsFlyerId: "your-android-appsflyer-id",
  iOSAppsFlyerId: "your-ios-appsflyer-id"
});
```

Confirm that the tracker loads on your campaign landing page. It forwards clicks to AppsFlyer; you do not need to generate an AppsFlyer tracking link for this flow.

## 3. Check before launch

Confirm with your AM and app owner:

- The app, platform, Product and PID match.
- Partner activation, install postbacks and in-app event mappings are saved with the correct sending scope/window.
- Revenue events include amount/currency and **Values & revenue** is selected.
- Your campaign goal meets the launch requirements, and someone owns post-launch verification.

**Full-path verification is only available after launch.** AppsFlyer’s IP allowlist prevents manual pre-launch verification for this integration. Saved settings do not verify attribution or postback delivery; check real campaign installs and events in step 4.

## 4. Verify after campaign launch

### Check source status in AdWave

Open **Verify Your Source → Live** and review the **AppsFlyer** card. Check **Received events**, then use **View event stream** to inspect actual postback receipts.
### Match real campaign activity

| Check                     | Evidence                                                                       |
| ------------------------- | ------------------------------------------------------------------------------ |
| Campaign click            | RevoSurge campaign activity and the intended landing route                     |
| Install attribution       | AppsFlyer credits the real install to the confirmed RevoSurge PID/campaign     |
| Install delivery          | Matching install postback received by RevoSurge                                |
| Target-event delivery     | Actual source action reaches AppsFlyer and RevoSurge under the correct mapping |
| Revenue, where applicable | Received amount and currency match the source business record                  |

Verification depends on eligible real activity occurring. No install or target event yet means **awaiting verification**; it does not by itself prove an integration failure. Once matching activity exists, investigate a missing or incorrect receipt. Agree monitoring checkpoints with your AM based on campaign delivery and event volume.

### If a check fails

| Symptom | First checks |
| --- | --- |
| Clicks in RevoSurge, install organic in AppsFlyer | Tracker route, platform App ID, AdWave MMP source; then attribution settings with your AM |
| AppsFlyer credits RevoSurge, but no install reaches RevoSurge | Correct PID, saved activation and default install postback; ask your AM to investigate delivery/access restrictions |
| Install arrives, target event does not | Actual source event reaches AppsFlyer; postbacks ON; exact destination name and saved mapping |
| Event arrives without money | Source amount/currency and Values & revenue setting |
| iOS differs unexpectedly | iOS attribution/privacy requirements with the responsible owner |
| Reports differ | Same app, PID, dates, timezone, windows, sending scope and ID dimensions |
| A documented setting is missing | AM-confirmed PID and supported configuration; leave the check unresolved |

After app/platform, mapping, landing-route, attribution/privacy, partner-activation or permission changes, repeat the configuration checks and verify the next matching real campaign activity.

**Reference:** [Parameters & reporting](/en/mmp/appsflyer/parameters-reporting). For more detail, see [postback settings](/en/mmp/appsflyer/postbacks), [click forwarding](/en/mmp/appsflyer/click-forwarding), [permissions](/en/mmp/appsflyer/permissions) and [validation checks](/en/mmp/appsflyer/validation).
