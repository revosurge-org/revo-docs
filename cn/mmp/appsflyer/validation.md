---
title: 集成校验
sidebar_label: 集成校验
description: RevoSurge AppsFlyer 集成的必需与建议校验规则，每条都有稳定的规则 ID 和确切修复方式——哪些会阻止上线，哪些会静默地损耗效果。
---

# AppsFlyer 集成校验

**受众：** UA 经理、广告主、代理商，以及任何要为上线签字的人

上线前跑一遍本页；此后每当有人改动 AppsFlyer tile、落地页或事件清单，再跑一遍。

规则分两档：

- **必需** —— 集成无法工作，或送来的数据 RevoSurge 无法使用。**阻止上线。**
- **建议** —— 集成能工作，但优化或支持能力受损。**不阻止上线。**

> [!NOTE]
> [必需设置一览](/cn/mmp/appsflyer/overview#必需设置一览)中列出的每一项都是 RevoSurge 的要求。本页增加的是第二个维度：哪些失败会让集成无法运转，哪些会静默地损耗你的效果。落在"建议"档的规则依然是你应当修复的设置，只是它不会卡住上线。

每条规则都有**稳定 ID**。RevoSurge 看板的报错会引用这些 ID 并链接到下方对应的修复条目，且这些 ID 在本页的所有语言版本中完全一致。

## 必需规则

| ID | 规则 | 失败会导致什么 |
|---|---|---|
| [AF-R-01](#af-r-01) | RevoSurge tile 上合作伙伴已激活 | 没有归因、没有 postback——什么都到不了 RevoSurge |
| [AF-R-02](#af-r-02) | 概率性归因已开启（应用级） | 多数 RevoSurge 安装会落成自然量；为何后果严重见修复条目 |
| [AF-R-03](#af-r-03) | Advanced Privacy 已关闭（iOS 应用） | postback 到达时不带设备 ID 与点击 ID，无法与产生它的点击关联 |
| [AF-R-04](#af-r-04) | 点击归因回溯期为 7 天 | 缩短后落在窗口之外的安装会被归给别人或归为自然量 |
| [AF-R-05](#af-r-05) | 默认安装 postback 已开启 | RevoSurge 收不到任何安装 |
| [AF-R-06](#af-r-06) | 应用内事件 postback 已开启 | 没有安装后信号，也就没有转化衡量与优化 |
| [AF-R-07](#af-r-07) | AppsFlyer 事件名与 RevoSurge 合作方事件名精确对应 | postback 会被投递，然后因无法识别被丢弃——与"没有转化"无法区分 |
| [AF-R-08](#af-r-08) | 收入类事件已设为 Values & revenue | 事件到达但没有金额；ROAS 与基于价值的优化都无法进行 |
| [AF-R-09](#af-r-09) | 落地页上 web tracker 已生效，且产品显示 Active | 没有点击被转发，且该产品无法在 AdWave 中被选择 |
| [AF-R-10](#af-r-10) | 你推广的每个平台都填了 AppsFlyer App ID | 该平台不会有点击被转发；AppsFlyer 把这些安装记成自然量 |
| [AF-R-11](#af-r-11) | AdWave 中该产品的 MMP 来源为 AppsFlyer | 无论落地页填了什么，都不会有点击被转发 |

## 建议规则

| ID | 规则 | 代价是什么 |
|---|---|---|
| [AF-O-01](#af-o-01) | 应用内事件 postback 窗口为 Lifetime（下限 6 个月） | 漏斗后段事件落在窗口之外，永远不会进入模型训练 |
| [AF-O-02](#af-o-02) | 默认 postback 发送所有媒体渠道，包含自然量 | 优化只能对着 RevoSurge 自己的输出跑，没有基线可比 |
| [AF-O-03](#af-o-03) | 应用内 postback 发送所有媒体渠道，包含自然量 | 同上，针对安装后事件 |
| [AF-O-04](#af-o-04) | 浏览归因已开启，浏览回溯期为 24 小时 | 目前没有代价——属于配置卫生，见修复条目 |
| [AF-O-05](#af-o-05) | RevoSurge 拥有三项聚合数据读取权限 | 每一次数据差异都会变成一轮截图往返 |
| [AF-O-06](#af-o-06) | RevoSurge 拥有两项配置权限 | 每一次修正都要以书面说明的形式经由你的团队 |
| [AF-O-07](#af-o-07) | RevoSurge 拥有 View validation rules 权限 | 配置错误会在花掉预算之后才被发现，而不是之前 |
| [AF-O-08](#af-o-08) | 若你购买了 Protect360，RevoSurge 拥有其访问权限 | 欺诈安装看起来就像从未发生过的安装，于是该来源会被继续购买 |

## 必需项修复方式

### AF-R-01 —— 合作伙伴未激活 {#af-r-01}

**修复：** Collaborate → Partner Marketplace → RevoSurge tile → Integration → 把 **Activate partner** 设为 **ON**。

只要广告在跑就保持开启。关掉它是断连，不是暂停。

### AF-R-02 —— 概率性归因未开启 {#af-r-02}

**修复：** 该 App 的 App Settings → 开启**概率性归因**（probabilistic attribution，即原来的 "fingerprinting"）。这是应用级设置，不在 RevoSurge tile 内。

**为什么它属于必需而不是建议：** RevoSurge 的点击是从你**浏览器**中的落地页到达 AppsFlyer 的，而浏览器无法提供确定性匹配所需的设备广告 ID。这项关闭时，确定性匹配只能抓到一小部分真实安装，其余都以自然量到达——集成在技术上是通的，实质上却没有用。

### AF-R-03 —— Advanced Privacy 处于开启状态 {#af-r-03}

**修复：** RevoSurge tile → Integration → 把 **Advanced Privacy**、以及账户中若显示的 **Aggregated Advanced Privacy** 设为 **OFF**。仅 iOS 应用。

如果这项设置由你的法务或合规团队负责，请在上线前就与他们解决，而不要等到上线当天。

### AF-R-04 —— 点击归因回溯期短于 7 天 {#af-r-04}

**修复：** RevoSurge tile → 归因设置 → 把**点击归因回溯期**设为 **7 天**。

如果你其他合作伙伴使用不同的窗口，请与你的 RevoSurge 客户经理商议，而不要单方面改动——窗口不一致会表现为两边看板之间的差异，而不会报错。

### AF-R-05 —— 默认安装 postback 未开启 {#af-r-05}

**修复：** RevoSurge tile → **Default postbacks** → 开启 **Install**。

顺手也把 **Re-engagement** 开上。发送范围见 [AF-O-02](#af-o-02)。

### AF-R-06 —— 应用内事件 postback 未开启 {#af-r-06}

**修复：** RevoSurge tile → 把**应用内事件 postback** 设为 **ON**，然后映射你的漏斗事件。

AdWave 广告系列会朝一个目标事件优化（注册或充值）。没有应用内 postback，该事件永远不会到达，广告系列也就没有可优化的对象。

### AF-R-07 —— 事件名不匹配 {#af-r-07}

**修复：** RevoSurge tile → 应用内事件 postback 映射 → 把每个 AppsFlyer 事件映射到客户经理给你的准确 RevoSurge 合作方事件名。

匹配是精确且区分大小写的：`deposit` 与 `Deposit` 是两个不同的事件。不匹配不会报错——postback 会被投递，然后因无法识别被丢弃，在你的看板上这与"没有转化"长得一模一样。如果你的 App 从未触发过某个事件，它根本不会出现在映射界面里；请先在你这边解决。

### AF-R-08 —— 收入类事件不带数值 {#af-r-08}

**修复：** RevoSurge tile → 应用内事件 postback 映射 → 对每一个购买、充值或收入类事件，把数值选项设为 **Values & revenue**。

任何带充值、购买或收入目标的广告系列都必需。非金额类事件保持仅数值即可。

### AF-R-09 —— web tracker 未生效 {#af-r-09}

**修复：** 在落地页安装 tracker——见[安装 Web 追踪器](/cn/tracking/web-tracker/install)——并确认 **Manage Product** 中该产品显示 **Active**。

产品在其 tracker 收到第一个事件之前一直是 Inactive，而未激活的产品无法在 AdWave 建广告系列的流程中被选择。还要确认 tracker 在 RevoSurge 流量可能落到的每一个路径上都会触发，而不只是你测试过的那一页。

### AF-R-10 —— 缺少 AppsFlyer App ID {#af-r-10}

**修复：** 在落地页的 web tracker 初始化中填入 `androidAppsFlyerId` 和／或 `iOSAppsFlyerId`——见[点击转发](/cn/mmp/appsflyer/click-forwarding#set-app-id)。

按你实际推广的平台填写；两个字段互相独立。这个故障在两个看板上都是静默的：RevoSurge 有点击，AppsFlyer 把安装记成自然量。

### AF-R-11 —— AdWave 中的 MMP 来源不是 AppsFlyer {#af-r-11}

**修复：** 在 RevoSurge 中打开 AdWave 里的该产品，把 **MMP 来源**设为 **AppsFlyer**。

产品级设置，每个产品设一次。不设置、或设成别的 MMP，落地页上的 App ID 就永远不会被用到。

## 建议项修复方式

### AF-O-01 —— Postback 窗口短于 Lifetime {#af-o-01}

**修复：** RevoSurge tile → 把**应用内事件 postback 窗口**设为 **Lifetime**。如果你的账户无法选择它，下限是 **6 个月**。

### AF-O-02 —— 默认 postback 被限制为仅本合作伙伴 {#af-o-02}

**修复：** RevoSurge tile → **Default postbacks** → 把 **Install** 与 **Re-engagement** 的发送范围设为**所有媒体渠道，包含自然量**（AppsFlyer 的措辞是"归因给任意合作伙伴*或*自然量的事件"）。

把 postback 限制在归因给 RevoSurge 的事件上，等于让我们的模型对着自己的输出做优化，没有未归因与自然量作为基线，也就无法把"我们带来的量"与"本来也会发生的量"区分开。

### AF-O-03 —— 应用内 postback 被限制为仅本合作伙伴 {#af-o-03}

**修复：** 同一界面的应用内事件区域——把**发送范围**设为**所有媒体渠道，包含自然量**。

### AF-O-04 —— 浏览归因未开启 {#af-o-04}

**修复：** RevoSurge tile → 把 **Install view-through attribution** 设为 **ON**，**浏览回溯期**设为 **24 小时**。

RevoSurge **只转发点击**，因此这不会改变你当前 RevoSurge 流量的归因方式。把它放进这一档，是为了之后不必再回来动这个 tile。归因给 RevoSurge 的浏览归因安装应当为**零**——这是预期结果，不是失败。

### AF-O-05 —— RevoSurge 没有聚合数据读取权限 {#af-o-05}

**修复：** RevoSurge tile → **Permissions** → 授予 **Access aggregate conversions**、**in-app events** 与 **revenue**。见[合作伙伴权限](/cn/mmp/appsflyer/permissions)。

没有它，我们只看得到 postback 送来的部分，也就无法区分"真实的归因缺口"和"某个 postback 根本没到"。

### AF-O-06 —— RevoSurge 无法配置该 tile {#af-o-06}

**修复：** RevoSurge tile → **Permissions** → 授予 **Configure integration** 与 **Configure in-app event postbacks**。

### AF-O-07 —— RevoSurge 看不到校验规则 {#af-o-07}

**修复：** RevoSurge tile → **Permissions** → 授予 **View validation rules**。

### AF-O-08 —— RevoSurge 没有 Protect360 访问权限 {#af-o-08}

**修复：** RevoSurge tile → **Permissions** → 授予 **Access Protect360 dashboard and raw data**。仅在你购买了 Protect360 时适用。

## 本页无法检查的两件事

- **真实流量是否端到端跑通。** 以上每条规则都是配置检查。全部通过只能证明配置正确，不能证明一次点击真的产生了安装 postback。那项测试属于"交付与上线"。
- **两边看板之间的数据差异。** 有一部分差异是设计使然——开工单之前请先看[AppsFlyer 与 RevoSurge 对账](/cn/mmp/appsflyer/macros#appsflyer-与-revosurge-对账)。

## 下一步

规则全部通过？继续看[交付与上线](/cn/mmp/appsflyer/handoff)——那一页列出了要交给客户经理什么、用来证明真实流量可用的端到端测试，以及日后哪些改动会静默地把这套配置弄坏。
