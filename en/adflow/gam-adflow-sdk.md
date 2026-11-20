---
title: GAM + adflow.js
description: Serve adflow.js creatives through GAM across five web ad formats.
---

# GAM + adflow.js

The website requests Google Ad Manager (GAM) through Google Publisher Tag (GPT). GAM selects a line item first, and `adflow.js` then requests bids. For Banner, Native, and In-page Push, `adflow.js` runs inside the GAM creative. For Push and Pop, `adflow.js` runs in the top-level page after the GAM creative confirms selection.

## GAM setup

1. Configure each slot in **Inventory → Ad units**. Record the full GPT path and size.
2. Create a line item under **Delivery → Orders**, target the corresponding ad unit, and configure the schedule and size for your delivery plan.
3. Attach a **Third party → Standard** creative. Verify the order approval and active creative association. GAM selects `adflow.js` creative through inventory targeting, so this integration needs no Prebid `hb_pb` price buckets.

| Format | Example GAM size | GAM creative and `adflow.js` placement |
| --- | --- | --- |
| Banner | 300×250 | Use `data-ad-type="banner"` inside the creative. |
| Native | 300×250 | Use `data-ad-type="native"` inside the creative. |
| In-page Push | 492×328 | Use `data-ad-type="inpage-push"` inside the creative. |
| Push | 1×1 | The creative returns a confirmation message. Use `data-ad-type="push"` in the top-level page. |
| Pop | 1×1 | The creative returns a confirmation message. Use `data-ad-type="pop"` in the top-level page. |

## Banner, Native, and In-page Push

Place a GPT container on the page and request the matching GAM ad unit. The example defines a single Banner slot. Reuse GPT initialization if the site already loads it.

```html
<script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"></script>
<div id="gam-banner-slot" style="width:300px;height:250px"></div>
<script>
window.googletag = window.googletag || { cmd: [] };
googletag.cmd.push(() => {
  googletag.defineSlot('/NETWORK_CODE/AD_UNIT_CODE', [300, 250], 'gam-banner-slot')
    .addService(googletag.pubads());
  googletag.enableServices();
  googletag.display('gam-banner-slot');
});
</script>
```

Put the following HTML in the GAM third-party creative. Replace the AdFlow account and placement IDs and adjust the type and dimensions for the format. See [adflow.js Quick Integration](./adflow-sdk) for the full list of attributes.

```html
<iframe data-adflow-ad data-placement-id="YOUR_PLACEMENT_ID" data-ad-type="banner"
        width="300" height="250" title="Advertisement" scrolling="no"
        style="border:0;display:block"></iframe>
<script src="https://assets.revosurge.com/js/adflow.min.js"
        data-account-id="YOUR_ACCOUNT_ID"></script>
```

## Push and Pop

A 1×1 GAM creative confirms that GAM selected the line item. The website initializes `adflow.js` in the top-level page after verifying that message.

1. Define `af_sdk_token` as a dynamic key under **Inventory → Key-values**. Generate a random token per GAM request and pass it with `gamSlot.setTargeting('af_sdk_token', token)`.
2. In the 1×1 GAM creative, return the token through `%%PATTERN:af_sdk_token%%`. The example uses Push. For Pop, set `adType` to `pop`. Replace the example origin with the publisher page origin.
3. Verify that the sender window belongs to the current GAM slot iframe and that the message type, ad type, placement ID, and request token match. Also wait for `slotRenderEnded` for this slot with `isEmpty === false`. Initialize `adflow.js` once both checks pass.
4. For Push, request browser notification permission following a user action in the top-level HTTPS page. After permission is granted, insert the iframe and load `adflow.js`. For Pop, load `adflow.js` in the top-level page so it can handle a real user click once it has a valid bid.

```html
<script>
window.top.postMessage({
  type: 'adflow-sdk-gam-win',
  adType: 'push',
  placementId: 'YOUR_PLACEMENT_ID',
  token: '%%PATTERN:af_sdk_token%%'
}, 'https://publisher.example');
</script>
```

## Verify the integration

Verify that GAM returned the correct line item and creative and that `adflow.js` requested an ad. Check in-page rendering, Push notifications, and Pop click behavior separately.

### Check SafeFrame

Banner, Native, and In-page Push run inside the GAM creative iframe. If SafeFrame is enabled on the creative or forced by GPT, test script loading, requests, and rendering inside that container on the live page. The 1×1 Push and Pop creative only sends confirmation to the top-level page. With SafeFrame enabled, verify that the top page still recognizes and validates the sending window. Notification permission and click handling run in the top page. Check the rendered iframe type in the [Google Publisher Console](https://developers.google.com/publisher-tag/guides/publisher-console). If the required behavior is incompatible with enforced isolation, use a format or integration verified to work with that slot.

### Distinguish GAM and AdFlow no-fill

- If `slotRenderEnded.isEmpty === true` for the slot, GAM returned no ad. Check inventory targeting, size, schedule, and creative association. If you need fallback, configure an eligible GAM fallback line item or have the page show house content or collapse the empty container according to your site policy.
- If GAM returns the expected third-party creative and the ad stays blank, check script execution, requests, responses, browser blocks, and rendering in Network and Console. After GAM selects the creative, an AdFlow no-fill does not trigger another GAM line-item selection automatically. Skip Push or Pop initialization if no valid confirmation arrives.

### Reconcile GAM and AdFlow reports

Align dates, time zones, and filters. Match the GAM ad unit, line item, and creative to the AdFlow placement, then confirm both reports cover the test window. GAM may record a third-party creative impression before AdFlow records an ad impression, for example when AdFlow has no fill or the Push or Pop trigger is unmet. Record differences and both report generation times. See [reporting discrepancies](./report-data-issues).
