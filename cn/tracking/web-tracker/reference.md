---
title: Web 追踪器 SDK 参考
---

# Web 追踪器 SDK 参考

在 SDK 加载并初始化后使用本参考。先注册，再按发生顺序追踪下游动作，以便更清晰的归因。

## 事件上报 API

### trackRegister

绑定首个唯一用户标识符；之后所有事件将关联到此账户。

```js
tracker.trackRegister('user_123', {
  identifier: 'hashed_email_or_phone'
});
```

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| user_id | string | 是 | 唯一用户 ID。 |
| identifier | string | 否 | 用于去重的哈希邮箱或手机号。 |

### trackDeposit

记录资金流入，用于转化和风险分析。

```js
tracker.trackDeposit('user_123', {
  currency: 'USDT',
  network: 'TRON',
  amount: 100
});
```

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| user_id | string | 是 | 唯一用户 ID。 |
| currency | string | 是 | 货币代码，如 `USDT`。 |
| network | string | 是 | 支付通道或链，如 `TRON`。 |
| amount | number | 是 | 金额。 |

### trackEnterGame

捕获用户开始核心体验（游戏或关键流程）时。

```js
tracker.trackEnterGame('user_123', {
  currency: 'USDT',
  game_provider: 'provider_xyz',
  game_id: 'gamer_123',
  game_name: 'My Awesome Game'
});
```

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| user_id | string | 是 | 唯一用户 ID。 |
| currency | string | 是 | 所选面额。 |
| game_provider | string | 是 | 提供商或合作伙伴名称。 |
| game_id | string | 是 | 内部游戏或功能 ID。 |
| game_name | string | 是 | 游戏或体验显示名称。 |

### trackLogin

确认回访用户并继续同一账户会话。

```js
tracker.trackLogin('user_123');
```

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| user_id | string | 是 | 唯一用户 ID。 |

### trackDownloadClick

标记用户从页面触发下载或跳转应用商店时。

```js
tracker.trackDownloadClick('user_123', {
  store_type: 'App Store'
});
```

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| user_id | string | 是 | 唯一用户 ID。 |
| store_type | string | 否 | 下载渠道，如 App Store 或 Play Store。 |

### trackCustomEvent

添加业务特定事件，如任务完成或物品购买。

```js
tracker.trackCustomEvent('custom_event_type', {
  event_detail: 'value'
});
```

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| event_type | string | 是 | 自定义事件名称。 |
| payload | object | 否 | 事件的键值对载荷。 |

## 工具参考

### getClickid()

返回 UTM 数据中存储的 `clickid`。若 URL 包含 `?clickid=...`，SDK 会自动提取并保存。

```js
const clickid = tracker.getClickid();
if (clickid) {
  console.log('Click ID:', clickid);
}
```

返回：`string | null`

### getVersion()

返回当前 SDK 版本字符串。

```js
const version = tracker.getVersion();
console.log('SDK Version:', version);
```

返回：`string`
