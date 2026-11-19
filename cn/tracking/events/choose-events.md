---
title: 选择事件
description: 选择通过 S2S v3 或 Partner Postback v2 衡量的业务事件。
---

# 选择事件

先确定要衡量哪些业务动作，再根据来源系统和可用数据选择传输方式。S2S v3 和 Partner Postback v2 使用同一个产品事件目录。

## 1. 确定广告系列目标 {#_1-start-with-your-campaign-goal}

| 目标 | 事件 | 来源所需数据 |
| --- | --- | --- |
| 新账号 | `register` | 注册成功及稳定的玩家身份 |
| 充值及首充 | `deposit` | 每笔成功充值的交易 ID、金额和币种 |
| 已结算的投注 | `bet` | 已结算金额、结果及必填的游戏字段 |
| 奖金入账 | `bonus_claimed` | 实际入账的奖金实例、金额和适用条款 |
| 拒绝提款 | `withdraw_rejected` | 已正式拒绝的申请 ID、金额和原因 |
| 加密货币交易 | `trade` | 成交订单，以及分别定义的交易金额和手续费 |

每笔成功充值（含重复充值）均发送 `deposit`，首充由 RevoSurge 判定。另在 **Campaign conversion events** 中确认所选出价策略支持的转化。目录接受事件只表示请求满足接收条件。

## 2. 确认产品类别和事件定义 {#_2-check-the-product-category-and-contract}

先检查[事件可用性](/cn/tracking/events/catalog-validation)，再查看对应的[标准](/cn/tracking/events/events-standard)、[iGaming](/cn/tracking/events/events-igaming)或 [Crypto](/cn/tracking/events/events-crypto) 定义。不同类别的同名事件（如 `deposit`）可能有不同要求，以当前产品的有效定义为准。

## 3. 确认字段来源 {#_3-confirm-who-supplies-every-field}

为每个必填字段确认业务来源和负责人。核对稳定的玩家身份、原始 RevoSurge 点击 ID、发生时间、交易 ID 和适用的金额与币种。平台宏缺少数据时，先补齐业务来源。

## 4. 配置并测试 {#_4-configure-the-method-and-test}

自有后端请按 [S2S 设置指南](/cn/tracking/s2s/setup-s2s)配置，联盟平台回调请按 [Partner Postback 设置指南](/cn/tracking/postback/setup-postback)配置。依次校验请求、检查已保存的测试事件，再完成约定的真实业务流程。分别核对事件接收、归因和广告系列转化验证。

Web 追踪器与 AppsFlyer 各有自己的 SDK 方法或映射规则，接入时请按各自指南使用相应字段。
