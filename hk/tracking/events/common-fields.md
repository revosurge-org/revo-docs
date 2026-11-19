---
title: 通用欄位與身份
description: S2S v3 與 Partner Postback v2 共用的身份、時間戳、IP 和業務欄位規則。
---

<a id="請求信封與基礎屬性"></a>
<a id="request-envelope-base-properties"></a>

# 通用欄位與身份

S2S v3 發送嵌套 JSON，Partner Postback v2 使用以點號分隔的規範查詢參數。下列事件欄位含義和要求適用於兩種方式。Web 追蹤器、AppsFlyer 和 Postback v1 使用各自的接口。

<a id="信封結構"></a>
<a id="基礎屬性"></a>
<a id="envelope-structure"></a>

## 基礎屬性 {#base-properties}

| 規範欄位 | 含義 | 要求 |
| --- | --- | --- |
| `event` | 已啓用的精確事件名 | 必填 |
| `timestamp` | 業務實際發生時間，UTC 整數毫秒 | 必填 |
| `identity.client_user_id` | 穩定的帳戶或玩家 ID | 與 `identity.anonymous_id` 至少提供一個，部分事件要求帳戶 ID |
| `identity.anonymous_id` | 註冊前的穩定匿名身份 | 僅在事件定義允許時可替代帳戶 ID |
| `identity.click_id` | 原始 RevoSurge 點擊 ID | 可取得且允許時發送，不能代替用戶身份 |
| `context.ip_address` | 終端用戶 IPv4 或 IPv6 地址 | 按事件定義填寫，通常必填 |
| `context.user_agent` | 終端用戶瀏覽器或裝置的 User-Agent | 建議提供，以事件定義為準 |

## 身份 {#identity}

跨來源使用同一穩定帳戶 ID。註冊前保留真實的匿名身份。至少提供一種用戶身份，`bonus_claimed` 和 `withdraw_rejected` 等事件要求帳戶身份。聯盟平台的點擊 ID 和 RevoSurge 點擊 ID 應分別保留，在 `identity.click_id` 中發送原始 RevoSurge 值。

<a id="時間戳"></a>

## 時間戳 {#timestamp}

發送實際發生時間，使用 UTC epoch 整數毫秒，至少為 `1000000000000`，未來偏差不超過五分鐘。重試保留原值。編碼及錯誤格式見對應 API。

<a id="pii-與雜湊"></a>

## PII 與雜湊 {#pii-hashing}

雜湊欄位只接受小寫十六進制 SHA-256（64 個字符）。`context.privacy.email_hash` 對去除首尾空格並轉為小寫的郵箱計算雜湊，`context.privacy.phone_hash` 對標準化為 E.164 的號碼計算雜湊。按事件定義使用對應欄位。

<a id="降級"></a>

## 基礎要求的例外 {#downgrades}

| 事件 | 例外 |
| --- | --- |
| `app_install`、`app_open`、`app_uninstall` | `client_user_id` 為建議欄位。註冊前使用真實的匿名 ID |
| `app_install` | `ip_address` 為建議欄位 |
| `bet` | 遊戲伺服器缺少終端用戶 IP 時，`ip_address` 為建議欄位 |

`app_open` 和 `app_uninstall` 仍應滿足其 IP 要求。`withdraw_rejected` 使用原始提款申請的終端用戶 IP。缺少來源身份或 IP 時，按實際資料處理。

## 金額和來源 ID {#money-and-source-ids}

按事件定義發送金額、幣別和計量單位。交易 ID、來源事件 ID 和請求追蹤 ID 各有用途，重試時保留原始業務 ID。具體的重試和金額處理規則由各傳輸方式定義。Crypto 交易金額和手續費可使用不同資產。更新後的 iGaming 獎金與拒絕提款事件使用 ISO 4217 法幣。

<a id="最小範例"></a>
<a id="minimal-example"></a>

## 編碼範例 {#examples}

- [標準事件](/hk/tracking/events/events-standard)
- [iGaming 事件](/hk/tracking/events/events-igaming)
- [Crypto 事件](/hk/tracking/events/events-crypto)
- [S2S 請求結構](/hk/tracking/s2s/v3/server-events-api#the-request-envelope)
- [Postback v2 查詢參數](/hk/tracking/postback/v2-api#v2-parameters)
