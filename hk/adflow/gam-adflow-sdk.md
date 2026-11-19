---
title: GAM + adflow.js
description: 通過 GAM 選擇 adflow.js 素材，接入五種網站廣告格式。
---

# GAM + adflow.js

網站通過 Google Publisher Tag（GPT）請求 Google Ad Manager（GAM）。GAM 先選擇訂單項，再由 adflow.js 發起競價。Banner、Native 和 In-page Push 的 `adflow.js` 在 GAM 素材內運行。Push 和 Pop 由 GAM 素材確認後，在頂層頁面運行 `adflow.js`。

## GAM 配置

1. 在 **Inventory → Ad units** 配置廣告版位，記錄完整 GPT 路徑和尺寸。
2. 在 **Delivery → Orders** 下創建訂單項，將庫存定向到對應廣告版位，按實際投放計劃配置排期與尺寸。
3. 添加 **Third party → Standard** 素材並關聯訂單項，確認訂單已審批且素材關聯有效。此方式通過 GAM 庫存選擇素材，無需配置 Prebid 的 `hb_pb` 價格桶。

| 格式 | GAM 尺寸示例 | GAM 素材與 `adflow.js` 運行位置 |
| --- | --- | --- |
| Banner | 300×250 | 素材內使用 `data-ad-type="banner"`。 |
| Native | 300×250 | 素材內使用 `data-ad-type="native"`。 |
| In-page Push | 492×328 | 素材內使用 `data-ad-type="inpage-push"`。 |
| Push | 1×1 | 素材回傳確認消息，頂層頁面使用 `data-ad-type="push"`。 |
| Pop | 1×1 | 素材回傳確認消息，頂層頁面使用 `data-ad-type="pop"`。 |

## Banner、Native 和 In-page Push

在網頁放置 GPT 容器並請求對應 GAM 廣告版位。以下為單個 Banner 廣告版位示例。已有 GPT 的頁面應復用初始化。

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

將下面的 HTML 放在 GAM 第三方素材中。替換 AdFlow 賬號、廣告版位識別碼，並按目標廣告格式調整類型和尺寸。完整屬性見 [adflow.js 一鍵接入](./adflow-sdk)。

```html
<iframe data-adflow-ad data-placement-id="YOUR_PLACEMENT_ID" data-ad-type="banner"
        width="300" height="250" title="Advertisement" scrolling="no"
        style="border:0;display:block"></iframe>
<script src="https://assets.revosurge.com/js/adflow.min.js"
        data-account-id="YOUR_ACCOUNT_ID"></script>
```

## Push 和 Pop

GAM 中的 1×1 素材負責確認訂單項已選中。頁面收到並驗證確認消息後，才在頂層初始化 `adflow.js`。

1. 在 GAM **Inventory → Key-values** 創建動態鍵 `af_sdk_token`。網站為每次 GAM 請求生成隨機 token，並調用 `gamSlot.setTargeting('af_sdk_token', token)`。
2. 在 1×1 GAM 素材里通過 `%%PATTERN:af_sdk_token%%` 回傳 token。下面以 Push 為例。Pop 將 `adType` 改為 `pop`。將示例源替換為實際發佈商頁面的源。
3. 網站接收消息時，校驗發送窗口屬於當前 GAM 廣告版位的 iframe，並核對消息類型、廣告類型、廣告版位識別碼和本次 token。等待對應 `slotRenderEnded` 且 `isEmpty === false`，兩項檢查都通過後只初始化一次 `adflow.js`。
4. Push 需要在頂層 HTTPS 頁面通過真實用戶操作請求瀏覽器通知權限，獲准後插入對應 iframe 並加載 `adflow.js`。Pop 在頂層加載 `adflow.js`，由 `adflow.js` 在獲得有效出價後處理真實用戶點擊。

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

## 驗證接入

先確認 GAM 返回正確的訂單項和素材，再確認 `adflow.js` 發起廣告請求，並分別檢查頁內展示、Push 系統通知和 Pop 的點擊觸發結果。
