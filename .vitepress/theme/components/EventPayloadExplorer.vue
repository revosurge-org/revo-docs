<script setup lang="ts">
import { computed, ref } from 'vue'
import HttpMethod from './HttpMethod.vue'
import type { EventDef, FieldDef, I18n, Lang, Req, Scope } from '../data/s2s-v3-events'

const props = withDefaults(
  defineProps<{ events: EventDef[]; scope?: Scope; lang?: Lang; baseUrl?: string }>(),
  { scope: undefined, lang: 'en', baseUrl: 'https://datapulse-api.revosurge.com' }
)

const UI: Record<Lang, Record<string, string>> = {
  en: {
    requiredOnly: 'Required only', copyJson: 'Copy JSON', copyCurl: 'Copy cURL', copied: 'Copied!',
    field: 'Field', type: 'Type', req: 'Key', desc: 'Description', payload: 'Request envelope',
    required: 'Required', suggested: 'Suggested', optional: 'Optional',
  },
  cn: {
    requiredOnly: '仅必填', copyJson: '复制 JSON', copyCurl: '复制 cURL', copied: '已复制！',
    field: '字段', type: '类型', req: '要求', desc: '说明', payload: '请求信封',
    required: '必填', suggested: '建议', optional: '可选',
  },
  hk: {
    requiredOnly: '僅必填', copyJson: '複製 JSON', copyCurl: '複製 cURL', copied: '已複製！',
    field: '欄位', type: '類型', req: '要求', desc: '說明', payload: '請求信封',
    required: '必填', suggested: '建議', optional: '可選',
  },
}

const t = (k: string) => UI[props.lang][k] ?? UI.en[k]
const tr = (v: I18n) => v[props.lang] ?? v.en

const scoped = computed(() =>
  props.scope ? props.events.filter((e) => e.scope === props.scope) : props.events
)

const groups = computed(() => {
  const map = new Map<string, { label: I18n; events: EventDef[] }>()
  for (const ev of scoped.value) {
    if (!map.has(ev.category)) map.set(ev.category, { label: ev.categoryLabel, events: [] })
    map.get(ev.category)!.events.push(ev)
  }
  return [...map.values()]
})

const selectedName = ref(scoped.value[0]?.name ?? '')
const requiredOnly = ref(false)
const copied = ref('')

const current = computed<EventDef | undefined>(
  () => scoped.value.find((e) => e.name === selectedName.value) ?? scoped.value[0]
)

const fieldLocation = (fld: FieldDef) =>
  fld.slot === 'envelope' ? fld.path : `${fld.slot}.${fld.path}`

const include = (req: Req) => !requiredOnly.value || req === 'required'

function setPath(obj: Record<string, any>, path: string, value: unknown) {
  const parts = path.split('.')
  let cur = obj
  for (let i = 0; i < parts.length - 1; i++) {
    cur[parts[i]] = cur[parts[i]] ?? {}
    cur = cur[parts[i]]
  }
  cur[parts[parts.length - 1]] = value
}

const payloadObj = computed<Record<string, unknown>>(() => {
  const envelope: Record<string, unknown> = {}
  const identity: Record<string, unknown> = {}
  const context: Record<string, unknown> = {}
  for (const fld of current.value?.fields ?? []) {
    if (!include(fld.req)) continue
    if (fld.slot === 'envelope') envelope[fld.path] = fld.value
    else if (fld.slot === 'identity') identity[fld.path] = fld.value
    else setPath(context, fld.path, fld.value)
  }
  return { ...envelope, identity, context }
})

const jsonText = computed(() => JSON.stringify(payloadObj.value, null, 2))

const curlText = computed(() => {
  const body = jsonText.value.split('\n').map((l, i) => (i === 0 ? l : '    ' + l)).join('\n')
  return [
    `curl -X POST "${props.baseUrl}/v3/s2s/event" \\`,
    `  -H "Content-Type: application/json" \\`,
    `  -H "X-API-KEY: dp_test_key_123" \\`,
    `  -d '${body}'`,
  ].join('\n')
})

async function copy(kind: 'json' | 'curl') {
  const text = kind === 'json' ? jsonText.value : curlText.value
  try {
    await navigator.clipboard.writeText(text)
    copied.value = kind
    setTimeout(() => (copied.value = ''), 1500)
  } catch {
    /* clipboard unavailable */
  }
}
</script>

<template>
  <section class="epx">
    <nav class="epx__nav">
      <div v-for="g in groups" :key="g.label.en" class="epx__group">
        <span class="epx__group-label">{{ tr(g.label) }}</span>
        <div class="epx__pills">
          <button
            v-for="ev in g.events"
            :key="ev.name"
            type="button"
            class="epx__pill"
            :class="{ 'epx__pill--active': ev.name === current?.name }"
            :aria-pressed="ev.name === current?.name"
            @click="selectedName = ev.name"
          >
            {{ ev.name }}
          </button>
        </div>
      </div>
    </nav>

    <div v-if="current" class="epx__body">
      <div class="epx__head">
        <HttpMethod method="POST" path="/v3/s2s/event" />
        <code class="epx__event">{{ current.name }}</code>
        <label class="epx__toggle">
          <input type="checkbox" v-model="requiredOnly" />
          {{ t('requiredOnly') }}
        </label>
      </div>

      <div class="epx__table-wrap">
        <table class="epx__table">
          <thead>
            <tr>
              <th>{{ t('field') }}</th>
              <th>{{ t('type') }}</th>
              <th>{{ t('req') }}</th>
              <th>{{ t('desc') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="fld in current.fields"
              :key="fieldLocation(fld)"
              :class="{ 'epx__row--dim': requiredOnly && fld.req !== 'required' }"
            >
              <td><code>{{ fieldLocation(fld) }}</code></td>
              <td class="epx__type">{{ fld.type }}</td>
              <td>
                <span class="epx__badge" :class="`epx__badge--${fld.req}`">{{ t(fld.req) }}</span>
              </td>
              <td class="epx__desc">
                {{ tr(fld.desc) }}
                <span v-if="fld.pii" class="epx__tag epx__tag--pii">SHA-256</span>
                <span v-if="fld.monetary" class="epx__tag">monetary</span>
                <span v-if="fld.enumValues" class="epx__enum">{{ fld.enumValues.join(' · ') }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="epx__preview">
        <div class="epx__preview-head">
          <span class="epx__preview-title">{{ t('payload') }}</span>
          <div class="epx__actions">
            <button type="button" class="epx__btn" @click="copy('json')">
              {{ copied === 'json' ? t('copied') : t('copyJson') }}
            </button>
            <button type="button" class="epx__btn" @click="copy('curl')">
              {{ copied === 'curl' ? t('copied') : t('copyCurl') }}
            </button>
          </div>
        </div>
        <pre class="epx__code"><code>{{ jsonText }}</code></pre>
      </div>
    </div>
  </section>
</template>

<style scoped>
.epx {
  margin: 24px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  overflow: hidden;
  background: var(--vp-c-bg);
}

.epx__nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px 16px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

.epx__group { display: flex; flex-direction: column; gap: 7px; }

.epx__group-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--vp-c-text-3);
}

.epx__pills { display: flex; flex-wrap: wrap; gap: 6px; }

.epx__pill {
  padding: 4px 11px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 12.5px;
  font-weight: 600;
  font-family: var(--vp-font-family-mono);
  cursor: pointer;
  transition: all 0.15s ease;
}

.epx__pill:hover { border-color: var(--vp-c-brand-2); color: var(--vp-c-text-1); }

.epx__pill--active {
  background: var(--vp-c-brand-3);
  border-color: var(--vp-c-brand-3);
  color: #fff;
}

.epx__body { padding: 16px; }

.epx__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.epx__event { font-size: 13px; font-weight: 600; }

.epx__toggle {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  cursor: pointer;
}

.epx__table-wrap {
  overflow-x: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  margin-bottom: 16px;
}

.epx__table { width: 100%; border-collapse: collapse; font-size: 13px; }

.epx__table th,
.epx__table td {
  padding: 9px 12px;
  border-bottom: 1px solid var(--vp-c-divider);
  text-align: left;
  vertical-align: top;
}

.epx__table th {
  background: color-mix(in srgb, var(--vp-c-brand-soft) 55%, transparent);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.epx__table tbody tr:last-child td { border-bottom: 0; }
.epx__row--dim { opacity: 0.45; }
.epx__type { color: var(--vp-c-text-2); white-space: nowrap; }
.epx__desc { color: var(--vp-c-text-2); }

.epx__badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

.epx__badge--required { background: var(--vp-c-danger-soft); color: var(--vp-c-danger-1); }
.epx__badge--suggested { background: var(--vp-c-warning-soft); color: var(--vp-c-warning-1); }
.epx__badge--optional { background: var(--vp-c-default-soft); color: var(--vp-c-text-2); }

.epx__tag {
  display: inline-block;
  margin-left: 6px;
  padding: 1px 6px;
  border-radius: 6px;
  font-size: 10.5px;
  font-weight: 600;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
  vertical-align: middle;
}

.epx__tag--pii { background: var(--vp-c-danger-soft); color: var(--vp-c-danger-1); }

.epx__enum {
  display: block;
  margin-top: 3px;
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  color: var(--vp-c-text-3);
}

.epx__preview {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  overflow: hidden;
}

.epx__preview-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 12px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

.epx__preview-title { font-size: 12px; font-weight: 600; color: var(--vp-c-text-2); }
.epx__actions { display: flex; gap: 6px; }

.epx__btn {
  padding: 4px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.epx__btn:hover { border-color: var(--vp-c-brand-2); color: var(--vp-c-brand-1); }

.epx__code {
  margin: 0;
  padding: 12px 14px;
  background: var(--vp-c-bg-alt);
  overflow-x: auto;
  font-size: 12.5px;
  line-height: 1.6;
}

.epx__code code {
  background: transparent;
  padding: 0;
  font-family: var(--vp-font-family-mono);
  white-space: pre;
}
</style>
