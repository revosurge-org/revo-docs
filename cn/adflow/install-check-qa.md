---
title: 安装检查失败 QA
description: 排查 AdFlow 安装检查未收到请求的问题，核对页面与广告位代码，并联系人工支持。
---

# 安装检查失败 QA

<p>安装检查未收到该广告位的匹配请求？请按下面顺序排查。此检查只查询真实请求，不会发起测试流量。</p>
<div class="tip custom-block">
<p class="custom-block-title">什么算安装检查通过？</p>
<p>目标网站上的广告位发出的真实 Bid Request 到达 Prebid Server，即视为安装检查通过。没有广告返回、<code>NO_BID</code>、竞价过滤或暂未展示，是后续竞价与展示问题，不等于代码没有安装成功。</p></div>
<h2 id="publish">1. 确认代码已发布，并打开目标页面 </h2>
<p>只点击网站后台的「保存」或「发布」，不会保证已经打开的网页自动刷新。请打开或刷新已发布的、安装该广告位的正式页面。如果站点有缓存或 CDN，请确认它已提供最新页面代码。预览页、测试环境与正式页可能不同。</p>
<h2 id="codes">2. 核对两段代码与广告位 </h2>
<h3 id="共用脚本和广告位代码都在目标页面吗">共用脚本和广告位代码都在目标页面吗？ </h3>
<p>请对照 AdFlow 的两步安装代码。共用脚本应正确加载，目标广告位代码也须在同一页面；不要只安装其中一段，也不要放错页面模板。同一站点模板的共用脚本只安装一次。</p>
<p>确认代码取自 AdFlow 中对应网站和广告位的正式代码，而非示例。两步安装方式见<a href="./adflow-sdk#adflow-usage">接入指南</a>。</p>
<h3 id="账号与广告位-id-是否匹配">账号与广告位 ID 是否匹配？ </h3>
<p>确认 <code>data-account-id</code> 和 <code>data-placement-id</code> 与本次检查的账号、广告位一致，且该广告位属于当前选择的网站。多个账号或广告位的代码不要混用。不确定时，请从 AdFlow 对应广告位重新复制代码。</p>
<h2 id="trigger">3. 触发一次真实广告请求 </h2>
<p>刷新页面后，确认广告位所在区域实际加载。若网站使用懒加载、单页路由或需要交互才能触发广告位，请滚动至广告位或完成对应操作。在浏览器的 <strong>Network</strong> 面板确认有请求，再回 AdFlow 重新执行安装检查。</p>
<h2 id="browser">4. 查看浏览器拦截与报错 </h2>
<p>可请网站开发者打开浏览器开发者工具的 <strong>Network</strong> 与 <strong>Console</strong>，依次检查：</p>
<ul><li>AdFlow 脚本是否已加载并执行？</li><li>是否有 JavaScript 错误？</li><li>内容安全策略（CSP）是否拦截脚本或请求？</li><li>是否有网络请求失败，或浏览器扩展拦截？</li></ul>
<p>请开发者修复站点或网络配置问题。诊断时可在自己的测试浏览器临时排除扩展拦截影响，不应要求所有访客关闭安全设置。</p>
<p>可参考<a href="./adflow-sdk#adflow-diagnostic">接入指南中的诊断工具</a>。收到请求后仍有竞价或展示问题时，请使用对应的<a href="./adflow-sdk#adflow-sdk">广告格式调试器</a>或 <a href="./s2s-debugger">S2S 调试器</a>。</p>
<h2 id="retry">5. 稍后重试，确认检查对象 </h2>
<p>请求记录可能有短暂处理延迟。请稍后再试，并确认 AdFlow 当前选择的网站、广告位与刚才实际访问的页面一致。</p>
<p>如果页面已正确安装但检查仍失败，请在浏览器 <strong>Network</strong> 面板确认是否有发往 Prebid Server 的请求，以及该请求是否携带了正确的 publisher ID 与 placement ID。</p>
<p>当前未查到匹配请求不代表完整历史中从未出现请求，也不能直接判定唯一原因。如果是检查操作本身失败，请稍后重新检查，不要据此认定代码安装失败。</p>
<div class="tip custom-block">
<p class="custom-block-title">检查结果显示"未知"（unknown）时</p>
<p>当报表通道暂时不可用，检查会返回"未知"而非"未查到"。这不是安装问题，而是系统暂时无法核查，请稍后再试；若持续出现，请按下方联系方式提交客服。</p></div>
<h2 id="states">6. 确认账号、网站与广告位状态 </h2>
<p>在 AdFlow 后台核对网站和广告位状态，再按当前状态进行检查。</p>
<ul><li><strong>待验证</strong>是新建广告位的正常状态。先发布代码并触发一次真实请求，再执行安装检查。</li><li>安装检查通过后，按后台提示启用广告位。安装验证与启用是两个步骤。</li><li>网站、广告位或账号显示已停用时，请检查当前配置及权限，或联系管理员核对。</li></ul>
<h2 id="help">仍然无法解决？ </h2>
<p>请通过 AdFlow 右下角的现有客服联系人工支持，并提供：</p>
<ul><li>网站域名、实际页面 URL。</li><li>广告位 ID。</li><li>代码发布时间、最近检查时间及对应时区。</li><li>相关 Network / Console 截图。</li><li>广告位与网站的当前状态（<code>pending</code> / <code>active</code> / <code>disabled</code>）。</li><li>检查结果类型（收到真实 Bid Request / 未查到 / 未知）。</li><li>页面代码中的 <code>data-account-id</code>、<code>data-placement-id</code> 值，以及是否与 AdFlow 后台显示一致。</li></ul>
<p>请勿提供账号密码、密钥或访客隐私数据。</p>
<p class="nextstep">已看到请求，页面仍然空白？查看 <a href="./no-ad-display">有请求，但没有广告展示</a>。</p>
