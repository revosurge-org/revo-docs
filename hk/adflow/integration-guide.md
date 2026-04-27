---
title: Publisher 接入文檔
description: 接入 adflow.js 或 Prebid S2S 投放廣告。adflow.js 或 S2S 分步指南。
---

# Publisher 接入文檔

本文檔介紹如何在你的網站中接入廣告變現。我們提供兩種接入方式：[adflow.js 一鍵接入](#adflow-sdk)(推薦，最簡方式)和 [S2S 配置接入](#s2s-integration)(手動配置，更靈活)。

## 接入模式對比

| 對比維度 | adflow.js 一鍵接入 | S2S 配置接入 |
| --- | --- | --- |
| **接入難度** | 極簡 — 兩行 HTML 即可 | 中等 — 需編寫 JS 代碼 |
| **需要了解 Prebid.js** | 否 | 是 |
| **支持廣告格式** | Banner | Banner / Video / Native / Multi-Format |
| **渲染方式** | iframe 自动渲染 | 靈活控制，支持自定义渲染 |
| **配置方式** | HTML data 属性 | Prebid.js API 完整配置 |
| **Preferred Deal** | 支持 | 支持 |
| **高级功能** | 基础配置 | Price Granularity、User Sync、First Party Data 等 |
| **推薦场景** | 快速上线、简单页面、无前端开发资源 | 生产环境、复杂需求、需要精细控制 |

## adflow.js 一键接入 {#adflow-sdk}

adflow.js 是一个自包含的 JavaScript SDK，将 Prebid.js S2S 竞价的所有逻辑封装在一个脚本中。客户只需引入一个 `<script>` 标签并在廣告位放置 `<iframe>` 标签即可完成接入，无需手动加载 Prebid.js 或編寫竞价代码。

[adflow.js 調試器](/hk/adflow/adflowjs-debugger)

::: tip 推薦
如果你希望以最简方式快速接入，adflow.js 是最佳选择。无需了解 Prebid.js 的配置细节，两行 HTML 即可完成接入。
:::

### 使用方式 {#adflow-usage}

只需两步即可完成接入：

**1. 引入 adflow.js 脚本**

在页面中添加 `<script>` 标签，通过 data 属性配置全局参数：

```html
<script src="https://assets.revosurge.com/js/adflow.min.js"
    data-account-id="your-account-id"></script>
```

**2. 放置廣告位**

在需要展示廣告的位置添加 `<iframe>` 标签：

```html
<iframe data-adflow-ad
    data-placement-id="your-placement-id"
    width="300" height="250"></iframe>
```

adflow.js 会自动完成以下工作：加载 Prebid.js → 配置 S2S → 发现页面上的廣告位 → 发起竞价 → 渲染中标廣告。

### 脚本属性 {#adflow-script-attrs}

以下是 `<script>` 标签支持的 data 属性：

| 属性 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `data-server-url` | 可选 | `https://prebid-server.revosurge.com` | Prebid Server 地址 |
| `data-account-id` | 必填 | — | 账号 ID |
| `data-bidder` | 可选 | `revosurge` | Bidder 名称 |
| `data-timeout` | 可选 | `3000` | S2S 超时时间(毫秒) |
| `data-prebid-url` | 可选 | jsdelivr CDN | 自定义 Prebid.js URL |
| `data-debug` | 可选 | — | 启用调试模式(添加此属性即可，无需赋值) |

### 廣告位属性 {#adflow-iframe-attrs}

以下是 `<iframe>` 标签支持的 data 属性：

| 属性 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `data-adflow-ad` | 必填 | — | 标识这是一个廣告位(无需赋值) |
| `data-placement-id` | 必填 | — | 廣告位 ID，在 AdFlow 后台创建廣告位后获取 |
| `width` | 可选 | `300` | 廣告位宽度(像素) |
| `height` | 可选 | `250` | 廣告位高度(像素) |
| `data-adflow-responsive` | 可选 | — | 設為 `1` 時 iframe 在**父級容器**內橫向鋪滿（`width: 100%`）。你必須自行提供外層容器並編寫樣式（見下方[響應式佈局](#adflow-responsive)） |
| `data-deal-id` | 可选 | — | Preferred Deal ID |

### 響應式佈局 {#adflow-responsive}

`data-adflow-responsive="1"` 只影響 `<iframe>` 在頁面裡的**橫向**展示：它會佔滿**直接父元素**的寬度。AdFlow **不會**替你生成外層佈局盒子。你需要用自有元素（例如 `<div>`）包裹 iframe，並以 CSS 設定寬度、高度、`max-width`、置中、斷點等，使廣告位符合你的版式。

請繼續在 iframe 上保留 `width` 和 `height` 屬性，以便 SDK 按正確尺寸請求創意；外層容器則決定頁面上實際佔用的橫向空間。

**固定尺寸廣告位（例如 728×90）**

```html
<style>
.your-ad-slot {
    width: 728px;
    height: 90px;
}
</style>
<div class="your-ad-slot">
    <iframe data-adflow-ad
        data-placement-id="your-placement-id"
        data-adflow-responsive="1"
        width="728"
        height="90"></iframe>
</div>
```

**隨容器變寬並限制最大寬度**

```html
<style>
.your-ad-slot {
    width: 100%;
    max-width: 728px;
    height: 90px;
    margin: 0 auto;
}
</style>
<div class="your-ad-slot">
    <iframe data-adflow-ad
        data-placement-id="your-placement-id"
        data-adflow-responsive="1"
        width="728"
        height="90"></iframe>
</div>
```

### 完整示例 {#adflow-example}

::: tip
以下是一个最简化的完整页面示例，可直接复制使用。
:::

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
    <script src="https://assets.revosurge.com/js/adflow.min.js"
        data-account-id="your-account-id"></script>
</head>
<body>
    <h1>My Website</h1>

    <!-- 300x250 Ad Slot -->
    <iframe data-adflow-ad
        data-placement-id="placement-1"
        width="300" height="250"></iframe>

    <!-- 728x90 Ad Slot -->
    <iframe data-adflow-ad
        data-placement-id="placement-2"
        width="728" height="90"></iframe>

    <!-- Ad Slot with Preferred Deal -->
    <iframe data-adflow-ad
        data-placement-id="placement-3"
        data-deal-id="deal-001"
        width="970" height="250"></iframe>
</body>
</html>
```

::: info 调试
在 `<script>` 标签上添加 `data-debug` 属性可以在浏览器控制台查看 `[AdFlow]` 前缀的详细日志。也可以通过 `window.__adflow` 对象在控制台查看运行时配置和廣告位信息。
:::

### 診斷腳本 {#adflow-diagnostic}

如果你在使用 adflow.js 時遇到問題，可以在瀏覽器開發者控制台（DevTools → Console）中運行以下診斷腳本，快速定位常見問題：

```js
fetch('https://assets.revosurge.com/js/adflow.diagnostic.js').then(r=>r.text()).then(eval)
```

診斷腳本會檢查你的集成配置，並在控制台中輸出可操作的建議。

## adflow-tma.js（Telegram 小程序）{#adflow-tma-sdk}

adflow-tma.js 是專為 **Telegram 小程序（TMA）** 打造的廣告 SDK。它採用與 adflow.js 相同的 Prebid.js S2S 競價引擎，並針對 Telegram WebApp 環境進行了適配：從 `Telegram.WebApp` 讀取平台與設備信號、禁用 Cookie 同步（在 TMA 中無意義），並攔截廣告點擊事件，通過 `Telegram.WebApp.openLink()` 開啟外部鏈接。

::: tip 零依賴
adflow-tma.js 會自動加載 `telegram-web-app.js`（如尚未加載），無需額外添加腳本標籤。
:::

### 使用方式 {#adflow-tma-usage}

只需兩步即可完成接入：

**1. 引入 adflow-tma.js**

添加帶有賬號 ID 的腳本標籤：

```html
<script src="https://assets.revosurge.com/js/adflow-tma.min.js"
    data-account-id="your-account-id"></script>
```

**2. 放置廣告位**

在需要展示廣告的位置添加 `<iframe>` 標籤：

```html
<iframe data-adflow-ad
    data-placement-id="your-placement-id"
    width="320" height="50"></iframe>
```

### 腳本屬性 {#adflow-tma-script-attrs}

以下 data 屬性支持在 `<script>` 標籤上配置：

| 屬性 | 是否必填 | 默認值 | 說明 |
| --- | --- | --- | --- |
| `data-account-id` | 必填 | — | 賬號 ID |
| `data-server-url` | 可選 | `https://prebid-server.revosurge.com` | Prebid Server 地址 |
| `data-bidder` | 可選 | `revosurge` | Bidder 名稱 |
| `data-timeout` | 可選 | `3000` | S2S 超時時間（毫秒） |
| `data-prebid-url` | 可選 | jsdelivr CDN | 自定義 Prebid.js 地址 |
| `data-debug` | 可選 | — | 開啟調試模式（存在即生效，無需賦值） |

### 廣告位屬性 {#adflow-tma-iframe-attrs}

以下 data 屬性支持在 `<iframe>` 標籤上配置：

| 屬性 | 是否必填 | 默認值 | 說明 |
| --- | --- | --- | --- |
| `data-adflow-ad` | 必填 | — | 標記為廣告位（存在即生效，無需賦值） |
| `data-placement-id` | 必填 | — | 廣告位 ID，從 AdFlow 控制台獲取 |
| `data-floor` | 可選 | — | 單廣告位底價。有效數值將作為 `ortb2Imp.bidfloor` 傳遞。 |
| `data-deal-id` | 可選 | — | 優先交易 ID |
| `width` | 可選 | `320` | 廣告位寬度（像素） |
| `height` | 可選 | `50` | 廣告位高度（像素） |
| `data-adflow-responsive` | 可選 | — | 設為 `1` 時 iframe 在**父級容器**內橫向鋪滿（`width: 100%`）。你必須自行提供外層容器並編寫樣式（見下方[響應式佈局](#adflow-tma-responsive)） |

### 響應式佈局 {#adflow-tma-responsive}

與 [adflow.js](#adflow-responsive) 相同：使用 `data-adflow-responsive="1"` 時，iframe 會佔滿你所包裹它的父元素寬度。請自備容器與樣式；iframe 上的 `width`、`height` 仍用於聲明請求的廣告位尺寸。

```html
<style>
.your-ad-slot {
    width: 320px;
    height: 50px;
}
</style>
<div class="your-ad-slot">
    <iframe data-adflow-ad
        data-placement-id="your-placement-id"
        data-adflow-responsive="1"
        width="320"
        height="50"></iframe>
</div>
```

### 完整示例 {#adflow-tma-example}

::: tip
以下是一個最簡完整的 Telegram 小程序頁面示例，可直接複製使用。
:::

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Telegram Mini App</title>
    <script src="https://assets.revosurge.com/js/adflow-tma.min.js"
        data-account-id="your-account-id"></script>
</head>
<body>
    <h1>My Mini App</h1>

    <!-- 320x50 橫幅廣告 -->
    <iframe data-adflow-ad
        data-placement-id="placement-1"
        width="320" height="50"></iframe>

    <!-- 300x250 矩形廣告 -->
    <iframe data-adflow-ad
        data-placement-id="placement-2"
        width="300" height="250"></iframe>
</body>
</html>
```

::: info 調試
在 `<script>` 標籤上添加 `data-debug` 屬性可在瀏覽器控制台查看 `[AdFlow TMA]` 前綴的詳細日誌。也可通過 `window.__adflowTMA` 對象查看運行時配置和廣告位信息。
:::

### 在 tma.js SDK / @telegram-apps 包中使用 {#adflow-tma-tmajssdk}

如果你的小程序是使用 **tma.js 生態**（`@telegram-apps/sdk`、`@telegram-apps/sdk-react` 或 `@telegram-apps/sdk-vue`）開發的，推薦使用 **adflow-tma-modern.js** — 一個 UMD/ESM 模組，可通過編程式 API 直接接收 tma.js SDK 的值，無需 script 標籤注入或 DOM 掃描等變通方案。

::: tip 下載
`adflow-tma-modern.js` 與 `adflow-tma.js` 是獨立文件。可從 `https://assets.revosurge.com/js/adflow-tma-modern.js` 引用，或作為本地模組在打包工具項目中導入。
:::

在應用根部調用一次 `AdFlow.init()`，然後在組件掛載後調用 `AdFlow.requestAds()`，傳入廣告位描述符列表。

#### init() 參數

| 參數 | 是否必填 | 類型 | 說明 |
| --- | --- | --- | --- |
| `accountId` | 必填 | string | AdFlow 賬號 ID |
| `serverUrl` | 可選 | string | Prebid Server 地址（默認：`https://prebid-server.revosurge.com`） |
| `platform` | 可選 | string | 來自 `miniApp.platform()`，如 `'ios'`、`'android'` |
| `user` | 可選 | object | 來自 `initData.user()`，用於廣告定向與頻控 |
| `onReady` | 可選 | function | 初始化完成後調用一次。傳入 `() => miniApp.ready()` |
| `openLink` | 可選 | function | 用戶點擊廣告鏈接時調用。傳入 SDK 的 `openLink` |
| `timeout` | 可選 | number | 競價超時（毫秒，默認 `3000`） |
| `debug` | 可選 | boolean | 開啟控制台 `[AdFlow]` 詳細日誌 |

#### requestAds() 廣告位描述符

| 字段 | 是否必填 | 類型 | 說明 |
| --- | --- | --- | --- |
| `el` | 必填 | HTMLElement | 容器元素，AdFlow 將在其中創建並注入 `<iframe>` |
| `placementId` | 必填 | string | 廣告位 ID，從 AdFlow 控制台獲取 |
| `width` | 可選 | number | 廣告寬度（像素，默認 `320`） |
| `height` | 可選 | number | 廣告高度（像素，默認 `50`） |
| `floor` | 可選 | number | 底價（美元），作為 `ortb2Imp.bidfloor` 傳遞 |
| `dealId` | 可選 | string | 優先交易 ID |

#### React

```js
import { useEffect, useRef } from 'react';
import AdFlow from 'adflow-tma-modern.js';
import { miniApp, initData, openLink } from '@telegram-apps/sdk-react';

function AdBanner({ placementId, width = 320, height = 50 }) {
  const containerRef = useRef(null);

  useEffect(function() {
    AdFlow.init({
      accountId: 'your-account-id',
      platform:  miniApp.platform(),
      user:      initData.user(),
      onReady:   () => miniApp.ready(),
      openLink:  openLink,
    });

    AdFlow.requestAds([{
      el:          containerRef.current,
      placementId: placementId,
      width:       width,
      height:      height,
    }]);
  }, []);

  return <div ref={containerRef} style={{ width, height }} />;
}
```

::: info
`AdFlow.init()` 支持冪等調用——可安全多次調用。建議在應用根部調用一次，各 `AdBanner` 組件內只需調用 `requestAds()`。
:::

#### Vue 3

```vue
<template>
  <div ref="adContainer" :style="{ width: width + 'px', height: height + 'px' }" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AdFlow from 'adflow-tma-modern.js';
import { miniApp, initData, openLink } from '@telegram-apps/sdk-vue';

const props = defineProps({ placementId: String, width: { default: 320 }, height: { default: 50 } });
const adContainer = ref(null);

onMounted(function() {
  AdFlow.init({
    accountId: 'your-account-id',
    platform:  miniApp.platform(),
    user:      initData.user(),
    onReady:   () => miniApp.ready(),
    openLink:  openLink,
  });

  AdFlow.requestAds([{
    el:          adContainer.value,
    placementId: props.placementId,
    width:       props.width,
    height:      props.height,
  }]);
});
</script>
```

## S2S 配置接入 {#s2s-integration}

如果你需要更细粒度的控制，或者需要自定义 Prebid.js 的配置(如廣告格式、第一方数据、用户同步等)，可以使用手动 S2S 配置方式接入。此方式需要你在页面中引入 Prebid.js 并編寫竞价代码。

[S2S 調試器](/hk/adflow/s2s-debugger)

### 快速开始 {#quick-start}

#### 前置条件

- 已申请 AdFlow 账号并获取 Bid 参数
- 網站已部署，拥有可投放廣告的页面

#### 分步接入

**1. 引入 Prebid.js**

在页面 `<head>` 中加载 Prebid.js。推薦使用自定义构建(仅包含所需的 Bidder Adapter)，以减小文件体积。

```html
<!-- Option 1: CDN (for testing only, includes all adapters) -->
<script async src="https://cdn.jsdelivr.net/npm/prebid.js@latest/dist/not-for-prod/prebid.js"></script>

<!-- Option 2: Custom build (recommended for production) -->
<!-- Download from https://docs.prebid.org/download.html -->
<script async src="/js/prebid.js"></script>
```

**2. 定义廣告位**

在页面中放置廣告容器，`id` 需要与后续 Prebid.js 配置中的 `code` 一致。

```html
<!-- Ad containers -->
<div id="ad-slot-1"></div>
<div id="ad-slot-2"></div>
```

**3. 配置 Prebid.js**

初始化 Prebid.js 并添加廣告单元(Ad Units)，将 `placementId` 替换为你在 AdFlow 后台获取的值。

```js
var pbjs = pbjs || {};
pbjs.que = pbjs.que || [];

pbjs.que.push(function() {
    var adUnits = [{
        code: 'ad-slot-1',          // Matches the div id on the page
        mediaTypes: {
            banner: {
                sizes: [[300, 250], [336, 280]]
            }
        },
        bids: [{
            bidder: 'revosurge',
            params: {
                placementId: 'your-placement-id'  // Replace with your Placement ID
            }
        }]
    }];

    pbjs.addAdUnits(adUnits);

    pbjs.requestBids({
        timeout: 2000,
        bidsBackHandler: function() {
            // Bidding complete, send to ad server
            sendAdServerRequest();
        }
    });
});
```

**4. 渲染廣告**

竞价完成后，将中标廣告渲染到页面上。

```js
function sendAdServerRequest() {
    // If using GAM, refer to the "Ad Server Integration" section
    // Below is a simple rendering approach without an ad server
    var adSlots = ['ad-slot-1'];

    adSlots.forEach(function(slotId) {
        var highestBid = pbjs.getHighestCpmBids(slotId)[0];
        if (highestBid) {
            // Fire nurl callback to notify ad server of win
            if (highestBid.nurl) {
                var nurlWithPrice = highestBid.nurl.replace('${AUCTION_PRICE}', highestBid.cpm || 0);
                fetch(nurlWithPrice, { method: 'GET' }).catch(function() {});
            }

            var adContainer = document.getElementById(slotId);
            var iframe = document.createElement('iframe');
            iframe.style.cssText = 'border:0;width:' + highestBid.width + 'px;height:' + highestBid.height + 'px;';
            adContainer.appendChild(iframe);
            var iframeDoc = iframe.contentWindow.document;
            iframeDoc.write(highestBid.ad);
            iframeDoc.close();
        }
    });
}
```

#### 完整示例 {#full-example}

::: tip
以下是一个最简化的完整页面示例，可直接复制使用。
:::

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
    <script async src="https://cdn.jsdelivr.net/npm/prebid.js@latest/dist/not-for-prod/prebid.js"></script>
    <script>
        var pbjs = pbjs || {};
        pbjs.que = pbjs.que || [];

        pbjs.que.push(function() {
            pbjs.addAdUnits([{
                code: 'ad-slot-1',
                mediaTypes: {
                    banner: { sizes: [[300, 250]] }
                },
                bids: [{
                    bidder: 'revosurge',
                    params: { placementId: 'your-placement-id' }
                }]
            }]);

            pbjs.requestBids({
                timeout: 2000,
                bidsBackHandler: function() {
                    var bid = pbjs.getHighestCpmBids('ad-slot-1')[0];
                    if (bid) {
                        // Fire nurl to notify ad server
                        if (bid.nurl) {
                            fetch(bid.nurl.replace('${AUCTION_PRICE}', bid.cpm || 0)).catch(function() {});
                        }
                        var el = document.getElementById('ad-slot-1');
                        var f = document.createElement('iframe');
                        f.width = bid.width;
                        f.height = bid.height;
                        f.style.border = 'none';
                        el.appendChild(f);
                        f.contentWindow.document.write(bid.ad);
                        f.contentWindow.document.close();
                    }
                }
            });
        });
    </script>
</head>
<body>
    <h1>My Website</h1>
    <div id="ad-slot-1"></div>
</body>
</html>
```

### 廣告单元配置 {#ad-units}

Prebid.js 支持多种廣告格式。以下是 Revosurge Bidder 支持的格式和配置方式。

#### Banner 廣告 {#banner}

最常见的廣告格式，适用于固定尺寸的展示廣告。

```js
{
    code: 'banner-slot',
    mediaTypes: {
        banner: {
            sizes: [
                [300, 250],   // Medium Rectangle
                [336, 280],   // Large Rectangle
                [728, 90],    // Leaderboard
                [970, 250]    // Billboard
            ]
        }
    },
    bids: [{
        bidder: 'revosurge',
        params: {
            placementId: 'your-placement-id'
        }
    }]
}
```

#### 视频廣告 {#video}

适用于 Outstream 或 Instream 视频廣告。

```js
{
    code: 'video-slot',
    mediaTypes: {
        video: {
            playerSize: [640, 480],
            context: 'outstream',        // 'outstream' or 'instream'
            mimes: ['video/mp4', 'video/webm'],
            protocols: [1, 2, 3, 4, 5, 6],
            playbackmethod: [2],          // Auto-play muted
            maxduration: 30
        }
    },
    bids: [{
        bidder: 'revosurge',
        params: {
            placementId: 'your-video-placement-id'
        }
    }]
}
```

#### 原生廣告 {#native}

原生廣告与页面内容风格融合，提供更好的用户体验。

```js
{
    code: 'native-slot',
    mediaTypes: {
        native: {
            title:   { required: true, len: 80 },
            body:    { required: true, len: 200 },
            image:   { required: true, sizes: [300, 250] },
            icon:    { required: false, sizes: [50, 50] },
            cta:     { required: false },
            sponsoredBy: { required: true }
        }
    },
    bids: [{
        bidder: 'revosurge',
        params: {
            placementId: 'your-native-placement-id'
        }
    }]
}
```

#### 多格式廣告 {#multi-format}

单个廣告位支持多种格式，系统可自动选择最优廣告类型。

```js
{
    code: 'multi-format-slot',
    mediaTypes: {
        banner: { sizes: [[300, 250]] },
        video:  {
            playerSize: [300, 250],
            context: 'outstream',
            mimes: ['video/mp4']
        }
    },
    bids: [{
        bidder: 'revosurge',
        params: {
            placementId: 'your-multi-format-placement-id'
        }
    }]
}
```

### 服务器到服务器 (S2S) 模式 {#s2s-config}

#### S2S 概述 {#s2s-overview}

在 S2S 模式下，Prebid.js 不再从浏览器直接向各 Bidder 发送请求，而是将请求发送到 Prebid Server，由服务端完成竞价。优势包括：

- **更好的页面性能** — 减少浏览器端的 HTTP 请求
- **更低延迟** — 服务端网络比客户端更快
- **更好的隐私合规** — 减少客户端数据传输

#### S2S 配置 {#s2s-setup}

```js
pbjs.que.push(function() {
    pbjs.setConfig({
        s2sConfig: {
            accountId: 'your-account-id',
            bidders: ['revosurge'],
            adapter: 'prebidServer',
            enabled: true,
            endpoint: 'https://prebid-server.revosurge.com/openrtb2/auction',
            syncEndpoint: 'https://prebid-server.revosurge.com/cookie_sync',
            timeout: 3000
        }
    });
});
```

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `accountId` | String | 必填 | Revosurge 分配的账号 ID |
| `bidders` | Array | 必填 | 通过 S2S 使用的 Bidder 列表 |
| `adapter` | String | 必填 | 必须为 `'prebidServer'` |
| `enabled` | Boolean | 必填 | 设为 `true` 启用 S2S |
| `endpoint` | String | 必填 | Prebid Server 竞价接口 |
| `syncEndpoint` | String | 可选 | Cookie 同步接口 |
| `timeout` | Number | 可选 | S2S 请求超时(毫秒)，默认 `1000` |

::: info
在 S2S 模式下，廣告单元的 `bids` 配置保持不变。Prebid.js 会自动将 `s2sConfig.bidders` 中列出的 Bidder 请求转发到 Prebid Server。
:::

### 廣告伺服器整合（GAM） {#s2s-gam}

如果發布商使用 Google Ad Manager（GAM）管理廣告庫存，建議採用 Prebid.js + S2S + GPT 的接入方式。Revosurge 仍然透過 `s2sConfig` 參與競價，接著由 Prebid 將價格 key-values 寫入 GPT，最終由 GAM 決定實際返回並展示哪個 line item。

流程：

1. 先載入 GPT 和 Prebid.js，然後在頁面上定義 GAM 廣告位。
2. 在 GPT 中呼叫 `disableInitialLoad()`，避免廣告位過早發起請求。
3. 透過 `pbjs.setConfig({ s2sConfig })` 配置 Revosurge。
4. 競價完成後，呼叫 `pbjs.setTargetingForGPTAsync()` 寫入 header bidding 鍵值。
5. 最後呼叫 `googletag.pubads().refresh()`，由 GAM 返回最終廣告。

#### 範例：Prebid S2S + GAM Managed

```html
<!DOCTYPE html>
<html>
<head>
    <title>Prebid S2S + GAM</title>
    <script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"></script>
    <script async src="/js/prebid.js"></script>
</head>
<body>
    <div id="div-gpt-ad-1" style="min-width:300px;min-height:250px;"></div>

    <script>
        var PREBID_TIMEOUT = 3000;
        var FAILSAFE_TIMEOUT = 4000;

        window.googletag = window.googletag || { cmd: [] };
        window.pbjs = window.pbjs || {};
        pbjs.que = pbjs.que || [];

        var adUnits = [{
            code: 'div-gpt-ad-1',
            mediaTypes: {
                banner: {
                    sizes: [[300, 250]]
                }
            },
            bids: [{
                bidder: 'revosurge',
                params: {
                    placementId: 'your-placement-id'
                }
            }]
        }];

        googletag.cmd.push(function() {
            googletag.defineSlot('/1234567/example/banner', [[300, 250]], 'div-gpt-ad-1')
                .addService(googletag.pubads());

            googletag.pubads().disableInitialLoad();
            googletag.enableServices();
        });

        pbjs.que.push(function() {
            pbjs.setConfig({
                s2sConfig: {
                    accountId: 'your-account-id',
                    bidders: ['revosurge'],
                    adapter: 'prebidServer',
                    enabled: true,
                    endpoint: 'https://prebid-server.revosurge.com/openrtb2/auction',
                    syncEndpoint: 'https://prebid-server.revosurge.com/cookie_sync',
                    timeout: PREBID_TIMEOUT
                },
                userSync: {
                    iframeEnabled: true,
                    pixelEnabled: true
                }
            });

            pbjs.addAdUnits(adUnits);

            pbjs.requestBids({
                timeout: PREBID_TIMEOUT,
                bidsBackHandler: sendAdServerRequest
            });
        });

        function sendAdServerRequest() {
            if (sendAdServerRequest.called) return;
            sendAdServerRequest.called = true;

            googletag.cmd.push(function() {
                pbjs.que.push(function() {
                    pbjs.setTargetingForGPTAsync(['div-gpt-ad-1']);
                    googletag.pubads().refresh();
                });
            });
        }

        setTimeout(sendAdServerRequest, FAILSAFE_TIMEOUT);
    </script>
</body>
</html>
```

### 竞价参数 {#bidder-params}

Revosurge Bidder 支持以下参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `placementId` | String | 必填 | 廣告位 ID，在 AdFlow 后台创建廣告位后获取 |

示例：

```js
bids: [{
    bidder: 'revosurge',
    params: {
        placementId: 'abc123'
    }
}]
```

### Preferred Deal {#preferred-deal}

#### 概述 {#deal-overview}

Preferred Deal 是一种私有程序化购买安排(PMP - Private Marketplace)，允许发布商与特定廣告主或买方建立优先交易协议。在 Prebid.js 中配置 Preferred Deal 后，系统会优先匹配这些私有交易，同时仍参与公开竞价。

::: tip 优势
Preferred Deal 通常能获得更高的 CPM，同时保证廣告质量和品牌安全。
:::

#### 配置方式 {#deal-methods}

Prebid.js 支持两种配置 Preferred Deal 的方式：

**方式一：在 Bidder Params 中添加 dealId(简单方式)**

在 `bids` 的 `params` 中直接添加 `dealId` 参数：

```js
bids: [{
    bidder: 'revosurge',
    params: {
        placementId: 'your-placement-id',
        dealId: 'your-preferred-deal-id'  // Add Deal ID
    }
}]
```

**方式二：使用 ortb2Imp 配置 PMP**

使用 OpenRTB 标准的 `ortb2Imp.pmp` 对象进行配置，支持更丰富的参数和多个交易：

```js
{
    code: 'ad-slot-1',
    mediaTypes: {
        banner: {
            sizes: [[300, 250], [336, 280]]
        }
    },
    bids: [{
        bidder: 'revosurge',
        params: {
            placementId: 'your-placement-id'
        }
    }],
    ortb2Imp: {
        pmp: {
            private_auction: 0,  // 0=allow open auction, 1=private deals only
            deals: [{
                id: 'deal-12345',           // Deal ID (required)
                bidfloor: 5.0,              // Floor price (optional)
                bidfloorcur: 'USD',         // Floor currency (optional)
                at: 1,                      // Auction type: 1=first price, 2=second price
                wseat: ['advertiser-seat'], // Allowed buyer seats (optional)
                wadomain: ['advertiser.com'] // Allowed advertiser domains (optional)
            }]
        }
    }
}
```

**PMP 参数**

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `deals[].id` | String | 必填 | 交易 ID，由廣告主或 SSP 提供 |
| `deals[].bidfloor` | Number | 可选 | 底价；低于此价的出价将被拒绝 |
| `deals[].bidfloorcur` | String | 可选 | 底价货币(如 USD、CNY)，默认 USD |
| `deals[].at` | Number | 可选 | 竞价类型：1=第一价格，2=第二价格 |
| `private_auction` | Number | 可选 | 0=允许公开竞价，1=仅私有交易，默认 0 |
| `deals[].wseat` | Array | 可选 | 允许的买方席位白名单 |
| `deals[].wadomain` | Array | 可选 | 允许的廣告主域名白名单 |

#### 配置最佳实践

- **使用 ortb2Imp 方式** — 更标准化，支持高级功能
- **设置 private_auction: 0** — 允许 Preferred Deal 与公开竞价共同参与，提高填充率
- **配置多个 Deal** — 为同一廣告位设置多个交易以增加匹配机会
- **设置合理的底价** — bidfloor 应根据实际情况设置，过高会降低填充率
- **结合 S2S 使用** — Preferred Deal 在服务器到服务器模式下表现更好

### 高级配置 {#advanced}

#### 价格粒度 {#price-granularity}

价格粒度决定出价金额的舍入方式，影响 Line Item 数量和收入精度。

```js
pbjs.setConfig({
    priceGranularity: 'medium'  // 'low' | 'medium' | 'high' | 'auto' | 'dense' | custom
});
```

| 级别 | 范围 | 增量 |
| --- | --- | --- |
| `low` | $0 - $5 | $0.50 |
| `medium` | $0 - $20 | $0.10 |
| `high` | $0 - $20 | $0.01 |
| `auto` | $0 - $20 | 可变 |
| `dense` | $0 - $20 | 可变(更密集) |

#### 超时设置 {#timeout}

```js
pbjs.setConfig({
    bidderTimeout: 2000   // In milliseconds, recommended 1500-3000
});
```

::: info
超时设置过短可能导致 Bidder 无法及时响应(降低出价率)。设置过长可能影响用户体验。建议根据实际网络情况设置为 **1500-3000ms**。
:::

#### 用户同步 {#user-sync}

用户同步允许 Bidder 识别用户，提高竞价表现。

```js
pbjs.setConfig({
    userSync: {
        iframeEnabled: true,
        pixelEnabled: true,
        syncsPerBidder: 5,
        syncDelay: 3000,          // Delay sync 3 seconds after page load
        filterSettings: {
            iframe: {
                bidders: '*',         // Allow all bidders
                filter: 'include'
            }
        }
    }
});
```

#### 第一方数据 {#first-party-data}

传递站点级或用户级第一方数据，帮助 Bidder 更精准出价：

```js
pbjs.setConfig({
    ortb2: {
        site: {
            name: 'My Website',
            domain: 'example.com',
            cat: ['IAB1'],          // Site category
            content: {
                language: 'en'
            }
        },
        user: {
            keywords: 'sports,news'
        }
    }
});
```

### 测试与调试 {#testing}

**启用调试模式**

在浏览器控制台查看完整竞价过程：

```js
pbjs.setConfig({ debug: true });
```

也可通过添加 URL 参数启用：

```
https://your-website.com/?pbjs_debug=true
```

**使用 Prebid.js 控制台方法**

在浏览器开发者控制台中使用以下命令查看状态：

```js
// View all bid responses
pbjs.getBidResponses();

// View all winning bids
pbjs.getHighestCpmBids();

// View current configuration
pbjs.getConfig();

// View Ad Units
pbjs.adUnits;
```

**使用测试页面**

我们提供交互式测试页面 [S2S 調試器](/hk/adflow/s2s-debugger)，可用于：

- 验证 Prebid Server 连通性
- 测试 OpenRTB 竞价请求/响应
- 测试 Prebid.js S2S 集成
- 查看实时竞价日志

**常见检查项**

| 检查项 | 说明 |
| --- | --- |
| Prebid.js 是否加载？ | 在控制台运行 `pbjs.version` 检查版本 |
| 廣告单元是否配置正确？ | 检查 `pbjs.adUnits` 是否包含你定义的廣告位 |
| Bidder 是否响应？ | 在 Network 面板查看竞价请求和响应 |
| GAM 定向是否设置？ | 检查 GAM 请求参数是否包含 `hb_pb` 等键 |
| S2S 接口是否可达？ | 使用测试页面验证 Prebid Server 连通性 |

### 常见问题 {#faq}

**Q: 为什么收不到任何出价？**

常见原因：

1. `placementId` 错误或未在 AdFlow 后台激活
2. Prebid.js 构建中未包含 Revosurge Bidder Adapter
3. 超时设置过短(建议至少 2000ms)
4. 网络问题导致请求无法到达 Bidder

**Q: 如何在页面上配置多个廣告位？**

在 `adUnits` 数组中为每个廣告位添加一个对象，每个对象的 `code` 对应页面上的不同 `div id`：

```js
var adUnits = [
    { code: 'top-banner',    mediaTypes: { banner: { sizes: [[728, 90]] }},  bids: [{ bidder: 'revosurge', params: { placementId: 'pid-top' }}] },
    { code: 'sidebar-ad',    mediaTypes: { banner: { sizes: [[300, 250]] }}, bids: [{ bidder: 'revosurge', params: { placementId: 'pid-side' }}] },
    { code: 'article-bottom', mediaTypes: { banner: { sizes: [[970, 250]] }}, bids: [{ bidder: 'revosurge', params: { placementId: 'pid-bottom' }}] }
];
```

**Q: 如何提高填充率？**

- 通过提供更多 `sizes` 选项增加支持的廣告尺寸
- 适当延长超时时间
- 启用用户同步提高用户识别率
- 传递第一方数据帮助 Bidder 更精准出价

**Q: 配置 Preferred Deal 后为什么没有匹配？**

可能原因：

1. **Deal ID 错误** — 确认 Deal ID 与廣告主提供的一致
2. **底价设置过高** — `bidfloor` 高于廣告主出价会导致无法匹配
3. **交易未激活** — 联系廣告主确认交易已在其系统中激活
4. **private_auction 设置错误** — 设为 1 会排除公开竞价；建议设为 0
5. **白名单限制** — 检查 `wseat` 或 `wadomain` 是否配置正确

::: tip
启用调试模式(`pbjs.setConfig({debug: true})`)可在浏览器控制台查看详细的交易匹配日志。
:::

---

如需技术支持，请联系 Revosurge 技术团队。
