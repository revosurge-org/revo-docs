---
title: RevoSurge
---

# Growth  $\rightarrow$  Getting started with RevoSurge

This guide walks you through the core pieces you need to start running campaigns with RevoSurge:

- Creating your Adwave account

- Installing the tracker

Guided campaign setup in AdWave

- Working with audience segments

- RevoSurge API quickstart

# 1. Creating your RevoSurge account

Audience: Admin / Master users, operations, account owners

# 1.1 What is a RevoSurge account?

A RevoSurge account represents your business on the platform. It is the container for:

- Your legal company identity

- Billing and funding (a shared wallet for AdWave and DataPulse)

- Users, roles, and permissions

- Products (websites / apps) you want to promote

- All campaigns, analytics, and financial balances

Everything you do in RevoSurge is linked to an account.

# 1.2 Prerequisites

Before you create or activate your account, prepare:

- Legal company name

- Registered business address and country

- Main contact name and email

- Optional billing contact (recommended)

# 1.3 Create your account

# 1. Sign up or accept an invite

- Use the sign-up link provided by your RevoSurge representative, or

- Accept the invitation email if your company account has already been created.

# 2. Fill in company details

Provide at least:

Company legal name

Country of registration

Registered business address

Primary contact person (name and email)

# 3. Accept the online agreement

Review the standard service terms.

- Confirm and accept. Your click-to-accept action acts as a digital signature.

# 1.4 Add team members and roles

RevoSurge provides four main built-in roles:

- Master / Admin - full access, including user and role management, account settings and billing

- Ad Executive – manage products, campaigns, creatives and reports for assigned products

Data Analytic - manage data assets and view campaigns and reports for assigned products

Finance - view balances, invoices, and financial reports

# To invite team members:

1. Go to Account  $\rightarrow$  Members.

2. Click Invite member.

3. Enter:

Email address

○ Role: Master, Ad Executive, Data Analytic, or Finance

○ Optional message

4. Click Send invite. The user receives an activation email.

# Later you can:

- Change a user's role

- Disable a user when they leave

- Re-send invitations if needed

- Keep at least one Master/Admin in every account. The last Master/Admin cannot be removed.

# 1.5 Fund your shared wallet

AdWave and DataPulse share the same account-level wallet.

1. Go to Billing  $\rightarrow$  Deposit funds.

2. Choose a payment method (options depend on your region), such as:

Credit card

Bank transfer

Crypto wallet

3. Enter the deposit amount (respecting any minimum deposit requirement).

4. Read and confirm any non-refundable funds disclaimer.

After payment, verify that:

- Your Account balance is updated.

- A new Deposit record appears in Transaction history.

# 2. Installing the RevoSurge tracker

Audience: Developers, tracking engineers, BI / analytics owners

# 2.1 What is the RevoSurge tracker?

The RevoSurge tracker is the data collection layer of the platform. It:

- Captures user actions on your website or app

- Sends 1st-party events (page views, registrations, deposits, purchases, etc.) to RevoSurge's analytics backend

- Allows AdWave to optimize campaigns towards real business outcomes

Related concepts:

- Tracker - JS/SDK/pixel code that sends events to RevoSurge

- Tracking codes (UTM) – parameters added to ad links for non-AdWave traffic so we can attribute visitors to campaigns, ad groups, and creatives

- Pixels - 1×1 or JavaScript pixels that fire on ad impressions and creative engagement

# 2.2 Prerequisites

Before integrating the tracker, you should have:

- A RevoSurge account with at least one active user

- A Product created for your website or app

- Access to your site/app source code or tag manager

- A list of key events you want to track, such as:

- PageView/ScreenView

Register

0 FirstTimeDeposit

Deposit/Purchase

Other product-specific events

# 2.3 Step 1 - Define a Product

1. Go to Product management  $\rightarrow$  Products.

2. Click Create product.

3. Enter one of:

- Website domain (for example www.example.com), or

○ App store link (for example your iOS / Android app page)

4. Click Save. This creates the product and assigns it a Tracker ID.

# Notes:

Each product has exactly one tracker data source.

- Changing the product's destination later is strongly discouraged, because it breaks the association between historical data and that product.

# 2.4 Step 2 – Generate and install the tracker

1. Open the product you just created.

2. Go to the Tracking or Tracker section.

3. Download or copy the tracker code (JavaScript snippet, SDK setup instructions, or pixel).

4. Ask your developer or tracking engineer to install it:

For web: in the page template or via your tag manager

For mobile: in the app using the SDK integration guide

The tracker must load on all pagesscreens where you want to measure user behavior and conversions.

# 2.5 Step 3 – Configure events and tracking codes

Work with your BI / UA / product teams to define:

- Standard events such as PageView, Register, FirstTimeDeposit, Deposit, Purchase

- Custom events that are important for your business (e.g. KYCCompleted, BetPlaced, BonusClaimed)

For non-AdWave traffic:

- Add UTM / tracking parameters to your ad links so that RevoSurge can attribute sessions and conversions back to:

Campaign

Ad group

Creative / placement

For AdWave traffic:

- Tracking codes can be injected automatically by the platform.

# 2.6 Step 4 - (Optional) Configure pixels for ad engagement

If your creatives or external placements support it, you can configure pixels to track:

- Ad impressions

- Clicks

Video views or other engagement signals

These pixels help connect:

- What happened on the ad placement side (served, viewed, clicked), with

- What happened on your destination (registration, deposit, gameplay, etc.)

# 2.7 Step 5 – Verify tracker & event status

In the tracking section for your product, or via your RevoSurge contact:

Check Tracker status:

○ Active - events are flowing correctly

○ Inactive – no recent data is received; integration may be missing or broken

Check Event status:

Live / Active - enough recent data, can be used as a campaign optimization target

○ Inactive – insufficient or no recent data

Once key events (especially registration and FTD / deposit) are Live, your product is ready for AdWave campaigns and future analytics features.

Reference: https://docs.revosurge.com/

# 3. Guided campaign setup in AdWave

Audience: UA managers, campaign specialists, growth teams

# 3.1 What is the guided setup?

The Guided Campaign Setup is a multi-step workflow that:

- Checks all prerequisites (account, product, events, funding)

- Walks you through configuring Product  $\rightarrow$  Campaign  $\rightarrow$  Ad Group  $\rightarrow$  Ad in one flow

- Reduces mistakes such as using the wrong optimization event, budget, or creative format

It follows the RevoSurge internal hierarchy:

Account  $\rightarrow$  Product  $\rightarrow$  Campaign  $\rightarrow$  Ad Group  $\rightarrow$  Ad

# 3.2 Prerequisites

Before creating a campaign, ensure:

- Account status = Ready (online agreement accepted, required fields completed)

- At least one Product where:

The tracker is installed and sending data

At least one key event has status = Live

# 3.3 Step 1 - Product & target event

1. Choose the Product (website or app) you want to promote.

- Only products with Status = Ready are selectable.

The system checks that:

The product tracker is active, and

At least one Live event is available.

2. Select a target event (optimization goal), for example:

- FirstTimeDeposit

Register

Other monetization or engagement events

Your chosen target event is used for bidding, optimization and performance evaluation.

# 3.4 Step 2 - Campaign settings (internal campaign)

Configure the core campaign settings:

Campaign name

$\circ$  Up to 255 characters.

○ Use a clear naming convention (geo, product, goal, date, etc.).

Campaign type / Ad format

Example formats: Display, Native, Pop-under, Push, Interstitial, Pop-up (depending on your configuration).

This selection is mandatory and cannot be changed after the campaign is published.

# Schedule

Start time: must be now or in the future.

End time: must be at least 24 hours after the start time.

“Always on” campaigns can be represented by a far-future end date.

# - Budgets

Daily budget (USD, 2 decimals).

- Optionally, a lifetime budget cap if supported in your configuration.

# Bid & limits

Target bid (USD per optimization event, 2 decimals).

o Validation rule: Target bid < Daily budget.

The platform validates your inputs in real time and will prevent publishing if critical fields are invalid or missing.

# 3.5 Step 3 – Targeting (internal ad group)

Define who sees your ads and where:

# Required

- One or more locations: country, region/state or city.

# Optional

- Audience labels or audience segments powered by RevoSurge data.

When multiple audience labels are selected, the resulting audience is the intersection of all selected labels (users who match all conditions).

You can create multiple ad groups to test different combinations of geo and audience.

# 3.6 Step 4 - Creatives (internal ad)

Upload and configure your ad creatives:

- Supported asset types depend on the chosen Campaign type (images, videos, HTML, etc.).

For each creative:

1. Upload the asset file.

2. Enter the destination URL / deep link.

3. Add title, description and call-to-action text if required by the format.

AdWave will:

- Validate file type and size

- Ensure compatibility with the selected format

- Provide a visual preview before you launch

# 3.7 Step 5 - Review & publish

On the Review step, check:

Product and target event

Campaign schedule, budget and bid

- Targeting (geo and audience)

- Creatives and landing pages

Then choose:

- Save draft - campaign is saved as Draft and does not spend.

- Publish - the system validates the setup one more time.

If validation passes:

If start time is in the future, status becomes Scheduled.

- If start time is now/past and there is enough balance, status becomes Live.

After publishing, use Campaign Management to:

- Pause or resume campaigns

- Adjust daily budgets within platform rules

- Monitor performance (FTDs, GGR, ROAS and other KPIs)

- Optimize bids, targeting and creatives based on results

# 4. Working with audience segments

Audience: UA managers, growth, CRM / retention, BI teams

Audience segments let you define and reuse user groups in your targeting. Segments can be:

- Rule-based (built from your own criteria), or

- Algorithmic (recommended by RevoSurge, depending on configuration)

Some advanced audience management UI may not yet be visible in your account. Your RevoSurge representative can confirm which parts are enabled for you.

# 4.1 Segment basics

A segment is a saved definition of a user group, based on:

Who the users are (geo, device, OS, etc.)

- Where they came from (source, campaign, channel)

- What they did (events, conversions, deposits, gameplay)

- How valuable they are (FTDs, GGR, LTV, etc.)

# Typical examples:

FTD players from tier-1 countries

- "Registered, no FTD in last 7 days"

- "High-value players with GGR > $100 in last 30 days"

# 4.2 Building and managing segments

Depending on your enabled features, you can:

- Create new segments by combining:

Demographic and technical attributes

Acquisition attributes (source, campaign)

o Behavioral events

Value thresholds

- Combine rules with:

AND (users must match all conditions)

OR (users can match any of the conditions)

- Review key metrics for each segment, such as:

Estimated size

In-use status (whether used in campaigns)

Creation date and type (User-defined / Algorithmic)

Once defined, segments can be reused across multiple campaigns and ad groups.

# 4.3 Using segments in AdWave

When segment sync is enabled for your account:

- Segments appear as selectable audiences in AdWave.

You can:

- Include a specific segment as your primary target

- Test different segments across separate ad groups

Compare performance across segments (CPA, FTDs, GGR, ROAS, etc.)

This closes the loop between:

Data collection (tracker events),

- Audience definition (segments), and

- Activation (AdWave campaigns).

# 5. RevoSurge API quickstart

Audience: Engineers, technical integrators, BI teams

# 5.1 What can the APIs do?

RevoSurge APIs let you extend and automate core workflows, including:

# Account & product

- Fetch account details and status

List products and check if they are ready (tracker installed, events live)

# Campaigns

- Create and update campaigns with settings similar to the guided setup

- Adjust budgets and bids within allowed limits

- Pause, resume, or query campaign status

# Reporting

- Retrieve aggregated metrics such as impressions, clicks, spend, registrations, FTDs, revenue, GGR and ROAS

- Filter by date range, campaign, product, geo or channel

# Audience

List existing audience segments

- Create new segments from rule definitions

- Attach segments to campaigns

- Retrieve estimated sizes and basic statistics

Exact endpoints and capabilities depend on the current API release.

# 5.2 Authentication

APIs are protected by secure authentication (for example API keys or OAuth 2.0).

You receive credentials from your RevoSurge representative or via the developer console.

# Best practices:

- Keep credentials secret and never commit them to source control.

- Store them in environment variables or a secrets manager.

- Rotate keys regularly, following your company's security policy.

# 5.3 Example integration flow

A typical advanced integration might:

1. Use Reporting APIs to pull daily performance data into your data warehouse.

2. Join it with CRM or game data to build your own models.

3. Identify high-value, churn-risk or bonus-abuse users.

4. Use Audience APIs to push these users back to RevoSurge as new segments.

5. Launch AdWave campaigns targeting these segments for acquisition, retention or re-activation.

# 5.4 Full API reference

This quickstart focuses on concepts and use cases. For:

- Endpoint URLs

- Request and response schemas

- Error codes and rate limits

- Language-specific examples (cURL, Python, Node.js, etc.)

Please refer to the RevoSurge API Reference in the developer section of docs. revosurge .com or the documentation provided by your account manager.