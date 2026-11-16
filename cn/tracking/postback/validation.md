---
title: 合作方 Postback 集成校验
description: 分版本的 v2／v1 Postback 校验规则、负例探测、重试与送达证据。
---

# 合作方 Postback 集成校验

按平台实际调用的 API 版本校验。[v2 canonical 事件](/cn/tracking/postback/partner-postback#v2-api)使用 `PB2-*`；下方已有 `PB-R-*` / `PB-O-*` 保留 v1 范围及历史主题。必需规则阻断上线，建议规则记录数据质量和对账缺口。

## v2 集成校验 {#v2-validation}

| ID | 必需规则 | 故障与修复 |
| --- | --- | --- |
| `PB2-R-01` | Connection 启用、`k` 有效，恰好关联一个产品 | key 错误／过期或 Connection 停用为 `403`；关联错误为 `422 SINGLE_PRODUCT_REQUIRED`。修正 Connection，而不是 query 产品 ID |
| `PB2-R-02` | 精确、已启用的 canonical `event` 和目录授权路径 | `422 UNKNOWN_EVENT_TYPE` / `EVENT_DISABLED`，未知路径为 `400`。确认产品有效目录；v1 别名不适用 |
| `PB2-R-03` | 稳定的 `identity.client_user_id` 或 `identity.anonymous_id`，并满足目录身份要求 | `422`。click ID／event ID 不能替代用户身份，应向来源方取得真实字段 |
| `PB2-R-04` | 业务实际发生的 `timestamp`，UTC 整数毫秒 | 秒、ISO 字符串、小数、低于 `1000000000000` 或超过未来五分钟为 `422`。修正来源单位／时间，不使用接收时间 |
| `PB2-R-05` | 所有必填字段符合类型、枚举和格式 | `422`。包含基础及事件专属字段；Boolean 为小写 `true/false`；保留真实 `0`、`false`、精确小数及允许的负手续费 |
| `PB2-R-06` | 宏已展开、query 名唯一、路径无冲突、一次 UTF-8 编码合法 | `400`；检查 `violations[].field/rule` 或 `INVALID_QUERY`。同值重复也非法，包括 `k` 和模式参数 |
| `PB2-R-07` | 金额、币种、手续费和 payout 保持业务含义 | 符合 schema 的数字仍可能是错误事实。对照来源核验原币和独立手续费；v2 不换算 USD |
| `PB2-R-08` | 按版本处理响应与重试 | 修正 `400/422` 负载和 `403` 凭证；遵循 `429 Retry-After`；`503`／网络错误退避重试，保留来源 ID 和时间；`unknown` 可能晚到 |
| `PB2-R-09` | 模式正确且由服务端触发 | dryrun 不发布业务，test 进入隔离流。经约定的 live 流量移除两个参数，核对 `accepted`、`stored=true`、`confirmed`；避免浏览器暴露 `k` |

| ID | 建议规则 | 验证方式 |
| --- | --- | --- |
| `PB2-O-01` | 提供稳定唯一的来源 `event_id`，适用时提供真实 `context.transaction_id` | 核对 envelope 保留二者，重试复用；二者都不是服务端 `requestId` |
| `PB2-O-02` | 可取得且目录允许时回传 RevoSurge click ID | 核对 `identity.click_id`，与联盟平台自己的 click ID 分开；不要伪造 |
| `PB2-O-03` | 跟踪有效目录和平台宏的变更 | 字段、枚举、授权或模板变化后重跑 dryrun/test；调用方不锁定 `catalogVersion` |

### 必需探测与证据 {#v2-probes}

从产品完整合法的负载开始，每次只改变一个条件。鉴权、关联和目录可用性先于部分字段检查执行，应先满足这些前提。

| 探测 | 预期结果 |
| --- | --- |
| 合法 `dryrun=1` | `200`、`validated`、`stored=false`、`not_attempted`；检查 typed envelope |
| 两个用户身份都缺失，或目录必填字段缺失 | `422 VALIDATION_ERROR` |
| 业务值中的字面宏；未知路径；同值 query 重复；父子路径冲突 | `400 VALIDATION_ERROR` |
| 错误 `%` 转义或非法 UTF-8 | `400 INVALID_QUERY` |
| 秒／小数／超前时间；错误类型／枚举；Boolean 使用 `1` | `422 VALIDATION_ERROR` |
| 错误 key／非单产品 Connection | `403` / `422 SINGLE_PRODUCT_REQUIRED` |
| 合法 `testmode=1` | `200`、`accepted`、`stored=true`、`confirmed`，并有匹配的隔离业务消息 |

保留脱敏请求、实际响应、来源 ID、`requestId` 和实际 `catalogVersion`。技术负责人还需分别确认 dryrun／拒收无业务发布，并读回匹配的 test/live 消息。仅有审计记录不够。发布失败／超时行为应在受控故障测试中验证，不在共享生产环境制造故障。

v2 以[响应与重试矩阵](/cn/tracking/postback/partner-postback#v2-responses)为准。目录首次加载前不可用返回 `503`；后续刷新失败保留上次有效快照。目录契约冲突也返回 `503`，由 RevoSurge 排查，不能视为校验成功。

## v1 集成校验 {#v1-validation}

以下规则仅适用于五条 v1 路径。规则 ID 和原章节锚点继续供已有工单使用。v1 的宽容负载响应和 click→user 回填不适用于 v2。

### 必需规则 {#required-rules}

| ID | 规则 | 失败会导致什么 |
| --- | --- | --- |
| `PB-R-01` | 每次调用都带上正确的 `k` | `403`。什么都不会被记录。 |
| `PB-R-02` | **端点路径**与事件相符——事件类型由路径决定 | `event` 宏只作交叉核对记录，绝不用于判定类型。把充值发到注册路径，它就永远是一次注册。 |
| `PB-R-03` | `click_id` 与 `user_id` 至少有一个 | `200 {"status":"ignored"}`。在你的日志里看起来是成功，但这笔转化并不存在。 |
| `PB-R-04` | 正确展开身份宏 | 字面 `click_id` 宏会丢弃事件；缺失／未展开的 `user_id` 可由有效 click ID 回填 |
| `PB-R-05` | 首次充值发到 `/first-deposit`，之后的充值发到 `/repeat-deposit` | 首充（FTD）数会双向出错，而 FTD 通常正是广告系列的出价目标。 |
| `PB-R-06` | `ts` 是 unix **毫秒**，不是秒 | 秒级值会被自动纠正，并作为契约偏离上报。不会有任何失败，但你依赖的是我们的纠正，而不是发送你真正想表达的值——而且告警会落到你的客户经理那里，而不是你。 |
| `PB-R-07` | `/first-deposit`、`/repeat-deposit` 和 `/revenue` 都发送 `amount`，且符号正确（`/registration` 与 `/app-launch` 不带金额） | 没有可报告的收入，也无从计算 ROAS。 |
| `PB-R-08` | 使用全局唯一且稳定的 `event_id`，重试复用 | 兜底为 `txid` 和排序 raw 哈希；业务值变化可能改变键。下游去重须验证 |
| `PB-R-09` | 重试 `503`／网络错误；遵循 `429 Retry-After`；修正 `403` | 保留来源 ID；v1 兼容配置下 `200 ok` 不无条件证明 broker ACK |
| `PB-R-10` | 注册的生产 URL 中**不含** `dryrun` | 每条 postback 都只返回判定结果，什么都不记录。 |
| `PB-R-11` | `user_id` 与你在 Web 追踪器和 S2S 中使用的标识相同 | 同一玩家变成两份档案。充值无法关联到带来它的那次点击。 |
| `PB-R-12` | Postback 从你的后台**服务端**触发，而不是从浏览器 | `k` 密钥以明文出现在 URL 中——浏览器触发的 postback 会把它暴露在页面源码里。客户端调用还会被广告拦截器拦掉，并在刷新时重复触发。 |

### 建议规则 {#recommended-rules}

| ID | 规则 | 代价是什么 |
| --- | --- | --- |
| `PB-O-01` | 发送 `ctx` | `click_id` 缺失或过期时没有兜底归因。 |
| `PB-O-02` | 发送 `txid` 作为第二去重键 | 一旦 `event_id` 缺失，去重就会降级为查询串哈希，这很脆弱。 |
| `PB-O-03` | 用真实值填写 `hash_id` / `hash_name` 和 `source_id` / `source_name` | 没有按链接或流量来源的细分。广告系列表现不佳时，你无法分辨是哪个投放位带来了这些充值。 |
| `PB-O-04` | 发送 `country` | 地域报表更弱；我们只能退回到推断。 |
| `PB-O-05` | 把你自己的事件类型宏作为 `event` 发送 | 失去能发现端点用错（`PB-R-02`）的交叉核对。 |
| `PB-O-06` | 在你知道时声明 `is_new_customer` 和 `first_deposit_ts` | 我们无法用自己的首充判定来印证你的首充分类。 |
| `PB-O-07` | 适用时声明 `attribution_share` | 缺失声明就无法与你方共享归因模型核对 |

### 必需项修复方式 {#required-resolutions}

#### `PB-R-01` —— 密钥错误或缺失 {#pb-r-01-—-bad-or-missing-key}

通过账号可用的配置流程或 RevoSurge 联系人取得 Connection 密钥；legacy partner 密钥单独管理。遵循轮换宽限期，不将 `k` 放入浏览器代码。

#### `PB-R-02` —— 事件用错了端点 {#pb-r-02-—-wrong-endpoint-for-the-event}

**修复：** 使用与事件相符的路径：

| 事件 | 路径 |
| --- | --- |
| 玩家账号创建 | `/v1/pb/{partner}/registration` |
| 首次充值 | `/v1/pb/{partner}/first-deposit` |
| 之后的充值 | `/v1/pb/{partner}/repeat-deposit` |
| 收入分成结算 | `/v1/pb/{partner}/revenue` |
| App 启动（每一次启动） | `/v1/pb/{partner}/app-launch` |

没有其他路径。App **安装**不是启动，也没有对应的 postback 路径——安装通过你的 MMP 回传。从启动路径发出的注册，或从注册路径发出的启动，都会被永久错误归类，与充值走错路径一样。

`/revenue` 上的负 `amount` 是合法的——在收入分成下，亏损的周期就是一次负的收入事件。如果你需要专门上报**拒付或追回（chargeback / clawback）**，请与你的客户经理约定表示方式，而不要想当然地认为一条负收入会被这样解读。

把 `event` 宏设对并没有帮助——它只作交叉核对记录，绝不用于判定类型。只有路径才算数。

#### `PB-R-03` —— 没有可用的身份标识 {#pb-r-03-—-no-usable-identity}

**修复：** 发送 `click_id`（首选）或 `user_id`。至少有一个必须解析为真实值。

请对照你的*日志*检查，而不是凭假设：响应是 `200`，所以你的后台几乎肯定会把这些报告为已送达。

#### `PB-R-04` —— 未替换的宏 {#pb-r-04-—-unsubstituted-macros}

在 v1 中，缺失或未展开的 `user_id` 视为未提供，有效 `click_id` 可用于回填（`userIdBackfilled=true`）。`click_id` 中出现字面宏时，即使另有身份也会丢弃事件。能提供时请发送真实稳定的 `user_id`；click 回填不能证明玩家身份稳定。v2 没有此回填。

- `click_id` 中出现字面宏会**丢弃整条 v1 postback**（`200 ignored`）。
- 缺失／未展开的 `user_id` 视为未提供，有效 click ID 可回填；两种身份都不可用时忽略事件。
- 其他未展开字段从解析值省略，原始输入保留供排查。

#### `PB-R-05` —— 首次与后续充值走同一路径 {#pb-r-05-—-first-and-repeat-deposits-on-the-same-path}

**修复：** 你的后台必须知道一笔充值是否是该玩家的首充，并路由到对应的路径。如果做不到，就把所有充值都发到 `/repeat-deposit` 并告知你的客户经理——少算的首充可以补救；发到注册路径的充值则无法补救。

#### `PB-R-06` —— 时间戳用了秒 {#pb-r-06-—-timestamp-in-seconds}

**修复：** `ts` 和 `first_deposit_ts` 都是 unix **毫秒**。把 10 位数的值乘以 1000。

秒级值会被检测、纠正，并视为契约偏离——事件以纠正后的时间存储，同时触发告警。所以它不会在你的日志里表现为失败，但也不是悄无声息地出错：你的客户经理会收到通知。

另外，超过 30 天的历史事件或超过未来 60 分钟的事件会被记录并标记，绝不会被拒绝。

#### `PB-R-07` —— 金额缺失或符号错误 {#pb-r-07-—-missing-or-wrongly-signed-amount}

每条存款／收入事件发送带符号的十进制 `amount`，保留正确业务符号及合法零值／负值。发送原 `amount` 和 `currency`，缺失／空白币种默认为 USD。启用换算补充后，受支持币种使用可用的金融汇率快照；USD 和 USDT 使用明确的同币／1:1 策略。汇率不可用时来源事件仍发送。保留来源字段并检查 `revosurge_currency_conversion_status`，成功的 `revosurge_target_amount` 才是派生 USD 金额。旧 `amount` 仍为传入数字，旧 `currency` 仍为 USD，不能据此判定已经换汇

#### `PB-R-08` —— 没有稳定的 `event_id` {#pb-r-08-—-no-stable-event-id}

来源键优先级为 `event_id`，其次 `txid`，否则为 `h:` 加上解码后的 raw 参数按名称排序、以 `k=v` 对拼接后的 SHA-256。参数顺序变化不改变兜底键，业务值或时间变化可能改变。鉴权和模式参数排除在外。Connection 加 `<connectionId>:` 前缀，legacy partner 保留无前缀形式。

发送跨事件类型全局唯一且稳定的 `event_id`，重试时原样复用。生成键本身不合并记录，业务去重由下游消费者执行。v1/v2 的哈希表示不同，双发不保证自动去重。

#### `PB-R-09` —— 重试行为错误 {#pb-r-09-—-wrong-retry-behaviour}

以下为 **v1 live** 响应。业务目的流启用且采用默认同步确认时，`200 ok` 在 broker ACK 后返回。历史异步兼容模式或人为关闭业务目的流时，也可能返回 `200 ok` 而没有确认业务发布。交接时核对实际配置和送达证据，单看 `200` 不够。

| 状态码 | 响应体 | 含义 | 是否重发 |
| --- | --- | --- | --- |
| `200` | `{ "status": "ok" }` | 按实际 v1 发布配置接受 | 不自动重试 |
| `200` | `{ "status": "ignored" }` | 无可用身份或 click 宏拒收；无业务事件 | 修正输入 |
| `503` | `{ "status": "unavailable" }` | 发布未确认；超时后可能晚到 | 保留来源 ID 重试 |
| `403` | 现有鉴权响应 | key／Connection 错误或 legacy IP 不允许 | 修正配置 |
| `429` | 现有限流响应 | 鉴权后限流 | 遵循 `Retry-After` |

v1 的宽容准入失败不返回负载 `4xx`；此规则不适用于 v2。



对 `503`、连接错误和超时使用指数退避，保留 `event_id`、`txid`、来源时间和业务值。`429` 遵循 `Retry-After`。修正 `403` 后再发，不自动重试 `200`。来源键为下游去重提供依据，不代表去重已经完成。

#### `PB-R-10` —— dry run 没有关掉 {#pb-r-10-—-dry-run-left-on}

**修复：** 从后台注册的 URL 中移除 dry run 参数。`dryrun`、`dryrun=1` 和 `dryrun=true` 都会被接受，所以请搜索 `dryrun`，而不是某个确切的字符串。dry run 响应带有响应头 `X-Ingest-Mode: dryrun`，且不记录任何内容。

#### `PB-R-11` —— 标识与你的其他追踪不一致 {#pb-r-11-—-identifier-does-not-match-your-other-tracking}

**修复：** 在 Web 追踪器（`user_id`）、S2S（`identity.client_user_id`）和 postback（`user_id`）中，对每个玩家使用同一个标识。同样的字符串、同样的大小写，不要一处带前缀而其他处不带。

这一项出错时每条 postback 都会成功，只是数字是错的。事后修正也不会合并已经拆分开的档案。

#### `PB-R-12` —— 从浏览器触发 postback {#pb-r-12-—-postbacks-fired-from-the-browser}

**修复：** 使用你联盟平台的服务端 postback 功能来触发。像素或客户端调用会把 `k` 密钥放进页面源码，会被广告拦截器拦掉，并且玩家每次刷新都会重复触发。

使用 legacy partner 凭证时，RevoSurge 还可能限制出口 IP 白名单——请向你的客户经理确认是否已为你开启，因为开启后来自浏览器的调用会以 `403` 失败。

### 建议项修复方式 {#recommended-resolutions}

#### `PB-O-01` —— 没有 `ctx` {#pb-o-01-—-no-ctx}

**修复：** 传入你的平台提供的投放上下文宏。`click_id` 缺失或过期时，归因正是靠它恢复的。

#### `PB-O-02` —— 没有 `txid` {#pb-o-02-—-no-txid}

**修复：** 把你的交易 ID 作为 `txid` 发送。它是第二去重键，也是你们财务团队对账时依据的字段。

#### `PB-O-03` —— 分类字段为空 {#pb-o-03-—-empty-taxonomy-fields}

使用真实链接／账号及流量来源值。能够标识约定账号的稳定常量是有效值；避免虚构占位符，并记录无法提供的字段。

#### `PB-O-04` —— 没有 `country` {#pb-o-04-—-no-country}

**修复：** 如果你的平台提供玩家国家，请发送它。

#### `PB-O-05` —— 没有 `event` 宏 {#pb-o-05-—-no-event-macro}

**修复：** 把你自己的事件类型宏作为 `event` 发送。它绝不会改变转化的分类方式——那是端点路径的职责——但端点用错这类问题，正是靠它在扭曲一整个月的报表之前被发现。

#### `PB-O-06` —— 没有首充声明 {#pb-o-06-—-no-ftd-declaration}

**修复：** 当你的系统知道 `is_new_customer` 和 `first_deposit_ts` 时，请发送它们。我们读不懂的值会记为空值，而不是 `0`。

#### `PB-O-07` —— 没有归因份额 {#pb-o-07-—-no-attribution-share}

**修复：** 如果你在多个来源之间分摊归因，请在 `attribution_share` 中声明你的份额。它作为你方的声明被记录——绝不会被换算标度，也不会被乘进 `amount`。

### 本页无法检查的两件事 {#two-things-this-page-cannot-check}

- **你的后台在真实转化发生时确实会触发。** 即使平台的 postback 规则已被停用、作用于错误的广告系列，或被一个永远不会满足的条件过滤掉，你粘进浏览器的 URL 依然能通过本页的每一条规则。只有[上线测试](/cn/tracking/postback/handoff#the-go-live-test)才能证明它确实会触发。
- **你的总数与我们的一致。** 归因窗口、分摊归因模型和结算时点都会合理地改变数字。请按 `event_id` 和 `txid` 对账，而不是比较总数。

### 下一步 {#next-steps}

所有必需规则都通过后，前往[交付与上线](/cn/tracking/postback/handoff)。
