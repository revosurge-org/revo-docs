---
title: GAM + adflow.js
description: 通过 GAM 选择 adflow.js 素材，接入五种网站广告格式。
---

# GAM + adflow.js

网站通过 Google Publisher Tag（GPT）请求 Google Ad Manager（GAM）。GAM 先选择订单项，再由 adflow.js 发起竞价。Banner、Native 和 In-page Push 的 `adflow.js` 在 GAM 素材内运行。Push 和 Pop 由 GAM 素材确认后，在顶层页面运行 `adflow.js`。

## GAM 配置

1. 在 **Inventory → Ad units** 配置广告位，记录完整 GPT 路径和尺寸。
2. 在 **Delivery → Orders** 下创建订单项，将库存定向到对应广告位，按实际投放计划配置排期与尺寸。
3. 添加 **Third party → Standard** 素材并关联订单项，确认订单已审批且素材关联有效。此方式通过 GAM 库存选择素材，无需配置 Prebid 的 `hb_pb` 价格桶。

| 格式 | GAM 尺寸示例 | GAM 素材与 `adflow.js` 运行位置 |
| --- | --- | --- |
| Banner | 300×250 | 素材内使用 `data-ad-type="banner"`。 |
| Native | 300×250 | 素材内使用 `data-ad-type="native"`。 |
| In-page Push | 492×328 | 素材内使用 `data-ad-type="inpage-push"`。 |
| Push | 1×1 | 素材回传确认消息，顶层页面使用 `data-ad-type="push"`。 |
| Pop | 1×1 | 素材回传确认消息，顶层页面使用 `data-ad-type="pop"`。 |

## Banner、Native 和 In-page Push

在网页放置 GPT 容器并请求对应 GAM 广告位。以下为单个 Banner 广告位示例。已有 GPT 的页面应复用初始化。

```html
<script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"></script>
<div id="gam-banner-slot" style="width:300px;height:250px"></div>
<script>
window.googletag = window.googletag || { cmd: [] };
googletag.cmd.push(() => {
  googletag.defineSlot('/NETWORK_CODE/AD_UNIT_CODE', [300, 250], 'gam-banner-slot')
    .addService(googletag.pubads());
  googletag.enableServices();
  googletag.display('gam-banner-slot');
});
</script>
```

将下面的 HTML 放在 GAM 第三方素材中。替换 AdFlow 账号、广告位标识，并按目标广告格式调整类型和尺寸。完整属性见 [adflow.js 一键接入](./adflow-sdk)。

```html
<iframe data-adflow-ad data-placement-id="YOUR_PLACEMENT_ID" data-ad-type="banner"
        width="300" height="250" title="Advertisement" scrolling="no"
        style="border:0;display:block"></iframe>
<script src="https://assets.revosurge.com/js/adflow.min.js"
        data-account-id="YOUR_ACCOUNT_ID"></script>
```

## Push 和 Pop

GAM 中的 1×1 素材负责确认订单项已选中。页面收到并验证确认消息后，才在顶层初始化 `adflow.js`。

1. 在 GAM **Inventory → Key-values** 创建动态键 `af_sdk_token`。网站为每次 GAM 请求生成随机 token，并调用 `gamSlot.setTargeting('af_sdk_token', token)`。
2. 在 1×1 GAM 素材里通过 `%%PATTERN:af_sdk_token%%` 回传 token。下面以 Push 为例。Pop 将 `adType` 改为 `pop`。将示例源替换为实际发布商页面的源。
3. 网站接收消息时，校验发送窗口属于当前 GAM 广告位的 iframe，并核对消息类型、广告类型、广告位标识和本次 token。等待对应 `slotRenderEnded` 且 `isEmpty === false`，两项检查都通过后只初始化一次 `adflow.js`。
4. Push 需要在顶层 HTTPS 页面通过真实用户操作请求浏览器通知权限，获准后插入对应 iframe 并加载 `adflow.js`。Pop 在顶层加载 `adflow.js`，由 `adflow.js` 在获得有效出价后处理真实用户点击。

```html
<script>
window.top.postMessage({
  type: 'adflow-sdk-gam-win',
  adType: 'push',
  placementId: 'YOUR_PLACEMENT_ID',
  token: '%%PATTERN:af_sdk_token%%'
}, 'https://publisher.example');
</script>
```

## 验证接入

先确认 GAM 返回正确的订单项和素材，再确认 `adflow.js` 发起广告请求，并分别检查页内展示、Push 系统通知和 Pop 的点击触发结果。

### 检查 SafeFrame

Banner、Native 和 In-page Push 的脚本在 GAM 素材 iframe 内执行。如果素材启用了 SafeFrame，或 GPT 强制使用 SafeFrame，请在实际投放页面验证脚本能加载、发起请求并在容器内展示。Push 和 Pop 的 1×1 素材只负责向顶层发送确认消息。启用 SafeFrame 时，验证顶层仍能识别发送窗口并通过原有校验，通知授权和点击触发仍在顶层执行。可在 [Google Publisher Console](https://developers.google.com/publisher-tag/guides/publisher-console) 查看实际 iframe 类型。若强制隔离与所需行为不兼容，请为该广告位选用已验证兼容的格式或接入方式。

### 区分 GAM 无填充与 AdFlow 无填充

- 目标广告位的 `slotRenderEnded.isEmpty === true` 表示 GAM 未返回广告。检查库存定向、尺寸、排期及素材关联。需要回退时，在 GAM 配置符合该广告位的备用订单项，或由页面按站点策略展示自有内容、收起空容器。
- GAM 返回了指定第三方素材但广告仍未展示时，在 Network 和 Console 检查 `adflow.js` 是否执行、是否有请求，以及响应、浏览器拦截和渲染情况。GAM 已选中素材时，后续 AdFlow 无填充不会自动触发 GAM 再选一次订单项。Push 和 Pop 在未收到有效确认时跳过顶层初始化。

### 核对 GAM 和 AdFlow 报表

对齐日期、时区和筛选条件，按 GAM 广告单元、订单项及素材匹配 AdFlow 广告位。确认两边的报表均覆盖测试时段。GAM 可能已经记录第三方素材的展示，而 AdFlow 尚无实际展示，尤其是 AdFlow 无填充或 Push、Pop 的后续触发条件未满足时。记录差异及两侧报表时间，按[报表没数据或数据对不上](./report-data-issues)排查。
