---
title: 点击参数与宏
sidebar_label: 宏参数
description: RevoSurge 发送的 AppsFlyer 点击参考——每个参数、其背后的 RevoSurge 宏，以及它落在 AppsFlyer 的哪个报表维度上。
---

# 点击参数与宏

**受众：** 追踪／BI 工程师、需要把 AppsFlyer 与 RevoSurge 对账的 UA 经理

这是一页参考文档，不是操作路径。AppsFlyer 点击由 RevoSurge 替你构造——开启它只需两个设置，见[点击转发](/cn/mmp/appsflyer/click-forwarding)。当你需要知道**我们发送了什么**、以便读懂 AppsFlyer 报表并与 RevoSurge 看板对账时，来看本页。

> [!NOTE]
> 本页没有任何需要你配置的内容。下面每一个值都由 RevoSurge 在点击发生时填充。

## 点击 URL

```
https://app.appsflyer.com/{app_id}
  ?pid={pid}
  &af_siteid={site_id}
  &c={campaign}
  &af_c_id={cid}
  &af_ad_id={cid}
  &af_adset={group}
  &af_adset_id={gid}
```

这就是全部——RevoSurge 在点击上不会发送其他参数。

`{app_id}` 是**你的** AppsFlyer App ID，取自你落地页 web tracker 上填写的 `androidAppsFlyerId` 或 `iOSAppsFlyerId`。Android 与 iOS 的点击除该值外完全相同，因此 App ID 填错会把真实点击送到错误的应用——或者哪个应用都到不了。

## 各参数说明

| AppsFlyer 参数 | RevoSurge 宏 | 承载内容 | 在 AppsFlyer 中显示为 |
|---|---|---|---|
| `{app_id}`（在路径中） | — | 你的 AppsFlyer App ID，来自 web tracker 配置 | 该点击归因到的应用 |
| `pid` | —（固定值） | RevoSurge，作为媒体渠道 | **Media Source** |
| `af_siteid` | `{site_id}` | 该点击来自的 RevoSurge 流量源 | **Site ID** |
| `c` | `{campaign}` | 你的 RevoSurge 广告系列**名称** | **Campaign** |
| `af_c_id` | `{cid}` | 你的 RevoSurge 广告系列 **ID** | **Campaign ID** |
| `af_ad_id` | `{cid}` | 你的 RevoSurge 广告系列 **ID**——见下方说明 | **Ad ID** |
| `af_adset` | `{group}` | 你的 RevoSurge 广告组**名称** | **Adset** |
| `af_adset_id` | `{gid}` | 你的 RevoSurge 广告组 **ID** | **Adset ID** |

`pid` 的值对所有 RevoSurge 广告主都是固定的，不需要你设置。请向你的 RevoSurge 对接人索取准确的字符串——你需要用它把 AppsFlyer 报表筛选到 RevoSurge 流量。

> [!IMPORTANT]
> **`af_ad_id` 承载的是广告系列 ID，不是广告或素材 ID**——与 `af_c_id` 的值相同。因此对 RevoSurge 流量而言，AppsFlyer 的 **Ad ID** 维度与 **Campaign ID** 重复，AppsFlyer 侧无法按广告或素材层级拆分。素材层级的效果请使用 RevoSurge 报表。

## 示例

一条名为 `IN_Register_Display_20260126` 的广告系列（ID `48213`），广告组名为 `IN_Android_Tier1`（组 ID `9074`），点击来自流量源 `pub_44120`：

```
https://app.appsflyer.com/{app_id}?pid={pid}&af_siteid=pub_44120&c=IN_Register_Display_20260126&af_c_id=48213&af_ad_id=48213&af_adset=IN_Android_Tier1&af_adset_id=9074
```

请把对应平台的 App ID、以及客户经理给你的 `pid` 替换进去。注意 `af_c_id` 与 `af_ad_id` 都是 `48213`。

## 只有点击

RevoSurge 不向 AppsFlyer 发送展示。不存在展示 URL，不会向 `impression.appsflyer.com` 发送任何内容，AppsFlyer 中 RevoSurge 的归因是基于点击的。

如果你在核对集成，归因给 RevoSurge 的浏览归因安装应当为**零**。这是预期结果——见[浏览归因相关设置的说明](/cn/mmp/appsflyer/overview#必需设置一览)。

## AppsFlyer 与 RevoSurge 对账

从 AppsFlyer 报表中把 RevoSurge 流量取出来：

1. 把 **Media Source** 筛选为 RevoSurge 的 `pid`。
2. 按 **Campaign ID** 拆分以匹配 RevoSurge 广告系列，按 **Adset ID** 匹配广告组。
3. **用 ID 关联，不要用名称。**

> [!TIP]
> 名称是按点击发生那一刻它在 RevoSurge 中的样子传出去的。改了广告系列或广告组的名字，AppsFlyer 在后续点击上收到新名字，历史数据行里仍是旧名字——于是用 `Campaign` 或 `Adset` 关联会静默地把一条广告系列拆成两条。`af_c_id` 与 `af_adset_id` 在改名后保持不变，请用它们。

有两个数无论配置多干净都不会完全对上：

- **点击数。** RevoSurge 在点击发生时计数。AppsFlyer 只有在你的落地页加载、web tracker 触发之后才知道这次点击，因此中间损失的部分——加载前跳出、脚本被拦截、页面加载中止——会出现在 RevoSurge 而不出现在 AppsFlyer。
- **安装数。** RevoSurge 只能看到 AppsFlyer postback 发来的部分，且遵循 AppsFlyer 的归因规则与回溯窗口。归因以 AppsFlyer 为准；投放以 RevoSurge 为准。

## 下一步

- 还没开启点击转发？见[点击转发](/cn/mmp/appsflyer/click-forwarding)。
- Postback 还没配置？见[配置 postback](/cn/mmp/appsflyer/postbacks)。
