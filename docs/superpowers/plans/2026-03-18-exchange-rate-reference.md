# Exchange Rate Reference Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new English `Reference Data` docs page that loads monthly exchange-rate JSON from a CDN at runtime, defaults to the latest month, and lets readers switch months in a full table view.

**Architecture:** Implement one page-specific Vue component at `.vitepress/theme/components/ExchangeRatesTable.vue`. The Markdown page passes a single `indexUrl` prop; the component fetches `index.json`, derives monthly file URLs from the same directory, validates both payload shapes, caches month payloads in memory, and renders loading, error, empty, and table states. Update the English sidebar to expose a new top-level `Reference Data` group containing `Exchange Rate Reference`.

**Tech Stack:** VitePress 2, Vue 3 with `<script setup lang="ts">`, browser `fetch`, scoped component CSS, npm (`npm run dev`, `npm run build`)

---

## Preconditions

- Confirm the exact production CDN `index.json` URL before implementation. This plan assumes that one concrete URL is known before any code is merged.
- Confirm that monthly files live in the same directory as the confirmed `index.json` URL, using the `YYYY-MM.json` naming pattern.
- Confirm the CDN sends `Content-Type: application/json` and allows requests from `https://docs.revosurge.com`.

## File Map

- Create: `.vitepress/theme/components/ExchangeRatesTable.vue`
  - Owns the page-specific runtime logic: fetch flow, JSON validation, month switching, in-memory cache, and UI states.
- Create: `en/reference-data/exchange-rates.md`
  - Owns the English page copy, local component import, and the concrete `indexUrl` prop value.
- Modify: `.vitepress/config/en.ts`
  - Owns the English sidebar structure and adds the new top-level `Reference Data` section.

## Test Strategy

This repository does not currently have an automated frontend test harness. Use `npm run build` as the compile/regression gate and `npm run dev` for manual browser verification. Do not add a new test framework for this feature.

### Task 1: Wire the route, page, and component shell

**Files:**
- Create: `.vitepress/theme/components/ExchangeRatesTable.vue`
- Create: `en/reference-data/exchange-rates.md`
- Modify: `.vitepress/config/en.ts`
- Test: `npm run build`

- [ ] **Step 1: Create the component shell with the required prop**

Create `.vitepress/theme/components/ExchangeRatesTable.vue` with a minimal typed shell so the page can import it immediately:

```vue
<script setup lang="ts">
const props = defineProps<{ indexUrl: string }>()
</script>

<template>
  <section class="exchange-rates">
    <p class="exchange-rates__loading">Loading exchange rates...</p>
  </section>
</template>

<style scoped>
.exchange-rates__loading {
  color: var(--vp-c-text-2);
}
</style>
```

- [ ] **Step 2: Create the new English page and import the component locally**

Create `en/reference-data/exchange-rates.md` and make the confirmed production CDN URL explicit in one local constant:

```md
---
title: Exchange Rate Reference
description: Browse monthly exchange-rate reference data by month.
---

# Exchange Rate Reference

Monthly exchange-rate reference data published from the internal finance pipeline.

<script setup>
import ExchangeRatesTable from '../../.vitepress/theme/components/ExchangeRatesTable.vue'
</script>

<ExchangeRatesTable :index-url="exchangeRatesIndexUrl" />
```

Set `exchangeRatesIndexUrl` to the exact production `index.json` URL confirmed in Preconditions. Keep it as a single local constant in this page so the data source remains obvious and page-scoped.

- [ ] **Step 3: Add the page to the English sidebar**

Modify `.vitepress/config/en.ts` to insert a new top-level group:

```ts
{
  text: 'Reference Data',
  link: '/en/reference-data/exchange-rates',
  collapsed: false,
  items: [
    { text: 'Exchange Rate Reference', link: '/en/reference-data/exchange-rates' }
  ]
}
```

Place it near the end of the existing sidebar groups, before `LLM Resources`, so it reads like reference material instead of product onboarding.

- [ ] **Step 4: Run the build to verify the new route and import path compile**

Run: `npm run build`

Expected:
- Exit code `0`
- VitePress builds successfully
- No Markdown import errors
- No Vue SFC compile errors

- [ ] **Step 5: Commit the route wiring**

```bash
git add .vitepress/theme/components/ExchangeRatesTable.vue en/reference-data/exchange-rates.md .vitepress/config/en.ts
git commit -m "feat: add exchange rate reference page shell"
```

### Task 2: Implement runtime loading, validation, and the table UI

**Files:**
- Modify: `.vitepress/theme/components/ExchangeRatesTable.vue`
- Test: `npm run build`

- [ ] **Step 1: Add strict payload types and validation helpers**

Expand the component script with explicit runtime guards instead of trusting raw JSON:

```ts
import { computed, onMounted, ref } from 'vue'

type IndexPayload = {
  latestMonth: string
  months: string[]
}

type RateRow = {
  currency: string
  rate: number
}

type MonthPayload = {
  month: string
  baseCurrency: string
  generatedAt: string
  rates: RateRow[]
}

function assertIndexPayload(value: unknown): IndexPayload {
  if (!value || typeof value !== 'object') {
    throw new Error('Invalid exchange-rate index payload.')
  }

  const payload = value as Record<string, unknown>

  if (typeof payload.latestMonth !== 'string') {
    throw new Error('Exchange-rate index is missing latestMonth.')
  }

  if (
    !Array.isArray(payload.months) ||
    payload.months.some(
      (month) => typeof month !== 'string' || !/^\d{4}-\d{2}$/.test(month)
    )
  ) {
    throw new Error('Exchange-rate index has invalid months.')
  }

  if (!payload.months.includes(payload.latestMonth)) {
    throw new Error('Exchange-rate index latestMonth is not present in months.')
  }

  return {
    latestMonth: payload.latestMonth,
    months: payload.months as string[]
  }
}

function assertMonthPayload(value: unknown, requestedMonth: string): MonthPayload {
  if (!value || typeof value !== 'object') {
    throw new Error('Invalid monthly exchange-rate payload.')
  }

  const payload = value as Record<string, unknown>

  if (payload.month !== requestedMonth) {
    throw new Error(`Exchange-rate month mismatch for ${requestedMonth}.`)
  }

  if (typeof payload.baseCurrency !== 'string') {
    throw new Error('Monthly exchange-rate payload is missing baseCurrency.')
  }

  if (typeof payload.generatedAt !== 'string') {
    throw new Error('Monthly exchange-rate payload is missing generatedAt.')
  }

  if (
    !Array.isArray(payload.rates) ||
    payload.rates.some((row) => {
      if (!row || typeof row !== 'object') return true
      const rateRow = row as Record<string, unknown>
      return typeof rateRow.currency !== 'string' || typeof rateRow.rate !== 'number'
    })
  ) {
    throw new Error('Monthly exchange-rate payload has invalid rates.')
  }

  return {
    month: payload.month as string,
    baseCurrency: payload.baseCurrency as string,
    generatedAt: payload.generatedAt as string,
    rates: payload.rates as RateRow[]
  }
}
```

Use thrown `Error` instances for invalid payloads so the component can render one consistent error state.

- [ ] **Step 2: Add reactive state, URL derivation, and month cache**

Introduce only the state needed for this page:

```ts
const months = ref<string[]>([])
const selectedMonth = ref('')
const monthData = ref<MonthPayload | null>(null)
const loadingIndex = ref(true)
const loadingMonth = ref(false)
const errorMessage = ref('')
const monthCache = new Map<string, MonthPayload>()

const baseUrl = computed(() => new URL('.', props.indexUrl).toString())

function monthUrl(month: string): string {
  return new URL(`${month}.json`, baseUrl.value).toString()
}
```

Sort `months` in descending lexicographic order as soon as the index payload is accepted.

- [ ] **Step 3: Implement `loadIndex`, `loadMonth`, `initialize`, and `retry`**

Add one code path for first load and one for month switching:

```ts
async function loadIndex(): Promise<IndexPayload> {
  const response = await fetch(props.indexUrl)
  if (!response.ok) throw new Error('Failed to load exchange-rate index.')
  return assertIndexPayload(await response.json())
}

async function loadMonth(month: string): Promise<void> {
  if (monthCache.has(month)) {
    monthData.value = monthCache.get(month) ?? null
    selectedMonth.value = month
    errorMessage.value = ''
    return
  }

  loadingMonth.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(monthUrl(month))
    if (!response.ok) throw new Error(`Failed to load exchange rates for ${month}.`)
    const payload = assertMonthPayload(await response.json(), month)
    monthCache.set(month, payload)
    monthData.value = payload
    selectedMonth.value = month
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to load exchange rates.'
  } finally {
    loadingMonth.value = false
  }
}

async function initialize(): Promise<void> {
  loadingIndex.value = true
  errorMessage.value = ''

  try {
    const indexPayload = await loadIndex()
    months.value = [...indexPayload.months].sort().reverse()
    await loadMonth(indexPayload.latestMonth)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to load exchange-rate index.'
  } finally {
    loadingIndex.value = false
  }
}
```

Call `initialize()` in `onMounted()`. Expose one retry action that calls `initialize()` if no month has loaded yet, otherwise retries `loadMonth(selectedMonth.value)`.

- [ ] **Step 4: Replace the shell template with the real stateful UI**

Render exactly these sections inside the component template:

```vue
<template>
  <section class="exchange-rates">
    <div v-if="loadingIndex" class="exchange-rates__state">Loading exchange rates...</div>

    <div v-else-if="!months.length || (!selectedMonth && errorMessage)" class="exchange-rates__state exchange-rates__state--error">
      <p>{{ errorMessage || 'No exchange-rate months are available.' }}</p>
      <button type="button" class="exchange-rates__retry" @click="initialize">Retry</button>
    </div>

    <div v-else class="exchange-rates__content">
      <div class="exchange-rates__toolbar">
        <label for="exchange-rates-month">Reference Month</label>
        <select
          id="exchange-rates-month"
          :value="selectedMonth"
          @change="loadMonth(($event.target as HTMLSelectElement).value)"
        >
          <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
        </select>
      </div>

      <div v-if="monthData" class="exchange-rates__meta">
        <span>Month: {{ monthData.month }}</span>
        <span>Base Currency: {{ monthData.baseCurrency }}</span>
        <span>Generated At (UTC): {{ monthData.generatedAt }}</span>
      </div>

      <div v-if="loadingMonth" class="exchange-rates__state">Loading selected month...</div>

      <div v-else-if="errorMessage" class="exchange-rates__state exchange-rates__state--error">
        <p>{{ errorMessage }}</p>
        <button type="button" class="exchange-rates__retry" @click="loadMonth(selectedMonth)">Retry</button>
      </div>

      <div v-else-if="monthData && monthData.rates.length === 0" class="exchange-rates__state">
        No exchange-rate rows are available for this month.
      </div>

      <div v-else-if="monthData" class="exchange-rates__table-wrap">
        <table class="exchange-rates__table">
          <thead>
            <tr>
              <th>Currency</th>
              <th>Rate</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in monthData.rates" :key="row.currency">
              <td>{{ row.currency }}</td>
              <td>{{ row.rate }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
```

Keep the template narrow. Do not add charts, filters, or search.

- [ ] **Step 5: Add scoped styles for readability and mobile overflow**

Add scoped CSS inside `.vitepress/theme/components/ExchangeRatesTable.vue` for:

- A padded state container with subtle border/background
- A compact toolbar row
- Readable metadata chips or inline blocks
- A horizontally scrollable table wrapper
- Table header and row borders using VitePress color tokens
- A simple retry button that matches the theme

Minimum structure:

```css
.exchange-rates__table-wrap {
  overflow-x: auto;
}

.exchange-rates__table {
  width: 100%;
  min-width: 420px;
  border-collapse: collapse;
}

.exchange-rates__table th,
.exchange-rates__table td {
  padding: 12px 14px;
  border-bottom: 1px solid var(--vp-c-divider);
  text-align: left;
}
```

Keep all new styling inside the component unless a real global style need appears.

- [ ] **Step 6: Run the build after the component implementation**

Run: `npm run build`

Expected:
- Exit code `0`
- No TypeScript-in-SFC errors
- No VitePress SSR build errors

- [ ] **Step 7: Commit the runtime implementation**

```bash
git add .vitepress/theme/components/ExchangeRatesTable.vue
git commit -m "feat: implement exchange rate table runtime"
```

### Task 3: Manually verify states and finish the page

**Files:**
- Modify if needed: `.vitepress/theme/components/ExchangeRatesTable.vue`
- Modify if needed: `en/reference-data/exchange-rates.md`
- Modify if needed: `.vitepress/config/en.ts`
- Test: `npm run dev`, `npm run build`

- [ ] **Step 1: Start the local docs server**

Run: `npm run dev`

Expected:
- VitePress prints a local URL such as `http://localhost:5173/`
- The new page is reachable at `/en/reference-data/exchange-rates`

- [ ] **Step 2: Verify the happy path in the browser**

Open the page and confirm:

- The latest month loads automatically
- The month selector is populated
- Metadata shows month, base currency, and generation timestamp
- The full table renders with all rows from the selected month JSON

- [ ] **Step 3: Verify month switching and cache reuse**

Switch to an older month, then switch back to the original month.

Expected:
- Metadata changes with the selected month
- Table rows update with the selected month payload
- The second visit to a previously loaded month reuses the in-memory cache instead of issuing a new request

Use the browser Network panel to confirm that switching back to an already loaded month does not issue another `YYYY-MM.json` request.

- [ ] **Step 4: Verify the blocking index error state**

Temporarily change `exchangeRatesIndexUrl` in `en/reference-data/exchange-rates.md` so it points at a missing JSON file in the same CDN directory. For example, keep the same base path but replace `index.json` with `does-not-exist.json`.

Refresh the page and confirm:

- The feature shows the blocking error state
- The retry button is visible

Restore the real `indexUrl` immediately after verification.

- [ ] **Step 5: Verify the month-file error state**

Temporarily change the component `monthUrl()` helper to return a missing file name:

```ts
function monthUrl(month: string): string {
  return new URL(`${month}-missing.json`, baseUrl.value).toString()
}
```

Load the page and confirm:

- The month selector still renders
- The table area shows the month-level error state
- The retry button is visible

Restore the real `monthUrl()` implementation immediately after verification.

- [ ] **Step 6: Verify the empty state**

If the CDN can provide a temporary empty month fixture, use it. Otherwise, temporarily stub an empty month payload inside `loadMonth()` after validation:

```ts
monthData.value = {
  ...payload,
  rates: []
}
```

Confirm the empty-state message appears instead of the table, then restore the real assignment:

```ts
monthData.value = payload
```

- [ ] **Step 7: Run the final build**

Run: `npm run build`

Expected:
- Exit code `0`
- Final implementation builds cleanly after all temporary verification edits are restored

- [ ] **Step 8: Commit the final verified version**

```bash
git add .vitepress/theme/components/ExchangeRatesTable.vue en/reference-data/exchange-rates.md .vitepress/config/en.ts
git commit -m "feat: add exchange rate reference"
```
