---
title: Publisher 接入文档
description: 接入 adflow.js 或 Prebid S2S 在网站投放广告。adflow.js（两行 HTML）或手动 S2S 配置分步指南。
---

# Publisher 接入文档

本文档介绍如何在你的网站中接入广告变现。我们提供两种接入方式：[adflow.js 一键接入](#adflow-sdk)（推荐，最简方式）和 [S2S 配置接入](#s2s-integration)（手动配置，更灵活）。

## 接入模式对比

| 对比维度 | adflow.js 一键接入 | S2S 配置接入 |
| --- | --- | --- |
| **接入难度** | 极简 — 两行 HTML 即可 | 中等 — 需编写 JS 代码 |
| **需要了解 Prebid.js** | 否 | 是 |
| **支持广告格式** | Banner | Banner / Video / Native / Multi-Format |
| **渲染方式** | iframe 自动渲染 | 灵活控制，支持自定义渲染 |
| **配置方式** | HTML data 属性 | Prebid.js API 完整配置 |
| **Preferred Deal** | 支持 | 支持 |
| **高级功能** | 基础配置 | Price Granularity、User Sync、First Party Data 等 |
| **推荐场景** | 快速上线、简单页面、无前端开发资源 | 生产环境、复杂需求、需要精细控制 |

## adflow.js 一键接入 {#adflow-sdk}

adflow.js 是一个自包含的 JavaScript SDK，将 Prebid.js S2S 竞价的所有逻辑封装在一个脚本中。客户只需引入一个 `<script>` 标签并在广告位放置 `<iframe>` 标签即可完成接入，无需手动加载 Prebid.js 或编写竞价代码。

[adflow.js 调试器](/cn/adflow/adflowjs-debugger) · <a href="/adflow/adflow.min.js" download="adflow.min.js">下载 adflow.min.js</a>

::: tip 推荐
如果你希望以最简方式快速接入，adflow.js 是最佳选择。无需了解 Prebid.js 的配置细节，两行 HTML 即可完成接入。
:::

### 使用方式 {#adflow-usage}

只需两步即可完成接入：

**1. 引入 adflow.js 脚本**

在页面中添加 `<script>` 标签，通过 data 属性配置全局参数：

```html
<script src="adflow.min.js"
    data-server-url="https://prebid-server.revosurge.com"
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

### 脚本属性 {#adflow-script-attrs}

以下是 `<script>` 标签支持的 data 属性：

| 属性 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `data-server-url` | 可选 | `https://prebid-server.revosurge.com` | Prebid Server 地址 |
| `data-account-id` | 必填 | — | 账号 ID |
| `data-bidder` | 可选 | `revosurge` | Bidder 名称 |
| `data-timeout` | 可选 | `3000` | S2S 超时时间（毫秒） |
| `data-prebid-url` | 可选 | jsdelivr CDN | 自定义 Prebid.js URL |
| `data-debug` | 可选 | — | 启用调试模式（添加此属性即可，无需赋值） |

### 广告位属性 {#adflow-iframe-attrs}

以下是 `<iframe>` 标签支持的 data 属性：

| 属性 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `data-adflow-ad` | 必填 | — | 标识这是一个广告位（无需赋值） |
| `data-placement-id` | 必填 | — | 广告位 ID，在 AdFlow 后台创建广告位后获取 |
| `width` | 可选 | `300` | 广告位宽度（像素） |
| `height` | 可选 | `250` | 广告位高度（像素） |
| `data-deal-id` | 可选 | — | Preferred Deal ID |

### 完整示例 {#adflow-example}

::: tip
以下是一个最简化的完整页面示例，可直接复制使用。
:::

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
    <script src="adflow.min.js"
        data-server-url="https://prebid-server.revosurge.com"
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
在 `<script>` 标签上添加 `data-debug` 属性可以在浏览器控制台查看 `[AdFlow]` 前缀的详细日志。也可以通过 `window.__adflow` 对象在控制台查看运行时配置和广告位信息。
:::

## S2S 配置接入 {#s2s-integration}

如果你需要更细粒度的控制，或者需要自定义 Prebid.js 的配置（如广告格式、第一方数据、用户同步等），可以使用手动 S2S 配置方式接入。此方式需要你在页面中引入 Prebid.js 并编写竞价代码。

[S2S 调试器](/cn/adflow/s2s-debugger)

### 快速开始 {#quick-start}

#### 前置条件

- 已申请 AdFlow 账号并获取 Bid 参数
- 网站已部署，拥有可投放广告的页面

#### 分步接入

**1. 引入 Prebid.js**

在页面 `<head>` 中加载 Prebid.js。推荐使用自定义构建（仅包含所需的 Bidder Adapter），以减小文件体积。

```html
<!-- Option 1: CDN (for testing only, includes all adapters) -->
<script async src="https://cdn.jsdelivr.net/npm/prebid.js@latest/dist/not-for-prod/prebid.js"></script>

<!-- Option 2: Custom build (recommended for production) -->
<!-- Download from https://docs.prebid.org/download.html -->
<script async src="/js/prebid.js"></script>
```

**2. 定义广告位**

在页面中放置广告容器，`id` 需要与后续 Prebid.js 配置中的 `code` 一致。

```html
<!-- Ad containers -->
<div id="ad-slot-1"></div>
<div id="ad-slot-2"></div>
```

**3. 配置 Prebid.js**

初始化 Prebid.js 并添加广告单元（Ad Units），将 `placementId` 替换为你在 AdFlow 后台获取的值。

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

**4. 渲染广告**

竞价完成后，将中标广告渲染到页面上。

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

### 广告单元配置 {#ad-units}

Prebid.js 支持多种广告格式。以下是 Revosurge Bidder 支持的格式和配置方式。

#### Banner 广告 {#banner}

最常见的广告格式，适用于固定尺寸的展示广告。

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

#### 视频广告 {#video}

适用于 Outstream 或 Instream 视频广告。

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

#### 原生广告 {#native}

原生广告与页面内容风格融合，提供更好的用户体验。

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

#### 多格式广告 {#multi-format}

单个广告位支持多种格式，系统可自动选择最优广告类型。

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
| `timeout` | Number | 可选 | S2S 请求超时（毫秒），默认 `1000` |

::: info
在 S2S 模式下，广告单元的 `bids` 配置保持不变。Prebid.js 会自动将 `s2sConfig.bidders` 中列出的 Bidder 请求转发到 Prebid Server。
:::

### 竞价参数 {#bidder-params}

Revosurge Bidder 支持以下参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `placementId` | String | 必填 | 广告位 ID，在 AdFlow 后台创建广告位后获取 |

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

Preferred Deal 是一种私有程序化购买安排（PMP - Private Marketplace），允许发布商与特定广告主或买方建立优先交易协议。在 Prebid.js 中配置 Preferred Deal 后，系统会优先匹配这些私有交易，同时仍参与公开竞价。

::: tip 优势
Preferred Deal 通常能获得更高的 CPM，同时保证广告质量和品牌安全。
:::

#### 配置方式 {#deal-methods}

Prebid.js 支持两种配置 Preferred Deal 的方式：

**方式一：在 Bidder Params 中添加 dealId（简单方式）**

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
| `deals[].id` | String | 必填 | 交易 ID，由广告主或 SSP 提供 |
| `deals[].bidfloor` | Number | 可选 | 底价；低于此价的出价将被拒绝 |
| `deals[].bidfloorcur` | String | 可选 | 底价货币（如 USD、CNY），默认 USD |
| `deals[].at` | Number | 可选 | 竞价类型：1=第一价格，2=第二价格 |
| `private_auction` | Number | 可选 | 0=允许公开竞价，1=仅私有交易，默认 0 |
| `deals[].wseat` | Array | 可选 | 允许的买方席位白名单 |
| `deals[].wadomain` | Array | 可选 | 允许的广告主域名白名单 |

#### 配置最佳实践

- **使用 ortb2Imp 方式** — 更标准化，支持高级功能
- **设置 private_auction: 0** — 允许 Preferred Deal 与公开竞价共同参与，提高填充率
- **配置多个 Deal** — 为同一广告位设置多个交易以增加匹配机会
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
| `dense` | $0 - $20 | 可变（更密集） |

#### 超时设置 {#timeout}

```js
pbjs.setConfig({
    bidderTimeout: 2000   // In milliseconds, recommended 1500-3000
});
```

::: info
超时设置过短可能导致 Bidder 无法及时响应（降低出价率）。设置过长可能影响用户体验。建议根据实际网络情况设置为 **1500-3000ms**。
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

我们提供交互式测试页面 [S2S 调试器](/cn/adflow/s2s-debugger)，可用于：

- 验证 Prebid Server 连通性
- 测试 OpenRTB 竞价请求/响应
- 测试 Prebid.js S2S 集成
- 查看实时竞价日志

**常见检查项**

| 检查项 | 说明 |
| --- | --- |
| Prebid.js 是否加载？ | 在控制台运行 `pbjs.version` 检查版本 |
| 广告单元是否配置正确？ | 检查 `pbjs.adUnits` 是否包含你定义的广告位 |
| Bidder 是否响应？ | 在 Network 面板查看竞价请求和响应 |
| GAM 定向是否设置？ | 检查 GAM 请求参数是否包含 `hb_pb` 等键 |
| S2S 接口是否可达？ | 使用测试页面验证 Prebid Server 连通性 |

### 常见问题 {#faq}

**Q: 为什么收不到任何出价？**

常见原因：

1. `placementId` 错误或未在 AdFlow 后台激活
2. Prebid.js 构建中未包含 Revosurge Bidder Adapter
3. 超时设置过短（建议至少 2000ms）
4. 网络问题导致请求无法到达 Bidder

**Q: 如何在页面上配置多个广告位？**

在 `adUnits` 数组中为每个广告位添加一个对象，每个对象的 `code` 对应页面上的不同 `div id`：

```js
var adUnits = [
    { code: 'top-banner',    mediaTypes: { banner: { sizes: [[728, 90]] }},  bids: [{ bidder: 'revosurge', params: { placementId: 'pid-top' }}] },
    { code: 'sidebar-ad',    mediaTypes: { banner: { sizes: [[300, 250]] }}, bids: [{ bidder: 'revosurge', params: { placementId: 'pid-side' }}] },
    { code: 'article-bottom', mediaTypes: { banner: { sizes: [[970, 250]] }}, bids: [{ bidder: 'revosurge', params: { placementId: 'pid-bottom' }}] }
];
```

**Q: 如何提高填充率？**

- 通过提供更多 `sizes` 选项增加支持的广告尺寸
- 适当延长超时时间
- 启用用户同步提高用户识别率
- 传递第一方数据帮助 Bidder 更精准出价

**Q: 配置 Preferred Deal 后为什么没有匹配？**

可能原因：

1. **Deal ID 错误** — 确认 Deal ID 与广告主提供的一致
2. **底价设置过高** — `bidfloor` 高于广告主出价会导致无法匹配
3. **交易未激活** — 联系广告主确认交易已在其系统中激活
4. **private_auction 设置错误** — 设为 1 会排除公开竞价；建议设为 0
5. **白名单限制** — 检查 `wseat` 或 `wadomain` 是否配置正确

::: tip
启用调试模式（`pbjs.setConfig({debug: true})`）可在浏览器控制台查看详细的交易匹配日志。
:::

---

如需技术支持，请联系 Revosurge 技术团队。
