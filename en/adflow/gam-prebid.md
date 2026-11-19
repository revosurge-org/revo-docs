---
title: Prebid.js + GAM
description: Pass RevoSurge S2S bids to GAM and configure creatives for five ad formats.
---

# Prebid.js + GAM

Use this integration when your website already runs a Prebid.js auction. Google Publisher Tag (GPT) passes the RevoSurge S2S bid to Google Ad Manager (GAM). GAM selects a line item using inventory and price bucket targeting and returns a creative to render the ad or confirm the winning bid.

## Website setup

1. Load GPT and a production Prebid.js build with the Prebid Server adapter. Include `nativeRendering` for Native and In-page Push.
2. Configure `s2sConfig` as described in [S2S Configuration](./s2s-integration#s2s-config). Use your AdFlow account and placement IDs. Match the Prebid `adUnit.code` to the GPT container ID and use the full GAM ad unit path.
3. Disable the initial GPT request before enabling services, register the ad unit, and call `pbjs.requestBids()`. Verify that the bid belongs to the current auction and uses the GAM currency. Call `pbjs.setTargetingForGPTAsync([slotId])` before requesting the slot with `googletag.pubads().refresh([gamSlot])`.

## GAM setup

1. Create the ad unit with the required size under **Inventory → Ad units**. Define targeting keys under **Inventory → Key-values**.
2. Create a line item under **Delivery → Orders** and target the corresponding ad unit. Match `hb_pb` to the website's `priceGranularity` and configure the corresponding CPM. Add `hb_bidder=revosurge` when the line item must match RevoSurge bids.
3. Attach a **Third party → Standard** creative. Check the order approval, active creative association, dimensions, and schedule.

| Key | Purpose |
| --- | --- |
| `hb_pb` | Matches the price bucket. Keep decimal precision, bucket values, and currency consistent with the website configuration. |
| `hb_bidder` | Matches the bidder. |
| `hb_adid` | Identifies the ad in the current auction. |
| `hb_size`, `hb_format`, `hb_ver` | Pass the size, format, and PUC version to the creative. |
| `af_push_token` | Dynamic correlation key for Push and Pop. Generate a fresh value per request. |

## Five ad formats

| Format | Example GAM size | Website configuration and GAM creative |
| --- | --- | --- |
| Banner | 300×250 | Use `mediaTypes.banner`. Prebid Universal Creative (PUC) renders the ad. |
| Native | 300×250 | Use Native ORTB, `ortb2Imp.ext.type: 'native'`, and a page-defined `adTemplate`. Native PUC renders the ad. |
| In-page Push | 492×328 | Use Native ORTB, `ortb2Imp.ext.type: 'push'`, and a page-defined `adTemplate`. Native PUC renders the ad inside the page. |
| Push | 1×1 | Use Native ORTB and `ortb2Imp.ext.type: 'push'`. GAM returns a confirmation creative and the top-level page handles browser notifications. |
| Pop | 1×1 | Use a 1×1 banner and `ortb2Imp.ext.type: 'pop'`. GAM returns a confirmation creative and a user click in the top-level page triggers the ad. |

### Banner, Native, and In-page Push

The following GAM creative assumes you send only the top bid and use a Prebid.js build that provides `hb_ver`. Native and In-page Push use `native.js`. Define `nativeTemplate` before registering an ad unit and match its asset IDs to the ORTB request.

```html
<!-- Paste into GAM Third-party creative, Standard code type.
     Requires Prebid.js >= 10.11.0 with hb_ver targeting. -->
<script src="https://cdn.jsdelivr.net/npm/prebid-universal-creative@%%PATTERN:hb_ver%%/dist/%%PATTERN:hb_format%%.js"></script>
<script>
  var ucTagData = {};
  ucTagData.adServerDomain = "";
  ucTagData.pubUrl = "%%PATTERN:url%%";
  ucTagData.targetingMap = %%PATTERN:TARGETINGMAP%%;
  ucTagData.hbPb = "%%PATTERN:hb_pb%%";
  ucTagData.requestAllAssets = true;
  ucTagData.clickUrlUnesc = "%%CLICK_URL_UNESC%%";
  try { ucTag.renderAd(document, ucTagData); }
  catch (error) { console.error(error); }
</script>
```

::: details Native ad unit example
```js
pbjs.addAdUnits([{
  code: 'native-slot-1',
  ortb2Imp: {ext: {type: 'native'}},
  mediaTypes: {native: {adTemplate: nativeTemplate, ortb: {
    ver: '1.2', context: 1, plcmttype: 1, plcmtcnt: 1,
    assets: [
      {id: 1, required: 1, title: {len: 80}},
      {id: 2, required: 1, img: {type: 3, w: 300, h: 250, wmin: 300, hmin: 250}},
      {id: 3, required: 0, data: {type: 2, len: 160}},
      {id: 4, required: 0, data: {type: 1, len: 80}},
      {id: 5, required: 0, data: {type: 12, len: 40}}
    ],
    eventtrackers: [{event: 1, methods: [1]}]
  }}},
  bids: [{bidder: 'revosurge', params: {placementId: 'YOUR_PLACEMENT_ID'}}]
}]);
```
:::

::: details In-page Push ad unit example
```js
pbjs.addAdUnits([{
  code: 'inpage-push-slot-1',
  ortb2Imp: {ext: {type: 'push'}},
  mediaTypes: {native: {adTemplate: nativeTemplate, ortb: {
    ver: '1.2', context: 1, plcmttype: 3, plcmtcnt: 1,
    assets: [
      {id: 1, required: 1, title: {len: 80}},
      {id: 2, required: 0, img: {type: 1, w: 192, h: 192}},
      {id: 3, required: 1, img: {type: 3, w: 492, h: 328, wmin: 492, hmin: 328}},
      {id: 4, required: 0, data: {type: 2, len: 160}}
    ],
    eventtrackers: [{event: 1, methods: [1]}]
  }}},
  bids: [{bidder: 'revosurge', params: {placementId: 'YOUR_PLACEMENT_ID'}}]
}]);
```
:::

### Push and Pop

Generate a random token before requesting GAM, pass it with `gamSlot.setTargeting('af_push_token', token)`, and store the valid bid for the current auction. The 1×1 creative returns the ad ID and token. Use this example in GAM and replace the publisher origin and placement ID. For Pop, use the message type `adflow-gam-pop-win`.

```html
<script>
window.top.postMessage({
  type: 'adflow-gam-push-win',
  placementId: 'YOUR_PLACEMENT_ID',
  adId: '%%PATTERN:hb_adid%%',
  token: '%%PATTERN:af_push_token%%'
}, 'https://publisher.example');
</script>
```

In your website receiver, verify that the sender belongs to the current GPT slot, the slot returned a nonempty creative, and the message type, placement ID, `adId`, and token match. Use the stored bid only after these checks pass. Request notification permission after a user action in the top-level HTTPS page, or trigger Pop on a real user click.

::: details Push ad unit example
```js
pbjs.addAdUnits([{
  code: 'push-slot-1',
  ortb2Imp: {ext: {type: 'push'}},
  mediaTypes: {native: {ortb: {
    ver: '1.2', context: 1, plcmttype: 3, plcmtcnt: 1, privacy: 1,
    assets: [
      {id: 100, required: 0, title: {len: 80}},
      {id: 400, required: 0, data: {type: 1, len: 80}},
      {id: 300, required: 0, img: {type: 1, w: 192, h: 192, wmin: 192, hmin: 192}},
      {id: 200, required: 0, img: {type: 3, w: 492, h: 328, wmin: 492, hmin: 328}}
    ]
  }}},
  bids: [{bidder: 'revosurge', params: {placementId: 'YOUR_PLACEMENT_ID'}}]
}]);
```
:::

## Verify the integration

Check the Prebid bid, GPT targeting, the line item and creative returned by GAM, and actual rendering in that order. Verify browser notification permission for Push, the user-click flow for Pop, and the templates for Native and In-page Push.

See the [Prebid GAM setup guide](https://docs.prebid.org/adops/step-by-step.html) and [PUC creative guide](https://docs.prebid.org/adops/gam-creative-banner-sbs.html) for line item and creative configuration.
