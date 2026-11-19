# 選擇接入方式

依網站是否已使用 Google Ad Manager（GAM），以及由誰發起競價、顯示廣告，選擇對應的接入指南。

## 網站接入

<div class="adflow-table" role="region" aria-label="網站接入" tabindex="0">

| 指南 | 使用情境 |
| --- | --- |
| [網站直接安裝 AdFlow JS Tag](./adflow-sdk) | 可直接修改網頁時，在頁面安裝 AdFlow 提供的程式碼。 |
| [網站透過 Prebid.js 接入 AdFlow S2S](./s2s-integration) | 在現有的 Prebid.js 初始化流程中設定 AdFlow 伺服器端競價。 |

</div>

## 自有 GAM {#gam}

<div class="adflow-table" role="region" aria-label="GAM" tabindex="0">

| 指南 | 使用情境 |
| --- | --- |
| [自有 GAM + Prebid.js](./gam-prebid) | 網站已用 Prebid.js 競價時，將競價結果交給 GAM。 |
| [自有 GAM + AdFlow JS Tag（無 Prebid.js）](./gam-adflow-sdk) | 透過 GAM 廣告素材呼叫 AdFlow JS Tag。 |

</div>

完成設定後，在實際頁面核對請求、廣告顯示和報表。 [3. 驗證接入與上線](./verify-and-launch)。
