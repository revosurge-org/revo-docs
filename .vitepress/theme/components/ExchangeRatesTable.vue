<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const FIXED_MONTH = '2026-06'

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

type Labels = {
  loading: string
  retry: string
  baseCurrency: string
  currency: string
  rate: string
  search: string
  searchPlaceholder: string
  emptyData: string
  noSearchResults: string
  loadError: string
}

const defaultLabels: Labels = {
  loading: 'Loading exchange rates...',
  retry: 'Retry',
  baseCurrency: 'Base Currency',
  currency: 'Currency',
  rate: 'Rate',
  search: 'Search currency',
  searchPlaceholder: 'e.g. USD',
  emptyData: 'No exchange-rate rows are available.',
  noSearchResults: 'No currencies match your search.',
  loadError: 'Failed to load exchange rates.',
}

const props = defineProps<{ dataUrl: string; labels?: Partial<Labels> }>()

const t = computed<Labels>(() => ({ ...defaultLabels, ...props.labels }))

const monthData = ref<MonthPayload | null>(null)
const loading = ref(true)
const errorMessage = ref('')
const searchQuery = ref('')

const filteredRates = computed(() => {
  if (!monthData.value) return []

  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return monthData.value.rates

  return monthData.value.rates.filter((row) => row.currency.toLowerCase().includes(query))
})

const hasSearchQuery = computed(() => searchQuery.value.trim().length > 0)
const isEmptyData = computed(
  () => !loading.value && !errorMessage.value && monthData.value?.rates.length === 0
)
const isEmptySearch = computed(
  () =>
    !loading.value &&
    !errorMessage.value &&
    hasSearchQuery.value &&
    monthData.value !== null &&
    monthData.value.rates.length > 0 &&
    filteredRates.value.length === 0
)

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function assertMonthPayload(value: unknown): MonthPayload {
  if (!isRecord(value)) {
    throw new Error('Invalid exchange-rate payload.')
  }

  const { month, baseCurrency, generatedAt, rates } = value

  if (month !== FIXED_MONTH) {
    throw new Error(`Exchange-rate month mismatch for ${FIXED_MONTH}.`)
  }

  if (typeof baseCurrency !== 'string' || !baseCurrency.trim()) {
    throw new Error('Exchange-rate payload is missing baseCurrency.')
  }

  if (typeof generatedAt !== 'string' || Number.isNaN(Date.parse(generatedAt))) {
    throw new Error('Exchange-rate payload is missing a valid generatedAt.')
  }

  if (
    !Array.isArray(rates) ||
    rates.some((row) => {
      if (!isRecord(row)) return true
      return (
        typeof row.currency !== 'string' ||
        !row.currency.trim() ||
        typeof row.rate !== 'number' ||
        !Number.isFinite(row.rate)
      )
    })
  ) {
    throw new Error('Exchange-rate payload has invalid rates.')
  }

  return {
    month,
    baseCurrency,
    generatedAt,
    rates: rates as RateRow[],
  }
}

function formatRate(rate: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6,
  }).format(rate)
}

async function loadData(): Promise<void> {
  loading.value = true
  errorMessage.value = ''
  monthData.value = null

  try {
    const response = await fetch(props.dataUrl)
    if (!response.ok) {
      throw new Error(t.value.loadError)
    }

    monthData.value = assertMonthPayload(await response.json())
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : t.value.loadError
  } finally {
    loading.value = false
  }
}

function handleRetry(): void {
  void loadData()
}

onMounted(() => {
  void loadData()
})
</script>

<template>
  <section class="exchange-rates">
    <div v-if="loading" class="exchange-rates__state">
      {{ t.loading }}
    </div>

    <div v-else-if="errorMessage" class="exchange-rates__state exchange-rates__state--error">
      <p>{{ errorMessage }}</p>
      <button type="button" class="exchange-rates__retry" @click="handleRetry">
        {{ t.retry }}
      </button>
    </div>

    <div v-else class="exchange-rates__content">
      <div v-if="monthData" class="exchange-rates__meta">
        <span class="exchange-rates__meta-chip">{{ t.baseCurrency }}: {{ monthData.baseCurrency }}</span>
      </div>

      <div v-if="isEmptyData" class="exchange-rates__state">
        {{ t.emptyData }}
      </div>

      <div v-else-if="monthData" class="exchange-rates__table-section">
        <div class="exchange-rates__table-toolbar">
          <label class="exchange-rates__label" for="exchange-rates-search">{{ t.search }}</label>
          <input
            id="exchange-rates-search"
            v-model="searchQuery"
            type="search"
            class="exchange-rates__search"
            :placeholder="t.searchPlaceholder"
            autocomplete="off"
          />
        </div>

        <div v-if="isEmptySearch" class="exchange-rates__state">
          {{ t.noSearchResults }}
        </div>

        <div v-else class="exchange-rates__table-wrap">
          <table class="exchange-rates__table">
            <thead>
              <tr>
                <th>{{ t.currency }}</th>
                <th>{{ t.rate }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in filteredRates" :key="row.currency">
                <td>{{ row.currency }}</td>
                <td>{{ formatRate(row.rate) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.exchange-rates {
  margin-top: 24px;
  width: 100%;
}

.exchange-rates__content {
  display: grid;
  gap: 16px;
  width: 100%;
}

.exchange-rates__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.exchange-rates__meta-chip {
  padding: 8px 12px;
  border-radius: 999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-text-1);
  font-size: 13px;
  line-height: 1.4;
}

.exchange-rates__table-section {
  display: grid;
  gap: 12px;
  width: 100%;
}

.exchange-rates__table-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.exchange-rates__label {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.exchange-rates__search {
  flex: 1 1 220px;
  min-width: 180px;
  padding: 10px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.exchange-rates__search:focus {
  outline: 2px solid color-mix(in srgb, var(--vp-c-brand-1) 35%, transparent);
  outline-offset: 1px;
}

.exchange-rates__state {
  padding: 18px 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
}

.exchange-rates__state p {
  margin: 0 0 12px;
}

.exchange-rates__state--error {
  background: var(--vp-c-danger-soft);
  color: var(--vp-c-text-1);
}

.exchange-rates__retry {
  padding: 10px 14px;
  border: 0;
  border-radius: 999px;
  background: var(--vp-c-brand-3);
  color: var(--vp-c-white);
  font-weight: 600;
  cursor: pointer;
}

.exchange-rates__retry:hover {
  background: var(--vp-c-brand-2);
}

.exchange-rates__table-wrap {
  width: 100%;
  overflow-x: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg);
}

.exchange-rates__table {
  display: table;
  width: 100%;
  max-width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  margin: 0;
}

.exchange-rates__table th,
.exchange-rates__table td {
  padding: 12px 14px;
  border-bottom: 1px solid var(--vp-c-divider);
  text-align: left;
}

.exchange-rates__table th:first-child,
.exchange-rates__table td:first-child {
  width: 38%;
}

.exchange-rates__table th:last-child,
.exchange-rates__table td:last-child {
  width: 62%;
  text-align: right;
}

.exchange-rates__table th {
  background: color-mix(in srgb, var(--vp-c-brand-soft) 55%, transparent);
  font-size: 13px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.exchange-rates__table tbody tr:last-child td {
  border-bottom: 0;
}

@media (max-width: 640px) {
  .exchange-rates__meta-chip {
    width: 100%;
    border-radius: 12px;
  }

  .exchange-rates__table-toolbar {
    align-items: stretch;
  }

  .exchange-rates__search {
    width: 100%;
  }
}
</style>
