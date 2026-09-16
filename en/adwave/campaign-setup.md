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

![Step 1 — activated Products are selectable; unactivated ones are greyed out below the divider](/img/onboarding/campaign-step1-product.png)

## 2) Objective & Ad Format

**Campaign name**

Enter a human-readable name used in reporting. AdWave suggests a naming format to keep campaigns consistent:

> Suggested format: **Geo + Promotion + Ad Format + Start date** — for example, `IN_Register_Display_20260126`.

**Target event**

Select the conversion event this campaign should optimize for. This event is used to measure conversions and calculate **CPA** for the campaign. Choose one:

- **Register**
- **FTD (First-Time Deposit)**
- **Bet**
- **LP Click**

**Ad format**

Choose one format. Each has different creative requirements (see [Step 6](#_6-creative)) and a different suggested bid:

- **Pop** — Ads that appear as overlays or new windows. Highly attention-grabbing; suitable for promotions and conversion-driven campaigns.
- **Push** — Notification-style ads delivered directly to users' devices. Effective for re-engagement and ongoing user outreach.
- **Display** — Banner-style ads placed in fixed positions (e.g. sidebar or header). Best for strong visibility and broad brand awareness.
- **Native** — Ads that blend seamlessly into the content feed. Less intrusive and more engaging; ideal for higher click-through rates.

![Step 2 — Campaign Name, Target Event (Register / FTD / Bet / LP Click), and Ad Format](/img/onboarding/campaign-step2-objective.png)

## 3) Target Geo

Search for and select the countries or regions to target. Selected countries appear as chips and the header shows a live count (e.g. `1/20`). You can add **up to 20** geos per campaign.

**Retargeting Audience (optional)**

Below Target Geo you can attach a **Retargeting Audience** to re-reach users you already know. Click **Create Audience** to build one (you'll see *"No audience available"* until at least one exists). Leave it empty to target by geo alone.

> **Tip:** Keep geo and creative language aligned. If you target multiple markets that need different languages, prepare a creative (or creative language) for each. See [Step 6: Creative](#_6-creative).

![Step 3 — search and select countries (up to 20); attach a Retargeting Audience if you have one](/img/onboarding/campaign-step3-geo.png)

## 4) Bid & Daily Budget

**Bid strategy** — choose one:

- **oCPM** (Optimized CPM, *Suggested* — selected by default): you set your desired **cost per target event** and AdWave optimizes delivery toward it. Best for performance / CPA-driven campaigns.
- **CPM**: you set a **Maximum CPM Bid** — the most you'll pay per 1,000 impressions. Best for reach and awareness.

**Bid**

Enter your bid amount. AdWave shows a **Suggested Bid** next to the field — a live recommendation that varies by ad format and market; you can bid above or below it.

> **Note:** "eCPM only changes how we bid. You're still billed by CPM, which can be higher or lower than your target bid." Actual auction bids may clear lower than your cap.

**Daily budget**

Set your daily spend limit in USD. AdWave suggests a minimum so the algorithm has enough data to learn and optimize each day:

- **oCPM:** set your daily budget to ≈ **100× your bid** for best learning (minimum ~**50×**).
- **CPM:** minimum daily budget of **20× your target bid**.

![Step 4 — oCPM (default) sets a cost per target event; the Suggested Bid updates live per ad format](/img/onboarding/campaign-step4-bid.png)

## 5) Schedule

- **Start date:** defaults to now (your account timezone, UTC+0); you can schedule a future start.
- **End date:** pick a date, or use **Quick Select Cycle** for a fixed duration of **3D / 7D / 14D / 30D / 60D / 90D** from the start date — or **Custom Cycle** to enter your own number of days.

> **Note:** The schedule panel shows two clocks — **Actual publish time** in your account timezone (UTC+0) and **Local time** in your browser's timezone — so cross-timezone advertisers can confirm exactly when delivery starts.

![Step 5 — Quick Select Cycle (3D–90D) or Custom Cycle, with dual-timezone confirmation](/img/onboarding/campaign-step5-schedule.png)

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
| **Push** | Icon + Main image + Title + Description | Icon: JPEG/PNG/JPG, 192×192, ≤ 200 KB. Main image: JPEG/PNG/JPG, ≤ 720 KB, sizes 492×328 / 360×240 / 720×480. Title ≤ 30 chars, Description ≤ 40 chars. |
| **Display** | Main image + Destination URL | JPEG/PNG/JPG/GIF, ≤ 500 KB, sizes 300×250 / 320×50 / 728×90 / 468×60 / 160×600 / 300×100 |
| **Native** | Main image + Title + Description + Destination URL | JPEG/PNG/JPG, ≤ 500 KB, sizes 300×250 / 300×100 / 320×50 / 728×90 / 468×60 / 160×600 |

> **Tip:** For full asset guidance, offer/angle testing, and examples, see [Creative Requirements & Examples](/en/adwave/creative-requirements).

![Step 6 — a Push creative: Icon + Main image to spec, Title/Desc, and a Destination URL chosen from your registered landing pages](/img/onboarding/campaign-step6-creative-push.png)

## Launch

There is no separate **human** review step — but you do get a final self-review. **Launch** (top-right) stays disabled until every step is complete; when you click it, AdWave opens a **Campaign Summary** listing your Product, target event, ad format, geo, bid, budget, schedule, and creatives. The campaign is created only after you click **Confirm**.

![Clicking Launch opens the Campaign Summary — the campaign is created only after you click Confirm](/img/onboarding/campaign-launch-summary.png)

**Pre-launch checklist:**

- ✅ Product selected (and activated)
- ✅ Campaign name follows the suggested format
- ✅ Target event set (Register / FTD / Bet / LP Click)
- ✅ Ad format chosen
- ✅ At least one Target Geo added (≤ 20)
- ✅ Bid strategy, bid, and daily budget set (oCPM ≈ 100× bid, or CPM ≥ 20× bid)
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

## Troubleshooting

::: details My Product isn't selectable in Step 1
Only **activated** Products appear as selectable. A Product stays **Inactive** until its Web Tracker receives its first event — install and verify the tracker first (see [Install the Web Tracker](/en/tracking/web-tracker/install)), then return to this flow.
:::

::: details The Launch button is greyed out
**Launch** stays disabled until every step — Product, Objective & Ad Format, Target Geo, Bid & Daily Budget, Schedule, and Creative — is complete. The highlighted step number in the left nav shows where you are; finish the incomplete section to enable Launch.
:::

::: details What happens when I click Launch?
Clicking **Launch** opens a **Campaign Summary** for you to review. The campaign is created only after you click **Confirm** — use the summary as a final check of targeting, bid, budget, and schedule.
:::
