export const EXCHANGE_RATES_FIXED_MONTH = '2026-06'

export type ExchangeRateRow = {
  currency: string
  rate: number
}

export type ExchangeRatesPayload = {
  month: string
  baseCurrency: string
  generatedAt: string
  rates: ExchangeRateRow[]
}

const payloadCache = new Map<string, ExchangeRatesPayload>()

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function assertExchangeRatesPayload(value: unknown): ExchangeRatesPayload {
  if (!isRecord(value)) {
    throw new Error('Invalid exchange-rate payload.')
  }

  const { month, baseCurrency, generatedAt, rates } = value

  if (month !== EXCHANGE_RATES_FIXED_MONTH) {
    throw new Error(`Exchange-rate month mismatch for ${EXCHANGE_RATES_FIXED_MONTH}.`)
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
        !Number.isFinite(row.rate) ||
        row.rate <= 0
      )
    })
  ) {
    throw new Error('Exchange-rate payload has invalid rates.')
  }

  return {
    month,
    baseCurrency,
    generatedAt,
    rates: rates as ExchangeRateRow[],
  }
}

export async function fetchExchangeRates(dataUrl: string): Promise<ExchangeRatesPayload> {
  const cached = payloadCache.get(dataUrl)
  if (cached) return cached

  const response = await fetch(dataUrl)
  if (!response.ok) {
    throw new Error('Failed to load exchange rates.')
  }

  const payload = assertExchangeRatesPayload(await response.json())
  payloadCache.set(dataUrl, payload)
  return payload
}

export function getRateForCurrency(payload: ExchangeRatesPayload, currency: string): number | null {
  const row = payload.rates.find((item) => item.currency === currency)
  return row?.rate ?? null
}

/** Convert an amount in USD to the target currency (rate = target units per 1 USD). */
export function convertUsdToCurrency(amountUsd: number, rate: number): number {
  return amountUsd * rate
}

/** Convert an amount in a foreign currency to USD (rate = foreign units per 1 USD). */
export function convertCurrencyToUsd(amount: number, rate: number): number {
  return amount / rate
}

export function parseAmountInput(value: string): number | null {
  const trimmed = value.trim()
  if (!trimmed) return null

  const parsed = Number(trimmed)
  if (!Number.isFinite(parsed) || parsed < 0) return null

  return parsed
}

export function formatRate(rate: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6,
  }).format(rate)
}

export function formatAmount(value: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6,
  }).format(value)
}

export function sortCurrencies(payload: ExchangeRatesPayload): string[] {
  return [...payload.rates]
    .map((row) => row.currency)
    .sort((a, b) => a.localeCompare(b))
}
