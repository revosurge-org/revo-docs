---
title: 追踪概述
description: 把转化数据发给 RevoSurge 的四种方式 —— Web 追踪器、AppsFlyer、S2S 服务器事件、Partner Postback。60 秒选出适合你的。
---

# 追踪概述

把转化数据发给 RevoSurge 的四种方式。60 秒选出适合你的。

## 哪种方式适合你？ {#decide}

回答两个问题，我们推荐最快的落地路径。

<TrackingMethodPicker lang="cn" />

## 或者按场景选 {#scenarios}

<div class="scenario-grid">
  <a class="scenario-card" href="#partner-postback">
    <div class="scenario-lead">「我用的是 <strong>Affilka / Cellxpert / Smartico / MyAffiliates / NetRefer</strong>，想今天就上线。」</div>
    <div class="scenario-arrow">→ <strong>Partner Postback</strong> · 当天上线 · 无需工程</div>
  </a>
  <a class="scenario-card" href="#s2s">
    <div class="scenario-lead">「我有<strong>自建后台</strong>，也有能对接 API 的工程团队。」</div>
    <div class="scenario-arrow">→ <strong>S2S 服务器事件</strong> · 控制力最强 · 完整 iGaming 事件目录</div>
  </a>
  <a class="scenario-card" href="#appsflyer">
    <div class="scenario-lead">「我在 Play Store 或 App Store 上有<strong>原生 Android / iOS App</strong>。」</div>
    <div class="scenario-arrow">→ <strong>AppsFlyer</strong> · 业界标准的 App MMP</div>
  </a>
  <a class="scenario-card" href="#web-tracker">
    <div class="scenario-lead">「我只有<strong>落地页 + 广告主网站</strong> —— 没有 App，也没有后台 API。」</div>
    <div class="scenario-arrow">→ <strong>Web 追踪器</strong> · 第一方 JS 代码片段</div>
  </a>
</div>

## 四种方式 {#methods}

<div class="method">

### 🌐 Web 追踪器 <Badge type="info" text="网页" /> {#web-tracker}

<p class="method-tagline">装在落地页和广告主网站上的第一方 JS。</p>

用户在网页漏斗中前进时，实时上报转化事件（注册、存款、FTD）。`click_id` 存在有效期一年的第一方 cookie 里 —— 一次点击落地、跳出、三天后回来，这条转化仍然归因得上。

<div class="method-meta">
  <div class="meta-item"><span class="meta-label">适用场景</span>纯网页漏斗，或希望在没有服务端对接的前提下归因网页侧转化</div>
  <div class="meta-item"><span class="meta-label">不适用</span>你的漏斗在移动 App 内</div>
  <div class="meta-item"><span class="meta-label">交付形式</span>JS 代码片段 + GTM 模板（规划中）</div>
  <div class="meta-item"><span class="meta-label">关键机制</span>第一方 cookie，有效期一年，跳出后回访仍可归因</div>
</div>

<a class="method-cta" href="/cn/tracking/web-tracker/install">从 Web 追踪器开始 →</a>
<a class="method-cta-secondary" href="/cn/tracking/web-tracker/reference">查看 SDK 参考</a>

</div>

<div class="method">

### 📱 AppsFlyer <Badge type="tip" text="App MMP" /> {#appsflyer}

<p class="method-tagline">第三方移动归因平台，业界标准。</p>

RevoSurge 作为媒体渠道接入，AppsFlyer 把安装与应用内事件 postback 转发给我们。你在初始化 web 追踪器时于落地页配置 `androidAppsFlyerId` / `iOSAppsFlyerId`，我们会作为合作伙伴卡片出现在你的 AppsFlyer 后台。

Play Store / App Store 分发走 Install Referrer，是确定性归因。APK 与 H5 套壳分发则回退到概率匹配，匹配率明显更低。

<div class="method-meta">
  <div class="meta-item"><span class="meta-label">适用场景</span>任何移动 App —— Play Store、App Store、APK 或 H5 套壳</div>
  <div class="meta-item"><span class="meta-label">不适用</span>你完全没有移动 App（纯网页漏斗）</div>
  <div class="meta-item"><span class="meta-label">交付形式</span>初始化 web 追踪器时在落地页配置 · AppsFlyer 后台的合作伙伴卡片</div>
  <div class="meta-item"><span class="meta-label">归因精度</span>应用商店安装走 Install Referrer 为确定性 · 其余为概率匹配</div>
</div>

<a class="method-cta" href="/cn/mmp/appsflyer/overview">从 AppsFlyer 开始 →</a>
<a class="method-cta-secondary" href="/cn/mmp/appsflyer/validation">集成校验</a>

</div>

<div class="method">

### 🔧 S2S 服务器事件 <Badge type="info" text="S2S" /> {#s2s}

<p class="method-tagline">你的后台直连我们的 S2S API，控制力最强。</p>

服务器到服务器，完全程序化。**分两档，按你想衡量什么来选。** 两档共用同一套鉴权与事件契约，可以先上 Basic，之后增量扩到 Full。

<div class="method-subtier">
  <div class="method-subtier-title">S2S-Basic —— 仅注册 + FTD</div>
  <div class="method-subtier-desc">通过 S2S 通道拿到核心获客指标。REST API 子集（2 个端点）。比 Partner Postback 控制力更强，但尚不含收入与复存追踪。</div>
</div>

<div class="method-subtier">
  <div class="method-subtier-title">S2S-Full —— 完整 iGaming 事件目录</div>
  <div class="method-subtier-desc">包含 Basic 的全部，另加复存、收入事件、跨通道去重与对账。契约要点：never-4xx 设计 · 去重回退链 · 30 天接收窗口 · 运营方的 FTD 主张按 is_claimable 主张收下，不自动裁定为权威。</div>
</div>

<div class="method-meta">
  <div class="meta-item"><span class="meta-label">适用场景</span>自建后台且有工程团队 —— Basic 做获客，Full 做 LTV、去重与收入</div>
  <div class="meta-item"><span class="meta-label">不适用</span>没有工程资源对接 HTTP API</div>
  <div class="meta-item"><span class="meta-label">交付形式</span>REST API（OpenAPI v3 规范规划中）· 可选 PHP / Node SDK · Full 另有对账文件投递</div>
  <div class="meta-item"><span class="meta-label">升级路径</span>Basic → Full 只需改代码：同一套鉴权、同一份契约、字段只增不改，无需重新接入</div>
</div>

<a class="method-cta" href="/cn/tracking/s2s/overview">从 S2S 开始 →</a>
<a class="method-cta-secondary" href="/cn/tracking/s2s/v3/server-events-api">查看 API 参考</a>

</div>

<div class="method">

### 🔗 Partner Postback <Badge type="warning" text="上线最快" /> {#partner-postback}

<p class="method-tagline">把两个 URL 粘到你的联盟平台，今天就能上线。</p>

一个粘贴到你的联盟 / 后台平台的 URL。该平台在注册与 FTD 发生时向我们发送 postback。无需写码、无需工程、无需等待。支持 Affilka、Cellxpert、Smartico、MyAffiliates、NetRefer 以及其他 iGaming 友好的平台。

<div class="method-meta">
  <div class="meta-item"><span class="meta-label">适用场景</span>使用 SaaS 联盟平台，希望零工程、当天完成接入</div>
  <div class="meta-item"><span class="meta-label">不适用</span>需要与 AppsFlyer 做跨通道去重，或需要上报任意应用内事件 —— 请升级到 S2S</div>
  <div class="meta-item"><span class="meta-label">交付形式</span>从我们后台复制两个 postback URL（注册 + FTD）· slug 与密钥自助获取</div>
  <div class="meta-item"><span class="meta-label">归因精度</span>取决于你的联盟平台的宏参数覆盖度</div>
</div>

<a class="method-cta" href="/cn/tracking/postback/partner-postback">从 Partner Postback 开始 →</a>
<a class="method-cta-secondary" href="/cn/tracking/postback/partner-postback#parameters">宏参数说明</a>

</div>

::: warning APK / H5 套壳分发
支持，但走概率匹配 —— 因为没有 Install Referrer，匹配率明显低于 Play Store / App Store 分发。请评估这个匹配率是否满足你的 CPA 目标。
:::

## 完整路由表 {#matrix}

先找到你所在的行（你怎么运营后台），再找到你的列（用户在哪里转化）。

| 后台归属 | 只有网页 | 只有 App | 网页 + App |
|---|---|---|---|
| **自建后台**（有内部工程团队） | **S2S + Web 追踪器**（两个都要）—— S2S 负责发事件，Web 追踪器抓点击侧信号 | **S2S** 为主 · **AppsFlyer** 做安装归因 | **S2S + Web 追踪器 + AppsFlyer**（三个都要）—— S2S 作权威事件流，Web 追踪器抓点击侧，AppsFlyer 做 App 安装 |
| **联盟 / SaaS 平台**（Affilka · Cellxpert · Smartico · MyAffiliates · NetRefer 等） | **Partner Postback** 为主 · **Web 追踪器**抓点击侧信号 | **Partner Postback** + **AppsFlyer** 做安装归因 | **Partner Postback + AppsFlyer**（两个都要）—— Postback 覆盖平台侧，AppsFlyer 处理 App 安装 |
| **尽快上线 · 无需工程** | **Partner Postback**（当天上线） | 只用 **AppsFlyer**（接受 App 侧的缺口） | **Partner Postback + AppsFlyer**（两个都要）—— 先用 Postback 覆盖网页侧，AppsFlyer 做 App 安装 |

**跨方式说明**

- APK / H5 套壳分发通过概率匹配支持 —— 匹配率低于带 Install Referrer 的 Play Store / App Store 分发。
- 30 天归因窗口对所有方式一致生效。
- 当 `click_id` 缺失时，`identifier`（SHA-256 邮箱或手机号）可提升为归因回退关联键。

## 常见问题 {#faq}

::: details 哪种方式最准？
Web 追踪器与 S2S 精度最高，因为它们不依赖第三方匹配。AppsFlyer 是 App 归因的业界标准。Partner Postback 的上限取决于你的联盟平台的宏参数覆盖度。
:::

::: details 同一笔 FTD 我同时通过 AppsFlyer *和*自建后台上报了，会怎样？
两条都会存下来。Integration Health Score 会把冲突暴露出来。跨通道权威源的裁定策略正在敲定 —— 在此之前，请把两个信号视为互补，并检查其中的分歧。
:::

::: details 可以用本地货币（INR / MYR / USDT）发 postback 吗？
可以 —— 我们按公布的汇率换算，你不需要先换成美元。
:::

::: details 时间戳用秒还是毫秒？
我们会自动归一化，但一旦检测到单位存在歧义，你会收到一条响亮的集成告警。请固定使用一种格式。
:::

::: details 有测试模式吗？
有，两种：

- 测试密钥会把数据路由到一条可见的事件流，你可以自助校验，不触碰生产流量。
- 在 S2S 与 postback 端点上加 `dryrun=1`，我们会解析、校验并原样回显将要记录的内容 —— 但不落库。
:::

::: details 怎么知道我的集成是健康的？
每个产品页都有 **Integration Health Score** —— `click_id` 覆盖率、`event_id` 存在率、身份覆盖率、事件到达时的中位时延、建议字段完整度。同时给出一份整改清单，并附上对应的 CPA 差值。
:::

::: details 可以先上 S2S-Basic，之后再升级到 S2S-Full 吗？
可以 —— 这正是设计好的路径。同一套鉴权、同一份事件契约、字段只增不改。升级只需改代码，无需重新接入。
:::

::: details APK / H5 套壳的 App 支持吗？
支持，走概率匹配。因为没有 Install Referrer，匹配率明显低于 Play Store / App Store 分发。请把这部分精度损失计入你的 CPA 目标。
:::

## 开始接入 {#getting-started}

1. 回答本页顶部的两个问题，或在完整路由表中找到你所在的行。
2. 打开对应的方式页面：[Web 追踪器](/cn/tracking/web-tracker) · [AppsFlyer](/cn/mmp/appsflyer/overview) · [S2S 服务器事件](/cn/tracking/s2s/overview) · [Partner Postback](/cn/tracking/postback/partner-postback)。
3. 想最快上线，就从 **Partner Postback**（SaaS 后台）或 **S2S-Basic**（自建后台）起步 —— 等需要收入信号时再扩到 S2S-Full。

<div class="bottom-cta" id="support">
  <div>
    <div class="bottom-cta-title">还是拿不准该用哪种？</div>
    <div class="bottom-cta-text">联系你的 RevoSurge BD 对接人，我们会帮你选型并协助上线。</div>
  </div>
</div>
