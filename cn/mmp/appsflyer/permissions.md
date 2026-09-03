---
title: 合作伙伴权限
sidebar_label: 合作伙伴权限
description: 应授予 RevoSurge 哪些 AppsFlyer 广告渠道权限，分为运行所需的最小集与建议用于优化的完整集——逐项列出开关名称，而不是截图。
---

# 合作伙伴权限

**受众：** AppsFlyer 账户管理员、代客户运营 RevoSurge 的代理商

权限决定 RevoSurge 在你的 AppsFlyer 账户中**能看到什么、能配置什么**。它们在与 postback 相同的 RevoSurge tile 上授予，按 App 分别设置。

> [!IMPORTANT]
> 无论这里授予什么，postback 都照常传输。权限不会开启或关闭集成——它决定的是 RevoSurge 能否直接**核对并修正**你的配置，还是每一次修正都要以说明和截图的形式绕回你这边。一个没有授予任何权限的正常集成，是一个没人能支持的正常集成。

## 在哪里设置

**Collaborate → Partner Marketplace → RevoSurge tile → Permissions**。

与[配置 postback](/cn/mmp/appsflyer/postbacks) 是同一个 tile，并且和该配置的其余部分一样是**按 App** 的——在 Android 上授予不等于在 iOS 上也授予了。

## 应授予哪些权限

| 权限 | 它让 RevoSurge 能做什么 | 运行所需最小集 | 建议授予 |
|---|---|---|---|
| **Ad network permissions**（主开关） | 本身不提供任何能力——它是下方所有权限的总闸 | 是 | 是 |
| **Access aggregate conversions** | 看到 AppsFlyer 统计的安装，而不只是 postback 送达的那部分 | 是 | 是 |
| **Access aggregate in-app events** | 同上，针对安装后事件 | 是 | 是 |
| **Access aggregate revenue** | 同上，针对收入——核对 ROAS 与你的数字时需要 | 是 | 是 |
| **Configure integration** | 直接修正 tile（漏开的开关、设错的回溯窗口），无需给你发操作说明 | — | 是 |
| **Configure in-app event postbacks** | 随你漏斗的变化修正与扩充事件映射 | — | 是 |
| **View validation rules** | 查看 AppsFlyer 对该集成给出的校验状态，在配置错误造成预算损失之前发现它 | — | 是 |
| **Access Protect360 dashboard and raw data** | 查看哪些安装被 AppsFlyer 判定为欺诈并拦截，以及原因 | — | 是，如果你购买了 Protect360 |

### 为什么读取类权限属于最小集

没有聚合数据访问权限，RevoSurge 只能看到 postback 送来的部分。当你的 AppsFlyer 数字与 RevoSurge 数字不一致时——[两者本来就会有设计层面的差异](/cn/mmp/appsflyer/macros#appsflyer-与-revosurge-对账)——我们无法区分"真实的归因缺口"和"某个 postback 根本没到"。每一次差异都会变成一轮截图往返。

### 如果你有 Protect360，为什么它的访问权限重要

被 Protect360 判定为欺诈并拦截的安装不会以 postback 到达我们这里。没有看板访问权限时，它们与"从未发生过的安装"无法区分——于是 RevoSurge 会继续购买产生它们的流量。有了访问权限，我们能看到拦截原因并切掉该来源。

## 授予 tile 权限，而不是账户席位

请使用 RevoSurge tile 上的权限。**不要**把 RevoSurge 员工邀请为你 AppsFlyer 账户的团队成员，除非某项具体任务确实需要；任务完成后请移除该访问权限。

两者并不等价：

| | tile 权限 | 团队成员席位 |
|---|---|---|
| 范围 | 该 App 上的 RevoSurge 集成 | 你的整个 AppsFlyer 账户 |
| 粒度 | 上表中逐项列出的权限 | 该席位角色允许的一切 |
| 撤销 | 关掉开关 | 移除用户，并指望有人记得这件事 |

tile 权限就是为此设计的机制。账户席位是一次范围更大的授权，而且往往比创建它的理由活得更久。

## 代理商

- **由广告主授予，不是代理商自己授予。** 只有 App 所有者能在 tile 上设置权限。如果你代客户运营 RevoSurge，本页是你要发给客户的东西，而不是你自己去操作的东西。
- **RevoSurge 的点击不携带 `af_prt`。** AppsFlyer 的代理商维度对 RevoSurge 流量不会被填充——见[完整参数集](/cn/mmp/appsflyer/macros#各参数说明)。请在广告主的 AppsFlyer 账户中、或在 RevoSurge 报表中查看 RevoSurge 的效果，而不要指望代理商透明度报表。
- 如果客户期望由你来完成 AppsFlyer 的配置，你仍然需要 tile 上的 **Configure integration** 权限。

## 检查清单

在认为权限配置完成之前，按每个 App 逐项确认：

- [ ] Ad network permissions 已打开
- [ ] 三项聚合数据访问权限均已授予
- [ ] Configure integration 与 Configure in-app event postbacks 已授予，或者你已接受每次修正都要经由你的团队
- [ ] View validation rules 已授予
- [ ] 如果你购买了 Protect360，其访问权限已授予
- [ ] 没有 RevoSurge 员工占用一个本可由 tile 权限覆盖的团队成员席位

## 下一步

- [配置 postback](/cn/mmp/appsflyer/postbacks) 与[点击转发](/cn/mmp/appsflyer/click-forwarding) 是集成的两半配置。
- [集成校验](/cn/mmp/appsflyer/validation)会检查整套配置，权限也在其中（[AF-O-05](/cn/mmp/appsflyer/validation#af-o-05) 至 [AF-O-08](/cn/mmp/appsflyer/validation#af-o-08)）。
