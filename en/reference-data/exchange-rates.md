---
title: Exchange Rate Reference
description: Browse exchange-rate reference data.
---

# Exchange Rate Reference

Monthly exchange-rate reference data published from the internal finance pipeline.

<script setup>
import ExchangeRatesTable from '../../.vitepress/theme/components/ExchangeRatesTable.vue'

const exchangeRatesDataUrl = 'https://assets.revosurge.com/exchange-rates/2026-06.json'
</script>

<ExchangeRatesTable :data-url="exchangeRatesDataUrl" />
