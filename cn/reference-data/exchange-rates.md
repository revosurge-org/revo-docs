---
title: 汇率参考
description: 浏览汇率参考数据。
---

# 汇率参考

由内部财务管道发布的月度汇率参考数据。

<script setup>
import ExchangeRatesTable from '../../.vitepress/theme/components/ExchangeRatesTable.vue'

const exchangeRatesDataUrl = 'https://assets.revosurge.com/exchange-rates/2026-06.json'

const labels = {
  loading: '正在加载汇率数据...',
  retry: '重试',
  baseCurrency: '基准货币',
  currency: '货币',
  rate: '汇率',
  search: '搜索货币',
  searchPlaceholder: '例如 USD',
  emptyData: '暂无汇率数据。',
  noSearchResults: '没有匹配的货币。',
  loadError: '汇率数据加载失败。',
}
</script>

<ExchangeRatesTable :data-url="exchangeRatesDataUrl" :labels="labels" />
