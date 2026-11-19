---
title: "iGaming events"
description: "iGaming financial, gaming and bonus events with field definitions and S2S and Postback examples."
---

# iGaming events


**Audience:** Engineers, technical integrators for iGaming products

iGaming events (the `igaming` preset) cover the gaming vertical: extended user lifecycle, KYC & account status, financial, gaming, and bonus lifecycle.

> Note:
> iGaming is an **industry preset enabled by your Product’s market category**. Set the Product’s market category to iGaming to enable the corresponding industry events. See [Event catalog & validation](/en/tracking/events/catalog-validation).

S2S v3 and Partner Postback v2 share these event definitions. Every event also carries the [base properties](/en/tracking/events/common-fields) (event name, occurrence time, usable identity and applicable end-user IP). The tables below list **only the fields specific to each event**. Monetary fields on existing events use the accompanying `currency` and `is_crypto` fields.

<script setup>
import { s2sV3Events } from '../../../.vitepress/theme/data/s2s-v3-events'
</script>

## Interactive explorer

Pick an event to preview its fields and copy an S2S JSON or cURL example.

<EventPayloadExplorer :events="s2sV3Events" scope="igaming" lang="en" />

## User Lifecycle

### `session_ended`

Session length is a strong player-level churn predictor.

| Field | Type | Requirement | Description |
|-------|------|-------------|-------------|
| `context.session_id` | String | **Required** | Unique session ID. |
| `context.session_start_at` | Number | **Required** | Session start, UTC ms. |
| `context.duration_minutes` | Number | **Required** | Total session length (minutes). |
| `context.total_wagered` | Number | Suggested | Total wagered in session. |
| `context.total_won` | Number | Suggested | Total won in session. |
| `context.bet_count` | Number | Suggested | Number of bets in session. |
| `context.currency` | String | Suggested | Required if `total_wagered` / `total_won` is sent. |
| `context.is_crypto` | Boolean | Suggested | `true` if crypto-denominated. |
| `context.end_reason` | String | Suggested | One of `user_logout` · `timeout` · `forced_logout` · `unknown`. |

### `vip_tier_changed`

A downgrade is a strong churn signal. For an initial tier, use `direction: upgrade`.

| Field | Type | Requirement | Description |
|-------|------|-------------|-------------|
| `context.new_tier` | String | **Required** | Current tier (e.g. `gold`, `vip_1`). |
| `context.previous_tier` | String | Suggested | Tier before this change. |
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
| `context.rejection_reason` | String | **Required** | One of `document_invalid` · `face_mismatch` · `sanctions_hit` · `underage` · `duplicate` · `document_unreadable` · `document_expired` · `name_mismatch` · `age_restriction` · `suspected_fraud` · `other`. |
| `context.verification_method` | String | Suggested | Verification method attempted. |
| `context.time_to_reject_minutes` | Number | Suggested | Minutes from `register` to this event. |

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
| `context.unblock_reason` | String | **Required** | Prefer `review_passed` · `appeal_approved` · `cooldown_ended` · `manual_admin` · `other`. (`temporary_expired` still accepted but deprecated.) |
| `context.previous_block_reason` | String | Suggested | Reason of the block being lifted. |

## Financial

### `deposit_initiated`

| Field | Type | Requirement | Description |
|-------|------|-------------|-------------|
| `context.transaction_id` | String | **Required** | Payment order ID (PK; must match the later `deposit` / `deposit_failed`). |
| `context.amount` | Number | **Required** | Requested deposit amount (monetary). |
| `context.currency` | String | **Required** | ISO 4217 (fiat) or crypto symbol. |
| `context.is_crypto` | Boolean | Suggested | `true` for crypto. |
| `context.payment_method` | String | Suggested | Payment channel picked by the user, e.g. `card_visa` · `usdt_trc20` · `pix`. |

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

### `withdraw_rejected`

A withdrawal request is formally rejected. Do not send this event while the request is still pending review.

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `context.currency` | String | **Required** | ISO 4217 fiat currency for all monetary values in this event. |
| `context.transaction_id` | String | **Required** | Unique ID of the rejected withdrawal request in your system. Keep the same ID when retrying this event; use a new ID for a new withdrawal request. No preceding withdrawal event is required. |
| `context.amount` | Number | **Required** | Rejected request amount, valued in `currency` |
| `context.withdrawal_method` | String | **Required** | `card`, `bank_transfer`, `ewallet`, `crypto`, `voucher`, `other` |
| `context.rejection_reason` | String | **Required** | `bonus_terms_violation`, `wagering_not_met`, `multi_account`, `suspected_fraud`, `kyc_required`, `payment_risk`, `aml_flag`, `manual_review`, `other`. Retain compatible values, but use manual_review only for an already rejected request whose reason is not yet classified; pending review must not emit this event |
| `context.rejection_source` | String | **Optional** | `risk_engine`, `operations`, `payment_provider`, `other`; the source does not establish confirmed abuse |

Use the same stable `identity.client_user_id` as your other account events. For `context.ip_address`, send the original withdrawal-request IP rather than the backend server IP. Resolve missing source data before integration; do not fabricate it.

## Gaming

### `bet`

A single settled-bet event — the stake and its outcome are reported together via `bet_result` / `bet_result_amount`.

> Note:
> For `bet`, `context.ip_address` is **downgraded to Suggested**, since bets often arrive from a game server without the end-user IP.

| Field | Type | Requirement | Description |
|-------|------|-------------|-------------|
| `context.transaction_id` | String | **Required** | Unique bet / ticket ID (PK). |
| `context.game_type` | String | **Required** | Canonical game type — see values below. |
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

#### `game_type` values

`context.game_type` (String, **Required**) resolves to one of the **canonical types** below. Send either the canonical key or any of its aliases — both are accepted and normalize to the same canonical type.

| `game_type` | Accepted aliases |
|-------------|------------------|
| `slot` | `slot` · `pachinko` |
| `live_casino` | `live` · `gameshow` |
| `sportsbook` | `sport` · `cockfight` |
| `fishing` | `fish` · `arcade` |
| `table_games` | `baccarat` · `blackjack` · `roulette` · `dice` · `card` · `table` |
| `poker` | `poker` |
| `lottery` | `lottery` · `bingo` · `instant` |
| `esports` | `esport` |
| `crash` | `crash` · `aviator` |

`game_type` is validated — send a canonical key or one of its listed aliases; unknown values are rejected.

<a id="bonus-lifecycle"></a>
<a id="bonus-offered"></a>
<a id="bonus-completed"></a>
<a id="bonus-cashed-out"></a>

## Bonus

Use `bonus_claimed` for a credited bonus. The former `bonus_offered`, `bonus_completed` and `bonus_cashed_out` events are retired.

### `bonus_claimed`

A single bonus is successfully credited.

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `context.currency` | String | **Required** | ISO 4217 fiat currency for all monetary values in this event. |
| `context.bonus_id` | String | **Required** | Individual credited bonus instance ID, not a campaign or template ID. |
| `context.bonus_type` | String | **Required** | `welcome`, `deposit_match`, `no_deposit`, `free_spins`, `cashback`, `reload`, `referral`, `vip`, `other` |
| `context.bonus_value_granted` | Number | **Required** | Value actually credited, not estimated potential winnings. For free spins, use the source's explicitly defined credited valuation; never encode an unknown value as 0 |
| `context.wagering_requirement` | Number | **Optional** | Required when wagering requirements apply; use the eligible-wagering target calculated by the terms engine. Use 0 only when no requirement is confirmed, never for unknown requirements. Do not universally assume bonus value multiplied by a multiplier |
| `context.wagering_multiplier` | Number | **Optional** | Describes the terms; the basis may be bonus-only, deposit plus bonus, or another amount. Not the sole source of truth |
| `context.bonus_expiry_time` | String | **Optional** | Required when an expiry applies; omit if there is none UTC ISO 8601 string; this is a context expiry value, not the envelope timestamp. |
| `context.claim_channel` | String | **Optional** | `in_app`, `email`, `push`, `sms`, `promo_code`, `affiliate`, `auto_grant` |
| `context.deposit_transaction_id` | String | **Optional** | Required when a specific successful deposit triggered the bonus; enables an exact deposit join |
| `context.deposit_amount` | Number | **Optional** | Successful deposit amount triggering this bonus, in the event currency; not the player's cumulative deposits |

Send this event when the bonus is actually credited, including an automatic grant. Use an individual bonus instance ID; no preceding bonus-offer event is required.


<a id="examples"></a>

## Encoding examples

Synthetic examples, not real advertiser data or a runtime validation result. Use actual occurrence times, identities and end-user IPs. Optional IDs are illustrative; do not fabricate missing values. Postback examples validate only (`dryrun=1`); use the confirmed origin and Connection credentials.

### bonus_claimed encoding example

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

```bash [Postback v2 query]
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

### withdraw_rejected encoding example

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

```bash [Postback v2 query]
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
