---
title: iGaming 事件（v3）
sidebar_label: iGaming 事件
description: S2S Events v3 iGaming 目录——面向 iGaming 垂直行业的资金、游戏与奖金生命周期事件。
---

# iGaming 事件

**受众：** 面向 iGaming 产品的工程师、技术集成方

iGaming 事件（`igaming` 预设）涵盖游戏垂直行业：扩展的用户生命周期、KYC、资金、游戏和奖金生命周期。

> [!IMPORTANT]
> iGaming 是一个**按订阅启用的行业预设**。在这些事件被接受之前，你的产品必须已订阅（由 RevoSurge 团队启用）——否则它们会被拒绝为 `422 EVENT_DISABLED`。参见[事件目录与校验](/cn/tracking/s2s/v3/catalog-governance)。

每个事件还携带[基础属性](/cn/tracking/s2s/v3/mandatory-properties)（`event`、`timestamp`、`identity.client_user_id`、`context.ip_address`）。下面的表格**只列出每个事件特有的字段**。货币字段（`amount`、`bet_result_amount` 等）会使用随附的 `currency` 和 `is_crypto` 字段进行换算。

<script setup>
import { s2sV3Events } from '../../../../.vitepress/theme/data/s2s-v3-events'
</script>

## 交互式浏览器

选择一个事件以查看其字段和一个可直接发送的信封。切换“仅必填”，然后复制为 JSON 或 cURL。

<EventPayloadExplorer :events="s2sV3Events" scope="igaming" lang="cn" />

## 用户生命周期

### `session_ended`

会话时长是一个强烈的玩家级流失预测指标。

| 字段 | 类型 | 要求 | 说明 |
|-------|------|-------------|-------------|
| `context.session_id` | String | **必填** | 唯一会话 ID。 |
| `context.session_start_at` | Number | **必填** | 会话开始时间，UTC 毫秒。 |
| `context.duration_minutes` | Number | **必填** | 会话总时长（分钟）。 |

### `vip_tier_changed`

降级是一个强烈的流失信号。对于初始等级，使用 `direction: upgrade`。

| 字段 | 类型 | 要求 | 说明 |
|-------|------|-------------|-------------|
| `context.new_tier` | String | **必填** | 当前等级（例如 `gold`、`vip_1`）。 |
| `context.direction` | String | **必填** | `upgrade` · `downgrade` · `lateral` 之一。 |
| `context.trigger` | String | 建议 | `lifetime_deposits` · `monthly_wagering` · `loyalty_points` · `manual_admin` · `tier_review` · `other` 之一。 |

## 验证与授权

### `kyc_completed`

对于多级 KYC，每个级别触发一次。

| 字段 | 类型 | 要求 | 说明 |
|-------|------|-------------|-------------|
| `context.kyc_level` | String | **必填** | `basic` · `enhanced` · `full` 之一。 |
| `context.jurisdiction` | String | **必填** | ISO 3166-1 国家代码（例如 `BR`、`IN`、`PH`）。 |
| `context.verification_method` | String | **必填** | `id_document` · `video` · `sms_otp` · `address_proof` · `bank_verification` 之一。 |
| `context.time_to_complete_minutes` | Number | 建议 | 从 `register` 到本事件的分钟数。 |

### `kyc_rejected`

`kyc_completed` 的对应事件；用于 KYC 漏斗/拒绝率诊断。

| 字段 | 类型 | 要求 | 说明 |
|-------|------|-------------|-------------|
| `context.kyc_level` | String | **必填** | `basic` · `enhanced` · `full` 之一。 |
| `context.jurisdiction` | String | **必填** | ISO 3166-1 国家代码。 |
| `context.rejection_reason` | String | **必填** | `document_invalid` · `face_mismatch` · `sanctions_hit` · `underage` · `duplicate` · `other` 之一。 |
| `context.verification_method` | String | 建议 | 尝试的验证方式。 |

## 资金

### `deposit`

| 字段 | 类型 | 要求 | 说明 |
|-------|------|-------------|-------------|
| `context.transaction_id` | String | **必填** | 唯一交易 ID（主键）。 |
| `context.amount` | Number | **必填** | 充值金额（货币）。 |
| `context.currency` | String | **必填** | ISO 4217（法币）或加密货币符号。 |
| `context.is_crypto` | Boolean | 建议 | 加密货币为 `true`。 |
| `context.payment_method` | String | 建议 | 例如 `card_visa` · `usdt_trc20` · `pix`。 |

### `deposit_failed`

总充值尝试次数 = `deposit` + `deposit_failed`。

| 字段 | 类型 | 要求 | 说明 |
|-------|------|-------------|-------------|
| `context.transaction_id` | String | **必填** | 尝试 ID（主键，用于去重）。 |
| `context.attempted_amount` | Number | **必填** | 尝试的充值金额（货币）。 |
| `context.currency` | String | **必填** | ISO 4217 或加密货币符号。 |
| `context.payment_method` | String | **必填** | 尝试的支付方式。 |
| `context.failure_reason` | String | **必填** | `insufficient_funds` · `declined_by_issuer` · `network_error` · `fraud_blocked` · `amount_limit` · `unknown` 之一。 |
| `context.is_crypto` | Boolean | 建议 | 加密货币尝试为 `true`。 |

### `withdraw`

| 字段 | 类型 | 要求 | 说明 |
|-------|------|-------------|-------------|
| `context.transaction_id` | String | **必填** | 唯一交易 ID（主键）。 |
| `context.amount` | Number | **必填** | 提现金额（货币）。 |
| `context.currency` | String | **必填** | ISO 4217 或加密货币符号。 |
| `context.is_crypto` | Boolean | 建议 | 加密货币为 `true`。 |

## 游戏

### `bet`

一个单独的已结算投注事件——投注额及其结果通过 `bet_result` / `bet_result_amount` 一起上报。

> [!NOTE]
> 对于 `bet`，`context.ip_address` 会**降级为建议**，因为投注通常来自游戏服务器，没有终端用户 IP。

| 字段 | 类型 | 要求 | 说明 |
|-------|------|-------------|-------------|
| `context.transaction_id` | String | **必填** | 唯一投注/票据 ID（主键）。 |
| `context.game_type` | String | **必填** | `slot` · `live_casino` · `crash` · `sportsbook` 之一。 |
| `context.game_provider` | String | **必填** | 例如 `Pragmatic Play`、`Evolution Gaming`。 |
| `context.game_name` | String | 建议 | 具体游戏名称（例如 `Sweet Bonanza`）。 |
| `context.amount` | Number | **必填** | 总投注额（货币）。 |
| `context.currency` | String | **必填** | ISO 4217 或加密货币符号。 |
| `context.cash_bet_amount` | Number | 建议 | 投注额中的现金部分（用于 NGR / 奖金滥用）。 |
| `context.bonus_bet_amount` | Number | 建议 | 投注额中的奖金部分。 |
| `context.bet_result` | String | **必填** | `win` · `loss` 之一。 |
| `context.bet_result_amount` | Number | **必填** | 净结果——正数 = 赢，负数 = 输（货币）。 |
| `context.ticket_type` | String | 建议 | 体育博彩：`single` · `multi` · `system`。 |
| `context.is_live` | Boolean | 建议 | 体育博彩滚球投注。 |
| `context.is_free` | Boolean | 建议 | 免费投注令牌（从 LTV 中排除）。 |
| `context.is_crypto` | Boolean | 建议 | 加密货币为 `true`。 |

## 奖金生命周期

四个奖金事件必须共享同一个一致的 `bonus_id`，并按顺序触发：`bonus_offered` → `bonus_claimed` → `bonus_completed` → `bonus_cashed_out`。

### `bonus_offered`

| 字段 | 类型 | 要求 | 说明 |
|-------|------|-------------|-------------|
| `context.bonus_id` | String | **必填** | 唯一奖金实例 ID（主键；在整个生命周期内保持一致）。 |
| `context.bonus_type` | String | **必填** | `welcome` · `reload` · `cashback` · `freespin` · `promo_code` · `tournament` · `other` 之一。 |
| `context.bonus_value_max` | Number | **必填** | 可授予的最大金额。 |
| `context.currency` | String | **必填** | 货币。 |
| `context.wagering_multiplier` | Number | **必填** | 流水倍数（30 = 30x；0 = 无）。 |
| `context.valid_until` | Number | **必填** | UTC 毫秒，要约到期时间。 |
| `context.delivery_channel` | String | **必填** | `auto_grant` · `email` · `in_app` · `push` · `promo_code` · `sms` 之一。 |
| `context.is_crypto` | Boolean | 建议 | 加密货币为 `true`。 |

### `bonus_claimed`

对于 `auto_grant`，在 `bonus_offered` 之后立即触发。

| 字段 | 类型 | 要求 | 说明 |
|-------|------|-------------|-------------|
| `context.bonus_id` | String | **必填** | 与 `bonus_offered` 匹配（外键）。 |
| `context.bonus_value_granted` | Number | **必填** | 实际授予的金额（≤ `bonus_value_max`）。 |
| `context.currency` | String | **必填** | 必须与要约时一致。 |
| `context.wagering_requirement` | Number | **必填** | = `bonus_value_granted` × `wagering_multiplier`。 |
| `context.is_crypto` | Boolean | 建议 | 加密货币为 `true`。 |

### `bonus_completed`

| 字段 | 类型 | 要求 | 说明 |
|-------|------|-------------|-------------|
| `context.bonus_id` | String | **必填** | 外键。 |
| `context.total_wagered` | Number | **必填** | 完成时的最终流水。 |
| `context.wagering_requirement` | Number | **必填** | 与领取时相同。 |
| `context.currency` | String | **必填** | 必须与领取时一致。 |
| `context.time_to_complete_minutes` | Number | **必填** | 从 `bonus_claimed` 起的分钟数。 |
| `context.is_crypto` | Boolean | 建议 | 加密货币为 `true`。 |

### `bonus_cashed_out`

可能针对每个 `bonus_id` 多次触发；DataPulse 会对它们求和。

| 字段 | 类型 | 要求 | 说明 |
|-------|------|-------------|-------------|
| `context.bonus_id` | String | **必填** | 外键。 |
| `context.cashout_amount` | Number | **必填** | 转入真实货币钱包的金额。 |
| `context.original_bonus_value` | Number | **必填** | 领取时的 `bonus_value_granted`。 |
| `context.currency` | String | **必填** | 必须与领取时一致。 |
| `context.time_to_cashout_minutes` | Number | **必填** | 从 `bonus_claimed` 起的分钟数。 |
| `context.is_crypto` | Boolean | 建议 | 加密货币为 `true`。 |
