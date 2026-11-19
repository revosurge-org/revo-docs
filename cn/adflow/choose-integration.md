# 选择接入方式

从你已有的广告技术栈出发。每条指南包含所需的配置和验证步骤。

## 网站接入

<div aria-label="表格" class="adflow-table" role="region" tabindex="0"><table>
<thead>
<tr>
<th>你的情况</th>
<th>进入指南</th>
</tr>
</thead>
<tbody>
<tr>
<td>可以直接编辑网页，想安装一段 AdFlow 代码</td>
<td><a href="./adflow-sdk">网站直接安装 AdFlow JS Tag</a></td>
</tr>
<tr>
<td>需要用 Prebid.js 自行配置 AdFlow S2S 竞价</td>
<td><a href="./s2s-integration">网站通过 Prebid.js 接入 AdFlow S2S</a></td>
</tr>
</tbody>
</table></div>

## 自有 GAM {#gam}

<div aria-label="表格" class="adflow-table" role="region" tabindex="0"><table>
<thead>
<tr>
<th>你的情况</th>
<th>进入指南</th>
</tr>
</thead>
<tbody>
<tr>
<td>已有 GAM，网页用 Prebid.js 做竞价</td>
<td><a href="./gam-prebid">自有 GAM + Prebid.js</a></td>
</tr>
<tr>
<td>已有 GAM，希望通过 GAM 创意调用 AdFlow JS Tag</td>
<td><a href="./gam-adflow-sdk">自有 GAM + AdFlow JS Tag（无 Prebid.js）</a></td>
</tr>
</tbody>
</table></div>

配置后按<a href="./verify-and-launch">验证接入与上线</a>逐项确认请求、展示和数据。
