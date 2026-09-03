---
title: 将点击转发至 AppsFlyer
sidebar_label: 点击转发
description: RevoSurge 会替你把点击注册到 AppsFlyer。在落地页安装 web tracker 并填入 AppsFlyer App ID，然后在 AdWave 的产品上选择 AppsFlyer 作为 MMP 来源。
---

# 将点击转发至 AppsFlyer

**受众：** UA 经理、广告主、负责落地页集成的前端开发

Postback 负责把转化**回传**给 RevoSurge。本页负责另一个方向：告诉 AppsFlyer 哪些点击是我们带来的，让随后的安装能归因给 RevoSurge。

> [!IMPORTANT]
> **你不需要为 RevoSurge 生成 AppsFlyer 追踪链接。** 既不用在 AppsFlyer 里生成链接，也不用把任何 URL 粘贴到 RevoSurge。RevoSurge 会自动把点击转发给 AppsFlyer，依据的是你在落地页安装 web tracker 时填入的 AppsFlyer App ID。如果你的团队集成过其他 DSP，这一步就是差异所在。

## 工作原理

```
用户点击 RevoSurge 广告
        ↓
你的落地页加载
        ↓
Web tracker 触发，携带你的 AppsFlyer App ID
        ↓
RevoSurge 将点击转发至 AppsFlyer
        ↓
AppsFlyer 把随后的安装归因给 RevoSurge
```

有两个后果值得多看一遍：

- **落地页是承重环节。** 点击是通过该页上的 web tracker 到达 AppsFlyer 的。任何没有跑 tracker 的流量路径——直接跳应用商店页、跳过落地页的重定向、tracker 加载失败的页面——都不会产生转发的点击，随后的安装会落成自然量或被归因给别人。
- **只转发点击。** RevoSurge 目前不向 AppsFlyer 转发展示（impression）。RevoSurge 流量的归因是基于点击的。

## 你需要做三件事

每个产品各做一次。

### 1. 在落地页安装 web tracker

按[安装 Web 追踪器](/cn/tracking/web-tracker/install)操作。你的产品必须达到 **Active（已激活）** 状态——产品在其 tracker 收到第一个事件之前一直是 Inactive，而未激活的产品无法在 AdWave 建广告系列的流程中被选择。

### 2. 在 tracker 中填入 AppsFlyer App ID {#set-app-id}

在 tracker 的初始化选项里，为你要推广的每个平台传入 AppsFlyer App ID：

```js
const tracker = new WebTracker({
  trackerId: "your-product's-tracker-id",

  // AppsFlyer 点击转发必需——按你推广的平台填写。
  androidAppsFlyerId: "your-android-app-id-in-appsflyer",
  iOSAppsFlyerId: "your-ios-app-id-in-appsflyer"
});
```

| 字段 | 什么时候要填 |
|---|---|
| `androidAppsFlyerId` | 你推广 Android 应用 |
| `iOSAppsFlyerId` | 你推广 iOS 应用 |

两者互相独立——填你实际在跑的平台，另一个省略即可。请使用 AppsFlyer 后台该应用设置中显示的 App ID 原样填写；字段细节见[安装页的初始化选项](/cn/tracking/web-tracker/install#step-3-initialize-the-tracker)。

> [!WARNING]
> 不填 App ID，web tracker 依然工作，你的 RevoSurge 事件也照旧到达——但不会有任何东西转发给 AppsFlyer，AppsFlyer 永远不知道这次点击发生过。这个故障在两个看板上都是静默的：RevoSurge 有点击，AppsFlyer 把安装记成自然量。如果你的安装量在 RevoSurge 看起来正常、在 AppsFlyer 却没有，先查这个字段。

### 3. 在 AdWave 中选择 AppsFlyer 作为 MMP 来源

在 RevoSurge 中打开 AdWave 里的**产品**，把 **MMP 来源**设为 **AppsFlyer**。

这是**产品级**设置——每个产品设一次，不是每条广告系列都设。它告诉 RevoSurge 该把点击转发给哪个 MMP。不设置、或设成别的 MMP，落地页上的 App ID 就永远不会被用到。

## 验证

上线之前，请端到端验证整条链路，而不是逐个环节分开看：

1. 打开你的落地页，确认 tracker 已触发（**Manage Product** 中该产品显示 **Active**）。
2. 确认该产品的 MMP 来源显示为 **AppsFlyer**。
3. 点击一条线上或测试的 RevoSurge 广告，进入落地页，然后安装 App。
4. 确认这次安装在 AppsFlyer 中归因到 RevoSurge 媒体渠道——而不是自然量。
5. 确认安装 postback 已到达 RevoSurge。

第 3–5 步才是真正的测试。第 1–2 步只能证明配置存在。

## 从其他 DSP 迁过来？

如果你的团队集成过 Moloco、Remerge、Kayzen 之类的平台，以下这些步骤在 RevoSurge **不适用**：

| 在别处 | 在 RevoSurge |
|---|---|
| UA 生成单平台链接，再营销生成 OneLink | 无链接可生成——同一套机制覆盖两者 |
| 把追踪链接宏映射到 DSP 的参数 | 无需映射；点击由 RevoSurge 构造——具体内容见[宏参数](/cn/mmp/appsflyer/macros) |
| 把点击与展示 URL 复制进 DSP | 无需复制 |
| 改动广告系列后重新注册链接 | 无需重新注册；产品级设置一直有效 |

你仍然需要在 AppsFlyer 侧完成合作伙伴配置本身——见[配置 postback](/cn/mmp/appsflyer/postbacks)，回溯窗口也在那一页。

## 下一步

- 需要知道我们在点击上具体发送了什么，或者要把 AppsFlyer 与 RevoSurge 看板对账？见[宏参数](/cn/mmp/appsflyer/macros)。
- AppsFlyer 后台还没弄完？[配置 postback](/cn/mmp/appsflyer/postbacks) 是集成的另一半，只做一半集成不会工作。
- 两半都做完了？先[集成校验](/cn/mmp/appsflyer/validation)，再[交付与上线](/cn/mmp/appsflyer/handoff)。
- 要在 iOS 上线？没有额外步骤——RevoSurge 不使用 SKAN，iOS 与 Android 走的是同样这两页。
- 再营销广告与 deep link 不在以上步骤的覆盖范围内。上线此类广告前请先联系你的 RevoSurge 客户经理。
