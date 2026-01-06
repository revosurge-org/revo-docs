---
title: Methods
---

# Methods

Use these methods after the SDK is loaded and initialized. Start with registration, then track downstream actions in the order they occur for clearer attribution.

## Event reporting APIs

### trackRegister

Bind the first unique user identifier; all later events attach to this account.

```js
tracker.trackRegister('user_123', {
  identifier: 'hashed_email_or_phone'
});
```

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| user_id | string | Yes | Unique user ID. |
| identifier | string | No | Hashed email or phone for de-duplication. |

### trackDeposit

Record money moving in for conversion and risk analysis.

```js
tracker.trackDeposit('user_123', {
  currency: 'USDT',
  network: 'TRON',
  amount: 100
});
```

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| user_id | string | Yes | Unique user ID. |
| currency | string | Yes | Currency code, e.g., `USDT`. |
| network | string | Yes | Payment rail or chain, e.g., `TRON`. |
| amount | number | Yes | Amount value. |

### trackEnterGame

Capture when the user starts the core experience (game or key flow).

```js
tracker.trackEnterGame('user_123', {
  currency: 'USDT',
  game_provider: 'provider_xyz',
  game_id: 'gamer_123',
  game_name: 'My Awesome Game'
});
```

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| user_id | string | Yes | Unique user ID. |
| currency | string | Yes | Selected denomination. |
| game_provider | string | Yes | Provider or partner name. |
| game_id | string | Yes | Internal game or feature ID. |
| game_name | string | Yes | Game or experience display name. |

### trackLogin

Confirm returning users and continue the same account session.

```js
tracker.trackLogin('user_123');
```

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| user_id | string | Yes | Unique user ID. |

### trackDownloadClick

Mark when a user triggers a download or store jump from the page.

```js
tracker.trackDownloadClick('user_123', {
  store_type: 'App Store'
});
```

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| user_id | string | Yes | Unique user ID. |
| store_type | string | No | Channel of the download, e.g., App Store or Play Store. |

### trackCustomEvent

Add business-specific events such as mission complete or item purchase.

```js
tracker.trackCustomEvent('custom_event_type', {
  event_detail: 'value'
});
```

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| event_type | string | Yes | Custom event name. |
| payload | object | No | Key-value payload for the event. |

## Utility methods

### getClickid()

Returns the stored `clickid` from UTM data. If the URL contains `?clickid=...`, the SDK extracts and saves it automatically.

```js
const clickid = tracker.getClickid();
if (clickid) {
  console.log('Click ID:', clickid);
}
```

Returns: `string | null`

### getVersion()

Returns the current SDK version string.

```js
const version = tracker.getVersion();
console.log('SDK Version:', version);
```

Returns: `string`

