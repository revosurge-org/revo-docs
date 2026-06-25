---
title: iGaming events (v3)
sidebar_label: iGaming events
description: The S2S Events v3 iGaming catalog — financial, gaming, and bonus-lifecycle events for the iGaming vertical.
---

# iGaming events

**Audience:** Engineers, technical integrators for iGaming products

iGaming events (the `igaming` preset) cover the gaming vertical: extended user lifecycle, KYC & account status, financial, gaming, and bonus lifecycle.

> [!IMPORTANT]
> iGaming is an **industry preset enabled by subscription**. Your product must be subscribed (the RevoSurge team enables it) before these events are accepted — otherwise they are rejected as `422 EVENT_DISABLED`. See [Event catalog & validation](/en/tracking/s2s/v3/catalog-governance).

Every event also carries the [base properties](/en/tracking/s2s/v3/mandatory-properties) (`event`, `timestamp`, `identity.client_user_id`, `context.ip_address`). The tables below list **only the fields specific to each event**. Monetary fields (`amount`, `bet_result_amount`, …) are converted using the accompanying `currency` and `is_crypto` fields.

<script setup>
import { s2sV3Events } from '../../../../.vitepress/theme/data/s2s-v3-events'
</script>

## Interactive explorer

Pick an event to see its fields and a ready-to-send envelope. Toggle "Required only", then copy as JSON or cURL.

<EventPayloadExplorer :events="s2sV3Events" scope="igaming" lang="en" />

## User Lifecycle

### `session_ended`

Session length is a strong player-level churn predictor.

| Field | Type | Requirement | Description |
|-------|------|-------------|-------------|
| `context.session_id` | String | **Required** | Unique session ID. |
| `context.session_start_at` | Number | **Required** | Session start, UTC ms. |
| `context.duration_minutes` | Number | **Required** | Total session length (minutes). |

### `vip_tier_changed`

A downgrade is a strong churn signal. For an initial tier, use `direction: upgrade`.

| Field | Type | Requirement | Description |
|-------|------|-------------|-------------|
| `context.new_tier` | String | **Required** | Current tier (e.g. `gold`, `vip_1`). |
| `context.direction` | String | **Required** | One of `upgrade` · `downgrade` · `lateral`. |
| `context.trigger` | String | Suggested | One of `lifetime_deposits` · `monthly_wagering` · `loyalty_points` · `manual_admin` · `tier_review` · `other`. |

## Verification & Consent

### `kyc_completed`

Fire once per level for multi-level KYC.

| Field | Type | Requirement | Description |
|-------|------|-------------|-------------|
| `context.kyc_level` | String | **Required** | One of `basic` · `enhanced` · `full`. |
| `context.jurisdiction` | String | **Required** | ISO 3166-1 country code (e.g. `BR`, `IN`, `PH`). |
| `context.verification_method` | String | **Required** | One of `id_document` · `video` · `sms_otp` · `address_proof` · `bank_verification`. |
| `context.time_to_complete_minutes` | Number | Suggested | Minutes from `register` to this event. |

### `kyc_rejected`

Counterpart to `kyc_completed`; for KYC funnel / rejection-rate diagnostics.

| Field | Type | Requirement | Description |
|-------|------|-------------|-------------|
| `context.kyc_level` | String | **Required** | One of `basic` · `enhanced` · `full`. |
| `context.jurisdiction` | String | **Required** | ISO 3166-1 country code. |
| `context.rejection_reason` | String | **Required** | One of `document_invalid` · `face_mismatch` · `sanctions_hit` · `underage` · `duplicate` · `other`. |
| `context.verification_method` | String | Suggested | Verification method attempted. |

### `account_blocked`

Exclude blocked accounts from LTV / churn models.

| Field | Type | Requirement | Description |
|-------|------|-------------|-------------|
| `context.block_reason` | String | **Required** | One of `fraud` · `bonus_abuse` · `multi_account` · `self_exclusion` · `compliance` · `payment_chargeback` · `other`. |
| `context.block_duration` | String | Suggested | One of `permanent` · `temporary` · `under_review`. |
| `context.expected_unblock_at` | Number | Suggested | UTC ms; for temporary blocks. |

### `account_unblocked`

| Field | Type | Requirement | Description |
|-------|------|-------------|-------------|
| `context.unblock_reason` | String | **Required** | One of `review_passed` · `appeal_approved` · `temporary_expired` · `manual_admin` · `other`. |
| `context.previous_block_reason` | String | Suggested | Reason of the block being lifted. |

## Financial

### `deposit`

| Field | Type | Requirement | Description |
|-------|------|-------------|-------------|
| `context.transaction_id` | String | **Required** | Unique transaction ID (PK). |
| `context.amount` | Number | **Required** | Deposit amount (monetary). |
| `context.currency` | String | **Required** | ISO 4217 (fiat) or crypto symbol. |
| `context.is_crypto` | Boolean | Suggested | `true` for crypto. |
| `context.payment_method` | String | Suggested | e.g. `card_visa` · `usdt_trc20` · `pix`. |

### `deposit_failed`

Total deposit attempts = `deposit` + `deposit_failed`.

| Field | Type | Requirement | Description |
|-------|------|-------------|-------------|
| `context.transaction_id` | String | **Required** | Attempt ID (PK, for dedup). |
| `context.attempted_amount` | Number | **Required** | Attempted deposit amount (monetary). |
| `context.currency` | String | **Required** | ISO 4217 or crypto symbol. |
| `context.payment_method` | String | **Required** | Payment method attempted. |
| `context.failure_reason` | String | **Required** | One of `insufficient_funds` · `declined_by_issuer` · `network_error` · `fraud_blocked` · `amount_limit` · `unknown`. |
| `context.is_crypto` | Boolean | Suggested | `true` for crypto attempt. |

### `withdraw`

| Field | Type | Requirement | Description |
|-------|------|-------------|-------------|
| `context.transaction_id` | String | **Required** | Unique transaction ID (PK). |
| `context.amount` | Number | **Required** | Withdrawal amount (monetary). |
| `context.currency` | String | **Required** | ISO 4217 or crypto symbol. |
| `context.is_crypto` | Boolean | Suggested | `true` for crypto. |

## Gaming

### `bet`

A single settled-bet event — the stake and its outcome are reported together via `bet_result` / `bet_result_amount`.

> [!NOTE]
> For `bet`, `context.ip_address` is **downgraded to Suggested**, since bets often arrive from a game server without the end-user IP.

| Field | Type | Requirement | Description |
|-------|------|-------------|-------------|
| `context.transaction_id` | String | **Required** | Unique bet / ticket ID (PK). |
| `context.game_type` | String | **Required** | One of `slot` · `live_casino` · `crash` · `sportsbook`. |
| `context.game_provider` | String | **Required** | e.g. `Pragmatic Play`, `Evolution Gaming`. |
| `context.game_name` | String | Suggested | Specific game title (e.g. `Sweet Bonanza`). |
| `context.amount` | Number | **Required** | Total stake (monetary). |
| `context.currency` | String | **Required** | ISO 4217 or crypto symbol. |
| `context.cash_bet_amount` | Number | Suggested | Cash portion of stake (for NGR / bonus-abuse). |
| `context.bonus_bet_amount` | Number | Suggested | Bonus portion of stake. |
| `context.bet_result` | String | **Required** | One of `win` · `loss`. |
| `context.bet_result_amount` | Number | **Required** | Net outcome — positive = win, negative = loss (monetary). |
| `context.ticket_type` | String | Suggested | Sportsbook: `single` · `multi` · `system`. |
| `context.is_live` | Boolean | Suggested | Sportsbook in-play bet. |
| `context.is_free` | Boolean | Suggested | Free-bet token (excluded from LTV). |
| `context.is_crypto` | Boolean | Suggested | `true` for crypto. |

## Bonus Lifecycle

The four bonus events must share one consistent `bonus_id`, fired in order: `bonus_offered` → `bonus_claimed` → `bonus_completed` → `bonus_cashed_out`.

### `bonus_offered`

| Field | Type | Requirement | Description |
|-------|------|-------------|-------------|
| `context.bonus_id` | String | **Required** | Unique bonus instance ID (PK; consistent across lifecycle). |
| `context.bonus_type` | String | **Required** | One of `welcome` · `reload` · `cashback` · `freespin` · `promo_code` · `tournament` · `other`. |
| `context.bonus_value_max` | Number | **Required** | Max grantable amount. |
| `context.currency` | String | **Required** | Currency. |
| `context.wagering_multiplier` | Number | **Required** | Wagering multiplier (30 = 30x; 0 = none). |
| `context.valid_until` | Number | **Required** | UTC ms, offer expiry. |
| `context.delivery_channel` | String | **Required** | One of `auto_grant` · `email` · `in_app` · `push` · `promo_code` · `sms`. |
| `context.is_crypto` | Boolean | Suggested | `true` for crypto. |

### `bonus_claimed`

For `auto_grant`, fire immediately after `bonus_offered`.

| Field | Type | Requirement | Description |
|-------|------|-------------|-------------|
| `context.bonus_id` | String | **Required** | Matches `bonus_offered` (FK). |
| `context.bonus_value_granted` | Number | **Required** | Actual amount granted (≤ `bonus_value_max`). |
| `context.currency` | String | **Required** | Must match offered. |
| `context.wagering_requirement` | Number | **Required** | = `bonus_value_granted` × `wagering_multiplier`. |
| `context.is_crypto` | Boolean | Suggested | `true` for crypto. |

### `bonus_completed`

| Field | Type | Requirement | Description |
|-------|------|-------------|-------------|
| `context.bonus_id` | String | **Required** | FK. |
| `context.total_wagered` | Number | **Required** | Final wagered at completion. |
| `context.wagering_requirement` | Number | **Required** | Same as claimed. |
| `context.currency` | String | **Required** | Must match claimed. |
| `context.time_to_complete_minutes` | Number | **Required** | Minutes from `bonus_claimed`. |
| `context.is_crypto` | Boolean | Suggested | `true` for crypto. |

### `bonus_cashed_out`

May fire multiple times per `bonus_id`; DataPulse sums them.

| Field | Type | Requirement | Description |
|-------|------|-------------|-------------|
| `context.bonus_id` | String | **Required** | FK. |
| `context.cashout_amount` | Number | **Required** | Amount moved to real-money wallet. |
| `context.original_bonus_value` | Number | **Required** | `bonus_value_granted` from claim. |
| `context.currency` | String | **Required** | Must match claimed. |
| `context.time_to_cashout_minutes` | Number | **Required** | Minutes from `bonus_claimed`. |
| `context.is_crypto` | Boolean | Suggested | `true` for crypto. |
