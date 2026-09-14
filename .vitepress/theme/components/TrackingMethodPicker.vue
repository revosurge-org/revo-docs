<script setup lang="ts">
import { computed, ref } from 'vue'

type Lang = 'en' | 'cn' | 'hk'
type BackOffice = 'own' | 'saas' | 'none'
type Funnel = 'web' | 'app' | 'both'

const props = withDefaults(defineProps<{ lang?: Lang }>(), { lang: 'en' })

type Option<V extends string> = { value: V; label: string; hint?: string }

type Copy = {
  q1Label: string
  q2Label: string
  q1: Option<BackOffice>[]
  q2: Option<Funnel>[]
  resultLabel: string
  resultCta: string
  reset: string
}

const UI: Record<Lang, Copy> = {
  en: {
    q1Label: '1. How do you run your back-office?',
    q2Label: '2. Where do users convert?',
    q1: [
      { value: 'own', label: 'Own custom back-office', hint: 'you have engineers' },
      { value: 'saas', label: 'SaaS affiliate platform', hint: 'Affilka / Cellxpert / Smartico …' },
      { value: 'none', label: 'Fastest start possible', hint: 'no engineering' }
    ],
    q2: [
      { value: 'web', label: 'Web only' },
      { value: 'app', label: 'App only' },
      { value: 'both', label: 'Web + App' }
    ],
    resultLabel: 'Recommended method',
    resultCta: 'Read the details →',
    reset: 'Start over'
  },
  cn: {
    q1Label: '1. 你怎么运营后台？',
    q2Label: '2. 用户在哪里转化？',
    q1: [
      { value: 'own', label: '自建后台', hint: '有工程团队' },
      { value: 'saas', label: 'SaaS 联盟平台', hint: 'Affilka / Cellxpert / Smartico …' },
      { value: 'none', label: '尽快上线', hint: '无需工程' }
    ],
    q2: [
      { value: 'web', label: '只有网页' },
      { value: 'app', label: '只有 App' },
      { value: 'both', label: '网页 + App' }
    ],
    resultLabel: '推荐方式',
    resultCta: '查看详情 →',
    reset: '重新选择'
  },
  hk: {
    q1Label: '1. 你怎麼營運後台？',
    q2Label: '2. 用戶在哪裡轉化？',
    q1: [
      { value: 'own', label: '自建後台', hint: '有工程團隊' },
      { value: 'saas', label: 'SaaS 聯盟平台', hint: 'Affilka / Cellxpert / Smartico …' },
      { value: 'none', label: '盡快上線', hint: '無需工程' }
    ],
    q2: [
      { value: 'web', label: '只有網頁' },
      { value: 'app', label: '只有 App' },
      { value: 'both', label: '網頁 + App' }
    ],
    resultLabel: '推薦方式',
    resultCta: '查看詳情 →',
    reset: '重新選擇'
  }
}

type Rec = { method: string; why: string; anchor: string }

// Keys are `${backOffice}-${funnel}`. Content mirrors the routing table in
// docs/prd-spec/Tracking_Overview_2026-09-09.md cell for cell.
const REC: Record<Lang, Record<string, Rec>> = {
  en: {
    'own-web': {
      method: 'S2S + Web Tracker (both required)',
      why: 'Own back-office + web funnel — S2S carries the events, Web Tracker captures the click-side signal.',
      anchor: '#s2s'
    },
    'own-app': {
      method: 'S2S + AppsFlyer',
      why: 'S2S as the truth layer, AppsFlyer for App install attribution — the strongest combination.',
      anchor: '#s2s'
    },
    'own-both': {
      method: 'S2S + Web Tracker + AppsFlyer (all three required)',
      why: 'Web + App funnel — S2S is your canonical event stream, Web Tracker captures the click-side signal, AppsFlyer handles App installs.',
      anchor: '#s2s'
    },
    'saas-web': {
      method: 'Partner Postback',
      why: 'Paste two URLs into your affiliate platform (Affilka / Cellxpert / etc.) — live the same day. Add the Web Tracker for click-side capture.',
      anchor: '#partner-postback'
    },
    'saas-app': {
      method: 'Partner Postback + AppsFlyer',
      why: 'Partner Postback covers the platform side, AppsFlyer handles App install attribution.',
      anchor: '#partner-postback'
    },
    'saas-both': {
      method: 'Partner Postback + AppsFlyer (both required)',
      why: 'Web + App funnel — Partner Postback covers the platform side, AppsFlyer handles App installs. Both are needed.',
      anchor: '#partner-postback'
    },
    'none-web': {
      method: 'Partner Postback',
      why: 'Same day, no engineering. The lowest-friction way to start.',
      anchor: '#partner-postback'
    },
    'none-app': {
      method: 'AppsFlyer only',
      why: 'Accept the App-side gap for now and upgrade later.',
      anchor: '#appsflyer'
    },
    'none-both': {
      method: 'Partner Postback + AppsFlyer (both required)',
      why: 'Web + App funnel — start with Partner Postback for the web side and AppsFlyer for App installs. Both are needed.',
      anchor: '#partner-postback'
    }
  },
  cn: {
    'own-web': {
      method: 'S2S + Web 追踪器（两个都要）',
      why: '自建后台 + 网页漏斗 —— S2S 负责发事件，Web 追踪器负责抓点击侧信号。',
      anchor: '#s2s'
    },
    'own-app': {
      method: 'S2S + AppsFlyer',
      why: 'S2S 作真相层，AppsFlyer 做 App 安装归因 —— 最强组合。',
      anchor: '#s2s'
    },
    'own-both': {
      method: 'S2S + Web 追踪器 + AppsFlyer（三个都要）',
      why: '网页 + App 漏斗 —— S2S 作权威事件流，Web 追踪器抓点击侧信号，AppsFlyer 做 App 安装归因。',
      anchor: '#s2s'
    },
    'saas-web': {
      method: 'Partner Postback',
      why: '把两个 URL 粘到你的联盟平台（Affilka / Cellxpert 等）—— 当天上线。再加 Web 追踪器抓点击侧信号。',
      anchor: '#partner-postback'
    },
    'saas-app': {
      method: 'Partner Postback + AppsFlyer',
      why: 'Partner Postback 覆盖平台侧，AppsFlyer 做 App 安装归因。',
      anchor: '#partner-postback'
    },
    'saas-both': {
      method: 'Partner Postback + AppsFlyer（都要）',
      why: '网页 + App 漏斗 —— Partner Postback 覆盖平台侧，AppsFlyer 做 App 安装。两个都需要。',
      anchor: '#partner-postback'
    },
    'none-web': {
      method: 'Partner Postback',
      why: '当天上线，无需工程。最零摩擦的开始方式。',
      anchor: '#partner-postback'
    },
    'none-app': {
      method: '只用 AppsFlyer',
      why: '暂时接受 App 侧的缺口，之后再升级。',
      anchor: '#appsflyer'
    },
    'none-both': {
      method: 'Partner Postback + AppsFlyer（都要）',
      why: '网页 + App 漏斗 —— 先用 Partner Postback 覆盖网页侧，AppsFlyer 做 App 安装。两个都需要。',
      anchor: '#partner-postback'
    }
  },
  hk: {
    'own-web': {
      method: 'S2S + Web 追蹤器（兩個都要）',
      why: '自建後台 + 網頁漏斗 —— S2S 負責發事件，Web 追蹤器負責抓點擊側信號。',
      anchor: '#s2s'
    },
    'own-app': {
      method: 'S2S + AppsFlyer',
      why: 'S2S 作真相層，AppsFlyer 做 App 安裝歸因 —— 最強組合。',
      anchor: '#s2s'
    },
    'own-both': {
      method: 'S2S + Web 追蹤器 + AppsFlyer（三個都要）',
      why: '網頁 + App 漏斗 —— S2S 作權威事件流，Web 追蹤器抓點擊側信號，AppsFlyer 做 App 安裝歸因。',
      anchor: '#s2s'
    },
    'saas-web': {
      method: 'Partner Postback',
      why: '把兩個 URL 貼到你的聯盟平台（Affilka / Cellxpert 等）—— 當天上線。再加 Web 追蹤器抓點擊側信號。',
      anchor: '#partner-postback'
    },
    'saas-app': {
      method: 'Partner Postback + AppsFlyer',
      why: 'Partner Postback 覆蓋平台側，AppsFlyer 做 App 安裝歸因。',
      anchor: '#partner-postback'
    },
    'saas-both': {
      method: 'Partner Postback + AppsFlyer（都要）',
      why: '網頁 + App 漏斗 —— Partner Postback 覆蓋平台側，AppsFlyer 做 App 安裝。兩個都需要。',
      anchor: '#partner-postback'
    },
    'none-web': {
      method: 'Partner Postback',
      why: '當天上線，無需工程。最零摩擦的開始方式。',
      anchor: '#partner-postback'
    },
    'none-app': {
      method: '只用 AppsFlyer',
      why: '暫時接受 App 側的缺口，之後再升級。',
      anchor: '#appsflyer'
    },
    'none-both': {
      method: 'Partner Postback + AppsFlyer（都要）',
      why: '網頁 + App 漏斗 —— 先用 Partner Postback 覆蓋網頁側，AppsFlyer 做 App 安裝。兩個都需要。',
      anchor: '#partner-postback'
    }
  }
}

const backOffice = ref<BackOffice | null>(null)
const funnel = ref<Funnel | null>(null)

const t = computed(() => UI[props.lang] ?? UI.en)
const result = computed<Rec | null>(() => {
  if (!backOffice.value || !funnel.value) return null
  return (REC[props.lang] ?? REC.en)[`${backOffice.value}-${funnel.value}`] ?? null
})

function reset() {
  backOffice.value = null
  funnel.value = null
}
</script>

<template>
  <section class="method-picker">
    <div class="method-picker__question">
      <p class="method-picker__label">{{ t.q1Label }}</p>
      <div class="method-picker__options">
        <button
          v-for="option in t.q1"
          :key="option.value"
          type="button"
          class="method-picker__option"
          :class="{ 'method-picker__option--selected': backOffice === option.value }"
          :aria-pressed="backOffice === option.value"
          @click="backOffice = option.value"
        >
          <span class="method-picker__option-label">{{ option.label }}</span>
          <span v-if="option.hint" class="method-picker__option-hint">{{ option.hint }}</span>
        </button>
      </div>
    </div>

    <div class="method-picker__question">
      <p class="method-picker__label">{{ t.q2Label }}</p>
      <div class="method-picker__options">
        <button
          v-for="option in t.q2"
          :key="option.value"
          type="button"
          class="method-picker__option"
          :class="{ 'method-picker__option--selected': funnel === option.value }"
          :aria-pressed="funnel === option.value"
          @click="funnel = option.value"
        >
          <span class="method-picker__option-label">{{ option.label }}</span>
        </button>
      </div>
    </div>

    <div class="method-picker__result-slot" aria-live="polite">
      <div v-if="result" class="method-picker__result">
        <p class="method-picker__result-label">{{ t.resultLabel }}</p>
        <p class="method-picker__result-method">{{ result.method }}</p>
        <p class="method-picker__result-why">{{ result.why }}</p>
        <a class="method-picker__result-cta" :href="result.anchor">{{ t.resultCta }}</a>
        <button type="button" class="method-picker__reset" @click="reset">{{ t.reset }}</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.method-picker {
  margin: 20px 0 28px;
  padding: 24px;
  border: 1px solid var(--vp-c-brand-soft);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
}

.method-picker__question + .method-picker__question {
  margin-top: 20px;
}

.method-picker__label {
  margin: 0 0 10px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: var(--vp-c-text-2);
}

.method-picker__options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.method-picker__option {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px 14px;
  border: 2px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 13px;
  line-height: 1.45;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.15s, background-color 0.15s, color 0.15s;
}

.method-picker__option:hover {
  border-color: var(--vp-c-brand-1);
}

/* brand-3 + white is VitePress's solid-background pair; brand-1 is a text
   color and does not guarantee contrast behind text in both schemes. */
.method-picker__option--selected {
  border-color: var(--vp-button-brand-bg);
  background: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
  font-weight: 600;
}

.method-picker__option-hint {
  font-size: 11px;
  opacity: 0.75;
}

.method-picker__result {
  margin-top: 20px;
  padding: 16px 20px;
  border-left: 4px solid var(--vp-c-brand-1);
  border-radius: 10px;
  background: var(--vp-c-bg);
}

.method-picker__result-label {
  margin: 0 0 4px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
}

.method-picker__result-method {
  margin: 0 0 4px;
  font-size: 19px;
  font-weight: 700;
  line-height: 1.35;
  color: var(--vp-c-brand-1);
}

.method-picker__result-why {
  margin: 0;
  font-size: 14px;
  color: var(--vp-c-text-1);
}

.method-picker__result-cta {
  display: inline-block;
  margin-top: 12px;
  padding: 8px 16px;
  border-radius: 6px;
  background: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
}

.method-picker__result-cta:hover {
  background: var(--vp-button-brand-hover-bg);
}

.method-picker__reset {
  margin-top: 12px;
  margin-left: 8px;
  padding: 8px 12px;
  border: 0;
  background: none;
  color: var(--vp-c-text-2);
  font-size: 13px;
  cursor: pointer;
}

.method-picker__reset:hover {
  color: var(--vp-c-text-1);
}

@media (max-width: 640px) {
  .method-picker {
    padding: 18px;
  }

  .method-picker__options {
    grid-template-columns: 1fr;
  }

  .method-picker__option {
    text-align: left;
  }
}
</style>
