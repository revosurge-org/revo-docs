---
title: adflow-tma.js（Telegram 小程序）
description: 使用适配 Telegram WebApp 的 AdFlow SDK。它从 Telegram 读取平台与设备信号，跳过 Cookie 同步，并通过 Telegram 打开广告外链。
---

# adflow-tma.js（Telegram 小程序） {#adflow-tma-sdk}

adflow-tma.js 是专为 **Telegram 小程序（TMA）** 打造的广告 SDK。它采用与 adflow.js 相同的 Prebid.js S2S 竞价引擎，并针对 Telegram WebApp 环境进行了适配：从 `Telegram.WebApp` 读取平台与设备信号、禁用 Cookie 同步（在 TMA 中无意义），并拦截广告点击事件，通过 `Telegram.WebApp.openLink()` 打开外部链接。

::: tip 零依赖
adflow-tma.js 会自动加载 `telegram-web-app.js`（如尚未加载），无需额外添加脚本标签。
:::

## 使用方式 {#adflow-tma-usage}

只需两步即可完成接入：

**1. 引入 adflow-tma.js**

添加带有账号 ID 的脚本标签：

```html
<script src="https://assets.revosurge.com/js/adflow-tma.min.js"
    data-account-id="your-account-id"></script>
```

**2. 放置广告位**

在需要展示广告的位置添加 `<iframe>` 标签：

```html
<iframe data-adflow-ad
    data-placement-id="your-placement-id"
    width="320" height="50"></iframe>
```

## 脚本属性 {#adflow-tma-script-attrs}

以下 data 属性支持在 `<script>` 标签上配置：

| 属性 | 是否必填 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `data-account-id` | 必填 | — | 账号 ID |
| `data-server-url` | 可选 | `https://prebid-server.revosurge.com` | Prebid Server 地址 |
| `data-bidder` | 可选 | `revosurge` | Bidder 名称 |
| `data-timeout` | 可选 | `3000` | S2S 超时时间（毫秒） |
| `data-prebid-url` | 可选 | jsdelivr CDN | 自定义 Prebid.js 地址 |
| `data-debug` | 可选 | — | 开启调试模式（存在即生效，无需赋值） |

## 广告位属性 {#adflow-tma-iframe-attrs}

以下 data 属性支持在 `<iframe>` 标签上配置：

| 属性 | 是否必填 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `data-adflow-ad` | 必填 | — | 标记为广告位（存在即生效，无需赋值） |
| `data-placement-id` | 必填 | — | 广告位 ID，从 AdFlow 控制台获取 |
| `data-floor` | 可选 | — | 单广告位底价。有效数值将作为 `ortb2Imp.bidfloor` 传递。 |
| `data-deal-id` | 可选 | — | 优先交易 ID |
| `width` | 可选 | `320` | 广告位宽度（像素） |
| `height` | 可选 | `50` | 广告位高度（像素） |
| `data-adflow-responsive` | 可选 | — | 设为 `1` 时 iframe 在**父级容器**内横向铺满（`width: 100%`）。你必须自行提供外层容器并编写样式（见下方[响应式布局](#adflow-tma-responsive)） |

## 响应式布局 {#adflow-tma-responsive}

与 [adflow.js](./adflow-sdk#adflow-responsive) 相同：使用 `data-adflow-responsive="1"` 时，iframe 会占满你所包裹它的父元素宽度。请自备容器与样式；iframe 上的 `width`、`height` 仍用于声明请求的广告位尺寸。

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
以下是一个最简完整的 Telegram 小程序页面示例，可直接复制使用。
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

    <!-- 320x50 横幅广告 -->
    <iframe data-adflow-ad
        data-placement-id="placement-1"
        width="320" height="50"></iframe>

    <!-- 300x250 矩形广告 -->
    <iframe data-adflow-ad
        data-placement-id="placement-2"
        width="300" height="250"></iframe>
</body>
</html>
```

::: info 调试
在 `<script>` 标签上添加 `data-debug` 属性可在浏览器控制台查看 `[AdFlow TMA]` 前缀的详细日志。也可通过 `window.__adflowTMA` 对象查看运行时配置和广告位信息。
:::

## 在 tma.js SDK / @telegram-apps 包中使用 {#adflow-tma-tmajssdk}

如果你的小程序是使用 **tma.js 生态**（`@telegram-apps/sdk`、`@telegram-apps/sdk-react` 或 `@telegram-apps/sdk-vue`）开发的，推荐使用 **adflow-tma-modern.js** — 一个 UMD/ESM 模块，可通过编程式 API 直接接收 tma.js SDK 的值，无需 script 标签注入或 DOM 扫描等变通方案。

::: tip 下载
`adflow-tma-modern.js` 与 `adflow-tma.js` 是独立文件。可从 `https://assets.revosurge.com/js/adflow-tma-modern.js` 引用，或作为本地模块在打包工具项目中导入。
:::

在应用根部调用一次 `AdFlow.init()`，然后在组件挂载后调用 `AdFlow.requestAds()`，传入广告位描述符列表。

### init() 参数

| 参数 | 是否必填 | 类型 | 说明 |
| --- | --- | --- | --- |
| `accountId` | 必填 | string | AdFlow 账号 ID |
| `serverUrl` | 可选 | string | Prebid Server 地址（默认：`https://prebid-server.revosurge.com`） |
| `platform` | 可选 | string | 来自 `miniApp.platform()`，如 `'ios'`、`'android'` |
| `user` | 可选 | object | 来自 `initData.user()`，用于广告定向与频控 |
| `onReady` | 可选 | function | 初始化完成后调用一次。传入 `() => miniApp.ready()` |
| `openLink` | 可选 | function | 用户点击广告链接时调用。传入 SDK 的 `openLink` |
| `timeout` | 可选 | number | 竞价超时（毫秒，默认 `3000`） |
| `debug` | 可选 | boolean | 开启控制台 `[AdFlow]` 详细日志 |

### requestAds() 广告位描述符

| 字段 | 是否必填 | 类型 | 说明 |
| --- | --- | --- | --- |
| `el` | 必填 | HTMLElement | 容器元素，AdFlow 将在其中创建并注入 `<iframe>` |
| `placementId` | 必填 | string | 广告位 ID，从 AdFlow 控制台获取 |
| `width` | 可选 | number | 广告宽度（像素，默认 `320`） |
| `height` | 可选 | number | 广告高度（像素，默认 `50`） |
| `floor` | 可选 | number | 底价（美元），作为 `ortb2Imp.bidfloor` 传递 |
| `dealId` | 可选 | string | 优先交易 ID |

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
`AdFlow.init()` 支持幂等调用——可安全多次调用。建议在应用根部调用一次，各 `AdBanner` 组件内只需调用 `requestAds()`。
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
