---
title: adflow-tma.js (Telegram Mini App)
description: Use the AdFlow SDK adapted to Telegram WebApp. It reads platform and device signals from Telegram, skips cookie syncing, and opens external ad links through Telegram.
---

# adflow-tma.js (Telegram Mini App) {#adflow-tma-sdk}

adflow-tma.js is a purpose-built ad SDK for **Telegram Mini Apps (TMA)**. It uses the same Prebid.js S2S bidding engine as adflow.js, adapted for the Telegram WebApp environment: platform and device signals are read from `Telegram.WebApp`, cookie syncing is disabled (not applicable inside TMA), and ad link clicks are intercepted and forwarded through `Telegram.WebApp.openLink()`.

::: tip Zero dependencies
adflow-tma.js automatically loads `telegram-web-app.js` if it is not already present — no separate script tag required.
:::

## Usage {#adflow-tma-usage}

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

## Script Attributes {#adflow-tma-script-attrs}

The following data attributes are supported on the `<script>` tag:

| Attribute | Required | Default | Description |
| --- | --- | --- | --- |
| `data-account-id` | Required | — | Account ID |
| `data-server-url` | Optional | `https://prebid-server.revosurge.com` | Prebid Server URL |
| `data-bidder` | Optional | `revosurge` | Bidder name |
| `data-timeout` | Optional | `3000` | S2S timeout in milliseconds |
| `data-prebid-url` | Optional | jsdelivr CDN | Custom Prebid.js URL |
| `data-debug` | Optional | — | Enable debug mode (presence attribute, no value needed) |

## Ad Slot Attributes {#adflow-tma-iframe-attrs}

The following data attributes are supported on the `<iframe>` tag:

| Attribute | Required | Default | Description |
| --- | --- | --- | --- |
| `data-adflow-ad` | Required | — | Marks this element as an ad slot (no value needed) |
| `data-placement-id` | Required | — | Ad placement ID, obtained from the AdFlow dashboard |
| `data-floor` | Optional | — | Per-slot bid floor. Valid numeric values are sent as `ortb2Imp.bidfloor`. |
| `data-deal-id` | Optional | — | Preferred Deal ID |
| `width` | Optional | `320` | Ad slot width in pixels |
| `height` | Optional | `50` | Ad slot height in pixels |
| `data-adflow-responsive` | Optional | — | Set to `1` so the iframe stretches to `width: 100%` of **your** parent container. You must provide and style that wrapper (see [Responsive layout](#adflow-tma-responsive)) |

## Responsive layout {#adflow-tma-responsive}

Same behavior as [adflow.js](./adflow-sdk#adflow-responsive): with `data-adflow-responsive="1"`, the iframe uses the full width of the element you wrap it in. Provide your own container and CSS; keep `width` and `height` on the iframe for the requested slot size.

```html
<style>
.your-ad-slot {
    width: 320px;
    height: 50px;
}
</style>
<div class="your-ad-slot">
    <iframe data-adflow-ad
        data-placement-id="your-placement-id"
        data-adflow-responsive="1"
        width="320"
        height="50"></iframe>
</div>
```

## Full Example {#adflow-tma-example}

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

## Usage with tma.js SDK / @telegram-apps Packages {#adflow-tma-tmajssdk}

For Mini Apps built with the **tma.js ecosystem** (`@telegram-apps/sdk`, `@telegram-apps/sdk-react`, or `@telegram-apps/sdk-vue`), use **adflow-tma-modern.js** — a UMD/ESM module that accepts tma.js SDK values directly via a programmatic API. No script-tag injection or DOM-scanning workarounds needed.

::: tip Download
`adflow-tma-modern.js` is a separate file from `adflow-tma.js`. Reference it from `https://assets.revosurge.com/js/adflow-tma-modern.js` or import it as a local module in your bundler project.
:::

Call `AdFlow.init()` once (typically at app root), then call `AdFlow.requestAds()` after your component mounts with a list of slot descriptors.

### init() Parameters

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

### requestAds() Slot Descriptor

| Field | Required | Type | Description |
| --- | --- | --- | --- |
| `el` | Required | HTMLElement | Container element. AdFlow creates and injects an `<iframe>` into it. |
| `placementId` | Required | string | Ad placement ID from the AdFlow dashboard |
| `width` | Optional | number | Ad width in pixels (default: `320`) |
| `height` | Optional | number | Ad height in pixels (default: `50`) |
| `floor` | Optional | number | Bid floor in USD, sent as `ortb2Imp.bidfloor` |
| `dealId` | Optional | string | Preferred Deal ID |

### React

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

### Vue 3

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
