---
title: adflow.js Quick Integration
description: Add a script and iframe ad slots to a website. The SDK handles bidding and renders ads automatically. It supports Banner, Pop, Push, In-page Push, and Native.
---

# adflow.js Quick Integration {#adflow-sdk}

adflow.js is a self-contained JavaScript SDK that encapsulates all Prebid.js S2S bidding logic into a single script. Publishers only need to include one `<script>` tag and place `<iframe>` tags at ad positions — no need to manually load Prebid.js or write any bidding code. It supports five ad types — **Banner**, **Pop** (popunder), **Push** (push notification), **In-page Push** (centered popup), and **Native** (inline card) — selected via the `data-ad-type` attribute on each ad slot.

[Banner Debugger](/en/adflow/banner-debugger) · [Pop Debugger](/en/adflow/pop-debugger) · [Push Debugger](/en/adflow/push-debugger) · [In-page Push Debugger](/en/adflow/inpage-push-debugger) · [Native Debugger](/en/adflow/native-debugger)

::: tip Recommended
If you want the fastest and simplest integration, adflow.js is the best choice. No need to understand Prebid.js configuration details — just two lines of HTML to get started.
:::

## Usage {#adflow-usage}

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

## Ad Types {#adflow-ad-types}

adflow.js supports five ad types. The script integration is identical for all of them — the only difference is the `data-ad-type` attribute on the ad slot `<iframe>`.

### Banner (default) {#adflow-type-banner}

A standard in-page banner. The winning creative renders directly inside the `<iframe>`. When `data-ad-type` is omitted the slot is a Banner; set its size with `width` / `height`.

```html
<iframe data-adflow-ad
    data-placement-id="your-placement-id"
    width="300" height="250"></iframe>
```

### Pop (popunder) {#adflow-type-pop}

Add `data-ad-type="pop"`. A Pop ad has **no in-page creative**: after the auction, the winning ad opens in a background ("popunder") window on the user's **first click anywhere on the page** — browsers require `window.open()` to run inside a user gesture — and it fires only once per page. A Pop slot needs no `width` / `height`.

```html
<iframe data-adflow-ad
    data-placement-id="your-placement-id"
    data-ad-type="pop"></iframe>
```

[Pop Debugger](/en/adflow/pop-debugger)

### Push (push notification) {#adflow-type-push}

Add `data-ad-type="push"`. A Push ad also has **no in-page creative**; instead it surfaces as a real browser notification via the `Notification API` (title, body, and icon come from the creative, and clicking it opens the landing page). It requires the user to **grant notification permission** (browsers only prompt from a user gesture in a secure HTTPS context). A Push slot needs no `width` / `height` — the notification icon is always requested at 192×192.

```html
<iframe data-adflow-ad
    data-placement-id="your-placement-id"
    data-ad-type="push"></iframe>
```

[Push Debugger](/en/adflow/push-debugger)

::: info Disable the notification
Push ads pop a browser notification by default. To receive the bid without showing a notification, add `data-push-notification="false"` to the `<script>` tag.
:::

### In-page Push (centered popup) {#adflow-type-inpage-push}

Add `data-ad-type="inpage-push"`. The auction request is identical to Push (a native creative with image + title + body), but it shows **no system notification and needs no permission**: on a win, adflow.js renders a popup card **centered on the page** — image full-width on top, title and body below, with a close button in the corner. Clicking the card opens the landing page. `width` / `height` set the requested image size, defaulting to **492×328**.

```html
<iframe data-adflow-ad
    data-placement-id="your-placement-id"
    data-ad-type="inpage-push"
    width="492" height="328"></iframe>
```

[In-page Push Debugger](/en/adflow/inpage-push-debugger)

### Native (inline card) {#adflow-type-native}

Add `data-ad-type="native"`. The auction request is the same native creative as Push (image + title + body), but the ad **renders inline at the slot's position** instead of popping up: on a win, adflow.js inserts a card — image on top, title and body below, **no close button** — right where the `<iframe>` slot sits in your page flow, blending with the surrounding content. Clicking the card opens the landing page. No notification permission is needed. `width` / `height` set the requested image size, defaulting to **492×328**.

```html
<iframe data-adflow-ad
    data-placement-id="your-placement-id"
    data-ad-type="native"
    width="492" height="328"></iframe>
```

[Native Debugger](/en/adflow/native-debugger)

## Script Attributes {#adflow-script-attrs}

The following data attributes are supported on the `<script>` tag:

| Attribute | Required | Default | Description |
| --- | --- | --- | --- |
| `data-server-url` | Optional | `https://prebid-server.revosurge.com` | Prebid Server URL |
| `data-account-id` | Required | — | Account ID |
| `data-bidder` | Optional | `revosurge` | Bidder name |
| `data-timeout` | Optional | `3000` | S2S timeout in milliseconds |
| `data-prebid-url` | Optional | jsdelivr CDN | Custom Prebid.js URL |
| `data-debug` | Optional | — | Enable debug mode (presence attribute, no value needed) |
| `data-push-notification` | Optional | `true` | Whether a Push ad pops a browser notification when it wins; set to `false` to disable |

## Ad Slot Attributes {#adflow-iframe-attrs}

The following data attributes are supported on the `<iframe>` tag:

| Attribute | Required | Default | Description |
| --- | --- | --- | --- |
| `data-adflow-ad` | Required | — | Marks this element as an ad slot (no value needed) |
| `data-placement-id` | Required | — | Ad placement ID, obtained from the AdFlow dashboard |
| `data-ad-type` | Optional | `banner` | Ad type: `banner` (default), `pop` (popunder), `push` (push notification), `inpage-push` (centered popup), or `native` (inline card) |
| `width` | Optional | `300` / `492` | Ad slot width in pixels. Creative size for `banner` (default 300); requested image width for `inpage-push` / `native` (default 492) |
| `height` | Optional | `250` / `328` | Ad slot height in pixels. Creative size for `banner` (default 250); requested image height for `inpage-push` / `native` (default 328) |
| `data-adflow-responsive` | Optional | — | Set to `1` so the iframe stretches to `width: 100%` of **your** parent container. You must provide and style that wrapper (see [Responsive layout](#adflow-responsive)) |
| `data-deal-id` | Optional | — | Preferred Deal ID |

## Responsive layout {#adflow-responsive}

`data-adflow-responsive="1"` only changes how the `<iframe>` is sized in the page: it fills the **width** of its parent element. AdFlow does **not** create an outer layout box for you. You are responsible for wrapping the iframe in a container (for example a `<div>`) and applying CSS for width, height, max-width, centering, and breakpoints so the slot matches your design.

Keep the `width` and `height` attributes on the iframe so the SDK can request the correct creative size; the wrapper controls how much horizontal space the slot occupies on screen.

**Fixed-size slot (e.g. 728×90)**

```html
<style>
.your-ad-slot {
    width: 728px;
    height: 90px;
}
</style>
<div class="your-ad-slot">
    <iframe data-adflow-ad
        data-placement-id="your-placement-id"
        data-adflow-responsive="1"
        width="728"
        height="90"></iframe>
</div>
```

**Fluid width with a max width**

```html
<style>
.your-ad-slot {
    width: 100%;
    max-width: 728px;
    height: 90px;
    margin: 0 auto;
}
</style>
<div class="your-ad-slot">
    <iframe data-adflow-ad
        data-placement-id="your-placement-id"
        data-adflow-responsive="1"
        width="728"
        height="90"></iframe>
</div>
```

## Full Example {#adflow-example}

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

    <!-- Pop ad (no width/height needed) -->
    <iframe data-adflow-ad
        data-placement-id="placement-4"
        data-ad-type="pop"></iframe>

    <!-- Push notification ad (no width/height needed) -->
    <iframe data-adflow-ad
        data-placement-id="placement-5"
        data-ad-type="push"></iframe>

    <!-- In-page Push ad (width/height optional, default 492×328) -->
    <iframe data-adflow-ad
        data-placement-id="placement-6"
        data-ad-type="inpage-push"></iframe>

    <!-- Native ad (card renders inline at this position; width/height optional, default 492×328) -->
    <iframe data-adflow-ad
        data-placement-id="placement-7"
        data-ad-type="native"></iframe>
</body>
</html>
```

::: info Debugging
Add the `data-debug` attribute to the `<script>` tag to view detailed `[AdFlow]` prefixed logs in the browser console. You can also inspect runtime configuration and slot info via the `window.__adflow` object.
:::

Installation check did not find your request? Follow the [Installation Check Troubleshooting](./install-check-qa) steps.

## Diagnostic Script {#adflow-diagnostic}

If you encounter issues with adflow.js, run the following diagnostic script in your browser's developer console (DevTools → Console) to quickly identify common problems:

```js
fetch('https://assets.revosurge.com/js/adflow.diagnostic.js').then(r=>r.text()).then(eval)
```

The diagnostic script will check your integration setup and output actionable suggestions directly in the console.
