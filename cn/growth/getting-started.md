---
title: 入门指南
description: 账户设置、充值、产品配置、启动首个广告系列。
---

# 入门指南

**面向：** 账户所有者、管理员、运营、UA 经理、财务

## 本文内容
- 账户结构与角色
- 充值与计费基础
- 产品设置(概览)
- 启动首个试点
- 前 72 小时需衡量的指标

## 你的接入路径

这里的一切都是**自助式**的——无需 RevoSurge 对接人也能上线。请按顺序完成以下五个步骤(下文均有展开)：

1. **创建账户** —— 在 [adwave.revosurge.com](https://adwave.revosurge.com) 公开注册，然后添加团队成员。→ [创建账户](/cn/growth/account)
2. **充值钱包** —— 向 AdWave + DataPulse 共享钱包充值。→ [充值与钱包](/cn/growth/funding-wallet)
3. **在 DataPulse 中设置产品与追踪** —— 创建产品并接入追踪，使其变为 **Active**。→ [选择追踪方式](/cn/tracking/overview) · [产品设置](#_3-product-setup-high-level)
4. **启动首个广告系列** —— 产品变为 Active 后，在 AdWave 中构建并启动。→ [广告系列设置](/cn/adwave/campaign-setup)
5. **衡量前 72 小时** —— 在 DataPulse 中关注投放、质量与转化。→ [需衡量的指标](#_5-what-to-measure-in-the-first-72-hours)

::: warning 哪些我能自己做——哪些需要开发者？
步骤 **1、2、4、5 完全可在浏览器中自助完成**。**步骤 3(安装追踪)是唯一的技术环节**——把 Web Tracker 加到你的网站，或发送 S2S 事件，都会触及网站代码。如果你不编辑自己的网站也没关系：你仍掌控其余一切，只需把这一步交给管理你网站的人(见[下方步骤 3](#_3-product-setup-high-level))。对这里的术语还不熟悉？参见 [核心术语](/cn/revosurge/welcome#key-concepts)。
:::

## 1) 账户结构与角色
RevoSurge 账户代表您在平台上的业务，包括：
- 公司身份(法定名称、地区)
- 用户、角色和权限
- 计费与钱包余额
- 产品(网站/应用)
- 广告系列与报表

**常见角色(示例)：**
- **管理员 / 主账户：** 完全访问、用户管理、计费可见性  
- **广告主管：** 广告系列与素材管理  
- **数据分析师：** 报表与衡量(在可用时)  
- **财务：** 余额、发票、交易记录  

> 提示：至少保留一名管理员/主账户用户，以避免访问锁定。

## 2) 充值与钱包基础
RevoSurge 使用**账户级共享钱包**。  
在运行广告系列之前，请确认：
- 钱包有足够余额用于计划支出
- 财务团队了解充值流程和交易记录

您应能查看：
- 当前余额(钱包)
- 交易历史 / 充值记录
- 广告系列支出总额(在 AdWave 中)

## 3) 产品设置(概览) {#_3-product-setup-high-level}
**产品**是您推广的网站/应用。在 AdWave 注册后，每个产品的技术对接——追踪器、服务器事件和 API 凭据——都在 **DataPulse** 中设置。

::: info 同一账户，两种进入 DataPulse 的方式
AdWave 和 DataPulse 共用**一个账户**——同一邮箱、同一登录。两种方式均可进入 DataPulse：
- 直接访问 **[datapulse.revosurge.com](https://datapulse.revosurge.com)** 并登录，或
- 在 **AdWave** 仪表盘中点击**右上角**的 **Open DataPulse**。
:::

![在 AdWave 后台中，"Open DataPulse" 位于右上角，紧邻 Currency / Timezone](/img/onboarding/adwave-open-datapulse.png)

具体使用哪种转化方式——Web Tracker、S2S、AppsFlyer 或 Partner Postback——取决于你的设置；在 [**追踪概述**](/cn/tracking/overview) 中选择适合你的方式。

DataPulse 会通过引导式**设置向导 (Setup Wizard)** 带你完成：
1. **Create Product** —— 设置 Domain、Tracker ID 和 Deposit FX。
2. **Setup Web Tracker** —— 把追踪器加到你的网站，使事件开始流入。参见 [**安装 Web Tracker**](/cn/tracking/web-tracker/install)。
3. **S2S Postback** —— **Generate API Key** 并发送服务器到服务器事件(在首个事件到达前，初始显示 **S2S Status: Pending** 属正常)。参见 [**API 密钥**](/cn/api/api-key)。
4. **Ad Sources** —— 连接 AdWave，使广告系列的投放与成效对齐。

> 在 Web Tracker 收到首个事件之前，产品始终为 **Inactive**；只有**已激活**的产品才能在创建广告系列时被选择。

![DataPulse 设置向导 —— Create Product、Setup Web Tracker、S2S Postback、Ad Sources](/img/onboarding/datapulse-setup-wizard.png)

::: tip 你不是编辑网站的人？
安装 Web Tracker(或发送 S2S 事件)会触及网站代码——你不必亲自完成。把 [**安装 Web Tracker**](/cn/tracking/web-tracker/install) 页面发给管理你网站的人(约 15 分钟)，待产品显示 **Active** 后再回来。本指南中的其余一切仍是自助式的。
:::

## 4) 启动首个试点(推荐清单)
上线前：
- ✅ 已选择**并激活**产品 —— 在 Web Tracker 收到首个事件之前，产品始终为 **Inactive**；只有已激活的产品才能在广告系列流程中被选择。请在 DataPulse 的 **Product → Manage Product** 下查看 **Tracker Status** 列(或设置向导中的 **Web Tracker active** 指示)。  
- ✅ 已选择目标事件(根据当前规则必须可用/有效)  
- ✅ 素材已上传并审核  
- ✅ 已设置地区定向  
- ✅ 已设置日预算和 CPM/出价  
- ✅ 已确定监控计划(谁负责查看支出、效果、质量)

## 5) 前 72 小时需衡量的指标 {#_5-what-to-measure-in-the-first-72-hours}
**客户端效果(广告主视角)：**
- 曝光、点击、CTR
- 落地页会话 / 访问(如已衡量)
- 转化(如可用)
- 支出、CPM、CPC、CPA(如适用)

**运营与单位经济(平台视角)：**
- 按 SSP / 发布商的支出分布
- 胜率、结算 eCPM 分布
- 媒体成本 vs 客户计费支出(加价实现)
- 库存质量信号(如「高曝光 / 无点击」异常)

## 故障排查

::: details 我的产品卡在「Inactive」
产品只有在其 Web Tracker 收到首个事件后才会变为 **Active**。请确认追踪脚本已安装在正确的页面上、`trackerId` 与你的产品匹配，且没有广告拦截器或 CSP 阻挡 `web-tracker.js`。参见 [安装 Web Tracker](/cn/tracking/web-tracker/install#troubleshooting)。如果在真实流量到达很久后仍为 Inactive，请联系支持。
:::

::: details 为什么没有 Web Tracker 数据？
打开 **DataPulse → Product**，查看 **Web Tracker** 事件流(Receiving / Errors / Not-yet-seen)。没有「Receiving」通常意味着脚本未触发或 Tracker ID 有误。
:::

::: details 为什么 S2S 事件没有流入？
在 DataPulse **设置向导 → S2S Postback** 中，确认你已生成 API 密钥，且你的服务器正在向 S2S 端点提交数据。在收到首个事件前，初始显示 **S2S Status: Pending** 属正常。参见 [API 密钥](/cn/api/api-key)。
:::
