import { onMounted, ref, type Ref } from 'vue'
import { fetchExchangeRates, type ExchangeRatesPayload } from '../utils/exchange-rates'

type UseExchangeRatesResult = {
  data: Ref<ExchangeRatesPayload | null>
  loading: Ref<boolean>
  errorMessage: Ref<string>
  reload: () => Promise<void>
}

export function useExchangeRates(dataUrl: string, loadError = 'Failed to load exchange rates.'): UseExchangeRatesResult {
  const data = ref<ExchangeRatesPayload | null>(null)
  const loading = ref(true)
  const errorMessage = ref('')

  async function reload(): Promise<void> {
    loading.value = true
    errorMessage.value = ''
    data.value = null

    try {
      data.value = await fetchExchangeRates(dataUrl)
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : loadError
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    void reload()
  })

  return {
    data,
    loading,
    errorMessage,
    reload,
  }
}
