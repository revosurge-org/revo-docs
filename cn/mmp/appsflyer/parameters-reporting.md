---
title: AppsFlyer 参数与报表
description: 使用媒体来源、广告系列、广告组和事件回传数据对齐 AppsFlyer 与 RevoSurge 报表。
---

# AppsFlyer 参数与报表

RevoSurge 会自动提供下列点击参数，广告主可用这些参数对照两边报表。

## 筛选正确流量 {#identify-the-right-traffic}

向客户经理确认 RevoSurge **PID**，并在 AppsFlyer 按该 PID 筛选。对照同一应用、平台、日期范围和时区。名称可能更改，请使用广告系列和广告组 ID 匹配。

## 点击参数 {#click-parameters}

| AppsFlyer 字段 | RevoSurge 值 | 报表用途 |
| --- | --- | --- |
| URL 路径中的 App ID | 追踪器的平台 App ID | 筛选应用 |
| `pid` | RevoSurge 媒体来源 | 筛选已确认的 PID |
| `af_siteid` | 流量供应来源 ID | 比较供应来源 |
| `c` | 广告系列名称 | 显示名称 |
| `af_c_id` | 广告系列 ID | 匹配广告系列 |
| `af_ad_id` | 当前映射中的广告系列 ID | 素材分析请用 RevoSurge 报表 |
| `af_adset` | 广告组名称 | 显示名称 |
| `af_adset_id` | 广告组 ID | 匹配广告组 |

`af_ad_id` 和 `af_c_id` 当前使用相同的广告系列值。依赖素材级归因的团队请向客户经理确认适用规则。

## 数量出现差异的原因 {#why-counts-can-differ}

RevoSurge 在页面加载前记录点击。只有追踪逻辑执行后，AppsFlyer 才会收到转发的点击。加载中断或追踪受阻都可能导致数量不同。

- **归因回溯窗口**决定安装前哪些点击或展示可用于归因。
- **应用内事件回传窗口**规定安装后多久仍可回传事件。窗口结束后，AppsFlyer 可能仍会记录和归因事件。参见 [AppsFlyer 回传窗口说明](https://support.appsflyer.com/hc/en-us/articles/208439256-In-app-event-postback-configuration)。
- **发送范围**决定哪些事件会转发。**This partner only** 只转发归因给该合作伙伴的事件。比较时使用相同的事件范围。

## 排查报表差异 {#investigate-a-discrepancy}

1. 对齐应用、平台、已确认的 PID、时间范围及时区。
2. 匹配广告系列和广告组 ID。
3. 对齐事件定义、归因回溯窗口、回传窗口及发送范围。
4. 上线后用 UTC 时间核对一条真实安装或事件。
5. 仍有异常时，按[上线后验证和排查流程](/cn/mmp/appsflyer/setup-appsflyer#_4-verify-after-campaign-launch)检查。

RevoSurge 在此流程中只转发点击，报表应按点击归因口径核对。另见[完整点击参数和宏](/cn/mmp/appsflyer/macros)。
