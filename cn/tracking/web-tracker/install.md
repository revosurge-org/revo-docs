---
title: 安装 Web 追踪器
description: 分步操作——找到你的追踪器 ID、安装 Web 追踪器脚本、发送事件，并按落地页逐一验证。
---

# 安装 Web 追踪器

**受众：** 广告主与 UA 经理（步骤 1、5–6），开发者与追踪工程师（步骤 2–4）

Web 追踪器是一个轻量级 JavaScript SDK，将事件从你的网站实时传输到
RevoSurge。事件开始流入后，**Registration Funnel** 与 **Source Traffic** 报表就会出现数据，
这些事件也能作为 AdWave 广告系列的优化目标。

收入类模型——LTV、ROAS、预测 LTV、流失以及 Bonus Engine——还需要接入
[S2S](/cn/tracking/s2s/overview)。Web 追踪器是 4 步中的第 2 步。

**完成时间：** 约 30 分钟。

<nav class="article-toc" aria-label="本文内容">
<p class="article-toc-title">本文内容</p>

- [开始前](#before-you-start)
- [步骤 1 — 找到你的追踪器 ID](#step-1-find-your-tracker-id)
- [步骤 2 — 添加追踪器脚本](#step-2-add-the-tracker-script)
- [步骤 3 — 初始化追踪器](#step-3-initialise-the-tracker)
- [步骤 4 — 发送关键事件](#step-4-send-key-events)
- [步骤 5 — 在后台验证](#step-5-verify-in-the-portal)
- [步骤 6 — 正式上线](#step-6-go-live)
- [疑难排查](#troubleshooting)

</nav>

## 开始前 {#before-you-start}

你需要：

- **已为你的域名创建好产品**。如果还没有，请先阅读
  [追踪概述 → 创建你的产品](/cn/tracking/overview#_1-create-your-product)——只需几分钟，
  完成后会分配本指南开头要用到的追踪器 ID。
- 你的网站域名，以及编辑其 `<head>` 的权限——直接修改代码，或通过 Google Tag Manager
  等标签管理器。
- 你的**稳定用户 ID**——你的系统用来标识账户的主键。每次追踪调用都要传入它。
  参见[如何选择用户 ID](#choosing-a-user-id)。

::: info 我该登录哪个后台？
两个都可以。**AdWave**（[adwave.revosurge.com](https://adwave.revosurge.com)）与 **DataPulse**
（[datapulse.revosurge.com](https://datapulse.revosurge.com)）共用同一份产品列表——
在其中一个创建产品，另一个里也会出现。使用右上角的 **Open DataPulse** /
**Open AdWave** 按钮切换。
:::

## 步骤 1 — 找到你的追踪器 ID {#step-1-find-your-tracker-id}

你的产品的**追踪器 ID**（Tracker ID）会填进步骤 3 的代码片段。它形如
`TRA-AWP-20260827-052659-007-3119`——即带 `TRA-` 前缀的产品 ID。

有两个地方可以复制它，两处的值旁边都有复制按钮（⧉）。

### 方式 A — Setup Wizard（最快） {#option-a-—-setup-wizard-fastest}

**Product → Setup Wizard → Step 2 · Setup Web Tracker**

![Setup Wizard step 2 showing the Tracker ID and Tracker Status](/img/tracking/13-dp-webtracker-trackerid.png)

### 方式 B — 产品详情 {#option-b-—-product-detail}

**Product → Manage Product → 点击你的产品名称。** 会打开一个面板，追踪器 ID
位于 **Web Tracker** 卡片中。

![Product detail panel with the Web Tracker card and Tracker ID](/img/tracking/05-product-drawer-tracker-id.png)

该面板还会显示产品 ID、域名、设备类型、支持的充值币种，
以及每个已登记的落地页及其漏斗类型（Funnel Type）。

::: warning 后台不提供可直接复制粘贴的代码片段
后台**只提供追踪器 ID**——你需要按下面的步骤 3 和步骤 4 自行拼装代码片段。
Setup Wizard 中的 **View Integration Guide** 按钮链接回的就是本页。
:::

## 步骤 2 — 添加追踪器脚本 {#step-2-add-the-tracker-script}

将以下代码添加到你要追踪的**每个页面**的 `<head>` 中，并尽量靠前，
使其在任何用户动作发生之前加载完成。

```html
<script src="https://assets.revosurge.com/js/web-tracker.js"></script>
```

::: details 使用 Google Tag Manager？
新建一个包含上述代码片段的 **Custom HTML** 标签，将触发器设为 **All Pages**，
并把 **Tag firing priority** 设为较大的数值，使追踪器在任何事件标签运行之前就绪。
:::

::: details 使用单页应用（React、Vue、Next.js）？
在根文档或根布局中加载一次脚本即可——不要按路由重复加载。只初始化一次
追踪器（步骤 3），并在路由切换时复用同一个实例。
:::

## 步骤 3 — 初始化追踪器 {#step-3-initialise-the-tracker}

在脚本加载完成后初始化一次。把追踪器 ID 替换为你在步骤 1
复制的那个。

```js
const tracker = new WebTracker({
  trackerId: "TRA-AWP-20260827-052659-007-3119",

  // 可选——仅在使用 AppsFlyer 作为 MMP 时配置。
  // 填 AppsFlyer 后台的 App ID，不是包名 / Bundle ID。
  androidAppsFlyerId: "your-android-app-id-in-appsflyer",
  iOSAppsFlyerId: "your-ios-app-id-in-appsflyer"
});
```

| 参数 | 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| `trackerId` | string | 是 | 你的产品的追踪器 ID。 |
| `androidAppsFlyerId` | string | 否 | Android 应用的 **AppsFlyer App ID**（不是包名），在 AppsFlyer 后台该应用的设置中查看。 |
| `iOSAppsFlyerId` | string | 否 | iOS 应用的 **AppsFlyer App ID**（不是 Bundle ID），在 AppsFlyer 后台该应用的设置中查看。 |

你发送的所有数据都按线上生产流量计算——不存在需要切换出来的独立测试
环境。请先在[步骤 5](#step-5-verify-in-the-portal) 验证事件，
再把广告预算投向它们。

::: info 使用 AppsFlyer 作为 MMP？
`androidAppsFlyerId` 与 `iOSAppsFlyerId` 仅在你已接入 AppsFlyer 作为 MMP 时才需要配置，
用于归因 Web 到 App 的用户路径。两者相互独立——有哪个平台就配哪个，
另一个可以省略。若未使用 AppsFlyer，两个都不要传。
:::

::: warning 准确复制追踪器 ID
追踪器 ID 填错时不会有任何报错——脚本照常加载、不出现错误，但也收不到任何事件。
后台的 [Web Tracker Help Center](#_5-3-run-the-diagnostics-if-nothing-arrives) 专门为此提供了
**Tracker ID Match** 检查项。
:::

## 步骤 4 — 发送关键事件 {#step-4-send-key-events}

在对应的用户动作发生时调用相应的追踪方法。将你的**稳定用户 ID**
作为第一个参数传入——唯一的例外是 `trackCustomEvent`，它的第一个参数是事件类型，
且不传用户 ID。

```js
// 创建新账户
tracker.trackRegister("user_123", {
  identifier: "sha256_hash_of_email_or_phone"
});

// 老用户登录
tracker.trackLogin("user_123");

// 充值完成
tracker.trackDeposit("user_123", {
  currency: "USDT",
  network: "TRON",
  amount: 100
});

// 用户进入游戏
tracker.trackEnterGame("user_123", {
  currency: "USDT",
  game_provider: "Evolution",
  game_id: "lightning-roulette",
  game_name: "Lightning Roulette"
});

// 点击 App 下载按钮
tracker.trackDownloadClick("user_123", { store_type: "android" });

// 其他与你业务相关的事件
tracker.trackCustomEvent("mission_complete", { mission_id: "daily_7" });
```

SDK 提供的方法不止这些，但后台的 **Event Stream** 针对每个已登记域名只监控六个
事件——请优先接入这六个：

| 事件 | 触发时机 |
| --- | --- |
| `page_view` | 自动——被追踪的页面加载时 |
| `register` | 创建新账户时 |
| `login` | 已有用户登录时 |
| `deposit` | 在浏览器中完成充值时 |
| `enter_game` | 用户打开游戏时 |
| `download_click` | 点击 App 下载按钮时 |

完整的方法列表与全部字段：[Web 追踪器 SDK 参考](/cn/tracking/web-tracker/reference)。

### 如何选择用户 ID {#choosing-a-user-id}

使用你自己系统中标识该账户的同一个 ID——即用户表的主键。
**不要**使用会话 ID、Cookie ID 或匿名访客 ID。

同一个值必须在你的 [S2S 事件](/cn/tracking/s2s/overview)中作为 `client_user_id` 使用。
两者不一致时，RevoSurge 会把网页活动和服务器活动当作两个不同的人，
归因随之失效。

::: warning 切勿发送原始 PII
`identifier` 请传入用户邮箱或电话的 **SHA-256 哈希**，并在调用前于你侧完成哈希。
不要发送原始邮箱、电话号码或姓名。
:::

## 步骤 5 — 在后台验证 {#step-5-verify-in-the-portal}

部署后，在浏览器中打开一个被追踪的页面。

### 5.1 查看 Event Stream {#_5-1-watch-the-event-stream}

前往 **Product → Setup Wizard → Step 2 · Setup Web Tracker**，或打开产品并
查看 **Web Tracker** 卡片。

每个已登记的域名对应一个区块——你的产品域名加上每个落地页。
每个区块列出六个事件，各带一个状态圆点和“最后出现”时间戳，并汇总
**Receiving** / **Errors** / **Not yet seen** 的数量。每个域名还有一个开关——
关闭的域名不会采集任何数据。

::: info 以六个事件为准，而不是徽章
Setup Wizard 徽章显示的是 **Web Tracker active · n/8**，但后台针对每个已登记域名展示的是**六个**
事件——即上表中的六个。六才是你需要接入和核对的数量。
徽章的分母统计的是别的东西，并不是目标。
:::

![Web Tracker event stream showing events received per domain](/img/tracking/12-dp-webtracker-eventstream.png)

事件通常在一分钟内出现。`page_view` 应当几乎立刻变绿。

### 5.2 检查 Tracker Status {#_5-2-check-tracker-status}

**Tracker Status** 显示在 Web Tracker 卡片的右上角。

| 状态 | 含义 |
| --- | --- |
| **Active** | 事件正在流入 |
| **Inactive** | 近期未收到数据 |

### 5.3 若没有数据，运行诊断 {#_5-3-run-the-diagnostics-if-nothing-arrives}

点击 **Why is there no Web Tracker data?** 打开 **Web Tracker Help Center**。它会
针对你的线上流量运行五项检查，并告诉你哪一项未通过。

![Web Tracker Help Center diagnostic panel](/img/tracking/07-web-tracker-help-center.png)

| 检查项 | 验证内容 | 未通过时 |
| --- | --- | --- |
| **Script Loaded** | 过去 7 天内有任何页面加载了 `web-tracker.js`（来自 `assets.revosurge.com`） | `<script>` 标签缺失、被拦截或放错了页面——重新检查步骤 2 |
| **Tracker Initialized** | 过去 7 天内 WebTracker SDK 已使用追踪器 ID 完成初始化 | `new WebTracker({...})` 没有运行，或在脚本加载前就运行了——重新检查步骤 3 |
| **Tracker ID Match** | 传给 `new WebTracker({...})` 的 `trackerId` 与该产品的 `tracker_id` 一致 | 你粘贴了错误的 ID，或另一个产品的 ID——重新检查步骤 1 |
| **Recent Events Activity** | 过去 24 小时内收到过任意 `trackXxx` 事件（Register / Login / Deposit / EnterGame / DownloadClick / CustomEvent） | 脚本正常，但你的事件调用没有触发——重新检查步骤 4 |
| **Event Status Not Active** | 该产品的 AdWave 事件状态是否为 active | 这是警告，不会阻塞。事件正在流入，但该产品尚未被标记为可用于广告系列——完成 Setup Wizard 的剩余步骤 |

## 步骤 6 — 正式上线 {#step-6-go-live}

当关键事件已在流入、且 Tracker Status 显示为 **Active** 时：

- ✅ 接入 [S2S](/cn/tracking/s2s/overview) 或 [Partner Postback](/cn/tracking/postback/partner-postback)，让充值在服务器端计数
- ✅ 如果你推广移动 App，接入 [AppsFlyer](/cn/mmp/appsflyer/overview)
- ✅ 上线你的第一个 [AdWave 广告系列](/cn/adwave/campaign-setup)

::: warning 不要止步于 Web 追踪器
浏览器上报的充值会少计——广告拦截器、关闭的标签页和支付跳转都会
丢失事件。LTV、ROAS、预测 LTV、流失与 Bonus Engine 都需要
[S2S](/cn/tracking/s2s/overview)。Web 追踪器是 4 步中的第 2 步，而不是终点。
:::

## 疑难排查 {#troubleshooting}

::: details 完全看不到事件
1. 打开浏览器的 **Network** 面板并刷新一个被追踪的页面，查找 `web-tracker.js`
   ——如果没有，说明脚本标签缺失或被拦截。
2. 打开 **Console** 并输入 `WebTracker`。如果是 undefined，说明脚本尚未加载。
3. 确认 `new WebTracker({...})` 在脚本加载**之后**运行。
4. 逐字符核对追踪器 ID 与 **Product → Manage Product →
   [你的产品] → Web Tracker** 中的是否一致。
5. 运行 [Web Tracker Help Center](#_5-3-run-the-diagnostics-if-nothing-arrives)——它会
   告诉你是哪个环节出了问题。
:::

::: details page_view 能收到，但 register / deposit 收不到
脚本和追踪器 ID 都没问题——是你的事件调用没有触发。在每个
`tracker.trackXxx(...)` 调用旁加一行 `console.log`，确认它确实执行了。常见原因是
在页面跳转已经开始后才调用追踪器。
:::

::: details 域名在后台中可见，但开关是关闭的
Web Tracker 卡片中每个已登记域名都有一个开关。关闭的域名
不会采集数据，把它打开即可。
:::

::: details 广告系列无法投放——“Destination URL must match an active domain”
你的广告系列指向的 URL 没有登记在该产品上。请将其添加为 **Landing
Page URL** 并选择正确的漏斗类型（[追踪概述](/cn/tracking/overview#_1-create-your-product)），
在该页面上安装 Web 追踪器，并等待它显示为 active。
:::

::: details 能否从服务器而非浏览器进行追踪？
可以——而且对于收入数据，你应当这样做。参见
[服务器到服务器（S2S）概述](/cn/tracking/s2s/overview)。大多数广告主两者并用。
:::

::: details 我推广的是移动 App——Web 追踪器还重要吗？
重要，而且比你想象的更重要。在步骤 3 中设置 AppsFlyer App ID 后，代码片段会
**把每次广告点击转发给 AppsFlyer**，使安装能归因回我们。没有安装代码片段的
落地页不会转发任何点击，它带来的每一次安装都会被计为
自然量。参见 [AppsFlyer 概述](/cn/mmp/appsflyer/overview)。
:::

## 相关内容 {#related}

- [追踪概述](/cn/tracking/overview) — 四种追踪方式对比
- [Web 追踪器 SDK 参考](/cn/tracking/web-tracker/reference) — 每个方法与字段
- [服务器到服务器（S2S）概述](/cn/tracking/s2s/overview) — 从后端发送事件
- [AppsFlyer 概述](/cn/mmp/appsflyer/overview) — App 安装与应用内事件
- [AdWave 广告系列设置](/cn/adwave/campaign-setup)
