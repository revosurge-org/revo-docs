---
title: 安装 Web 追踪器
sidebar_label: 安装 Web 追踪器
---

# 安装 Web 追踪器

**受众：** 开发者、追踪工程师、BI/分析负责人

## 开始前
确保您有：
- 具有产品管理权限的 RevoSurge 账户
- 为网站域名创建的产品
- 网站代码库或标签管理器的访问权限
- 要追踪的关键事件列表（如 Register、FirstTimeDeposit、Deposit）

## 步骤 1 — 创建产品（域名）
1. 进入 **产品管理 → 产品**
2. 点击 **创建产品**
3. 输入网站域名（如 `www.example.com`）
4. 保存

这将创建产品并分配**追踪器 ID**。

## 步骤 2 — 安装追踪器代码（示例 / 草稿）
> **示例 / 草稿（可能变更）**  
> 使用产品追踪设置中提供的追踪器代码片段。

```html
<script src="https://assets.revosurge.com/js/web-tracker.js"></script>
```

## 步骤 3 — 初始化追踪器（示例 / 草稿）
```js
const tracker = new WebTracker({
  trackerId: "your-tracker-id",
  // env: "prod" | "test" | "dev"
});
```

## 步骤 4 — 发送关键事件（示例 / 草稿）
```js
tracker.trackRegister("user_123", { identifier: "hashed_email_or_phone" });

tracker.trackDeposit("user_123", {
  currency: "USDT",
  network: "TRON",
  amount: 100
});
```

## 步骤 5 — 验证追踪器与事件状态
进入追踪/状态页面验证：
- **追踪器状态**
  - Active / In-use：事件正在流入
  - Inactive：近期无数据
- **事件状态**
  - Live：可作为广告系列优化目标
  - Inactive / Not ready：数据不足或近期无数据

关键事件为 Live 后，您的产品即可用于 AdWave 广告系列。
