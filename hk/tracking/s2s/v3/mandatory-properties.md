---
title: 請求信封與基礎屬性 (v3)
sidebar_label: 信封與基礎屬性
description: S2S 事件 v3 信封結構，以及每個事件都必須攜帶的基礎屬性。
---

# 請求信封與基礎屬性

**對象：** 工程師、技術整合人員

每個 v3 事件都是一個包含四個部分的 JSON **信封**。少數**基礎屬性**會被每個事件繼承，無論其類型為何；事件特定欄位記錄於[標準事件](/hk/tracking/s2s/v3/events-standard)及 [iGaming 事件](/hk/tracking/s2s/v3/events-igaming)。

## 信封結構

```json
{
  "event": "<registered event name>",
  "timestamp": 1718280000000,
  "identity": { "client_user_id": "...", "anonymous_id": "...", "click_id": "..." },
  "context": { "ip_address": "...", "...event-specific fields...": "..." }
}
```

| 部分 | 類型 | 持有內容 |
|------|------|-------|
| `event` | String | 已登記的事件名稱。 |
| `timestamp` | Number | 事件發生的時間（UTC 毫秒）。 |
| `identity` | Object | 事件涉及的對象 — 穩定 ID + 歸因點擊 ID。 |
| `context` | Object | 事件特定欄位（以及 `ip_address`）。 |

## 基礎屬性

以下屬性在**每個**事件上都是必填的（部分可放寬 — 參閱下方的「降級」）：

| 屬性 | 信封位置 | 類型 | 要求 | 備註 |
|----------|-------------------|------|-------------|-------|
| `event` | 頂層 | String | **必填** | 必須是已登記的目錄事件，否則回傳 `422 UNKNOWN_EVENT_TYPE`。 |
| `timestamp` | 頂層 | Number | **必填** | UTC 紀元**毫秒**（參閱下方的「時間戳」）。 |
| `client_user_id` | `identity.client_user_id` | String | **必填** | 唯一用戶 ID。`client_user_id` / `anonymous_id` 其中之一為必填。 |
| `ip_address` | `context.ip_address` | String | **必填** | 終端用戶 IP（IPv4 / IPv6）。驅動地理位置豐富。 |

建議在大多數事件上填寫：

| 屬性 | 信封位置 | 類型 | 備註 |
|----------|-------------------|------|-------|
| `click_id` | `identity.click_id` | String | 廣告點擊 ID — 廣告系列歸因所需。 |
| `anonymous_id` | `identity.anonymous_id` | String | 轉換前的拼接 ID；在 `client_user_id` 出現之前滿足 identity 要求。 |
| `user_agent` | `context.user_agent` | String | 瀏覽器／裝置 user-agent（解析以取得裝置情報）。 |

## Identity

`identity` **必須至少包含** `client_user_id` 或 `anonymous_id` 其中一個。

- `client_user_id` — 你穩定的、已認證的用戶 ID。在所有事件中使用相同的值，並在可能時使用與 [Web 追蹤器](/hk/tracking/web-tracker)相同的值。
- `anonymous_id` — 登入前／註冊前的 ID（例如來自裝置或首次接觸）。讓你可以在用戶帳戶存在之前傳送事件（如 `app_install`）；一旦 `client_user_id` 出現，DataPulse 會將其拼接到用戶。
- `click_id` — 將事件連結到原始的廣告點擊。**它本身並不滿足 identity 要求。**

## 時間戳

`timestamp` 是一個以 **UTC 紀元毫秒**表示的 **Number**（13 位數，例如 `1718280000000`）。

> [!IMPORTANT]
> v3 使用**毫秒**，而非秒。驗證會拒絕看起來像秒的值（低於 `1000000000000`），並標記 `rule: "not_milliseconds"`；而比現在超前**超過 5 分鐘**的值會標記 `rule: "future_skew"`。

## PII 與雜湊

個人資料在傳送前必須經過 **SHA-256 雜湊** — 絕不可使用明文。雜湊欄位放在 `context.privacy.*` 之下：

| 欄位 | 備註 |
|-------|-------|
| `context.privacy.email_hash` | 電郵的 SHA-256，先轉小寫並去除前後空白。 |
| `context.privacy.phone_hash` | E.164 正規化電話的 SHA-256。 |

雜湊必須為**小寫十六進制，64 個字元**（`^[a-f0-9]{64}$`）。格式不正確的雜湊會被拒絕，並標記 `rule: "pii_format"`。

## 降級

少數事件會將 `client_user_id` 及／或 `ip_address` 的基礎要求放寬為**建議**，因為該值可能尚未存在：

| 事件 | 已放寬 |
|----------|---------|
| `app_install`、`app_open`、`app_uninstall` | `client_user_id`（以及 `app_install` 的 `ip_address`）— 用戶在註冊前可能是匿名的。 |
| `bet` | `ip_address` — 投注通常從遊戲伺服器傳來，沒有終端用戶 IP。 |

## 最小範例

```json
{
  "event": "login",
  "timestamp": 1718280000000,
  "identity": { "client_user_id": "user_001", "click_id": "RS_clk_998877" },
  "context": { "ip_address": "203.0.113.1", "user_agent": "Mozilla/5.0 (...)" }
}
```
