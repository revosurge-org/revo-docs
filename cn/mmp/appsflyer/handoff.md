---
title: 交付与上线
sidebar_label: 交付与上线
description: 收尾 AppsFlyer 集成的检查清单——要交给 RevoSurge 客户经理什么、端到端上线测试、按症状定位规则，以及哪些改动需要重新校验。
---

# 交付与上线

**受众：** UA 经理、广告主、把客户集成交付回去的代理商

这是检查清单，不是操作指南。两半配置各有专页——[配置 postback](/cn/mmp/appsflyer/postbacks) 与[点击转发](/cn/mmp/appsflyer/click-forwarding)。本页负责收尾：交付什么、如何用真实流量证明它可用，以及日后什么会静默地把它弄坏。

## 交付之前

- [ ] [集成校验](/cn/mmp/appsflyer/validation#必需规则)中每一条必需规则都通过（[AF-R-01](/cn/mmp/appsflyer/validation#af-r-01) — [AF-R-11](/cn/mmp/appsflyer/validation#af-r-11)）
- [ ] 建议规则也通过，或者每一条未通过的都有明确理由
- [ ] **每个 App** 分别完成——Android 与 iOS 是独立配置的
- [ ] 你的应用内事件已在生产环境上线，而不只是在测试环境

## 要交给客户经理什么

| 交付物 | 我们为什么需要它 | 可以省略的条件 |
|---|---|---|
| AppsFlyer **Integration** 与 **Permissions** 标签页的截图 | 确认 tile 与必需设置一致 | 你已授予 [AF-O-05](/cn/mmp/appsflyer/validation#af-o-05) 与 [AF-O-06](/cn/mmp/appsflyer/validation#af-o-06)——那样我们直接读 tile，不需要截图 |
| 你的**事件映射**——每个 AppsFlyer 事件名，以及它映射到的 RevoSurge 合作方事件名 | 本次集成中风险最高的静默故障。不匹配会让 postback 被投递后因无法识别而丢弃，看起来与"零转化"完全一样 | 永不省略。即使我们拥有全部权限，也请发这一项 |
| 承载 web tracker 的**落地页 URL** | 我们从自己这一侧看不到你的 tracker 初始化代码 | 永不省略 |
| 你推广的**平台**——Android、iOS，还是两者 | 决定哪些 App ID 是必需的，以及 Advanced Privacy 是否适用 | 永不省略 |
| 你在 tracker 中填写的 **AppsFlyer App ID** | 让我们确认你初始化代码里的值与你预期安装落到的那个应用一致 | 永不省略 |

事件映射请以文本形式发送，不要截图——我们会逐字符与我们接受的名称比对，大小写完全影响结果。

## 上线测试

配置检查只能证明配置正确。只有真实流量能证明它可用。

1. 点击一条线上的 RevoSurge 广告——或由客户经理为你建的测试广告系列。
2. 进入承载 web tracker 的落地页。
3. 从应用商店安装 App。
4. 打开 App。
5. 触发一个已映射的漏斗事件——通常注册最快。

应当发生的事：

| 步骤 | 预期结果 | 在哪里查看 |
|---|---|---|
| 点击 | 点击已记录 | RevoSurge 看板 |
| 点击 | 点击已注册到你的应用上 | AppsFlyer，在 RevoSurge 媒体渠道下 |
| 安装 | 归因给 RevoSurge——**而不是**自然量 | AppsFlyer |
| 安装 | 已收到安装 postback | RevoSurge 看板 |
| 漏斗事件 | 已收到应用内事件 postback，且是正确的 RevoSurge 合作方事件名 | RevoSurge 看板 |
| 收入类事件（若有） | 带有金额，而不只是事件本身 | RevoSurge 看板 |

AppsFlyer 是随事件发生实时发送 postback 的，因此配置正确的安装 postback 会在几分钟内到达。如果过了一小时仍然什么都没有，请按故障处理而不是按延迟处理，从下方的定位表开始。

**集成自证的时限：** 交付后 **2 天**内至少一条安装 postback，**7 天**内第一条应用内事件 postback。两者都没产生的集成不算上线，无论配置看起来多正确。

## 测试失败怎么办

从症状入手，不要从配置的第一项开始翻。

| 症状 | 从这里查 |
|---|---|
| RevoSurge 有点击；AppsFlyer 把安装记成自然量 | [AF-R-10](/cn/mmp/appsflyer/validation#af-r-10)、[AF-R-11](/cn/mmp/appsflyer/validation#af-r-11)、[AF-R-09](/cn/mmp/appsflyer/validation#af-r-09) |
| AppsFlyer 把安装归因给了 RevoSurge；RevoSurge 什么都没收到 | [AF-R-05](/cn/mmp/appsflyer/validation#af-r-05)、[AF-R-01](/cn/mmp/appsflyer/validation#af-r-01) |
| 安装 postback 到了；应用内事件始终不到 | [AF-R-06](/cn/mmp/appsflyer/validation#af-r-06)、[AF-R-07](/cn/mmp/appsflyer/validation#af-r-07) |
| 事件到了，但不带收入 | [AF-R-08](/cn/mmp/appsflyer/validation#af-r-08) |
| 同等花费下 iOS 安装量远低于 Android | [AF-R-02](/cn/mmp/appsflyer/validation#af-r-02)、[AF-R-03](/cn/mmp/appsflyer/validation#af-r-03) |
| 两边看板量级不同，但都有数据 | 一定范围内属正常——见[AppsFlyer 与 RevoSurge 对账](/cn/mmp/appsflyer/macros#appsflyer-与-revosurge-对账) |

## 上线之后：哪些改动需要重新校验

本集成没有需要重新注册的链接，因此配置漂移时不会有任何显性报错。以下改动会静默地把它弄坏——每次改动后请重跑对应规则。

| 改动 | 会坏在哪里 | 重跑 |
|---|---|---|
| 重命名某个应用内事件，或新增漏斗事件 | 新增或改名的事件以我们不认识的名字到达，被丢弃 | [AF-R-07](/cn/mmp/appsflyer/validation#af-r-07) |
| 替换或重做落地页 | tracker 或其中的 App ID 可能没能保留下来 | [AF-R-09](/cn/mmp/appsflyer/validation#af-r-09)、[AF-R-10](/cn/mmp/appsflyer/validation#af-r-10) |
| 新增平台——例如在只有 Android 的配置上开 iOS | 新平台没有 App ID，且 Advanced Privacy 开始适用 | [AF-R-03](/cn/mmp/appsflyer/validation#af-r-03)、[AF-R-10](/cn/mmp/appsflyer/validation#af-r-10) |
| 新增一个 App | 什么都不会继承——tile、postback、权限全部按 App 独立 | 全部必需规则 |
| 有人把 Advanced Privacy 又打开了 | postback 失去设备 ID 与点击 ID | [AF-R-03](/cn/mmp/appsflyer/validation#af-r-03) |
| 改动归因回溯窗口 | 归因量发生变化，两边看板差异进一步扩大 | [AF-R-04](/cn/mmp/appsflyer/validation#af-r-04) |
| 在 AdWave 中切换该产品的 MMP | 点击不再到达 AppsFlyer | [AF-R-11](/cn/mmp/appsflyer/validation#af-r-11) |
| 广告系列暂停期间顺手停用合作伙伴 | 那是断连，不是暂停——归因与 postback 都会停止 | [AF-R-01](/cn/mmp/appsflyer/validation#af-r-01) |
| AppsFlyer 账户负责人变更 | 授予 RevoSurge 的权限可能随前任的访问权一起被撤销 | [AF-O-05](/cn/mmp/appsflyer/validation#af-o-05) — [AF-O-08](/cn/mmp/appsflyer/validation#af-o-08) |

> [!TIP]
> 请把 RevoSurge 一侧那两项——落地页上的 tracker、以及 AppsFlyer App ID——加进你团队发布网站前本来就在跑的检查清单。它们活在你的代码库里，因此最容易在一次与广告毫无关系的部署中丢掉。

## 代理商

- 请把[合作伙伴权限](/cn/mmp/appsflyer/permissions)这一页发给客户。只有 App 所有者能在 tile 上授予权限，你无法给自己授权。
- 你交付回客户的内容，就是本页的交付物清单加上上线测试结果。
- RevoSurge 流量不带 `af_prt`，因此 AppsFlyer 的代理商维度会是空的——请从广告主的 AppsFlyer 账户或从 RevoSurge 出 RevoSurge 的效果报表，并且在上线前就把这个预期讲清楚，而不要等到第一个报表周期。
