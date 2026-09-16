---
title: RevoSurge 概述
sidebar_label: 概述
description: RevoSurge 平台 — AdWave、DataPulse、账户、钱包、广告主工作流。
---

# 欢迎使用 RevoSurge

**面向：** 广告主、增长团队、UA 经理、运营、财务、开发者

RevoSurge 帮助广告主通过 **AdWave (DSP)** 运行程序化获客，并通过 **DataPulse(分析)** 了解成效——**一个账户**、**一个钱包**、**一套产品**即可完成。

本指南涵盖：
- RevoSurge 账户结构
- 如何充值和管理访问权限
- 如何在 AdWave 中启动广告系列(引导式设置)
- 试点期间需监控的指标
- API 快速入门(高层概览，非技术向)

## 本文内容
- RevoSurge 包含什么
- 核心概念(账户 / 钱包 / 产品)
- 典型工作流程
- 下一步

## RevoSurge 包含什么
- **AdWave (DSP)：** 通过 RTB 在多个 SSP 上创建和运行广告系列。
- **DataPulse(分析与数据设置)：** 通过引导式**设置向导 (Setup Wizard)** 配置每个产品的技术对接——Web Tracker、服务器到服务器 (S2S) 事件和 API 密钥——并查看下游成效和报表。它与 AdWave 是**同一账户**——在 [datapulse.revosurge.com](https://datapulse.revosurge.com) 打开，或在 AdWave 仪表盘点击**右上角**的 **Open DataPulse**。
- **追踪：** Web 追踪器和服务器到服务器 (S2S) 事件，将广告曝光与站内/系统内成效关联。

## 核心概念 {#key-concepts}
- **账户：** RevoSurge 中代表您公司的容器(用户、计费、产品、广告系列)。
- **钱包：** AdWave 和(启用时)DataPulse 相关服务共用的余额。
- **产品：** 您推广的网站/应用目的地。广告系列针对所选产品运行。
- **事件：** 您希望优化/衡量的追踪动作(如 Register、Deposit)。
- **Active / Inactive(产品)：** 产品只有在其 Web Tracker 收到首个事件后才会变为 **Active**；只有 Active 产品才能运行广告系列。
- **Tracker ID：** DataPulse 分配给产品的 ID；它把你网站上的追踪器与该产品关联。
- **Web Tracker：** 你网站上的第一方 JavaScript 片段，用于发送事件(需要改动代码)。
- **S2S(服务器到服务器)：** 通过 API 从你的后端发送事件——财务事件的「真实来源」(需要工程投入)。
- **MMP (AppsFlyer)：** 用于 App 安装和应用内事件的移动衡量合作伙伴。
- **FTD(首次充值 / First-Time Deposit)：** 用户的首次充值——常见的优化事件。
- **CPM / oCPM：** 按每千次展示成本 (CPM) 出价，或朝向目标单次事件成本优化 (oCPM)。
- **Deposit FX：** 产品上的汇率设置，用于归一化充值金额。
- **click_id / UTM：** 从落地页 URL 捕获的标识符，用于把一次转化追溯回其广告系列。

## 典型工作流程
1) 在 [adwave.revosurge.com](https://adwave.revosurge.com) 创建/激活账户并添加团队成员  
2) 创建产品(网站/应用)  
3) 在 [DataPulse](https://datapulse.revosurge.com) 中设置追踪 —— Web 追踪器 / S2S 事件  
4) 在 AdWave 中创建广告系列(引导式设置)  
5) 监控试点效果与流量质量  
6) 扩大预算、优化定向，并在需要时应用终止规则  

## 下一步
- 新手入门：前往 [**增长 → 入门指南**](/cn/growth/getting-started)
- 集成追踪：前往 [**追踪 → 概述**](/cn/tracking/overview)
- 投放广告：前往 [**AdWave → 广告系列设置**](/cn/adwave/campaign-setup)
- 受众定向：前往 [**受众**](/cn/audience/segments)
- 构建集成：前往 [**API → API 快速入门**](/cn/api/quickstart)
