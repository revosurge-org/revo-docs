---
title: Prebid.js + GAM
description: 將 RevoSurge S2S 出價傳給 GAM，並配置五種廣告格式的素材。
---

# Prebid.js + GAM

在網站已有 Prebid.js 競價流程時，使用 Google Publisher Tag（GPT）將 RevoSurge S2S 的競價結果傳給 Google Ad Manager（GAM）。GAM 根據庫存和價格桶選擇訂單項，再返回用於渲染或確認本次獲勝的素材。

## 網站接入

1. 加載 GPT 和包含 Prebid Server adapter 的生產版 Prebid.js。使用 Native 或 In-page Push 時，構建還需包含 `nativeRendering`。
2. 按 [S2S 配置接入](./s2s-integration#s2s-gam)設置 `s2sConfig`，填入自己的 AdFlow 賬號和廣告版位識別碼。將 Prebid `adUnit.code` 與 GPT 容器 ID 設為同一值，GPT 廣告單元使用 GAM 中的完整路徑。
3. 在啓用 GPT 服務前禁用初始請求，註冊廣告版位，再調用 `pbjs.requestBids()`。確認出價屬於當前競價且幣種與 GAM 配置一致，然後調用 `pbjs.setTargetingForGPTAsync([slotId])`，最後用 `googletag.pubads().refresh([gamSlot])` 請求對應 GAM 廣告版位。

## GAM 配置

1. 在 **Inventory → Ad units** 創建對應尺寸的廣告版位，在 **Inventory → Key-values** 設置定向鍵。
2. 在 **Delivery → Orders** 下創建訂單項。庫存定向選擇對應廣告版位，按所用的 `priceGranularity` 配置 `hb_pb` 的值和對應 CPM。需要限定 RevoSurge 出價時，同時匹配 `hb_bidder=revosurge`。
3. 添加 **Third party → Standard** 素材並關聯訂單項。確認訂單已審批，素材關聯有效，尺寸和排期匹配。

| 鍵 | 用途 |
| --- | --- |
| `hb_pb` | 匹配訂單項的價格桶。小數精度、價格檔位和幣種需與網站設定一致。 |
| `hb_bidder` | 匹配出價方。 |
| `hb_adid` | 關聯當前競價的廣告識別碼。 |
| `hb_size`、`hb_format`、`hb_ver` | 向素材傳遞尺寸、格式和 PUC 版本。 |
| `af_push_token` | Push 和 Pop 的動態關聯鍵，每次請求生成新值。 |

## 五種廣告版位

| 格式 | GAM 尺寸示例 | 網頁配置與 GAM 素材 |
| --- | --- | --- |
| Banner | 300×250 | 使用 `mediaTypes.banner`，由 Prebid Universal Creative（PUC）渲染。 |
| Native | 300×250 | 使用 Native ORTB、`ortb2Imp.ext.type: 'native'` 和頁面 `adTemplate`，由 Native PUC 渲染。 |
| In-page Push | 492×328 | 使用 Native ORTB、`ortb2Imp.ext.type: 'push'` 和頁面 `adTemplate`，由 Native PUC 在頁內渲染。 |
| Push | 1×1 | 使用 Native ORTB 和 `ortb2Imp.ext.type: 'push'`。GAM 返回獲勝確認素材，頁面在頂層處理瀏覽器通知。 |
| Pop | 1×1 | 使用 1×1 Banner 和 `ortb2Imp.ext.type: 'pop'`。GAM 返回獲勝確認素材，頂層頁面在真實用戶點擊時打開廣告。 |

### Banner、Native 和 In-page Push

下面是僅發送最高出價時的 GAM PUC 素材示例。使用能提供 `hb_ver` 的 Prebid.js 構建。Native 與 In-page Push 使用 `native.js`，並在註冊廣告單元前定義 `nativeTemplate`，讓模板里的資產識別碼與 ORTB 請求一致。

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

::: details Native 廣告單元示例
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

::: details In-page Push 廣告單元示例
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

請求 GAM 前生成隨機值，通過 `gamSlot.setTargeting('af_push_token', token)` 傳入，並保存本次競價的有效出價。1×1 素材通過消息回傳競價識別碼和 token。以下示例放在 GAM 素材中，替換發佈商源和廣告版位識別碼。Pop 使用消息類型 `adflow-gam-pop-win`。

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

網站需要實現消息接收邏輯。確認發送窗口屬於當前 GPT 廣告版位，廣告版位返回非空，並核對消息類型、廣告版位識別碼、`adId` 和 token。所有條件滿足後，只使用本次已保存的出價。在頂層 HTTPS 頁面由用戶操作觸發通知授權，或者由真實點擊觸發 Pop。

::: details Push 廣告單元示例
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

## 驗證接入

依次檢查 Prebid 出價、GPT 請求中的定向鍵、GAM 返回的訂單項和素材以及實際展示。單獨驗證 Push 的系統通知權限、Pop 的用戶點擊，以及 Native 和 In-page Push 的模板渲染。

有關 GAM 訂單項和素材設置，參見 [Prebid 的 GAM 配置指南](https://docs.prebid.org/adops/step-by-step.html)和 [PUC 素材指南](https://docs.prebid.org/adops/gam-creative-banner-sbs.html)。
