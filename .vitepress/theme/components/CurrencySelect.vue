<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps<{
  modelValue: string
  options: string[]
  ariaLabel: string
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const open = ref(false)
const root = ref<HTMLElement | null>(null)

function toggleOpen(): void {
  open.value = !open.value
}

function selectOption(value: string): void {
  emit('update:modelValue', value)
  open.value = false
}

function handleDocumentClick(event: MouseEvent): void {
  if (!root.value?.contains(event.target as Node)) {
    open.value = false
  }
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    open.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div ref="root" class="currency-select" :class="{ 'currency-select--open': open }">
    <button
      type="button"
      class="currency-select__trigger"
      :aria-label="ariaLabel"
      :aria-expanded="open"
      aria-haspopup="listbox"
      @click="toggleOpen"
    >
      <span class="currency-select__value">{{ modelValue }}</span>
      <span class="currency-select__chevron" aria-hidden="true">▾</span>
    </button>

    <ul v-if="open" class="currency-select__menu" role="listbox" :aria-label="ariaLabel">
      <li v-for="option in options" :key="option" role="presentation">
        <button
          type="button"
          class="currency-select__option"
          :class="{ 'currency-select__option--active': option === modelValue }"
          role="option"
          :aria-selected="option === modelValue"
          @click="selectOption(option)"
        >
          {{ option }}
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.currency-select {
  position: relative;
  min-width: 96px;
}

.currency-select__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  min-height: 42px;
  padding: 10px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.currency-select__trigger:focus {
  outline: 2px solid color-mix(in srgb, var(--vp-c-brand-1) 35%, transparent);
  outline-offset: 1px;
}

.currency-select--open .currency-select__trigger {
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 35%, var(--vp-c-divider));
}

.currency-select__value {
  font-variant-numeric: tabular-nums;
}

.currency-select__chevron {
  font-size: 12px;
  color: var(--vp-c-text-2);
  transition: transform 0.15s ease;
}

.currency-select--open .currency-select__chevron {
  transform: rotate(180deg);
}

.currency-select__menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 20;
  width: 100%;
  min-width: 120px;
  max-height: 240px;
  margin: 0;
  padding: 6px;
  overflow-y: auto;
  list-style: none;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg);
  box-shadow: 0 10px 30px color-mix(in srgb, var(--vp-c-bg) 20%, rgb(0 0 0 / 18%));
}

.currency-select__option {
  display: block;
  width: 100%;
  padding: 8px 10px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--vp-c-text-1);
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
}

.currency-select__option:hover {
  background: var(--vp-c-default-soft);
}

.currency-select__option--active {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 700;
}
</style>
