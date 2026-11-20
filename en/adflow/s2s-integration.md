# Connect AdFlow S2S through Prebid.js {#s2s-integration}

If your website already runs auctions through Prebid.js, follow this guide to configure server-side bidding with AdFlow. The Banner example shows how the account, placement, and request map to one another.

## Before you start {#quick-start}

- Use a Prebid.js build that includes the Prebid Server adapter.
- Have your AdFlow account ID, an active Banner placement ID, and the placement dimensions ready.
- Confirm the HTML ad container ID. If you use GAM, identify the GPT ad unit that corresponds to the container.

## Configure server-side bidding {#s2s-config}

Add this configuration to your existing Prebid.js initialization before calling `requestBids()`. Replace the example account ID with your own.

```js
window.pbjs = window.pbjs || {};
pbjs.que = pbjs.que || [];

pbjs.que.push(function () {
  pbjs.setConfig({
    s2sConfig: {
      accountId: 'YOUR_ACCOUNT_ID',
      bidders: ['revosurge'],
      adapter: 'prebidServer',
      enabled: true,
      endpoint: 'https://prebid-server.revosurge.com/openrtb2/auction',
      timeout: 3000
    }
  });
});
```

## Add a Banner ad unit {#ad-units}

Set `code` to the HTML ad container ID and set `placementId` to the corresponding AdFlow placement ID. The example uses 300×250. Use the dimensions for your placement.

```js
pbjs.que.push(function () {
  pbjs.addAdUnits([{
    code: 'banner-slot',
    mediaTypes: {
      banner: { sizes: [[300, 250]] }
    },
    bids: [{
      bidder: 'revosurge',
      params: { placementId: 'YOUR_PLACEMENT_ID' }
    }]
  }]);
});
```

## Complete example {#full-example}

Use the server-side bidding configuration and Banner ad unit above in [Prebid’s complete S2S page example](https://docs.prebid.org/dev-docs/examples/s2s-only.html), replacing the example account, placement, and endpoint. The example renders a Banner directly through Prebid.js. If GAM selects the ad, follow the next section.

## Use your own GAM account {#s2s-gam}

If GAM decides which ad serves, follow [Your own GAM + Prebid.js](./gam-prebid) to configure GPT, price buckets, and creatives. Confirm that the Prebid.js request carries the correct AdFlow placement details, then apply the auction's targeting keys to the corresponding GAM slot.

## Check requests, bids, and impressions {#testing}

1. Trigger the target placement on the page where you deployed the configuration. In the browser's Network panel, confirm that the auction request was sent.
2. Check the placement and response. If the request was received and there is no bid, review the placement configuration, request timeout, and response, then follow [Requests are sent but no ad appears](./no-ad-display).
3. If you use GAM, check targeting keys such as `hb_pb` in the request and verify that GAM selects the correct line item and creative.
4. Follow [Verify and launch](./verify-and-launch) to check actual rendering and reporting. You can also use the [S2S Debugger](./s2s-debugger) to review the test fields and verification steps.

Verification is complete when the request, displayed ad, and reporting data correspond to the same placement. Record the request and rendering checks separately to identify where the process stops.
