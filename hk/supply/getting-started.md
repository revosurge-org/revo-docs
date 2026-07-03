---
title: 快速開始 — SSP 接入
description: 在您的 SSP 上將 RevoSurge 接入為 DSP 買方的分步指南。
---

# 快速開始

本指南將引導您在您的 SSP 上把 RevoSurge 接入為買方。

## 第 1 步 — 申請 SSP ID

聯絡 RevoSurge 商務合作團隊獲取分配給您的 `sspId`。該 ID 用於競價接口 URL，便於我們按 SSP 路由流量並追蹤表現。

## 第 2 步 — 配置接口地址

將您的 OpenRTB 流量指向：

```
POST http://rtb.revosurge.com/api/v1/openrtb2/{sspId}/bid
Content-Type: application/json
```

將 `{sspId}` 替換為分配給您的 ID。

## 第 3 步 — 發送測試請求

發送一個最簡競價請求以驗證連通性：

```bash
curl -X POST http://rtb.revosurge.com/api/v1/openrtb2/{sspId}/bid \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-001",
    "imp": [{ "id": "1", "banner": { "w": 300, "h": 250 }, "bidfloor": 0 }],
    "site": { "domain": "example.com", "page": "https://example.com" },
    "device": { "ua": "Mozilla/5.0", "ip": "1.2.3.4", "geo": { "country": "IND" } },
    "at": 1
  }'
```

**預期響應：**
- `200 OK` 並返回競價響應體 — 我們已出價
- `204 No Content` — 沒有匹配該請求的廣告系列（無需處理）

## 第 4 步 — 驗證通知 URL

確保您的 SSP 會觸發我們競價響應中返回的通知 URL：

| URL 欄位 | 觸發時機 | 需替換的宏 |
|---|---|---|
| `nurl`（獲勝 URL） | 您的 SSP 判定 RevoSurge 競價勝出時立即觸發 | 無 |
| `burl`（計費 URL） | 廣告曝光渲染 / 計費時 | 無 |
| `lurl`（失敗 URL） | RevoSurge 競價失敗時（可選，但建議觸發） | `${AUCTION_LOSS}` → 失敗原因碼 |

詳見[通知回調](/hk/supply/notifications)。

## 第 5 步 — 上線檢查清單

- [ ] 已獲取 SSP ID 並配置到接口 URL 中
- [ ] 所有請求均設置 `Content-Type: application/json` 請求頭
- [ ] 測試請求返回 200 或 204（無錯誤響應）
- [ ] 已確認獲勝通知（`nurl`）正常觸發
- [ ] 已確認計費通知（`burl`）正常觸發
- [ ] 競價請求包含 `device.geo.country`、`device.ua`、`device.ip`
