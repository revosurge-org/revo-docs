---
title: Web 追蹤器 SDK 參考
description: Web 追蹤器 SDK API 參考 — trackRegister、trackDeposit、trackEnterGame 等事件方法。
---

# Web 追蹤器 SDK 參考

在 SDK 載入並初始化後使用本參考。先註冊，再按發生順序追蹤下游動作，以便更清晰的歸因。

## 事件上報 API

### trackRegister

綁定首個唯一用戶識別碼；之後所有事件將連結到此帳戶。

```js
tracker.trackRegister('user_123', {
  identifier: 'hashed_email_or_phone'
});
```

| 參數 | 類型 | 必填 | 說明 |
| --- | --- | --- | --- |
| user_id | string | 是 | 唯一用戶 ID。 |
| identifier | string | 否 | 用於去重的雜湊電郵或手機號。 |

### trackDeposit

記錄資金流入，用於轉化及風險分析。

```js
tracker.trackDeposit('user_123', {
  currency: 'USDT',
  network: 'TRON',
  amount: 100
});
```

| 參數 | 類型 | 必填 | 說明 |
| --- | --- | --- | --- |
| user_id | string | 是 | 唯一用戶 ID。 |
| currency | string | 是 | 貨幣代碼，如 `USDT`。 |
| network | string | 是 | 支付通道或鏈，如 `TRON`。 |
| amount | number | 是 | 金額。 |

### trackEnterGame

擷取用戶開始核心體驗（遊戲或關鍵流程）時。

```js
tracker.trackEnterGame('user_123', {
  currency: 'USDT',
  game_provider: 'provider_xyz',
  game_id: 'gamer_123',
  game_name: 'My Awesome Game'
});
```

| 參數 | 類型 | 必填 | 說明 |
| --- | --- | --- | --- |
| user_id | string | 是 | 唯一用戶 ID。 |
| currency | string | 是 | 所選面額。 |
| game_provider | string | 是 | 提供商或合作夥伴名稱。 |
| game_id | string | 是 | 內部遊戲或功能 ID。 |
| game_name | string | 是 | 遊戲或體驗顯示名稱。 |

### trackLogin

確認回訪用戶並繼續同一帳戶工作階段。

```js
tracker.trackLogin('user_123');
```

| 參數 | 類型 | 必填 | 說明 |
| --- | --- | --- | --- |
| user_id | string | 是 | 唯一用戶 ID。 |

### trackDownloadClick

標記用戶從頁面觸發下載或跳轉應用商店時。

```js
tracker.trackDownloadClick('user_123', {
  store_type: 'App Store'
});
```

| 參數 | 類型 | 必填 | 說明 |
| --- | --- | --- | --- |
| user_id | string | 否 | 唯一用戶 ID。 |
| store_type | string | 否 | 下載渠道，如 App Store 或 Play Store。 |

### trackCustomEvent

新增業務特定事件，如任務完成或物品購買。

```js
tracker.trackCustomEvent('custom_event_type', {
  event_detail: 'value'
});
```

| 參數 | 類型 | 必填 | 說明 |
| --- | --- | --- | --- |
| event_type | string | 是 | 自訂事件名稱。 |
| payload | object | 否 | 事件的鍵值對載荷。 |

## 工具參考

### getClickid()

回傳 UTM 數據中儲存的 `clickid`。若 URL 包含 `?clickid=...`，SDK 會自動擷取並儲存。

```js
const clickid = tracker.getClickid();
if (clickid) {
  console.log('Click ID:', clickid);
}
```

回傳：`string | null`

### getVersion()

回傳目前 SDK 版本字串。

```js
const version = tracker.getVersion();
console.log('SDK Version:', version);
```

回傳：`string`
