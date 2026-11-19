---
title: 通用字段与身份
description: S2S v3 与 Partner Postback v2 共用的身份、时间戳、IP 和业务字段规则。
---

<a id="请求信封与基础属性"></a>
<a id="request-envelope-base-properties"></a>

# 通用字段与身份

S2S v3 发送嵌套 JSON，Partner Postback v2 使用以点号分隔的规范查询参数。下列事件字段含义和要求适用于两种方式。Web 追踪器、AppsFlyer 和 Postback v1 使用各自的接口。

<a id="信封结构"></a>
<a id="基础属性"></a>
<a id="envelope-structure"></a>

## 基础属性 {#base-properties}

| 规范字段 | 含义 | 要求 |
| --- | --- | --- |
| `event` | 已启用的精确事件名 | 必填 |
| `timestamp` | 业务实际发生时间，UTC 整数毫秒 | 必填 |
| `identity.client_user_id` | 稳定的账号或玩家 ID | 与 `identity.anonymous_id` 至少提供一个，部分事件要求账号 ID |
| `identity.anonymous_id` | 注册前的稳定匿名身份 | 仅在事件定义允许时可替代账号 ID |
| `identity.click_id` | 原始 RevoSurge 点击 ID | 可取得且允许时发送，不能代替用户身份 |
| `context.ip_address` | 终端用户 IPv4 或 IPv6 地址 | 按事件定义填写，通常必填 |
| `context.user_agent` | 终端用户浏览器或设备的 User-Agent | 建议提供，以事件定义为准 |

## 身份 {#identity}

跨来源使用同一稳定账号 ID。注册前保留真实的匿名身份。至少提供一种用户身份，`bonus_claimed` 和 `withdraw_rejected` 等事件要求账号身份。联盟平台的点击 ID 和 RevoSurge 点击 ID 应分别保留，在 `identity.click_id` 中发送原始 RevoSurge 值。

<a id="时间戳"></a>

## 时间戳 {#timestamp}

发送实际发生时间，使用 UTC epoch 整数毫秒，至少为 `1000000000000`，未来偏差不超过五分钟。重试保留原值。编码及错误格式见对应 API。

<a id="pii-与哈希"></a>

## PII 与哈希 {#pii-hashing}

哈希字段只接受小写十六进制 SHA-256（64 个字符）。`context.privacy.email_hash` 对去除首尾空格并转为小写的邮箱计算哈希，`context.privacy.phone_hash` 对标准化为 E.164 的号码计算哈希。按事件定义使用对应字段。

<a id="降级"></a>

## 基础要求的例外 {#downgrades}

| 事件 | 例外 |
| --- | --- |
| `app_install`、`app_open`、`app_uninstall` | `client_user_id` 为建议字段。注册前使用真实的匿名 ID |
| `app_install` | `ip_address` 为建议字段 |
| `bet` | 游戏服务器缺少终端用户 IP 时，`ip_address` 为建议字段 |

`app_open` 和 `app_uninstall` 仍应满足其 IP 要求。`withdraw_rejected` 使用原始提款申请的终端用户 IP。缺少来源身份或 IP 时，按实际数据处理。

## 金额和来源 ID {#money-and-source-ids}

按事件定义发送金额、币种和计量单位。交易 ID、来源事件 ID 和请求追踪 ID 各有用途，重试时保留原始业务 ID。具体的重试和金额处理规则由各传输方式定义。Crypto 交易金额和手续费可使用不同资产。更新后的 iGaming 奖金与拒绝提款事件使用 ISO 4217 法币。

<a id="最小示例"></a>
<a id="minimal-example"></a>

## 编码示例 {#examples}

- [标准事件](/cn/tracking/events/events-standard)
- [iGaming 事件](/cn/tracking/events/events-igaming)
- [Crypto 事件](/cn/tracking/events/events-crypto)
- [S2S 请求结构](/cn/tracking/s2s/v3/server-events-api#the-request-envelope)
- [Postback v2 查询参数](/cn/tracking/postback/v2-api#v2-parameters)
