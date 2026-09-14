# Tracking Overview

**Draft** — 2026-09-10 — for `docs.RevoSurge.com`

RevoSurge accepts conversion data from advertisers through **four** ingestion methods. This page helps you pick the right one in under three minutes based on **your back-office setup** and **where users convert**.

---

## The four methods

### 1. Web Tracker (LP / advertiser site)
A first-party JavaScript tracker installed on your landing page and advertiser website. Fires events (registration, deposit, FTD) directly to RevoSurge as users progress.

- **Use when:** You have a web-only funnel or want to attribute web-side conversions with no server integration.
- **Skip when:** Your funnel is inside a mobile app.
- **Delivery:** JS snippet + a GTM template (planned).
- **Key mechanic:** `click_id` is persisted in a first-party cookie (1-year expiry) so a user who lands, bounces, and returns 3 days later still attributes.

### 2. AppsFlyer (App MMP)
Third-party mobile measurement partner. RevoSurge integrates as a media source; AppsFlyer forwards install and in-app postbacks to us.

- **Use when:** You have a mobile App — native Play Store / App Store distribution, APK, or H5 wrapper.
- **Delivery:** You configure `androidAppsFlyerId` / `iOSAppsFlyerId` on your landing page when initializing the web-tracker; we appear as a tile in your AppsFlyer dashboard.
- **Attribution accuracy:** Play Store / App Store uses Install Referrer (deterministic). APK / H5 wrapper falls back to probabilistic attribution — match rates are materially lower; evaluate whether the reduced match rate is acceptable for your CPA target.
- **Skip when:** You don't have a mobile App at all (web-only funnel).

### 3. S2S Server Events — two tiers
Your back-office server sends conversion events directly to our S2S API. Fully programmatic. **Two flavors** — pick based on what you want to measure. Both share the same authentication and event contract, so you can start Basic and extend to Full incrementally.

#### 3a. S2S-Basic (reg + FTD only)
- **Use when:** You have engineering capacity but only need core acquisition metrics (registration, FTD). No revenue attribution or repeat-deposit tracking yet.
- **Delivery:** REST API subset (2 endpoints) · same contract as Full so upgrading later is drop-in.
- **What you get:** Reliable reg + FTD tracking through the S2S channel (more control than Partner Postback, less scope than Full).

#### 3b. S2S-Full (complete iGaming event catalog)
- **Use when:** You want cross-channel deduplication, revenue / repeat-deposit reporting, reconciliation, or plan to optimize for **high-LTV whales** — you need the revenue signal.
- **Delivery:** REST API (OpenAPI v3 spec planned) + optional PHP / Node SDK · reconciliation file drop.
- **Contract highlights:** never-4xx design · deduplication fallback chain · 30-day acceptance window · operator FTD claims accepted as `is_claimable` claims (not auto-canonicalized).
- **What you get:** Everything in Basic plus repeat deposits, revenue events, cross-channel dedup, and reconciliation.

### 4. Partner Postback
A URL you paste into your affiliate / back-office platform. That platform fires postbacks to us on registration / FTD.

- **Use when:** You use a SaaS affiliate platform (Affilka, Cellxpert, Smartico, MyAffiliates, NetRefer, etc.) and want same-day integration with zero engineering.
- **Skip when:** You need cross-channel deduplication with AppsFlyer or want to send arbitrary in-app events (upgrade to S2S).
- **Delivery:** Two postback URLs (registration + FTD) copied from our dashboard, pasted into your affiliate platform.

---

## Which method should I use?

Pick your row (how you run your back-office), then your column (where users convert).

| Back-office ownership | Web only | App only | Web + App |
|---|---|---|---|
| **Your own back-office** (in-house engineering) | **S2S + Web Tracker** (both required · snowwhite pattern) — S2S carries the events, Web Tracker captures the click-side signal | **S2S** primary · **AppsFlyer** for install attribution | **S2S + Web Tracker + AppsFlyer** (all three required) — S2S as canonical event stream, Web Tracker for click-side, AppsFlyer for App installs |
| **Affiliate / SaaS platform** (Affilka · Cellxpert · Smartico · MyAffiliates · NetRefer, etc.) | **Partner Postback** primary · **Web Tracker** for click-side capture | **Partner Postback** + **AppsFlyer** for install attribution | **Partner Postback + AppsFlyer** (both required) — Postback covers the platform side, AppsFlyer handles App installs |
| **Fastest start · no engineering** | **Partner Postback** (same day) | **AppsFlyer** only (accept App-side gap) | **Partner Postback + AppsFlyer** (both required) — start Postback for web + AppsFlyer for App installs |

**Cross-method notes**
- APK / H5-wrapped App distribution is supported via probabilistic attribution — match rates are lower than Play Store / App Store distribution (no Install Referrer).
- 30-day attribution window applies across all methods.
- `identifier` (SHA-256 email/phone) can be promoted to an attribution fallback join when `click_id` is missing.

---

## FAQ

**Which method is most accurate?**
Web Tracker and S2S give the highest fidelity because they don't depend on third-party matching. AppsFlyer is industry-standard for App attribution. Partner Postback is only as good as your affiliate platform's macro coverage.

**What if I send the same FTD through AppsFlyer *and* my back-office?**
Both are stored. The Integration Health Score surfaces conflicts. Cross-channel canonicalization policy is being finalized — until then, treat both signals as complementary and inspect divergences.

**Do you accept postbacks in local currency (INR / MYR / USDT)?**
Yes — we convert using our published exchange rates. No need to convert to USD first.

**Seconds vs milliseconds timestamps?**
We normalize automatically, but you will receive a loud integration warning if we detect ambiguity. Please stabilize on one format.

**Do you support test mode?**
Yes:
- Test keys route to a visible event stream, so you can self-validate without touching production traffic.
- `dryrun=1` on the S2S and postback endpoints parses, validates, and echoes back exactly what we would record — without storing.

**How do I know my integration is healthy?**
Each product page shows an **Integration Health Score** — `click_id` coverage · `event_id` presence · identity coverage · median event age at receipt · suggested-field completeness. A remediation list is surfaced with the CPA delta attached.

**Can I start with S2S-Basic and upgrade to S2S-Full later?**
Yes — that's the intended path. Same authentication, same event contract, additive fields. Upgrading is code-only, no re-onboarding.

---

## Getting started

1. Find your row in the "Which method should I use?" table above.
3. Open the corresponding method page: **Web Tracker · AppsFlyer · S2S Server Events · Partner Postback**.
4. If you want the fastest live path, start with **Partner Postback** (SaaS back-office) or **S2S-Basic** (own back-office) — you can extend to S2S-Full when you need revenue signal.

---

## Implementation notes (for docs site infra)

- **Sidebar:** the *MMP* section is currently missing on some pages. Update the sidebar template so *MMP* is visible from every page.
- **Order of sections:** put *Which method should I use?* directly under the four-method overview so readers hit the routing table before drilling into any single method.
- **Cross-links:** each of the four method pages should link back to this Overview from its own top-of-page nav.
- **Change history:** Integration tiers section removed (2026-09-10). Tiering is now embedded inside S2S (Basic vs Full); other methods do not tier.
