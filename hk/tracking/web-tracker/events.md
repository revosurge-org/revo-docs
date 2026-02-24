---
title: 用戶事件與活動
sidebar_label: 事件
---

# 用戶事件與活動

用戶事件是 RevoSurge 追蹤及匯總的業務動作。  
用於分析，以及（在支援時）AdWave 中的優化目標。

## 常見事件示例
- Register
- FirstTimeDeposit (FTD)
- Deposit / Purchase
- Login
- Custom events

## 事件狀態
每個事件可有狀態，表示是否足夠可靠及近期：
- **Live**：事件正在接收數據，可在要求 Live 的廣告系列流程中使用
- **Inactive / Not ready**：數據不足或近期無數據

## 最佳實踐
對於效果廣告，始終至少驗證：
- Register
- Deposit / FTD（如您的業務模型以充值為主要轉化）
