---
title: 标准事件（v3）
sidebar_label: 标准事件
description: S2S Events v3 标准目录——面向每个产品的跨行业事件。
---

# 标准事件

**受众：** 工程师、技术集成方

标准事件（`general.core` 预设）对**每个产品自动启用**——无需订阅。它们涵盖用户生命周期、验证与授权，以及应用生命周期。游戏特定事件参见 [iGaming 事件](/cn/tracking/s2s/v3/events-igaming)。

每个事件还携带[基础属性](/cn/tracking/s2s/v3/mandatory-properties)（`event`、`timestamp`、`identity.client_user_id`、`context.ip_address`）。下面的表格**只列出每个事件特有的字段**。

<script setup>
import { s2sV3Events } from '../../../../.vitepress/theme/data/s2s-v3-events'
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
| `context.verification_method` | String | 建议 | `sms_otp` · `call` · `whatsapp` 之一。 |

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

### `app_open`

在应用启动/进入前台时触发。

| 字段 | 类型 | 要求 | 说明 |
|-------|------|-------------|-------------|
| `context.platform` | String | **必填** | `ios` · `android` · `web` 之一。 |
| `context.app_version` | String | 建议 | 应用版本。 |
| `context.session_id` | String | 建议 | 会话标识符。 |

### `app_uninstall`

一个强烈的流失信号（MMP 通过推送令牌过期检测）。

| 字段 | 类型 | 要求 | 说明 |
|-------|------|-------------|-------------|
| `context.platform` | String | **必填** | `ios` · `android` · `web` 之一。 |
| `context.app_version` | String | 建议 | 最后安装的版本。 |

### `push_permission_updated`

推送可达性/选择加入信号。

| 字段 | 类型 | 要求 | 说明 |
|-------|------|-------------|-------------|
| `context.platform` | String | **必填** | `ios` · `android` · `web` 之一。 |
| `context.permission_status` | String | **必填** | `granted` · `denied` · `provisional` · `revoked` 之一。 |
