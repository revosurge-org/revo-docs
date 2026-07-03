<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useExchangeRates } from '../composables/useExchangeRates'
import {
  convertCurrencyToUsd,
  convertUsdToCurrency,
  formatAmount,
  formatRate,
  getRateForCurrency,
  parseAmountInput,
  sortCurrencies,
} from '../utils/exchange-rates'

type Direction = 'toUsd' | 'fromUsd'

type Labels = {
  title: string
  loading: string
  retry: string
  amount: string
  amountPlaceholder: string
  currency: string
  result: string
  swap: string
  directionToUsd: string
  directionFromUsd: string
  invalidAmount: string
  loadError: string
}

const defaultLabels: Labels = {
  title: 'Exchange Rate Calculator',
  loading: 'Loading exchange rates...',
  retry: 'Retry',
  amount: 'Amount',
  amountPlaceholder: 'Enter amount',
  currency: 'Currency',
  result: 'Result',
  swap: 'Swap direction',
  directionToUsd: 'Convert to USD',
  directionFromUsd: 'Convert from USD',
  invalidAmount: 'Enter a valid non-negative number.',
  loadError: 'Failed to load exchange rates.',
}

const props = defineProps<{ dataUrl: string; labels?: Partial<Labels> }>()

const t = computed<Labels>(() => ({ ...defaultLabels, ...props.labels }))

const { data, loading, errorMessage, reload } = useExchangeRates(props.dataUrl, t.value.loadError)

const direction = ref<Direction>('toUsd')
const amountInput = ref('1')
const selectedCurrency = ref('EUR')

const currencies = computed(() => (data.value ? sortCurrencies(data.value) : []))

const selectedRate = computed(() => {
  if (!data.value) return null
  return getRateForCurrency(data.value, selectedCurrency.value)
})

const parsedAmount = computed(() => parseAmountInput(amountInput.value))

const convertedAmount = computed(() => {
  if (parsedAmount.value === null || selectedRate.value === null) return null

  if (direction.value === 'toUsd') {
    return convertCurrencyToUsd(parsedAmount.value, selectedRate.value)
  }

  return convertUsdToCurrency(parsedAmount.value, selectedRate.value)
})

const sourceCurrency = computed(() => (direction.value === 'toUsd' ? selectedCurrency.value : 'USD'))
const targetCurrency = computed(() => (direction.value === 'toUsd' ? 'USD' : selectedCurrency.value))

const formattedResult = computed(() => {
  if (convertedAmount.value === null) return '—'
  return formatAmount(convertedAmount.value)
})

const rateHint = computed(() => {
  if (!data.value || selectedRate.value === null) return ''

  const base = data.value.baseCurrency
  return `1 ${base} = ${formatRate(selectedRate.value)} ${selectedCurrency.value}`
})

const showInvalidAmount = computed(
  () => !loading.value && !errorMessage.value && amountInput.value.trim() !== '' && parsedAmount.value === null
)

watch(currencies, (next) => {
  if (!next.length) return
  if (!next.includes(selectedCurrency.value)) {
    selectedCurrency.value = next.includes('EUR') ? 'EUR' : next[0]
  }
})

function toggleDirection(): void {
  direction.value = direction.value === 'toUsd' ? 'fromUsd' : 'toUsd'
}

function handleRetry(): void {
  void reload()
}
</script>

<template>
  <section class="rate-converter">
    <h2 class="rate-converter__title">{{ t.title }}</h2>

    <div v-if="loading" class="rate-converter__state">
      {{ t.loading }}
    </div>

    <div v-else-if="errorMessage" class="rate-converter__state rate-converter__state--error">
      <p>{{ errorMessage }}</p>
      <button type="button" class="rate-converter__retry" @click="handleRetry">
        {{ t.retry }}
      </button>
    </div>

    <div v-else-if="data" class="rate-converter__panel">
      <p class="rate-converter__direction">
        {{ direction === 'toUsd' ? t.directionToUsd : t.directionFromUsd }}
      </p>

      <div class="rate-converter__grid">
        <div class="rate-converter__side">
          <span class="rate-converter__label">{{ t.amount }}</span>
          <div class="rate-converter__control-row">
            <input
              v-model="amountInput"
              type="text"
              inputmode="decimal"
              class="rate-converter__input"
              :placeholder="t.amountPlaceholder"
              autocomplete="off"
            />
            <select
              v-if="direction === 'toUsd'"
              v-model="selectedCurrency"
              class="rate-converter__select"
              :aria-label="t.currency"
            >
              <option v-for="currency in currencies" :key="currency" :value="currency">
                {{ currency }}
              </option>
            </select>
            <span v-else class="rate-converter__currency-badge">USD</span>
          </div>
        </div>

        <button
          type="button"
          class="rate-converter__swap"
          :title="t.swap"
          :aria-label="t.swap"
          @click="toggleDirection"
        >
          ⇄
        </button>

        <div class="rate-converter__side">
          <span class="rate-converter__label">{{ t.result }}</span>
          <div class="rate-converter__control-row">
            <div class="rate-converter__result">{{ formattedResult }}</div>
            <span v-if="direction === 'toUsd'" class="rate-converter__currency-badge">USD</span>
            <select
              v-else
              v-model="selectedCurrency"
              class="rate-converter__select"
              :aria-label="t.currency"
            >
              <option v-for="currency in currencies" :key="currency" :value="currency">
                {{ currency }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <p v-if="showInvalidAmount" class="rate-converter__hint rate-converter__hint--error">
        {{ t.invalidAmount }}
      </p>
      <p v-else-if="rateHint" class="rate-converter__hint">{{ rateHint }}</p>

      <p
        v-if="parsedAmount !== null && convertedAmount !== null"
        class="rate-converter__summary"
      >
        {{ formatAmount(parsedAmount) }} {{ sourceCurrency }} = {{ formattedResult }} {{ targetCurrency }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.rate-converter {
  margin-top: 24px;
  width: 100%;
}

.rate-converter__title {
  margin: 0 0 16px;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.rate-converter__panel {
  display: grid;
  gap: 14px;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg);
  width: 100%;
}

.rate-converter__direction {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.rate-converter__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  gap: 12px;
  align-items: end;
  width: 100%;
}

.rate-converter__side {
  display: grid;
  gap: 8px;
  min-width: 0;
}

.rate-converter__label {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.rate-converter__control-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
  align-items: stretch;
}

.rate-converter__input,
.rate-converter__select,
.rate-converter__result,
.rate-converter__currency-badge {
  min-height: 42px;
  padding: 10px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.rate-converter__input {
  width: 100%;
}

.rate-converter__select {
  min-width: 96px;
}

.rate-converter__input:focus,
.rate-converter__select:focus {
  outline: 2px solid color-mix(in srgb, var(--vp-c-brand-1) 35%, transparent);
  outline-offset: 1px;
}

.rate-converter__result {
  display: flex;
  align-items: center;
  font-variant-numeric: tabular-nums;
}

.rate-converter__currency-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 72px;
  font-size: 13px;
  font-weight: 700;
  color: var(--vp-c-text-2);
}

.rate-converter__swap {
  width: 42px;
  height: 42px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
}

.rate-converter__swap:hover {
  background: color-mix(in srgb, var(--vp-c-brand-soft) 70%, var(--vp-c-brand-1));
}

.rate-converter__hint {
  margin: 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.rate-converter__hint--error {
  color: var(--vp-c-danger-1);
}

.rate-converter__summary {
  margin: 0;
  padding: 10px 12px;
  border-radius: 10px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-text-1);
  font-size: 14px;
  font-variant-numeric: tabular-nums;
}

.rate-converter__state {
  padding: 18px 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
}

.rate-converter__state p {
  margin: 0 0 12px;
}

.rate-converter__state--error {
  background: var(--vp-c-danger-soft);
  color: var(--vp-c-text-1);
}

.rate-converter__retry {
  padding: 10px 14px;
  border: 0;
  border-radius: 999px;
  background: var(--vp-c-brand-3);
  color: var(--vp-c-white);
  font-weight: 600;
  cursor: pointer;
}

.rate-converter__retry:hover {
  background: var(--vp-c-brand-2);
}

@media (max-width: 768px) {
  .rate-converter__grid {
    grid-template-columns: 1fr;
  }

  .rate-converter__swap {
    justify-self: center;
  }
}
</style>
