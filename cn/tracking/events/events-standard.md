---
title: 标准事件（v3）
sidebar_label: 标准事件
description: S2S v3 与 Partner Postback v2 共用的事件定义、字段表和编码示例。
---

# 标准事件

**受众：** 工程师、技术集成方

标准事件（`general.core` 预设）对**每个产品自动启用**——无需订阅。它们涵盖用户生命周期、验证与授权，以及应用生命周期。游戏特定事件参见 [iGaming 事件](/cn/tracking/events/events-igaming)。

加密货币交易所和钱包请参见 [Crypto 事件](/cn/tracking/events/events-crypto)。

详见[通用字段与身份](/cn/tracking/events/common-fields)。以下表格列出各事件特有的字段。

<script setup>
import { s2sV3Events } from '../../../.vitepress/theme/data/s2s-v3-events'
</script>

## 交互式浏览器

选择一个事件以查看其字段和一个可直接发送的信封。切换“仅必填”，然后复制为 JSON 或 cURL。

<EventPayloadExplorer :events="s2sV3Events" scope="standard" lang="cn" />

## 用户生命周期

### `register`

创建了一个新的用户账户。

| 字段 | 类型 | 要求 | 说明 |
|-------|------|-------------|-------------|
| `context.user_agent` | String | 建议 | 浏览器/设备 user-agent 字符串。 |
| `context.privacy.email_hash` | String | 建议 | 邮箱的 SHA-256（先转小写并去除首尾空格）。绝不可以是明文。 |
| `context.privacy.phone_hash` | String | 建议 | E.164 归一化电话号码的 SHA-256。绝不可以是明文。 |
| `context.privacy.marketing_consent` | Boolean | 建议 | 用户是否同意接收营销信息。 |
| `context.attribution.install_source` | String | 建议 | 安装/获客来源。 |
| `context.phone_country_code` | String | 建议 | E.164 国家区号（如 `+55`）。 |
| `context.consent_timestamp` | Number | 建议 | 最近一次授权变更，UTC 毫秒。 |
| `context.attribution.utm_source` | String | 建议 | UTM 来源。 |
| `context.attribution.utm_medium` | String | 建议 | UTM 媒介。 |
| `context.attribution.utm_campaign` | String | 建议 | UTM 活动。 |
| `context.attribution.utm_content` | String | 建议 | UTM 内容。 |
| `context.attribution.utm_term` | String | 建议 | UTM 关键词。 |
| `context.device_brand` | String | 建议 | 完成本次注册所用设备的品牌，例如 Apple、Samsung。 |
| `context.device_model` | String | 建议 | 注册设备上报的原始型号标识；保留原值，例如 `iPhone15,3`、`SM-S918B/DS`。 |
| `context.platform` | String | 建议 | 完成本次注册的环境：`web` · `android` · `ios` 之一。 |
| `context.os` | String | 建议 | 注册设备的操作系统，例如 Android、iOS、Windows、Linux、Mac OS X；这些示例不是封闭枚举。 |

### `referral_register`

带推荐归因的注册——携带推荐人的用户 ID。

| 字段 | 类型 | 要求 | 说明 |
|-------|------|-------------|-------------|
| `context.referral_client_user_id` | String | 建议 | 推荐人的 `client_user_id`（推荐本次注册的用户）。 |
| `context.device_brand` | String | 建议 | **新注册用户**完成注册所用设备的品牌，例如 Apple、Samsung。 |
| `context.device_model` | String | 建议 | **新注册用户**的注册设备上报的原始型号标识；保留原值，例如 `iPhone15,3`、`SM-S918B/DS`。 |
| `context.platform` | String | 建议 | **新注册用户**完成注册的环境：`web` · `android` · `ios` 之一。 |
| `context.os` | String | 建议 | **新注册用户**的注册设备操作系统，例如 Android、iOS、Windows、Linux、Mac OS X；这些示例不是封闭枚举。 |

### 注册设备采集规则 {#registration-device}

以上四个设备字段同时适用于 S2S v3 和 [Partner Postback v2](/cn/tracking/postback/v2-api#v2-registration-device) 中的 `register`、`referral_register`。全部为 **String / 建议**：上报能够获取的字段。部分或全部缺失不会导致原本有效的注册事件被拒收；已提供的值仍须满足字段类型要求，`platform` 还须使用上方允许的小写值。

- 采集实际完成**本次注册**的设备。对于 `referral_register`，`identity.client_user_id` 标识新注册用户，`context.referral_client_user_id` 标识推荐人；设备字段属于**新注册用户**，不是推荐人。
- 不得用另一次登录的设备信息替代；即使延迟发送，也应保留注册时采集的值。
- 保留上报的原始型号标识，不得仅凭屏幕分辨率推断具体机型。
- 无法获取的字段应省略，不发送空字符串或 `-`。设备归属和不可用值省略由上报端保证；后端不会确认实际采集设备，也不会统一清理占位字符串。

验收时，对两个事件分别 dry-run 完整四字段、部分缺失和全部缺失的请求，并核对回显 envelope 中的原始机型标识。错误 JSON 类型或非法 `platform` 在 S2S 返回 `400 VALIDATION_ERROR`；Partner Postback v2 的目录类型／枚举错误返回 `422 VALIDATION_ERROR`。合成请求成功只能证明字段可被接收，不能证明真实注册流程采集了正确设备。

### `login`

用户认证登录到你的平台。

| 字段 | 类型 | 要求 | 说明 |
|-------|------|-------------|-------------|
| `context.user_agent` | String | 建议 | 浏览器/设备 user-agent 字符串。 |

## 验证与授权

### `email_verified`

| 字段 | 类型 | 要求 | 说明 |
|-------|------|-------------|-------------|
| `context.email_hash` | String | 建议 | 邮箱的 SHA-256。绝不可以是明文。 |
| `context.verification_method` | String | 建议 | `link` · `otp` · `magic_link` 之一。 |

### `phone_verified`

| 字段 | 类型 | 要求 | 说明 |
|-------|------|-------------|-------------|
| `context.phone_hash` | String | 建议 | 电话号码的 SHA-256。绝不可以是明文。 |
| `context.phone_country_code` | String | 建议 | E.164 国家区号（如 `+91`）。 |
| `context.verification_method` | String | 建议 | 建议用 `sms_otp` · `voice_call` · `whatsapp_otp`。（`call` · `whatsapp` 仍接受但已弃用。） |

### `marketing_consent_updated`

每次都发送全部四个渠道的完整状态（包括注册时的默认授权）。

| 字段 | 类型 | 要求 | 说明 |
|-------|------|-------------|-------------|
| `context.allow_email` | Boolean | **必填** | 同意邮件。 |
| `context.allow_sms` | Boolean | **必填** | 同意短信。 |
| `context.allow_push` | Boolean | **必填** | 同意推送。 |
| `context.allow_whatsapp` | Boolean | **必填** | 同意 WhatsApp。 |
| `context.update_source` | String | 建议 | `signup` · `settings_page` · `unsubscribe_link` · `support` · `admin` 之一。 |

## 应用生命周期

> [!NOTE]
> 应用生命周期事件适用于原生 App / APK 广告主，通常源自移动端 SDK / MMP。对于这些事件，`client_user_id`（以及 `app_install` 上的 `ip_address`）会**降级为建议**，因为用户在注册前可能是匿名的——请改用 `identity.anonymous_id`。

### `app_install`

应用首次安装并打开时触发一次。

| 字段 | 类型 | 要求 | 说明 |
|-------|------|-------------|-------------|
| `context.platform` | String | **必填** | `ios` · `android` · `web` 之一。 |
| `context.app_version` | String | 建议 | 安装时的应用版本。 |
| `context.attribution.install_source` | String | 建议 | 媒体来源/渠道（来自 MMP）。 |
| `context.device_id` | String | 建议 | 设备标识符。 |
| `context.store` | String | 建议 | 安装商店：`app_store` · `play_store` · `apk_direct`。 |
| `context.campaign_id` | String | 建议 | 广告活动 ID（来自 MMP）。 |
| `context.is_reattribution` | Boolean | 建议 | 重装/重新归因为 `true`。 |

### `app_open`

在应用启动/进入前台时触发。

| 字段 | 类型 | 要求 | 说明 |
|-------|------|-------------|-------------|
| `context.platform` | String | **必填** | `ios` · `android` · `web` 之一。 |
| `context.app_version` | String | 建议 | 应用版本。 |
| `context.session_id` | String | 建议 | 会话标识符。 |
| `context.is_first_open` | Boolean | 建议 | 安装后首次打开为 `true`。 |

### `app_uninstall`

一个强烈的流失信号（MMP 通过推送令牌过期检测）。

| 字段 | 类型 | 要求 | 说明 |
|-------|------|-------------|-------------|
| `context.platform` | String | **必填** | `ios` · `android` · `web` 之一。 |
| `context.app_version` | String | 建议 | 最后安装的版本。 |
| `context.days_since_install` | Number | 建议 | 从安装到卸载的天数。 |

### `push_permission_updated`

推送可达性/选择加入信号。

| 字段 | 类型 | 要求 | 说明 |
|-------|------|-------------|-------------|
| `context.platform` | String | **必填** | `ios` · `android` · `web` 之一。 |
| `context.permission_status` | String | **必填** | `granted` · `denied` · `provisional` · `revoked` 之一。 |
| `context.push_enabled` | Boolean | 建议 | 已授予推送权限为 `true`。 |
| `context.update_source` | String | 建议 | 变更触发来源：`system_prompt` · `settings` · `onboarding`。 |

## 编码示例 {#encoding-examples}

以下示例使用合成值。正式填报时使用实际发生时间、身份和业务值。Postback 示例使用 dry run，请使用确认的 origin、Connection ID 和密钥。

### 注册示例 {#registration-example}

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

```bash [Postback v2 查询参数]
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
