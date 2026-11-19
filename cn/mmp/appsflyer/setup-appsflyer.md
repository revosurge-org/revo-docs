---
title: 设置并验证 AppsFlyer
description: 上线前完成 AppsFlyer 和 AdWave 配置，上线后用真实流量验证归因和回传。
---

# 设置并验证 AppsFlyer

上线前配置 AppsFlyer 和落地页追踪器。AppsFlyer 的 IP 白名单限制了本集成的上线前手动端到端测试。先完成配置检查，待广告系列产生真实流量后再验证归因和回传。

## 1. 配置 AppsFlyer {#_1-configure-appsflyer}

### 核对归因设置 {#confirm-attribution-settings-before-setup}

在目标应用打开 **Settings → App Settings**。更改 **Enable view-through attribution via probabilistic modeling** 前，先向应用负责人和客户经理确认合适的设置。RevoSurge 的接入流程只转发点击。

![应用级归因设置](/img/handbook/wizard-v4/ss03-attribution-settings.png)

### 查找并激活合作伙伴 {#_1-partner-integrations}

1. 打开 **Collaborate → Partner Integrations → Marketplace**。
2. 选择应用和平台，搜索 **RevoSurge**。
3. 找到客户经理确认的 PID 后，选择 **Integrate**。
4. 将 **Activate partner** 设为 ON，启用归因和回传。

![在 Marketplace 查找 RevoSurge](/img/handbook/wizard-v4/ss01-marketplace.png)

![启用 Activate partner](/img/handbook/wizard-v4/ss04-activation.png)

### 核对安装回传 {#_3-check-default-install-postbacks}

在 **Default postbacks** 核对 **Install** 和 **for users from**。示例的 **This partner only** 为只读，实际应用和 PID 支持的发送范围由客户经理确认。

![默认安装回传及发送范围](/img/handbook/wizard-v4/ss05-install-postback.png)

### 启用并映射应用内事件 {#_4-enable-in-app-event-postbacks}

启用 **In-app event postbacks**。窗口选择 **Lifetime**，不可用时至少选择六个月。点击 **Add event**，按下列规则填写每个事件。

![应用内事件回传窗口](/img/handbook/wizard-v4/ss07-lifetime.png)

![新增事件按钮](/img/handbook/wizard-v4/ss08-add-event.png)

![事件映射的四个字段](/img/handbook/wizard-v4/ss09-blank-mapping.png)

| 字段 | 填写方式 |
| --- | --- |
| **AppsFlyer event** | 选择应用已记录的事件。缺少事件时核对应用、拼写和接收情况 |
| **mapped to partner event** | 使用约定的目标事件名，保持大小写一致 |
| **for users from** | 使用约定的发送范围。**This partner only** 转发归因给 RevoSurge 的事件 |
| **including** | 收入事件选择 **Values & revenue**，并确认来源含金额与币种 |

选择 **Save Integration** 保存映射。再打开 **Permissions**，按应用负责人已批准的范围授权。权限与回传发送设置分别管理。

![权限标签及开关](/img/handbook/wizard-v4/ss13-permission-tab.png)

![合作伙伴权限选项](/img/handbook/wizard-v4/partner-permission-options.png)

## 2. 连接 RevoSurge {#_2-connect-revosurge}

### 注册应用 {#_1-register-your-app}

1. 在目标应用产品选择 **Choose your setup → AppsFlyer → Use this setup**。
2. 打开 **Verify Your Source → AppsFlyer → Manage mappings**。
3. 输入准确的 AppsFlyer App ID，选择 **Register app** 并启用集成。注册后此处无法修改 ID。

![AppsFlyer 应用注册表单](/img/handbook/wizard-v4/appsflyer-app-registration.png)

### 映射事件 {#_2-map-your-events}

核对显示的 **RevoSurge PID**。**Apply mappings to** 默认为 **All apps**。选择适用范围，为各 RevoSurge 事件输入准确的 AppsFlyer 事件名，然后保存。

![PID 和映射范围](/img/handbook/wizard-v4/appsflyer-configuration-scope.png)

![事件映射表](/img/handbook/wizard-v4/appsflyer-event-mappings.png)

### 连接落地页追踪器 {#_3-connect-the-landing-page-tracker}

按[安装 Web 追踪器](/cn/tracking/web-tracker/install)完成配置，填写产品的 Tracker ID 和投放平台的 AppsFlyer App ID。

```js
const tracker = new WebTracker({
  trackerId: "your-product-tracker-id",
  androidAppsFlyerId: "your-android-appsflyer-id",
  iOSAppsFlyerId: "your-ios-appsflyer-id"
});
```

在真实落地页检查追踪器是否加载。此流程由追踪器转发点击，无需单独生成 AppsFlyer 跟踪链接。

## 3. 上线前检查 {#_3-check-before-launch}

确认应用、平台、产品、PID、合作伙伴激活状态、安装回传、事件映射、发送范围和窗口。对收入事件确认金额、币种及 **Values & revenue**。同时明确广告系列目标和上线后验收负责人。配置保存后，仍需用真实投放数据验证归因与回传。

## 4. 广告系列上线后验证 {#_4-verify-after-campaign-launch}

在 AdWave 打开 **Verify Your Source → Live**，检查 AppsFlyer 卡片的 **Received events**，再通过 **View event stream** 核对实际回传。

| 检查项 | 证据 |
| --- | --- |
| 广告系列点击 | RevoSurge 中有对应点击，落地路径符合预期 |
| 安装归因 | AppsFlyer 把真实安装归给确认的 RevoSurge PID 与广告系列 |
| 安装回传 | RevoSurge 收到对应安装回传 |
| 目标事件 | 实际动作按正确映射到达 AppsFlyer 和 RevoSurge |
| 收入 | 金额和币种与来源记录一致 |

尚无符合条件的安装或目标事件时，标记为待验证。事件发生后再调查未收到或不一致的记录。与客户经理约定检查时间。

### 排查问题 {#if-a-check-fails}

| 现象 | 优先检查 |
| --- | --- |
| RevoSurge 有点击，AppsFlyer 记为自然安装 | 追踪器路径、平台 App ID、AdWave MMP 来源和归因设置 |
| AppsFlyer 已归因，RevoSurge 未收到安装 | PID、激活状态、默认安装回传和发送限制 |
| 收到安装但缺少目标事件 | 源事件是否到达、回传开关、准确的映射名称 |
| 收到事件但缺少金额 | 来源金额和币种、**Values & revenue** |
| iOS 与预期不同 | 和应用负责人核对 iOS 归因及隐私设置 |
| 报表不一致 | 对齐应用、PID、时间段、时区、窗口、发送范围和各级 ID |

应用、平台、映射、落地路径、归因、隐私、激活或权限变更后，重新检查配置及下一批匹配的正式活动。

[参数与报表](/cn/mmp/appsflyer/parameters-reporting) · [回传设置](/cn/mmp/appsflyer/postbacks) · [点击转发](/cn/mmp/appsflyer/click-forwarding) · [权限](/cn/mmp/appsflyer/permissions) · [集成校验](/cn/mmp/appsflyer/validation)
