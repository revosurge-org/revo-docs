---
title: 標準事件 (v3)
sidebar_label: 標準事件
description: S2S v3 與 Partner Postback v2 共用的事件定義、欄位表和編碼範例。
---

# 標準事件

**對象：** 工程師、技術整合人員

標準事件（`general.core` 預設集）**為每個產品自動啟用** — 無需訂閱。它們涵蓋用戶生命週期、驗證與授權，以及應用生命週期。遊戲特定事件請參閱 [iGaming 事件](/hk/tracking/events/events-igaming)。

加密貨幣交易所和錢包請參見 [Crypto 事件](/hk/tracking/events/events-crypto)。

詳見[通用欄位與身份](/hk/tracking/events/common-fields)。以下表格列出各事件特有的欄位。

<script setup>
import { s2sV3Events } from '../../../.vitepress/theme/data/s2s-v3-events'
</script>

## 互動式瀏覽器

選擇一個事件以查看其欄位及一個可直接傳送的信封。切換「僅必填」，然後複製為 JSON 或 cURL。

<EventPayloadExplorer :events="s2sV3Events" scope="standard" lang="hk" />

## 用戶生命週期

### `register`

建立一個新的用戶帳戶。

| 欄位 | 類型 | 要求 | 說明 |
|-------|------|-------------|-------------|
| `context.user_agent` | String | 建議 | 瀏覽器／裝置 user-agent 字串。 |
| `context.privacy.email_hash` | String | 建議 | 電郵的 SHA-256（轉小寫並去除前後空白）。絕不使用明文。 |
| `context.privacy.phone_hash` | String | 建議 | E.164 正規化電話的 SHA-256。絕不使用明文。 |
| `context.privacy.marketing_consent` | Boolean | 建議 | 用戶是否同意行銷。 |
| `context.attribution.install_source` | String | 建議 | 安裝／獲客來源。 |
| `context.phone_country_code` | String | 建議 | E.164 國家區號（如 `+55`）。 |
| `context.consent_timestamp` | Number | 建議 | 最近一次授權變更，UTC 毫秒。 |
| `context.attribution.utm_source` | String | 建議 | UTM 來源。 |
| `context.attribution.utm_medium` | String | 建議 | UTM 媒介。 |
| `context.attribution.utm_campaign` | String | 建議 | UTM 活動。 |
| `context.attribution.utm_content` | String | 建議 | UTM 內容。 |
| `context.attribution.utm_term` | String | 建議 | UTM 關鍵詞。 |
| `context.device_brand` | String | 建議 | 完成本次註冊所用裝置的品牌，例如 Apple、Samsung。 |
| `context.device_model` | String | 建議 | 註冊裝置上報的原始型號識別碼；保留原值，例如 `iPhone15,3`、`SM-S918B/DS`。 |
| `context.platform` | String | 建議 | 完成本次註冊的環境：`web` · `android` · `ios` 其中之一。 |
| `context.os` | String | 建議 | 註冊裝置的作業系統，例如 Android、iOS、Windows、Linux、Mac OS X；這些範例並非封閉列舉。 |

### `referral_register`

帶推薦歸因的註冊 — 攜帶推薦人的用戶 ID。

| 欄位 | 類型 | 要求 | 說明 |
|-------|------|-------------|-------------|
| `context.referral_client_user_id` | String | 建議 | 推薦人的 `client_user_id`（推薦本次註冊的用戶）。 |
| `context.device_brand` | String | 建議 | **新註冊用戶**完成註冊所用裝置的品牌，例如 Apple、Samsung。 |
| `context.device_model` | String | 建議 | **新註冊用戶**的註冊裝置上報的原始型號識別碼；保留原值，例如 `iPhone15,3`、`SM-S918B/DS`。 |
| `context.platform` | String | 建議 | **新註冊用戶**完成註冊的環境：`web` · `android` · `ios` 其中之一。 |
| `context.os` | String | 建議 | **新註冊用戶**的註冊裝置作業系統，例如 Android、iOS、Windows、Linux、Mac OS X；這些範例並非封閉列舉。 |

### 註冊裝置採集規則 {#registration-device}

以上四個裝置欄位同時適用於 S2S v3 及 [Partner Postback v2](/hk/tracking/postback/v2-api#v2-registration-device) 中的 `register`、`referral_register`。全部為 **String / 建議**：傳送能夠取得的欄位。部分或全部缺失不會導致原本有效的註冊事件被拒收；已提供的值仍須符合欄位類型要求，`platform` 亦須使用上方允許的小寫值。

- 採集實際完成**本次註冊**的裝置。對於 `referral_register`，`identity.client_user_id` 識別新註冊用戶，`context.referral_client_user_id` 識別推薦人；裝置欄位屬於**新註冊用戶**，並非推薦人。
- 不得以另一次登入的裝置資訊取代；即使延遲傳送，亦應保留註冊時採集的值。
- 保留上報的原始型號識別碼，不得僅憑螢幕解析度推斷具體機型。
- 無法取得的欄位應略去，不傳送空字串或 `-`。裝置歸屬及不可用值省略由傳送端保證；後端不會確認實際採集裝置，亦不會統一清理佔位字串。

驗收時，對兩個事件分別 dry-run 完整四欄位、部分缺失及全部缺失的請求，並核對回顯 envelope 中的原始型號識別碼。錯誤 JSON 類型或非法 `platform` 在 S2S 回傳 `400 VALIDATION_ERROR`；Partner Postback v2 的目錄類型／列舉錯誤回傳 `422 VALIDATION_ERROR`。合成請求成功只能證明欄位可被接收，不能證明真實註冊流程採集了正確裝置。

### `login`

用戶認證進入你的平台。

| 欄位 | 類型 | 要求 | 說明 |
|-------|------|-------------|-------------|
| `context.user_agent` | String | 建議 | 瀏覽器／裝置 user-agent 字串。 |

## 驗證與授權

### `email_verified`

| 欄位 | 類型 | 要求 | 說明 |
|-------|------|-------------|-------------|
| `context.email_hash` | String | 建議 | 電郵的 SHA-256。絕不使用明文。 |
| `context.verification_method` | String | 建議 | `link` · `otp` · `magic_link` 其中之一。 |

### `phone_verified`

| 欄位 | 類型 | 要求 | 說明 |
|-------|------|-------------|-------------|
| `context.phone_hash` | String | 建議 | 電話的 SHA-256。絕不使用明文。 |
| `context.phone_country_code` | String | 建議 | E.164 國家區號（如 `+91`）。 |
| `context.verification_method` | String | 建議 | 建議用 `sms_otp` · `voice_call` · `whatsapp_otp`。（`call` · `whatsapp` 仍接受但已棄用。） |

### `marketing_consent_updated`

每次都傳送全部四個渠道的完整狀態（包括註冊時的預設授權）。

| 欄位 | 類型 | 要求 | 說明 |
|-------|------|-------------|-------------|
| `context.allow_email` | Boolean | **必填** | 同意電郵。 |
| `context.allow_sms` | Boolean | **必填** | 同意 SMS。 |
| `context.allow_push` | Boolean | **必填** | 同意推送。 |
| `context.allow_whatsapp` | Boolean | **必填** | 同意 WhatsApp。 |
| `context.update_source` | String | 建議 | `signup` · `settings_page` · `unsubscribe_link` · `support` · `admin` 其中之一。 |

## 應用生命週期

> [!NOTE]
> 應用生命週期事件適用於原生 App / APK 廣告主，通常源自行動 SDK / MMP。對於這些事件，`client_user_id`（以及 `app_install` 上的 `ip_address`）會**降級為建議**，因為用戶在註冊前可能是匿名的 — 改為使用 `identity.anonymous_id`。

### `app_install`

App 首次安裝並開啟時觸發一次。

| 欄位 | 類型 | 要求 | 說明 |
|-------|------|-------------|-------------|
| `context.platform` | String | **必填** | `ios` · `android` · `web` 其中之一。 |
| `context.app_version` | String | 建議 | 安裝時的 App 版本。 |
| `context.attribution.install_source` | String | 建議 | 媒體來源／渠道（來自 MMP）。 |
| `context.device_id` | String | 建議 | 裝置識別碼。 |
| `context.store` | String | 建議 | 安裝商店：`app_store` · `play_store` · `apk_direct`。 |
| `context.campaign_id` | String | 建議 | 廣告活動 ID（來自 MMP）。 |
| `context.is_reattribution` | Boolean | 建議 | 重裝／重新歸因為 `true`。 |

### `app_open`

App 啟動／進入前景時觸發。

| 欄位 | 類型 | 要求 | 說明 |
|-------|------|-------------|-------------|
| `context.platform` | String | **必填** | `ios` · `android` · `web` 其中之一。 |
| `context.app_version` | String | 建議 | App 版本。 |
| `context.session_id` | String | 建議 | 工作階段識別碼。 |
| `context.is_first_open` | Boolean | 建議 | 安裝後首次開啟為 `true`。 |

### `app_uninstall`

一個強烈的流失訊號（MMP 透過推送 token 過期偵測）。

| 欄位 | 類型 | 要求 | 說明 |
|-------|------|-------------|-------------|
| `context.platform` | String | **必填** | `ios` · `android` · `web` 其中之一。 |
| `context.app_version` | String | 建議 | 最後安裝的版本。 |
| `context.days_since_install` | Number | 建議 | 從安裝到卸載的天數。 |

### `push_permission_updated`

推送可達性／選擇加入訊號。

| 欄位 | 類型 | 要求 | 說明 |
|-------|------|-------------|-------------|
| `context.platform` | String | **必填** | `ios` · `android` · `web` 其中之一。 |
| `context.permission_status` | String | **必填** | `granted` · `denied` · `provisional` · `revoked` 其中之一。 |
| `context.push_enabled` | Boolean | 建議 | 已授予推送權限為 `true`。 |
| `context.update_source` | String | 建議 | 變更觸發來源：`system_prompt` · `settings` · `onboarding`。 |

## 編碼範例 {#encoding-examples}

以下範例使用合成值。正式填報時使用實際發生時間、身份和業務值。Postback 範例使用 dry run，請使用確認的 origin、Connection ID 和密鑰。

### 註冊範例 {#registration-example}

::: code-group

```json [S2S JSON]
{
  "event": "register",
  "timestamp": 1793870100000,
  "identity": {
    "client_user_id": "example_player",
    "click_id": "EXAMPLE_RS_CLICK_ID"
  },
  "context": {
    "ip_address": "203.0.113.10",
    "device_brand": "Apple",
    "device_model": "iPhone15,3",
    "platform": "ios",
    "os": "iOS"
  }
}
```

```bash [Postback v2 查詢參數]
curl --get "$MMP_ORIGIN/v2/pb/$CONNECTION_ID/events" \
  --data-urlencode "k=$POSTBACK_KEY" \
  --data-urlencode 'dryrun=1' \
  --data-urlencode 'event_id=example-register-001' \
  --data-urlencode 'event=register' \
  --data-urlencode 'timestamp=1793870100000' \
  --data-urlencode 'identity.client_user_id=example_player' \
  --data-urlencode 'identity.click_id=EXAMPLE_RS_CLICK_ID' \
  --data-urlencode 'context.ip_address=203.0.113.10' \
  --data-urlencode 'context.device_brand=Apple' \
  --data-urlencode 'context.device_model=iPhone15,3' \
  --data-urlencode 'context.platform=ios' \
  --data-urlencode 'context.os=iOS'
```

:::
