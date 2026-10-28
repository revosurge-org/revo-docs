---
title: Crypto 事件（v3）
sidebar_label: Crypto 事件
description: S2S Events v3 Crypto 目錄——面向加密貨幣交易所和錢包的資金、交易和獎勵事件。
---

# Crypto 事件

Crypto 事件（`crypto` 預設）適用於加密貨幣交易所和錢包，涵蓋擴展的用戶生命週期、KYC 與賬戶狀態、資金、交易和獎勵。

> [!IMPORTANT]
> Crypto 是**按訂閱啓用的行業預設**。你的產品必須先訂閱（由 RevoSurge 團隊啓用），才能接收這些事件；否則會返回 `422 EVENT_DISABLED`。參見[事件目錄與校驗](./catalog-governance)。

每個事件還攜帶[基礎屬性](./mandatory-properties)（`event`、`timestamp`、`identity.client_user_id`、`context.ip_address`）。以下表格**僅列出各事件特有的欄位**。

所有事件均使用**相同的 `identity.client_user_id`**。RevoSurge 通過此 ID 將用戶轉化關聯到帶來該用戶的廣告活動。

<script setup>
import { s2sV3Events } from '../../../../.vitepress/theme/data/s2s-v3-events'
</script>

## 交互式瀏覽器

選擇事件，查看欄位和可直接傳送的請求。切換「僅必填」，然後複製 JSON 或 cURL。

<EventPayloadExplorer :events="s2sV3Events" scope="crypto" lang="hk" />

## 用戶生命週期

### `vip_tier_changed`

降級是強烈的流失信號。首次設置等級時，使用 `direction: upgrade`。

| 欄位                   | 類型   | 要求  | 說明                                                                                                            |
| ----------------------- | ------ | ------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `context.new_tier`      | String | **必填** | 當前等級（如 `vip_1`、`gold`）                                                                                    |
| `context.previous_tier` | String | 建議    | 變更前的等級                                                                                                 |
| `context.direction`     | String | **必填** | `upgrade` · `downgrade` · `lateral`                                                                                    |
| `context.trigger`       | String | 建議    | `lifetime_deposits` · `trading_volume` · `asset_balance` · `loyalty_points` · `manual_admin` · `tier_review` · `other` |

## 驗證與授權

### `kyc_completed`

多級 KYC 每完成一個等級發送一次。

| 欄位 | 類型 | 要求 | 說明 |
| --- | --- | --- | --- |
| `context.kyc_level` | String | **必填** | `basic` · `enhanced` · `full` |
| `context.jurisdiction` | String | **必填** | ISO 3166-1 國家代碼 |
| `context.verification_method` | String | **必填** | `id_document` · `video` · `sms_otp` · `address_proof` · `bank_verification` |
| `context.time_to_complete_minutes` | Number | 建議 | 從 `register` 到此事件的分鐘數 |

### `kyc_rejected`

與 `kyc_completed` 對應，用於分析 KYC 漏斗和拒絕率。

| 欄位                            | 類型   | 要求  | 說明                                                                                                                                                                           |
| -------------------------------- | ------ | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `context.kyc_level`              | String | **必填** | `basic` · `enhanced` · `full`                                                                                                                                                         |
| `context.jurisdiction`           | String | **必填** | ISO 3166-1 國家代碼                                                                                                                                                               |
| `context.rejection_reason`       | String | **必填** | `document_invalid` · `face_mismatch` · `sanctions_hit` · `duplicate` · `document_unreadable` · `document_expired` · `name_mismatch` · `age_restriction` · `suspected_fraud` · `other` |
| `context.verification_method`    | String | 建議    | 嘗試的驗證方式                                                                                                                                                         |
| `context.time_to_reject_minutes` | Number | 建議    | 從 `register` 到此事件的分鐘數                                                                                                                                                 |

## 資金

僅上報跨越平台邊界的資金流動。用戶自己的錢包之間的划轉（例如現貨 → 合約）**不屬於** `deposit` 或 `withdraw`。金額使用實際轉移的資產計價（0.015 BTC 應傳 `"amount": 0.015, "currency": "BTC"`）；鏈上轉賬同時傳 `network`。

### `deposit`

資金到賬且可用時發送；鏈上充值需等待達到平台要求的確認數。

| 欄位                    | 類型   | 要求  | 說明                                                               |
| ------------------------ | ------ | ------------ | ------------------------------------------------------------------------- |
| `context.transaction_id` | String | **必填** | 唯一交易 ID（主鍵）                                                |
| `context.amount`         | Number | **必填** | 扣除手續費前的充值金額（貨幣欄位）                                     |
| `context.currency`       | String | **必填** | ISO 4217（法幣）或加密貨幣符號                                          |
| `context.deposit_type`   | String | 建議    | `onchain` · `fiat_bank` · `card` · `p2p` · `third_party_onramp` · `other` |
| `context.payment_method` | String | 建議    | 例如 `usdt_trc20` · `card_visa` · `pix`                                   |
| `context.network`        | String | 建議    | 區塊鏈網絡，例如 `TRC20`                                          |
| `context.fee_amount`     | Number | 建議    | 收取的充值手續費，以 `currency` 計價                                        |
| `context.tx_hash`        | String | 建議    | 鏈上交易哈希                                                 |

### `withdraw`

| 欄位                    | 類型   | 要求  | 說明                                        |
| ------------------------ | ------ | ------------ | -------------------------------------------------- |
| `context.transaction_id` | String | **必填** | 唯一交易 ID（主鍵）                         |
| `context.amount`         | Number | **必填** | 扣除手續費前的提現金額（貨幣欄位）           |
| `context.currency`       | String | **必填** | ISO 4217 或加密貨幣符號                          |
| `context.withdraw_type`  | String | 建議    | `onchain` · `fiat_bank` · `card` · `p2p` · `other` |
| `context.network`        | String | 建議    | 區塊鏈網絡，例如 `ERC20`                   |
| `context.fee_amount`     | Number | 建議    | 收取的提現手續費，以 `currency` 計價              |
| `context.tx_hash`        | String | 建議    | 鏈上交易哈希                          |

## 交易

用戶的首個 `trade` 即**首次交易（FTT）**，是首次充值後的主要價值事件。首筆訂單成交後應立即發送 `trade`，以準確記錄用戶開始交易的時間。

不要上報演示或模擬賬戶的交易，否則這些交易也會被計為首次交易。

### `trade`

每個已成交訂單發送一個事件：訂單全部成交，或部分成交後撤銷時發送。不要為每次部分成交分別發送事件。合約開倉和平倉屬於不同的已成交訂單，應各自發送 `trade`。

| 欄位                      | 類型   | 要求  | 說明                                                                                                  |
| -------------------------- | ------ | ------------ | ------------------------------------------------------------------------------------------------------------ |
| `context.transaction_id`   | String | **必填** | 唯一訂單 ID（主鍵）                                                                                         |
| `context.product_type`     | String | **必填** | `futures`（永續和交割合約）· `spot` · `convert` · `other`                                  |
| `context.amount`           | Number | **必填** | 已成交名義價值（貨幣欄位）。期貨：本次交易的成交數量 × 成交價格，而非保證金            |
| `context.currency`         | String | **必填** | `amount` 的幣種。USDT 或 USDC 本位：報價資產；幣本位（Coin-M）：該幣種本身       |
| `context.fee_amount`       | Number | **必填** | 向用戶收取的交易手續費，按抵扣券和手續費抵扣前計算（貨幣欄位）。零手續費交易傳 `0`；掛單返傭傳負值 |
| `context.fee_currency`     | String | **必填** | `fee_amount` 的幣種                                                                                     |

### 替代方案： `trade_daily_summary`

如果無法逐筆發送 `trade`，可在每天結束後（UTC），按用戶、日期和 `product_type` 各發送一個 `trade_daily_summary` 事件作為替代。

> **注意：** 推薦逐筆發送 `trade`。每日匯總只能按天記錄首次交易，且最多延遲一天到達，會減慢廣告活動優化。

| 欄位                     | 類型   | 要求  | 說明                                                                 |
| ------------------------- | ------ | ------------ | --------------------------------------------------------------------------- |
| `identity.client_user_id` | String | **必填** | 與 `register` 和 `deposit` 相同的用戶 ID                                 |
| `context.date`            | String | **必填** | 交易日期，UTC 時區，格式為 `YYYY-MM-DD`                                           |
| `context.product_type`    | String | **必填** | `futures` · `spot` · `convert` · `other`                                    |
| `context.amount_usd`      | Number | **必填** | 當天已成交名義價值總額，以 USD 計價                             |
| `context.fee_usd`         | Number | **必填** | 當天收取的交易手續費總額，以 USD 計價，按抵扣券和手續費抵扣前計算 |
| `context.trade_count`     | Number | **必填** | 當天已成交訂單數量                                            |

## 獎勵

### `reward_claimed`

結合 `deposit` 和 `trade`，識別領取獎勵但從未交易的用戶。使用 `reward_trigger` 表明獲得獎勵的行為，例如首次合約交易獲得的優惠券。

| 欄位                    | 類型   | 要求  | 說明                                                                                                                                                            |
| ------------------------ | ------ | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `context.reward_id`      | String | **必填** | 唯一獎勵實例 ID（主鍵）                                                                                                                                         |
| `context.reward_type`    | String | **必填** | `signup_bonus` · `deposit_bonus` · `trading_fee_voucher` · `futures_bonus` · `position_airdrop` · `airdrop` · `referral_reward` · `cashback` · `task_reward` · `other` |
| `context.reward_trigger` | String | **必填** | 獲得獎勵的行為： `register` · `kyc` · `first_deposit` · `first_trade` · `first_futures_trade` · `first_copy_trade` · `trading_volume` · `other`          |
| `context.value`          | Number | **必填** | 獎勵價值（貨幣欄位）                                                                                                                                                |
| `context.currency`       | String | **必填** | 幣種                                                                                                                                                               |
| `context.expires_at`     | Number | 建議    | 獎勵到期時間，UTC 毫秒                                                                                                                                                  |

