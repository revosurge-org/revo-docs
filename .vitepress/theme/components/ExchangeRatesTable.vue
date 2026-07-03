<script setup lang="ts">
import { computed, ref } from 'vue'
import { useExchangeRates } from '../composables/useExchangeRates'
import { formatRate } from '../utils/exchange-rates'

type Labels = {
  loading: string
  retry: string
  ratesTitle: string
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
  ratesTitle: 'Reference Rates',
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

const { data: monthData, loading, errorMessage, reload } = useExchangeRates(props.dataUrl, t.value.loadError)

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

function handleRetry(): void {
  void reload()
}
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
      <div v-if="isEmptyData" class="exchange-rates__state">
        {{ t.emptyData }}
      </div>

      <div v-else-if="monthData" class="exchange-rates__panel">
        <header class="exchange-rates__header">
          <h2 class="exchange-rates__title">{{ t.ratesTitle }}</h2>

          <div class="exchange-rates__toolbar">
            <div class="exchange-rates__base-badge" :title="t.baseCurrency">
              <span class="exchange-rates__base-label">{{ t.baseCurrency }}</span>
              <span class="exchange-rates__base-value">{{ monthData.baseCurrency }}</span>
            </div>

            <label class="exchange-rates__search-field" for="exchange-rates-search">
              <span class="exchange-rates__search-label">{{ t.search }}</span>
              <input
                id="exchange-rates-search"
                v-model="searchQuery"
                type="search"
                class="exchange-rates__search"
                :placeholder="t.searchPlaceholder"
                autocomplete="off"
              />
            </label>
          </div>
        </header>

        <div v-if="isEmptySearch" class="exchange-rates__state exchange-rates__state--inline">
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

.exchange-rates__panel {
  display: grid;
  gap: 16px;
  width: 100%;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg);
}

.exchange-rates__header {
  display: grid;
  gap: 12px;
  width: 100%;
}

.exchange-rates__title {
  margin: 0;
  padding-top: 0;
  border-top: none;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: normal;
  color: var(--vp-c-text-1);
}

.exchange-rates__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.exchange-rates__base-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  padding: 8px 12px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 18%, var(--vp-c-divider));
  border-radius: 999px;
  background: color-mix(in srgb, var(--vp-c-brand-soft) 65%, transparent);
}

.exchange-rates__base-label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
}

.exchange-rates__base-value {
  font-size: 14px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.exchange-rates__search-field {
  display: flex;
  flex: 1 1 260px;
  align-items: center;
  gap: 10px;
  min-width: min(100%, 280px);
  max-width: 420px;
  margin-left: auto;
}

.exchange-rates__search-label {
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.exchange-rates__search {
  flex: 1;
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
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

.exchange-rates__state--inline {
  margin: 0;
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
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
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
  .exchange-rates__toolbar {
    align-items: stretch;
  }

  .exchange-rates__search-field {
    flex-direction: column;
    align-items: stretch;
    max-width: none;
    margin-left: 0;
  }

  .exchange-rates__base-badge {
    align-self: flex-start;
  }
}
</style>
