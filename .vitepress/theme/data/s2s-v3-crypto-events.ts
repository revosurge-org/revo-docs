// Crypto-specific fields from the approved crypto-events.md catalog (2026-10-06).
// Base envelope fields are added by s2s-v3-events.ts.
import type { EventDef } from './s2s-v3-events'

export const cryptoEvents: EventDef[] = [
  {
    "name": "vip_tier_changed",
    "scope": "crypto",
    "category": "user_lifecycle",
    "categoryLabel": {
      "en": "User Lifecycle",
      "cn": "用户生命周期",
      "hk": "用戶生命週期"
    },
    "fields": [
      {
        "path": "new_tier",
        "slot": "context",
        "type": "String",
        "req": "required",
        "value": "vip_1",
        "desc": {
          "en": "Current tier (e.g. `vip_1`, `gold`)",
          "cn": "当前等级（如 `vip_1`、`gold`）",
          "hk": "當前等級（如 `vip_1`、`gold`）"
        }
      },
      {
        "path": "previous_tier",
        "slot": "context",
        "type": "String",
        "req": "suggested",
        "value": "vip_0",
        "desc": {
          "en": "Tier before the change",
          "cn": "变更前的等级",
          "hk": "變更前的等級"
        }
      },
      {
        "path": "direction",
        "slot": "context",
        "type": "String",
        "req": "required",
        "value": "upgrade",
        "desc": {
          "en": "`upgrade` · `downgrade` · `lateral`",
          "cn": "`upgrade` · `downgrade` · `lateral`",
          "hk": "`upgrade` · `downgrade` · `lateral`"
        },
        "enumValues": [
          "upgrade",
          "downgrade",
          "lateral"
        ]
      },
      {
        "path": "trigger",
        "slot": "context",
        "type": "String",
        "req": "suggested",
        "value": "lifetime_deposits",
        "desc": {
          "en": "`lifetime_deposits` · `trading_volume` · `asset_balance` · `loyalty_points` · `manual_admin` · `tier_review` · `other`",
          "cn": "`lifetime_deposits` · `trading_volume` · `asset_balance` · `loyalty_points` · `manual_admin` · `tier_review` · `other`",
          "hk": "`lifetime_deposits` · `trading_volume` · `asset_balance` · `loyalty_points` · `manual_admin` · `tier_review` · `other`"
        },
        "enumValues": [
          "lifetime_deposits",
          "trading_volume",
          "asset_balance",
          "loyalty_points",
          "manual_admin",
          "tier_review",
          "other"
        ]
      }
    ]
  },
  {
    "name": "kyc_completed",
    "scope": "crypto",
    "category": "verification_consent",
    "categoryLabel": {
      "en": "Verification & Consent",
      "cn": "验证与授权",
      "hk": "驗證與授權"
    },
    "fields": [
      {
        "path": "kyc_level",
        "slot": "context",
        "type": "String",
        "req": "required",
        "value": "basic",
        "desc": {
          "en": "`basic` · `enhanced` · `full`",
          "cn": "`basic` · `enhanced` · `full`",
          "hk": "`basic` · `enhanced` · `full`"
        },
        "enumValues": [
          "basic",
          "enhanced",
          "full"
        ]
      },
      {
        "path": "jurisdiction",
        "slot": "context",
        "type": "String",
        "req": "required",
        "value": "BR",
        "desc": {
          "en": "ISO 3166-1 country code",
          "cn": "ISO 3166-1 国家代码",
          "hk": "ISO 3166-1 國家代碼"
        }
      },
      {
        "path": "verification_method",
        "slot": "context",
        "type": "String",
        "req": "required",
        "value": "id_document",
        "desc": {
          "en": "`id_document` · `video` · `sms_otp` · `address_proof` · `bank_verification`",
          "cn": "`id_document` · `video` · `sms_otp` · `address_proof` · `bank_verification`",
          "hk": "`id_document` · `video` · `sms_otp` · `address_proof` · `bank_verification`"
        },
        "enumValues": [
          "id_document",
          "video",
          "sms_otp",
          "address_proof",
          "bank_verification"
        ]
      },
      {
        "path": "time_to_complete_minutes",
        "slot": "context",
        "type": "Number",
        "req": "suggested",
        "value": 5,
        "desc": {
          "en": "Minutes from `register` to this event",
          "cn": "从 `register` 到此事件的分钟数",
          "hk": "從 `register` 到此事件的分鐘數"
        }
      }
    ]
  },
  {
    "name": "kyc_rejected",
    "scope": "crypto",
    "category": "verification_consent",
    "categoryLabel": {
      "en": "Verification & Consent",
      "cn": "验证与授权",
      "hk": "驗證與授權"
    },
    "fields": [
      {
        "path": "kyc_level",
        "slot": "context",
        "type": "String",
        "req": "required",
        "value": "basic",
        "desc": {
          "en": "`basic` · `enhanced` · `full`",
          "cn": "`basic` · `enhanced` · `full`",
          "hk": "`basic` · `enhanced` · `full`"
        },
        "enumValues": [
          "basic",
          "enhanced",
          "full"
        ]
      },
      {
        "path": "jurisdiction",
        "slot": "context",
        "type": "String",
        "req": "required",
        "value": "BR",
        "desc": {
          "en": "ISO 3166-1 country code",
          "cn": "ISO 3166-1 国家代码",
          "hk": "ISO 3166-1 國家代碼"
        }
      },
      {
        "path": "rejection_reason",
        "slot": "context",
        "type": "String",
        "req": "required",
        "value": "document_invalid",
        "desc": {
          "en": "`document_invalid` · `face_mismatch` · `sanctions_hit` · `duplicate` · `document_unreadable` · `document_expired` · `name_mismatch` · `age_restriction` · `suspected_fraud` · `other`",
          "cn": "`document_invalid` · `face_mismatch` · `sanctions_hit` · `duplicate` · `document_unreadable` · `document_expired` · `name_mismatch` · `age_restriction` · `suspected_fraud` · `other`",
          "hk": "`document_invalid` · `face_mismatch` · `sanctions_hit` · `duplicate` · `document_unreadable` · `document_expired` · `name_mismatch` · `age_restriction` · `suspected_fraud` · `other`"
        },
        "enumValues": [
          "document_invalid",
          "face_mismatch",
          "sanctions_hit",
          "duplicate",
          "document_unreadable",
          "document_expired",
          "name_mismatch",
          "age_restriction",
          "suspected_fraud",
          "other"
        ]
      },
      {
        "path": "verification_method",
        "slot": "context",
        "type": "String",
        "req": "suggested",
        "value": "example",
        "desc": {
          "en": "Verification method attempted",
          "cn": "尝试的验证方式",
          "hk": "嘗試的驗證方式"
        }
      },
      {
        "path": "time_to_reject_minutes",
        "slot": "context",
        "type": "Number",
        "req": "suggested",
        "value": 5,
        "desc": {
          "en": "Minutes from `register` to this event",
          "cn": "从 `register` 到此事件的分钟数",
          "hk": "從 `register` 到此事件的分鐘數"
        }
      }
    ]
  },
  {
    "name": "deposit",
    "scope": "crypto",
    "category": "financial",
    "categoryLabel": {
      "en": "Financial",
      "cn": "资金",
      "hk": "資金"
    },
    "fields": [
      {
        "path": "transaction_id",
        "slot": "context",
        "type": "String",
        "req": "required",
        "value": "txn_001",
        "desc": {
          "en": "Unique transaction ID (PK)",
          "cn": "唯一交易 ID（主键）",
          "hk": "唯一交易 ID（主鍵）"
        }
      },
      {
        "path": "amount",
        "slot": "context",
        "type": "Number",
        "req": "required",
        "value": 6500,
        "desc": {
          "en": "Deposit amount before fees (monetary)",
          "cn": "扣除手续费前的充值金额（货币字段）",
          "hk": "扣除手續費前的充值金額（貨幣欄位）"
        },
        "monetary": true
      },
      {
        "path": "currency",
        "slot": "context",
        "type": "String",
        "req": "required",
        "value": "USDT",
        "desc": {
          "en": "ISO 4217 (fiat) or crypto symbol",
          "cn": "ISO 4217（法币）或加密货币符号",
          "hk": "ISO 4217（法幣）或加密貨幣符號"
        }
      },
      {
        "path": "deposit_type",
        "slot": "context",
        "type": "String",
        "req": "suggested",
        "value": "onchain",
        "desc": {
          "en": "`onchain` · `fiat_bank` · `card` · `p2p` · `third_party_onramp` · `other`",
          "cn": "`onchain` · `fiat_bank` · `card` · `p2p` · `third_party_onramp` · `other`",
          "hk": "`onchain` · `fiat_bank` · `card` · `p2p` · `third_party_onramp` · `other`"
        },
        "enumValues": [
          "onchain",
          "fiat_bank",
          "card",
          "p2p",
          "third_party_onramp",
          "other"
        ]
      },
      {
        "path": "payment_method",
        "slot": "context",
        "type": "String",
        "req": "suggested",
        "value": "usdt_trc20",
        "desc": {
          "en": "e.g. `usdt_trc20` · `card_visa` · `pix`",
          "cn": "例如 `usdt_trc20` · `card_visa` · `pix`",
          "hk": "例如 `usdt_trc20` · `card_visa` · `pix`"
        }
      },
      {
        "path": "network",
        "slot": "context",
        "type": "String",
        "req": "suggested",
        "value": "TRC20",
        "desc": {
          "en": "Blockchain network, e.g. `TRC20`",
          "cn": "区块链网络，例如 `TRC20`",
          "hk": "區塊鏈網絡，例如 `TRC20`"
        }
      },
      {
        "path": "fee_amount",
        "slot": "context",
        "type": "Number",
        "req": "suggested",
        "value": 3.25,
        "desc": {
          "en": "Deposit fee charged, in `currency`",
          "cn": "收取的充值手续费，以 `currency` 计价",
          "hk": "收取的充值手續費，以 `currency` 計價"
        },
        "monetary": true
      },
      {
        "path": "tx_hash",
        "slot": "context",
        "type": "String",
        "req": "suggested",
        "value": "0x0123456789abcdef",
        "desc": {
          "en": "On-chain transaction hash",
          "cn": "链上交易哈希",
          "hk": "鏈上交易哈希"
        }
      }
    ]
  },
  {
    "name": "withdraw",
    "scope": "crypto",
    "category": "financial",
    "categoryLabel": {
      "en": "Financial",
      "cn": "资金",
      "hk": "資金"
    },
    "fields": [
      {
        "path": "transaction_id",
        "slot": "context",
        "type": "String",
        "req": "required",
        "value": "txn_001",
        "desc": {
          "en": "Unique transaction ID (PK)",
          "cn": "唯一交易 ID（主键）",
          "hk": "唯一交易 ID（主鍵）"
        }
      },
      {
        "path": "amount",
        "slot": "context",
        "type": "Number",
        "req": "required",
        "value": 6500,
        "desc": {
          "en": "Withdrawal amount before fees (monetary)",
          "cn": "扣除手续费前的提现金额（货币字段）",
          "hk": "扣除手續費前的提現金額（貨幣欄位）"
        },
        "monetary": true
      },
      {
        "path": "currency",
        "slot": "context",
        "type": "String",
        "req": "required",
        "value": "USDT",
        "desc": {
          "en": "ISO 4217 or crypto symbol",
          "cn": "ISO 4217 或加密货币符号",
          "hk": "ISO 4217 或加密貨幣符號"
        }
      },
      {
        "path": "withdraw_type",
        "slot": "context",
        "type": "String",
        "req": "suggested",
        "value": "onchain",
        "desc": {
          "en": "`onchain` · `fiat_bank` · `card` · `p2p` · `other`",
          "cn": "`onchain` · `fiat_bank` · `card` · `p2p` · `other`",
          "hk": "`onchain` · `fiat_bank` · `card` · `p2p` · `other`"
        },
        "enumValues": [
          "onchain",
          "fiat_bank",
          "card",
          "p2p",
          "other"
        ]
      },
      {
        "path": "network",
        "slot": "context",
        "type": "String",
        "req": "suggested",
        "value": "TRC20",
        "desc": {
          "en": "Blockchain network, e.g. `ERC20`",
          "cn": "区块链网络，例如 `ERC20`",
          "hk": "區塊鏈網絡，例如 `ERC20`"
        }
      },
      {
        "path": "fee_amount",
        "slot": "context",
        "type": "Number",
        "req": "suggested",
        "value": 3.25,
        "desc": {
          "en": "Withdrawal fee charged, in `currency`",
          "cn": "收取的提现手续费，以 `currency` 计价",
          "hk": "收取的提現手續費，以 `currency` 計價"
        },
        "monetary": true
      },
      {
        "path": "tx_hash",
        "slot": "context",
        "type": "String",
        "req": "suggested",
        "value": "0x0123456789abcdef",
        "desc": {
          "en": "On-chain transaction hash",
          "cn": "链上交易哈希",
          "hk": "鏈上交易哈希"
        }
      }
    ]
  },
  {
    "name": "trade",
    "scope": "crypto",
    "category": "trading",
    "categoryLabel": {
      "en": "Trading",
      "cn": "交易",
      "hk": "交易"
    },
    "fields": [
      {
        "path": "transaction_id",
        "slot": "context",
        "type": "String",
        "req": "required",
        "value": "ord_88213377",
        "desc": {
          "en": "Unique order ID (PK)",
          "cn": "唯一订单 ID（主键）",
          "hk": "唯一訂單 ID（主鍵）"
        }
      },
      {
        "path": "product_type",
        "slot": "context",
        "type": "String",
        "req": "required",
        "value": "futures",
        "desc": {
          "en": "`futures` (perpetual and delivery contracts) · `spot` · `convert` · `other`",
          "cn": "`futures`（永续和交割合约）· `spot` · `convert` · `other`",
          "hk": "`futures`（永續和交割合約）· `spot` · `convert` · `other`"
        },
        "enumValues": [
          "futures",
          "spot",
          "convert",
          "other"
        ]
      },
      {
        "path": "amount",
        "slot": "context",
        "type": "Number",
        "req": "required",
        "value": 6500,
        "desc": {
          "en": "Filled notional value (monetary). Futures: quantity filled in this trade × fill price, not margin",
          "cn": "已成交名义价值（货币字段）。期货：本次交易的成交数量 × 成交价格，而非保证金",
          "hk": "已成交名義價值（貨幣欄位）。期貨：本次交易的成交數量 × 成交價格，而非保證金"
        },
        "monetary": true
      },
      {
        "path": "currency",
        "slot": "context",
        "type": "String",
        "req": "required",
        "value": "USDT",
        "desc": {
          "en": "Currency of `amount`. USDT- or USDC-margined: the quote asset. Coin-margined (Coin-M): the coin itself",
          "cn": "`amount` 的币种。USDT 或 USDC 本位：报价资产；币本位（Coin-M）：该币种本身",
          "hk": "`amount` 的幣種。USDT 或 USDC 本位：報價資產；幣本位（Coin-M）：該幣種本身"
        }
      },
      {
        "path": "fee_amount",
        "slot": "context",
        "type": "Number",
        "req": "required",
        "value": 3.25,
        "desc": {
          "en": "Trading fee charged to the user, before coupons and fee credits (monetary). Send `0` for zero-fee trades; a negative value for maker rebates",
          "cn": "向用户收取的交易手续费，按抵扣券和手续费抵扣前计算（货币字段）。零手续费交易传 `0`；挂单返佣传负值",
          "hk": "向用戶收取的交易手續費，按抵扣券和手續費抵扣前計算（貨幣欄位）。零手續費交易傳 `0`；掛單返傭傳負值"
        },
        "monetary": true
      },
      {
        "path": "fee_currency",
        "slot": "context",
        "type": "String",
        "req": "required",
        "value": "USDT",
        "desc": {
          "en": "Currency of `fee_amount`",
          "cn": "`fee_amount` 的币种",
          "hk": "`fee_amount` 的幣種"
        }
      }
    ]
  },
  {
    "name": "trade_daily_summary",
    "scope": "crypto",
    "category": "trading",
    "categoryLabel": {
      "en": "Trading",
      "cn": "交易",
      "hk": "交易"
    },
    "fields": [
      {
        "path": "date",
        "slot": "context",
        "type": "String",
        "req": "required",
        "value": "2024-06-13",
        "desc": {
          "en": "Trading day, `YYYY-MM-DD`, in UTC",
          "cn": "交易日期，UTC 时区，格式为 `YYYY-MM-DD`",
          "hk": "交易日期，UTC 時區，格式為 `YYYY-MM-DD`"
        }
      },
      {
        "path": "product_type",
        "slot": "context",
        "type": "String",
        "req": "required",
        "value": "futures",
        "desc": {
          "en": "`futures` · `spot` · `convert` · `other`",
          "cn": "`futures` · `spot` · `convert` · `other`",
          "hk": "`futures` · `spot` · `convert` · `other`"
        },
        "enumValues": [
          "futures",
          "spot",
          "convert",
          "other"
        ]
      },
      {
        "path": "amount_usd",
        "slot": "context",
        "type": "Number",
        "req": "required",
        "value": 48250,
        "desc": {
          "en": "Total filled notional value for the day, in USD",
          "cn": "当天已成交名义价值总额，以 USD 计价",
          "hk": "當天已成交名義價值總額，以 USD 計價"
        },
        "monetary": true
      },
      {
        "path": "fee_usd",
        "slot": "context",
        "type": "Number",
        "req": "required",
        "value": 24.13,
        "desc": {
          "en": "Total trading fees charged that day, in USD, before coupons and fee credits",
          "cn": "当天收取的交易手续费总额，以 USD 计价，按抵扣券和手续费抵扣前计算",
          "hk": "當天收取的交易手續費總額，以 USD 計價，按抵扣券和手續費抵扣前計算"
        },
        "monetary": true
      },
      {
        "path": "trade_count",
        "slot": "context",
        "type": "Number",
        "req": "required",
        "value": 12,
        "desc": {
          "en": "Number of filled orders that day",
          "cn": "当天已成交订单数量",
          "hk": "當天已成交訂單數量"
        }
      }
    ]
  },
  {
    "name": "reward_claimed",
    "scope": "crypto",
    "category": "rewards",
    "categoryLabel": {
      "en": "Rewards",
      "cn": "奖励",
      "hk": "獎勵"
    },
    "fields": [
      {
        "path": "reward_id",
        "slot": "context",
        "type": "String",
        "req": "required",
        "value": "reward_001",
        "desc": {
          "en": "Unique reward instance ID (PK)",
          "cn": "唯一奖励实例 ID（主键）",
          "hk": "唯一獎勵實例 ID（主鍵）"
        }
      },
      {
        "path": "reward_type",
        "slot": "context",
        "type": "String",
        "req": "required",
        "value": "signup_bonus",
        "desc": {
          "en": "`signup_bonus` · `deposit_bonus` · `trading_fee_voucher` · `futures_bonus` · `position_airdrop` · `airdrop` · `referral_reward` · `cashback` · `task_reward` · `other`",
          "cn": "`signup_bonus` · `deposit_bonus` · `trading_fee_voucher` · `futures_bonus` · `position_airdrop` · `airdrop` · `referral_reward` · `cashback` · `task_reward` · `other`",
          "hk": "`signup_bonus` · `deposit_bonus` · `trading_fee_voucher` · `futures_bonus` · `position_airdrop` · `airdrop` · `referral_reward` · `cashback` · `task_reward` · `other`"
        },
        "enumValues": [
          "signup_bonus",
          "deposit_bonus",
          "trading_fee_voucher",
          "futures_bonus",
          "position_airdrop",
          "airdrop",
          "referral_reward",
          "cashback",
          "task_reward",
          "other"
        ]
      },
      {
        "path": "reward_trigger",
        "slot": "context",
        "type": "String",
        "req": "required",
        "value": "register",
        "desc": {
          "en": "Action that earned the reward: `register` · `kyc` · `first_deposit` · `first_trade` · `first_futures_trade` · `first_copy_trade` · `trading_volume` · `other`",
          "cn": "获得奖励的行为： `register` · `kyc` · `first_deposit` · `first_trade` · `first_futures_trade` · `first_copy_trade` · `trading_volume` · `other`",
          "hk": "獲得獎勵的行為： `register` · `kyc` · `first_deposit` · `first_trade` · `first_futures_trade` · `first_copy_trade` · `trading_volume` · `other`"
        },
        "enumValues": [
          "register",
          "kyc",
          "first_deposit",
          "first_trade",
          "first_futures_trade",
          "first_copy_trade",
          "trading_volume",
          "other"
        ]
      },
      {
        "path": "value",
        "slot": "context",
        "type": "Number",
        "req": "required",
        "value": 10,
        "desc": {
          "en": "Reward value (monetary)",
          "cn": "奖励价值（货币字段）",
          "hk": "獎勵價值（貨幣欄位）"
        },
        "monetary": true
      },
      {
        "path": "currency",
        "slot": "context",
        "type": "String",
        "req": "required",
        "value": "USDT",
        "desc": {
          "en": "Currency",
          "cn": "币种",
          "hk": "幣種"
        }
      },
      {
        "path": "expires_at",
        "slot": "context",
        "type": "Number",
        "req": "suggested",
        "value": 1718409600000,
        "desc": {
          "en": "UTC ms, reward expiry",
          "cn": "奖励到期时间，UTC 毫秒",
          "hk": "獎勵到期時間，UTC 毫秒"
        }
      }
    ]
  }
]
