---
title: "Crypto events"
description: "Crypto deposit, withdrawal, trading and reward event fields with S2S and Postback examples."
---

# Crypto events


Crypto events (the `crypto` preset) cover crypto exchanges and wallets: extended user lifecycle, KYC & account status, financial, trading, and rewards.

> Note:
> Crypto is an **industry preset enabled by your Product’s market category**. Set the Product’s market category to Crypto to enable the corresponding industry events. See [Event catalog & validation](/en/tracking/events/catalog-validation).

S2S v3 and Partner Postback v2 share these event definitions. Every event also carries the [base properties](/en/tracking/events/common-fields) (event name, occurrence time, usable identity and applicable end-user IP). The tables below list **only the fields specific to each event**.

Use the **same `identity.client_user_id`** on all events. RevoSurge uses this ID to link a user's conversion to the campaign that brought them.

<script setup>
import { s2sV3Events } from '../../../.vitepress/theme/data/s2s-v3-events'
</script>

## Interactive explorer

Pick an event to preview its fields and copy an S2S JSON or cURL example.

<EventPayloadExplorer :events="s2sV3Events" scope="crypto" lang="en" />

## User Lifecycle

### `vip_tier_changed`

A downgrade is a strong churn signal. For an initial tier, use `direction: upgrade`.

| Field                   | Type   | Requirement  | Description                                                                                                            |
| ----------------------- | ------ | ------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `context.new_tier`      | String | **Required** | Current tier (e.g. `vip_1`, `gold`)                                                                                    |
| `context.previous_tier` | String | Suggested    | Tier before the change                                                                                                 |
| `context.direction`     | String | **Required** | `upgrade` · `downgrade` · `lateral`                                                                                    |
| `context.trigger`       | String | Suggested    | `lifetime_deposits` · `trading_volume` · `asset_balance` · `loyalty_points` · `manual_admin` · `tier_review` · `other` |

## Verification & Consent

### `kyc_completed`

Fire once per level for multi-level KYC.

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `context.kyc_level` | String | **Required** | `basic` · `enhanced` · `full` |
| `context.jurisdiction` | String | **Required** | ISO 3166-1 country code |
| `context.verification_method` | String | **Required** | `id_document` · `video` · `sms_otp` · `address_proof` · `bank_verification` |
| `context.time_to_complete_minutes` | Number | Suggested | Minutes from `register` to this event |

### `kyc_rejected`

Counterpart to `kyc_completed`; for KYC funnel / rejection-rate diagnostics.

| Field                            | Type   | Requirement  | Description                                                                                                                                                                           |
| -------------------------------- | ------ | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `context.kyc_level`              | String | **Required** | `basic` · `enhanced` · `full`                                                                                                                                                         |
| `context.jurisdiction`           | String | **Required** | ISO 3166-1 country code                                                                                                                                                               |
| `context.rejection_reason`       | String | **Required** | `document_invalid` · `face_mismatch` · `sanctions_hit` · `duplicate` · `document_unreadable` · `document_expired` · `name_mismatch` · `age_restriction` · `suspected_fraud` · `other` |
| `context.verification_method`    | String | Suggested    | Verification method attempted                                                                                                                                                         |
| `context.time_to_reject_minutes` | Number | Suggested    | Minutes from `register` to this event                                                                                                                                                 |

## Financial

Only send money that crosses your platform boundary. Transfers between a user's own wallets (for example Spot → Futures) are **not** a `deposit` or `withdraw`. Send the amount in the asset it moved in (0.015 BTC is `"amount": 0.015, "currency": "BTC"`), with `network` for on-chain transfers.

### `deposit`

Fire when funds are credited and available — for on-chain deposits, after your required confirmations.

| Field                    | Type   | Requirement  | Description                                                               |
| ------------------------ | ------ | ------------ | ------------------------------------------------------------------------- |
| `context.transaction_id` | String | **Required** | Unique transaction ID (PK)                                                |
| `context.amount`         | Number | **Required** | Deposit amount before fees (monetary)                                     |
| `context.currency`       | String | **Required** | ISO 4217 (fiat) or crypto symbol                                          |
| `context.deposit_type`   | String | Suggested    | `onchain` · `fiat_bank` · `card` · `p2p` · `third_party_onramp` · `other` |
| `context.payment_method` | String | Suggested    | e.g. `usdt_trc20` · `card_visa` · `pix`                                   |
| `context.network`        | String | Suggested    | Blockchain network, e.g. `TRC20`                                          |
| `context.fee_amount`     | Number | Suggested    | Deposit fee charged, in `currency`                                        |
| `context.tx_hash`        | String | Suggested    | On-chain transaction hash                                                 |

### `withdraw`

| Field                    | Type   | Requirement  | Description                                        |
| ------------------------ | ------ | ------------ | -------------------------------------------------- |
| `context.transaction_id` | String | **Required** | Unique transaction ID (PK)                         |
| `context.amount`         | Number | **Required** | Withdrawal amount before fees (monetary)           |
| `context.currency`       | String | **Required** | ISO 4217 or crypto symbol                          |
| `context.withdraw_type`  | String | Suggested    | `onchain` · `fiat_bank` · `card` · `p2p` · `other` |
| `context.network`        | String | Suggested    | Blockchain network, e.g. `ERC20`                   |
| `context.fee_amount`     | Number | Suggested    | Withdrawal fee charged, in `currency`              |
| `context.tx_hash`        | String | Suggested    | On-chain transaction hash                          |

## Trading

A user's first `trade` is their **First Trade (FTT)** — the main value event after the first deposit. Send `trade` as soon as the first order fills, so first trade is timed to when the user actually starts trading.

Do not send trades from demo or simulated accounts — they would count as a first trade.

### `trade`

One event per filled order — sent when the order is fully filled or cancelled after a partial fill. Do not send one event per partial fill. For futures, opening and closing a contract are separate filled orders, so each sends its own `trade`.

| Field                      | Type   | Requirement  | Description                                                                                                  |
| -------------------------- | ------ | ------------ | ------------------------------------------------------------------------------------------------------------ |
| `context.transaction_id`   | String | **Required** | Unique order ID (PK)                                                                                         |
| `context.product_type`     | String | **Required** | `futures` (perpetual and delivery contracts) · `spot` · `convert` · `other`                                  |
| `context.amount`           | Number | **Required** | Filled notional value (monetary). Futures: quantity filled in this trade × fill price, not margin            |
| `context.currency`         | String | **Required** | Currency of `amount`. USDT- or USDC-margined: the quote asset. Coin-margined (Coin-M): the coin itself       |
| `context.fee_amount`       | Number | **Required** | Trading fee charged to the user, before coupons and fee credits (monetary). Send `0` for zero-fee trades; a negative value for maker rebates |
| `context.fee_currency`     | String | **Required** | Currency of `fee_amount`                                                                                     |

### Alternative: `trade_daily_summary`

If sending one event per trade is not practical, send one `trade_daily_summary` event per user, per day, per `product_type` instead, after the day ends (UTC).

> **Note:** Per-trade `trade` events are recommended. With a daily summary, first trades are reported by day and arrive up to a day later, which slows campaign optimization.

| Field                     | Type   | Requirement  | Description                                                                 |
| ------------------------- | ------ | ------------ | --------------------------------------------------------------------------- |
| `identity.client_user_id` | String | **Required** | Same user ID as on `register` and `deposit`                                 |
| `context.date`            | String | **Required** | Trading day, `YYYY-MM-DD`, in UTC                                           |
| `context.product_type`    | String | **Required** | `futures` · `spot` · `convert` · `other`                                    |
| `context.amount_usd`      | Number | **Required** | Total filled notional value for the day, in USD                             |
| `context.fee_usd`         | Number | **Required** | Total trading fees charged that day, in USD, before coupons and fee credits |
| `context.trade_count`     | Number | **Required** | Number of filled orders that day                                            |

## Rewards

### `reward_claimed`

Pair with `deposit` and `trade` to spot users who claim rewards but never trade. Use `reward_trigger` to show which action earned the reward — for example, a coupon granted for the first futures trade.

| Field                    | Type   | Requirement  | Description                                                                                                                                                            |
| ------------------------ | ------ | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `context.reward_id`      | String | **Required** | Unique reward instance ID (PK)                                                                                                                                         |
| `context.reward_type`    | String | **Required** | `signup_bonus` · `deposit_bonus` · `trading_fee_voucher` · `futures_bonus` · `position_airdrop` · `airdrop` · `referral_reward` · `cashback` · `task_reward` · `other` |
| `context.reward_trigger` | String | **Required** | Action that earned the reward: `register` · `kyc` · `first_deposit` · `first_trade` · `first_futures_trade` · `first_copy_trade` · `trading_volume` · `other`          |
| `context.value`          | Number | **Required** | Reward value (monetary)                                                                                                                                                |
| `context.currency`       | String | **Required** | Currency                                                                                                                                                               |
| `context.expires_at`     | Number | Suggested    | UTC ms, reward expiry                                                                                                                                                  |



## Encoding examples

Synthetic values illustrate a credited on-chain deposit. Use actual source values and occurrence time. This is not a runtime validation result. Postback uses dry-run mode with a confirmed origin and Connection credentials. Amount/currency meaning is shared; ingestion conversion behavior remains method-specific.

### Crypto deposit

::: code-group

```json [S2S JSON]
{
  "event": "deposit",
  "timestamp": 1793870100000,
  "identity": {
    "client_user_id": "example_player",
    "click_id": "EXAMPLE_RS_CLICK_ID"
  },
  "context": {
    "ip_address": "203.0.113.10",
    "transaction_id": "example_crypto_deposit_001",
    "amount": 0.015,
    "currency": "BTC",
    "deposit_type": "onchain",
    "network": "Bitcoin"
  }
}
```

```bash [Postback v2 query]
curl --get "$MMP_ORIGIN/v2/pb/$CONNECTION_ID/events" \
  --data-urlencode "k=$POSTBACK_KEY" \
  --data-urlencode 'dryrun=1' \
  --data-urlencode 'event_id=example-deposit-001' \
  --data-urlencode 'event=deposit' \
  --data-urlencode 'timestamp=1793870100000' \
  --data-urlencode 'identity.client_user_id=example_player' \
  --data-urlencode 'identity.click_id=EXAMPLE_RS_CLICK_ID' \
  --data-urlencode 'context.ip_address=203.0.113.10' \
  --data-urlencode 'context.transaction_id=example_crypto_deposit_001' \
  --data-urlencode 'context.amount=0.015' \
  --data-urlencode 'context.currency=BTC' \
  --data-urlencode 'context.deposit_type=onchain' \
  --data-urlencode 'context.network=Bitcoin'
```

:::
