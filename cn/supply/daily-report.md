---
title: 每日报告 API
description: 按天聚合的竞价、赢出价、展示次数和总 CPM(USD)。UTC 日期,最多 7 天窗口,JWT 鉴权。
---

# 每日报告 API

> 翻译进行中。完整内容请参考 [English version](/en/supply/daily-report).

只读 HTTP 端点,返回每个 UTC 自然日的:
- 竞价数 (bids)
- 赢出价数 (wins)
- 实际展示数 (imps)
- 总 CPM,美元 (totalCpmUsd)

## 端点

```
GET https://rtb-adaptor.revosurge.com/api/v1/ssp/{sspId}/report?from=YYYY-MM-DD&to=YYYY-MM-DD
Authorization: Bearer <jwt>
```

## 认证

Token 由 **RevoSurge 平台团队** 签发并交付给您。签名密钥不会与合作伙伴分享,
请勿尝试自行签名。

如需获取 token,请通过您与 RevoSurge 现有的沟通渠道(Telegram、Microsoft Teams
或您已在使用的客户经理对话窗口)与我们联系,并提供您的 SSP id(例如 `galaksion-mspush`)。

## 限制

- 窗口最长 **7 天**(`to - from <= 6`)
- UTC 日期,允许查询当天(部分数据)
- 每个 token **每分钟 10 次** 请求
- 相同查询在服务端 **缓存 5 分钟**

详细说明、字段定义、示例响应、错误码及 FAQ 请见 [English version](/en/supply/daily-report).
