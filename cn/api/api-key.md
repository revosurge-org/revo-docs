---
title: API 密钥
description: API 密钥认证。安全最佳实践、密钥轮换、管理。
---

# API 密钥

**面向：** 开发者、管理员

API 密钥用于对 RevoSurge API 的请求进行认证。

## 本文内容
- 什么是 API 密钥
- 如何保护
- 密钥轮换基础

## 什么是 API 密钥
API 密钥标识您的账户并授权 API 操作(如发送 S2S 事件)。

## 如何获取 API 密钥
你可在 **DataPulse** 中自行生成密钥——无需向 RevoSurge 代表申请：

1. 打开 **DataPulse**([datapulse.revosurge.com](https://datapulse.revosurge.com)，或从 AdWave 点击 **Open DataPulse**)并选择你的**产品**。
2. 在**设置向导 (Setup Wizard)** 中，进入 **Step 3 · S2S Postback**。
3. 点击 **Generate API Key** 并把密钥复制到安全的地方——你将用它对 S2S 事件请求进行认证。

在收到首个服务器事件之前，**S2S Status** 会显示 **Pending**；这属正常现象，事件开始流入后会自动清除。

![DataPulse → 设置向导 → Step 3 · S2S Postback → Generate API Key](/img/onboarding/datapulse-generate-api-key.png)

## 保护密钥
- 不要将密钥提交到源代码管理
- 将密钥存储在环境变量或密钥管理器中
- 仅向所需工程师/服务开放访问

## 轮换(推荐)
- 定期轮换密钥(如每季度)
- 如怀疑泄露，立即轮换
