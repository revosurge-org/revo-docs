---
title: 匯率參考
description: 瀏覽匯率參考數據。
---

# 匯率參考

由內部財務管道發布的月度匯率參考數據。

<script setup>
import ExchangeRatesTable from '../../.vitepress/theme/components/ExchangeRatesTable.vue'

const exchangeRatesDataUrl = 'https://assets.revosurge.com/exchange-rates/2026-06.json'

const labels = {
  loading: '正在載入匯率數據...',
  retry: '重試',
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

<ExchangeRatesTable :data-url="exchangeRatesDataUrl" :labels="labels" />
