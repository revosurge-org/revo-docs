# 网站通过 Prebid.js 接入 AdFlow S2S {#s2s-integration}

如果你的网站已经通过 Prebid.js 组织竞价，可以按本文配置 AdFlow 的服务端竞价。本页以 Banner 广告单元示例说明账号、广告位和请求的对应关系。

## 开始前 {#quick-start}

- 使用包含 Prebid Server adapter 的 Prebid.js 构建。
- 准备 AdFlow 账号 ID、已开通的 Banner 广告位 ID 和对应尺寸。
- 确认网页广告容器的 ID。使用 GAM 的网站还需确认该容器对应的 GPT 广告单元。


## 配置服务端竞价 {#s2s-config}

把下面的设置加入现有的 Prebid.js 初始化流程，在调用 `requestBids()` 之前完成配置。将示例中的账号 ID 换成自己的值。

```js
window.pbjs = window.pbjs || {};
pbjs.que = pbjs.que || [];

pbjs.que.push(function () {
  pbjs.setConfig({
    s2sConfig: {
      accountId: 'YOUR_ACCOUNT_ID',
      bidders: ['revosurge'],
      adapter: 'prebidServer',
      enabled: true,
      endpoint: 'https://prebid-server.revosurge.com/openrtb2/auction',
      timeout: 3000
    }
  });
});
```

## 添加 Banner 广告单元 {#ad-units}

将 `code` 设为网页广告容器的 ID，在 `placementId` 中填入对应的 AdFlow 广告位 ID。示例使用 300×250，请按你的实际广告位填写尺寸。

```js
pbjs.que.push(function () {
  pbjs.addAdUnits([{
    code: 'banner-slot',
    mediaTypes: {
      banner: { sizes: [[300, 250]] }
    },
    bids: [{
      bidder: 'revosurge',
      params: { placementId: 'YOUR_PLACEMENT_ID' }
    }]
  }]);
});
```

## 完整示例 {#full-example}

将上面的服务端竞价配置和 Banner 广告单元加入 [Prebid 的 S2S 完整页面示例](https://docs.prebid.org/dev-docs/examples/s2s-only.html)，替换示例中的账号、广告位和端点。该示例演示由 Prebid.js 直接渲染 Banner。使用 GAM 决定展示内容时，请按下一节配置。

## 使用自有 GAM {#s2s-gam}

如果用 GAM 决定展示哪个广告，请按[自有 GAM + Prebid.js](./gam-prebid)配置 GPT、价格桶和素材。先确认 Prebid.js 请求能带上正确的 AdFlow 位置信息，再将本次竞价的定向键写到对应的 GAM 广告位。

## 检查请求、出价和展示 {#testing}

1. 在已部署配置的网页触发目标广告位，在浏览器的 Network 面板确认竞价请求已发出。
2. 核对请求对应的广告位和响应。已收到请求但暂无出价时，检查广告位配置、请求超时及响应，再按[有请求，但没有广告展示](./no-ad-display)排查。
3. 使用 GAM 时，在请求中核对 `hb_pb` 等定向键，确认 GAM 选中正确的订单项和素材。
4. 按[验证接入与上线](./verify-and-launch)核对实际渲染与报表。也可在[S2S 调试器](./s2s-debugger)查看测试页面的字段与检查步骤。

完成标志是同一广告位的请求、实际展示和报表数据都能对应。把请求发出和展示验证分别记录，方便排查链路在哪一步中断。
