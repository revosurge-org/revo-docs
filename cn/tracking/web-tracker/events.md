---
title: 用户事件与活动
sidebar_label: 事件
description: RevoSurge 用户事件 — Register、FTD、Deposit、Login。事件状态（Live/Inactive）与最佳实践。
---

# 用户事件与活动

用户事件是 RevoSurge 追踪和汇总的业务动作。  
用于分析，以及（在支持时）AdWave 中的优化目标。

## 常见事件示例
- Register
- FirstTimeDeposit (FTD)
- Deposit / Purchase
- Login
- Custom events

## 事件状态
每个事件可有状态，表示是否足够可靠和近期：
- **Live**：事件正在接收数据，可在要求 Live 的广告系列流程中使用
- **Inactive / Not ready**：数据不足或近期无数据

## 最佳实践
对于效果广告，始终至少验证：
- Register
- Deposit / FTD（如您的业务模型以充值为主要转化）
