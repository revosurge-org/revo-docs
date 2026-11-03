---
title: 每日报告 API
description: 按天聚合的竞价、赢出价、账单通知、展示次数、收入和平均 CPM(USD)。UTC 日期,最多 7 天窗口,JWT 鉴权。
---

# 每日报告 API

> 翻译进行中。完整内容请参考 [English version](/en/supply/daily-report).

只读 HTTP 端点,返回每个 UTC 自然日的:
- 竞价数 (bidCount)
- 赢出价数 (winCount)
- 账单通知数 (billCount,无账单时为 `null`)
- 实际展示数 (impCount)
- 收入,美元 (revenue.byImp / revenue.byBill)
- 平均 CPM,美元 (averageCpm.byImp / averageCpm.byBill)

`byBill` 字段仅在有账单数据时返回,无账单时该字段不出现,请按可选字段解析。

## 端点

```
GET https://rtb.revosurge.com/api/v2/ssp/{sspId}/report?from=YYYY-MM-DD&to=YYYY-MM-DD
Authorization: Bearer <jwt>
```

无法设置请求头时,也可使用查询参数 `access_token=<jwt>`。两者同时提供时以请求头为准。

注意:此地址不是您的竞价端点(`/api/v1/openrtb2/...`)。

## 认证

Token 由 **RevoSurge 平台团队** 签发并交付给您。签名密钥不会与合作伙伴分享,
请勿尝试自行签名。

如需获取 token,请通过您与 RevoSurge 现有的沟通渠道(Telegram、Microsoft Teams
或您已在使用的客户经理对话窗口)与我们联系,并提供您的 SSP id。

## 限制

- 窗口最长 **7 天**(`to - from <= 6`)
- UTC 日期,允许查询当天(部分数据)
- 每个 token **每分钟 10 次** 请求
- 相同查询在服务端 **缓存 5 分钟**

详细说明、字段定义、示例响应、错误码、v1 迁移说明及 FAQ 请见 [English version](/en/supply/daily-report).
