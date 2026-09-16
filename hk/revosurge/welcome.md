---
title: RevoSurge 概述
sidebar_label: 概述
description: RevoSurge 平台 — AdWave、DataPulse、帳戶、錢包、廣告主工作流程。
---

# 歡迎使用 RevoSurge

**對象：** 廣告主、增長團隊、UA 經理、營運、財務、開發者

RevoSurge 協助廣告主透過 **AdWave (DSP)** 執行程序化獲客，並透過 **DataPulse(分析)** 了解成效——**一個帳戶**、**一個錢包**、**一套產品**即可完成。

本指南涵蓋：
- RevoSurge 帳戶結構
- 如何充值及管理存取權限
- 如何在 AdWave 中啟動廣告系列(引導式設定)
- 試點期間需監控的指標
- API 快速入門(高層概覽，非技術向)

## 本文內容
- RevoSurge 包含甚麼
- 核心概念(帳戶 / 錢包 / 產品)
- 典型工作流程
- 下一步

## RevoSurge 包含甚麼
- **AdWave (DSP)：** 透過 RTB 在多個 SSP 上建立及執行廣告系列。
- **DataPulse(分析與數據設定)：** 透過引導式的 **Setup Wizard** 配置每個產品的技術整合——Web Tracker、伺服器到伺服器 (S2S) 事件與 API 金鑰,並檢視下游成效及報表。它與 AdWave 是**同一個帳戶**——在 [datapulse.revosurge.com](https://datapulse.revosurge.com) 開啟,或在 AdWave 儀表板(右上角)點擊 **Open DataPulse**。
- **追蹤：** Web 追蹤器及伺服器到伺服器 (S2S) 事件，將廣告曝光與站內/系統內成效連結。

## 核心概念 {#key-concepts}
- **帳戶：** RevoSurge 中代表您公司的容器(用戶、計費、產品、廣告系列)。
- **錢包：** AdWave 及(啟用時)DataPulse 相關服務共用的餘額。
- **產品：** 您推廣的網站/應用目的地。廣告系列針對所選產品執行。
- **事件：** 您希望優化/衡量的追蹤動作(如 Register、Deposit)。
- **Active / Inactive(產品)：** 產品只有在其 Web Tracker 收到首個事件後才會變為 **Active**;只有 Active 的產品才能執行廣告系列。
- **Tracker ID：** DataPulse 分配給產品的 ID;它把你網站上的追蹤器連結到該產品。
- **Web Tracker：** 你網站上的第一方 JavaScript 程式碼片段,用於發送事件(需要改動程式碼)。
- **S2S(伺服器到伺服器)：** 透過 API 從你的後端發送事件——財務事件的「真實來源」(需要工程投入)。
- **MMP(AppsFlyer)：** 用於 App 安裝與應用內事件的流動衡量合作夥伴。
- **FTD(First-Time Deposit,首次充值)：** 用戶的首次充值——常見的優化事件。
- **CPM / oCPM：** 按每千次曝光成本出價(CPM),或朝目標的每事件成本優化(oCPM)。
- **Deposit FX：** 產品上的匯率設定,用於將充值金額標準化。
- **click_id / UTM：** 從落地頁 URL 擷取的識別碼,把轉化連結回其廣告系列。

## 典型工作流程
1) 在 [adwave.revosurge.com](https://adwave.revosurge.com) 建立/啟用帳戶並新增團隊成員  
2) 建立產品(網站/應用)  
3) 在 [DataPulse](https://datapulse.revosurge.com) 中設定追蹤——Web 追蹤器 / S2S 事件  
4) 在 AdWave 中建立廣告系列(引導式設定)  
5) 監控試點效果與流量質素  
6) 擴大預算、優化定向，並在需要時套用終止規則  

## 下一步
- 新手入門：前往 [**增長 → 入門指南**](/hk/growth/getting-started)
- 整合追蹤：前往 [**追蹤 → 概述**](/hk/tracking/overview)
- 投放廣告：前往 [**AdWave → 廣告系列設定**](/hk/adwave/campaign-setup)
- 受眾定向：前往 [**受眾**](/hk/audience/segments)
- 建立整合：前往 [**API → API 快速入門**](/hk/api/quickstart)
