---
title: Web Tracker
description: 面向網頁漏斗的第一方 JavaScript SDK——為 AdWave 與 DataPulse 擷取工作階段、click ID 與轉化事件。
---

# Web Tracker

**Web Tracker** 是 RevoSurge 的第一方 JavaScript SDK。把它加到你的落地頁與廣告主網站,即可在用戶穿越你的網頁漏斗時擷取工作階段並觸發轉化事件(register、deposit、FTD)。關鍵事件一旦顯示為 **Live**,即成為 AdWave 廣告系列的優化目標,並驅動 DataPulse 報表。

> **不確定這是否適合你的方式?** 如果你經營流動 App 或擁有自己的後台,請先比較全部四種選項——參見 [**追蹤概述**](/hk/tracking/overview)。

## 何時使用

- 純網頁漏斗(落地頁 + 網站)——沒有 App、沒有後台 API
- 或與 [S2S](/hk/tracking/s2s/overview) / [Partner Postback](/hk/tracking/postback/partner-postback) 並用,以擷取**點擊側**信號

## 如何歸因

- 從落地頁 URL 擷取 **click_id** 與 **UTM** 參數
- 把 `click_id` 存在第一方 cookie(一年有效期)中——一個落地、跳出、數天後才回來的用戶,仍能歸因得上
- 對於 AdWave 投放的流量,這些參數會自動擷取;對於非 AdWave 流量,請確保它們存在於你的目標 URL 中

## 你需要設定甚麼

1. DataPulse 中的一個**產品**——追蹤 + 廣告系列的容器(參見 [入門指南](/hk/growth/getting-started#_3-product-setup-high-level))
2. 追蹤器腳本 + 你的關鍵事件——參見 **[安裝](/hk/tracking/web-tracker/install)**
3. 驗證事件顯示為 **Live**,然後把廣告系列指向它們

> Web Tracker 負責客戶端。對於後端確認的 / 財務類事件(付款結算、充值完成),請使用 [S2S 伺服器事件](/hk/tracking/s2s/overview)——許多廣告主兩者並用:Web Tracker 提供歸因上下文,S2S 作為轉化的真實來源。

## 下一步

- **[安裝 Web Tracker](/hk/tracking/web-tracker/install)**——加入腳本、發送事件、變為 Live
- **[Web Tracker SDK 參考](/hk/tracking/web-tracker/reference)**——每個方法與欄位
