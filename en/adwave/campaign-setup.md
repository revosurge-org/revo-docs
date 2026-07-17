---
title: Campaign setup
description: Create a campaign and creatives in AdWave in one flow — prerequisites, step-by-step settings, and a pre-launch checklist.
---

# Campaign setup

**For:** UA managers, campaign operators, and Growth teams launching campaigns in AdWave.

Campaign Setup is a single-page, step-by-step flow that walks you from creating a product to launching a live campaign — with creatives — in one place.

## In this article

- [Prerequisites](#prerequisites)
- [Step 1: Product](#_1-product)
- [Step 2: Objective & Ad Format](#_2-objective-ad-format)
- [Step 3: Target Geo](#_3-target-geo)
- [Step 4: Bid & Daily Budget](#_4-bid-daily-budget)
- [Step 5: Schedule](#_5-schedule)
- [Step 6: Creative](#_6-creative)
- [Launch](#launch)
- [After launch: what to monitor](#after-launch-what-to-monitor)

## Prerequisites

Campaign creation is **gated by data setup**. On the AdWave onboarding page (**Wire up your data**), *Create Campaign* stays locked until you complete Steps 1–3. Before you start, make sure:

- **Product created.** Create the **Product** (the app or site you promote) with its Domain, Tracker ID, and Deposit FX.
- **Web Tracker active.** Your Product is **Inactive** until its Web Tracker receives its first event; only **activated** products can be selected in the campaign flow. See [Install the Web Tracker](/en/tracking/web-tracker/install).
- **Conversion events tracked.** The target event you optimize for (e.g. Register, Deposit) must be flowing in via tracking. See [Tracking → Overview](/en/tracking/overview).
- **Wallet funded.** Your **wallet** has sufficient balance. See [Funding & wallet](/en/growth/funding-wallet).
- **Creatives ready.** Assets are prepared to spec. See [Creative Requirements & Examples](/en/adwave/creative-requirements).

> **Tip:** You can check a Product's status under **Manage Product** — the **Tracker Status** column shows Active / Inactive, and *Data Setup* shows how many events are active.

## 1) Product

Select the **Product** you want to promote. Each card shows the product name and its URL.

> **Note:** "Unactivated products can only be put into use after being activated." If the product you need is not activated, activate it first, then return to this flow.

## 2) Objective & Ad Format

**Campaign name**

Enter a human-readable name used in reporting. AdWave suggests a naming format to keep campaigns consistent:

> Suggested format: **Geo + Promotion + Ad Format + Start date** — for example, `IN_Register_Display_20260126`.

**Target event**

Select the conversion event this campaign should optimize for. This event is used to measure conversions and calculate **CPA** for the campaign.

- **Register**
- **Deposit**

**Ad format**

Choose one format. Each has different creative requirements (see [Step 6](#_6-creative)) and a different suggested bid:

- **Pop** — Ads that appear as overlays or new windows. Highly attention-grabbing; suitable for promotions and conversion-driven campaigns.
- **Push** — Notification-style ads delivered directly to users' devices. Effective for re-engagement and ongoing user outreach.
- **Display** — Banner-style ads placed in fixed positions (e.g. sidebar or header). Best for strong visibility and broad brand awareness.
- **Native** — Ads that blend seamlessly into the content feed. Less intrusive and more engaging; ideal for higher click-through rates.

## 3) Target Geo

Search for and select the countries or regions to target. You can add **up to 20** geos per campaign.

> **Tip:** Keep geo and creative language aligned. If you target multiple markets that need different languages, prepare a creative (or creative language) for each. See [Step 6: Creative](#_6-creative).

## 4) Bid & Daily Budget

**Bid**

- **Bid strategy:** **CPM** (cost per 1,000 impressions).
- **Maximum CPM bid:** the most you're willing to pay per 1,000 impressions.

AdWave shows a **Suggested Max Bid** that varies by ad format (for example, Display ≈ \$0.04, Native ≈ \$0.03, Push ≈ \$0.11, Pop ≈ \$0.11 at time of writing).

> **Note:** "This is the max bid we recommend for this campaign. Actual bids in the auction may be lower than this cap."

**Daily budget**

Set your daily spend limit in USD.

> **Tip:** Set a minimum daily budget of **20× your target bid** to ensure stable delivery and meaningful results. This gives the algorithm enough data each day to learn and optimize performance effectively.

## 5) Schedule

- **Start date:** defaults to now; you can schedule a future start.
- **End date:** select an end date, or use **Quick Select Cycle** to set a duration of **7d / 14d / 30d / 60d / 90d** from the start date.

## 6) Creative

> **Note:** Select an ad format in [Step 2](#_2-objective-ad-format) first. Creative fields change to match the format.

Click **Add Creative ([Format])** to add a creative block. You can upload **multiple images — up to 20 at once**.

For each creative:

- **Creative language:** set the language (e.g. EN). Tick **"All creatives in this campaign will use this language"** to apply it to every creative.
- **Destination URL:** select the landing page. Tick **"One URL for all creatives in this campaign"** to reuse a single URL, or use **Add Landing Page** to register a new one.

Format-specific fields:

| Format | Assets | Specs |
| --- | --- | --- |
| **Pop** | Destination URL only | No image — Pop renders your landing page directly |
| **Push** | Icon + Main image + Title + Description | Icon: JPEG/PNG/JPG, 192×192, ≤ 200 KB. Main image: JPEG/PNG/JPG, ≤ 720 KB, sizes 492×328 / 360×240 / 720×480 |
| **Display** | Main image + Destination URL | JPEG/PNG/JPG/GIF, ≤ 500 KB, sizes 300×250 / 320×50 / 728×90 / 468×60 / 160×600 / 300×100 |
| **Native** | Main image + Title + Description + Destination URL | JPEG/PNG/JPG, ≤ 500 KB, sizes 300×250 / 300×100 / 320×50 / 728×90 / 468×60 / 160×600 |

> **Tip:** For full asset guidance, offer/angle testing, and examples, see [Creative Requirements & Examples](/en/adwave/creative-requirements).

## Launch

There is no separate review step. When every section is complete, click **Launch** (top-right) to activate or schedule the campaign.

**Pre-launch checklist:**

- ✅ Product selected (and activated)
- ✅ Campaign name follows the suggested format
- ✅ Target event set (Register / Deposit)
- ✅ Ad format chosen
- ✅ At least one Target Geo added (≤ 20)
- ✅ Maximum CPM bid and daily budget set (budget ≈ 20× bid)
- ✅ Start (and end/cycle) scheduled
- ✅ Creatives added to spec, with language and destination URL

## After launch: what to monitor

**Delivery**

- Impressions, Spend, CPM
- Win rate (if available)
- Geo mix vs. expected

**Engagement**

- Clicks, CTR
- Very high impressions + near-zero clicks → investigate inventory quality

**Outcomes**

- Conversions (Register / Deposit)
- CPA / ROAS (if connected)
