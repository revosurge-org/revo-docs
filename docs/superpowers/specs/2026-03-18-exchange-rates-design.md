# Monthly Exchange Rates Page Design

## Summary

Add one English documentation page that displays a monthly exchange-rate table. The data will not be fetched during the VitePress build. Instead, an internal DAG will periodically fetch the private source data, transform it into static JSON files, and publish those files to a CDN. The docs page will load the latest month at runtime in the browser, allow the reader to switch months, and render the full rate table for the selected month.

This design is intentionally narrow. It does not introduce a shared data layer or a reusable cross-page component system. It implements one page-specific feature with one page-specific Vue component.

## Context

This repository is a static VitePress site deployed to GitHub Pages. The current deployment workflow runs on GitHub-hosted runners and builds static output only. That environment should not be responsible for reaching private Kubernetes services.

The chosen integration model is:

1. Internal DAG fetches private API data on a schedule.
2. DAG writes frontend-ready JSON to a CDN.
3. The docs page reads the CDN JSON at runtime in the browser.

This keeps private network access, authentication, and API shaping outside the docs repository.

## Goals

- Show a monthly exchange-rate table on one docs page.
- Default to the latest available month.
- Allow users to switch months and see the full dataset for that month.
- Keep the docs site purely static and browser-driven for this feature.
- Keep the implementation simple and local to this page.

## Non-Goals

- No build-time fetch from the exchange-rate data source.
- No GitHub Actions access to private Kubernetes services.
- No generic shared data-fetching framework.
- No global component registration for this feature.
- No charting, CSV export, filtering, or search in the first version.
- No Simplified Chinese or Traditional Chinese versions in the first version.
- No compatibility layer for multiple JSON schema versions.

## File Layout

The implementation will use these files:

- `en/api/exchange-rates.md`
- `.vitepress/theme/components/ExchangeRatesTable.vue`
- `.vitepress/config/en.ts`

`en/api/exchange-rates.md` will contain the page copy, import the page-specific component locally, and pass one required prop: `indexUrl`. `.vitepress/config/en.ts` will add the page to the English sidebar. The component will not be registered globally in `.vitepress/theme/index.ts`.

## Runtime Architecture

The page will import `ExchangeRatesTable.vue` and render it once. The component will accept one required prop, `indexUrl`, which points to the CDN index file. The component will derive monthly file URLs from the same directory as `indexUrl`. The component will own the runtime behavior for this page:

1. On client mount, request the CDN `index.json`.
2. Read the latest month and the available month list from that file.
3. Select the latest month by default.
4. Request the selected month JSON file.
5. Render the month metadata and the full rate table.
6. When the user changes the month, request the corresponding month JSON file and re-render the table.

The component will perform all network requests in the browser only. It will not fetch during SSR or the static build.

## CDN Data Contract

The docs page will consume two JSON shapes.

### Index file

Location pattern:

`https://<cdn-host>/exchange-rates/index.json`

Required shape:

```json
{
  "latestMonth": "2026-03",
  "months": ["2026-03", "2026-02", "2026-01"]
}
```

Rules:

- `latestMonth` is required and must match one entry in `months`.
- `months` is required and contains month identifiers in `YYYY-MM` format.
- The page will sort the months in descending lexicographic order before rendering. `YYYY-MM` is chosen specifically so simple string sorting is valid.

### Monthly file

Location pattern:

`https://<cdn-host>/exchange-rates/YYYY-MM.json`

Required shape:

```json
{
  "month": "2026-03",
  "baseCurrency": "USD",
  "generatedAt": "2026-03-01T00:00:00Z",
  "rates": [
    { "currency": "EUR", "rate": 0.92 },
    { "currency": "JPY", "rate": 149.31 }
  ]
}
```

Rules:

- `month` is required and must equal the requested `YYYY-MM`.
- `baseCurrency` is required.
- `generatedAt` is required and must be an ISO-8601 UTC timestamp string.
- `rates` is required.
- Each `rates` item must contain:
  - `currency`: currency code string
  - `rate`: numeric exchange rate

The page will treat this schema as strict. If required fields are missing or malformed, the component will show an error state instead of attempting to infer or repair the data.

## Publish and Caching Requirements

The feature depends on the CDN behaving predictably.

Required external conditions:

- Files are publicly reachable over HTTPS.
- The CDN serves the JSON with `Content-Type: application/json`.
- The CDN allows browser access from `https://docs.revosurge.com` via CORS, or allows all origins.

Publishing rules for the DAG:

- Upload the new monthly file first.
- Update `index.json` last.

This prevents the docs page from seeing a new `latestMonth` before the corresponding monthly file exists on the CDN.

Caching guidance:

- `index.json` should have a short cache lifetime because it changes when a new month becomes available.
- Monthly files should have a longer cache lifetime because a month file is expected to be immutable after publication.

## Page UX

The page will display:

- A month selector.
- The selected month.
- The base currency.
- The data generation timestamp in UTC.
- A full table with one row per currency.

The initial page state is:

- Show a loading state while `index.json` and the first monthly file are being requested.
- After both requests succeed, show the month selector and the table.

Month switching behavior:

- When a user selects another month, the component requests only that month file.
- The component does not re-request `index.json` during month switching.

The table will use a horizontally scrollable wrapper on smaller screens so the page remains usable on mobile without collapsing the dataset into cards.

## Error and Empty States

The page will support three explicit UI states:

- `loading`
- `error`
- `empty`

Behavior rules:

- If `index.json` fails to load or is invalid, show a blocking error state for the whole feature area.
- If the selected month file fails to load or is invalid, keep the month selector visible and show an error state for the table area with a retry action.
- If the selected month file loads successfully but `rates` is empty, show an empty state message instead of the table.

The first version does not need nuanced partial recovery beyond these rules.

## Client Behavior

The component will keep a simple in-memory cache keyed by month. If a user switches from one month to another and then back, the component should reuse the already loaded JSON from memory during that page session. The cache does not need persistence across reloads, tabs, or browser sessions.

The component will not use local storage, indexed DB, or service workers.

## Implementation Boundaries

This feature should remain page-specific.

Explicit boundaries:

- Use a single page-specific Vue component.
- Import the component directly into the exchange-rates page.
- Do not create a shared hook, shared store, or multi-endpoint abstraction.
- Do not add this feature to `.vitepress/theme/index.ts` unless a future requirement creates a real need for broader registration.

## Verification Requirements

Implementation is complete when all of the following are true:

- The English page exists and is linked in the English sidebar.
- Opening the page loads the latest available month by default.
- Switching months updates the displayed metadata and table correctly.
- The `loading`, `error`, and `empty` states are each supported.
- The table remains usable on mobile through horizontal scrolling.
- `npm run build` succeeds without SSR or VitePress errors.

Manual verification is sufficient for the first version. No dedicated test framework is required for this feature.

## Recommendation For Planning

When writing the implementation plan, keep the work split into three focused parts:

1. Create the page-specific Vue component and runtime fetch logic.
2. Add the new English docs page and sidebar entry.
3. Verify runtime behavior, responsive layout, and build success.
