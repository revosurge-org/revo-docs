// Shared dataset for the S2S Events v3 interactive payload explorer.
//
// Source of truth: the control-plane event catalog seeder
// (BuiltinPresetDefinitions) + the s2s-ingestor envelope contract.
// V3 events use a nested envelope: { event, timestamp, identity{}, context{} }.
// A field's `slot` says where it lives in that envelope; context fields may use
// dotted paths (e.g. "privacy.email_hash" => context.privacy.email_hash).

export type Lang = 'en' | 'cn' | 'hk'
export type Req = 'required' | 'suggested' | 'optional'
export type Slot = 'envelope' | 'identity' | 'context'
export type FieldType = 'String' | 'Number' | 'Boolean'
export type Scope = 'standard' | 'igaming'

export interface I18n {
  en: string
  cn?: string
  hk?: string
}

export interface FieldDef {
  path: string
  slot: Slot
  type: FieldType
  req: Req
  value: string | number | boolean
  desc: I18n
  enumValues?: string[]
  pii?: boolean
  monetary?: boolean
}

export interface EventDef {
  name: string
  scope: Scope
  category: string
  categoryLabel: I18n
  fields: FieldDef[]
}

const TS_SAMPLE = 1718280000000
const HASH_SAMPLE = '3a7bd3e2360a3d29eea436fcfb7e44c735d117c42d1c1835420b6b9942dd4f1b'

const tri = (en: string, cn: string, hk: string): I18n => ({ en, cn, hk })

// ---- field factory -------------------------------------------------------
type Extra = Partial<Pick<FieldDef, 'enumValues' | 'pii' | 'monetary'>>
const f = (
  path: string,
  slot: Slot,
  type: FieldType,
  req: Req,
  value: string | number | boolean,
  desc: I18n,
  extra: Extra = {}
): FieldDef => ({ path, slot, type, req, value, desc, ...extra })

// Base properties inherited by every event. `cuid`/`ip` requirement can be
// downgraded per event (e.g. app lifecycle, bet).
const base = (name: string, cuid: Req = 'required', ip: Req = 'required'): FieldDef[] => [
  f('event', 'envelope', 'String', 'required', name,
    tri(`Fixed \`${name}\`. Must be a registered event name.`, `固定为 \`${name}\`，必须是已登记的事件名。`, `固定為 \`${name}\`，必須是已登記的事件名。`)),
  f('timestamp', 'envelope', 'Number', 'required', TS_SAMPLE,
    tri('UTC epoch milliseconds (13 digits).', 'UTC 纪元毫秒（13 位）。', 'UTC 紀元毫秒（13 位）。')),
  f('client_user_id', 'identity', 'String', cuid, 'user_001',
    tri('Unique user ID in your system. Identity needs at least one of client_user_id / anonymous_id.', '你系统中用户的唯一 ID。identity 至少需含 client_user_id / anonymous_id 之一。', '你系統中用戶的唯一 ID。identity 至少需含 client_user_id / anonymous_id 之一。')),
  f('click_id', 'identity', 'String', 'suggested', 'RS_clk_998877',
    tri('Ad click ID for attribution.', '用于归因的广告点击 ID。', '用於歸因的廣告點擊 ID。')),
  f('ip_address', 'context', 'String', ip, '203.0.113.1',
    tri('End-user IP (IPv4 or IPv6).', '终端用户 IP（IPv4 或 IPv6）。', '終端用戶 IP（IPv4 或 IPv6）。')),
]

const CAT: Record<string, I18n> = {
  user_lifecycle: tri('User Lifecycle', '用户生命周期', '用戶生命週期'),
  verification_consent: tri('Verification & Consent', '验证与授权', '驗證與授權'),
  app_lifecycle: tri('App Lifecycle', '应用生命周期', '應用生命週期'),
  financial: tri('Financial', '资金', '資金'),
  gaming: tri('Gaming', '游戏', '遊戲'),
  bonus_lifecycle: tri('Bonus Lifecycle', '奖金生命周期', '獎金生命週期'),
}

const def = (name: string, scope: Scope, category: string, extra: FieldDef[], baseFields = base(name)): EventDef => ({
  name,
  scope,
  category,
  categoryLabel: CAT[category],
  fields: [...baseFields, ...extra],
})

// Reused descriptions
const D_UA = tri('Browser / device user-agent string.', '浏览器/设备 user-agent 字符串。', '瀏覽器/裝置 user-agent 字串。')
const D_PLATFORM = tri('Device platform.', '设备平台。', '裝置平台。')
const D_CURRENCY = tri('ISO 4217 (fiat) or crypto symbol.', 'ISO 4217（法币）或加密货币符号。', 'ISO 4217（法幣）或加密貨幣符號。')
const D_CURRENCY2 = tri('ISO 4217 or crypto symbol.', 'ISO 4217 或加密货币符号。', 'ISO 4217 或加密貨幣符號。')
const D_TXN = tri('Unique transaction ID (PK).', '唯一交易 ID（主键）。', '唯一交易 ID（主鍵）。')
const D_CRYPTO = tri('true for crypto.', '加密货币为 true。', '加密貨幣為 true。')

export const s2sV3Events: EventDef[] = [
  // ============================ STANDARD (general.core) ============================
  def('register', 'standard', 'user_lifecycle', [
    f('user_agent', 'context', 'String', 'suggested', 'Mozilla/5.0 (...)', D_UA),
    f('privacy.email_hash', 'context', 'String', 'suggested', HASH_SAMPLE,
      tri('SHA-256 of email (lowercased & trimmed). Never plaintext.', '邮箱的 SHA-256（先小写并去空格）。绝不传明文。', '電郵的 SHA-256（先小寫並去空格）。絕不傳明文。'), { pii: true }),
    f('privacy.phone_hash', 'context', 'String', 'suggested', HASH_SAMPLE,
      tri('SHA-256 of E.164-normalized phone. Never plaintext.', 'E.164 规范化手机号的 SHA-256。绝不传明文。', 'E.164 規範化電話號碼的 SHA-256。絕不傳明文。'), { pii: true }),
    f('privacy.marketing_consent', 'context', 'Boolean', 'suggested', true,
      tri('Whether the user consents to marketing.', '用户是否同意营销。', '用戶是否同意營銷。')),
    f('attribution.install_source', 'context', 'String', 'suggested', 'google_ads',
      tri('Install / acquisition source.', '安装/获客来源。', '安裝/獲客來源。')),
  ]),
  def('login', 'standard', 'user_lifecycle', [
    f('user_agent', 'context', 'String', 'suggested', 'Mozilla/5.0 (...)', D_UA),
  ]),
  def('email_verified', 'standard', 'verification_consent', [
    f('email_hash', 'context', 'String', 'suggested', HASH_SAMPLE,
      tri('SHA-256 of email. Never plaintext.', '邮箱的 SHA-256。绝不传明文。', '電郵的 SHA-256。絕不傳明文。'), { pii: true }),
    f('verification_method', 'context', 'String', 'suggested', 'link',
      tri('How the email was verified.', '邮箱验证方式。', '電郵驗證方式。'), { enumValues: ['link', 'otp', 'magic_link'] }),
  ]),
  def('phone_verified', 'standard', 'verification_consent', [
    f('phone_hash', 'context', 'String', 'suggested', HASH_SAMPLE,
      tri('SHA-256 of phone. Never plaintext.', '手机号的 SHA-256。绝不传明文。', '電話號碼的 SHA-256。絕不傳明文。'), { pii: true }),
    f('verification_method', 'context', 'String', 'suggested', 'sms_otp',
      tri('How the phone was verified.', '手机验证方式。', '電話驗證方式。'), { enumValues: ['sms_otp', 'call', 'whatsapp'] }),
  ]),
  def('marketing_consent_updated', 'standard', 'verification_consent', [
    f('allow_email', 'context', 'Boolean', 'required', true,
      tri('Consent to email. Send the full state of all four channels each time.', '同意邮件。每次发送时上报全部四个渠道的完整状态。', '同意電郵。每次發送時上報全部四個渠道的完整狀態。')),
    f('allow_sms', 'context', 'Boolean', 'required', true, tri('Consent to SMS.', '同意短信。', '同意短訊。')),
    f('allow_push', 'context', 'Boolean', 'required', false, tri('Consent to push.', '同意推送。', '同意推送。')),
    f('allow_whatsapp', 'context', 'Boolean', 'required', true, tri('Consent to WhatsApp.', '同意 WhatsApp。', '同意 WhatsApp。')),
    f('update_source', 'context', 'String', 'suggested', 'settings_page',
      tri('What triggered the change.', '变更触发来源。', '變更觸發來源。'), { enumValues: ['signup', 'settings_page', 'unsubscribe_link', 'support', 'admin'] }),
  ]),
  def('account_blocked', 'standard', 'verification_consent', [
    f('block_reason', 'context', 'String', 'required', 'fraud',
      tri('Why the account was blocked.', '账户被封禁的原因。', '帳戶被封鎖的原因。'), { enumValues: ['fraud', 'bonus_abuse', 'multi_account', 'self_exclusion', 'compliance', 'payment_chargeback', 'other'] }),
    f('block_duration', 'context', 'String', 'suggested', 'temporary',
      tri('Block duration class.', '封禁时长类型。', '封鎖時長類型。'), { enumValues: ['permanent', 'temporary', 'under_review'] }),
    f('expected_unblock_at', 'context', 'Number', 'suggested', 1718880000000,
      tri('UTC ms; for temporary blocks.', 'UTC 毫秒；用于临时封禁。', 'UTC 毫秒；用於臨時封鎖。')),
  ]),
  def('account_unblocked', 'standard', 'verification_consent', [
    f('unblock_reason', 'context', 'String', 'required', 'review_passed',
      tri('Why the account was unblocked.', '账户被解封的原因。', '帳戶被解封的原因。'), { enumValues: ['review_passed', 'appeal_approved', 'temporary_expired', 'manual_admin', 'other'] }),
    f('previous_block_reason', 'context', 'String', 'suggested', 'fraud',
      tri('Reason of the block being lifted.', '被解除的封禁原因。', '被解除的封鎖原因。')),
  ]),
  def('app_install', 'standard', 'app_lifecycle', [
    f('platform', 'context', 'String', 'required', 'android', D_PLATFORM, { enumValues: ['ios', 'android', 'web'] }),
    f('app_version', 'context', 'String', 'suggested', '3.4.1', tri('App version on install.', '安装时的 App 版本。', '安裝時的 App 版本。')),
    f('attribution.install_source', 'context', 'String', 'suggested', 'google_ads',
      tri('Media source / channel (from MMP).', '媒体来源/渠道（来自 MMP）。', '媒體來源/渠道（來自 MMP）。')),
    f('device_id', 'context', 'String', 'suggested', 'dev_abc123', tri('Device identifier.', '设备标识。', '裝置標識。')),
  ], base('app_install', 'suggested', 'suggested')),
  def('app_open', 'standard', 'app_lifecycle', [
    f('platform', 'context', 'String', 'required', 'android', D_PLATFORM, { enumValues: ['ios', 'android', 'web'] }),
    f('app_version', 'context', 'String', 'suggested', '3.4.1', tri('App version.', 'App 版本。', 'App 版本。')),
    f('session_id', 'context', 'String', 'suggested', 'sess_001', tri('Session identifier.', '会话标识。', '工作階段標識。')),
  ], base('app_open', 'suggested', 'required')),
  def('app_uninstall', 'standard', 'app_lifecycle', [
    f('platform', 'context', 'String', 'required', 'android', D_PLATFORM, { enumValues: ['ios', 'android', 'web'] }),
    f('app_version', 'context', 'String', 'suggested', '3.4.1', tri('Last installed version.', '最后安装的版本。', '最後安裝的版本。')),
  ], base('app_uninstall', 'suggested', 'required')),
  def('push_permission_updated', 'standard', 'app_lifecycle', [
    f('platform', 'context', 'String', 'required', 'android', D_PLATFORM, { enumValues: ['ios', 'android', 'web'] }),
    f('permission_status', 'context', 'String', 'required', 'granted',
      tri('Push permission state.', '推送权限状态。', '推送權限狀態。'), { enumValues: ['granted', 'denied', 'provisional', 'revoked'] }),
  ]),

  // ============================ IGAMING (industry, subscription) ============================
  def('session_ended', 'igaming', 'user_lifecycle', [
    f('session_id', 'context', 'String', 'required', 'sess_001', tri('Unique session ID.', '唯一会话 ID。', '唯一工作階段 ID。')),
    f('session_start_at', 'context', 'Number', 'required', 1718276400000, tri('Session start, UTC ms.', '会话开始，UTC 毫秒。', '工作階段開始，UTC 毫秒。')),
    f('duration_minutes', 'context', 'Number', 'required', 60, tri('Total session length (minutes).', '会话总时长（分钟）。', '工作階段總時長（分鐘）。')),
  ]),
  def('vip_tier_changed', 'igaming', 'user_lifecycle', [
    f('new_tier', 'context', 'String', 'required', 'gold', tri('Current tier (e.g. gold, vip_1).', '当前等级（如 gold、vip_1）。', '當前等級（如 gold、vip_1）。')),
    f('direction', 'context', 'String', 'required', 'upgrade', tri('Direction of the change.', '变更方向。', '變更方向。'), { enumValues: ['upgrade', 'downgrade', 'lateral'] }),
    f('trigger', 'context', 'String', 'suggested', 'lifetime_deposits', tri('What triggered the change.', '变更触发来源。', '變更觸發來源。'), { enumValues: ['lifetime_deposits', 'monthly_wagering', 'loyalty_points', 'manual_admin', 'tier_review', 'other'] }),
  ]),
  def('kyc_completed', 'igaming', 'verification_consent', [
    f('kyc_level', 'context', 'String', 'required', 'enhanced', tri('KYC level reached.', '达到的 KYC 等级。', '達到的 KYC 等級。'), { enumValues: ['basic', 'enhanced', 'full'] }),
    f('jurisdiction', 'context', 'String', 'required', 'BR', tri('ISO 3166-1 country code.', 'ISO 3166-1 国家代码。', 'ISO 3166-1 國家代碼。')),
    f('verification_method', 'context', 'String', 'required', 'id_document', tri('Verification method used.', '所用验证方式。', '所用驗證方式。'), { enumValues: ['id_document', 'video', 'sms_otp', 'address_proof', 'bank_verification'] }),
    f('time_to_complete_minutes', 'context', 'Number', 'suggested', 30, tri('Minutes from register to this event.', '从 register 到本事件的分钟数。', '從 register 到本事件的分鐘數。')),
  ]),
  def('kyc_rejected', 'igaming', 'verification_consent', [
    f('kyc_level', 'context', 'String', 'required', 'enhanced', tri('KYC level attempted.', '尝试的 KYC 等级。', '嘗試的 KYC 等級。'), { enumValues: ['basic', 'enhanced', 'full'] }),
    f('jurisdiction', 'context', 'String', 'required', 'BR', tri('ISO 3166-1 country code.', 'ISO 3166-1 国家代码。', 'ISO 3166-1 國家代碼。')),
    f('rejection_reason', 'context', 'String', 'required', 'document_invalid', tri('Why KYC was rejected.', 'KYC 被拒原因。', 'KYC 被拒原因。'), { enumValues: ['document_invalid', 'face_mismatch', 'sanctions_hit', 'underage', 'duplicate', 'other'] }),
    f('verification_method', 'context', 'String', 'suggested', 'id_document', tri('Verification method attempted.', '尝试的验证方式。', '嘗試的驗證方式。')),
  ]),
  def('deposit', 'igaming', 'financial', [
    f('transaction_id', 'context', 'String', 'required', 'txn_554433', D_TXN),
    f('amount', 'context', 'Number', 'required', 100.0, tri('Deposit amount.', '充值金额。', '充值金額。'), { monetary: true }),
    f('currency', 'context', 'String', 'required', 'USD', D_CURRENCY),
    f('is_crypto', 'context', 'Boolean', 'suggested', false, D_CRYPTO),
    f('payment_method', 'context', 'String', 'suggested', 'pix', tri('e.g. card_visa / usdt_trc20 / pix.', '如 card_visa / usdt_trc20 / pix。', '如 card_visa / usdt_trc20 / pix。')),
  ]),
  def('deposit_failed', 'igaming', 'financial', [
    f('transaction_id', 'context', 'String', 'required', 'txn_554434', tri('Attempt ID (PK, for dedup).', '尝试 ID（主键，用于去重）。', '嘗試 ID（主鍵，用於去重）。')),
    f('attempted_amount', 'context', 'Number', 'required', 100.0, tri('Attempted deposit amount.', '尝试充值的金额。', '嘗試充值的金額。'), { monetary: true }),
    f('currency', 'context', 'String', 'required', 'USD', D_CURRENCY2),
    f('payment_method', 'context', 'String', 'required', 'card_visa', tri('Payment method attempted.', '尝试的支付方式。', '嘗試的支付方式。')),
    f('failure_reason', 'context', 'String', 'required', 'insufficient_funds', tri('Why the deposit failed.', '充值失败原因。', '充值失敗原因。'), { enumValues: ['insufficient_funds', 'declined_by_issuer', 'network_error', 'fraud_blocked', 'amount_limit', 'unknown'] }),
    f('is_crypto', 'context', 'Boolean', 'suggested', false, tri('true for crypto attempt.', '加密货币尝试为 true。', '加密貨幣嘗試為 true。')),
  ]),
  def('withdraw', 'igaming', 'financial', [
    f('transaction_id', 'context', 'String', 'required', 'txn_667788', D_TXN),
    f('amount', 'context', 'Number', 'required', 50.0, tri('Withdrawal amount.', '提现金额。', '提現金額。'), { monetary: true }),
    f('currency', 'context', 'String', 'required', 'USD', D_CURRENCY2),
    f('is_crypto', 'context', 'Boolean', 'suggested', false, D_CRYPTO),
  ]),
  def('bet', 'igaming', 'gaming', [
    f('transaction_id', 'context', 'String', 'required', 'bet_554433', tri('Unique bet / ticket ID (PK).', '唯一投注/票据 ID（主键）。', '唯一投注/票據 ID（主鍵）。')),
    f('game_type', 'context', 'String', 'required', 'slot', tri('Canonical game type.', '规范化游戏类型。', '規範化遊戲類型。'), { enumValues: ['slot', 'live_casino', 'crash', 'sportsbook'] }),
    f('game_provider', 'context', 'String', 'required', 'Pragmatic Play', tri('Game provider.', '游戏提供商。', '遊戲提供商。')),
    f('game_name', 'context', 'String', 'suggested', 'Sweet Bonanza', tri('Specific game title.', '具体游戏名称。', '具體遊戲名稱。')),
    f('amount', 'context', 'Number', 'required', 100.0, tri('Total stake.', '总投注额。', '總投注額。'), { monetary: true }),
    f('currency', 'context', 'String', 'required', 'USD', D_CURRENCY2),
    f('cash_bet_amount', 'context', 'Number', 'suggested', 100.0, tri('Cash portion of stake.', '投注中的现金部分。', '投注中的現金部分。')),
    f('bonus_bet_amount', 'context', 'Number', 'suggested', 0, tri('Bonus portion of stake.', '投注中的奖金部分。', '投注中的獎金部分。')),
    f('bet_result', 'context', 'String', 'required', 'win', tri('Settlement outcome.', '结算结果。', '結算結果。'), { enumValues: ['win', 'loss'] }),
    f('bet_result_amount', 'context', 'Number', 'required', 90.0, tri('Net outcome (positive = win, negative = loss).', '净结果（正=赢，负=输）。', '淨結果（正=贏，負=輸）。'), { monetary: true }),
    f('ticket_type', 'context', 'String', 'suggested', 'single', tri('Sportsbook ticket type.', '体育博彩票据类型。', '體育博彩票據類型。'), { enumValues: ['single', 'multi', 'system'] }),
    f('is_live', 'context', 'Boolean', 'suggested', false, tri('Sportsbook in-play bet.', '体育走地（滚球）投注。', '體育走地（滾球）投注。')),
    f('is_free', 'context', 'Boolean', 'suggested', false, tri('Free-bet token (excluded from LTV).', '免费投注券（不计入 LTV）。', '免費投注券（不計入 LTV）。')),
    f('is_crypto', 'context', 'Boolean', 'suggested', false, D_CRYPTO),
  ], base('bet', 'required', 'suggested')),
  def('bonus_offered', 'igaming', 'bonus_lifecycle', [
    f('bonus_id', 'context', 'String', 'required', 'bns_9', tri('Unique bonus instance ID (PK; consistent across lifecycle).', '唯一奖金实例 ID（主键；贯穿生命周期保持一致）。', '唯一獎金實例 ID（主鍵；貫穿生命週期保持一致）。')),
    f('bonus_type', 'context', 'String', 'required', 'welcome', tri('Bonus type.', '奖金类型。', '獎金類型。'), { enumValues: ['welcome', 'reload', 'cashback', 'freespin', 'promo_code', 'tournament', 'other'] }),
    f('bonus_value_max', 'context', 'Number', 'required', 50.0, tri('Max grantable amount.', '最大可授予金额。', '最大可授予金額。')),
    f('currency', 'context', 'String', 'required', 'USD', tri('Currency.', '货币。', '貨幣。')),
    f('wagering_multiplier', 'context', 'Number', 'required', 30, tri('Wagering multiplier (30 = 30x; 0 = none).', '流水倍数（30 = 30 倍；0 = 无）。', '流水倍數（30 = 30 倍；0 = 無）。')),
    f('valid_until', 'context', 'Number', 'required', 1718880000000, tri('UTC ms, offer expiry.', 'UTC 毫秒，优惠到期时间。', 'UTC 毫秒，優惠到期時間。')),
    f('delivery_channel', 'context', 'String', 'required', 'auto_grant', tri('How the offer was delivered.', '优惠下发渠道。', '優惠下發渠道。'), { enumValues: ['auto_grant', 'email', 'in_app', 'push', 'promo_code', 'sms'] }),
    f('is_crypto', 'context', 'Boolean', 'suggested', false, D_CRYPTO),
  ]),
  def('bonus_claimed', 'igaming', 'bonus_lifecycle', [
    f('bonus_id', 'context', 'String', 'required', 'bns_9', tri('Matches bonus_offered (FK).', '与 bonus_offered 匹配（外键）。', '與 bonus_offered 匹配（外鍵）。')),
    f('bonus_value_granted', 'context', 'Number', 'required', 50.0, tri('Actual amount granted (≤ bonus_value_max).', '实际授予金额（≤ bonus_value_max）。', '實際授予金額（≤ bonus_value_max）。')),
    f('currency', 'context', 'String', 'required', 'USD', tri('Must match offered.', '必须与 offered 一致。', '必須與 offered 一致。')),
    f('wagering_requirement', 'context', 'Number', 'required', 1500.0, tri('= bonus_value_granted × wagering_multiplier.', '= bonus_value_granted × wagering_multiplier。', '= bonus_value_granted × wagering_multiplier。')),
    f('is_crypto', 'context', 'Boolean', 'suggested', false, D_CRYPTO),
  ]),
  def('bonus_completed', 'igaming', 'bonus_lifecycle', [
    f('bonus_id', 'context', 'String', 'required', 'bns_9', tri('FK.', '外键。', '外鍵。')),
    f('total_wagered', 'context', 'Number', 'required', 1500.0, tri('Final wagered at completion.', '完成时的最终流水。', '完成時的最終流水。')),
    f('wagering_requirement', 'context', 'Number', 'required', 1500.0, tri('Same as claimed.', '与 claimed 相同。', '與 claimed 相同。')),
    f('currency', 'context', 'String', 'required', 'USD', tri('Must match claimed.', '必须与 claimed 一致。', '必須與 claimed 一致。')),
    f('time_to_complete_minutes', 'context', 'Number', 'required', 240, tri('Minutes from bonus_claimed.', '从 bonus_claimed 起的分钟数。', '從 bonus_claimed 起的分鐘數。')),
    f('is_crypto', 'context', 'Boolean', 'suggested', false, D_CRYPTO),
  ]),
  def('bonus_cashed_out', 'igaming', 'bonus_lifecycle', [
    f('bonus_id', 'context', 'String', 'required', 'bns_9', tri('FK.', '外键。', '外鍵。')),
    f('cashout_amount', 'context', 'Number', 'required', 50.0, tri('Amount moved to real-money wallet.', '转入真实余额钱包的金额。', '轉入真實餘額錢包的金額。')),
    f('original_bonus_value', 'context', 'Number', 'required', 50.0, tri('bonus_value_granted from claim.', '来自 claim 的 bonus_value_granted。', '來自 claim 的 bonus_value_granted。')),
    f('currency', 'context', 'String', 'required', 'USD', tri('Must match claimed.', '必须与 claimed 一致。', '必須與 claimed 一致。')),
    f('time_to_cashout_minutes', 'context', 'Number', 'required', 300, tri('Minutes from bonus_claimed.', '从 bonus_claimed 起的分钟数。', '從 bonus_claimed 起的分鐘數。')),
    f('is_crypto', 'context', 'Boolean', 'suggested', false, D_CRYPTO),
  ]),
]
