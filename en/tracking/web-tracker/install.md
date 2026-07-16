---
title: Install the Web Tracker
sidebar_label: Install the Web Tracker
description: Install the RevoSurge Web Tracker — add the script, initialize, send key events, and verify they go Live for AdWave.
---

# Install the Web Tracker

**Audience:** Developers, tracking engineers, BI / analytics owners
**Time to install:** ~15 minutes

The Web Tracker is a lightweight JavaScript SDK that streams user events from your
website to RevoSurge. Once your key events are **Live**, they become optimization
targets for AdWave campaigns and power Source Intelligence, LTV, ROAS, and churn models.

::: tip TL;DR
1. Add the [script](#step-2-add-the-tracker-script) to `<head>`.
2. [Initialize](#step-3-initialize-the-tracker) `WebTracker` with your Tracker ID in `test` mode.
3. [Fire events](#step-4-send-key-events) on register, deposit, and other key actions.
4. [Verify](#step-5-verify-then-go-live) they read **Live**, then switch to `prod`.
:::

## Before you start

Make sure you have:

- A RevoSurge account with **Product management** access
- A **Product** created for your website domain (this assigns your Tracker ID)
- Access to your website codebase or tag manager
- A list of the key events you want to track (e.g. `register`, `deposit`, `withdraw`)

::: info Don't have a Tracker ID yet?
Create one first — see [Step 1](#step-1-create-a-product-domain). Your Tracker ID
looks like `TRA-AWP-20251208-051428-001-6734` and is shown in your product's
tracking settings.
:::

## Step 1: Create a Product (domain)

1. Go to **Product → Manage Product**.
2. Create your product (enter your website domain, e.g. `www.example.com`).

This creates the Product and assigns a **Tracker ID**. You'll paste this ID into the
snippet in Step 3, or copy the pre-filled snippet from **Product → Install web tracker**.

## Step 2: Add the tracker script

Add this to the `<head>` of **every page** you want to track, as high as possible so it
loads before user actions occur.

```html
<script src="https://assets.revosurge.com/js/web-tracker.js"></script>
```

::: details Using Google Tag Manager?
Add a **Custom HTML** tag with the snippet above, set it to fire on **All Pages**, and
set the tag priority high so the tracker is ready before your event tags run.
:::

## Step 3: Initialize the tracker

Initialize once, after the script has loaded. Replace the Tracker ID with your own.

```js
const tracker = new WebTracker({
  trackerId: "your-product's-tracker-id",
  env: "test" // "prod" | "test" | "dev"
});
```

Start in `test` while you integrate — test traffic is validated and visible in your
dashboard but excluded from campaign optimization. Switch to `prod` only after your
events verify in [Step 5](#step-5-verify-then-go-live).

| `env`  | When to use it                          | Counts toward optimization? |
| ------ | --------------------------------------- | --------------------------- |
| `prod` | Live production traffic                  | Yes                         |
| `test` | Staging / QA during integration         | No                          |
| `dev`  | Local development                       | No                          |

## Step 4: Send key events

Call a tracking method when the corresponding user action happens. Pass a **stable user
ID** as the first argument so events can be tied to the same person over time.

```js
// New account created
tracker.trackRegister("user_123", {
  identifier: "hashed_email_or_phone"
});

// Deposit completed
tracker.trackDeposit("user_123", {
  currency: "USDT",
  network: "TRON",
  amount: 100
});
```

The SDK ships a typed helper for each event in the catalog (register, login, deposit,
withdraw, and more). For the full list of methods and their fields, see the
[Web Tracker SDK Reference](/en/tracking/web-tracker/reference).

::: warning Never send raw PII
Pass `identifier` as a **SHA-256 hash** of the user's email or phone — hash it on your
side before calling the tracker. Do not send raw emails, phone numbers, or names.
:::

::: tip Choosing a user ID
Use the same ID you use internally (e.g. your account/user primary key). Consistent IDs
across the Web Tracker and [Server Events (S2S)](/en/tracking/s2s/overview) let RevoSurge stitch
web and server activity into one user profile.
:::

## Step 5: Verify, then go live

Open **Tracking → Status** and watch for events to arrive (usually within a minute).

**Tracker status**

| Status              | Meaning                                  |
| ------------------- | ---------------------------------------- |
| Active / In-use     | Events are flowing                       |
| Inactive            | No recent data received                  |

**Event status**

| Status              | Meaning                                            |
| ------------------- | -------------------------------------------------- |
| Live                | Ready to use as a campaign optimization target     |
| Inactive / Not ready| Insufficient data or no recent events              |

When your key events read **Live**:

1. Change `env` to `"prod"` in your initialization.
2. Redeploy.
3. Your Product is ready for [AdWave campaigns](/en/adwave/guided-campaign-setup).

## What your events unlock

The events you send determine which RevoSurge features become available:

| Events you send                        | Unlocks                                   |
| -------------------------------------- | ----------------------------------------- |
| `register`, `login`                    | Source Intelligence · Reg→FTD funnel      |
| `deposit`, `withdraw`, `bet`           | True LTV · ROAS · Predicted LTV / churn · Bonus Engine |

The more of the catalog you cover, the more accurate targeting and optimization become.

## Troubleshooting

::: details Events aren't showing up
- Confirm the script tag is in `<head>` and loads (check the Network tab for `web-tracker.js`).
- Make sure `new WebTracker({...})` runs **after** the script loads.
- Check the `trackerId` matches the one in your product settings exactly.
- Remember `test` events won't appear in production/optimization views — check the test view.
:::

::: details Events show as "Not ready" / never go Live
An event needs enough recent volume to be marked **Live**. Send real (or realistic test)
traffic and give it time to accumulate. Sparse or one-off events stay inactive.
:::

::: details Can I track from my server instead of the browser?
Yes. For backend-generated events (payments confirmed server-side, KYC, bonuses), use the
[Server Events API (S2S)](/en/tracking/s2s/overview) instead of — or alongside — the Web Tracker.
:::

## Next steps

- [Web Tracker SDK Reference](/en/tracking/web-tracker/reference) — every method and field
- [Server Events API (S2S)](/en/tracking/s2s/overview) — send events from your backend
- [Guided Campaign Setup](/en/adwave/guided-campaign-setup) — launch your first AdWave campaign
