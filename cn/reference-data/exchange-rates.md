---
title: 汇率参考
description: 按月浏览月度汇率参考数据。
---

# 汇率参考

由内部财务管道发布的月度汇率参考数据。

<script setup>
import ExchangeRatesTable from '../../.vitepress/theme/components/ExchangeRatesTable.vue'

const exchangeRatesIndexUrl = 'https://assets.revosurge.com/exchange-rates/index.json'

const labels = {
  loadingIndex: '正在加载汇率数据...',
  loadingMonth: '正在加载所选月份...',
  retry: '重试',
  referenceMonth: '参考月份',
  month: '月份',
  baseCurrency: '基准货币',
  generatedAt: '生成时间（UTC）',
  currency: '货币',
  rate: '汇率',
  emptyMonth: '该月份暂无汇率数据。',
  noMonths: '暂无可用的汇率月份。',
  loadIndexError: '汇率索引加载失败。',
  loadMonthError: '汇率数据加载失败。',
}
</script>

<ExchangeRatesTable :index-url="exchangeRatesIndexUrl" :labels="labels" />
