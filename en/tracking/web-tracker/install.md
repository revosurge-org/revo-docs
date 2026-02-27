---
title: Instal the Web Tracker
sidebar_label: Instal the Web Tracker
description: Install Web Tracker — create product, add script, configure events.
---

# Instal the Web Tracker

**Audience:** Developers, tracking engineers, BI/analytics owners

## Before you start
Make sure you have:
- A RevoSurge account with access to Product management
- A Product created for your website domain
- Access to your website codebase or tag manager
- A list of key events to track (e.g., Register, FirstTimeDeposit, Deposit)

## Step 1 — Create a Product (domain)
1. Go to **Product management → Products**
2. Click **Create product**
3. Enter your website domain (e.g., `www.example.com`)
4. Save

This creates the Product and assigns a **Tracker ID**.

## Step 2 — Install tracker code (Example / Draft)
> **Example / Draft (subject to change)**  
> Use the tracker snippet provided in your product's tracking settings.

```html
<script src="https://assets.revosurge.com/js/web-tracker.js"></script>
```

## Step 3 — Initialize tracker (Example / Draft)
```js
const tracker = new WebTracker({
  trackerId: "your-tracker-id",
  // env: "prod" | "test" | "dev"
});
```

## Step 4 — Send key events (Example / Draft)
```js
tracker.trackRegister("user_123", { identifier: "hashed_email_or_phone" });

tracker.trackDeposit("user_123", {
  currency: "USDT",
  network: "TRON",
  amount: 100
});
```

## Step 5 — Verify tracker & event status
Go to your tracking/status page and verify:
- **Tracker status**
  - Active / In-use: events are flowing
  - Inactive: no recent data received
- **Event status**
  - Live: can be used as campaign optimization target
  - Inactive / Not ready: insufficient or no recent event data

Once key events are Live, your Product is ready for AdWave campaigns.
