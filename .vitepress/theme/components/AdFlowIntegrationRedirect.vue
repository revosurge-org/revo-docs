<script setup lang="ts">
import DocRedirect from './DocRedirect.vue'

const { locale } = defineProps<{ locale: string }>()
const base = `/${locale}/adflow/`
const sections = {
  'adflow-sdk': [
    'adflow-sdk', 'adflow-usage', 'adflow-ad-types', 'adflow-type-banner',
    'adflow-type-pop', 'adflow-type-push', 'adflow-type-inpage-push',
    'adflow-type-native', 'adflow-script-attrs', 'adflow-iframe-attrs',
    'adflow-responsive', 'adflow-example', 'adflow-diagnostic'
  ],
  'adflow-tma-sdk': [
    'adflow-tma-sdk', 'adflow-tma-usage', 'adflow-tma-script-attrs',
    'adflow-tma-iframe-attrs', 'adflow-tma-responsive', 'adflow-tma-example',
    'adflow-tma-tmajssdk'
  ],
  's2s-integration': [
    's2s-integration', 'quick-start', 's2s-config', 'ad-units', 'full-example',
    's2s-gam', 'testing'
  ],
  'prebid-mobile-sdk': [
    'prebid-mobile-sdk', 'pbm-prerequisites', 'pbm-install', 'pbm-init',
    'pbm-banner', 'pbm-interstitial', 'pbm-gam', 'pbm-testing'
  ]
}
const anchors = Object.fromEntries(
  Object.entries(sections).flatMap(([page, ids]) => ids.map(id => [id, base + page]))
)
</script>

<template>
  <DocRedirect :to="base + 'choose-integration'" :anchors="anchors" />
</template>
