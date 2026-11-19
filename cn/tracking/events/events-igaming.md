---
title: iGaming 事件（v3）
sidebar_label: iGaming 事件
description: S2S v3 与 Partner Postback v2 共用的事件定义、字段表和编码示例。
---

# iGaming 事件

**受众：** 面向 iGaming 产品的工程师、技术集成方

iGaming 事件（`igaming` 预设）涵盖游戏垂直行业：扩展的用户生命周期、KYC 与账户状态、资金、游戏和奖金生命周期。

> [!IMPORTANT]
> iGaming 预设由产品的市场类别启用。参见[事件目录与校验](./catalog-validation)。

详见[通用字段与身份](/cn/tracking/events/common-fields)。以下表格列出各事件特有的字段。

<script setup>
import { s2sV3Events } from '../../../.vitepress/theme/data/s2s-v3-events'
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
| `context.total_wagered` | Number | 建议 | 会话内总投注额。 |
| `context.total_won` | Number | 建议 | 会话内总赢额。 |
| `context.bet_count` | Number | 建议 | 会话内投注次数。 |
| `context.currency` | String | 建议 | 若上报 `total_wagered` / `total_won` 则必填。 |
| `context.is_crypto` | Boolean | 建议 | 加密货币计价为 `true`。 |
| `context.end_reason` | String | 建议 | `user_logout` · `timeout` · `forced_logout` · `unknown` 之一。 |

### `vip_tier_changed`

降级是一个强烈的流失信号。对于初始等级，使用 `direction: upgrade`。

| 字段 | 类型 | 要求 | 说明 |
|-------|------|-------------|-------------|
| `context.new_tier` | String | **必填** | 当前等级（例如 `gold`、`vip_1`）。 |
| `context.previous_tier` | String | 建议 | 本次变更前的等级。 |
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
| `context.rejection_reason` | String | **必填** | `document_invalid` · `face_mismatch` · `sanctions_hit` · `underage` · `duplicate` · `document_unreadable` · `document_expired` · `name_mismatch` · `age_restriction` · `suspected_fraud` · `other` 之一。 |
| `context.verification_method` | String | 建议 | 尝试的验证方式。 |
| `context.time_to_reject_minutes` | Number | 建议 | 从 `register` 到本事件的分钟数。 |

### `account_blocked`

将被封禁的账户从 LTV / 流失模型中排除。

| 字段 | 类型 | 要求 | 说明 |
|-------|------|-------------|-------------|
| `context.block_reason` | String | **必填** | `fraud` · `bonus_abuse` · `multi_account` · `self_exclusion` · `compliance` · `payment_chargeback` · `other` 之一。 |
| `context.block_duration` | String | 建议 | `permanent` · `temporary` · `under_review` 之一。 |
| `context.expected_unblock_at` | Number | 建议 | UTC 毫秒；用于临时封禁。 |

### `account_unblocked`

| 字段 | 类型 | 要求 | 说明 |
|-------|------|-------------|-------------|
| `context.unblock_reason` | String | **必填** | 建议用 `review_passed` · `appeal_approved` · `cooldown_ended` · `manual_admin` · `other`。（`temporary_expired` 仍接受但已弃用。） |
| `context.previous_block_reason` | String | 建议 | 被解除的封禁的原因。 |

## 资金

### `deposit_initiated`

| 字段 | 类型 | 要求 | 说明 |
|-------|------|-------------|-------------|
| `context.transaction_id` | String | **必填** | 支付订单 ID（主键；须与后续 `deposit` / `deposit_failed` 一致）。 |
| `context.amount` | Number | **必填** | 申请充值的金额（货币）。 |
| `context.currency` | String | **必填** | ISO 4217（法币）或加密货币符号。 |
| `context.is_crypto` | Boolean | 建议 | 加密货币为 `true`。 |
| `context.payment_method` | String | 建议 | 用户所选支付渠道，例如 `card_visa` · `usdt_trc20` · `pix`。 |

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

### `withdraw_rejected`

提款申请正式被拒绝时发送。仍在审核的申请无需发送。使用该账户其他事件的 `identity.client_user_id`，并提供原始申请的终端用户 `context.ip_address`。

| 字段 | 类型 | 要求 | 说明 |
| --- | --- | --- | --- |
| `context.currency` | String | **必填** | ISO 4217 法币代码，适用于本事件的所有金额。 |
| `context.transaction_id` | String | **必填** | 被拒绝的原始提款申请 ID。重试保持一致，新申请使用新的 ID。 |
| `context.amount` | Number | **必填** | 被拒绝的提款申请金额。 |
| `context.withdrawal_method` | String | **必填** | `card`、`bank_transfer`、`ewallet`、`crypto`、`voucher`、`other`。 |
| `context.rejection_reason` | String | **必填** | `bonus_terms_violation`、`wagering_not_met`、`multi_account`、`suspected_fraud`、`kyc_required`、`payment_risk`、`aml_flag`、`manual_review`、`other`。仅在已拒绝但原因未分类时使用 `manual_review`。 |
| `context.rejection_source` | String | 选填 | `risk_engine`、`operations`、`payment_provider`、`other`。 |

## 游戏

### `bet`

一个单独的已结算投注事件——投注额及其结果通过 `bet_result` / `bet_result_amount` 一起上报。

> [!NOTE]
> 对于 `bet`，`context.ip_address` 会**降级为建议**，因为投注通常来自游戏服务器，没有终端用户 IP。

| 字段 | 类型 | 要求 | 说明 |
|-------|------|-------------|-------------|
| `context.transaction_id` | String | **必填** | 唯一投注/票据 ID（主键）。 |
| `context.game_type` | String | **必填** | 规范游戏类型——见下方取值。 |
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

#### `game_type` 规范值 {#game-type-values}

`context.game_type`（String，**必填**）会归一化为下表中的**规范类型**。可以发送规范键本身，也可以发送它对应的任意别名，两者都会归一化为同一个规范类型。

| `game_type` | 可接受的别名（Aliases） |
|-------------|------------------|
| `slot` | `slot`（老虎机）· `pachinko`（弹珠机） |
| `live_casino` | `live`（真人）· `gameshow`（真人游戏秀） |
| `sportsbook` | `sport`（体育）· `cockfight`（斗鸡） |
| `fishing` | `fish`（捕鱼）· `arcade`（街机） |
| `table_games` | `baccarat`（百家乐）· `blackjack`（二十一点）· `roulette`（轮盘）· `dice`（骰宝）· `card`（纸牌）· `table`（桌台） |
| `poker` | `poker`（德州扑克） |
| `lottery` | `lottery`（彩票）· `bingo`（宾果）· `instant`（即开彩／刮刮乐） |
| `esports` | `esport`（电竞） |
| `crash` | `crash` · `aviator`（崩盘／坠机游戏） |

`game_type` 为受校验的字段——只能发送规范键或其所列别名，未登记的值会被拒收。

## 奖金生命周期

<a id="bonus-offered"></a>
<a id="bonus-completed"></a>
<a id="bonus-cashed-out"></a>

使用 `bonus_claimed` 上报实际入账奖金。原有的 `bonus_offered`、`bonus_completed` 和 `bonus_cashed_out` 已停用。

### `bonus_claimed`

单笔奖金实际入账时发送，包括自动发放。使用单笔奖金的 ID，无需先发送奖金优惠事件。

| 字段 | 类型 | 要求 | 说明 |
| --- | --- | --- | --- |
| `context.currency` | String | **必填** | ISO 4217 法币代码，适用于本事件的所有金额。 |
| `context.bonus_id` | String | **必填** | 实际入账的单笔奖金 ID。 |
| `context.bonus_type` | String | **必填** | `welcome`、`deposit_match`、`no_deposit`、`free_spins`、`cashback`、`reload`、`referral`、`vip`、`other`。 |
| `context.bonus_value_granted` | Number | **必填** | 实际入账价值。免费旋转使用来源系统定义的入账估值。 |
| `context.wagering_requirement` | Number | 适用时必填 | 条款引擎计算的有效流水目标。只有确定没有要求时才填 `0`。 |
| `context.wagering_multiplier` | Number | 选填 | 条款中的流水倍数。流水计算基数由实际条款决定。 |
| `context.bonus_expiry_time` | String | 适用时必填 | UTC ISO 8601 到期时间。 |
| `context.claim_channel` | String | 选填 | `in_app`、`email`、`push`、`sms`、`promo_code`、`affiliate`、`auto_grant`。 |
| `context.deposit_transaction_id` | String | 适用时必填 | 触发奖金的成功充值 ID。 |
| `context.deposit_amount` | Number | 选填 | 触发本次奖金的成功充值金额，使用事件币种。 |

## 编码示例 {#encoding-examples}

以下示例使用合成值。正式填报时使用实际发生时间、身份和业务值。Postback 示例使用 dry run，请使用确认的 origin、Connection ID 和密钥。

### bonus_claimed 编码示例 {#bonus-claimed-encoding-example}

::: code-group

```json [S2S JSON]
{
  "event": "bonus_claimed",
  "timestamp": 1793870100000,
  "identity": {
    "client_user_id": "player_12345",
    "click_id": "RS_clk_example_001",
    "anonymous_id": "anon_example_001"
  },
  "context": {
    "ip_address": "203.0.113.10",
    "currency": "USD",
    "bonus_id": "bonus_instance_98765",
    "bonus_type": "deposit_match",
    "bonus_value_granted": 50.0,
    "wagering_multiplier": 30,
    "wagering_requirement": 1500.0,
    "bonus_expiry_time": "2026-11-12T09:15:00Z",
    "claim_channel": "in_app",
    "deposit_transaction_id": "dep_000456",
    "deposit_amount": 50.0
  }
}
```

```bash [Postback v2 查询参数]
curl --get "$MMP_ORIGIN/v2/pb/$CONNECTION_ID/events" \
  --data-urlencode "k=$POSTBACK_KEY" \
  --data-urlencode 'dryrun=1' \
  --data-urlencode 'event_id=example-bonus_claimed-001' \
  --data-urlencode 'event=bonus_claimed' \
  --data-urlencode 'timestamp=1793870100000' \
  --data-urlencode 'identity.client_user_id=player_12345' \
  --data-urlencode 'identity.click_id=RS_clk_example_001' \
  --data-urlencode 'identity.anonymous_id=anon_example_001' \
  --data-urlencode 'context.ip_address=203.0.113.10' \
  --data-urlencode 'context.currency=USD' \
  --data-urlencode 'context.bonus_id=bonus_instance_98765' \
  --data-urlencode 'context.bonus_type=deposit_match' \
  --data-urlencode 'context.bonus_value_granted=50.0' \
  --data-urlencode 'context.wagering_multiplier=30' \
  --data-urlencode 'context.wagering_requirement=1500.0' \
  --data-urlencode 'context.bonus_expiry_time=2026-11-12T09:15:00Z' \
  --data-urlencode 'context.claim_channel=in_app' \
  --data-urlencode 'context.deposit_transaction_id=dep_000456' \
  --data-urlencode 'context.deposit_amount=50.0'
```

:::

### withdraw_rejected 编码示例 {#withdraw-rejected-encoding-example}

::: code-group

```json [S2S JSON]
{
  "event": "withdraw_rejected",
  "timestamp": 1793873880000,
  "identity": {
    "client_user_id": "player_12345",
    "click_id": "RS_clk_example_001",
    "anonymous_id": "anon_example_001"
  },
  "context": {
    "ip_address": "203.0.113.10",
    "currency": "USD",
    "transaction_id": "wd_20261105_000123",
    "amount": 62.4,
    "withdrawal_method": "crypto",
    "rejection_reason": "kyc_required",
    "rejection_source": "operations"
  }
}
```

```bash [Postback v2 查询参数]
curl --get "$MMP_ORIGIN/v2/pb/$CONNECTION_ID/events" \
  --data-urlencode "k=$POSTBACK_KEY" \
  --data-urlencode 'dryrun=1' \
  --data-urlencode 'event_id=example-withdraw_rejected-001' \
  --data-urlencode 'event=withdraw_rejected' \
  --data-urlencode 'timestamp=1793873880000' \
  --data-urlencode 'identity.client_user_id=player_12345' \
  --data-urlencode 'identity.click_id=RS_clk_example_001' \
  --data-urlencode 'identity.anonymous_id=anon_example_001' \
  --data-urlencode 'context.ip_address=203.0.113.10' \
  --data-urlencode 'context.currency=USD' \
  --data-urlencode 'context.transaction_id=wd_20261105_000123' \
  --data-urlencode 'context.amount=62.4' \
  --data-urlencode 'context.withdrawal_method=crypto' \
  --data-urlencode 'context.rejection_reason=kyc_required' \
  --data-urlencode 'context.rejection_source=operations'
```

:::
