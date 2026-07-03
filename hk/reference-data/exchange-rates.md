---
title: 匯率參考
description: 瀏覽匯率參考數據。
---

# 匯率參考

由內部財務管道發布的月度匯率參考數據。

<script setup>
import ExchangeRateConverter from '../../.vitepress/theme/components/ExchangeRateConverter.vue'
import ExchangeRatesTable from '../../.vitepress/theme/components/ExchangeRatesTable.vue'

const exchangeRatesDataUrl = 'https://assets.revosurge.com/exchange-rates/2026-06.json'

const converterLabels = {
  title: '匯率換算器',
  loading: '正在載入匯率數據...',
  retry: '重試',
  amount: '金額',
  amountPlaceholder: '輸入金額',
  currency: '貨幣',
  result: '結果',
  swap: '切換換算方向',
  directionToUsd: '換算為 USD',
  directionFromUsd: '從 USD 換算',
  invalidAmount: '請輸入有效的非負數字。',
  loadError: '匯率數據載入失敗。',
  fixedCurrency: '基準貨幣（固定）',
  fixedCurrencyTag: '固定',
}

const labels = {
  loading: '正在載入匯率數據...',
  retry: '重試',
  ratesTitle: '參考匯率',
  baseCurrency: '基準貨幣',
  currency: '貨幣',
  rate: '匯率',
  search: '搜尋貨幣',
  searchPlaceholder: '例如 USD',
  emptyData: '暫無匯率數據。',
  noSearchResults: '沒有匹配的貨幣。',
  loadError: '匯率數據載入失敗。',
}
</script>

<ExchangeRateConverter :data-url="exchangeRatesDataUrl" :labels="converterLabels" />
<ExchangeRatesTable :data-url="exchangeRatesDataUrl" :labels="labels" />
