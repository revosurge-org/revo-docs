---
title: AdFlow 安装检查失败自助排查与文档入口
description: 排查 AdFlow 安装检查未收到请求的问题，核对页面与广告位代码，并联系人工支持。
---

# AdFlow 安装检查失败自助排查与文档入口

## 背景与结论

AdFlow 安装检查只查询指定网站与广告位在检查窗口内是否有真实 Bid Request 到达 Prebid Server，不主动制造请求。未查到匹配请求只能说明“本次未查到”，不能单凭这一结果断定代码未生效、广告没有返回或网站无法展示。用户安装代码后需要在已发布的目标页面打开或刷新页面并触发该广告位；保存或发布操作本身不保证站长已打开的页面自动刷新。

## 目标

在安装检查失败卡片提供一个明显但轻量的自助排查入口，跳转 RevoSurge 文档中心 AdFlow 目录的“安装代码失败 QA”。用户按症状排查，仍无法解决时使用现有客服联系方式。保留原有“稍后再试”文案，不在检查界面承诺固定等待分钟数。

## 范围与交互

1. AdFlow 两步集成代码右侧的安装检查：检查失败（本次未收到匹配请求）时，在失败原因卡片底部显示文字链接“安装遇到问题？查看排查指南”；点击后新标签页打开文档，保留 AdFlow 当前检查状态。成功态不显示此入口。
2. 文档中心 AdFlow 目录在“S2S 调试器”下新增“安装代码失败 QA”，路径建议为 `/cn/adflow/install-check-qa`；英文版可后续对应 `/en/adflow/install-check-qa`。
3. 文档页先说明安装检查的成功边界：匹配的真实 Bid Request 被 Prebid Server 收到；NO_BID、竞价过滤、广告未展示不等于安装失败。
4. 无法直接读取用户网页或浏览器控制台时，系统只展示可证实的“未收到匹配请求”，不自动归因为某一种错误。

## 自助排查内容

| 现象或可能原因                                               | 用户自查与解决                                               |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| 代码只保存到编辑器、预览或测试环境，正式页面尚未发布；旧页面未重新载入或受缓存影响 | 确认修改已发布到目标环境；在目标广告位所在的公开页面重新打开或刷新，并确认页面实际加载到新代码。发布动作不会通用地刷新已打开页面。 |
| 共用脚本或广告位代码漏装、装在错误页面、放错模板             | 对照 AdFlow 的两步代码，确认共用脚本和该广告位代码都存在于目标页面；同一站点模板的共用脚本只装一次。 |
| 账号 ID、广告位 ID、代码属性与 AdFlow 中的目标对象不一致     | 从对应网站及广告位重新复制正式代码，核对 `data-account-id`、`data-placement-id` 等属性；不要混用示例代码或其他账号的代码。 |
| 页面打开了但广告位还未触发                                   | 滚动到广告位、完成页面必要交互，或按网站的懒加载/单页应用逻辑触发；在浏览器网络面板确认有请求，再回 AdFlow 重查。 |
| 脚本没有加载或执行                                           | 在浏览器开发者工具的 Network/Console 查看脚本加载、JavaScript 错误、CSP 拦截或网络阻断；请站点开发者修复配置。仅在自己的测试浏览器临时排除扩展拦截影响，不要求普通访客关闭安全功能。 |
| 请求已发出，但本次检查尚未检索到                             | 稍后再试，确认检查的是同一网站、同一广告位以及正确的页面；数据处理有短暂延迟。 |
| 有 Bid Request 但没有广告                                    | 安装检查已通过；NO_BID、格式/尺寸/需求匹配或后续渲染问题应在广告投放排查中处理，不作为代码安装失败。 |
| 广告位状态为 pending（待验证）或 disabled（已停用）          | 在 AdFlow 后台确认广告位状态为 active。新建的广告位默认为 pending，需要代码安装成功并触发验证后才会变为 active。如果状态为 disabled，手动启用或联系管理员。 |
| 网站状态不是 active                                          | 安装检查的前置条件是网站（Website）处于 active 状态且未被删除。在 AdFlow 网站管理中确认对应网站已激活。如果网站被停用，该网站下所有广告位的检查都会失败。 |
| 账号状态为 disabled                                          | 账号被禁用后，所有广告位的检查请求都不会被查询。确认 AdFlow 账号处于 active 状态；如显示已禁用，联系管理员恢复。 |
| 检查结果显示"未知"（unknown）                                | 当报表通道不可用（adflow.reporting.enabled=false）或 datapulse/reporting 服务故障时，检查返回"未知"而非"未查到"。这不是安装问题，是系统暂时无法核查。稍后再试；如持续出现请联系客服。 |
| 广告位的 externalPlacementId 尚未同步                        | 安装检查通过 PL_XXXXXX 格式的外部 ID 去 BQ 匹配竞价请求。如果广告位刚创建，外部 ID 可能尚未同步到数据管道。创建后等待 1-2 分钟再触发检查。 |
| BQ 竞价请求镜像有数据延迟                                    | 检查的数据源是 kafka.bid_requests_raw_recent（BigQuery 中的竞价请求镜像表），从 Prebid Server 收到请求到 BQ 可查存在分钟级延迟。刚触发的请求可能需要等待 2-5 分钟后才能被检查到。 |
| publisher ID (AC_XXXXXX) 与代码中的不一致                    | BQ 核查按 externalAccountId（格式 AC_XXXXXX）+ externalPlacementId（格式 PL_XXXXXX）精确匹配。确认页面代码中的 data-account-id 和 data-placement-id 与 AdFlow 后台显示的值完全一致，不要手动修改 ID。 |
| 检查窗口内确实没有匹配请求（数据管道侧确认）                 | 安装检查只查询指定网站与广告位在检查窗口内是否有真实 Bid Request 到达 Prebid Server，不主动制造请求。如果页面已正确安装但检查仍失败，在浏览器 Network 面板确认是否有发往 prebid-server.revosurge.com 的请求，以及请求中是否携带了正确的 publisher/placement ID。 |



## 人工支持

仍未解决时，引导用户通过 AdFlow 右下角现有客服联系。建议提供网站域名、实际页面 URL、广告位 ID、代码发布时间、最近检查时间及浏览器 Network/Console 的相关截图；不要发送密码、密钥或用户隐私数据。

当用户联系客服时，建议提供以下代码级诊断信息：
AdFlow 后台截图：广告位状态（pending/active/disabled）、网站状态
检查结果显示：recent_request_seen / not_seen_yet / unknown
浏览器 Network 面板截图：发往 Prebid Server 的请求 URL 和响应状态码
页面源代码：确认 data-account-id、data-placement-id 属性值
广告位创建时间：判断是否处于同步延迟窗口

## 验收标准

- 第一次点击“检查网站请求”的演示显示失败及排查链接；第二次点击显示成功，并明确“收到真实 Bid Request”，不承诺广告展示。
- 失败链接进入文档中心 AdFlow → S2S 调试器下方的“安装代码失败 QA”；可返回 AdFlow，检查状态保留。
- 文档覆盖发布/刷新、两段代码、ID、触发条件、脚本与网络阻断、短暂延迟、NO_BID 与展示区分、人工支持。
- 只读检查真实请求，不伪造测试流量；未收到请求时不臆断唯一失败原因。

## 参考

- [RevoSurge Publisher Integration Guide](https://docs.revosurge.com/en/adflow/integration-guide)
- [MDN：Location.reload()](https://developer.mozilla.org/en-US/docs/Web/API/Location/reload)
- [MDN：CSP script-src](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/script-src)
- [Prebid：requestBids](https://docs.prebid.org/dev-docs/publisher-api-reference/requestBids.html)
- [Prebid：getNoBids](https://docs.prebid.org/dev-docs/publisher-api-reference/getNoBids.html)

状态：产品 review 通过，已同步 Linear Backlog；技术实现、错误可观测性与文档发布安排待开发评估。