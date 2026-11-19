---
title: iGaming 事件 (v3)
sidebar_label: iGaming 事件
description: S2S v3 與 Partner Postback v2 共用的事件定義、欄位表和編碼範例。
---

# iGaming 事件

**對象：** iGaming 產品的工程師、技術整合人員

iGaming 事件（`igaming` 預設集）涵蓋遊戲垂直領域：擴充的用戶生命週期、KYC 與帳戶狀態、資金、遊戲及獎金生命週期。

> [!IMPORTANT]
> iGaming 預設集由產品的市場類別啟用。請參閱[事件目錄與驗證](./catalog-validation)。

詳見[通用欄位與身份](/hk/tracking/events/common-fields)。以下表格列出各事件特有的欄位。

<script setup>
import { s2sV3Events } from '../../../.vitepress/theme/data/s2s-v3-events'
</script>

## 互動式瀏覽器

選擇一個事件以查看其欄位及一個可直接傳送的信封。切換「僅必填」，然後複製為 JSON 或 cURL。

<EventPayloadExplorer :events="s2sV3Events" scope="igaming" lang="hk" />

## 用戶生命週期

### `session_ended`

工作階段時長是一個強烈的玩家層級流失預測指標。

| 欄位 | 類型 | 要求 | 說明 |
|-------|------|-------------|-------------|
| `context.session_id` | String | **必填** | 唯一工作階段 ID。 |
| `context.session_start_at` | Number | **必填** | 工作階段開始時間，UTC 毫秒。 |
| `context.duration_minutes` | Number | **必填** | 工作階段總時長（分鐘）。 |
| `context.total_wagered` | Number | 建議 | 工作階段內總投注額。 |
| `context.total_won` | Number | 建議 | 工作階段內總贏額。 |
| `context.bet_count` | Number | 建議 | 工作階段內投注次數。 |
| `context.currency` | String | 建議 | 若上報 `total_wagered` / `total_won` 則必填。 |
| `context.is_crypto` | Boolean | 建議 | 加密貨幣計價為 `true`。 |
| `context.end_reason` | String | 建議 | `user_logout` · `timeout` · `forced_logout` · `unknown` 其中之一。 |

### `vip_tier_changed`

降級是一個強烈的流失訊號。對於初始等級，使用 `direction: upgrade`。

| 欄位 | 類型 | 要求 | 說明 |
|-------|------|-------------|-------------|
| `context.new_tier` | String | **必填** | 當前等級（例如 `gold`、`vip_1`）。 |
| `context.previous_tier` | String | 建議 | 本次變更前的等級。 |
| `context.direction` | String | **必填** | `upgrade` · `downgrade` · `lateral` 其中之一。 |
| `context.trigger` | String | 建議 | `lifetime_deposits` · `monthly_wagering` · `loyalty_points` · `manual_admin` · `tier_review` · `other` 其中之一。 |

## 驗證與授權

### `kyc_completed`

對於多級 KYC，每級觸發一次。

| 欄位 | 類型 | 要求 | 說明 |
|-------|------|-------------|-------------|
| `context.kyc_level` | String | **必填** | `basic` · `enhanced` · `full` 其中之一。 |
| `context.jurisdiction` | String | **必填** | ISO 3166-1 國家代碼（例如 `BR`、`IN`、`PH`）。 |
| `context.verification_method` | String | **必填** | `id_document` · `video` · `sms_otp` · `address_proof` · `bank_verification` 其中之一。 |
| `context.time_to_complete_minutes` | Number | 建議 | 從 `register` 到此事件的分鐘數。 |

### `kyc_rejected`

`kyc_completed` 的對應事件；用於 KYC 漏斗／拒絕率診斷。

| 欄位 | 類型 | 要求 | 說明 |
|-------|------|-------------|-------------|
| `context.kyc_level` | String | **必填** | `basic` · `enhanced` · `full` 其中之一。 |
| `context.jurisdiction` | String | **必填** | ISO 3166-1 國家代碼。 |
| `context.rejection_reason` | String | **必填** | `document_invalid` · `face_mismatch` · `sanctions_hit` · `underage` · `duplicate` · `document_unreadable` · `document_expired` · `name_mismatch` · `age_restriction` · `suspected_fraud` · `other` 其中之一。 |
| `context.verification_method` | String | 建議 | 嘗試的驗證方法。 |
| `context.time_to_reject_minutes` | Number | 建議 | 從 `register` 到此事件的分鐘數。 |

### `account_blocked`

將被封鎖的帳戶從 LTV / 流失模型中排除。

| 欄位 | 類型 | 要求 | 說明 |
|-------|------|-------------|-------------|
| `context.block_reason` | String | **必填** | `fraud` · `bonus_abuse` · `multi_account` · `self_exclusion` · `compliance` · `payment_chargeback` · `other` 其中之一。 |
| `context.block_duration` | String | 建議 | `permanent` · `temporary` · `under_review` 其中之一。 |
| `context.expected_unblock_at` | Number | 建議 | UTC 毫秒；用於臨時封鎖。 |

### `account_unblocked`

| 欄位 | 類型 | 要求 | 說明 |
|-------|------|-------------|-------------|
| `context.unblock_reason` | String | **必填** | 建議用 `review_passed` · `appeal_approved` · `cooldown_ended` · `manual_admin` · `other`。（`temporary_expired` 仍接受但已棄用。） |
| `context.previous_block_reason` | String | 建議 | 被解除的封鎖原因。 |

## 資金

### `deposit_initiated`

| 欄位 | 類型 | 要求 | 說明 |
|-------|------|-------------|-------------|
| `context.transaction_id` | String | **必填** | 支付訂單 ID（PK；須與後續 `deposit` / `deposit_failed` 一致）。 |
| `context.amount` | Number | **必填** | 申請充值的金額（貨幣）。 |
| `context.currency` | String | **必填** | ISO 4217（法定貨幣）或加密貨幣代號。 |
| `context.is_crypto` | Boolean | 建議 | 加密貨幣為 `true`。 |
| `context.payment_method` | String | 建議 | 用戶所選支付渠道，例如 `card_visa` · `usdt_trc20` · `pix`。 |

### `deposit`

| 欄位 | 類型 | 要求 | 說明 |
|-------|------|-------------|-------------|
| `context.transaction_id` | String | **必填** | 唯一交易 ID（PK）。 |
| `context.amount` | Number | **必填** | 充值金額（貨幣）。 |
| `context.currency` | String | **必填** | ISO 4217（法定貨幣）或加密貨幣代號。 |
| `context.is_crypto` | Boolean | 建議 | 加密貨幣為 `true`。 |
| `context.payment_method` | String | 建議 | 例如 `card_visa` · `usdt_trc20` · `pix`。 |

### `deposit_failed`

充值總嘗試次數 = `deposit` + `deposit_failed`。

| 欄位 | 類型 | 要求 | 說明 |
|-------|------|-------------|-------------|
| `context.transaction_id` | String | **必填** | 嘗試 ID（PK，用於去重）。 |
| `context.attempted_amount` | Number | **必填** | 嘗試的充值金額（貨幣）。 |
| `context.currency` | String | **必填** | ISO 4217 或加密貨幣代號。 |
| `context.payment_method` | String | **必填** | 嘗試的支付方式。 |
| `context.failure_reason` | String | **必填** | `insufficient_funds` · `declined_by_issuer` · `network_error` · `fraud_blocked` · `amount_limit` · `unknown` 其中之一。 |
| `context.is_crypto` | Boolean | 建議 | 加密貨幣嘗試為 `true`。 |

### `withdraw`

| 欄位 | 類型 | 要求 | 說明 |
|-------|------|-------------|-------------|
| `context.transaction_id` | String | **必填** | 唯一交易 ID（PK）。 |
| `context.amount` | Number | **必填** | 提現金額（貨幣）。 |
| `context.currency` | String | **必填** | ISO 4217 或加密貨幣代號。 |
| `context.is_crypto` | Boolean | 建議 | 加密貨幣為 `true`。 |

### `withdraw_rejected`

提款申請正式遭拒絕時傳送。仍在審核的申請無需傳送。使用該帳戶其他事件的 `identity.client_user_id`，並提供原始申請的終端用戶 `context.ip_address`。

| 欄位 | 類型 | 要求 | 說明 |
| --- | --- | --- | --- |
| `context.currency` | String | **必填** | ISO 4217 法幣代碼，適用於此事件的所有金額。 |
| `context.transaction_id` | String | **必填** | 遭拒絕的原始提款申請 ID。重試時保持一致，新申請使用新的 ID。 |
| `context.amount` | Number | **必填** | 遭拒絕的提款申請金額。 |
| `context.withdrawal_method` | String | **必填** | `card`、`bank_transfer`、`ewallet`、`crypto`、`voucher`、`other`。 |
| `context.rejection_reason` | String | **必填** | `bonus_terms_violation`、`wagering_not_met`、`multi_account`、`suspected_fraud`、`kyc_required`、`payment_risk`、`aml_flag`、`manual_review`、`other`。僅在已拒絕但原因尚未分類時使用 `manual_review`。 |
| `context.rejection_source` | String | 選填 | `risk_engine`、`operations`、`payment_provider`、`other`。 |

## 遊戲

### `bet`

一個單一的已結算投注事件 — 注額及其結果透過 `bet_result` / `bet_result_amount` 一起回報。

> [!NOTE]
> 對於 `bet`，`context.ip_address` 會**降級為建議**，因為投注通常從遊戲伺服器傳來，沒有終端用戶 IP。

| 欄位 | 類型 | 要求 | 說明 |
|-------|------|-------------|-------------|
| `context.transaction_id` | String | **必填** | 唯一投注／票券 ID（PK）。 |
| `context.game_type` | String | **必填** | 規範遊戲類型 — 見下方取值。 |
| `context.game_provider` | String | **必填** | 例如 `Pragmatic Play`、`Evolution Gaming`。 |
| `context.game_name` | String | 建議 | 特定遊戲名稱（例如 `Sweet Bonanza`）。 |
| `context.amount` | Number | **必填** | 總注額（貨幣）。 |
| `context.currency` | String | **必填** | ISO 4217 或加密貨幣代號。 |
| `context.cash_bet_amount` | Number | 建議 | 注額中的現金部分（用於 NGR / 獎金濫用）。 |
| `context.bonus_bet_amount` | Number | 建議 | 注額中的獎金部分。 |
| `context.bet_result` | String | **必填** | `win` · `loss` 其中之一。 |
| `context.bet_result_amount` | Number | **必填** | 淨結果 — 正數 = 贏，負數 = 輸（貨幣）。 |
| `context.ticket_type` | String | 建議 | Sportsbook：`single` · `multi` · `system`。 |
| `context.is_live` | Boolean | 建議 | Sportsbook 滾球投注。 |
| `context.is_free` | Boolean | 建議 | 免費投注 token（從 LTV 中排除）。 |
| `context.is_crypto` | Boolean | 建議 | 加密貨幣為 `true`。 |

#### `game_type` 規範值 {#game-type-values}

`context.game_type`（String，**必填**）會正規化為下表中的**規範類型**。可以發送規範鍵本身，也可以發送它對應的任意別名，兩者都會正規化為同一個規範類型。

| `game_type` | 可接受的別名（Aliases） |
|-------------|------------------|
| `slot` | `slot`（老虎機）· `pachinko`（彈珠機） |
| `live_casino` | `live`（真人）· `gameshow`（真人遊戲秀） |
| `sportsbook` | `sport`（體育）· `cockfight`（鬥雞） |
| `fishing` | `fish`（捕魚）· `arcade`（街機） |
| `table_games` | `baccarat`（百家樂）· `blackjack`（二十一點）· `roulette`（輪盤）· `dice`（骰寶）· `card`（紙牌）· `table`（桌檯） |
| `poker` | `poker`（德州撲克） |
| `lottery` | `lottery`（彩票）· `bingo`（賓果）· `instant`（即開彩／刮刮樂） |
| `esports` | `esport`（電競） |
| `crash` | `crash` · `aviator`（崩盤／墜機遊戲） |

`game_type` 為受校驗的欄位——只能發送規範鍵或其所列別名，未登記的值會被拒收。

## 獎金生命週期

<a id="bonus-offered"></a>
<a id="bonus-completed"></a>
<a id="bonus-cashed-out"></a>

使用 `bonus_claimed` 上報實際入賬獎金。原有的 `bonus_offered`、`bonus_completed` 和 `bonus_cashed_out` 已停用。

### `bonus_claimed`

單筆獎金實際入帳時傳送，包括自動發放。使用單筆獎金的 ID，無需先傳送獎金優惠事件。

| 欄位 | 類型 | 要求 | 說明 |
| --- | --- | --- | --- |
| `context.currency` | String | **必填** | ISO 4217 法幣代碼，適用於此事件的所有金額。 |
| `context.bonus_id` | String | **必填** | 實際入帳的單筆獎金 ID。 |
| `context.bonus_type` | String | **必填** | `welcome`、`deposit_match`、`no_deposit`、`free_spins`、`cashback`、`reload`、`referral`、`vip`、`other`。 |
| `context.bonus_value_granted` | Number | **必填** | 實際入帳價值。免費旋轉使用來源系統定義的入帳估值。 |
| `context.wagering_requirement` | Number | 適用時必填 | 條款引擎計算的有效流水目標。只有確認無要求時才填 `0`。 |
| `context.wagering_multiplier` | Number | 選填 | 條款中的流水倍數。流水計算基數由實際條款決定。 |
| `context.bonus_expiry_time` | String | 適用時必填 | UTC ISO 8601 到期時間。 |
| `context.claim_channel` | String | 選填 | `in_app`、`email`、`push`、`sms`、`promo_code`、`affiliate`、`auto_grant`。 |
| `context.deposit_transaction_id` | String | 適用時必填 | 觸發獎金的成功充值 ID。 |
| `context.deposit_amount` | Number | 選填 | 觸發這筆獎金的成功充值金額，使用事件幣別。 |

## 編碼範例 {#encoding-examples}

以下範例使用合成值。正式填報時使用實際發生時間、身份和業務值。Postback 範例使用 dry run，請使用確認的 origin、Connection ID 和密鑰。

### bonus_claimed 編碼範例 {#bonus-claimed-encoding-example}

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

```bash [Postback v2 查詢參數]
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

### withdraw_rejected 編碼範例 {#withdraw-rejected-encoding-example}

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

```bash [Postback v2 查詢參數]
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
