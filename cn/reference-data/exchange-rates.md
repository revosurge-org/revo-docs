---
title: 汇率参考
description: 浏览汇率参考数据。
---

# 汇率参考

由内部财务管道发布的月度汇率参考数据。

<script setup>
import ExchangeRateConverter from '../../.vitepress/theme/components/ExchangeRateConverter.vue'
import ExchangeRatesTable from '../../.vitepress/theme/components/ExchangeRatesTable.vue'

const exchangeRatesDataUrl = 'https://assets.revosurge.com/exchange-rates/2026-06.json'

const converterLabels = {
  title: '汇率换算器',
  loading: '正在加载汇率数据...',
  retry: '重试',
  amount: '金额',
  amountPlaceholder: '输入金额',
  currency: '货币',
  result: '结果',
  swap: '切换换算方向',
  directionToUsd: '换算为 USD',
  directionFromUsd: '从 USD 换算',
  invalidAmount: '请输入有效的非负数字。',
  loadError: '汇率数据加载失败。',
  fixedCurrency: '基准货币（固定）',
  fixedCurrencyTag: '固定',
}

const labels = {
  loading: '正在加载汇率数据...',
  retry: '重试',
  ratesTitle: '参考汇率',
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

<ExchangeRateConverter :data-url="exchangeRatesDataUrl" :labels="converterLabels" />
<ExchangeRatesTable :data-url="exchangeRatesDataUrl" :labels="labels" />
