# 網站透過 Prebid.js 接入 AdFlow S2S {#s2s-integration}

如果你的網站已使用 Prebid.js 進行競價，可以依照本文設定 AdFlow 的伺服器端競價。本頁以 Banner 廣告單元為例，說明帳號、廣告版位和請求的對應關係。

## 開始前 {#quick-start}

- 使用包含 Prebid Server adapter 的 Prebid.js 建置版本。
- 準備 AdFlow 帳號 ID、已開通的 Banner 廣告版位 ID 和對應尺寸。
- 確認網頁廣告容器的 ID。使用 GAM 的網站也需確認該容器對應的 GPT 廣告單元。

## 設定伺服器端競價 {#s2s-config}

將下列設定加入現有的 Prebid.js 初始化流程，在呼叫 `requestBids()` 前完成設定。將範例中的帳號 ID 換成自己的值。

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

## 新增 Banner 廣告單元 {#ad-units}

將 `code` 設為網頁廣告容器的 ID，並在 `placementId` 填入對應的 AdFlow 廣告版位 ID。範例使用 300×250，請依實際版位填寫尺寸。

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

## 使用自有 GAM {#s2s-gam}

如果使用 GAM 決定顯示哪個廣告，請依照[自有 GAM + Prebid.js](./gam-prebid)設定 GPT、價格區間和廣告素材。先確認 Prebid.js 請求帶有正確的 AdFlow 版位資訊，再將本次競價的指定鍵寫入對應的 GAM 廣告版位。

## 檢查請求、出價和廣告顯示 {#testing}

1. 在已部署設定的網頁觸發目標版位，在瀏覽器的 Network 面板確認競價請求已送出。
2. 核對請求對應的版位與回應。如果已收到請求但尚無出價，檢查版位設定、請求逾時時間和回應，再依照[有請求，但沒有廣告顯示](./no-ad-display)排查。
3. 使用 GAM 時，在請求中核對 `hb_pb` 等指定鍵，確認 GAM 選到正確的委刊項目和廣告素材。
4. 依照[驗證接入與上線](./verify-and-launch)核對實際顯示與報表。也可在 [S2S 偵錯工具](./s2s-debugger)查看測試頁面的欄位與檢查步驟。

同一版位的請求、實際顯示和報表資料都能對應，即完成驗證。分別記錄請求送出和顯示結果，方便找出中斷的步驟。
