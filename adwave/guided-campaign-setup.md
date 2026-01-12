# Guided campaign setup

**For:** UA managers, Campaign operators, Growth teams

Guided Campaign Setup is a step-by-step flow to create: **Campaign → Ad group → Ad (creative)** in one place, while validating prerequisites.

## In this article
- Prerequisites
- Step 1: Product & target event
- Step 2: Campaign settings
- Step 3: Targeting
- Step 4: Creatives
- Step 5: Review & publish
- What to monitor after launch

## Prerequisites
Before you start, ensure:
- Account status is ready
- Wallet has sufficient balance
- At least one Product is available
- Target events you need are available for selection (depends on current rollout rules)

## 1) Select Product & target event
1) Choose the **Product** you want to promote  
2) Select the **Target event** (optimization goal), such as:
- Register  
- First Time Deposit (FTD)  
- Deposit (if supported)  

Your target event is used for:
- Optimization logic (where enabled)
- Performance reporting and evaluation

## 2) Campaign settings (campaign-level)
Set the core campaign configuration:

**Campaign name**  
- Human-readable name used in reporting

**Campaign type / Ad format**  
- Example: Display, Pop, Native (based on current availability)  
- Some formats may be locked after publish (depends on product rule)

**Schedule**
- Start time: now or future  
- End time: must be at least 24h after start (if required)

**Budget**
- Daily budget (USD)

**Bid / target CPM**
- Set your target CPM (or bid goal) used for RTB bidding strategy

> Important: In some current versions, billing markup may be applied **after** bidding/reporting. Align on the billing logic with your internal owner before using pilot data for revenue conclusions.

## 3) Targeting (ad group-level)
Targeting defines **who and where** you want to reach.

**Required**
- Geo: one or more locations (e.g., Country)

**Optional**
- Audience Segment(s) created under **Audience**  
- If multiple segments are selected, the resulting audience is the **intersection** (AND logic), unless your UI explicitly supports OR logic.

## 4) Creatives (ad-level)
Upload one or more creatives compatible with the selected ad format:
- Image / HTML / etc. depending on format

For each creative, configure:
- Destination URL (landing page)
- Format-specific fields (title, description, CTA) if required

## 5) Review & publish
On the review screen:
- Confirm product, event, budget, bid/CPM, targeting, and creatives

Actions:
- **Save Draft** (if available)
- **Publish** to activate / schedule the campaign

## After launch: what to monitor (pilot checklist)
**Delivery**
- Impressions, Spend, CPM
- Win rate (if available)
- Geo mix vs expected

**Engagement**
- Clicks, CTR
- Very high imps + near-zero clicks → investigate inventory quality

**Outcomes (if connected)**
- Conversions (Register/FTD)
- CPA / ROAS (if available)
