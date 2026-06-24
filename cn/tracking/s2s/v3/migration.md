---
title: 从 v2 迁移到 v3
sidebar_label: 从 v2 迁移
description: S2S Events v2 与 v3 之间的变化——信封、毫秒、型别化目录——附字段映射与切换步骤。
---

# 从 v2 迁移到 v3

**受众：** 维护现有 v2 集成的工程师

v2 和 v3 是**独立的端点**——v2 保持不变地继续工作，因此你可以按自己的节奏迁移。不存在自动转换：调用方直接发送 v3 契约。

## 变更概览

| 方面 | v2 | v3 |
|------|----|----|
| 端点 | `/v2/s2s/event`、`/v2/s2s/batch` | `/v3/s2s/event`、`/v3/s2s/batch` |
| 认证头 | `X-API-KEY` | `X-API-KEY`（不变） |
| 载荷形态 | 扁平对象 | [信封](/cn/tracking/s2s/v3/mandatory-properties)：`event` · `timestamp` · `identity` · `context` |
| 事件字段 | `event_name` | `event` |
| `timestamp` | Unix **秒** | Unix **毫秒**（13 位数字） |
| Identity | 顶层的 `client_user_id` | `identity{}`——`client_user_id` / `anonymous_id` 之一为最少 |
| 归因 | 顶层的 `click_id` | `identity.click_id` |
| 事件特定字段 | 顶层 | 在 `context` 内 |
| PII | （无） | 在 `context.privacy.*` 下哈希（SHA-256） |
| 事件名称 | 自由字符串 | **已登记**的目录事件（型别化并校验） |
| 批量 | JSON 数组 | JSON 数组，**最多 600** |
| 成功 | `200` | `202`（`{ "status": "accepted", ... }`） |
| 错误 | 纯文本 | 结构化的 `code` + `violations[]`（`400` / `422` / `429`） |

## 载荷转换

同一个 `deposit` 事件，转换前后对比：

::: code-group

```json [v2 (flat)]
{
  "client_user_id": "user_001",
  "click_id": "clk_998877",
  "event_name": "deposit",
  "timestamp": 1702963200,
  "ip_address": "203.0.113.1",
  "transaction_id": "tx_554433",
  "amount": 50.00,
  "currency": "USD"
}
```

```json [v3 (envelope)]
{
  "event": "deposit",
  "timestamp": 1702963200000,
  "identity": {
    "client_user_id": "user_001",
    "click_id": "clk_998877"
  },
  "context": {
    "ip_address": "203.0.113.1",
    "transaction_id": "tx_554433",
    "amount": 50.00,
    "currency": "USD"
  }
}
```

:::

## 字段映射

| v2（扁平） | v3（信封） |
|-----------|---------------|
| `event_name` | `event` |
| `timestamp`（秒） | `timestamp`（× 1000 → 毫秒） |
| `client_user_id` | `identity.client_user_id` |
| `click_id` | `identity.click_id` |
| `ip_address` | `context.ip_address` |
| `amount`、`currency`、`transaction_id`、`is_crypto`、… | `context.*` |
| _（v3 新增）_ | `identity.anonymous_id`、`context.privacy.email_hash`、… |

## 游戏：投注结算

v3 将一笔已结算的投注建模为一个**单独的 `bet` 事件**，其中内嵌 `bet_result` 和 `bet_result_amount`——不存在独立的 `win` / `loss` 事件。如果你的 v2 集成发送了单独的结算事件，请将它们合并为每张票据一个 `bet`。参见 [iGaming 事件 → `bet`](/cn/tracking/s2s/v3/events-igaming#bet)。

## 切换步骤

1. 确认你的 `X-API-KEY` 在 v3 下可用（同一密钥、同一基础 URL）。对于 iGaming 事件，确认你的产品已[订阅](/cn/tracking/s2s/v3/catalog-governance)。
2. 将端点从 `/v2/...` 切换到 `/v3/...`。
3. 将载荷重构为信封（`event` / `timestamp` / `identity` / `context`）。
4. 将 `timestamp` 从秒转换为**毫秒**。
5. 将 PII 移到 `context.privacy.*`，作为 **SHA-256** 哈希。
6. 使用[测试模式](/cn/tracking/s2s/v3/server-events-api)（`X-Test-Mode: true`）进行校验——修复任何 `violations[]`。
7. 一次切换一种事件类型；在 v3 验证通过之前保持 v2 运行。

## 参考

- [服务器事件 API（v3）](/cn/tracking/s2s/v3/server-events-api)
- [请求信封与基础属性](/cn/tracking/s2s/v3/mandatory-properties)
- [事件目录与校验](/cn/tracking/s2s/v3/catalog-governance)
- [标准事件](/cn/tracking/s2s/v3/events-standard) · [iGaming 事件](/cn/tracking/s2s/v3/events-igaming)
- [服务器事件 API（v2）](/cn/tracking/s2s/server-events-api)
