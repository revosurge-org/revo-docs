---
title: 配置 AppsFlyer postback
sidebar_label: 配置 postback
description: 在 AppsFlyer 中激活 RevoSurge 合作伙伴 tile，并配置默认 postback 与应用内事件 postback，包括必需的窗口、发送范围与收入设置。
---

# 配置 AppsFlyer postback

**受众：** UA 经理、广告主、拥有 [Configure integration 权限](/cn/mmp/appsflyer/permissions)的代理商

本页的操作**全部在 AppsFlyer 后台完成**。它会激活 RevoSurge 合作伙伴，并让安装与安装后事件开始回传给我们。本页不需要你打开 RevoSurge。

每个 App 各做一次——Android 与 iOS 应用要分别配置。

> [!IMPORTANT]
> Postback 是 RevoSurge 广告可衡量的前提。在它开启之前，RevoSurge 收不到任何安装与事件，无论广告系列怎么设置，优化都无法启动。

## 开始之前

有两件事必须先成立，否则合作伙伴配置不会生效。它们都不在 RevoSurge 的 tile 里，因此很容易被漏掉。

### 1. 概率性归因已打开

在 AppsFlyer 中进入你要配置的 App 的 **App Settings（应用设置）**，确认**概率性归因**（probabilistic attribution，即原来的 "fingerprinting"）已**开启**。

这是**应用级**设置，不是按合作伙伴设置的：它不在 RevoSurge 的 tile 内，一旦打开就对该 App 的所有媒体渠道生效。

> [!NOTE]
> 这一项对 RevoSurge 比对多数合作伙伴更关键。RevoSurge 的点击是从你**浏览器中的落地页**到达 AppsFlyer 的，而浏览器无法交出确定性匹配所需的设备广告 ID——因此有相当一部分真实安装只能靠概率性匹配，iOS 上尤其如此。这个设置关闭时，那些安装会以自然量的形式落库，RevoSurge 学不到它们，你看到的效果也会低于实际效果。

### 2. 已在自己的产品中配置好 postback 的事件清单

先确定你希望 RevoSurge 收到哪些应用内事件，并确认你的 **App 已经在向 AppsFlyer 上报这些事件**——通过 AppsFlyer SDK 或你的服务器到服务器事件集成——再来做本页的配置。

顺序之所以重要，有两个原因：

- 应用内事件 postback 界面映射的是 **AppsFlyer 实际已经收到过的事件名**。你的 App 从未触发过的事件，在那里根本没有可选项。
- 你发什么名字，我们就收什么名字。之后改名会静默地破坏映射：postback 照旧到达，但带的是 RevoSurge 不认识的名字。

请把清单准备好——至少包含注册、充值／购买，以及任何收入类事件——并向你的 RevoSurge 对接人确认我们接受的**合作方事件名**，让每个 AppsFlyer 事件都精确映射到其中一个。

## 1. 打开 RevoSurge 合作伙伴 tile

1. 在 AppsFlyer 中进入 **Collaborate → Partner Marketplace**。
2. 搜索你的 RevoSurge 对接人给你的**准确的 RevoSurge tile 名称**。
3. 点击 **Set up integration**。

> [!WARNING]
> 不要选名称相似的 tile。Partner Marketplace 里有数千个合作伙伴，其中几个名字与我们很接近，选错会得到一份能正常保存、但什么都不发给我们的配置。

## 2. 激活合作伙伴

在 **Integration** 标签页，把 **Activate partner** 打到 **ON**。

只要广告在跑就保持开启。关掉它会立刻停止归因与 postback——这不是暂停，而是断连。

## 3. 关闭 Advanced Privacy（iOS）

iOS 应用请把 **Advanced Privacy**——以及账户中若显示 **Aggregated Advanced Privacy**——设为 **OFF**。

保持开启会从我们收到的 postback 中剥离设备 ID 与点击 ID。到达我们这里的只是一行聚合数据，无法回溯到产生它的那次点击，归因核对与优化都无从谈起。

> [!NOTE]
> 这是你账户上的隐私配置决策。如果该设置由你的法务或合规团队负责，请在上线前就与他们确认，而不要等到上线当天。

## 4. 设置归因回溯窗口

在合作伙伴 tile 的归因设置中设为：

| 窗口 | 必需值 |
|---|---|
| 点击归因回溯期 | **7 天** |
| 浏览归因回溯期 | **24 小时** |

这两个值让 RevoSurge 与你其他渠道使用的窗口保持一致。如果你其他合作伙伴用的窗口不同，请在上线前告知你的 RevoSurge 客户经理，而不要单方面改动——窗口不一致会表现为两边看板之间的归因差异，而不会报错。

## 5. 开启浏览归因

把 **Install view-through attribution** 设为 **ON**。

> [!NOTE]
> RevoSurge 目前**只转发点击**，因此这个开关不会改变你当前 RevoSurge 流量的归因方式——RevoSurge 的归因是基于点击的。把它放进必需配置，是为了之后不必再回来动这个 tile。如果你在核对集成时发现 RevoSurge 没有任何浏览归因安装，这是预期结果，不是配置错误。

## 6. 默认 postback——所有媒体渠道，包含自然量

在 **Default postbacks** 区域开启 **Install** 与 **Re-engagement**，并把两者的发送范围都设为**所有媒体渠道，包含自然量**（AppsFlyer 的措辞是"归因给任意合作伙伴*或*自然量的事件"）。

| Postback | 是否开启 | 发送范围 |
|---|---|---|
| Install | 是 | 所有媒体渠道，包含自然量 |
| Re-engagement | 是 | 所有媒体渠道，包含自然量 |

这是要求，不是偏好。我们的模型需要一张完整的图——归因给 RevoSurge 的、归因给其他合作伙伴的、以及自然量——才能把"我们带来的量"与"本来也会发生的量"区分开。把 postback 限制在"仅归因给本合作伙伴"，等于让我们拿自己的输出当优化依据。

## 7. 应用内事件 postback

1. 把**应用内事件 postback** 打到 **ON**。
2. 把**应用内事件 postback 窗口**设为 **Lifetime（终身）**。如果你的账户无法选 Lifetime，下限是 **6 个月**——再短就会截断我们用于学习的安装后行为。
3. 把**发送范围**设为**所有媒体渠道，包含自然量**，与默认 postback 一致。
4. 按你准备好的清单映射事件。逐个选择 AppsFlyer 事件，映射到它对应的 RevoSurge 合作方事件名。或者，如果你希望把整条事件流都转发过来，也可以使用 **Send all events**。

| 设置项 | 必需值 |
|---|---|
| 应用内事件 postback | ON |
| Postback 窗口 | Lifetime（下限 6 个月） |
| 发送范围 | 所有媒体渠道，包含自然量 |
| 事件映射 | 清单中的每个漏斗事件，或 Send all events |

> [!WARNING]
> 名称要精确映射。对我们来说 `deposit` 和 `Deposit` 是两个不同的事件。不匹配不会报错——postback 会被投递，然后因无法识别而被丢弃，在你的看板上这与"没有转化"长得一模一样。

## 8. 在变现事件上发送数值与收入

映射中每一个购买、充值或收入类事件，都要把数值选项设为 **Values & revenue**。

否则我们只会收到事件、收不到金额，ROAS 与任何基于价值的优化都无法进行。非金额类事件保持仅数值即可。

## 9. 保存

保存集成配置。配置对新流量生效——它不会回补你保存之前发生的事件。

## RevoSurge 会收到什么、不会收到什么

| 我们会收到 | 我们不会收到 |
|---|---|
| 安装，包含自然量与归因给其他合作伙伴的 | 你保存本配置之前的任何数据 |
| 再营销（re-engagement） | 你的 App 从未发给 AppsFlyer 的事件 |
| 你映射的应用内事件，覆盖整个窗口 | 窗口之外的事件（若你设置了短于 Lifetime 的窗口） |
| 设为 Values & revenue 的事件上的收入数值 | 设备 ID 与点击 ID（若 Advanced Privacy 开启） |

## 下一步

Postback 负责把转化**回传**给 RevoSurge。它不会告诉 AppsFlyer 哪些点击是我们的——那是集成的另一半，缺了它集成并未完成。

继续看[点击转发](/cn/mmp/appsflyer/click-forwarding)。你不需要生成任何 AppsFlyer 追踪链接：RevoSurge 会替你转发点击，依据的是你落地页 web tracker 上的 AppsFlyer App ID，加上 AdWave 里一个产品级设置。
