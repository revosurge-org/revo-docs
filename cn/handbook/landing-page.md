---
title: 落地页与转化路径
description: 玩家如何从广告走到充值、每一步要追踪什么，以及如何做出高转化的落地页。
prev:
  text: '2. 接入追踪'
  link: '/cn/tracking/overview'
---

# 落地页与转化路径

**面向：** 正在准备落地页（玩家点击广告后看到的页面）的广告主和营销人员。

广告负责带来点击，落地页负责把点击变成注册。本页介绍玩家的转化路径、每一步要追踪什么，以及如何搭建一个转化效果好的页面。

<nav class="article-toc" aria-label="本文内容">
<p class="article-toc-title">本文内容</p>

- [1. 转化路径](#_1-the-conversion-path)
- [2. 直达页还是预落地页？](#_2-direct-page-or-pre-lander)
- [3. 使用预落地页模板](#_3-use-a-pre-lander-template)
- [4. 落地页检查清单](#_4-landing-page-checklist)
- [5. 在 RevoSurge 中登记页面](#_5-register-the-page-in-revosurge)

</nav>

## 1. 转化路径 {#_1-the-conversion-path}

典型的 iGaming 转化路径分五步。每一步都有玩家流失，所以每一步都要追踪，才能看清玩家是在哪一步流失的。

| 步骤 | 发生了什么 | 追踪的事件 | 由谁追踪 |
| --- | --- | --- | --- |
| **1. 广告** | 玩家看到并点击你的广告 | 展示、点击 | AdWave（自动） |
| **2. 预落地页**（可选） | 用一个短页面先给玩家“预热”，例如奖励、问答、转盘 | `page_view`、`lp_*` 事件 | Web 追踪器 / 模板 |
| **3. 落地页** | 玩家看到你的注册页 | `page_view` | Web 追踪器 |
| **4. 注册** | 玩家注册账户 | `register` | Web 追踪器 |
| **5. 充值** | 玩家完成首次充值（FTD） | `deposit` | S2S 或 Partner Postback（推荐），或 Web 追踪器 |

::: tip 目标事件要和追踪深度匹配
如果你只追踪到**注册**，就把广告系列的目标事件设为 Register。只有充值追踪稳定可靠时，才选 **FTD**。参见[接入追踪](/cn/tracking/overview)。
:::

## 2. 直达页还是预落地页？ {#_2-direct-page-or-pre-lander}

| 方式 | 怎么运作 | 适用情况 |
| --- | --- | --- |
| **直达页** | 广告直接跳到你的注册页 | 注册页加载快、适配移动端，而且已经展示了优惠 |
| **预落地页** | 广告先跳到一个短页面，再由这个页面把玩家带到注册页 | 你想先讲清楚优惠、加点互动，或在不改动主站的前提下测试不同切入点 |

在 RevoSurge 中，这两种方式对应不同的 **Funnel Type**：直达的注册页选 **Direct Register**，把玩家带往下一页的预落地页选 **Redirect Register**。两个页面都要登记在同一个产品下。

## 3. 使用预落地页模板 {#_3-use-a-pre-lander-template}

RevoSurge 提供七款免费的[预落地页模板](https://www.revosurge.com/resources/landing-page-templates)，均为移动端优先设计：

| 模板 | 作用 | 适合 |
| --- | --- | --- |
| **Form** | 请玩家留下手机号 | 留过联系方式的玩家，后续转化更好 |
| **Bonus** | 大而醒目地展示奖励，无需互动 | **新手**：最简单的一款 |
| **Quiz** | 提 3 个简短问题 | 激发兴趣，了解玩家想要什么 |
| **Wheel** | 转动转盘揭晓奖品 | 营造“中奖”的感觉 |
| **Scratch** | 刮开揭晓奖品 | 刮的动作比点一下更有参与感；可以和 Wheel 做对比测试 |
| **Games** | 安装前先展示你的游戏 | App 安装广告系列 |
| **Urgency** | 显示实时倒计时 | 促使玩家尽快做决定 |

::: tip 第一次用预落地页？从 Bonus 或 Form 开始
这两款最轻量，风险也最低。
:::

**模板使用步骤：**

1. 选一款和你的优惠相匹配的模板。
2. 编辑模板的 `CONFIG` 区块：品牌、Logo、主标题、副标题、按钮文字和法律声明。**主标题必须和广告文案一字不差。**
3. 保证加载速度：只用一张主图（WebP），不加载网页字体，动画只用 CSS 实现。
4. 设置 `CONFIG.endpoint`，让模板把 `lp_*` 事件发送给 RevoSurge。<!-- TODO: document the collector endpoint value and how lp_* events show in DataPulse -->
5. 把文件托管到你的域名下，并把按钮链接到真正的注册页。

## 4. 落地页检查清单 {#_4-landing-page-checklist}

上线前，用手机逐一检查玩家会进入的每个页面：

- ✅ **快：** 在移动网络下 2 秒内加载完成（首屏小于 150 KB）
- ✅ **和广告一致：** 同样的优惠、同样的措辞、同样的语言。页面给人的感觉哪怕和广告只差一点，玩家不到一秒就会离开
- ✅ **一个明确的操作：** 只有一个按钮（注册或领取），不用滚动就能看到
- ✅ **表单简短：** 只收集创建账户必需的信息
- ✅ **法律声明：** 按各市场的要求展示年龄限制（例如 18+）、理性博彩提示和条款链接
- ✅ **已追踪：** 已安装 Web 追踪器，域名也已登记在产品下

## 5. 在 RevoSurge 中登记页面 {#_5-register-the-page-in-revosurge}

1. 进入 **Product → Manage Product**，打开你的产品。
2. 添加每个落地页 URL 和预落地页域名，并选好对应的 **Funnel Type**。
3. 确认每个页面都已安装 Web 追踪器，并且能在 **Event Stream** 中看到事件。

::: warning 未登记的页面无法投放
广告系列的 Destination URL 必须属于产品下已登记且处于激活状态的域名。创建广告系列之前，先把预落地页、镜像站和跳转域名都加进去。
:::

**下一步：** [素材](./creatives)
