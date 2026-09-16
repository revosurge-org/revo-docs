---
title: Getting started
description: Account setup, funding, product config, launching first campaign.
---

# Getting started

**For:** Account owners, Admins, Operations, UA managers, Finance

## In this article
- Account structure & roles
- Funding & billing basics
- Product setup (high-level)
- Launching your first pilot
- What to measure in the first 72 hours

## Your onboarding path

Everything here is **self-serve** — you can go live without a RevoSurge rep. Complete these five steps in order (each is expanded below):

1. **Create your account** — public sign-up at [adwave.revosurge.com](https://adwave.revosurge.com), then add your team. → [Creating your account](/en/growth/account)
2. **Fund your wallet** — deposit into the shared AdWave + DataPulse wallet. → [Funding & wallet](/en/growth/funding-wallet)
3. **Set up your product & tracking in DataPulse** — create the Product and connect tracking so it turns **Active**. → [Pick your tracking method](/en/tracking/overview) · [Product setup](#_3-product-setup-high-level)
4. **Launch your first campaign** — build and launch in AdWave once the Product is Active. → [Campaign setup](/en/adwave/campaign-setup)
5. **Measure the first 72 hours** — watch delivery, quality, and conversions in DataPulse. → [What to measure](#_5-what-to-measure-in-the-first-72-hours)

::: warning What can I do myself — and what needs a developer?
Steps **1, 2, 4, and 5 are fully self-serve** in the browser. **Step 3 (installing tracking) is the one technical step** — adding the Web Tracker to your site, or sending S2S events, touches your website's code. If you don't edit your own site, that's fine: you stay in charge of everything else and hand just that step to whoever manages your site (see [Step 3 below](#_3-product-setup-high-level)). New to the terms here? See [Key terms](/en/revosurge/welcome#key-concepts).
:::

## 1) Account structure & roles
A RevoSurge account represents your business on the platform. It includes:
- Company identity (legal name, region)
- Users, roles, and permissions
- Billing and wallet balance
- Products (websites/apps)
- Campaigns and reporting

**Common roles (example):**
- **Admin / Master:** Full access, user management, billing visibility  
- **Ad Executive:** Campaign and creative management  
- **Data Analyst:** Reporting and measurement (where available)  
- **Finance:** Balance, invoices, transaction records  

> Tip: Keep at least one Admin/Master user active to avoid access lockouts.

## 2) Funding & wallet basics
RevoSurge uses an **account-level shared wallet**.  
Before running campaigns, confirm:
- Wallet has enough balance for planned spend
- Your finance team understands deposit flow and transaction records

What you should be able to see:
- Current balance (wallet)
- Transaction history / deposit records
- Campaign spend totals (in AdWave)

## 3) Product setup (high-level)
A **Product** is the site/app you promote. After you sign up in AdWave, the technical
integration for each Product — tracker, server events, and API credentials — is set up in
**DataPulse**.

::: info Same account, two ways into DataPulse
AdWave and DataPulse share **one account** — same email, same login. Reach DataPulse either way:
- go straight to **[datapulse.revosurge.com](https://datapulse.revosurge.com)** and sign in, or
- from the **AdWave** dashboard, click **Open DataPulse** in the **top-right corner**.
:::

![In the AdWave backend, "Open DataPulse" sits in the top-right corner, next to Currency / Timezone](/img/onboarding/adwave-open-datapulse.png)

Which conversion method you use — Web Tracker, S2S, AppsFlyer, or Partner Postback — depends on your setup; pick yours in [**Tracking Overview**](/en/tracking/overview).

DataPulse walks you through a guided **Setup Wizard**:
1. **Create Product** — set the Domain, Tracker ID, and Deposit FX.
2. **Setup Web Tracker** — add the tracker to your site so events start flowing. See [**Install the Web Tracker**](/en/tracking/web-tracker/install).
3. **S2S Postback** — **Generate API Key** and send server-to-server events (an initial **S2S Status: Pending** is normal until the first event arrives). See [**API Key**](/en/api/api-key).
4. **Ad Sources** — connect AdWave so campaign delivery and outcomes line up.

> A Product stays **Inactive** until its Web Tracker receives its first event; only **activated** Products can be selected when you create a campaign.

![The DataPulse Setup Wizard — Create Product, Setup Web Tracker, S2S Postback, Ad Sources](/img/onboarding/datapulse-setup-wizard.png)

::: tip Not the person who edits your website?
Installing the Web Tracker (or sending S2S events) touches your site's code — you don't have to do it yourself. Send the [**Install the Web Tracker**](/en/tracking/web-tracker/install) page to whoever manages your website (about 15 minutes), then come back once your Product shows **Active**. Everything else in this guide stays self-serve.
:::

## 4) Launching your first pilot (recommended checklist)
Before going live:
- ✅ Product selected **and activated** — a Product stays **Inactive** until its Web Tracker receives its first event; only activated Products can be selected in the campaign flow. Check the **Tracker Status** column under **Product → Manage Product** in DataPulse (or the **Web Tracker active** indicator in the Setup Wizard).  
- ✅ Target event selected (must be available/live depending on current rules)  
- ✅ Creative uploaded & reviewed  
- ✅ Geo targeting set  
- ✅ Daily budget & CPM/bid set  
- ✅ Monitoring plan agreed (who reviews spend, performance, quality)

## 5) What to measure in the first 72 hours
**Client-side effectiveness (advertiser view):**
- Impressions, Clicks, CTR
- Landing sessions / visits (if measured)
- Conversions (if available)
- Spend, CPM, CPC, CPA (if applicable)

**Ops & unit economics (platform view):**
- Spend distribution by SSP / publisher
- Win rate, clearing eCPM distribution
- Media cost vs client billed spend (markup realization)
- Inventory quality signals (e.g., "high imps / no clicks" outliers)

## Troubleshooting

::: details My Product is stuck "Inactive"
A Product only turns **Active** after its Web Tracker receives its first event. Confirm the tracker script is installed on the right pages, the `trackerId` matches your product, and no ad-blocker or CSP is blocking `web-tracker.js`. See [Install the Web Tracker](/en/tracking/web-tracker/install#troubleshooting). If it stays Inactive well after real traffic arrives, contact support.
:::

::: details Why is there no Web Tracker data?
Open **DataPulse → Product** and check the **Web Tracker** event stream (Receiving / Errors / Not-yet-seen). No "Receiving" usually means the script isn't firing or the Tracker ID is wrong.
:::

::: details Why are S2S events not flowing?
In the DataPulse **Setup Wizard → S2S Postback**, confirm you generated an API key and that your server is posting to the S2S endpoint. An initial **S2S Status: Pending** is normal until the first event is received. See [API Key](/en/api/api-key).
:::
