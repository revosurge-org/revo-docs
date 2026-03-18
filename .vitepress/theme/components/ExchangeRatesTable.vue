<script setup lang="ts">
defineProps<{ indexUrl: string }>()
</script>

<template>
  <section class="exchange-rates">
    <p class="exchange-rates__loading">Loading exchange rates...</p>
  </section>
</template>

<style scoped>
.exchange-rates__loading {
  color: var(--vp-c-text-2);
}
</style>
