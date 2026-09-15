---
title: Tracking Overview
description: Four ways to send conversions to RevoSurge — Web Tracker, AppsFlyer, S2S Server Events, Partner Postback. Pick yours in 60 seconds.
---

# Tracking Overview

Four ways to send conversions to RevoSurge. Pick yours in 60 seconds.

## Which method is right for you? {#decide}

Answer two quick questions and we'll recommend the fastest path.

<TrackingMethodPicker lang="en" />

## Or browse by scenario {#scenarios}

<div class="scenario-grid">
  <a class="scenario-card" href="#partner-postback">
    <div class="scenario-lead">"I use <strong>Affilka / Cellxpert / Smartico / MyAffiliates / NetRefer</strong> and want to be live today."</div>
    <div class="scenario-arrow">→ <strong>Partner Postback</strong> · same day · no engineering</div>
  </a>
  <a class="scenario-card" href="#s2s">
    <div class="scenario-lead">"I built <strong>my own back-office</strong> and have engineers who can integrate an API."</div>
    <div class="scenario-arrow">→ <strong>S2S Server Events</strong> · deepest control · full iGaming event catalog</div>
  </a>
  <a class="scenario-card" href="#appsflyer">
    <div class="scenario-lead">"I run a <strong>native Android / iOS App</strong> on Play Store or App Store."</div>
    <div class="scenario-arrow">→ <strong>AppsFlyer</strong> · industry-standard App MMP</div>
  </a>
  <a class="scenario-card" href="#web-tracker">
    <div class="scenario-lead">"I only have a <strong>landing page + advertiser website</strong> — no App, no back-office API."</div>
    <div class="scenario-arrow">→ <strong>Web Tracker</strong> · first-party JS snippet</div>
  </a>
</div>

## The four methods {#methods}

<div class="method">

### 🌐 Web Tracker <Badge type="info" text="Web" /> {#web-tracker}

<p class="method-tagline">First-party JS on your landing page and advertiser site.</p>

Fires conversion events (registration, deposit, FTD) as users move through your web funnel. Persists `click_id` in a first-party cookie with a one-year expiry — a user who lands, bounces, and returns three days later still attributes.

<div class="method-meta">
  <div class="meta-item"><span class="meta-label">Best for</span>Web-only funnels, or attributing web-side conversions with no server integration</div>
  <div class="meta-item"><span class="meta-label">Skip if</span>Your funnel lives inside a mobile App</div>
  <div class="meta-item"><span class="meta-label">Delivery</span>JS snippet + a GTM template (planned)</div>
  <div class="meta-item"><span class="meta-label">Key mechanic</span>First-party cookie, 1-year expiry, survives bounce-and-return</div>
</div>

<a class="method-cta" href="/en/tracking/web-tracker/install">Start with Web Tracker →</a>
<a class="method-cta-secondary" href="/en/tracking/web-tracker/reference">See SDK reference</a>

</div>

<div class="method">

### 📱 AppsFlyer <Badge type="tip" text="App MMP" /> {#appsflyer}

<p class="method-tagline">Third-party mobile measurement partner. Industry standard.</p>

RevoSurge integrates as a media source, and AppsFlyer forwards install and in-app event postbacks to us. You configure `androidAppsFlyerId` / `iOSAppsFlyerId` on your landing page when initializing the web tracker; we appear as a partner tile in your AppsFlyer dashboard.

Play Store / App Store distribution uses Install Referrer, which is deterministic. APK and H5-wrapper distribution falls back to probabilistic attribution, where match rates are materially lower.

<div class="method-meta">
  <div class="meta-item"><span class="meta-label">Best for</span>Any mobile App — Play Store, App Store, APK, or H5 wrapper</div>
  <div class="meta-item"><span class="meta-label">Skip if</span>You don't have a mobile App at all (web-only funnel)</div>
  <div class="meta-item"><span class="meta-label">Delivery</span>Configured on your landing page when initializing the web tracker · partner tile in AppsFlyer</div>
  <div class="meta-item"><span class="meta-label">Accuracy</span>Deterministic via Install Referrer on store installs · probabilistic otherwise</div>
</div>

<a class="method-cta" href="/en/mmp/appsflyer/overview">Start with AppsFlyer →</a>
<a class="method-cta-secondary" href="/en/mmp/appsflyer/validation">Integration validation</a>

</div>

<div class="method">

### 🔧 S2S Server Events <Badge type="info" text="S2S" /> {#s2s}

<p class="method-tagline">Your back-office to our S2S API. Deepest control.</p>

Server-to-server and fully programmatic. **Pick one of two tiers** based on what you want to measure. Both share the same authentication and event contract, so you can start with Basic and extend to Full incrementally.

<div class="method-subtier">
  <div class="method-subtier-title">S2S-Basic — registration + FTD only</div>
  <div class="method-subtier-desc">Core acquisition metrics through the S2S channel. REST API subset (2 endpoints). More control than Partner Postback, without revenue or repeat-deposit tracking.</div>
</div>

<div class="method-subtier">
  <div class="method-subtier-title">S2S-Full — complete iGaming event catalog</div>
  <div class="method-subtier-desc">Everything in Basic plus repeat deposits, revenue events, cross-channel deduplication, and reconciliation. Contract highlights: never-4xx design · deduplication fallback chain · 30-day acceptance window · operator FTD claims accepted as is_claimable claims, not auto-canonicalized.</div>
</div>

<div class="method-meta">
  <div class="meta-item"><span class="meta-label">Best for</span>Own back-office with engineering — Basic for acquisition, Full for LTV, dedup, and revenue</div>
  <div class="meta-item"><span class="meta-label">Skip if</span>You have no engineering capacity to integrate an HTTP API</div>
  <div class="meta-item"><span class="meta-label">Delivery</span>REST API (OpenAPI v3 spec planned) · optional PHP / Node SDK · reconciliation file drop for Full</div>
  <div class="meta-item"><span class="meta-label">Upgrade path</span>Basic → Full is code-only: same auth, same contract, additive fields, no re-onboarding</div>
</div>

<a class="method-cta" href="/en/tracking/s2s/overview">Start with S2S →</a>
<a class="method-cta-secondary" href="/en/tracking/s2s/v3/server-events-api">See API reference</a>

</div>

<div class="method">

### 🔗 Partner Postback <Badge type="warning" text="Fastest start" /> {#partner-postback}

<p class="method-tagline">Paste two URLs into your affiliate platform. Live today.</p>

A URL you paste into your affiliate or back-office platform. That platform fires postbacks to us on registration and FTD. No code, no engineering, no waiting. Works with Affilka, Cellxpert, Smartico, MyAffiliates, NetRefer, and other iGaming-friendly platforms.

<div class="method-meta">
  <div class="meta-item"><span class="meta-label">Best for</span>SaaS affiliate platform users who want same-day integration with zero engineering</div>
  <div class="meta-item"><span class="meta-label">Skip if</span>You need cross-channel deduplication with AppsFlyer, or want to send arbitrary in-app events — upgrade to S2S</div>
  <div class="meta-item"><span class="meta-label">Delivery</span>Two postback URLs (registration + FTD) copied from our dashboard · self-serve slug and key</div>
  <div class="meta-item"><span class="meta-label">Accuracy</span>Only as good as your affiliate platform's macro coverage</div>
</div>

<a class="method-cta" href="/en/tracking/postback/partner-postback">Start with Partner Postback →</a>
<a class="method-cta-secondary" href="/en/tracking/postback/partner-postback#parameters">Macro parameters</a>

</div>

::: warning APK / H5-wrapped App distribution
Supported via probabilistic attribution — match rates are materially lower than Play Store / App Store distribution, because there is no Install Referrer. Weigh whether the reduced match rate fits your CPA target.
:::

## Full routing matrix {#matrix}

Pick your row (how you run your back-office), then your column (where users convert).

| Back-office ownership | Web only | App only | Web + App |
|---|---|---|---|
| **Your own back-office** (in-house engineering) | **S2S + Web Tracker** (both required) — S2S carries the events, Web Tracker captures the click-side signal | **S2S** primary · **AppsFlyer** for install attribution | **S2S + Web Tracker + AppsFlyer** (all three required) — S2S as canonical event stream, Web Tracker for click-side, AppsFlyer for App installs |
| **Affiliate / SaaS platform** (Affilka · Cellxpert · Smartico · MyAffiliates · NetRefer, etc.) | **Partner Postback** primary · **Web Tracker** for click-side capture | **Partner Postback** + **AppsFlyer** for install attribution | **Partner Postback + AppsFlyer** (both required) — Postback covers the platform side, AppsFlyer handles App installs |
| **Fastest start · no engineering** | **Partner Postback** (same day) | **AppsFlyer** only (accept the App-side gap) | **Partner Postback + AppsFlyer** (both required) — start with Postback for web and AppsFlyer for App installs |

**Cross-method notes**

- APK / H5-wrapped App distribution is supported via probabilistic attribution — match rates are lower than Play Store / App Store distribution, which has Install Referrer.
- A 30-day attribution window applies across all methods.
- `identifier` (SHA-256 email or phone) can be promoted to an attribution fallback join when `click_id` is missing.

## FAQ {#faq}

::: details Which method is most accurate?
Web Tracker and S2S give the highest fidelity because they don't depend on third-party matching. AppsFlyer is industry-standard for App attribution. Partner Postback is only as good as your affiliate platform's macro coverage.
:::

::: details What if I send the same FTD through AppsFlyer *and* my back-office?
Both are stored. The Integration Health Score surfaces conflicts. Cross-channel canonicalization policy is being finalized — until then, treat both signals as complementary and inspect divergences.
:::

::: details Do you accept postbacks in local currency (INR / MYR / USDT)?
Yes — we convert using our published exchange rates. There's no need to convert to USD first.
:::

::: details Seconds vs milliseconds timestamps?
**Send milliseconds.** That is the contract for both Partner Postback and the Server Events API.

What differs is what happens if you don't. The Server Events API (v3) **rejects** a value that looks like seconds. Partner Postback corrects it and keeps the event, but treats the correction as a deviation from the contract — it raises an alert on our side and we will contact you. Neither is a second supported format, so stabilize on milliseconds.
:::

::: details Do you support test mode?
Yes, two ways:

- Test keys route to a visible event stream, so you can self-validate without touching production traffic.
- `dryrun=1` on the S2S and postback endpoints parses, validates, and echoes back exactly what we would record — without storing.
:::

::: details How do I know my integration is healthy?
Each product page shows an **Integration Health Score** — `click_id` coverage, `event_id` presence, identity coverage, median event age at receipt, and suggested-field completeness. A remediation list is surfaced with the CPA delta attached.
:::

::: details Can I start with S2S-Basic and upgrade to S2S-Full later?
Yes — that's the intended path. Same authentication, same event contract, additive fields. Upgrading is code-only, with no re-onboarding.
:::

::: details APK / H5-wrapper Apps — are they supported?
Yes, via probabilistic attribution. Match rates are materially lower than Play Store / App Store distribution because there is no Install Referrer. Factor the reduced accuracy into your CPA target.
:::

## Getting started {#getting-started}

1. Answer the two questions at the top of this page, or find your row in the full routing matrix.
2. Open the corresponding method page: [Web Tracker](/en/tracking/web-tracker) · [AppsFlyer](/en/mmp/appsflyer/overview) · [S2S Server Events](/en/tracking/s2s/overview) · [Partner Postback](/en/tracking/postback/partner-postback).
3. If you want the fastest live path, start with **Partner Postback** (SaaS back-office) or **S2S-Basic** (own back-office) — you can extend to S2S-Full when you need the revenue signal.

<div class="bottom-cta" id="support">
  <div>
    <div class="bottom-cta-title">Still not sure which method fits?</div>
    <div class="bottom-cta-text">Ask your RevoSurge BD contact — we'll help you pick and get live.</div>
  </div>
</div>
