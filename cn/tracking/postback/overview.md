---
title: Partner Postback 概述
description: 对比 Partner Postback v1 与 v2，并选择适合联盟平台的版本。
---

<a id="revosurge-合作方-postback-api"></a>
<a id="revosurge-partner-postback-api"></a>

# Partner Postback 概述

Partner Postback 通过服务端 HTTP GET 回调，将联盟平台或业务后台记录的事件发送给 RevoSurge。适用于来源系统能提供相应必填数据的场景。

## 选择版本 {#choose-version}

| 项目 | Postback v2（推荐） | Postback v1 |
| --- | --- | --- |
| 适用平台 | 可发送规范事件名、点分字段及产品目录要求的数据 | 支持五条预定义事件 URL 和平铺查询参数 |
| 事件选择 | `/v2/pb/{connectionId}/events`，由 `event` 指定事件 | URL 路径区分注册、首充、复充、收入或启动应用 |
| 事件范围 | 与 S2S v3 共用产品事件目录，含已启用的行业事件 | 五条 v1 路径对应的业务事件 |
| 连接 | 使用处于启用状态且只关联一个产品的 Connection | `/v1/pb/{partner}/{event-path}`，`{partner}` 为 Connection ID 或获发的旧标识 |
| 认证 | 在 `k` 中发送对应的 Connection 密钥 | 在 `k` 中发送对应密钥 |
| 字段 | 规范字段，如 `identity.client_user_id`、`timestamp`、`context.transaction_id` | 平铺字段，如 `user_id`、`click_id`、`ts`、`txid`，支持已配置的别名 |
| 身份 | `identity.client_user_id` 或 `identity.anonymous_id`，并满足具体事件要求 | 有效的 `click_id` 或 `user_id`，支持点击身份兜底 |
| 发生时间 | `timestamp` 为实际 UTC 整数毫秒 | `ts` 使用毫秒，解析可纠正秒级值并标记偏差 |
| 金额与币种 | 原币金额和币种，无自动 USD 换算 | 采用 v1 原值和可选的汇率补充规则 |
| 无效输入 | 按校验结果返回 `400` 或 `422` | 部分接收失败返回 `200 ignored`，请检查响应体 |
| Dry run | `status=validated` 或拒绝结果，不发布业务事件 | `decision=accepted` 或 `dropped`，不发布业务事件 |
| URL 获取 | 使用确认的 origin、Connection ID 和密钥组装 | 门户生成器目前提供 v1 URL |
| 技术参考 | [v2 API](/cn/tracking/postback/v2-api) | [v1 API](/cn/tracking/postback/v1-api) |

### 确认平台能力 {#check-what-your-platform-supports}

平台可提供规范点分参数、稳定身份、真实发生时间及产品所需字段时，建议选择 v2。若预定义的事件路径与平铺宏已覆盖需求，可以继续使用 v1。上线前，与技术负责人确认平台可提供的动作和宏值、URL 编码能力、字段完整性及目标环境和产品支持的版本。已有 v1 集成可以继续使用原版本。

## 接入流程 {#follow-the-guide}

1. [设置并测试 Partner Postback](/cn/tracking/postback/setup-postback)。
2. 查阅对应的 [v2 API](/cn/tracking/postback/v2-api) 或 [v1 API](/cn/tracking/postback/v1-api)。
3. 上线前完成[集成校验](/cn/tracking/postback/validation)。
