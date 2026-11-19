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
