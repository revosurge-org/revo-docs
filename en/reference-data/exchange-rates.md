---
title: Exchange Rate Reference
description: Browse monthly exchange-rate reference data by month.
---

# Exchange Rate Reference

Monthly exchange-rate reference data published from the internal finance pipeline.

<script setup>
import ExchangeRatesTable from '../../.vitepress/theme/components/ExchangeRatesTable.vue'

// Replace this with the production CDN index URL before merge.
const exchangeRatesIndexUrl = 'https://example.invalid/exchange-rates/index.json'
</script>

<ExchangeRatesTable :index-url="exchangeRatesIndexUrl" />
