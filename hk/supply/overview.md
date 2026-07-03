---
title: 供應端接入概述
description: RevoSurge RTB 需求概述 — 支援的廣告格式、地域範圍，以及 SSP 接入方式。
---

# 供應端接入概述

**目標讀者：** 希望將 RevoSurge 作為 DSP 買方接入的 SSP 工程師與商務合作團隊。

RevoSurge 是一個透過即時競價（RTB）購買廣告庫存的需求方平台（DSP）。SSP 只需將 OpenRTB 流量指向我們的競價接口，即可將 RevoSurge 接入為買方。

## 我們購買的流量

| 維度 | 說明 |
|---|---|
| **協議** | OpenRTB 2.5 |
| **廣告格式** | Banner（橫幅）、Native（原生）、Popunder（彈窗） |
| **競價類型** | 一價競價（`at: 1`） |
| **貨幣** | USD |
| **地域範圍** | 全球 — 亞洲、美國、歐盟區域已開通 |

## 工作流程

1. 您的 SSP 透過 HTTP POST 向我們的接口發送 OpenRTB 2.5 競價請求
2. RevoSurge 根據在投廣告系列（定向、預算、底價）評估該請求
3. 我們返回包含出價、廣告代碼和通知 URL 的競價響應；若不出價則返回 HTTP 204
4. 您的 SSP 進行競價；若我們勝出，則觸發我們的獲勝通知 URL
5. 廣告曝光時，觸發我們的計費 URL

## 接口地址

```
POST http://rtb.revosurge.com/api/v1/openrtb2/{sspId}/bid
```

您的 `sspId` 會在接入時分配。詳見[快速開始](/hk/supply/getting-started)。

## 區域節點

我們的接口使用動態 DNS，會自動解析到亞洲、美國、歐盟區域中距離最近的伺服器 — 您無需進行任何區域配置。

## 後續步驟

- [快速開始](/hk/supply/getting-started) — 接入步驟與測試清單
- [競價接口參考](/hk/supply/bid-endpoint) — 完整的請求/響應欄位說明
- [通知回調](/hk/supply/notifications) — 獲勝、計費與競價失敗通知的處理
