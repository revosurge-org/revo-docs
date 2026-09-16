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
**DataPulse** ([datapulse.revosurge.com](https://datapulse.revosurge.com), reachable via **Open
DataPulse** from the AdWave dashboard).

DataPulse walks you through a guided **Setup Wizard**:
1. **Create Product** — set the Domain, Tracker ID, and Deposit FX.
2. **Setup Web Tracker** — add the tracker to your site so events start flowing. See [**Install the Web Tracker**](/en/tracking/web-tracker/install).
3. **S2S Postback** — **Generate API Key** and send server-to-server events (an initial **S2S Status: Pending** is normal until the first event arrives). See [**API Key**](/en/api/api-key).
4. **Ad Sources** — connect AdWave so campaign delivery and outcomes line up.

> A Product stays **Inactive** until its Web Tracker receives its first event; only **activated** Products can be selected when you create a campaign.

![The DataPulse Setup Wizard — Create Product, Setup Web Tracker, S2S Postback, Ad Sources](/img/onboarding/datapulse-setup-wizard.png)

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
