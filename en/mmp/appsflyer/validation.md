---
title: Integration validation
sidebar_label: Integration validation
description: Required and recommended validation rules for the RevoSurge AppsFlyer integration, each with a stable rule ID and the exact fix — what blocks launch, and what quietly costs performance.
---

# AppsFlyer integration validation

**Audience:** UA managers, advertisers, agencies, anyone signing off a launch

Run this page before you launch, and again whenever someone changes the AppsFlyer tile, the landing page, or your event list.

Rules come in two tiers:

- **Required** — the integration does not work, or delivers data RevoSurge cannot use. **Launch is blocked.**
- **Recommended** — the integration works, but optimization or support is degraded. **Launch is not blocked.**

> [!NOTE]
> Every setting listed in [Required settings at a glance](/en/mmp/appsflyer/overview#required-settings-at-a-glance) is required by RevoSurge. This page adds a second axis: which failures stop the integration from functioning, and which quietly cost you performance. A rule in the recommended tier is still a setting you are expected to fix — it just does not hold up a launch.

Each rule has a **stable ID**. RevoSurge dashboard errors reference these IDs and link to the matching resolution below, and the IDs are identical in every language of this page.

## Required rules

| ID | Rule | What breaks if it fails |
|---|---|---|
| [AF-R-01](#af-r-01) | Partner is activated on the RevoSurge tile | No attribution, no postbacks — nothing reaches RevoSurge |
| [AF-R-02](#af-r-02) | Probabilistic attribution is on (app-level) | Most RevoSurge installs land as organic; see the resolution for why this is severe here |
| [AF-R-03](#af-r-03) | Advanced Privacy is off (iOS apps) | Postbacks arrive without the device and click IDs, so they cannot be tied to the click that earned them |
| [AF-R-04](#af-r-04) | Click-through lookback is 7 days | Installs outside the shortened window are attributed elsewhere or to organic |
| [AF-R-05](#af-r-05) | The default install postback is enabled | RevoSurge receives no installs |
| [AF-R-06](#af-r-06) | In-app event postbacks are enabled | No post-install signal, so no conversion measurement and no optimization |
| [AF-R-07](#af-r-07) | AppsFlyer event names map exactly to RevoSurge partner event names | Postbacks are delivered and then dropped as unrecognised — indistinguishable from no conversions |
| [AF-R-08](#af-r-08) | Revenue events are set to Values & revenue | Events arrive without amounts; ROAS and value-based optimization are impossible |
| [AF-R-09](#af-r-09) | The web tracker is live on the landing page and the product shows Active | No click is forwarded, and the product cannot be selected in AdWave |
| [AF-R-10](#af-r-10) | An AppsFlyer App ID is set for every platform you promote | No click is forwarded for that platform; AppsFlyer records the installs as organic |
| [AF-R-11](#af-r-11) | The product's MMP source in AdWave is AppsFlyer | No click is forwarded, whatever the landing page carries |

## Recommended rules

| ID | Rule | What it costs |
|---|---|---|
| [AF-O-01](#af-o-01) | In-app event postback window is Lifetime (floor: 6 months) | Later-funnel events fall outside the window and never train the model |
| [AF-O-02](#af-o-02) | Default postbacks send all media sources, including organic | Optimization runs against RevoSurge's own output, with no baseline to compare against |
| [AF-O-03](#af-o-03) | In-app postbacks send all media sources, including organic | Same, for post-install events |
| [AF-O-04](#af-o-04) | View-through attribution is on, with a 24-hour view-through lookback | Nothing today — configuration hygiene; see the resolution |
| [AF-O-05](#af-o-05) | RevoSurge holds the three aggregate read permissions | Every discrepancy becomes an exchange of screenshots |
| [AF-O-06](#af-o-06) | RevoSurge holds the two configure permissions | Every fix routes through your team as written instructions |
| [AF-O-07](#af-o-07) | RevoSurge holds View validation rules | A misconfiguration is found after it has cost spend, not before |
| [AF-O-08](#af-o-08) | RevoSurge has Protect360 access, if you own Protect360 | Fraudulent installs look like installs that never happened, so the source keeps getting bought |

## Required resolutions

### AF-R-01 — Partner is not activated {#af-r-01}

**Fix:** Collaborate → Partner Marketplace → RevoSurge tile → Integration → set **Activate partner** to **ON**.

Leave it on for as long as campaigns run. Switching it off is a disconnect, not a pause.

### AF-R-02 — Probabilistic attribution is off {#af-r-02}

**Fix:** App Settings for the app → enable **probabilistic attribution** (formerly "fingerprinting"). This is app-level, not inside the RevoSurge tile.

**Why this is required rather than recommended:** RevoSurge clicks reach AppsFlyer from your landing page in a **browser**, and a browser cannot supply the device advertising ID a deterministic match needs. With this off, deterministic matching catches a small fraction of genuine installs and the rest arrive as organic — the integration is technically working and materially useless.

### AF-R-03 — Advanced Privacy is on {#af-r-03}

**Fix:** RevoSurge tile → Integration → set **Advanced Privacy**, and **Aggregated Advanced Privacy** if your account shows it, to **OFF**. iOS apps only.

If your legal or compliance team owns this setting, resolve it with them before launch rather than at go-live.

### AF-R-04 — Click-through lookback is shorter than 7 days {#af-r-04}

**Fix:** RevoSurge tile → attribution settings → set **click-through lookback** to **7 days**.

If your other partners run different windows, raise it with your RevoSurge account manager instead of changing this unilaterally — mismatched windows surface as a discrepancy between dashboards, not as an error.

### AF-R-05 — The default install postback is off {#af-r-05}

**Fix:** RevoSurge tile → **Default postbacks** → enable **Install**.

Also enable **Re-engagement** while you are here. For the sending option, see [AF-O-02](#af-o-02).

### AF-R-06 — In-app event postbacks are off {#af-r-06}

**Fix:** RevoSurge tile → turn **in-app event postbacks** to **ON**, then map your funnel events.

AdWave campaigns optimize toward a target event (Register or Deposit). Without in-app postbacks that event never arrives, so the campaign has nothing to optimize against.

### AF-R-07 — Event names do not match {#af-r-07}

**Fix:** RevoSurge tile → in-app event postback mapping → map each AppsFlyer event to the exact RevoSurge partner event name your account manager gave you.

Matching is exact and case-sensitive: `deposit` and `Deposit` are two different events. A mismatch does not error — the postback is delivered, then dropped as unrecognised, which looks identical to "no conversions" on your dashboard. If your app has never fired an event, it will not appear in the mapping screen at all; fix that on your side first.

### AF-R-08 — Revenue events carry no values {#af-r-08}

**Fix:** RevoSurge tile → in-app event postback mapping → for every purchase, deposit, or revenue event, set the value option to **Values & revenue**.

Required for any campaign with a deposit, purchase, or revenue goal. Non-monetary events can stay on values-only.

### AF-R-09 — The web tracker is not live {#af-r-09}

**Fix:** Install the tracker on your landing page — see [Install the Web Tracker](/en/tracking/web-tracker/install) — and confirm the product reads **Active** under **Manage Product**.

A product stays Inactive until its tracker receives its first event, and an inactive product cannot be selected in the AdWave campaign flow. Check the tracker also fires on every route that RevoSurge traffic can land on, not just the page you tested.

### AF-R-10 — An AppsFlyer App ID is missing {#af-r-10}

**Fix:** In the web tracker init on your landing page, set `androidAppsFlyerId` and/or `iOSAppsFlyerId` — see [Click forwarding](/en/mmp/appsflyer/click-forwarding#set-app-id).

Set the platforms you actually promote; the two fields are independent. This failure is silent on both dashboards: RevoSurge shows clicks, AppsFlyer shows the installs as organic.

### AF-R-11 — The MMP source in AdWave is not AppsFlyer {#af-r-11}

**Fix:** In RevoSurge, open the product in AdWave and set **MMP source** to **AppsFlyer**.

Product-level, set once per product. Unset — or set to a different MMP — and the App ID on your landing page is never used.

## Recommended resolutions

### AF-O-01 — Postback window is shorter than Lifetime {#af-o-01}

**Fix:** RevoSurge tile → set the **in-app event postback window** to **Lifetime**. If your account cannot select it, the floor is **6 months**.

### AF-O-02 — Default postbacks are restricted to this partner {#af-o-02}

**Fix:** RevoSurge tile → **Default postbacks** → set the sending option on **Install** and **Re-engagement** to **all media sources, including organic** (AppsFlyer wording: events attributed to any partner *or* organic).

Restricting postbacks to RevoSurge-attributed events leaves our models optimizing against their own output, with no unattributed or organic baseline to separate the volume we caused from the volume that would have happened anyway.

### AF-O-03 — In-app postbacks are restricted to this partner {#af-o-03}

**Fix:** Same screen, in-app event section — set the **sending option** to **all media sources, including organic**.

### AF-O-04 — View-through attribution is off {#af-o-04}

**Fix:** RevoSurge tile → set **Install view-through attribution** to **ON** and the **view-through lookback** to **24 hours**.

RevoSurge forwards **clicks only**, so this changes nothing about how your current RevoSurge traffic is attributed. It is in the set so the tile does not need revisiting later. View-through installs attributed to RevoSurge should be **zero** — that is expected, not a failure.

### AF-O-05 — RevoSurge lacks aggregate read access {#af-o-05}

**Fix:** RevoSurge tile → **Permissions** → grant **Access aggregate conversions**, **in-app events**, and **revenue**. See [Partner permissions](/en/mmp/appsflyer/permissions).

Without it we see only what postbacks delivered, so we cannot tell a genuine attribution gap from a postback that never arrived.

### AF-O-06 — RevoSurge cannot configure the tile {#af-o-06}

**Fix:** RevoSurge tile → **Permissions** → grant **Configure integration** and **Configure in-app event postbacks**.

### AF-O-07 — RevoSurge cannot see validation rules {#af-o-07}

**Fix:** RevoSurge tile → **Permissions** → grant **View validation rules**.

### AF-O-08 — RevoSurge has no Protect360 access {#af-o-08}

**Fix:** RevoSurge tile → **Permissions** → grant **Access Protect360 dashboard and raw data**. Applies only if you own Protect360.

## Two things this page cannot check

- **Whether real traffic flows end to end.** Every rule above is a configuration check. Passing all of them proves the setup is correct, not that a click produced an install postback. That test belongs to Handoff & go-live.
- **Discrepancies between the two dashboards.** Some difference is by design — see [Reconciling AppsFlyer against RevoSurge](/en/mmp/appsflyer/macros#reconciling-appsflyer-against-revosurge) before opening a ticket.

## Next steps

Rules green? Continue to [Handoff & go-live](/en/mmp/appsflyer/handoff) — it lists what to send your account manager, the end-to-end test that proves real traffic works, and the later changes that will silently break this setup.
