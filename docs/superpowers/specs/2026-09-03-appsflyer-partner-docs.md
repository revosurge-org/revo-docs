---
title: AppsFlyer partner docs — research and IA spec
description: Internal spec. Competitive survey of DSP AppsFlyer documentation (2026-09-02) and the recommended RevoSurge page tree, templates, and locked defaults.
---

# AppsFlyer partner docs — research and IA spec

**Status:** **v1 shipped 2026-09-03.** The pages under `MMP Integration → AppsFlyer` are now the source of truth. This file is kept as the competitive survey record (§7) and the open-questions tracker (§6). Where §2 and §3 conflict with what shipped, the shipped pages win — the conflicts are marked inline.

**Audience:** Docs / product / partner-ops. This was the source for the `{en,cn,hk}/mmp/appsflyer/` advertiser runbook.

**Survey date:** 2026-09-02. Twelve DSPs, public Help Centers and docs sites only.

**Positioning:** RevoSurge is a **non-SRN** performance DSP. Advertisers activate a partner tile in AppsFlyer and send postbacks; RevoSurge forwards the click to AppsFlyer itself, so advertisers generate **no** AppsFlyer tracking links and paste no URLs into RevoSurge. Do **not** copy Amazon / The Trade Desk SRN or “philosophy-only” docs as the main path.

---

## 1. What to ship — shipped 2026-09-03

Copied **Moloco’s split** (task pages, not one mega-article) and **Unity’s validation-as-docs**. Cost, Audiences, and agency matrices remain follow-ups.

English is the source of truth (`en/`). `cn/` and `hk/` shipped alongside it rather than after it, to keep the three locale sidebars in sync.

v1 landed as a **top-level `MMP Integration` sidebar section**, not under Tracking, so Adjust / Singular / Kochava can become sibling second-level entries without restructuring. Postback stays where it was, under Tracking.

```
{en,cn,hk}/mmp/appsflyer/
├── overview.md          # Two halves, required settings, three easily-confused IDs
├── postbacks.md         # Activate partner, lookbacks, default + in-app postbacks (9 steps)
├── click-forwarding.md  # Web tracker App ID + AdWave MMP source — replaces both link pages
├── macros.md            # What RevoSurge sends on the click, and how to reconcile the dashboards
├── permissions.md       # Named permissions, minimum-to-run vs recommended
├── validation.md        # 19 rules with stable IDs (AF-R-01…11, AF-O-01…08)
└── handoff.md           # Deliverables, go-live test, symptom→rule triage, change re-checks
```

Shipped sidebar (`.vitepress/config/{en,cn,hk}.ts`):

```
MMP Integration
└── AppsFlyer
      Overview
      Set up postbacks
      Click forwarding
      Macros
      Partner permissions
      Integration validation
      Handoff & go-live
```

### Changed from the original plan

| Planned | Shipped | Why |
|---|---|---|
| `tracking-links-ua.md` + `tracking-links-re.md` | `click-forwarding.md`, one page | RevoSurge builds and forwards the click itself, driven by the AppsFlyer App ID on the landing page’s web tracker plus a product-level MMP source in AdWave. Advertisers generate no AppsFlyer links, so the UA / RE split has nothing left to split. |
| `skan.md` | dropped | RevoSurge does not use SKAN. iOS attribution rests on probabilistic attribution ON + Advanced Privacy OFF, both of which are required rules. |
| Under `Tracking` | Top-level `MMP Integration` | Room for sibling MMPs later. |
| `index.md` | `overview.md` | Repo convention (`tracking/overview.md`, `supply/overview.md`). |
| `en/tracking/appsflyer/` | `{en,cn,hk}/mmp/appsflyer/` | Follows the new top-level section; mirrors `Supply (SSP Integration)` → `en/supply/`. |

Two additions the survey did not suggest:

- **Stable rule IDs** on the validation page (`AF-R-01`…`AF-R-11`, `AF-O-01`…`AF-O-08`) with explicit anchors, identical across all three locales — so RevoSurge dashboard errors can deep-link to `…/validation#af-r-07` without a per-language anchor table. This implements the last line of §3.7.
- **Symptom → rule triage** and **change → re-check** tables on the handoff page. The second one exists because this integration has no link to re-register: configuration drift produces no visible error, so the failure modes had to be enumerated.

Do **not** start with Appier’s advertiser × agency × campaign × product-line matrix. Add an agency page later only if the AppsFlyer console steps actually diverge.

---

## 2. Locked defaults (write these as required, not optional)

These defaults appear in every serious mobile DSP’s AppsFlyer runbook. They exist because optimization models need organic and unattributed events, not only RevoSurge-attributed ones.

> **Superseded in three rows.** Clicks-only forwarding makes *Install view-through attribution* and the *view-through lookback* inert for RevoSurge traffic — they shipped as recommended (`AF-O-04`), not launch-blocking. The lookback rows shipped as 7 days / 24 hours, set by the advertiser in the partner tile. The two link-type rows and the *Partner search name* row are superseded by `click-forwarding.md`. The shipped tiering is on the [validation page](/en/mmp/appsflyer/validation).

| Setting | Required value | Why |
|---|---|---|
| Activate partner | ON for as long as campaigns run | Off = no attribution, no postbacks |
| Advanced Privacy / Aggregated Advanced Privacy (iOS) | **OFF** | ON strips device id / click id from postbacks |
| Default postbacks (`Install`, `Re-engagement`) | **All media sources, including organic** | Train on attributed + unattributed + organic |
| In-app event postbacks | ON | — |
| In-app postback window | **Lifetime** (floor: 6 months) | Moloco / Unity / Remerge / InMobi iOS |
| In-app sending option | All media sources, including organic | Same as default postbacks |
| Revenue | **Values & revenue** on purchase / deposit / revenue events | ROAS |
| Install view-through attribution | ON | — |
| App Settings → probabilistic VTA | ON | Deterministic VT lookback is not enough |
| Click-through lookback | **7 days** (Unity floor: 2 days) | Align across networks |
| View-through lookback | **24 hours** (Unity floor: 7 days — pick one product rule and stick to it) | Align across networks |
| UA link type | Single-platform `app.appsflyer.com` | Retargeting toggle **OFF** |
| RE link type | OneLink + `is_retargeting=true` + deep link | Retargeting toggle **ON** |
| Partner search name | Exact RevoSurge tile name (TBD) | Advertisers must not pick a sibling tile |

State `pid` (AppsFlyer media source, e.g. `revosurge_int`) and any RevoSurge app-level key as **two different things** on the same page. Kayzen’s docs confuse these.

---

## 3. Page templates

> **Historical.** These templates were the input to v1. The shipped pages are the source of truth; read them, not this section, when editing. Kept for the reasoning behind each page’s shape.

### 3.1 Overview (`index.md`)

- One sentence: activate RevoSurge in AppsFlyer, share postbacks, register tracking links.
- Identity: non-SRN. There is **no** paste-less SRN query path.
- Decision table:

| I am | Campaign | Read |
|---|---|---|
| Advertiser | User acquisition | Postbacks → UA links → Macros → Handoff |
| Advertiser | Re-engagement | Postbacks → RE links → Macros → Handoff |
| Advertiser | iOS | Also SKAN + turn Advanced Privacy off |
| Agency | Either | Overview + Permissions; then the same link pages (`af_prt` on the link) |
| Anyone | After setup | Validation + Handoff |

- Two-column split (Moloco): **In AppsFlyer** vs **In RevoSurge**.
- Link to [Web Tracker AppsFlyer IDs](/en/tracking/web-tracker/install) for web-to-app only. Do not mix that into the MMP partner runbook.

### 3.2 Postbacks

How-to. AppsFlyer UI only.

1. Collaborate → Partner Marketplace → search **{tile name}** → Set up integration.
2. Activate partner ON.
3. Advanced Privacy OFF (iOS).
4. Fill RevoSurge credential(s) (TBD — InMobi-style `gpm_id` or Kayzen-style event API key).
5. View-through ON.
6. Default postbacks = all sources including organic.
7. In-app postbacks ON, window Lifetime, map funnel events (or Send all).
8. Values & revenue on monetization events.
9. Save.

Next: UA or RE links. Do not paste full tracking URLs here.

### 3.3 Tracking links — UA vs RE (two pages) — NOT SHIPPED

> **Dropped.** RevoSurge forwards the click itself; advertisers build no AppsFlyer links. Replaced by a single `click-forwarding.md`. The table below is retained only as a record of what other DSPs require.

Same skeleton, three knobs only:

| Knob | UA | RE |
|---|---|---|
| Link type | Single-platform | OneLink |
| Retargeting | OFF | ON + URI scheme / `af_dp` |
| Extra params | — | `is_retargeting=true`, `af_reengagement_window` |

Both pages: lookback, “skip custom params if the UI auto-fills the standard set”, copy click **and** impression URLs into RevoSurge, re-register after any change.

### 3.4 Macros

> **Shipped with a different audience.** Since advertisers no longer build URLs, `macros.md` shipped as a reporting and reconciliation reference for tracking/BI rather than a parameter dictionary for advertisers. The `af_prt` and impression-host guidance below did not ship.

Reference, not a click-path. Table: AppsFlyer parameter → RevoSurge macro → required on CT / VT → notes.

Must include sample URLs for Android click, Android impression, iOS click, iOS impression. Hosts:

- Click: `https://app.appsflyer.com/{app_id}`
- Impression: `https://impression.appsflyer.com/{app_id}`

Do **not** write “parameters are auto-populated” without this table (InMobi / Remerge gap).

### 3.5 Permissions

Named toggles, not a screenshot. Recommend:

- Ad network permissions ON (do not add extra team members unless required)
- Configure integration
- Configure in-app event postbacks
- Access aggregate conversions / in-app events / revenue
- View validation rules
- Access Protect360 dashboard and raw data (if the advertiser has it)

Minimum-to-run vs recommended-for-optimization, in one table.

### 3.6 SKAN — NOT SHIPPED

> **Dropped.** RevoSurge does not use SKAN (confirmed 2026-09-03). No SKAN page, no conversion value mapping, no transaction id sharing. Revisit only if that changes.

Own page. Do not bury this in postbacks.

- Conversion Studio on; pick Conversion or Custom.
- Event cap (AppsFlyer: six unique in-app events).
- Share SKAN transaction id ON if RevoSurge needs it.
- Who receives the mapping file (AM vs self-serve upload).
- Activity window guidance (InMobi: use the highest interval).

### 3.7 Validation (Unity pattern)

```
# AppsFlyer integration validation
Required rules          → blocks launch
Recommended rules       → does not block; hurts optimization
Required resolutions    → rule + AppsFlyer path + correct example
Recommended resolutions
```

Candidate required rules (tune after product confirms):

- RevoSurge app / campaign id in AppsFlyer matches the dashboard.
- Postback window = Lifetime.
- Click / view lookbacks meet the floors in §2.
- View-through attribution ON.
- Goal events carry values (purchase / deposit / revenue).
- AppsFlyer event names map to RevoSurge partner event names exactly.

Candidate recommended: send install and post-install events for all sources including organic.

Dashboard error copy should deep-link to the matching resolution (`rule_id`).

### 3.8 Handoff

Checklist, not another how-to:

- Screenshot of Integration + Permissions.
- Click URL + impression URL (UA and/or RE).
- SKAN mapping file if iOS.
- Agency: link contains `af_prt=`.
- Go-live: one install postback, then one in-app postback, within N days (Unity uses 2 / 7).

---

## 4. Writing rules (stolen from the survey)

1. **Campaign type decides link type — split UA / RE / (later) CTV.** Merging them overwrites the other’s toggles.
2. **Advertiser pages stay in AppsFlyer. RevoSurge pages stay in RevoSurge.** Connect with Next steps, not two UIs in one article.
3. **Macros are shared. Validation is per MMP.** When Adjust lands, clone the how-tos; keep one macro dictionary.
4. **Permissions and link parameters are text.** Screenshots are optional.
5. **Do not maintain two dashboard trees** (Unity’s `/user-acquisition/` vs `/grow/acquire/` debt).
6. **Do not put SKAN, Cost, and Permissions inside the link article.**
7. Product help can stay thin (“paste the S2S URL here”) only after this MMP runbook exists (Criteo pattern).

---

## 5. Suggested later pages (not v1)

| Page | When |
|---|---|
| Cost / ROI360 | When RevoSurge can push spend into AppsFlyer |
| CTV / `af_xplatform` | When CTV campaigns exist (Moloco: VT-only, lookback ≥ 24h) |
| Audiences | When list sharing is a product |
| Agency-only runbook | Only if advertiser vs agency consoles differ (Appier) |
| Adjust / Singular / Kochava | Clone the AppsFlyer section; thinner is fine |

---

## 6. Product questions

### Resolved

| # | Question | Answer | Confirmed |
|---|---|---|---|
| 2 | Advertiser credential: what is it, who issues it | **None exists.** There is no RevoSurge credential to paste into the AppsFlyer tile. The step was removed from `postbacks.md`. | 2026-09-03 |
| 4 | Click / view lookback floors | **Click-through 7 days, view-through 24 hours**, set by the **advertiser** in the partner tile’s attribution settings. The Unity-7d view-through figure was a survey data point, not a conflict in our own value. | 2026-09-03 |
| 7 | SKAN: auto-import vs upload, transaction id | **Not used.** See §3.6. | 2026-09-03 |
| 8 | Agency: is `af_prt` required, allowlist | **Not sent.** The forwarded click’s parameter set is complete and carries no `af_prt`, so AppsFlyer’s agency dimension stays empty for RevoSurge traffic. Agencies read performance from the advertiser’s AppsFlyer account or from RevoSurge. | 2026-09-03 |

Also settled while writing v1:

- **Impressions are not forwarded** — clicks only. `impression.appsflyer.com` is unused, and RevoSurge attribution in AppsFlyer is click-based.
- **`af_ad_id` intentionally carries the campaign ID** (`{cid}`), the same value as `af_c_id`, because there is no independent creative ID today. AppsFlyer’s Ad ID dimension therefore duplicates Campaign ID; creative-level breakouts exist only in RevoSurge reporting.
- **MMP source is a product-level setting in AdWave** — set once per product, not per campaign.
- **Probabilistic attribution is required, not recommended** (`AF-R-02`). The click reaches AppsFlyer from a browser, which cannot supply a device advertising ID, so deterministic matching alone leaves most installs unattributed. This is a stronger requirement for RevoSurge than for SDK-side partners.

### Still open

The public pages route each of these to “ask your RevoSurge contact”. Every one is a real gap for a self-serve advertiser.

| # | Question | Where it bites |
|---|---|---|
| 1 | Exact AppsFlyer **tile name** and **`pid`** (and any legacy pid to warn against) | `overview.md` “Before you start”; `postbacks.md` step 1; `macros.md` — the `pid` is needed to filter AppsFlyer reports down to RevoSurge traffic |
| 3 | **Partner event names** RevoSurge accepts | Highest-impact gap. Drives `postbacks.md` step 7, `AF-R-07`, and the handoff deliverable. A mismatch is delivered and then dropped as unrecognised — it looks identical to zero conversions |
| 5 | Self-serve vs AM handoff | Pages currently assume self-serve with AM fallback |
| 6 | Whether Advanced Privacy OFF is a legal/compliance decision we can require | Shipped as required (`AF-R-03`) with a “raise it with legal before launch, not at go-live” note |

The `pid` value is deliberately absent from the public pages and from this spec.

---

## 7. Research summary

### 7.1 Four documentation archetypes

| Archetype | Vendors | Split | Use for RevoSurge? |
|---|---|---|---|
| **A. MMP section → task articles** | Moloco, Remerge, Kayzen (AppsFlyer column) | Postback / UA / RE / Cost / Permissions | **Yes — v1** |
| **B. One long article per MMP** | InMobi, AppLovin, Smadex | OS / SKAN / links are chapters | Only if we cannot staff multiple pages |
| **C. Role × campaign × product line** | Appier AdCloud | Advertiser/Agency × UA/RE × DSP/FMP | Later, if tiles diverge |
| **D. Protocol / policy only; AF owns UI** | The Trade Desk, Liftoff, Amazon SRN | Own API / macros; AF Help Center for clicks | Not the advertiser path |

Unity = A plus a **validation** page and a cross-MMP fundamentals layer.  
Criteo = B+D: Commerce Growth only teaches “paste S2S URL”; MMP UI lives on `appdoc.criteotilt.com`.

### 7.2 Vendor notes and source URLs

**Moloco** — Fullest matrix. Hub in Get started; AppsFlyer section in Integrate with partners. UA = single-platform; RE = OneLink; CTV is a third page (`af_xplatform=true`). Shared macros + per-MMP validation.

- [MMP hub](https://help.moloco.com/hc/en-us/articles/17514299166615-How-to-integrate-with-a-mobile-measurement-partner-MMP)
- [Postbacks](https://help.moloco.com/hc/en-us/articles/4415083939991-How-to-set-up-postbacks-with-AppsFlyer)
- [UA links](https://help.moloco.com/hc/en-us/articles/4415073314711-How-to-set-up-AppsFlyer-tracking-links-for-User-Acquisition-UA-campaigns)
- [RE links](https://help.moloco.com/hc/en-us/articles/4415074498839-How-to-set-up-AppsFlyer-tracking-links-for-Re-engagement-RE-campaigns)
- [How Moloco validates AppsFlyer tracking links](https://help.moloco.com/hc/en-us/articles/8203544704535-How-Moloco-validates-AppsFlyer-tracking-links)
- [Macros](https://help.moloco.com/hc/en-us/articles/7568948361239-Available-tracking-link-macros)
- [CTV](https://help.moloco.com/hc/en-us/articles/17341427705495-How-to-set-up-Connected-TV-CTV-measurements-with-AppsFlyer)
- [SKAN CV](https://help.moloco.com/hc/en-us/articles/1500012981641-Register-SKAdNetwork-conversion-values)
- [Cost](https://help.moloco.com/hc/en-us/articles/4415090112663-How-to-integrate-cost-data-with-AppsFlyer)
- [Permissions](https://help.moloco.com/hc/en-us/articles/4415087528343-How-to-configure-ad-network-permission-settings-for-AppsFlyer)

**InMobi DSP** — One article per MMP. Only AppsFlyer has iOS + SKAN. Credential: AM-issued `gpm_id`. Permissions are screenshot-only (do not copy). CTA 7d / VTA 24h.

- [Integrate AppsFlyer with InMobi DSP](https://support.inmobi.com/dsp/global/inmobi-dsp-global/mmp-integrations-for-inmobi-dsp-global/mmp-integrations-for-ad-exchange-inventory-appsflyer)

**Unity Ads** — Hub + integrate + attribution links + **validation** (unique) + ad metrics. Dashboard blocks launch on required rules. Dual URL trees (`/user-acquisition/` vs `/grow/acquire/`) — do not clone.

- [Integrate AppsFlyer with Unity](https://docs.unity.com/en-us/user-acquisition/partner-integration/appsflyer/integrate-appsflyer-with-unity)
- [Integration validation](https://docs.unity.com/en-us/user-acquisition/partner-integration/appsflyer/integration-validation)

**AppLovin** — Hub + one long article per MMP (6 vendors). Event contract: `landing` / `checkout` / `postinstall`. Cost import only documented for AppsFlyer. No standalone SKAN page.

- [AppsFlyer](https://support.applovin.com/en/growth/promoting-your-apps/track-and-optimize/appsflyer)
- [Set up MMP tracking](https://support.applovin.com/en/growth/promoting-your-apps/track-and-optimize/set-up-mmp-tracking)
- [Tracking URL macros](https://support.applovin.com/en/growth/promoting-your-apps/track-and-optimize/tracking-url-macros)

**Remerge** — Retargeting-first. AppsFlyer section: Permissions → Postbacks → UA links → RE links → Audiences → Engaged Views → Historical Data. Finish line is “send to AM”, not self-serve verify.

- [AppsFlyer section](https://help.remerge.io/hc/en-us/sections/115000801145-AppsFlyer)
- [Postbacks](https://help.remerge.io/hc/en-us/articles/5028262839826-How-to-set-up-Postbacks-with-AppsFlyer)
- [UA links](https://help.remerge.io/hc/en-us/articles/10582510067612-How-to-set-up-AppsFlyer-tracking-links-User-Acquisition)
- [RE links](https://help.remerge.io/hc/en-us/articles/4751339430674-How-to-set-up-AppsFlyer-tracking-links-Retargeting)
- [Permissions](https://help.remerge.io/hc/en-us/articles/6347944589458-How-to-configure-ad-network-permission-settings-for-AppsFlyer)

**Smadex** — Six-page MMP-only site. UA article is a **data-sharing switch list** (NAD, raw revenue, disable Advanced Privacy). No SKAN page. Tracking links appear only on the CTV article.

- [AppsFlyer UA](https://docs.smadex.com/docs/set-up-appsflyer)
- [AppsFlyer CTV](https://docs.smadex.com/docs/appsflyer-ctv-integration)

**Kayzen** — AppsFlyer is the only MMP split into Integration / Links / Cost / Audience. `partner id` = event API key, distinct from `pid`. Integration footer does not link to the link-generation page.

- [Integration](https://help.kayzen.io/en/articles/2747545-integration-guide-for-appsflyer)
- [Tracking links](https://help.kayzen.io/en/articles/7974536-generate-appsflyer-tracking-links-for-your-campaign)
- [Cost](https://help.kayzen.io/en/articles/5771576-cost-integration-with-appsflyer)
- [Audiences](https://help.kayzen.io/en/articles/3540188-sharing-appsflyer-s-predefined-audience-segments-with-kayzen)

**Appier AdCloud** — Title-as-route: role × campaign × tile (`Appier` vs `Appier - Facebook Marketing Partner` vs `Appier Agency`). Root index has no chooser. OneLink is a shared child of RE.

- [AppsFlyer index](https://docs.adcloud.appier.com/app-campaign/appsflyer-integration)
- [AiBid UA — agencies](https://docs.adcloud.appier.com/app-campaign/appsflyer-integration/appsflyer-aibid-new-user-acquisition-campaign-for-agencies)

**Amazon Ads** — No public SRN handbook. Policy page is legacy `pid=amazon_int` Fire trackers. Event Manager announcements list Adjust / Kochava / Singular, not AppsFlyer. SRN (`amazondsp_int`) lives on AppsFlyer.

- [MMP measurement URLs](https://advertising.amazon.com/resources/ad-policy/mmp-measurement-urls)
- [AppsFlyer: Amazon Ads](https://support.appsflyer.com/hc/en-us/articles/11904659502737-Amazon-Ads-campaign-configuration)

**Criteo** — Help Center has no AppsFlyer article. [MMP hub](https://help.criteo.com/kb/guide/en/mobile-measurement-platforms-IPK5QDqCov/Steps/4895317) + [Set up MMP tracking](https://help.criteo.com/kb/guide/en/set-up-mmp-tracking-for-app-retargeting-wfiBra5jrs/Steps/5790596) teach the ad-set S2S field. Buttons leave the site for [appdoc AppsFlyer](https://appdoc.criteotilt.com/appsflyer/appsflyercriteointegration/).

**The Trade Desk** — Public “why” only: [Demystifying in-app measurement](https://www.thetradedesk.com/resources/demystifying-in-app-measurement). Open docs are a generic Conversion API. Configuration: [AppsFlyer: The Trade Desk](https://support.appsflyer.com/hc/en-us/articles/360000894849-The-Trade-Desk-campaign-configuration).

**Liftoff** — `docs.liftoff.io` has **no** AppsFlyer page. Protocol: [Augmenting MMP Data via S2S](https://docs.liftoff.io/advertiser/direct/liftoff-s2s-integration). UI: [AppsFlyer: Liftoff](https://support.appsflyer.com/hc/en-us/articles/209731633-Liftoff-campaign-configuration-in-AppsFlyer) and [Vungle Help postbacks](https://support.vungle.com/hc/en-us/articles/115002662928).

### 7.3 Gaps seen everywhere (fill these)

- No “start here” chooser (Moloco section order ≠ task order; Appier index is a disclaimer).
- “Auto-populated” links with no macro table.
- Permissions as screenshots only.
- SKAN stuffed into the postback article or omitted.
- Cost documented only for AppsFlyer, not other MMPs.
- No go-live test (install + one in-app event).
- `pid` vs DSP app key never explained side by side.

---

## 8. Out of scope for this spec

- ~~Implementing the public pages (blocked on §6)~~ — **shipped 2026-09-03**, see §1. Four of the eight §6 questions were answered along the way; four remain.
- AppsFlyer SDK / S2S event API (already covered under Tracking).
- ~~Web Tracker `androidAppsFlyerId` / `iOSAppsFlyerId`~~ — **now core to the integration**, not adjacent to it. The App ID on the landing page’s tracker is what makes click forwarding work; `click-forwarding.md` links to [Install](/en/tracking/web-tracker/install) for the field reference.
- Publishing this spec in locale sidebars or `llms.txt`. **Not currently honoured:** this file is built into the site and listed in `llms.txt`, as the earlier exchange-rate specs already were. Adding `srcExclude: ['docs/**']` to `.vitepress/config.mts` would enforce it.
