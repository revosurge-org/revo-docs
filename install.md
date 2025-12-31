---
title: Install
---

# Install the Web Tracker SDK

Add the hosted script to your page and initialize the tracker with the ID assigned to you. Run these steps before sending any events.

## 1. Load the script

Place the script tag in `<head>` so the SDK loads before your business code.

```html
<script src="https://assets.revosurge.com/js/web-tracker.js"></script>
```

## 2. Initialize

Create the tracker instance as soon as the script is available. Use your own `trackerId`. The optional `env` helps you separate dev, test, and production data.

```js
const tracker = new WebTracker({
  trackerId: 'your-tracker-id',
  // env: 'prod' | 'test' | 'dev',
});
```

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| trackerId | string | Yes | The tracker identifier assigned to your project. |
| env | `'dev' \| 'test' \| 'prod'` | No | Environment flag; defaults to `prod`. Use `dev` or `test` while validating. |

