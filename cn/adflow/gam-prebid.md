---
title: Prebid.js + GAM
description: 将 RevoSurge S2S 出价传给 GAM，并配置五种广告格式的素材。
---

# Prebid.js + GAM

在网站已有 Prebid.js 竞价流程时，使用 Google Publisher Tag（GPT）将 RevoSurge S2S 的竞价结果传给 Google Ad Manager（GAM）。GAM 根据库存和价格桶选择订单项，再返回用于渲染或确认本次获胜的素材。

## 网站接入

1. 加载 GPT 和包含 Prebid Server adapter 的生产版 Prebid.js。使用 Native 或 In-page Push 时，构建还需包含 `nativeRendering`。
2. 按 [S2S 配置接入](./s2s-integration#s2s-gam)设置 `s2sConfig`，填入自己的 AdFlow 账号和广告位标识。将 Prebid `adUnit.code` 与 GPT 容器 ID 设为同一值，GPT 广告单元使用 GAM 中的完整路径。
3. 在启用 GPT 服务前禁用初始请求，注册广告位，再调用 `pbjs.requestBids()`。确认出价属于当前竞价且币种与 GAM 配置一致，然后调用 `pbjs.setTargetingForGPTAsync([slotId])`，最后用 `googletag.pubads().refresh([gamSlot])` 请求对应 GAM 广告位。

## GAM 配置

1. 在 **Inventory → Ad units** 创建对应尺寸的广告位，在 **Inventory → Key-values** 设置定向键。
2. 在 **Delivery → Orders** 下创建订单项。库存定向选择对应广告位，按所用的 `priceGranularity` 配置 `hb_pb` 的值和对应 CPM。需要限定 RevoSurge 出价时，同时匹配 `hb_bidder=revosurge`。
3. 添加 **Third party → Standard** 素材并关联订单项。确认订单已审批，素材关联有效，尺寸和排期匹配。

| 键 | 用途 |
| --- | --- |
| `hb_pb` | 匹配订单项的价格桶。小数精度、价格档位和币种需与网站配置一致。 |
| `hb_bidder` | 匹配出价方。 |
| `hb_adid` | 关联当前竞价的广告标识。 |
| `hb_size`、`hb_format`、`hb_ver` | 向素材传递尺寸、格式和 PUC 版本。 |
| `af_push_token` | Push 和 Pop 的动态关联键，每次请求生成新值。 |

## 五种广告位

| 格式 | GAM 尺寸示例 | 网页配置与 GAM 素材 |
| --- | --- | --- |
| Banner | 300×250 | 使用 `mediaTypes.banner`，由 Prebid Universal Creative（PUC）渲染。 |
| Native | 300×250 | 使用 Native ORTB、`ortb2Imp.ext.type: 'native'` 和页面 `adTemplate`，由 Native PUC 渲染。 |
| In-page Push | 492×328 | 使用 Native ORTB、`ortb2Imp.ext.type: 'push'` 和页面 `adTemplate`，由 Native PUC 在页内渲染。 |
| Push | 1×1 | 使用 Native ORTB 和 `ortb2Imp.ext.type: 'push'`。GAM 返回获胜确认素材，页面在顶层处理浏览器通知。 |
| Pop | 1×1 | 使用 1×1 Banner 和 `ortb2Imp.ext.type: 'pop'`。GAM 返回获胜确认素材，顶层页面在真实用户点击时打开广告。 |

### Banner、Native 和 In-page Push

下面是仅发送最高出价时的 GAM PUC 素材示例。使用能提供 `hb_ver` 的 Prebid.js 构建。Native 与 In-page Push 使用 `native.js`，并在注册广告单元前定义 `nativeTemplate`，让模板里的资产标识与 ORTB 请求一致。

```html
<!-- Paste into GAM Third-party creative, Standard code type.
     Requires Prebid.js >= 10.11.0 with hb_ver targeting. -->
<script src="https://cdn.jsdelivr.net/npm/prebid-universal-creative@%%PATTERN:hb_ver%%/dist/%%PATTERN:hb_format%%.js"></script>
<script>
  var ucTagData = {};
  ucTagData.adServerDomain = "";
  ucTagData.pubUrl = "%%PATTERN:url%%";
  ucTagData.targetingMap = %%PATTERN:TARGETINGMAP%%;
  ucTagData.hbPb = "%%PATTERN:hb_pb%%";
  ucTagData.requestAllAssets = true;
  ucTagData.clickUrlUnesc = "%%CLICK_URL_UNESC%%";
  try { ucTag.renderAd(document, ucTagData); }
  catch (error) { console.error(error); }
</script>
```

::: details Native 广告单元示例
```js
pbjs.addAdUnits([{
  code: 'native-slot-1',
  ortb2Imp: {ext: {type: 'native'}},
  mediaTypes: {native: {adTemplate: nativeTemplate, ortb: {
    ver: '1.2', context: 1, plcmttype: 1, plcmtcnt: 1,
    assets: [
      {id: 1, required: 1, title: {len: 80}},
      {id: 2, required: 1, img: {type: 3, w: 300, h: 250, wmin: 300, hmin: 250}},
      {id: 3, required: 0, data: {type: 2, len: 160}},
      {id: 4, required: 0, data: {type: 1, len: 80}},
      {id: 5, required: 0, data: {type: 12, len: 40}}
    ],
    eventtrackers: [{event: 1, methods: [1]}]
  }}},
  bids: [{bidder: 'revosurge', params: {placementId: 'YOUR_PLACEMENT_ID'}}]
}]);
```
:::

::: details In-page Push 广告单元示例
```js
pbjs.addAdUnits([{
  code: 'inpage-push-slot-1',
  ortb2Imp: {ext: {type: 'push'}},
  mediaTypes: {native: {adTemplate: nativeTemplate, ortb: {
    ver: '1.2', context: 1, plcmttype: 3, plcmtcnt: 1,
    assets: [
      {id: 1, required: 1, title: {len: 80}},
      {id: 2, required: 0, img: {type: 1, w: 192, h: 192}},
      {id: 3, required: 1, img: {type: 3, w: 492, h: 328, wmin: 492, hmin: 328}},
      {id: 4, required: 0, data: {type: 2, len: 160}}
    ],
    eventtrackers: [{event: 1, methods: [1]}]
  }}},
  bids: [{bidder: 'revosurge', params: {placementId: 'YOUR_PLACEMENT_ID'}}]
}]);
```
:::

### Push 和 Pop

请求 GAM 前生成随机值，通过 `gamSlot.setTargeting('af_push_token', token)` 传入，并保存本次竞价的有效出价。1×1 素材通过消息回传竞价标识和 token。以下示例放在 GAM 素材中，替换发布商源和广告位标识。Pop 使用消息类型 `adflow-gam-pop-win`。

```html
<script>
window.top.postMessage({
  type: 'adflow-gam-push-win',
  placementId: 'YOUR_PLACEMENT_ID',
  adId: '%%PATTERN:hb_adid%%',
  token: '%%PATTERN:af_push_token%%'
}, 'https://publisher.example');
</script>
```

网站需要实现消息接收逻辑。确认发送窗口属于当前 GPT 广告位，广告位返回非空，并核对消息类型、广告位标识、`adId` 和 token。所有条件满足后，只使用本次已保存的出价。在顶层 HTTPS 页面由用户操作触发通知授权，或者由真实点击触发 Pop。

::: details Push 广告单元示例
```js
pbjs.addAdUnits([{
  code: 'push-slot-1',
  ortb2Imp: {ext: {type: 'push'}},
  mediaTypes: {native: {ortb: {
    ver: '1.2', context: 1, plcmttype: 3, plcmtcnt: 1, privacy: 1,
    assets: [
      {id: 100, required: 0, title: {len: 80}},
      {id: 400, required: 0, data: {type: 1, len: 80}},
      {id: 300, required: 0, img: {type: 1, w: 192, h: 192, wmin: 192, hmin: 192}},
      {id: 200, required: 0, img: {type: 3, w: 492, h: 328, wmin: 492, hmin: 328}}
    ]
  }}},
  bids: [{bidder: 'revosurge', params: {placementId: 'YOUR_PLACEMENT_ID'}}]
}]);
```
:::

## 验证接入

依次检查 Prebid 出价、GPT 请求中的定向键、GAM 返回的订单项和素材以及实际展示。单独验证 Push 的系统通知权限、Pop 的用户点击，以及 Native 和 In-page Push 的模板渲染。

有关 GAM 订单项和素材设置，参见 [Prebid 的 GAM 配置指南](https://docs.prebid.org/adops/step-by-step.html)和 [PUC 素材指南](https://docs.prebid.org/adops/gam-creative-banner-sbs.html)。
