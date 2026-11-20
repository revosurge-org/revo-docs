---
title: adflow.js 一键接入
description: 在网页中加入脚本和 iframe 广告位，由 SDK 自动竞价和渲染。支持 Banner、Pop、Push、In-page Push 和 Native。
---

# adflow.js 一键接入 {#adflow-sdk}

adflow.js 是一个自包含的 JavaScript SDK，将 Prebid.js S2S 竞价的所有逻辑封装在一个脚本中。客户只需引入一个 `<script>` 标签并在广告位放置 `<iframe>` 标签即可完成接入，无需手动加载 Prebid.js 或编写竞价代码。支持 **Banner**（横幅）、**Pop**（弹窗）、**Push**（推送通知）、**In-page Push**（页内推送）、**Native**（原生信息流）五种广告类型，通过广告位上的 `data-ad-type` 属性切换。

[Banner 调试器](/cn/adflow/banner-debugger) · [Pop 调试器](/cn/adflow/pop-debugger) · [Push 调试器](/cn/adflow/push-debugger) · [In-page Push 调试器](/cn/adflow/inpage-push-debugger) · [Native 调试器](/cn/adflow/native-debugger)

::: tip 推荐
如果你希望以最简方式快速接入，adflow.js 是最佳选择。无需了解 Prebid.js 的配置细节，两行 HTML 即可完成接入。
:::

## 使用方式 {#adflow-usage}

只需两步即可完成接入：

**1. 引入 adflow.js 脚本**

在页面中添加 `<script>` 标签，通过 data 属性配置全局参数：

```html
<script src="https://assets.revosurge.com/js/adflow.min.js"
    data-account-id="your-account-id"></script>
```

**2. 放置广告位**

在需要展示广告的位置添加 `<iframe>` 标签：

```html
<iframe data-adflow-ad
    data-placement-id="your-placement-id"
    width="300" height="250"></iframe>
```

adflow.js 会自动完成以下工作：加载 Prebid.js → 配置 S2S → 发现页面上的广告位 → 发起竞价 → 渲染中标广告。

## 广告类型 {#adflow-ad-types}

adflow.js 支持五种广告类型，脚本引入方式完全相同，区别仅在于广告位 `<iframe>` 上的 `data-ad-type` 属性。

### Banner（默认） {#adflow-type-banner}

标准页内横幅广告，中标后直接在 `<iframe>` 内渲染广告创意。不指定 `data-ad-type` 时即为 Banner，通过 `width` / `height` 指定广告尺寸。

```html
<iframe data-adflow-ad
    data-placement-id="your-placement-id"
    width="300" height="250"></iframe>
```

### Pop（弹窗 / Popunder） {#adflow-type-pop}

添加 `data-ad-type="pop"` 即可。Pop 广告**不在页面内渲染**：竞价成功后，会在用户**首次点击页面任意位置**时，于后台打开中标广告（popunder 弹窗）—— 浏览器要求 `window.open()` 必须在用户手势中触发，且每个页面仅触发一次。Pop 广告位无需设置 `width` / `height`。

```html
<iframe data-adflow-ad
    data-placement-id="your-placement-id"
    data-ad-type="pop"></iframe>
```

[Pop 调试器](/cn/adflow/pop-debugger)

### Push（推送通知） {#adflow-type-push}

添加 `data-ad-type="push"` 即可。Push 广告同样**不在页面内渲染**，而是通过浏览器 `Notification API` 弹出系统推送通知：标题、正文、图标均来自广告创意，点击通知即打开落地页。需用户**授予通知权限**（浏览器仅在用户手势 + HTTPS 安全上下文下才会弹出授权请求）。Push 广告位无需设置 `width` / `height`，通知图标固定按 192×192 请求。

```html
<iframe data-adflow-ad
    data-placement-id="your-placement-id"
    data-ad-type="push"></iframe>
```

[Push 调试器](/cn/adflow/push-debugger)

::: info 关闭通知弹窗
Push 广告默认会弹出浏览器通知。如只想接收竞价而不弹通知，可在 `<script>` 标签上添加 `data-push-notification="false"`。
:::

### In-page Push（页内推送） {#adflow-type-inpage-push}

添加 `data-ad-type="inpage-push"` 即可。竞价请求与 Push 相同（图片 + 标题 + 正文的原生格式），但**不弹系统通知、无需任何授权**：中标后 adflow.js 直接在**页面居中位置**渲染一个广告弹窗卡片 —— 图片全宽在上、标题正文在下、右上角带关闭按钮，点击卡片即打开落地页。`width` / `height` 定义请求的图片尺寸，不设置时默认 **492×328**。

```html
<iframe data-adflow-ad
    data-placement-id="your-placement-id"
    data-ad-type="inpage-push"
    width="492" height="328"></iframe>
```

[In-page Push 调试器](/cn/adflow/inpage-push-debugger)

### Native（原生信息流） {#adflow-type-native}

添加 `data-ad-type="native"` 即可。竞价请求与 Push 相同（图片 + 标题 + 正文的原生格式），但广告**不弹窗**：中标后 adflow.js 会在**广告位所在位置**直接插入一张广告卡片 —— 图片在上、标题正文在下、**无关闭按钮**，与页面内容自然融合，点击卡片即打开落地页。无需任何通知授权。`width` / `height` 定义请求的图片尺寸，不设置时默认 **492×328**。

```html
<iframe data-adflow-ad
    data-placement-id="your-placement-id"
    data-ad-type="native"
    width="492" height="328"></iframe>
```

[Native 调试器](/cn/adflow/native-debugger)

## 脚本属性 {#adflow-script-attrs}

以下是 `<script>` 标签支持的 data 属性：

| 属性 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `data-server-url` | 可选 | `https://prebid-server.revosurge.com` | Prebid Server 地址 |
| `data-account-id` | 必填 | — | 账号 ID |
| `data-bidder` | 可选 | `revosurge` | Bidder 名称 |
| `data-timeout` | 可选 | `3000` | S2S 超时时间(毫秒) |
| `data-prebid-url` | 可选 | jsdelivr CDN | 自定义 Prebid.js URL |
| `data-debug` | 可选 | — | 启用调试模式(添加此属性即可，无需赋值) |
| `data-push-notification` | 可选 | `true` | Push 广告中标后是否弹出浏览器通知；设为 `false` 可关闭 |

## 广告位属性 {#adflow-iframe-attrs}

以下是 `<iframe>` 标签支持的 data 属性：

| 属性 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `data-adflow-ad` | 必填 | — | 标识这是一个广告位(无需赋值) |
| `data-placement-id` | 必填 | — | 广告位 ID，在 AdFlow 后台创建广告位后获取 |
| `data-ad-type` | 可选 | `banner` | 广告类型：`banner`（默认）、`pop`（弹窗）、`push`（推送通知）、`inpage-push`（页内推送）、`native`（原生信息流） |
| `width` | 可选 | `300` / `492` | 广告位宽度(像素)。`banner` 为创意尺寸（默认 300）；`inpage-push` / `native` 为请求的图片宽度（默认 492） |
| `height` | 可选 | `250` / `328` | 广告位高度(像素)。`banner` 为创意尺寸（默认 250）；`inpage-push` / `native` 为请求的图片高度（默认 328） |
| `data-adflow-responsive` | 可选 | — | 设为 `1` 时 iframe 在**父级容器**内横向铺满（`width: 100%`）。你必须自行提供外层容器并编写样式（见下方[响应式布局](#adflow-responsive)） |
| `data-deal-id` | 可选 | — | Preferred Deal ID |

## 响应式布局 {#adflow-responsive}

`data-adflow-responsive="1"` 只影响 `<iframe>` 在页面里的**横向**展示：它会占满**直接父元素**的宽度。AdFlow **不会**替你生成外层布局盒子。你需要用自有元素（例如 `<div>`）包裹 iframe，并用 CSS 设置宽度、高度、`max-width`、居中、断点等，使广告位符合你的版式。

请继续在 iframe 上保留 `width` 和 `height` 属性，以便 SDK 按正确尺寸请求创意；外层容器则决定页面上实际占用的横向空间。

**固定尺寸广告位（例如 728×90）**

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

**随容器变宽并限制最大宽度**

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

## 完整示例 {#adflow-example}

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

    <!-- Pop 弹窗广告（无需 width/height） -->
    <iframe data-adflow-ad
        data-placement-id="placement-4"
        data-ad-type="pop"></iframe>

    <!-- Push 推送通知广告（无需 width/height） -->
    <iframe data-adflow-ad
        data-placement-id="placement-5"
        data-ad-type="push"></iframe>

    <!-- In-page Push 页内推送广告（width/height 可选，默认 492×328） -->
    <iframe data-adflow-ad
        data-placement-id="placement-6"
        data-ad-type="inpage-push"></iframe>

    <!-- Native 原生广告（卡片在此位置内嵌渲染；width/height 可选，默认 492×328） -->
    <iframe data-adflow-ad
        data-placement-id="placement-7"
        data-ad-type="native"></iframe>
</body>
</html>
```

::: info 调试
在 `<script>` 标签上添加 `data-debug` 属性可以在浏览器控制台查看 `[AdFlow]` 前缀的详细日志。也可以通过 `window.__adflow` 对象在控制台查看运行时配置和广告位信息。
:::

安装检查未收到匹配请求？请按[安装检查失败 QA](./install-check-qa) 中的步骤排查。

## 诊断脚本 {#adflow-diagnostic}

如果你在使用 adflow.js 时遇到问题，可以在浏览器开发者控制台（DevTools → Console）中运行以下诊断脚本，快速定位常见问题：

```js
fetch('https://assets.revosurge.com/js/adflow.diagnostic.js').then(r=>r.text()).then(eval)
```

诊断脚本会检查你的集成配置，并在控制台中输出可操作的建议。
