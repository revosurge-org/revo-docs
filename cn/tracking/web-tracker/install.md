---
title: 安装 Web 追踪器
sidebar_label: 安装 Web 追踪器
description: 安装 RevoSurge Web 追踪器——添加脚本、初始化、发送关键事件，并验证其在 AdWave 中变为 Live。
---

# 安装 Web 追踪器

**受众：** 开发者、追踪工程师、BI／分析负责人
**安装时长：** 约 15 分钟

Web 追踪器是一个轻量级 JavaScript SDK，将用户事件从你的网站实时传输到 RevoSurge。关键事件一旦变为 **Live**，即可作为 AdWave 广告系列的优化目标，并驱动 Source Intelligence、LTV、ROAS 与流失模型。

::: tip 摘要（TL;DR）
1. 将[脚本](#step-2-add-the-tracker-script)添加到 `<head>`。
2. 用你的追踪器 ID 在 `test` 模式下[初始化](#step-3-initialize-the-tracker) `WebTracker`。
3. 在注册、充值等关键动作上[触发事件](#step-4-send-key-events)。
4. [验证](#step-5-verify-then-go-live)其显示为 **Live**，再切换到 `prod`。
:::

## 开始前

确保你已具备：

- 具有**产品管理**权限的 RevoSurge 账户
- 为你的网站域名创建的**产品**（这会分配你的追踪器 ID）
- 网站代码库或标签管理器的访问权限
- 要追踪的关键事件列表（如 `register`、`deposit`、`withdraw`）

::: info 还没有追踪器 ID？
请先创建——参见[步骤 1](#step-1-create-a-product-domain)。你的追踪器 ID 形如
`TRA-AWP-20251208-051428-001-6734`，显示在产品的追踪设置中。
:::

## 步骤 1: 创建产品（域名） {#step-1-create-a-product-domain}

1. 进入 **产品 → 管理产品**。
2. 创建你的产品（输入网站域名，如 `www.example.com`）。

这会创建产品并分配一个**追踪器 ID**。你将在步骤 3 把该 ID 粘贴进代码片段，或从 **产品 → 安装 Web 追踪器** 复制已预填的代码片段。

## 步骤 2: 添加追踪器脚本 {#step-2-add-the-tracker-script}

将以下代码添加到你要追踪的**每个页面**的 `<head>` 中，尽量靠前，使其在用户动作发生前先加载。

```html
<script src="https://assets.revosurge.com/js/web-tracker.js"></script>
```

::: details 使用 Google Tag Manager？
添加一个包含上述代码的 **Custom HTML** 标签，设置为在 **All Pages** 触发，并将标签优先级设高，使追踪器在你的事件标签运行前就绪。
:::

## 步骤 3: 初始化追踪器 {#step-3-initialize-the-tracker}

在脚本加载后初始化一次。将追踪器 ID 替换为你自己的。

```js
const tracker = new WebTracker({
  trackerId: "your-product's-tracker-id",
  env: "test" // "prod" | "test" | "dev"
});
```

集成期间先用 `test`——测试流量会被校验并显示在你的仪表盘中，但不计入广告系列优化。仅在事件于[步骤 5](#step-5-verify-then-go-live)验证通过后再切换到 `prod`。

| `env`  | 何时使用                 | 是否计入优化？ |
| ------ | ------------------------ | -------------- |
| `prod` | 线上生产流量             | 是             |
| `test` | 集成期间的预发布 / QA    | 否             |
| `dev`  | 本地开发                 | 否             |

## 步骤 4: 发送关键事件 {#step-4-send-key-events}

在相应用户动作发生时调用对应的追踪方法。将**稳定的用户 ID**作为第一个参数传入，使事件能长期关联到同一个人。

```js
// 创建新账户
tracker.trackRegister("user_123", {
  identifier: "hashed_email_or_phone"
});

// 充值完成
tracker.trackDeposit("user_123", {
  currency: "USDT",
  network: "TRON",
  amount: 100
});
```

SDK 为目录中的每个事件提供了带类型的辅助方法（register、login、deposit、withdraw 等）。完整的方法与字段列表参见 [Web 追踪器 SDK 参考](/cn/tracking/web-tracker/reference)。

::: warning 切勿发送原始 PII
将 `identifier` 作为用户邮箱或电话的 **SHA-256 哈希**传入——请在你侧先哈希再调用追踪器。不要发送原始邮箱、电话号码或姓名。
:::

::: tip 如何选择用户 ID
使用你内部使用的同一 ID（如你的账户／用户主键）。在 Web 追踪器与 [服务器事件（S2S）](/cn/tracking/s2s/overview) 之间保持一致的 ID，能让 RevoSurge 将网页与服务器活动拼接为同一份用户画像。
:::

## 步骤 5: 验证，然后上线 {#step-5-verify-then-go-live}

打开 **追踪 → 状态**，等待事件到达（通常在一分钟内）。

**追踪器状态**

| 状态                | 含义             |
| ------------------- | ---------------- |
| Active / In-use     | 事件正在流入     |
| Inactive            | 近期无数据       |

**事件状态**

| 状态                 | 含义                       |
| -------------------- | -------------------------- |
| Live                 | 可作为广告系列优化目标     |
| Inactive / Not ready | 数据不足或近期无事件       |

当关键事件显示为 **Live** 时：

1. 在初始化中将 `env` 改为 `"prod"`。
2. 重新部署。
3. 你的产品即可用于 [AdWave 广告系列](/cn/adwave/guided-campaign-setup)。

## 你的事件能解锁什么

你发送的事件决定了哪些 RevoSurge 功能可用：

| 你发送的事件                     | 解锁                                       |
| -------------------------------- | ------------------------------------------ |
| `register`、`login`              | Source Intelligence · 注册→FTD 漏斗        |
| `deposit`、`withdraw`、`bet`     | 真实 LTV · ROAS · 预测 LTV／流失 · Bonus Engine |

覆盖的事件目录越全，定向与优化就越精准。

## 疑难排查

::: details 事件没有出现
- 确认脚本标签位于 `<head>` 中且已加载（在 Network 面板查找 `web-tracker.js`）。
- 确保 `new WebTracker({...})` 在脚本加载**之后**运行。
- 确认 `trackerId` 与产品设置中的完全一致。
- 记住 `test` 事件不会出现在生产／优化视图中——请查看测试视图。
:::

::: details 事件显示为 “Not ready” ／ 始终不变为 Live
事件需要足够的近期量级才会被标记为 **Live**。发送真实（或拟真的测试）流量并给它时间积累。稀疏或一次性事件会保持未激活。
:::

::: details 能否从服务器而非浏览器进行追踪？
可以。对于后端生成的事件（服务器端确认的支付、KYC、红利），请使用 [服务器事件 API（S2S）](/cn/tracking/s2s/overview) 替代 Web 追踪器——或与其并用。
:::

## 后续步骤

- [Web 追踪器 SDK 参考](/cn/tracking/web-tracker/reference) — 每个方法与字段
- [服务器事件 API（S2S）](/cn/tracking/s2s/overview) — 从后端发送事件
- [引导式广告系列设置](/cn/adwave/guided-campaign-setup) — 上线你的第一个 AdWave 广告系列
