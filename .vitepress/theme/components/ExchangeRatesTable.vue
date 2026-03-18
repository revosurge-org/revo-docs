<script setup lang="ts">
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

const props = defineProps<{ indexUrl: string }>()

const months = ref<string[]>([])
const selectedMonth = ref('')
const monthData = ref<MonthPayload | null>(null)
const loadingIndex = ref(true)
const loadingMonth = ref(false)
const errorMessage = ref('')
const monthCache = new Map<string, MonthPayload>()

const baseUrl = computed(() => new URL('.', props.indexUrl).toString())
const hasMonths = computed(() => months.value.length > 0)
const isBlockingError = computed(
  () => !loadingIndex.value && (!hasMonths.value || (!selectedMonth.value && Boolean(errorMessage.value)))
)
const isMonthError = computed(
  () =>
    !loadingIndex.value &&
    !loadingMonth.value &&
    hasMonths.value &&
    Boolean(selectedMonth.value) &&
    Boolean(errorMessage.value) &&
    !monthData.value
)
const isEmptyMonth = computed(
  () => !loadingIndex.value && !loadingMonth.value && !errorMessage.value && monthData.value?.rates.length === 0
)
const formattedGeneratedAt = computed(() => {
  if (!monthData.value) return ''

  const parsed = new Date(monthData.value.generatedAt)
  if (Number.isNaN(parsed.getTime())) {
    return monthData.value.generatedAt
  }

  return `${parsed.toISOString().replace('.000Z', 'Z')} UTC`
})

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isMonthString(value: string): boolean {
  return /^\d{4}-\d{2}$/.test(value)
}

function assertIndexPayload(value: unknown): IndexPayload {
  if (!isRecord(value)) {
    throw new Error('Invalid exchange-rate index payload.')
  }

  const { latestMonth, months: rawMonths } = value

  if (typeof latestMonth !== 'string' || !isMonthString(latestMonth)) {
    throw new Error('Exchange-rate index is missing a valid latestMonth.')
  }

  if (
    !Array.isArray(rawMonths) ||
    rawMonths.some((month) => typeof month !== 'string' || !isMonthString(month))
  ) {
    throw new Error('Exchange-rate index has invalid months.')
  }

  if (!rawMonths.includes(latestMonth)) {
    throw new Error('Exchange-rate index latestMonth is not present in months.')
  }

  return {
    latestMonth,
    months: rawMonths,
  }
}

function assertMonthPayload(value: unknown, requestedMonth: string): MonthPayload {
  if (!isRecord(value)) {
    throw new Error('Invalid monthly exchange-rate payload.')
  }

  const { month, baseCurrency, generatedAt, rates } = value

  if (month !== requestedMonth) {
    throw new Error(`Exchange-rate month mismatch for ${requestedMonth}.`)
  }

  if (typeof baseCurrency !== 'string' || !baseCurrency.trim()) {
    throw new Error('Monthly exchange-rate payload is missing baseCurrency.')
  }

  if (typeof generatedAt !== 'string' || Number.isNaN(Date.parse(generatedAt))) {
    throw new Error('Monthly exchange-rate payload is missing a valid generatedAt.')
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
    throw new Error('Monthly exchange-rate payload has invalid rates.')
  }

  return {
    month,
    baseCurrency,
    generatedAt,
    rates: rates as RateRow[],
  }
}

function monthUrl(month: string): string {
  return new URL(`${month}.json`, baseUrl.value).toString()
}

function formatRate(rate: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6,
  }).format(rate)
}

async function loadIndex(): Promise<IndexPayload> {
  const response = await fetch(props.indexUrl)
  if (!response.ok) {
    throw new Error('Failed to load exchange-rate index.')
  }

  return assertIndexPayload(await response.json())
}

async function loadMonth(month: string): Promise<void> {
  selectedMonth.value = month
  errorMessage.value = ''
  monthData.value = null

  const cached = monthCache.get(month)
  if (cached) {
    monthData.value = cached
    return
  }

  loadingMonth.value = true

  try {
    const response = await fetch(monthUrl(month))
    if (!response.ok) {
      throw new Error(`Failed to load exchange rates for ${month}.`)
    }

    const payload = assertMonthPayload(await response.json(), month)
    monthCache.set(month, payload)
    monthData.value = payload
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to load exchange rates.'
  } finally {
    loadingMonth.value = false
  }
}

async function initialize(): Promise<void> {
  loadingIndex.value = true
  errorMessage.value = ''
  months.value = []
  selectedMonth.value = ''
  monthData.value = null

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

function handleMonthChange(event: Event): void {
  const value = (event.target as HTMLSelectElement).value
  void loadMonth(value)
}

function handleRetry(): void {
  if (!months.value.length || !selectedMonth.value) {
    void initialize()
    return
  }

  void loadMonth(selectedMonth.value)
}

onMounted(() => {
  void initialize()
})
</script>

<template>
  <section class="exchange-rates">
    <div v-if="loadingIndex" class="exchange-rates__state">
      Loading exchange rates...
    </div>

    <div v-else-if="isBlockingError" class="exchange-rates__state exchange-rates__state--error">
      <p>{{ errorMessage || 'No exchange-rate months are available.' }}</p>
      <button type="button" class="exchange-rates__retry" @click="handleRetry">
        Retry
      </button>
    </div>

    <div v-else class="exchange-rates__content">
      <div class="exchange-rates__toolbar">
        <label class="exchange-rates__label" for="exchange-rates-month">Reference Month</label>
        <select
          id="exchange-rates-month"
          class="exchange-rates__select"
          :value="selectedMonth"
          @change="handleMonthChange"
        >
          <option v-for="month in months" :key="month" :value="month">
            {{ month }}
          </option>
        </select>
      </div>

      <div v-if="monthData" class="exchange-rates__meta">
        <span class="exchange-rates__meta-chip">Month: {{ monthData.month }}</span>
        <span class="exchange-rates__meta-chip">Base Currency: {{ monthData.baseCurrency }}</span>
        <span class="exchange-rates__meta-chip">Generated At (UTC): {{ formattedGeneratedAt }}</span>
      </div>

      <div v-if="loadingMonth" class="exchange-rates__state">
        Loading selected month...
      </div>

      <div v-else-if="isMonthError" class="exchange-rates__state exchange-rates__state--error">
        <p>{{ errorMessage }}</p>
        <button type="button" class="exchange-rates__retry" @click="handleRetry">
          Retry
        </button>
      </div>

      <div v-else-if="isEmptyMonth" class="exchange-rates__state">
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
              <td>{{ formatRate(row.rate) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<style scoped>
.exchange-rates {
  margin-top: 24px;
}

.exchange-rates__content {
  display: grid;
  gap: 16px;
}

.exchange-rates__toolbar {
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

.exchange-rates__select {
  min-width: 180px;
  padding: 10px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
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
  overflow-x: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg);
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

  .exchange-rates__toolbar {
    align-items: stretch;
  }

  .exchange-rates__select {
    width: 100%;
  }
}
</style>
