<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ method: string; path?: string }>()

const normalized = computed(() => props.method.trim().toUpperCase())
const methodClass = computed(() => `api-method__verb--${normalized.value.toLowerCase()}`)
</script>

<template>
  <span class="api-method">
    <span class="api-method__verb" :class="methodClass">{{ normalized }}</span>
    <code v-if="path" class="api-method__path">{{ path }}</code>
  </span>
</template>

<style scoped>
.api-method {
  display: inline-flex;
  align-items: stretch;
  gap: 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  font-size: 13px;
  line-height: 1.4;
  vertical-align: middle;
}

.api-method__verb {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  font-weight: 700;
  letter-spacing: 0.03em;
  color: #fff;
  background: var(--vp-c-brand-3);
}

.api-method__verb--get { background: #3b82f6; }
.api-method__verb--post { background: #16a34a; }
.api-method__verb--put { background: #f59e0b; }
.api-method__verb--patch { background: #8b5cf6; }
.api-method__verb--delete { background: #ef4444; }

.api-method__path {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border: 0;
  border-radius: 0;
  font-size: 13px;
}
</style>
