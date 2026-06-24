---
title: 请求信封与基础属性（v3）
sidebar_label: 信封与基础属性
description: S2S Events v3 的信封结构以及每个事件都必须携带的基础属性。
---

# 请求信封与基础属性

**受众：** 工程师、技术集成方

每个 v3 事件都是一个包含四个部分的 JSON **信封**。少数几个**基础属性**会被每个事件继承，无论类型如何；事件特定字段记录在[标准事件](/cn/tracking/s2s/v3/events-standard)和 [iGaming 事件](/cn/tracking/s2s/v3/events-igaming)中。

## 信封结构

```json
{
  "event": "<registered event name>",
  "timestamp": 1718280000000,
  "identity": { "client_user_id": "...", "anonymous_id": "...", "click_id": "..." },
  "context": { "ip_address": "...", "...event-specific fields...": "..." }
}
```

| 部分 | 类型 | 包含内容 |
|------|------|-------|
| `event` | String | 已登记的事件名称。 |
| `timestamp` | Number | 事件发生的时间（UTC 毫秒）。 |
| `identity` | Object | 事件涉及的对象——稳定 ID + 归因点击 ID。 |
| `context` | Object | 事件特定字段（以及 `ip_address`）。 |

## 基础属性

以下属性在**每个**事件上都是必填的（部分可以放宽——参见[降级](#降级)）：

| 属性 | 信封位置 | 类型 | 要求 | 说明 |
|----------|-------------------|------|-------------|-------|
| `event` | 顶层 | String | **必填** | 必须是已登记的目录事件，否则返回 `422 UNKNOWN_EVENT_TYPE`。 |
| `timestamp` | 顶层 | Number | **必填** | UTC 纪元**毫秒**（参见[时间戳](#时间戳)）。 |
| `client_user_id` | `identity.client_user_id` | String | **必填** | 唯一用户 ID。`client_user_id` / `anonymous_id` 之一为必填。 |
| `ip_address` | `context.ip_address` | String | **必填** | 终端用户 IP（IPv4 / IPv6）。驱动地理信息富化。 |

大多数事件上建议携带：

| 属性 | 信封位置 | 类型 | 说明 |
|----------|-------------------|------|-------|
| `click_id` | `identity.click_id` | String | 广告点击 ID——用于广告系列归因。 |
| `anonymous_id` | `identity.anonymous_id` | String | 转化前的拼接 ID；在 `client_user_id` 存在之前满足 identity 要求。 |
| `user_agent` | `context.user_agent` | String | 浏览器/设备 user-agent（解析用于设备智能）。 |

## identity

`identity` **必须至少包含** `client_user_id` 或 `anonymous_id` 之一。

- `client_user_id`——你稳定的、已认证的用户 ID。在所有事件中使用相同的值，并尽可能使用与 [Web Tracker](/cn/tracking/web-tracker) 相同的值。
- `anonymous_id`——一个登录前/注册前的 ID（例如来自设备或首次触点）。让你能够在用户账户存在之前发送事件（例如 `app_install`）；一旦 `client_user_id` 出现，DataPulse 会将其拼接到该用户。
- `click_id`——将事件链接到发起的广告点击。**它本身不满足 identity 要求。**

## 时间戳

`timestamp` 是一个以 **UTC 纪元毫秒**表示的 **Number**（13 位数字，例如 `1718280000000`）。

> [!IMPORTANT]
> v3 使用**毫秒**，而不是秒。校验会拒绝看起来像秒的值（低于 `1000000000000`），并标记 `rule: "not_milliseconds"`；也会拒绝超过未来 **5 分钟**的值，并标记 `rule: "future_skew"`。

## PII 与哈希

个人数据在发送前必须经过 **SHA-256 哈希**——绝不可以是明文。哈希后的字段位于 `context.privacy.*` 下：

| 字段 | 说明 |
|-------|-------|
| `context.privacy.email_hash` | 邮箱的 SHA-256，先转小写并去除首尾空格。 |
| `context.privacy.phone_hash` | E.164 归一化电话号码的 SHA-256。 |

哈希必须是**小写十六进制、64 个字符**（`^[a-f0-9]{64}$`）。格式错误的哈希会被拒绝，并标记 `rule: "pii_format"`。

## 降级

少数事件将 `client_user_id` 和/或 `ip_address` 的基础要求放宽为**建议**，因为该值可能尚不存在：

| 事件 | 放宽项 |
|----------|---------|
| `app_install`、`app_open`、`app_uninstall` | `client_user_id`（以及 `app_install` 的 `ip_address`）——用户在注册前可能是匿名的。 |
| `bet` | `ip_address`——投注通常来自游戏服务器，没有终端用户 IP。 |

## 最小示例

```json
{
  "event": "login",
  "timestamp": 1718280000000,
  "identity": { "client_user_id": "user_001", "click_id": "RS_clk_998877" },
  "context": { "ip_address": "203.0.113.1", "user_agent": "Mozilla/5.0 (...)" }
}
```
