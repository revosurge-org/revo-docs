<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useData } from 'vitepress'

const props = defineProps<{
  to: string
  apiReferences?: { v1: string; v2: string }
  legacyOverviewAnchor?: string
}>()

const { lang } = useData()
const messages = {
  en: { moved: 'This page has moved.', link: 'Open the new page' },
  'zh-CN': { moved: '此页面已迁移。', link: '打开新页面' },
  'zh-HK': { moved: '此頁面已遷移。', link: '開啟新頁面' }
} as const
const message = computed(() => messages[lang.value as keyof typeof messages] ?? messages.en)

onMounted(() => {
  const { search, hash } = window.location
  const overviewHashes = ['#choose-version', '#revosurge-partner-postback-api']
  if (props.legacyOverviewAnchor) overviewHashes.push(`#${encodeURIComponent(props.legacyOverviewAnchor)}`)
  let destination = props.to
  if (props.apiReferences && hash && !overviewHashes.includes(hash)) {
    destination = hash.startsWith('#v2-') ? props.apiReferences.v2 : props.apiReferences.v1
  }
  window.location.replace(`${destination}${search}${hash}`)
})
</script>

<template>
  <p>{{ message.moved }} <a :href="to">{{ message.link }}</a></p>
  <ul v-if="apiReferences">
    <li><a :href="apiReferences.v2">Partner Postback API (v2)</a></li>
    <li><a :href="apiReferences.v1">Partner Postback API (v1)</a></li>
  </ul>
</template>
