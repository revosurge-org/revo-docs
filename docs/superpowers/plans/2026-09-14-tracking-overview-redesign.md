# Tracking Overview Redesign — Implementation Plan

> **For agentic workers:** Steps use checkbox (`- [ ]`) syntax for tracking. Content authority is `docs/prd-spec/Tracking_Overview_2026-09-09.md`; layout/visual authority is `docs/prd-spec/Tracking_Overview_Prototype_v2_EN_2026-09-09.html`.

**Goal:** Replace the Tracking Overview page in all three locales with a decision-first page covering the four ingestion methods (Web Tracker · AppsFlyer · S2S Server Events · Partner Postback), and reorganize the Tracking sidebar group so those four methods are the numbered children — with AppsFlyer nested in from the current top-level *MMP Integration* group.

**Architecture:** One new globally-registered Vue component (`TrackingMethodPicker.vue`) carries the interactive 2-question decision helper and the 3×3 recommendation matrix in all three languages. Everything else — scenario cards, method cards, FAQ, routing matrix — stays in Markdown so it remains indexable by VitePress local search and by `llms-full.txt`, using a small set of new CSS classes appended to `.vitepress/theme/style.css`. Sidebar changes are config-only; no page files move, so no published URL changes.

**Tech Stack:** VitePress 2 (alpha), Vue 3 `<script setup lang="ts">`, VitePress theme CSS variables, npm (`npm run dev`, `npm run build`, `npm run generate:og`)

---

## Confirmed decisions

| Decision | Choice |
|---|---|
| Locale scope | `en` + `cn` + `hk`, all in this change |
| Sidebar | Regroup only — AppsFlyer nests under Tracking, files stay at `{locale}/mmp/appsflyer/*`, all existing URLs keep working |
| Visual fidelity | Vue component for the decision helper + CSS classes driven by VitePress theme variables (no hard-coded prototype purple, dark mode must work) |
| Existing page content | Whole-page replacement — old *What tracking is used for / Event basics / Where tracking shows up* sections are dropped (already covered by `web-tracker.md` and `s2s/overview.md`) |

## Preconditions

Resolve these before Task 4 (they only block the bottom CTA and the meta grids, not the rest of the page):

- [ ] **"Talk to us" target.** The prototype ends with a prominent *Talk to us →* CTA. There is currently **no** support/contact URL anywhere in `en/`, `cn/`, or `hk/`. Confirm the real target (BD email, Slack invite, or a support page). **Fallback if unresolved:** render the closing block as text without a link rather than shipping a dead CTA.
- [ ] **Effort estimates.** The prototype's `Effort` meta values (`~1 day · frontend only`, `~2 hours · landing-page config`, `Basic ~3-5 days · Full ~1-2 weeks`, `Same day · no engineering`) appear **only** in the prototype — they are not in the standard Markdown spec. Confirm they are accurate before publishing, since advertisers will plan against them. **Fallback if unresolved:** drop the `Effort` cell and render a 3-cell meta grid (Best for / Skip if / Delivery).

## Source conflicts and how they are resolved

The two source documents disagree in a few places. Resolutions below; flag any you disagree with before implementation starts.

1. **Section order.** The Markdown spec's implementation note asks for the routing table "directly under the four-method overview". The prototype instead leads with the decision helper. → **Prototype order wins** (helper → scenarios → methods → full routing matrix → FAQ). This satisfies the spec's stated intent ("readers hit routing before drilling into any single method") more strongly, and the full 3×3 matrix still lands immediately after the method cards.
2. **OpenAPI status.** Prototype says "REST API (OpenAPI v3)"; spec says "OpenAPI v3 spec planned". → **Spec wins:** "(planned)".
3. **FAQ count.** Spec has 6 questions; prototype has 7 (extra: "APK / H5-wrapper Apps — is that supported?"). → **Include all 7.** The extra one is additive, not contradictory.
4. **Broken numbering.** The spec's *Getting started* list is numbered 1, 3, 4. → Renumber 1–3.
5. **Postback delivery wording.** Spec: "two postback URLs copied from our dashboard"; prototype: "2 postback URLs (reg + FTD) · self-serve slug + key". → Merge both facts.
6. **Sidebar "MOVED" badge.** The prototype marks AppsFlyer with a green `MOVED` badge. VitePress sidebar items do not support badges. → **Skip it.** Reorganization is self-evident once the group is numbered.
7. **Spec note "MMP section is missing on some pages."** Not reproducible — the sidebar is a `SidebarMulti` keyed on `/en/`, `/cn/`, `/hk/`, so the MMP group already renders on every page in its locale. Nesting AppsFlyer under Tracking keeps it visible everywhere. → **No separate fix needed;** this note is closed by Task 2.

## File map

**Create**
- `.vitepress/theme/components/TrackingMethodPicker.vue` — the 2-question decision helper: question/option labels, the 9-key recommendation matrix, selection state, result panel, and anchor CTA. Self-contained i18n for `en` / `cn` / `hk`.

**Modify**
- `en/tracking/overview.md`, `cn/tracking/overview.md`, `hk/tracking/overview.md` — full rewrite to the new structure (see below).
- `.vitepress/config/en.ts`, `.vitepress/config/cn.ts`, `.vitepress/config/hk.ts` — Tracking group regrouped to the numbered 4-method structure; top-level MMP group removed.
- `.vitepress/theme/index.ts` — globally register `TrackingMethodPicker` alongside the existing three components.
- `.vitepress/theme/style.css` — append a labeled `Tracking Overview` section with the new page classes. (This file already carries page-specific overrides for `exchange-rates` and `rate-converter`, so the convention holds.)

**Untouched (deliberately)**
- `en|cn|hk/mmp/appsflyer/*` — no moves, no renames. Published `/{locale}/mmp/appsflyer/*` URLs and every existing cross-link stay valid.
- `docs/prd-spec/*` — source documents, excluded from the build via `srcExclude: ['docs/**']`.

## Target page structure

Anchor IDs are fixed because the decision helper and scenario cards link to them.

| # | Section | Anchor | Source | Form |
|---|---|---|---|---|
| — | H1 + subtitle | — | Prototype `h1` / `subtitle` | Markdown |
| 1 | Which method is right for you? | `#decide` | Prototype helper; matrix from spec's 3×3 table | `<TrackingMethodPicker lang="en" />` |
| 2 | Or browse by scenario | `#scenarios` | Prototype 4 scenario cards | Markdown + `.scenario-grid` HTML |
| 3 | The 4 methods | `#methods` | Spec §"The four methods" | Markdown H3s inside `.method` wrappers |
| 3a | Web Tracker | `#web-tracker` | Spec 1 | " |
| 3b | AppsFlyer | `#appsflyer` | Spec 2 | " |
| 3c | S2S Server Events (+ Basic / Full subtiers) | `#s2s` | Spec 3, 3a, 3b | " + `.method-subtier` |
| 3d | Partner Postback | `#partner-postback` | Spec 4 | " |
| 3e | APK / H5 attribution warning | — | Spec cross-method note; prototype warn callout | `::: warning` |
| 4 | Full routing matrix | `#matrix` | Spec §"Which method should I use?" | Markdown table + cross-method notes |
| 5 | FAQ | `#faq` | Spec FAQ (6) + prototype FAQ 7 | `::: details` per question |
| 6 | Getting started | `#getting-started` | Spec §"Getting started", renumbered | Markdown |
| 7 | Still not sure? | `#support` | Prototype bottom CTA | `.bottom-cta` HTML — see Preconditions |

**Why the matrix stays in Markdown:** VitePress local search and the `llms-full.txt` output only see Markdown source. Content that lives solely inside a `.vue` file is invisible to both. Keeping the full 3×3 table on the page means the routing logic is still searchable and still reaches LLM consumers, with the component acting purely as an interactive shortcut over the same data.

### Method card markup shape

Each method uses a wrapper div with a blank line after the opening tag, so markdown-it still parses the inner content as Markdown (HTML block type 6 terminates at a blank line):

```markdown
<div class="method">

### 🌐 Web Tracker <Badge type="info" text="Web" /> {#web-tracker}

<p class="method-tagline">First-party JS on your landing page &amp; advertiser site.</p>

Fires conversion events (registration, deposit, FTD) as users move through your web
funnel. Persists `click_id` in a first-party cookie (1-year expiry) — a user who lands,
bounces, and returns 3 days later still attributes.

<div class="method-meta">
  <div class="meta-item"><span class="meta-label">Best for</span>Web-only funnels, no server integration available</div>
  <div class="meta-item"><span class="meta-label">Skip if</span>Your funnel lives inside a mobile App</div>
  <div class="meta-item"><span class="meta-label">Delivery</span>JS snippet + GTM template (planned)</div>
  <div class="meta-item"><span class="meta-label">Effort</span>~1 day · frontend only</div>
</div>

<a class="method-cta" href="/en/tracking/web-tracker/install">Start with Web Tracker →</a>
<a class="method-cta-secondary" href="/en/tracking/web-tracker/reference">See SDK reference</a>

</div>
```

Explicit `{#anchor}` IDs are required — without them VitePress would slugify the emoji and Badge into the auto-generated ID and break the helper's links.

### CTA link targets

| Method | Primary | Secondary |
|---|---|---|
| Web Tracker | `/{locale}/tracking/web-tracker/install` | `/{locale}/tracking/web-tracker/reference` |
| AppsFlyer | `/{locale}/mmp/appsflyer/overview` | `/{locale}/mmp/appsflyer/validation` |
| S2S | `/{locale}/tracking/s2s/overview` | `/{locale}/tracking/s2s/v3/server-events-api` |
| Partner Postback | `/{locale}/tracking/postback/partner-postback` | `/{locale}/tracking/postback/partner-postback#parameters` |

The prototype's Partner Postback secondary CTA reads "Platform macro map"; `partner-postback.md` has no `#macros` heading, so it points at `#parameters`, which is where the macro parameters are documented.

## Target sidebar structure

Applied identically in `en.ts` / `cn.ts` / `hk.ts` with localized labels:

```
Tracking                          → /{locale}/tracking/overview
├─ Overview · Which one to use?   → /{locale}/tracking/overview
├─ 1. Web Tracker                 → /{locale}/tracking/web-tracker          [collapsed]
│    ├─ Install
│    └─ Web Tracker SDK Reference
├─ 2. AppsFlyer (App MMP)         → /{locale}/mmp/appsflyer/overview        [collapsed]
│    ├─ Overview
│    ├─ Set up postbacks
│    ├─ Click forwarding
│    ├─ Macros
│    ├─ Partner permissions
│    ├─ Integration validation
│    └─ Handoff & go-live
├─ 3. S2S Server Events           → /{locale}/tracking/s2s/overview         [collapsed]
│    ├─ Overview
│    ├─ Server Events API (v2)
│    └─ Server Events API (v3)    (existing nested children unchanged)
└─ 4. Partner Postback            → /{locale}/tracking/postback/partner-postback  [collapsed]
     └─ Partner Postback API

(top-level "MMP Integration" group — REMOVED)
```

**Judgment call to confirm:** the four method subgroups get `collapsed: true`. Today Web Tracker / S2S / Postback are always expanded; folding AppsFlyer's 7 pages in on top of that would make the Tracking group roughly 20 rows tall and bury every group below it. VitePress auto-expands a collapsed group that contains the active link, so a reader inside AppsFlyer still sees its siblings. Say so if you'd rather keep everything expanded.

Localized group labels: `cn` — `1. Web 追踪器` / `2. AppsFlyer（App MMP）` / `3. S2S 服务器事件` / `4. Partner Postback`; `hk` — Traditional equivalents matching the existing `hk.ts` wording.

## Component spec — `TrackingMethodPicker.vue`

- **Props:** `lang?: 'en' | 'cn' | 'hk'` (default `'en'`), matching the `EventPayloadExplorer` / `CreativePreviews` convention already used in Markdown pages.
- **State:** `backOffice: 'own' | 'saas' | 'none' | null`, `funnel: 'web' | 'app' | 'both' | null`. The result panel appears only once both are answered.
- **Matrix:** 9 keys (`own-web` … `none-both`). Values are `{ method, why, anchor }`. English and Simplified Chinese copy is lifted verbatim from the prototype's `rec` object — it already matches the spec's 3×3 table cell for cell. `hk` is a Traditional Chinese conversion of `cn` (the prototype aliases `rec.hk = rec.cn`; we ship real Traditional copy instead).
- **Result CTA:** anchors to `#s2s`, `#partner-postback`, or `#appsflyer` per the matrix.
- **Accessibility:** options are `<button type="button">` with `aria-pressed`, not the prototype's clickable `<div>`s; the result panel gets `aria-live="polite"`.
- **Styling:** scoped CSS using `--vp-c-brand-*`, `--vp-c-bg-soft`, `--vp-c-divider`, `--vp-c-text-1/2`. Options grid is `repeat(3, 1fr)`, collapsing to a single column under 640px.
- **No `scrollIntoView`.** The prototype smooth-scrolls to the result; on a docs page with a sticky nav that fights the reader. The panel is directly below the questions and needs no scroll.

## CSS spec — appended to `.vitepress/theme/style.css`

One labeled section, all colors from theme variables so light and dark both work:

- `.vp-doc .method` — card container; `--vp-c-bg`, 1px `--vp-c-divider`, 14px radius.
- `.vp-doc .method h3` — cancel the `vp-doc` h3 top margin inside cards (same override pattern already used for `.exchange-rates__title`).
- `.method-tagline` — `--vp-c-text-2`, 13px.
- `.method-meta` / `.meta-item` / `.meta-label` — 2-col grid on `--vp-c-bg-soft`, single column under 640px.
- `.method-subtier` / `.method-subtier-title` / `.method-subtier-desc` — S2S Basic/Full blocks; left border `--vp-c-brand-1`.
- `.method-cta` / `.method-cta-secondary` — reuse `--vp-button-brand-bg` / `--vp-button-brand-hover-bg` so buttons match the rest of the site.
- `.scenario-grid` / `.scenario-card` / `.scenario-arrow` — 2-col grid, single column under 640px; hover lifts border to `--vp-c-brand-1`.
- `.bottom-cta` — dark gradient panel; flex row that wraps to a column under 640px.

Every rule is prefixed `.vp-doc` where it must beat default `vp-doc` typography. Do not introduce new raw hex brand colors — the prototype's `#7c3aed` is replaced by `--vp-c-brand-1` throughout.

## Test strategy

No automated frontend test harness exists in this repo, and this change should not add one. `npm run build` is the compile/regression gate; `npm run dev` is the manual verification surface.

- [ ] `npm run build` completes with no errors for all three locales.
- [ ] Every internal link on the three new pages resolves (VitePress dead-link check runs during build).
- [ ] Manual: decision helper produces the correct recommendation for all 9 combinations, in all 3 locales.
- [ ] Manual: dark mode — cards, meta grid, subtiers, CTAs, and the bottom panel are all legible.
- [ ] Manual: ~400px viewport — grids collapse to one column, no horizontal page scroll.
- [ ] Manual: the right-hand outline lists the 4 method H3s (config is `outline: { level: [2, 3] }`).
- [ ] Manual: sidebar shows the numbered 4-method Tracking group and no top-level MMP group, in all 3 locales; an AppsFlyer page auto-expands its subgroup.
- [ ] Confirm `/llms.txt` and `/llms-full.txt` still build and that the new Overview content appears in `llms-full.txt`.

---

## Task 1: Component and registration

**Files:** Create `.vitepress/theme/components/TrackingMethodPicker.vue` · Modify `.vitepress/theme/index.ts` · Test: `npm run build`

- [ ] **Step 1:** Create the component shell with the `lang` prop, the two question blocks, and an empty result panel. Hard-code English copy first.
- [ ] **Step 2:** Add the 9-key recommendation matrix for `en`, sourced from the spec's 3×3 table. Wire selection state and the result panel.
- [ ] **Step 3:** Add `cn` copy (verbatim from the prototype's `rec.cn` and `i18n.cn`) and `hk` copy (Traditional conversion).
- [ ] **Step 4:** Add scoped CSS using theme variables; verify light/dark and the 640px breakpoint.
- [ ] **Step 5:** Register globally in `.vitepress/theme/index.ts` next to `HttpMethod` / `EventPayloadExplorer` / `CreativePreviews`.
- [ ] **Step 6:** `npm run build`.

## Task 2: Sidebar regrouping

**Files:** Modify `.vitepress/config/en.ts`, `.vitepress/config/cn.ts`, `.vitepress/config/hk.ts` · Test: `npm run build`

- [ ] **Step 1:** In `en.ts`, renumber the Tracking children, insert the AppsFlyer subgroup as item 2 pointing at `/en/mmp/appsflyer/*`, and add `collapsed: true` to the four method subgroups.
- [ ] **Step 2:** Delete the top-level `MMP Integration` group from `en.ts`.
- [ ] **Step 3:** Repeat for `cn.ts` and `hk.ts` with localized labels.
- [ ] **Step 4:** `npm run build`, then `npm run dev` and confirm the sidebar in all three locales, including auto-expansion on an AppsFlyer page.

## Task 3: CSS

**Files:** Modify `.vitepress/theme/style.css` · Test: `npm run build`

- [ ] **Step 1:** Append the labeled `Tracking Overview` section with the classes listed in the CSS spec above.
- [ ] **Step 2:** Verify against a scratch page in `npm run dev` in both color schemes before the real pages exist.

## Task 4: English page

**Files:** Modify `en/tracking/overview.md` · Test: `npm run build`

- [ ] **Step 1:** Replace frontmatter — `title: Tracking Overview`, description from the prototype subtitle.
- [ ] **Step 2:** Write H1, subtitle, and `<TrackingMethodPicker lang="en" />` under `## Which method is right for you? {#decide}`.
- [ ] **Step 3:** Add the scenario grid (`#scenarios`).
- [ ] **Step 4:** Add the four method cards (`#methods` + the four method anchors) with meta grids, S2S subtiers, and CTAs. Apply the Preconditions fallbacks if unresolved.
- [ ] **Step 5:** Add the `::: warning` APK / H5 callout.
- [ ] **Step 6:** Add the full routing matrix (`#matrix`) with the three cross-method notes.
- [ ] **Step 7:** Add all 7 FAQ entries as `::: details` blocks (`#faq`).
- [ ] **Step 8:** Add *Getting started* (`#getting-started`, renumbered 1–3) and the closing block (`#support`).
- [ ] **Step 9:** `npm run build`; verify every anchor the helper and scenario cards target actually exists.

## Task 5: Chinese pages

**Files:** Modify `cn/tracking/overview.md`, `hk/tracking/overview.md` · Test: `npm run build`

- [ ] **Step 1:** Port the English page to `cn`, reusing the prototype's `i18n.cn` strings wherever they exist; translate the rest (method bodies, routing matrix, FAQ, Getting started) in the register of the existing `cn/tracking/*` pages. Set `lang="cn"` on the component and switch all CTA hrefs to `/cn/`.
- [ ] **Step 2:** Produce `hk` as Traditional Chinese matching existing `hk/` terminology — not a raw character conversion of `cn`. Set `lang="hk"`, CTA hrefs to `/hk/`.
- [ ] **Step 3:** `npm run build`; confirm no dead links in either locale.

## Task 6: OG images and final verification

**Files:** `public/og/{en,cn,hk}/tracking/overview.png` · Test: `npm run build`

- [ ] **Step 1:** `npm run generate:og` — the page title and description both changed, so the existing OG cards are stale.
- [ ] **Step 2:** Walk the full manual checklist in *Test strategy*.
- [ ] **Step 3:** Confirm `/llms-full.txt` contains the new Overview body.

---

## Out of scope / follow-ups

- **Moving `mmp/appsflyer/*` under `tracking/`.** Deliberately not done — sidebar grouping alone achieves the information architecture without breaking published URLs. Revisit only with a redirect plan.
- **Back-links from the four method pages to this Overview.** The spec asks each method page to link back from its own top-of-page nav. That touches 4 pages × 3 locales and is a separate change; file it as a follow-up.
- **Integration Health Score.** Referenced in two FAQ answers but has no docs page yet. FAQ text describes it without linking.
- **GTM template, OpenAPI v3 spec, PHP/Node SDKs, reconciliation file drop.** All marked "planned" in the spec; the page says so rather than linking.
- **Cross-channel canonicalization policy.** Explicitly "being finalized" in the spec; the FAQ carries that wording as-is and will need an update when the policy lands.
