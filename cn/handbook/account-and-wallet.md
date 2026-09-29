---
title: 设置账户与钱包
description: 创建你的 RevoSurge 账户，并在上线前通过客户经理为钱包充值。
---

# 设置账户与钱包

**面向：** 刚入驻的自助广告主，以及负责管理预算的人。

上线前，你需要一个账户和一个已充值的**钱包**，广告系列的花费都从钱包里扣。

<nav class="article-toc" aria-label="本文内容">
<p class="article-toc-title">本文内容</p>

- [1. 创建账户](#_1-create-your-account)
- [2. 为钱包充值](#_2-fund-your-wallet)
- [3. 保持余额充足](#_3-keep-your-balance-topped-up)

</nav>

## 1. 创建账户 {#_1-create-your-account}

前往 [adwave.revosurge.com](https://adwave.revosurge.com)，点击 **Sign up**。注册共四步：

![AdWave 注册：Email、Code、Password、Detail](/img/handbook/signup-steps.jpg)

1. **Email：** 输入工作邮箱，勾选 **Read and agreed RevoSurge T&C & Privacy Policy**，然后点击 **Next**。
2. **Code：** 输入邮箱收到的一次性验证码（OTP）。
3. **Password：** 设置密码。
4. **Detail：** 填写基本信息。<!-- TODO: list the Detail fields (capture after a test sign-up) -->

完成后会进入 AdWave 首页，页面顶部就是引导清单。

::: info 一个邮箱，一个账户
每个账户只有**一个登录邮箱**。虽然账户菜单里有 **Manage Members**，但目前还不能添加团队成员，所以注册前请先确定由谁来管这个登录邮箱。如果会有多人投放，请使用共享的工作邮箱（例如 `marketing@yourbrand.com`），而不是个人邮箱。
:::

**完成标志：** 能正常登录，并看到引导清单。

## 2. 为钱包充值 {#_2-fund-your-wallet}

充值由**客户经理**负责处理，平台内暂不支持自助付款。

1. 算出测试预算：**日预算 × 测试天数**。日预算怎么定，参见[上线准备表](./#_2-4-ad-format-bid-and-budget)。
2. 联系客户经理，告诉对方你的账户邮箱和想充值的金额。
3. 按对方发来的付款说明完成付款。
4. 款项到账后，查看余额。余额显示在 **Campaign** 页面右上角：

![Campaign 页面右上角的 Balance 与 Frozen Budget](/img/handbook/wallet-balance.png)

想查看完整明细，点击左下角的**账户图标**，再点击 **Billing**。菜单里也会显示 **Remaining Balance**（剩余余额）。

![账户菜单：Account Setting、Billing（含 Remaining Balance）、Manage Products、Manage Members、Language、Logout](/img/handbook/account-menu.png)

![Account Setting — Billing：Current Balance、Campaign Budget (Frozen)、Total Funds 和 Transaction History](/img/handbook/billing.png)

| 字段 | 含义 |
| --- | --- |
| **Current Balance** | 当前可用的资金 |
| **Campaign Budget (Frozen)** | 为已排期和投放中的广告系列冻结的资金。广告系列结束或预算释放后解冻 |
| **Total Funds** | Current Balance + Campaign Budget (Frozen) |
| **Transaction History** | 所有充值记录（**Deposit**，例如客户经理操作的 *Manual Credit*）和扣款记录（**Deduct**，*AdWave campaign spend*）。点击下载图标即可导出 |

<!-- TODO (Product): the 2026-09-28 screenshots disagree. The Campaign page shows $1,280.00 balance / $400 frozen, but Billing shows Frozen "--" and Total Funds $1,280.00. Confirm the Total Funds formula and when frozen funds appear on Billing. -->

余额低于 5,000 时，AdWave 会显示提醒。<!-- TODO (Product): the alert says 'Click on "+" to top up', but deposits go through the Account Manager only. Confirm what "+" does, and the currency of the 5,000 threshold. -->

::: warning 充值不可退款
按第一个测试周期的计划花费充值即可。钱包由 AdWave 和 DataPulse 共用。<!-- TODO: confirm refund policy is still current -->
:::

**完成标志：** 余额显示充值已到账。

## 3. 保持余额充足 {#_3-keep-your-balance-topped-up}

余额一旦用完，广告系列就会停止投放。如果测试中途停投，重新开始后广告系列需要从头再学习一遍。

- ✅ 查看广告系列时，顺便看一眼余额
- ✅ 余额只剩约 **3 天**的花费时，就请客户经理充值 <!-- TODO (Ops): confirm settlement time and recommended buffer -->

**下一步：** [接入追踪](/cn/tracking/overview)
