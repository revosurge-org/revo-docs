---
title: 服务器到服务器 (S2S) 概述
description: 从后端发送转化事件。S2S vs Web 追踪器、要求、认证。
---

# 服务器到服务器 (S2S) 概述

服务器到服务器 (S2S) 追踪允许您直接从后端向 RevoSurge 发送转化事件。

在以下情况使用 S2S：
- 需要后端确认的事件(支付结算、充值完成)
- 客户端追踪不可靠(广告拦截、浏览器限制)
- 需要包含安全交易字段(amount、currency、transaction_id)

## S2S vs Web 追踪器

### Web 追踪器适用于
- 捕获会话和 Web 上下文(URL、来源)
- 在落地时提取 click_id / UTM
- 网站快速实施

### S2S 适用于
- 已确认的转化和财务成效
- 收入相关事件的更高数据完整性
- 客户端脚本受限的环境

> 许多广告主同时使用：Web 追踪器用于归因上下文，S2S 作为「真实来源」的转化事件。

## S2S 所需
- 可调用 RevoSurge 端点的服务器集成
- 认证(根据环境使用 API key/token)
- 一致的用户标识策略(如 user_id)

## 选择 API 版本

服务器事件 API 有两个版本，均受支持。

| | v2 | v3 |
|---|----|----|
| 状态 | 稳定 | 全新 <Badge type="tip" text="新集成推荐" /> |
| 端点 | `/v2/s2s/event`、`/v2/s2s/batch` | `/v3/s2s/event`、`/v3/s2s/batch` |
| 属性模型 | 单一扁平字段表 | 共享强制属性 + 事件特有字段 |
| 文档 | [服务器事件 API (v2)](/cn/tracking/s2s/server-events-api) | [服务器事件 API (v3)](/cn/tracking/s2s/v3/server-events-api) |

- **新集成：** 从 [v3](/cn/tracking/s2s/v3/server-events-api) 开始。
- **现有 v2 集成：** 参阅[从 v2 迁移](/cn/tracking/s2s/v3/migration)。
