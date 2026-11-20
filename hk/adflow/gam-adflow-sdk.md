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

### 檢查 SafeFrame

Banner、Native 和 In-page Push 在 GAM 素材 iframe 內執行。若素材啟用 SafeFrame，或 GPT 強制使用 SafeFrame，請在實際投放頁面確認指令碼能在容器內載入、送出請求及顯示廣告。Push 和 Pop 的 1×1 素材只負責向頂層傳送確認訊息。啟用 SafeFrame 時，確認頂層仍能辨識並驗證傳送視窗，且通知授權與點擊仍在頂層處理。可在 [Google Publisher Console](https://developers.google.com/publisher-tag/guides/publisher-console) 查閱實際 iframe 類型。若強制隔離與所需行為不相容，請為該廣告位選擇已驗證相容的格式或接入方式。

### 區分 GAM 與 AdFlow 未填充

- 若目標廣告位的 `slotRenderEnded.isEmpty === true`，表示 GAM 未回傳廣告。檢查廣告空間指定、尺寸、排程及素材關聯。需要備援時，可在 GAM 設定符合資格的備援委刊項，或由網頁依網站策略顯示自有內容或收合空容器。
- 若 GAM 已回傳指定第三方素材，廣告仍未顯示，請在 Network 和 Console 檢查指令碼、請求、回應、瀏覽器封鎖及算繪。GAM 選中素材後，AdFlow 未填充時不會自動觸發 GAM 重新選取委刊項。若沒有收到有效確認，請略過 Push 或 Pop 的頂層初始化。

### 核對 GAM 與 AdFlow 報表

對齊日期、時區和篩選條件，按 GAM 廣告單元、委刊項和素材對應 AdFlow 廣告位。確認兩邊的報表皆涵蓋測試時段。GAM 可能已記錄第三方素材曝光，而 AdFlow 尚未記錄實際曝光，例如 AdFlow 未填充，或 Push、Pop 的觸發條件未滿足。記錄差異和兩邊報表產生時間，依[報表沒資料或資料對不上](./report-data-issues)排查。
