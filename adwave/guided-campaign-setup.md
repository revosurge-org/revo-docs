---
title: Guided campaign setup in AdWave
sidebar_label: Guided campaign setup
---

# Guided campaign setup in AdWave

**Audience:** UA managers, campaign specialists, growth teams

## What is guided setup?
Guided Campaign Setup is a multi-step workflow that:
- Verifies prerequisites (account readiness, product readiness, Live events)
- Lets you create **Campaign + Ad Group + Ad** in one flow
- Applies real-time validation to reduce setup mistakes

It follows the hierarchy:
**Account → Product → Campaign → Ad Group → Ad**

## Prerequisites
Before creating a campaign:
- Account status = **Ready** (online agreement signed)
- At least one Product with:
  - Tracker active / In-use
  - At least one **Live** event
- Sufficient wallet balance to cover planned spend

## Step 1 — Select Product & target event
- Select a Product (only **Ready** products are selectable)
- Select a **Target event** (must be **Live** and belongs to that Product)

## Step 2 — Campaign settings (Internal Campaign)
- Campaign name (max 255 chars)
- Campaign Type / Ad Format (one required; cannot change after publish)
  - Display, Native, Pop-Under, Push, Interstitial, Pop-Up
- Schedule
  - Start time and end time (end must be ≥ 24h after start)
- Budget & bid
  - Daily budget (USD, 2 decimals)
  - Target bid (USD, 2 decimals)
  - Validation: target bid < daily budget
- Budget pacing strategy
  - Front-loaded or Even pacing
- Optional limits
  - Lifetime total budget cap
  - Frequency cap
  - Daily/total impression caps

## Step 3 — Targeting (Internal Ad Group)
- Required: one or more locations
- Optional: Audience labels / segments
- If multiple labels are selected, the resulting segment is an **intersection** of all labels

## Step 4 — Creatives (Internal Ad)
- Upload one or more creatives
- System validates compatibility with the selected ad format
- Preview before publish

## Step 5 — Review & publish
- Review all settings
- Choose:
  - Save Draft → campaign saved as Draft
  - Publish
    - Start time in future → Scheduled
    - Start time now/past + sufficient balance → Running
