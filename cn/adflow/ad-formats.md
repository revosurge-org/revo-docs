---
pageClass: adflow-doc-page
---

# 广告格式与尺寸

选择实际接入环境和广告位置能承载的格式。各接入方式如何配置、支持哪些格式，以<a href="./choose-integration">对应的接入指南</a>为准。

<div aria-label="表格" class="adflow-table" role="region" tabindex="0"><table>
<thead>
<tr>
<th>格式</th>
<th>常见用法</th>
</tr>
</thead>
<tbody>
<tr>
<td>Banner</td>
<td>页面中的固定尺寸广告位，先确认放置区域的宽高。</td>
</tr>
<tr>
<td>Native</td>
<td>以信息流等形式融入页面内容。</td>
</tr>
<tr>
<td>In-page Push</td>
<td>在页面里展示通知样式的广告。</td>
</tr>
<tr>
<td>Pop</td>
<td>按接入指南所述的交互要求触发。</td>
</tr>
<tr>
<td>Push</td>
<td>按接入指南配置，并检查浏览器相关授权和限制。</td>
</tr>
</tbody>
</table></div>

## Banner 尺寸

以下为本期拟补齐的尺寸，按宽 × 高（px）展示。创建时以界面可选项为准，横竖版位按对应顺序选择宽度和高度。

<div aria-label="Banner 本期拟支持尺寸，宽乘高，单位像素" class="adflow-banner-sizes" role="group">
<div class="banner-size-group">
<strong class="banner-size-label" id="banner-size-wide">横向</strong>
<ul aria-labelledby="banner-size-wide" class="banner-size-values">
<li>300×50</li><li>320×50</li><li>300×100</li><li>320×100</li><li>468×60</li><li>728×90</li><li>900×250</li><li>970×250</li><li>480×320</li>
</ul>
</div>
<div class="banner-size-group">
<strong class="banner-size-label" id="banner-size-box">方形与近方形</strong>
<ul aria-labelledby="banner-size-box" class="banner-size-values">
<li>200×200</li><li>250×250</li><li>300×250</li><li>320×250</li><li>336×280</li><li>300×300</li>
</ul>
</div>
<div class="banner-size-group">
<strong class="banner-size-label" id="banner-size-tall">纵向</strong>
<ul aria-labelledby="banner-size-tall" class="banner-size-values">
<li>120×600</li><li>160×600</li><li>300×600</li><li>320×480</li><li>768×1024</li>
</ul>
</div>
</div>

创建后打开广告位详情核对宽高。接入需要配置 GAM 广告单元或 Prebid.js 广告位时，按该指南检查尺寸映射。
