---
title: 服务器到服务器 (S2S) 概述
description: S2S 分两档——Basic 覆盖注册与首充，Full 覆盖完整目录。如何选择档位、生成 API Key 并上线。
---

# 服务器到服务器 (S2S) 概述

**受众：** 选择档位的广告主与 UA 经理（第 1–4 节）、负责实施的开发者（第 5–8 节）

服务器到服务器 (S2S) 追踪直接从**你的后端**向 RevoSurge 发送事件——
全程不经过浏览器。这是让已确认的转化与收入完整送达我们的方式。

<nav class="article-toc" aria-label="本文内容">
<p class="article-toc-title">本文内容</p>

- [1. S2S 是什么，为什么重要](#_1-what-s2s-is-and-why-it-matters)
- [2. 两个档位：Basic 与 Full](#_2-two-tiers-basic-and-full)
- [3. 我需要哪个档位？](#_3-which-tier-do-i-need)
- [4. S2S vs Web 追踪器](#_4-s2s-vs-web-tracker)
- [5. 后台设置——生成 API Key](#_5-portal-setup-generate-your-api-key)
- [6. 在后台中验证](#_6-verify-in-the-portal)
- [7. 事件目录](#_7-the-event-catalog)
- [8. API 版本](#_8-api-versions)
- [后续步骤](#next-steps)

</nav>

## 1. S2S 是什么，为什么重要 {#_1-what-s2s-is-and-why-it-matters}

Web 追踪器运行在访客的浏览器中。要了解*用户从哪里来*，那里是对的地方；但要了解*用户花了多少钱*，
那里就是错的地方。

浏览器事件会丢失。广告拦截器会过滤掉它们，浏览器的防追踪机制会丢弃它们，
用户还会在支付服务商跳转回来的途中关闭标签页。在典型的 iGaming 网站上，
浏览器上报的充值中有相当一部分根本不会送达。

你的后端没有这种问题。当支付服务商确认一笔充值时，这是你的服务器确定掌握的
事实。S2S 就是你把这份确定性交给我们的方式。

**以下情况使用 S2S：**

- 充值、提现，以及任何附带金额的事件
- 由后端而非浏览器确认的事件——KYC、账户状态、奖金
- 任何准确性比便利性更重要的事件

::: info S2S 不能替代 Web 追踪器
Web 追踪器知道广告点击；你的后端知道钱。RevoSurge 通过你的用户 ID 将两者
合并为同一个用户档案。大多数广告主两者同时使用——参见
[追踪概述](/cn/tracking/overview)。
:::

## 2. 两个档位：Basic 与 Full {#_2-two-tiers-basic-and-full}

S2S 分为两个档位。它们**不是两个产品，也不是两个端点**——相同的 URL、
相同的 API Key、相同的信封、相同的校验。档位描述的是**你发送了事件目录中的多少事件**，
进而决定我们能针对什么进行优化。

| | **Basic** | **Full** |
| --- | --- | --- |
| **你发送的事件** | 2 个必填、2 个建议 | 完整目录——24 个事件 |
| **必填** | `register` · `deposit` | Basic 的全部事件，加上目录中的其余事件 |
| **建议** | `login` · `deposit_initiated` | — |
| **可统计的内容** | 注册、首充 | 玩家生命周期的每个阶段 |
| **可出价优化的目标** | 注册、首充、充值金额 | Basic 的全部目标，加上玩家价值——GGR 与 LTV |
| **解锁功能** | Registration Funnel · FTD 报表 · 基于充值的 ROAS | Basic 的全部功能，加上 **预测 LTV · 流失 · Bonus Engine** |
| **需要金额吗？** | 需要——`deposit` 始终要求 `context.amount` 和 `context.currency` | 需要，另外还需你发送的其他每个事件的必填字段 |
| **典型开发周期** | 约 2–3 天 | 约 3–5 天 |
| **适合** | 希望尽快摆脱浏览器上报收入 | 按玩家价值出价的运营商 |

### Basic 覆盖的内容 {#what-basic-covers}

四个事件，其中两个必填：

| 事件 | 状态 | 原因 |
| --- | --- | --- |
| `register` | **必填** | 在服务器端统计注册，不会被拦截 |
| `deposit` | **必填** | 统计充值。必须携带 `context.transaction_id`、`context.amount` 和 `context.currency` |
| `login` | 建议 | 区分回访玩家与新玩家 |
| `deposit_initiated` | 建议 | 已发起但未结算的充值——显示玩家在收银台的哪一步流失 |

由于 `deposit` 按定义就携带 `context.amount` 和 `context.currency`，Basic 给你的是
**充值金额**，而不只是充值次数——ROAS 随档位自带，而不是额外的一步。

::: info 首充如何统计
S2S 中没有首充事件，也没有首充标志。你把每一笔充值都作为
`deposit` 发送，RevoSurge 将 FTD 判定为**我们收到的该用户最早的一笔 `deposit`**。

因此你无需自己对充值进行分类——但如果你已有存量玩家，请参阅下方的警告。

`/first-deposit` 与 `/repeat-deposit` 的区分属于
[Partner Postback](/cn/tracking/postback/partner-postback)，那是另一套 API。如果你两者都在用，
请告知你的客户经理，以免两者被统计为各自独立的首充。
:::

::: warning 如果你已有存量玩家，第一周的 FTD 会虚高
FTD 是**我们看到的**最早一笔充值，而不是实际存在的最早一笔充值。在你
开启 S2S 的当天，一位存量玩家的下一笔充值是我们为其收到的第一笔——
因此会被计为首充。

拥有大量存量用户的运营商会在第一周看到一个 FTD 峰值，但那并非真实的
获客。有两种处理方式：

- **先回填。** 在上线前通过 `/v3/s2s/batch` 发送你的历史充值，
  让真正的首充已经在记录中。
- **或与客户经理约定一个截止时间点**，在首个报表周期内剔除已知玩家的
  FTD。

请在启动以 FTD 为优化目标的广告系列**之前**决定采用哪种方式——否则出价会去追逐这个
峰值。
:::

### Full 增加的内容 {#what-full-adds}

目录中的其余事件——验证、账户状态、提现、投注以及完整的奖金
生命周期。每个事件名称参见 [7. 事件目录](#_7-the-event-catalog)。

`bet` 是最重要的一个：**它是唯一携带玩家价值的事件**，且其他
追踪方式都无法发送它。没有 `bet`，预测 LTV 和流失模型就没有可建模的
数据。

::: info 从 Basic 升级到 Full 没有任何成本
无需迁移，也没有开关要切换。你发送更多事件，它们就开始送达。已统计的
事件不受影响。
:::

## 3. 我需要哪个档位？ {#_3-which-tier-do-i-need}

由你的广告系列目标决定。

| 优化目标 | 档位 |
| --- | --- |
| 仅注册 | 都不需要——Web 追踪器即可覆盖 |
| 首充 | **Basic**（如果你没有研发资源，也可用 [Partner Postback](/cn/tracking/postback/partner-postback)） |
| 充值金额 | **Basic**——`deposit` 要求携带金额，因此已包含在内 |
| 玩家价值——GGR、LTV | **Full** |

::: tip 从 Basic 开始
两个事件就能让你摆脱浏览器上报的收入，这是目前能获得的最大一项准确性提升。
上线后再补齐其余事件——目录不会消失。
:::

## 4. S2S vs Web 追踪器 {#_4-s2s-vs-web-tracker}

| | Web 追踪器 | S2S |
| --- | --- | --- |
| **运行位置** | 访客的浏览器 | 你的后端 |
| **实施方** | Web／前端团队 | 后端团队 |
| **原生获取广告归因** | 是 | 仅当你传入 `click_id` 时 |
| **会被广告拦截器拦截** | 可能 | 否 |
| **收入数据的权威来源** | 否 | 是 |
| **典型事件** | `page_view`、`register`、`login`、`deposit`、`enter_game` | 标准 + iGaming 预设共 24 个事件 |
| **凭证** | 追踪器 ID（`TRA-AWP-…`） | API Key（`rs-…`） |
| **设置工作量** | 约 45 分钟 | 约 1–2 天 |

### S2S 解锁的功能 {#what-s2s-unlocks}

开启 S2S 是后台设置向导 (Setup Wizard) 的第 3 步。它会解锁需要
可靠收入数据的模型：

| 功能 | 作用 | 档位 |
| --- | --- | --- |
| **Registration Funnel** | 在服务器端统计注册 | Basic |
| **FTD 报表** | 首充玩家，在充值实际结算处统计 | Basic |
| **ROAS** | 基于已确认收入的广告支出回报率 | Basic |
| **LTV** | 按用户、来源和广告系列计算的真实生命周期价值 | Full |
| **pLTV** | 预测生命周期价值——及早预测玩家价值 | Full |
| **流失（Churn）** | 流失风险评分 | Full |
| **Bonus Engine** | 由真实充值与奖金行为驱动的奖金定向 | Full |

没有 S2S，这些功能将保持关闭，AdWave 的自动出价也只能基于
不完整的转化数据进行优化。

## 5. 后台设置——生成 API Key {#_5-portal-setup-generate-your-api-key}

### 5.1 前提条件 {#_5-1-prerequisites}

- ✅ 已为你的域名创建**产品**——参见
  [追踪概述 → 创建你的产品](/cn/tracking/overview#_1-create-your-product)
- ✅ 可在后台访问 **Product**（Admin/Master，或具有 Product 权限的角色）
- ✅ 能够发起出站 HTTPS POST 请求的后端
- ✅ **已为你的产品启用 iGaming 预设**（如果你要发送 `deposit` 或任何其他
  iGaming 事件）——请与你的客户经理确认（参见
  [7. 事件目录](#_7-the-event-catalog)）

### 5.2 打开 S2S 面板 {#_5-2-open-the-s2s-panel}

登录 **[AdWave](https://adwave.revosurge.com/product)** 或
**[DataPulse](https://datapulse.revosurge.com/product)**，进入 **Product**。有
两个入口可以进入 S2S 设置——显示的内容相同：

- **Setup Wizard → Step 3 · S2S Postback**，或
- **Manage Product → 点击你的产品名称 → S2S** 卡片

生成密钥之前，面板显示 **API Key: No API key yet** 和
**S2S Status: Pending**。

![S2S Postback step in the Setup Wizard before an API key exists](/img/tracking/06-wizard-step3-s2s.png)

### 5.3 生成 API Key {#_5-3-generate-the-api-key}

点击 **Generate API Key**。

密钥会立即签发并以掩码形式显示——`rs-i●●●●●●●●`——旁边有一个复制按钮（⧉）。
请立即复制并保存到你的密钥管理系统中。

![S2S panel with an active API key and S2S Status Active](/img/tracking/11-dp-s2s-active.png)

你也可以在 **Manage Product** 表格中生成密钥：没有密钥时 **API Key** 列显示
`--`，点击该行的操作按钮即可生成。签发后，该列会
显示有效密钥的数量（例如 **1 Active**）。

::: warning 像对待密码一样对待 API Key
它用于认证对你账户数据的写入。请在服务器端将其保存在密钥管理系统中。
**切勿**将其放入前端代码、移动应用安装包、标签管理器或公开代码仓库。
生成新密钥不会自动吊销旧密钥——请有计划地进行轮换。
:::

### 5.4 从后端发送事件 {#_5-4-send-events-from-your-backend}

| | |
| --- | --- |
| **Base host** | `https://datapulse-api.revosurge.com` |
| **端点** | `/v3/s2s/event`（单条） · `/v3/s2s/batch`（批量） |
| **方法** | `POST` |
| **认证请求头** | `X-API-Key: <your key>` |
| **速率限制** | 每个 API Key 每分钟 60 次请求 |

每个事件至少需要：

| 字段 | 原因 |
| --- | --- |
| `identity.client_user_id` | 你的稳定账户 ID——**必须与**你传给 Web 追踪器的 `user_id` **一致** |
| `identity.click_id` | RevoSurge 点击标识符。事件要归因到广告系列就必须携带——凡是你捕获到了点击 ID 的用户，都要发送。自然流量用户不会有。 |
| `event` | 目录中的哪个事件 |
| `timestamp` | 事件发生时间，Unix **毫秒**（13 位） |
| `context.ip_address` | 用户的 IP，用于地理与反作弊信号 |

当 API 返回 `400` 时，最常缺失的就是这五个字段。

完整的请求／响应结构、字段类型及各事件的载荷：
[服务器事件 API (v3)](/cn/tracking/s2s/v3/server-events-api)。

::: warning 使用与 Web 追踪器相同的用户 ID
S2S 中的 `client_user_id` 必须与 Web 追踪器中的 `user_id` 完全相同。如果
两者不同，RevoSurge 会将其视为两个不同的用户，归因随之失效。这是
最常见的 S2S 集成错误。
:::

::: info click_id 从哪里来？
Web 追踪器会从落地页 URL 中保存它，并通过 `getClickid()` 提供。请在注册时
获取它，在你的数据库中与该账户关联保存，并随该用户的每个
S2S 事件一起发送。参见
[Web 追踪器 SDK 参考](/cn/tracking/web-tracker/reference)。
:::

## 6. 在后台中验证 {#_6-verify-in-the-portal}

回到 **Product → Setup Wizard → Step 3 · S2S Postback**。

- 一旦我们收到一个有效且已认证的事件，**S2S Status** 就会从 **Pending** 变为 **Active**。
- **Event Stream** 栏会显示最近一个事件的名称、用户 ID 和时间戳。
- 每个预设都会显示 **Receiving** / **Errors** / **Not yet seen** 的计数，目录中的每个事件
  都会显示最近一次收到的时间。
- 步骤徽标会从 **Waiting for first S2S event** 变为 **S2S Postback active · n/23**。

### 如果没有收到任何事件 {#if-nothing-arrives}

点击 **Why are S2S events not flowing?** 打开 **S2S Help Center**。它会针对你过去 24 小时的流量
运行六项检查。

![S2S Help Center diagnostic panel](/img/tracking/08-s2s-help-center.png)

| 检查项 | 检查内容 | 未通过时 |
| --- | --- | --- |
| **X-API-Key Authenticated** | 认证成功（200）与返回 401 的 `X-API-Key` 请求占比 | 密钥错误或已被吊销，或请求头名称不完全是 `X-API-Key` |
| **Recent POST Activity** | 是否有 POST 请求到达 `/v2/s2s/event` 或 `/v2/s2s/batch` | 你的后端没有调用该端点——检查出站防火墙规则和 URL |
| **Schema Errors (400)** | 因结构错误被拒绝的请求占比——并列出最常缺失的字段 | 补上缺失字段。最常见的是 `client_user_id`、`click_id`、`event_name`、`timestamp` 或 `ip_address` |
| **Rate Limit Hits (429)** | 429 的占比——上限为每个 API Key 60 RPM | 通过 `/v2/s2s/batch` 批量发送事件，并加入带退避的重试 |
| **Server Errors (5xx)** | 以 5xx 失败的请求占比 | 我方的临时问题——使用指数退避重试。持续出现 5xx：请联系支持团队 |
| **Event Status Not Active** | 该产品在 AdWave 中的事件状态是否为激活 | 这是警告而非阻断——事件正在送达，但该产品尚未被标记为可用于广告系列 |

## 7. 事件目录 {#_7-the-event-catalog}

两个预设共 24 个事件。每个事件在后台中显示为 *Receiving*、*Errors* 或
*Not yet seen*。

::: warning 必须为你的产品启用 iGaming 预设
**标准**预设（9 个事件）对每个产品自动启用。**iGaming** 预设（15 个事件）由 RevoSurge 应要求
按产品启用。

`deposit` 是 iGaming 事件。在该预设启用之前，你发送的每一笔充值都会被拒绝并返回
`422 EVENT_DISABLED`，无论你的集成多么正确——而且这不是
你能在代码里修复的问题。

**开始开发之前，请先让你的客户经理确认 iGaming 已启用。**
:::

**⭑ 标记的是四个 [Basic](#_2-two-tiers-basic-and-full) 事件。** 其余均属于 Full。

### 标准预设（9 个事件） {#standard-preset-9-events}

| 分组 | 事件 |
| --- | --- |
| 用户生命周期 | **⭑ `register`** · ⭑ `login` |
| 验证与授权 | `email_verified`, `phone_verified`, `marketing_consent_updated` |
| 应用生命周期 | `app_install`, `app_open`, `app_uninstall`, `push_permission_updated` |

### iGaming 预设（15 个事件） {#igaming-preset-15-events}

| 分组 | 事件 |
| --- | --- |
| 用户生命周期 | `session_ended`, `vip_tier_changed` |
| 验证与授权 | `kyc_completed`, `kyc_rejected`, `account_blocked`, `account_unblocked` |
| 资金 | ⭑ `deposit_initiated` · **⭑ `deposit`** · `deposit_failed`, `withdraw` |
| 游戏 | `bet` |
| 奖金生命周期 | `bonus_offered`, `bonus_claimed`, `bonus_completed`, `bonus_cashed_out` |

::: warning 后台事件网格显示的数量比目录接受的少一个
设置向导目前列出 14 个 iGaming 事件，并显示 `n/23`。`deposit_initiated`
已被 API 接受且有完整规范——只是尚未绘制在该网格中。照常发送即可，
它会被存储。其字段参见 [iGaming 事件](/cn/tracking/s2s/v3/events-igaming)。
:::

**关于 `deposit_initiated`**——玩家已发起但尚未结算的充值。它能告诉
你玩家在收银台的哪一步流失。`context.transaction_id` 为**必填**，且必须
与后续 `deposit` 或 `deposit_failed` 上的 `transaction_id` 一致，这样才能将这次尝试与其
结果关联起来。

::: tip 添加事件的顺序
从四个 Basic 事件开始。然后是 `withdraw` 和 `bet`——这两个事件让你从 ROAS 走向
真实的玩家价值。验证类和奖金类事件放在最后；它们能让预测 LTV、流失模型和
Bonus Engine 更精准，但起步阶段没有任何功能依赖它们。
:::

每个事件的字段级定义：
[标准事件](/cn/tracking/s2s/v3/events-standard) · [iGaming 事件](/cn/tracking/s2s/v3/events-igaming)

## 8. API 版本 {#_8-api-versions}

| 版本 | 状态 | 时间戳格式 |
| --- | --- | --- |
| **v3** | 当前版本——所有集成均使用此版本 | Unix **毫秒** |
| **v2** | 将于 2026 年 10 月 18 日弃用 | Unix **秒** |

新集成请从 **v3** 开始。如果你正在使用 v2，请参阅
[从 v2 迁移](/cn/tracking/s2s/v3/migration)。

::: tip 确认你已上线
S2S 卡片中的 **Event Stream** 栏和各事件的 *last seen* 时间戳读取的是
我们实际存储的事件。无论使用哪个版本，它们都是确认你的集成
正常工作的权威依据。
:::

## 后续步骤 {#next-steps}

- [服务器事件 API (v3)](/cn/tracking/s2s/v3/server-events-api)——端点、结构、示例
- [信封与基础属性](/cn/tracking/s2s/v3/mandatory-properties)——每个事件都带有的字段
- [目录与校验](/cn/tracking/s2s/v3/catalog-governance)——事件如何被校验
- [标准事件](/cn/tracking/s2s/v3/events-standard) · [iGaming 事件](/cn/tracking/s2s/v3/events-igaming)
- [从 v2 迁移](/cn/tracking/s2s/v3/migration)

## 相关内容 {#related}

- [追踪概述](/cn/tracking/overview)——四种追踪方式对比
- [安装 Web 追踪器](/cn/tracking/web-tracker/install)——浏览器端的另一半
- [合作方 Postback API](/cn/tracking/postback/partner-postback)——来自联盟与 MMP 的转化
