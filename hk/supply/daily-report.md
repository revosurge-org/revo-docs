---
title: 每日報告 API
description: 按日聚合的競價、贏出價、帳單通知、展示次數、收入和平均 CPM(USD)。UTC 日期,最多 7 天窗口,JWT 鑑權。
---

# 每日報告 API

> 翻譯進行中。完整內容請參考 [English version](/en/supply/daily-report).

唯讀 HTTP 端點,返回每個 UTC 自然日的:
- 競價數 (bidCount)
- 贏出價數 (winCount)
- 帳單通知數 (billCount,無帳單時為 `null`)
- 實際展示數 (impCount)
- 收入,美元 (revenue.byImp / revenue.byBill)
- 平均 CPM,美元 (averageCpm.byImp / averageCpm.byBill)

`byBill` 欄位僅在有帳單數據時返回,無帳單時該欄位不會出現,請按可選欄位解析。

## 端點

```
GET https://rtb.revosurge.com/api/v2/ssp/{sspId}/report?from=YYYY-MM-DD&to=YYYY-MM-DD
Authorization: Bearer <jwt>
```

無法設定請求標頭時,亦可使用查詢參數 `access_token=<jwt>`。兩者同時提供時以請求標頭為準。

注意:此地址不是您的競價端點(`/api/v1/openrtb2/...`)。

## 認證

Token 由 **RevoSurge 平台團隊** 簽發並交付給您。簽名密鑰不會與合作夥伴分享,
請勿嘗試自行簽名。

如需獲取 token,請透過您與 RevoSurge 現有的溝通渠道(Telegram、Microsoft Teams
或您已在使用的客戶經理對話視窗)與我們聯繫,並提供您的 SSP id。

## 限制

- 窗口最長 **7 天**(`to - from <= 6`)
- UTC 日期,允許查詢當天(部分數據)
- 每個 token **每分鐘 10 次** 請求
- 相同查詢在服務端 **快取 5 分鐘**

詳細說明、欄位定義、範例回應、錯誤碼、v1 遷移說明及 FAQ 請見 [English version](/en/supply/daily-report).
