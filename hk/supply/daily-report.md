---
title: 每日報告 API
description: 按日聚合的競價、贏出價、展示次數和總 CPM(USD)。UTC 日期,最多 7 天窗口,JWT 鑑權。
---

# 每日報告 API

> 翻譯進行中。完整內容請參考 [English version](/en/supply/daily-report).

唯讀 HTTP 端點,返回每個 UTC 自然日的:
- 競價數 (bids)
- 贏出價數 (wins)
- 實際展示數 (imps)
- 總 CPM,美元 (totalCpmUsd)

## 端點

```
GET https://rtb-adaptor.revosurge.com/api/v1/ssp/{sspId}/report?from=YYYY-MM-DD&to=YYYY-MM-DD
Authorization: Bearer <jwt>
```

## 認證

Token 由 **RevoSurge 平台團隊** 簽發並交付給您。簽名密鑰不會與合作夥伴分享,
請勿嘗試自行簽名。

如需獲取 token,請透過您與 RevoSurge 現有的溝通渠道(Telegram、Microsoft Teams
或您已在使用的客戶經理對話視窗)與我們聯繫,並提供您的 SSP id(例如 `galaksion-mspush`)。

## 限制

- 窗口最長 **7 天**(`to - from <= 6`)
- UTC 日期,允許查詢當天(部分數據)
- 每個 token **每分鐘 10 次** 請求
- 相同查詢在服務端 **快取 5 分鐘**

詳細說明、欄位定義、範例回應、錯誤碼及 FAQ 請見 [English version](/en/supply/daily-report).
