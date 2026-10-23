<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  locale: 'en' | 'cn' | 'hk'
  format: 'banner' | 'pop' | 'push' | 'inpage-push' | 'native'
  scriptHtml: string
  placementHtml: string
}>()

const formatName = computed(() => ({
  banner: 'Banner', pop: 'Pop', push: 'Push', 'inpage-push': 'In-page Push', native: 'Native'
})[props.format])

const copy = computed(() => ({
  en: {
    scriptTitle: '1. Add AdFlow.js to the target page',
    scriptBefore: 'Add this script to the ',
    scriptAfter: ' of the page that hosts the placement, or its shared template. Include it only once per page; all placements on that page share it.',
    existing: 'Already included? Check the actual page or shared template. If AdFlow.js is already there, skip to step 2.',
    placementTitle: `2. Install the ${formatName.value} iframe`,
    placement: 'Place this iframe at the placement integration point on your page. It uses the current Placement ID and format settings.',
    scriptButton: 'Copy script',
    placementButton: 'Copy iframe',
    copied: 'Copied',
    failed: 'Could not copy. Select the code and copy it manually.',
    notes: {
      banner: 'Keep width="300" and height="250" for this banner. Omitting data-ad-type uses the default banner type.',
      pop: 'Use data-ad-type="pop"; width and height are not needed. The iframe is an integration placeholder, not where the pop opens. After a winning bid, a user click opens the ad in a background window.',
      push: 'Use data-ad-type="push"; width and height are not needed. The iframe is an integration placeholder, not the notification display location. Notifications require HTTPS and the user’s permission.',
      'inpage-push': 'Use data-ad-type="inpage-push". Width and height specify the requested image size and are optional; this preview uses the default of 492 × 328.',
      native: 'Use data-ad-type="native". Width and height specify the requested image size and are optional; this preview uses the default of 492 × 328.'
    }
  },
  cn: {
    scriptTitle: '1. 在目标页面引入 AdFlow.js',
    scriptBefore: '将脚本放入实际承载该广告位页面的 ',
    scriptAfter: ' 或其共享模板。每个页面只需引入一次，同页多个广告位共用。',
    existing: '如果已引入，请核对实际页面或共享模板；确认已有 AdFlow.js 后，无需重复添加，可直接进行第二步。',
    placementTitle: `2. 安装 ${formatName.value} iframe`,
    placement: '将此 iframe 放在页面的广告位接入位置。代码使用当前配置的 Placement ID 和广告格式。',
    scriptButton: '复制脚本',
    placementButton: '复制 iframe',
    copied: '已复制',
    failed: '复制失败，请选中代码手动复制。',
    notes: {
      banner: '此横幅保留 width="300" 和 height="250"。省略 data-ad-type 时默认使用 banner 类型。',
      pop: '使用 data-ad-type="pop"，无需 width / height。iframe 仅为接入占位，不是弹窗的最终展示位置。竞价成功后，用户点击页面时在后台打开广告。',
      push: '使用 data-ad-type="push"，无需 width / height。iframe 仅为接入占位，不是通知的最终展示位置。浏览器通知需要 HTTPS 和用户授权。',
      'inpage-push': '使用 data-ad-type="inpage-push"。width / height 用于指定请求的图片尺寸，可选；此预览使用默认值 492 × 328。',
      native: '使用 data-ad-type="native"。width / height 用于指定请求的图片尺寸，可选；此预览使用默认值 492 × 328。'
    }
  },
  hk: {
    scriptTitle: '1. 在目標頁面引入 AdFlow.js',
    scriptBefore: '將腳本放入實際承載該廣告位頁面的 ',
    scriptAfter: ' 或其共用範本。每個頁面只需引入一次，同頁多個廣告位共用。',
    existing: '如果已引入，請核對實際頁面或共用範本；確認已有 AdFlow.js 後，無需重複加入，可直接進行第二步。',
    placementTitle: `2. 安裝 ${formatName.value} iframe`,
    placement: '將此 iframe 放在頁面的廣告位接入位置。代碼使用目前設定的 Placement ID 和廣告格式。',
    scriptButton: '複製腳本',
    placementButton: '複製 iframe',
    copied: '已複製',
    failed: '複製失敗，請選取代碼手動複製。',
    notes: {
      banner: '此橫幅保留 width="300" 和 height="250"。省略 data-ad-type 時預設使用 banner 類型。',
      pop: '使用 data-ad-type="pop"，無需 width / height。iframe 僅為接入佔位，並非彈窗的最終顯示位置。競價成功後，用戶點擊頁面時在背景開啟廣告。',
      push: '使用 data-ad-type="push"，無需 width / height。iframe 僅為接入佔位，並非通知的最終顯示位置。瀏覽器通知需要 HTTPS 和用戶授權。',
      'inpage-push': '使用 data-ad-type="inpage-push"。width / height 用於指定請求的圖片尺寸，為可選；此預覽使用預設值 492 × 328。',
      native: '使用 data-ad-type="native"。width / height 用於指定請求的圖片尺寸，為可選；此預覽使用預設值 492 × 328。'
    }
  }
})[props.locale])

const scriptCode = ref<HTMLElement | null>(null)
const placementCode = ref<HTMLElement | null>(null)
const feedback = ref({ script: '', placement: '' })

watch(() => props.scriptHtml, () => { feedback.value.script = '' })
watch(() => props.placementHtml, () => { feedback.value.placement = '' })

async function copyCode(kind: 'script' | 'placement') {
  const code = kind === 'script' ? scriptCode.value : placementCode.value
  if (!code) return
  try {
    await navigator.clipboard.writeText(code.textContent?.trim() ?? '')
    feedback.value[kind] = copy.value.copied
  } catch {
    feedback.value[kind] = copy.value.failed
  }
}
</script>

<template>
  <div class="card adflow-code-preview">
    <section class="installation-step">
      <h3>{{ copy.scriptTitle }}</h3>
      <p>{{ copy.scriptBefore }}<code>&lt;head&gt;</code>{{ copy.scriptAfter }}</p>
      <p>{{ copy.existing }}</p>
      <div class="copy-controls">
        <button type="button" class="copy-button" @click="copyCode('script')">{{ copy.scriptButton }}</button>
        <span role="status" aria-live="polite">{{ feedback.script }}</span>
      </div>
      <pre class="code-block" tabindex="0" :aria-label="copy.scriptButton"><code ref="scriptCode" v-html="scriptHtml"></code></pre>
    </section>
    <section class="installation-step">
      <h3>{{ copy.placementTitle }}</h3>
      <p>{{ copy.placement }}</p>
      <p>{{ copy.notes[format] }}</p>
      <div class="copy-controls">
        <button type="button" class="copy-button" @click="copyCode('placement')">{{ copy.placementButton }}</button>
        <span role="status" aria-live="polite">{{ feedback.placement }}</span>
      </div>
      <pre class="code-block" tabindex="0" :aria-label="copy.placementButton"><code ref="placementCode" v-html="placementHtml"></code></pre>
    </section>
  </div>
</template>

<style scoped>
.adflow-code-preview {
  min-width: 0;
  margin-bottom: 24px;
}

.installation-step + .installation-step {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--vp-c-divider);
}

.installation-step p {
  margin: 8px 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.7;
  overflow-wrap: anywhere;
}

.copy-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
  margin: 12px 0 8px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.copy-controls .copy-button {
  min-height: 44px;
  padding: 8px 14px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 13px;
}

.copy-controls .copy-button:hover {
  background: var(--vp-c-default-soft);
}

.copy-button:focus-visible,
.code-block:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 3px;
}

.installation-step .code-block {
  margin: 0;
}

.code-block > code {
  padding: 0;
  background: transparent;
  color: inherit;
  font: inherit;
}
</style>
