---
title: adflow-tma.js（Telegram 小程式）
description: 使用適配 Telegram WebApp 的 AdFlow SDK。它從 Telegram 讀取平台與裝置信號，跳過 Cookie 同步，並透過 Telegram 開啟廣告外部連結。
---

# adflow-tma.js（Telegram 小程式） {#adflow-tma-sdk}

adflow-tma.js 是專為 **Telegram 小程序（TMA）** 打造的廣告 SDK。它採用與 adflow.js 相同的 Prebid.js S2S 競價引擎，並針對 Telegram WebApp 環境進行了適配：從 `Telegram.WebApp` 讀取平台與設備信號、禁用 Cookie 同步（在 TMA 中無意義），並攔截廣告點擊事件，通過 `Telegram.WebApp.openLink()` 開啟外部鏈接。

::: tip 零依賴
adflow-tma.js 會自動加載 `telegram-web-app.js`（如尚未加載），無需額外添加腳本標籤。
:::

## 使用方式 {#adflow-tma-usage}

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

## 腳本屬性 {#adflow-tma-script-attrs}

以下 data 屬性支持在 `<script>` 標籤上配置：

| 屬性 | 是否必填 | 默認值 | 說明 |
| --- | --- | --- | --- |
| `data-account-id` | 必填 | — | 賬號 ID |
| `data-server-url` | 可選 | `https://prebid-server.revosurge.com` | Prebid Server 地址 |
| `data-bidder` | 可選 | `revosurge` | Bidder 名稱 |
| `data-timeout` | 可選 | `3000` | S2S 超時時間（毫秒） |
| `data-prebid-url` | 可選 | jsdelivr CDN | 自定義 Prebid.js 地址 |
| `data-debug` | 可選 | — | 開啟調試模式（存在即生效，無需賦值） |

## 廣告位屬性 {#adflow-tma-iframe-attrs}

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

## 響應式佈局 {#adflow-tma-responsive}

與 [adflow.js](./adflow-sdk#adflow-responsive) 相同：使用 `data-adflow-responsive="1"` 時，iframe 會佔滿你所包裹它的父元素寬度。請自備容器與樣式；iframe 上的 `width`、`height` 仍用於聲明請求的廣告位尺寸。

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

## 完整示例 {#adflow-tma-example}

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

## 在 tma.js SDK / @telegram-apps 包中使用 {#adflow-tma-tmajssdk}

如果你的小程序是使用 **tma.js 生態**（`@telegram-apps/sdk`、`@telegram-apps/sdk-react` 或 `@telegram-apps/sdk-vue`）開發的，推薦使用 **adflow-tma-modern.js** — 一個 UMD/ESM 模組，可通過編程式 API 直接接收 tma.js SDK 的值，無需 script 標籤注入或 DOM 掃描等變通方案。

::: tip 下載
`adflow-tma-modern.js` 與 `adflow-tma.js` 是獨立文件。可從 `https://assets.revosurge.com/js/adflow-tma-modern.js` 引用，或作為本地模組在打包工具項目中導入。
:::

在應用根部調用一次 `AdFlow.init()`，然後在組件掛載後調用 `AdFlow.requestAds()`，傳入廣告位描述符列表。

### init() 參數

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

### requestAds() 廣告位描述符

| 字段 | 是否必填 | 類型 | 說明 |
| --- | --- | --- | --- |
| `el` | 必填 | HTMLElement | 容器元素，AdFlow 將在其中創建並注入 `<iframe>` |
| `placementId` | 必填 | string | 廣告位 ID，從 AdFlow 控制台獲取 |
| `width` | 可選 | number | 廣告寬度（像素，默認 `320`） |
| `height` | 可選 | number | 廣告高度（像素，默認 `50`） |
| `floor` | 可選 | number | 底價（美元），作為 `ortb2Imp.bidfloor` 傳遞 |
| `dealId` | 可選 | string | 優先交易 ID |

### React

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

### Vue 3

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
