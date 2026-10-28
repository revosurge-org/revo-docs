---
title: Crypto 事件（v3）
sidebar_label: Crypto 事件
description: S2S Events v3 Crypto 目录——面向加密货币交易所和钱包的资金、交易和奖励事件。
---

# Crypto 事件

Crypto 事件（`crypto` 预设）适用于加密货币交易所和钱包，涵盖扩展的用户生命周期、KYC 与账户状态、资金、交易和奖励。

> [!IMPORTANT]
> Crypto 是**按订阅启用的行业预设**。你的产品必须先订阅（由 RevoSurge 团队启用），才能接收这些事件；否则会返回 `422 EVENT_DISABLED`。参见[事件目录与校验](./catalog-governance)。

每个事件还携带[基础属性](./mandatory-properties)（`event`、`timestamp`、`identity.client_user_id`、`context.ip_address`）。以下表格**仅列出各事件特有的字段**。

所有事件均使用**相同的 `identity.client_user_id`**。RevoSurge 通过此 ID 将用户转化关联到带来该用户的广告活动。

<script setup>
import { s2sV3Events } from '../../../../.vitepress/theme/data/s2s-v3-events'
</script>

## 交互式浏览器

选择事件，查看字段和可直接发送的请求。切换“仅必填”，然后复制 JSON 或 cURL。

<EventPayloadExplorer :events="s2sV3Events" scope="crypto" lang="cn" />

## 用户生命周期

### `vip_tier_changed`

降级是强烈的流失信号。首次设置等级时，使用 `direction: upgrade`。

| 字段                   | 类型   | 要求  | 说明                                                                                                            |
| ----------------------- | ------ | ------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `context.new_tier`      | String | **必填** | 当前等级（如 `vip_1`、`gold`）                                                                                    |
| `context.previous_tier` | String | 建议    | 变更前的等级                                                                                                 |
| `context.direction`     | String | **必填** | `upgrade` · `downgrade` · `lateral`                                                                                    |
| `context.trigger`       | String | 建议    | `lifetime_deposits` · `trading_volume` · `asset_balance` · `loyalty_points` · `manual_admin` · `tier_review` · `other` |

## 验证与授权

### `kyc_completed`

多级 KYC 每完成一个等级发送一次。

| 字段 | 类型 | 要求 | 说明 |
| --- | --- | --- | --- |
| `context.kyc_level` | String | **必填** | `basic` · `enhanced` · `full` |
| `context.jurisdiction` | String | **必填** | ISO 3166-1 国家代码 |
| `context.verification_method` | String | **必填** | `id_document` · `video` · `sms_otp` · `address_proof` · `bank_verification` |
| `context.time_to_complete_minutes` | Number | 建议 | 从 `register` 到此事件的分钟数 |

### `kyc_rejected`

与 `kyc_completed` 对应，用于分析 KYC 漏斗和拒绝率。

| 字段                            | 类型   | 要求  | 说明                                                                                                                                                                           |
| -------------------------------- | ------ | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `context.kyc_level`              | String | **必填** | `basic` · `enhanced` · `full`                                                                                                                                                         |
| `context.jurisdiction`           | String | **必填** | ISO 3166-1 国家代码                                                                                                                                                               |
| `context.rejection_reason`       | String | **必填** | `document_invalid` · `face_mismatch` · `sanctions_hit` · `duplicate` · `document_unreadable` · `document_expired` · `name_mismatch` · `age_restriction` · `suspected_fraud` · `other` |
| `context.verification_method`    | String | 建议    | 尝试的验证方式                                                                                                                                                         |
| `context.time_to_reject_minutes` | Number | 建议    | 从 `register` 到此事件的分钟数                                                                                                                                                 |

## 资金

仅上报跨越平台边界的资金流动。用户自己的钱包之间的划转（例如现货 → 合约）**不属于** `deposit` 或 `withdraw`。金额使用实际转移的资产计价（0.015 BTC 应传 `"amount": 0.015, "currency": "BTC"`）；链上转账同时传 `network`。

### `deposit`

资金到账且可用时发送；链上充值需等待达到平台要求的确认数。

| 字段                    | 类型   | 要求  | 说明                                                               |
| ------------------------ | ------ | ------------ | ------------------------------------------------------------------------- |
| `context.transaction_id` | String | **必填** | 唯一交易 ID（主键）                                                |
| `context.amount`         | Number | **必填** | 扣除手续费前的充值金额（货币字段）                                     |
| `context.currency`       | String | **必填** | ISO 4217（法币）或加密货币符号                                          |
| `context.deposit_type`   | String | 建议    | `onchain` · `fiat_bank` · `card` · `p2p` · `third_party_onramp` · `other` |
| `context.payment_method` | String | 建议    | 例如 `usdt_trc20` · `card_visa` · `pix`                                   |
| `context.network`        | String | 建议    | 区块链网络，例如 `TRC20`                                          |
| `context.fee_amount`     | Number | 建议    | 收取的充值手续费，以 `currency` 计价                                        |
| `context.tx_hash`        | String | 建议    | 链上交易哈希                                                 |

### `withdraw`

| 字段                    | 类型   | 要求  | 说明                                        |
| ------------------------ | ------ | ------------ | -------------------------------------------------- |
| `context.transaction_id` | String | **必填** | 唯一交易 ID（主键）                         |
| `context.amount`         | Number | **必填** | 扣除手续费前的提现金额（货币字段）           |
| `context.currency`       | String | **必填** | ISO 4217 或加密货币符号                          |
| `context.withdraw_type`  | String | 建议    | `onchain` · `fiat_bank` · `card` · `p2p` · `other` |
| `context.network`        | String | 建议    | 区块链网络，例如 `ERC20`                   |
| `context.fee_amount`     | Number | 建议    | 收取的提现手续费，以 `currency` 计价              |
| `context.tx_hash`        | String | 建议    | 链上交易哈希                          |

## 交易

用户的首个 `trade` 即**首次交易（FTT）**，是首次充值后的主要价值事件。首笔订单成交后应立即发送 `trade`，以准确记录用户开始交易的时间。

不要上报演示或模拟账户的交易，否则这些交易也会被计为首次交易。

### `trade`

每个已成交订单发送一个事件：订单全部成交，或部分成交后撤销时发送。不要为每次部分成交分别发送事件。合约开仓和平仓属于不同的已成交订单，应各自发送 `trade`。

| 字段                      | 类型   | 要求  | 说明                                                                                                  |
| -------------------------- | ------ | ------------ | ------------------------------------------------------------------------------------------------------------ |
| `context.transaction_id`   | String | **必填** | 唯一订单 ID（主键）                                                                                         |
| `context.product_type`     | String | **必填** | `futures`（永续和交割合约）· `spot` · `convert` · `other`                                  |
| `context.amount`           | Number | **必填** | 已成交名义价值（货币字段）。期货：本次交易的成交数量 × 成交价格，而非保证金            |
| `context.currency`         | String | **必填** | `amount` 的币种。USDT 或 USDC 本位：报价资产；币本位（Coin-M）：该币种本身       |
| `context.fee_amount`       | Number | **必填** | 向用户收取的交易手续费，按抵扣券和手续费抵扣前计算（货币字段）。零手续费交易传 `0`；挂单返佣传负值 |
| `context.fee_currency`     | String | **必填** | `fee_amount` 的币种                                                                                     |

### 替代方案： `trade_daily_summary`

如果无法逐笔发送 `trade`，可在每天结束后（UTC），按用户、日期和 `product_type` 各发送一个 `trade_daily_summary` 事件作为替代。

> **注意：** 推荐逐笔发送 `trade`。每日汇总只能按天记录首次交易，且最多延迟一天到达，会减慢广告活动优化。

| 字段                     | 类型   | 要求  | 说明                                                                 |
| ------------------------- | ------ | ------------ | --------------------------------------------------------------------------- |
| `identity.client_user_id` | String | **必填** | 与 `register` 和 `deposit` 相同的用户 ID                                 |
| `context.date`            | String | **必填** | 交易日期，UTC 时区，格式为 `YYYY-MM-DD`                                           |
| `context.product_type`    | String | **必填** | `futures` · `spot` · `convert` · `other`                                    |
| `context.amount_usd`      | Number | **必填** | 当天已成交名义价值总额，以 USD 计价                             |
| `context.fee_usd`         | Number | **必填** | 当天收取的交易手续费总额，以 USD 计价，按抵扣券和手续费抵扣前计算 |
| `context.trade_count`     | Number | **必填** | 当天已成交订单数量                                            |

## 奖励

### `reward_claimed`

结合 `deposit` 和 `trade`，识别领取奖励但从未交易的用户。使用 `reward_trigger` 表明获得奖励的行为，例如首次合约交易获得的优惠券。

| 字段                    | 类型   | 要求  | 说明                                                                                                                                                            |
| ------------------------ | ------ | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `context.reward_id`      | String | **必填** | 唯一奖励实例 ID（主键）                                                                                                                                         |
| `context.reward_type`    | String | **必填** | `signup_bonus` · `deposit_bonus` · `trading_fee_voucher` · `futures_bonus` · `position_airdrop` · `airdrop` · `referral_reward` · `cashback` · `task_reward` · `other` |
| `context.reward_trigger` | String | **必填** | 获得奖励的行为： `register` · `kyc` · `first_deposit` · `first_trade` · `first_futures_trade` · `first_copy_trade` · `trading_volume` · `other`          |
| `context.value`          | Number | **必填** | 奖励价值（货币字段）                                                                                                                                                |
| `context.currency`       | String | **必填** | 币种                                                                                                                                                               |
| `context.expires_at`     | Number | 建议    | 奖励到期时间，UTC 毫秒                                                                                                                                                  |

