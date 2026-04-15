---
title: Publisher Integration Guide
description: Integrate adflow.js or Prebid S2S to place ads. adflow.js or S2S step-by-step guide.
---

# Publisher Integration Guide

This guide covers how to integrate ads into your website. We offer two integration approaches: [adflow.js Quick Integration](#adflow-sdk) (recommended, simplest) and [S2S Configuration](#s2s-integration) (manual setup, more flexible).

## Integration Modes Comparison

| Dimension | adflow.js Quick Integration | S2S Configuration |
| --- | --- | --- |
| **Complexity** | Minimal — just 2 lines of HTML | Moderate — requires JS coding |
| **Prebid.js Knowledge** | Not required | Required |
| **Ad Formats** | Banner | Banner / Video / Native / Multi-Format |
| **Rendering** | Automatic iframe rendering | Full control, custom rendering supported |
| **Configuration** | HTML data attributes | Full Prebid.js config API |
| **Preferred Deal** | Supported | Supported |
| **Advanced Features** | Basic configuration | Price Granularity, User Sync, First Party Data, etc. |
| **Recommended For** | Quick launch, simple pages, no frontend dev resources | Production environments, complex requirements, fine-grained control |

## adflow.js Quick Integration {#adflow-sdk}

adflow.js is a self-contained JavaScript SDK that encapsulates all Prebid.js S2S bidding logic into a single script. Publishers only need to include one `<script>` tag and place `<iframe>` tags at ad positions — no need to manually load Prebid.js or write any bidding code.

[adflow.js Debugger](/en/adflow/adflowjs-debugger)

::: tip Recommended
If you want the fastest and simplest integration, adflow.js is the best choice. No need to understand Prebid.js configuration details — just two lines of HTML to get started.
:::

### Usage {#adflow-usage}

Integration requires just two steps:

**1. Include the adflow.js Script**

Add a `<script>` tag to your page with global configuration via data attributes:

```html
<script src="https://assets.revosurge.com/js/adflow.min.js"
    data-account-id="your-account-id"></script>
```

**2. Place Ad Slots**

Add `<iframe>` tags where you want ads to appear:

```html
<iframe data-adflow-ad
    data-placement-id="your-placement-id"
    width="300" height="250"></iframe>
```

adflow.js automatically handles the entire flow: Load Prebid.js → Configure S2S → Discover ad slots on the page → Run auction → Render winning ads.

### Script Attributes {#adflow-script-attrs}

The following data attributes are supported on the `<script>` tag:

| Attribute | Required | Default | Description |
| --- | --- | --- | --- |
| `data-server-url` | Optional | `https://prebid-server.revosurge.com` | Prebid Server URL |
| `data-account-id` | Required | — | Account ID |
| `data-bidder` | Optional | `revosurge` | Bidder name |
| `data-timeout` | Optional | `3000` | S2S timeout in milliseconds |
| `data-prebid-url` | Optional | jsdelivr CDN | Custom Prebid.js URL |
| `data-debug` | Optional | — | Enable debug mode (presence attribute, no value needed) |

### Ad Slot Attributes {#adflow-iframe-attrs}

The following data attributes are supported on the `<iframe>` tag:

| Attribute | Required | Default | Description |
| --- | --- | --- | --- |
| `data-adflow-ad` | Required | — | Marks this element as an ad slot (no value needed) |
| `data-placement-id` | Required | — | Ad placement ID, obtained from the AdFlow dashboard |
| `width` | Optional | `300` | Ad slot width in pixels |
| `height` | Optional | `250` | Ad slot height in pixels |
| `data-adflow-responsive` | Optional | — | Set to `1` to enable auto width (`width: 100%`) on the iframe for responsive layouts |
| `data-deal-id` | Optional | — | Preferred Deal ID |

### Full Example {#adflow-example}

::: tip
Below is a minimal complete page example that you can copy and use directly.
:::

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
    <script src="https://assets.revosurge.com/js/adflow.min.js"
        data-account-id="your-account-id"></script>
</head>
<body>
    <h1>My Website</h1>

    <!-- 300x250 Ad Slot -->
    <iframe data-adflow-ad
        data-placement-id="placement-1"
        width="300" height="250"></iframe>

    <!-- 728x90 Ad Slot -->
    <iframe data-adflow-ad
        data-placement-id="placement-2"
        width="728" height="90"></iframe>

    <!-- Ad Slot with Preferred Deal -->
    <iframe data-adflow-ad
        data-placement-id="placement-3"
        data-deal-id="deal-001"
        width="970" height="250"></iframe>
</body>
</html>
```

::: info Debugging
Add the `data-debug` attribute to the `<script>` tag to view detailed `[AdFlow]` prefixed logs in the browser console. You can also inspect runtime configuration and slot info via the `window.__adflow` object.
:::

### Diagnostic Script {#adflow-diagnostic}

If you encounter issues with adflow.js, run the following diagnostic script in your browser's developer console (DevTools → Console) to quickly identify common problems:

```js
fetch('https://assets.revosurge.com/js/adflow.diagnostic.js').then(r=>r.text()).then(eval)
```

The diagnostic script will check your integration setup and output actionable suggestions directly in the console.

## adflow-tma.js (Telegram Mini App) {#adflow-tma-sdk}

adflow-tma.js is a purpose-built ad SDK for **Telegram Mini Apps (TMA)**. It uses the same Prebid.js S2S bidding engine as adflow.js, adapted for the Telegram WebApp environment: platform and device signals are read from `Telegram.WebApp`, cookie syncing is disabled (not applicable inside TMA), and ad link clicks are intercepted and forwarded through `Telegram.WebApp.openLink()`.

::: tip Zero dependencies
adflow-tma.js automatically loads `telegram-web-app.js` if it is not already present — no separate script tag required.
:::

### Usage {#adflow-tma-usage}

Integration requires two steps:

**1. Include adflow-tma.js**

Add the script tag with your account ID:

```html
<script src="https://assets.revosurge.com/js/adflow-tma.min.js"
    data-account-id="your-account-id"></script>
```

**2. Place Ad Slots**

Add `<iframe>` tags where you want ads to appear:

```html
<iframe data-adflow-ad
    data-placement-id="your-placement-id"
    width="320" height="50"></iframe>
```

### Script Attributes {#adflow-tma-script-attrs}

The following data attributes are supported on the `<script>` tag:

| Attribute | Required | Default | Description |
| --- | --- | --- | --- |
| `data-account-id` | Required | — | Account ID |
| `data-server-url` | Optional | `https://prebid-server.revosurge.com` | Prebid Server URL |
| `data-bidder` | Optional | `revosurge` | Bidder name |
| `data-timeout` | Optional | `3000` | S2S timeout in milliseconds |
| `data-prebid-url` | Optional | jsdelivr CDN | Custom Prebid.js URL |
| `data-debug` | Optional | — | Enable debug mode (presence attribute, no value needed) |

### Ad Slot Attributes {#adflow-tma-iframe-attrs}

The following data attributes are supported on the `<iframe>` tag:

| Attribute | Required | Default | Description |
| --- | --- | --- | --- |
| `data-adflow-ad` | Required | — | Marks this element as an ad slot (no value needed) |
| `data-placement-id` | Required | — | Ad placement ID, obtained from the AdFlow dashboard |
| `data-floor` | Optional | — | Per-slot bid floor. Valid numeric values are sent as `ortb2Imp.bidfloor`. |
| `data-deal-id` | Optional | — | Preferred Deal ID |
| `width` | Optional | `320` | Ad slot width in pixels |
| `height` | Optional | `50` | Ad slot height in pixels |
| `data-adflow-responsive` | Optional | — | Set to `1` to enable auto width (`width: 100%`) on the iframe for responsive layouts |

### Full Example {#adflow-tma-example}

::: tip
Below is a minimal complete Telegram Mini App page that you can copy and use directly.
:::

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Telegram Mini App</title>
    <script src="https://assets.revosurge.com/js/adflow-tma.min.js"
        data-account-id="your-account-id"></script>
</head>
<body>
    <h1>My Mini App</h1>

    <!-- 320x50 Banner Ad -->
    <iframe data-adflow-ad
        data-placement-id="placement-1"
        width="320" height="50"></iframe>

    <!-- 300x250 Rectangle Ad -->
    <iframe data-adflow-ad
        data-placement-id="placement-2"
        width="300" height="250"></iframe>
</body>
</html>
```

::: info Debugging
Add the `data-debug` attribute to the `<script>` tag to view detailed `[AdFlow TMA]` prefixed logs in the browser console. You can also inspect runtime configuration and discovered slots via `window.__adflowTMA`.
:::

### Usage with tma.js SDK / @telegram-apps Packages {#adflow-tma-tmajssdk}

For Mini Apps built with the **tma.js ecosystem** (`@telegram-apps/sdk`, `@telegram-apps/sdk-react`, or `@telegram-apps/sdk-vue`), use **adflow-tma-modern.js** — a UMD/ESM module that accepts tma.js SDK values directly via a programmatic API. No script-tag injection or DOM-scanning workarounds needed.

::: tip Download
`adflow-tma-modern.js` is a separate file from `adflow-tma.js`. Reference it from `https://assets.revosurge.com/js/adflow-tma-modern.js` or import it as a local module in your bundler project.
:::

Call `AdFlow.init()` once (typically at app root), then call `AdFlow.requestAds()` after your component mounts with a list of slot descriptors.

#### init() Parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `accountId` | Required | string | Your AdFlow account ID |
| `serverUrl` | Optional | string | Prebid Server URL (default: `https://prebid-server.revosurge.com`) |
| `platform` | Optional | string | From `miniApp.platform()`. e.g. `'ios'`, `'android'` |
| `user` | Optional | object | From `initData.user()`. Used for targeting and frequency capping. |
| `onReady` | Optional | function | Called once after init. Pass `() => miniApp.ready()`. |
| `openLink` | Optional | function | Called when a user clicks an ad link. Pass `openLink` from the SDK. |
| `timeout` | Optional | number | Auction timeout in ms (default: `3000`) |
| `debug` | Optional | boolean | Enable verbose `[AdFlow]` logs in the console |

#### requestAds() Slot Descriptor

| Field | Required | Type | Description |
| --- | --- | --- | --- |
| `el` | Required | HTMLElement | Container element. AdFlow creates and injects an `<iframe>` into it. |
| `placementId` | Required | string | Ad placement ID from the AdFlow dashboard |
| `width` | Optional | number | Ad width in pixels (default: `320`) |
| `height` | Optional | number | Ad height in pixels (default: `50`) |
| `floor` | Optional | number | Bid floor in USD, sent as `ortb2Imp.bidfloor` |
| `dealId` | Optional | string | Preferred Deal ID |

#### React

```js
import { useEffect, useRef } from 'react';
import AdFlow from 'adflow-tma-modern.js';
import { miniApp, initData, openLink } from '@telegram-apps/sdk-react';

function AdBanner({ placementId, width = 320, height = 50 }) {
  const containerRef = useRef(null);

  useEffect(function() {
    AdFlow.init({
      accountId: 'your-account-id',
      platform:  miniApp.platform(),
      user:      initData.user(),
      onReady:   () => miniApp.ready(),
      openLink:  openLink,
    });

    AdFlow.requestAds([{
      el:          containerRef.current,
      placementId: placementId,
      width:       width,
      height:      height,
    }]);
  }, []);

  return <div ref={containerRef} style={{ width, height }} />;
}
```

::: info
`AdFlow.init()` is idempotent — safe to call multiple times. Prefer calling it once at your app root so individual `AdBanner` components only need `requestAds()`.
:::

#### Vue 3

```vue
<template>
  <div ref="adContainer" :style="{ width: width + 'px', height: height + 'px' }" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AdFlow from 'adflow-tma-modern.js';
import { miniApp, initData, openLink } from '@telegram-apps/sdk-vue';

const props = defineProps({ placementId: String, width: { default: 320 }, height: { default: 50 } });
const adContainer = ref(null);

onMounted(function() {
  AdFlow.init({
    accountId: 'your-account-id',
    platform:  miniApp.platform(),
    user:      initData.user(),
    onReady:   () => miniApp.ready(),
    openLink:  openLink,
  });

  AdFlow.requestAds([{
    el:          adContainer.value,
    placementId: props.placementId,
    width:       props.width,
    height:      props.height,
  }]);
});
</script>
```

## S2S Configuration {#s2s-integration}

For more granular control, or if you need to customize Prebid.js configuration (ad formats, first-party data, user sync, etc.), use the manual S2S configuration approach. This requires including Prebid.js on your page and writing bidding code.

[S2S Debugger](/en/adflow/s2s-debugger)

### Quick Start {#quick-start}

#### Prerequisites

- An AdFlow account with bid parameters obtained
- A deployed website with pages available for ad placement

#### Step-by-Step Integration

**1. Include Prebid.js**

Load Prebid.js in your page's `<head>`. It's recommended to use a custom build (containing only the Bidder Adapters you need) to reduce file size.

```html
<!-- Option 1: CDN (for testing only, includes all adapters) -->
<script async src="https://cdn.jsdelivr.net/npm/prebid.js@latest/dist/not-for-prod/prebid.js"></script>

<!-- Option 2: Custom build (recommended for production) -->
<!-- Download from https://docs.prebid.org/download.html -->
<script async src="/js/prebid.js"></script>
```

**2. Define Ad Slots**

Place ad containers on your page. The `id` must match the `code` in the Prebid.js configuration.

```html
<!-- Ad containers -->
<div id="ad-slot-1"></div>
<div id="ad-slot-2"></div>
```

**3. Configure Prebid.js**

Initialize Prebid.js and add Ad Units. Replace `placementId` with the value obtained from your AdFlow dashboard.

```js
var pbjs = pbjs || {};
pbjs.que = pbjs.que || [];

pbjs.que.push(function() {
    var adUnits = [{
        code: 'ad-slot-1',          // Matches the div id on the page
        mediaTypes: {
            banner: {
                sizes: [[300, 250], [336, 280]]
            }
        },
        bids: [{
            bidder: 'revosurge',
            params: {
                placementId: 'your-placement-id'  // Replace with your Placement ID
            }
        }]
    }];

    pbjs.addAdUnits(adUnits);

    pbjs.requestBids({
        timeout: 2000,
        bidsBackHandler: function() {
            // Bidding complete, send to ad server
            sendAdServerRequest();
        }
    });
});
```

**4. Render Ads**

After bidding completes, render the winning ad onto the page.

```js
function sendAdServerRequest() {
    // If using GAM, refer to the "Ad Server Integration" section
    // Below is a simple rendering approach without an ad server
    var adSlots = ['ad-slot-1'];

    adSlots.forEach(function(slotId) {
        var highestBid = pbjs.getHighestCpmBids(slotId)[0];
        if (highestBid) {
            // Fire nurl callback to notify ad server of win
            if (highestBid.nurl) {
                var nurlWithPrice = highestBid.nurl.replace('${AUCTION_PRICE}', highestBid.cpm || 0);
                fetch(nurlWithPrice, { method: 'GET' }).catch(function() {});
            }

            var adContainer = document.getElementById(slotId);
            var iframe = document.createElement('iframe');
            iframe.style.cssText = 'border:0;width:' + highestBid.width + 'px;height:' + highestBid.height + 'px;';
            adContainer.appendChild(iframe);
            var iframeDoc = iframe.contentWindow.document;
            iframeDoc.write(highestBid.ad);
            iframeDoc.close();
        }
    });
}
```

#### Full Example {#full-example}

::: tip
Below is a minimal complete page example that you can copy and use directly.
:::

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
    <script async src="https://cdn.jsdelivr.net/npm/prebid.js@latest/dist/not-for-prod/prebid.js"></script>
    <script>
        var pbjs = pbjs || {};
        pbjs.que = pbjs.que || [];

        pbjs.que.push(function() {
            pbjs.addAdUnits([{
                code: 'ad-slot-1',
                mediaTypes: {
                    banner: { sizes: [[300, 250]] }
                },
                bids: [{
                    bidder: 'revosurge',
                    params: { placementId: 'your-placement-id' }
                }]
            }]);

            pbjs.requestBids({
                timeout: 2000,
                bidsBackHandler: function() {
                    var bid = pbjs.getHighestCpmBids('ad-slot-1')[0];
                    if (bid) {
                        // Fire nurl to notify ad server
                        if (bid.nurl) {
                            fetch(bid.nurl.replace('${AUCTION_PRICE}', bid.cpm || 0)).catch(function() {});
                        }
                        var el = document.getElementById('ad-slot-1');
                        var f = document.createElement('iframe');
                        f.width = bid.width;
                        f.height = bid.height;
                        f.style.border = 'none';
                        el.appendChild(f);
                        f.contentWindow.document.write(bid.ad);
                        f.contentWindow.document.close();
                    }
                }
            });
        });
    </script>
</head>
<body>
    <h1>My Website</h1>
    <div id="ad-slot-1"></div>
</body>
</html>
```

### Ad Unit Configuration {#ad-units}

Prebid.js supports multiple ad formats. Below are the formats supported by the Revosurge Bidder and their configuration.

#### Banner Ads {#banner}

The most common ad format, suitable for fixed-size display ads.

```js
{
    code: 'banner-slot',
    mediaTypes: {
        banner: {
            sizes: [
                [300, 250],   // Medium Rectangle
                [336, 280],   // Large Rectangle
                [728, 90],    // Leaderboard
                [970, 250]    // Billboard
            ]
        }
    },
    bids: [{
        bidder: 'revosurge',
        params: {
            placementId: 'your-placement-id'
        }
    }]
}
```

#### Video Ads {#video}

Suitable for Outstream or Instream video ads.

```js
{
    code: 'video-slot',
    mediaTypes: {
        video: {
            playerSize: [640, 480],
            context: 'outstream',        // 'outstream' or 'instream'
            mimes: ['video/mp4', 'video/webm'],
            protocols: [1, 2, 3, 4, 5, 6],
            playbackmethod: [2],          // Auto-play muted
            maxduration: 30
        }
    },
    bids: [{
        bidder: 'revosurge',
        params: {
            placementId: 'your-video-placement-id'
        }
    }]
}
```

#### Native Ads {#native}

Native ads blend with your page content style, providing a better user experience.

```js
{
    code: 'native-slot',
    mediaTypes: {
        native: {
            title:   { required: true, len: 80 },
            body:    { required: true, len: 200 },
            image:   { required: true, sizes: [300, 250] },
            icon:    { required: false, sizes: [50, 50] },
            cta:     { required: false },
            sponsoredBy: { required: true }
        }
    },
    bids: [{
        bidder: 'revosurge',
        params: {
            placementId: 'your-native-placement-id'
        }
    }]
}
```

#### Multi-Format Ads {#multi-format}

A single ad slot supports multiple formats, letting the system choose the optimal ad type.

```js
{
    code: 'multi-format-slot',
    mediaTypes: {
        banner: { sizes: [[300, 250]] },
        video:  {
            playerSize: [300, 250],
            context: 'outstream',
            mimes: ['video/mp4']
        }
    },
    bids: [{
        bidder: 'revosurge',
        params: {
            placementId: 'your-multi-format-placement-id'
        }
    }]
}
```

### Server-to-Server (S2S) Mode {#s2s-config}

#### S2S Overview {#s2s-overview}

In S2S mode, Prebid.js no longer sends requests directly from the browser to each Bidder. Instead, requests are sent to the Prebid Server, which handles bidding on the server side. Benefits include:

- **Better page performance** — Fewer HTTP requests from the browser
- **Lower latency** — Server-side network is faster than client-side
- **Better privacy compliance** — Less client-side data transmission

#### S2S Setup {#s2s-setup}

```js
pbjs.que.push(function() {
    pbjs.setConfig({
        s2sConfig: {
            accountId: 'your-account-id',
            bidders: ['revosurge'],
            adapter: 'prebidServer',
            enabled: true,
            endpoint: 'https://prebid-server.revosurge.com/openrtb2/auction',
            syncEndpoint: 'https://prebid-server.revosurge.com/cookie_sync',
            timeout: 3000
        }
    });
});
```

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `accountId` | String | Required | Account ID assigned by Revosurge |
| `bidders` | Array | Required | List of Bidders to use via S2S |
| `adapter` | String | Required | Must be `'prebidServer'` |
| `enabled` | Boolean | Required | Set to `true` to enable S2S |
| `endpoint` | String | Required | Prebid Server Auction endpoint |
| `syncEndpoint` | String | Optional | Cookie Sync endpoint |
| `timeout` | Number | Optional | S2S request timeout in milliseconds, default `1000` |

::: info
In S2S mode, the Ad Unit `bids` configuration remains the same. Prebid.js will automatically forward requests for Bidders listed in `s2sConfig.bidders` to Prebid Server.
:::

### Ad Server Integration (GAM) {#s2s-gam}

If the publisher uses Google Ad Manager (GAM) to manage inventory, the recommended pattern is Prebid.js + S2S + GPT. Revosurge still participates through `s2sConfig`, then Prebid writes price key-values into GPT, and GAM decides which line item finally serves.

Flow:

1. Load GPT and Prebid.js, then define the GAM slot on the page.
2. Call `disableInitialLoad()` in GPT so the slot does not request too early.
3. Configure Revosurge through `pbjs.setConfig({ s2sConfig })`.
4. After bidding completes, call `pbjs.setTargetingForGPTAsync()` to write header bidding keys.
5. Finally call `googletag.pubads().refresh()` so GAM can return the final ad.

#### Example: Prebid S2S + GAM Managed

```html
<!DOCTYPE html>
<html>
<head>
    <title>Prebid S2S + GAM</title>
    <script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"></script>
    <script async src="/js/prebid.js"></script>
</head>
<body>
    <div id="div-gpt-ad-1" style="min-width:300px;min-height:250px;"></div>

    <script>
        var PREBID_TIMEOUT = 3000;
        var FAILSAFE_TIMEOUT = 4000;

        window.googletag = window.googletag || { cmd: [] };
        window.pbjs = window.pbjs || {};
        pbjs.que = pbjs.que || [];

        var adUnits = [{
            code: 'div-gpt-ad-1',
            mediaTypes: {
                banner: {
                    sizes: [[300, 250]]
                }
            },
            bids: [{
                bidder: 'revosurge',
                params: {
                    placementId: 'your-placement-id'
                }
            }]
        }];

        googletag.cmd.push(function() {
            googletag.defineSlot('/1234567/example/banner', [[300, 250]], 'div-gpt-ad-1')
                .addService(googletag.pubads());

            googletag.pubads().disableInitialLoad();
            googletag.enableServices();
        });

        pbjs.que.push(function() {
            pbjs.setConfig({
                s2sConfig: {
                    accountId: 'your-account-id',
                    bidders: ['revosurge'],
                    adapter: 'prebidServer',
                    enabled: true,
                    endpoint: 'https://prebid-server.revosurge.com/openrtb2/auction',
                    syncEndpoint: 'https://prebid-server.revosurge.com/cookie_sync',
                    timeout: PREBID_TIMEOUT
                },
                userSync: {
                    iframeEnabled: true,
                    pixelEnabled: true
                }
            });

            pbjs.addAdUnits(adUnits);

            pbjs.requestBids({
                timeout: PREBID_TIMEOUT,
                bidsBackHandler: sendAdServerRequest
            });
        });

        function sendAdServerRequest() {
            if (sendAdServerRequest.called) return;
            sendAdServerRequest.called = true;

            googletag.cmd.push(function() {
                pbjs.que.push(function() {
                    pbjs.setTargetingForGPTAsync(['div-gpt-ad-1']);
                    googletag.pubads().refresh();
                });
            });
        }

        setTimeout(sendAdServerRequest, FAILSAFE_TIMEOUT);
    </script>
</body>
</html>
```

### Bid Parameters {#bidder-params}

The Revosurge Bidder supports the following parameters:

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `placementId` | String | Required | Ad placement ID, obtained after creating a placement in the AdFlow dashboard |

Example:

```js
bids: [{
    bidder: 'revosurge',
    params: {
        placementId: 'abc123'
    }
}]
```

### Preferred Deal {#preferred-deal}

#### Overview {#deal-overview}

Preferred Deal is a private programmatic buying arrangement (PMP - Private Marketplace) that allows publishers to establish priority trading agreements with specific advertisers or buyers. After configuring Preferred Deals in Prebid.js, the system will prioritize matching these private deals while still participating in open auctions.

::: tip Benefits
Preferred Deals typically yield higher CPM while ensuring ad quality and brand safety.
:::

#### Configuration Methods {#deal-methods}

Prebid.js supports two methods for configuring Preferred Deals:

**Method 1: Add dealId to Bidder Params (Simple Method)**

Add the `dealId` parameter directly in the `params` of `bids`:

```js
bids: [{
    bidder: 'revosurge',
    params: {
        placementId: 'your-placement-id',
        dealId: 'your-preferred-deal-id'  // Add Deal ID
    }
}]
```

**Method 2: Use ortb2Imp to Configure PMP**

Use the OpenRTB standard `ortb2Imp.pmp` object for configuration, supporting richer parameters and multiple deals:

```js
{
    code: 'ad-slot-1',
    mediaTypes: {
        banner: {
            sizes: [[300, 250], [336, 280]]
        }
    },
    bids: [{
        bidder: 'revosurge',
        params: {
            placementId: 'your-placement-id'
        }
    }],
    ortb2Imp: {
        pmp: {
            private_auction: 0,  // 0=allow open auction, 1=private deals only
            deals: [{
                id: 'deal-12345',           // Deal ID (required)
                bidfloor: 5.0,              // Floor price (optional)
                bidfloorcur: 'USD',         // Floor currency (optional)
                at: 1,                      // Auction type: 1=first price, 2=second price
                wseat: ['advertiser-seat'], // Allowed buyer seats (optional)
                wadomain: ['advertiser.com'] // Allowed advertiser domains (optional)
            }]
        }
    }
}
```

**PMP Parameters**

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `deals[].id` | String | Required | Deal ID, provided by advertiser or SSP |
| `deals[].bidfloor` | Number | Optional | Floor price; bids below this will be rejected |
| `deals[].bidfloorcur` | String | Optional | Floor price currency (e.g., USD, CNY), default USD |
| `deals[].at` | Number | Optional | Auction type: 1=first price, 2=second price |
| `private_auction` | Number | Optional | 0=allow open auction, 1=private deals only, default 0 |
| `deals[].wseat` | Array | Optional | Allowed buyer seat whitelist |
| `deals[].wadomain` | Array | Optional | Allowed advertiser domain whitelist |

#### Configuration Best Practices

- **Use the ortb2Imp method** — More standardized and supports advanced features
- **Set private_auction: 0** — Allow Preferred Deals and open auctions to participate together, increasing fill rate
- **Configure multiple Deals** — Set up multiple deals for the same ad slot to increase matching opportunities
- **Set reasonable floor prices** — bidfloor should be set based on actual conditions; setting it too high will reduce fill rate
- **Combine with S2S** — Preferred Deals perform better in Server-to-Server mode

### Advanced Configuration {#advanced}

#### Price Granularity {#price-granularity}

Price granularity determines how bid amounts are rounded, affecting the number of Line Items needed and revenue precision.

```js
pbjs.setConfig({
    priceGranularity: 'medium'  // 'low' | 'medium' | 'high' | 'auto' | 'dense' | custom
});
```

| Level | Range | Increment |
| --- | --- | --- |
| `low` | $0 - $5 | $0.50 |
| `medium` | $0 - $20 | $0.10 |
| `high` | $0 - $20 | $0.01 |
| `auto` | $0 - $20 | Varies |
| `dense` | $0 - $20 | Varies (denser) |

#### Timeout Settings {#timeout}

```js
pbjs.setConfig({
    bidderTimeout: 2000   // In milliseconds, recommended 1500-3000
});
```

::: info
Setting the timeout too short may cause Bidders to not respond in time (lower bid rate). Setting it too long may affect user experience. It's recommended to set it between **1500-3000ms** based on your actual network conditions.
:::

#### User Sync {#user-sync}

User sync allows Bidders to identify users, improving bidding performance.

```js
pbjs.setConfig({
    userSync: {
        iframeEnabled: true,
        pixelEnabled: true,
        syncsPerBidder: 5,
        syncDelay: 3000,          // Delay sync 3 seconds after page load
        filterSettings: {
            iframe: {
                bidders: '*',         // Allow all bidders
                filter: 'include'
            }
        }
    }
});
```

#### First Party Data {#first-party-data}

Pass site-level or user-level first-party data to help Bidders bid more accurately:

```js
pbjs.setConfig({
    ortb2: {
        site: {
            name: 'My Website',
            domain: 'example.com',
            cat: ['IAB1'],          // Site category
            content: {
                language: 'en'
            }
        },
        user: {
            keywords: 'sports,news'
        }
    }
});
```

### Testing & Debugging {#testing}

**Enable Debug Mode**

View the complete bidding process in the browser console:

```js
pbjs.setConfig({ debug: true });
```

You can also enable it by adding a URL parameter:

```
https://your-website.com/?pbjs_debug=true
```

**Using Prebid.js Console Methods**

Use the following commands in the browser developer console to inspect the state:

```js
// View all bid responses
pbjs.getBidResponses();

// View all winning bids
pbjs.getHighestCpmBids();

// View current configuration
pbjs.getConfig();

// View Ad Units
pbjs.adUnits;
```

**Using the Test Page**

We provide an interactive test page [S2S Debugger](/en/adflow/s2s-debugger) that can be used to:

- Verify Prebid Server connectivity
- Test OpenRTB Auction requests/responses
- Test Prebid.js S2S integration
- View real-time bidding logs

**Common Checklist**

| Check Item | Description |
| --- | --- |
| Is Prebid.js loaded? | Run `pbjs.version` in the console to check the version |
| Are Ad Units configured correctly? | Check if `pbjs.adUnits` contains your defined ad slots |
| Is the Bidder responding? | Look for bid requests and responses in the Network panel |
| Is GAM Targeting set? | Check if GAM request parameters include keys like `hb_pb` |
| Is the S2S endpoint reachable? | Use the test page to verify Prebid Server connectivity |

### FAQ {#faq}

**Q: Why am I not receiving any bids?**

Common reasons:

1. `placementId` is incorrect or not activated in the AdFlow dashboard
2. Revosurge Bidder Adapter is not included in the Prebid.js build
3. Timeout is set too short (at least 2000ms recommended)
4. Network issues preventing requests from reaching the Bidder

**Q: How do I configure multiple ad slots on a page?**

Add an object for each ad slot in the `adUnits` array, with each object's `code` corresponding to a different `div id` on the page:

```js
var adUnits = [
    { code: 'top-banner',    mediaTypes: { banner: { sizes: [[728, 90]] }},  bids: [{ bidder: 'revosurge', params: { placementId: 'pid-top' }}] },
    { code: 'sidebar-ad',    mediaTypes: { banner: { sizes: [[300, 250]] }}, bids: [{ bidder: 'revosurge', params: { placementId: 'pid-side' }}] },
    { code: 'article-bottom', mediaTypes: { banner: { sizes: [[970, 250]] }}, bids: [{ bidder: 'revosurge', params: { placementId: 'pid-bottom' }}] }
];
```

**Q: How do I improve Fill Rate?**

- Add more supported ad sizes by providing additional `sizes` options
- Extend the timeout appropriately
- Enable User Sync to improve user identification rate
- Pass first-party data to help Bidders bid more accurately

**Q: Why isn't my Preferred Deal matching after configuration?**

Possible reasons:

1. **Incorrect Deal ID** — Verify that the Deal ID matches exactly what was provided by the advertiser
2. **Floor price set too high** — A `bidfloor` higher than the advertiser's bid will prevent matching
3. **Deal not activated** — Contact the advertiser to confirm the deal is activated in their system
4. **Incorrect private_auction setting** — Setting it to 1 excludes open auction; recommend setting to 0
5. **Whitelist restrictions** — Check if `wseat` or `wadomain` are configured correctly

::: tip
Enable Debug mode (`pbjs.setConfig({debug: true})`) to view detailed deal matching logs in the browser console.
:::

---

For technical support, please contact the Revosurge technical team.
