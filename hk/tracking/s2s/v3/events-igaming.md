---
title: iGaming 事件 (v3)
sidebar_label: iGaming 事件
description: S2S 事件 v3 iGaming 目錄 — iGaming 垂直領域的資金、遊戲及獎金生命週期事件。
---

# iGaming 事件

**對象：** iGaming 產品的工程師、技術整合人員

iGaming 事件（`igaming` 預設集）涵蓋遊戲垂直領域：擴充的用戶生命週期、KYC 與帳戶狀態、資金、遊戲及獎金生命週期。

> [!IMPORTANT]
> iGaming 是一個**按訂閱啟用的行業預設集**。你的產品必須已訂閱（由 RevoSurge 團隊啟用）後，這些事件才會被接受 — 否則它們會被拒絕為 `422 EVENT_DISABLED`。請參閱[事件目錄與驗證](/hk/tracking/s2s/v3/catalog-governance)。

每個事件也會攜帶[基礎屬性](/hk/tracking/s2s/v3/mandatory-properties)（`event`、`timestamp`、`identity.client_user_id`、`context.ip_address`）。下方表格**只列出每個事件特定的欄位**。貨幣欄位（`amount`、`bet_result_amount`、…）會使用隨附的 `currency` 及 `is_crypto` 欄位進行換算。

<script setup>
import { s2sV3Events } from '../../../../.vitepress/theme/data/s2s-v3-events'
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

## 遊戲

### `bet`

一個單一的已結算投注事件 — 注額及其結果透過 `bet_result` / `bet_result_amount` 一起回報。

> [!NOTE]
> 對於 `bet`，`context.ip_address` 會**降級為建議**，因為投注通常從遊戲伺服器傳來，沒有終端用戶 IP。

| 欄位 | 類型 | 要求 | 說明 |
|-------|------|-------------|-------------|
| `context.transaction_id` | String | **必填** | 唯一投注／票券 ID（PK）。 |
| `context.game_type` | String | **必填** | `slot` · `live_casino` · `crash` · `sportsbook` 其中之一。 |
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

## 獎金生命週期

四個獎金事件必須共用一個一致的 `bonus_id`，並按順序觸發：`bonus_offered` → `bonus_claimed` → `bonus_completed` → `bonus_cashed_out`。

### `bonus_offered`

| 欄位 | 類型 | 要求 | 說明 |
|-------|------|-------------|-------------|
| `context.bonus_id` | String | **必填** | 唯一獎金實例 ID（PK；在整個生命週期內保持一致）。 |
| `context.bonus_type` | String | **必填** | `welcome` · `reload` · `cashback` · `freespin` · `promo_code` · `tournament` · `other` 其中之一。 |
| `context.bonus_value_max` | Number | **必填** | 最大可授予金額。 |
| `context.currency` | String | **必填** | 貨幣。 |
| `context.wagering_multiplier` | Number | **必填** | 投注倍數（30 = 30x；0 = 無）。 |
| `context.valid_until` | Number | **必填** | UTC 毫秒，優惠到期時間。 |
| `context.delivery_channel` | String | **必填** | `auto_grant` · `email` · `in_app` · `push` · `promo_code` · `sms` 其中之一。 |
| `context.is_crypto` | Boolean | 建議 | 加密貨幣為 `true`。 |

### `bonus_claimed`

對於 `auto_grant`，在 `bonus_offered` 後立即觸發。

| 欄位 | 類型 | 要求 | 說明 |
|-------|------|-------------|-------------|
| `context.bonus_id` | String | **必填** | 匹配 `bonus_offered`（FK）。 |
| `context.bonus_value_granted` | Number | **必填** | 實際授予的金額（≤ `bonus_value_max`）。 |
| `context.currency` | String | **必填** | 必須與所提供的相符。 |
| `context.wagering_requirement` | Number | **必填** | = `bonus_value_granted` × `wagering_multiplier`。 |
| `context.is_crypto` | Boolean | 建議 | 加密貨幣為 `true`。 |

### `bonus_completed`

| 欄位 | 類型 | 要求 | 說明 |
|-------|------|-------------|-------------|
| `context.bonus_id` | String | **必填** | FK。 |
| `context.total_wagered` | Number | **必填** | 完成時的最終投注額。 |
| `context.wagering_requirement` | Number | **必填** | 與領取時相同。 |
| `context.currency` | String | **必填** | 必須與領取時相符。 |
| `context.time_to_complete_minutes` | Number | **必填** | 從 `bonus_claimed` 起的分鐘數。 |
| `context.is_crypto` | Boolean | 建議 | 加密貨幣為 `true`。 |

### `bonus_cashed_out`

每個 `bonus_id` 可能觸發多次；DataPulse 會將其加總。

| 欄位 | 類型 | 要求 | 說明 |
|-------|------|-------------|-------------|
| `context.bonus_id` | String | **必填** | FK。 |
| `context.cashout_amount` | Number | **必填** | 轉移到真錢錢包的金額。 |
| `context.original_bonus_value` | Number | **必填** | 領取時的 `bonus_value_granted`。 |
| `context.currency` | String | **必填** | 必須與領取時相符。 |
| `context.time_to_cashout_minutes` | Number | **必填** | 從 `bonus_claimed` 起的分鐘數。 |
| `context.is_crypto` | Boolean | 建議 | 加密貨幣為 `true`。 |
