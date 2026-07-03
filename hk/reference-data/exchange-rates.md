---
title: 匯率參考
description: 按月瀏覽月度匯率參考數據。
---

# 匯率參考

由內部財務管道發布的月度匯率參考數據。

<script setup>
import ExchangeRatesTable from '../../.vitepress/theme/components/ExchangeRatesTable.vue'

const exchangeRatesIndexUrl = 'https://assets.revosurge.com/exchange-rates/index.json'

const labels = {
  loadingIndex: '正在載入匯率數據...',
  loadingMonth: '正在載入所選月份...',
  retry: '重試',
  referenceMonth: '參考月份',
  month: '月份',
  baseCurrency: '基準貨幣',
  generatedAt: '生成時間（UTC）',
  currency: '貨幣',
  rate: '匯率',
  emptyMonth: '該月份暫無匯率數據。',
  noMonths: '暫無可用的匯率月份。',
  loadIndexError: '匯率索引載入失敗。',
  loadMonthError: '匯率數據載入失敗。',
}
</script>

<ExchangeRatesTable :index-url="exchangeRatesIndexUrl" :labels="labels" />
