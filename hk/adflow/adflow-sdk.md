---
title: adflow.js 一鍵接入
description: 在網頁中加入指令碼和 iframe 廣告版位，由 SDK 自動競價和渲染。支援 Banner、Pop、Push、In-page Push 和 Native。
---

# adflow.js 一鍵接入 {#adflow-sdk}

adflow.js 是一个自包含的 JavaScript SDK，将 Prebid.js S2S 竞价的所有逻辑封装在一个脚本中。客户只需引入一个 `<script>` 标签并在廣告位放置 `<iframe>` 标签即可完成接入，无需手动加载 Prebid.js 或編寫竞价代码。支持 **Banner**（橫幅）、**Pop**（彈窗）、**Push**（推送通知）、**In-page Push**（頁內推送）、**Native**（原生資訊流）五種廣告類型，通過廣告位上的 `data-ad-type` 屬性切換。

[Banner 調試器](/hk/adflow/banner-debugger) · [Pop 調試器](/hk/adflow/pop-debugger) · [Push 調試器](/hk/adflow/push-debugger) · [In-page Push 調試器](/hk/adflow/inpage-push-debugger) · [Native 調試器](/hk/adflow/native-debugger)

::: tip 推薦
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

**2. 放置廣告位**

在需要展示廣告的位置添加 `<iframe>` 标签：

```html
<iframe data-adflow-ad
    data-placement-id="your-placement-id"
    width="300" height="250"></iframe>
```

adflow.js 会自动完成以下工作：加载 Prebid.js → 配置 S2S → 发现页面上的廣告位 → 发起竞价 → 渲染中标廣告。

## 廣告類型 {#adflow-ad-types}

adflow.js 支持五種廣告類型，腳本引入方式完全相同，區別僅在於廣告位 `<iframe>` 上的 `data-ad-type` 屬性。

### Banner（默認） {#adflow-type-banner}

標準頁內橫幅廣告，中標後直接在 `<iframe>` 內渲染廣告創意。不指定 `data-ad-type` 時即為 Banner，通過 `width` / `height` 指定廣告尺寸。

```html
<iframe data-adflow-ad
    data-placement-id="your-placement-id"
    width="300" height="250"></iframe>
```

### Pop（彈窗 / Popunder） {#adflow-type-pop}

添加 `data-ad-type="pop"` 即可。Pop 廣告**不在頁面內渲染**：競價成功後，會在用戶**首次點擊頁面任意位置**時，於後台打開中標廣告（popunder 彈窗）—— 瀏覽器要求 `window.open()` 必須在用戶手勢中觸發，且每個頁面僅觸發一次。Pop 廣告位無需設置 `width` / `height`。

```html
<iframe data-adflow-ad
    data-placement-id="your-placement-id"
    data-ad-type="pop"></iframe>
```

[Pop 調試器](/hk/adflow/pop-debugger)

### Push（推送通知） {#adflow-type-push}

添加 `data-ad-type="push"` 即可。Push 廣告同樣**不在頁面內渲染**，而是通過瀏覽器 `Notification API` 彈出系統推送通知：標題、正文、圖標均來自廣告創意，點擊通知即打開落地頁。需用戶**授予通知權限**（瀏覽器僅在用戶手勢 + HTTPS 安全上下文下才會彈出授權請求）。Push 廣告位無需設置 `width` / `height`，通知圖標固定按 192×192 請求。

```html
<iframe data-adflow-ad
    data-placement-id="your-placement-id"
    data-ad-type="push"></iframe>
```

[Push 調試器](/hk/adflow/push-debugger)

::: info 關閉通知彈窗
Push 廣告默認會彈出瀏覽器通知。如只想接收競價而不彈通知，可在 `<script>` 標籤上添加 `data-push-notification="false"`。
:::

### In-page Push（頁內推送） {#adflow-type-inpage-push}

添加 `data-ad-type="inpage-push"` 即可。競價請求與 Push 相同（圖片 + 標題 + 正文的原生格式），但**不彈系統通知、無需任何授權**：中標後 adflow.js 直接在**頁面居中位置**渲染一個廣告彈窗卡片 —— 圖片全寬在上、標題正文在下、右上角帶關閉按鈕，點擊卡片即打開落地頁。`width` / `height` 定義請求的圖片尺寸，不設置時默認 **492×328**。

```html
<iframe data-adflow-ad
    data-placement-id="your-placement-id"
    data-ad-type="inpage-push"
    width="492" height="328"></iframe>
```

[In-page Push 調試器](/hk/adflow/inpage-push-debugger)

### Native（原生資訊流） {#adflow-type-native}

添加 `data-ad-type="native"` 即可。競價請求與 Push 相同（圖片 + 標題 + 正文的原生格式），但廣告**不彈窗**：中標後 adflow.js 會在**廣告位所在位置**直接插入一張廣告卡片 —— 圖片在上、標題正文在下、**無關閉按鈕**，與頁面內容自然融合，點擊卡片即打開落地頁。無需任何通知授權。`width` / `height` 定義請求的圖片尺寸，不設置時默認 **492×328**。

```html
<iframe data-adflow-ad
    data-placement-id="your-placement-id"
    data-ad-type="native"
    width="492" height="328"></iframe>
```

[Native 調試器](/hk/adflow/native-debugger)

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
| `data-push-notification` | 可选 | `true` | Push 廣告中標後是否彈出瀏覽器通知；設為 `false` 可關閉 |

## 廣告位属性 {#adflow-iframe-attrs}

以下是 `<iframe>` 标签支持的 data 属性：

| 属性 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `data-adflow-ad` | 必填 | — | 标识这是一个廣告位(无需赋值) |
| `data-placement-id` | 必填 | — | 廣告位 ID，在 AdFlow 后台创建廣告位后获取 |
| `data-ad-type` | 可选 | `banner` | 廣告類型：`banner`（默認）、`pop`（彈窗）、`push`（推送通知）、`inpage-push`（頁內推送）、`native`（原生資訊流） |
| `width` | 可选 | `300` / `492` | 廣告位宽度(像素)。`banner` 為創意尺寸（默認 300）；`inpage-push` / `native` 為請求的圖片寬度（默認 492） |
| `height` | 可选 | `250` / `328` | 廣告位高度(像素)。`banner` 為創意尺寸（默認 250）；`inpage-push` / `native` 為請求的圖片高度（默認 328） |
| `data-adflow-responsive` | 可选 | — | 設為 `1` 時 iframe 在**父級容器**內橫向鋪滿（`width: 100%`）。你必須自行提供外層容器並編寫樣式（見下方[響應式佈局](#adflow-responsive)） |
| `data-deal-id` | 可选 | — | Preferred Deal ID |

## 響應式佈局 {#adflow-responsive}

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

    <!-- Pop 彈窗廣告（無需 width/height） -->
    <iframe data-adflow-ad
        data-placement-id="placement-4"
        data-ad-type="pop"></iframe>

    <!-- Push 推送通知廣告（無需 width/height） -->
    <iframe data-adflow-ad
        data-placement-id="placement-5"
        data-ad-type="push"></iframe>

    <!-- In-page Push 頁內推送廣告（width/height 可選，默認 492×328） -->
    <iframe data-adflow-ad
        data-placement-id="placement-6"
        data-ad-type="inpage-push"></iframe>

    <!-- Native 原生廣告（卡片在此位置內嵌渲染；width/height 可選，默認 492×328） -->
    <iframe data-adflow-ad
        data-placement-id="placement-7"
        data-ad-type="native"></iframe>
</body>
</html>
```

::: info 调试
在 `<script>` 标签上添加 `data-debug` 属性可以在浏览器控制台查看 `[AdFlow]` 前缀的详细日志。也可以通过 `window.__adflow` 对象在控制台查看运行时配置和廣告位信息。
:::

安裝檢查未收到匹配請求？請按[安裝代碼失敗 QA](./install-check-qa) 中的步驟排查。

## 診斷腳本 {#adflow-diagnostic}

如果你在使用 adflow.js 時遇到問題，可以在瀏覽器開發者控制台（DevTools → Console）中運行以下診斷腳本，快速定位常見問題：

```js
fetch('https://assets.revosurge.com/js/adflow.diagnostic.js').then(r=>r.text()).then(eval)
```

診斷腳本會檢查你的集成配置，並在控制台中輸出可操作的建議。
