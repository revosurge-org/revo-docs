---
title: S2S 集成校验
description: S2S 集成在投放广告系列前必须通过的规则、每条规则失败时会坏掉什么，以及如何修复。
---

# S2S 集成校验

**受众：** 完成集成的开发者，以及确认集成可以上线的 AM 或 BD。
请在第一个广告系列上线**之前**跑一遍本页，而不是等到它投放不足之后。

::: info 规则分两档
**必需**规则会阻止上线——任何一条失败，RevoSurge 用来优化的数据就是错的或缺失的。**建议**规则不阻止上线，但每一条都会让你付出具体的代价。

规则 ID（`S2S-R-01`、`S2S-O-01`…）是稳定的。在工单和发给合作方的邮件里直接引用它们，不必重新描述问题。
:::

## 必需规则 {#required-rules}

| ID | 规则 | 失败会导致什么 |
| --- | --- | --- |
| `S2S-R-01` | 已生成 API Key，且 **S2S Status** 显示 Active | 每个请求都被拒绝，什么都不会被存下。 |
| `S2S-R-02` | 请求发往 **v3** 端点（`/v3/s2s/event`、`/v3/s2s/batch`） | v2 将于 **2026 年 10 月 18 日**弃用。v3 之后加入目录的任何事件都无法通过 v2 访问，而且没有任何地方会告诉你它缺失了。 |
| `S2S-R-03` | 每个请求都带 `X-API-KEY` 请求头，且只从你的后端发送 | 缺少请求头会被直接拒绝。密钥一旦出现在前端或 App 代码里就是凭证泄露——任何人都能往你的账户里写事件。 |
| `S2S-R-04` | `event` 是目录中的准确名称 | `422 UNKNOWN_EVENT_TYPE`。事件永远不会落库，报表里也不会有任何提示告诉你它缺失了。 |
| `S2S-R-05` | `timestamp` 是 UTC epoch **毫秒**（13 位） | 被拒绝，返回 `rule: "not_milliseconds"`。用秒是最常见的集成 bug，没有之一。 |
| `S2S-R-06` | `timestamp` 比真实时间超前不超过 5 分钟 | 被拒绝，返回 `rule: "future_skew"`。通常是服务器时钟未同步，或做了本地时间转换。 |
| `S2S-R-07` | 带有 `identity.client_user_id` | 事件无法关联到用户。它会被计数，但对优化毫无作用。 |
| `S2S-R-08` | `client_user_id` 与你传给 Web 追踪器的 `user_id`、传给 MMP 的 Customer User ID 是**同一个字符串** | 同一个玩家变成两份画像。充值挂不到带来它的那次点击上，同一笔转化还可能被计两次。 |
| `S2S-R-09` | 带有 `context.ip_address` | 没有地理位置富化。国家级报表与地域定向效果下降。 |
| `S2S-R-10` | 两个基础事件都已上线：`register` 和 `deposit` | 达不到这一条，S2S 带给你的不会比 Web 追踪器更多。FTD 报表一直为空。 |
| `S2S-R-11` | dry run 没有报告任何拼错的字段，也没有 `violations` | **可选**字段上一个差一点就对的名称（`context.payment_metod`）会被静默丢弃。请求照样返回成功，所以看起来一切正常。 |
| `S2S-R-12` | 生产流量返回 `202`，而不是 `200` | 返回 `200` 且带 `X-Ingest-Mode: dryrun` 说明你仍处于 dry run，什么都没有被存下。 |
| `S2S-R-13` | 邮箱和手机号以哈希形式发送，绝不发送明文 | 被拒绝，返回 `rule: "pii_format"`；而且只要发送过明文 PII，就是你要承担的合规问题。 |
| `S2S-R-14` | 你的产品已**启用 iGaming 预设** | `422 EVENT_DISABLED`。在 RevoSurge 启用之前，所有 iGaming 事件——包括 `deposit`——都会被拒绝。这不是你能在代码里修复的。 |
| `S2S-R-15` | 每个事件都带有**该事件**要求的 context 字段 | `400 VALIDATION_ERROR`，`rule: "required"`。`deposit` 需要 `context.transaction_id`、`context.amount` 和 `context.currency`——三个都要，每笔充值都要。 |
| `S2S-R-16` | 只要你拿得到，服务器事件上就传 `identity.click_id` | 归因只能退回到单靠用户 ID 拼接。首个会话内的转化——新广告系列恰恰靠它们来评判——最容易被漏掉。 |
| `S2S-R-17` | 如果你有**存量玩家**，上线前已回填历史充值，或已约定截止点 | FTD 是我们看到的最早一笔充值。每个存量玩家的下一笔充值都会被算作首充，虚高第一周的 FTD，并误导任何以它为出价目标的广告系列。 |

## 建议规则 {#recommended-rules}

| ID | 规则 | 代价是什么 |
| --- | --- | --- |
| `S2S-O-01` | 发送 `login` | 无法区分回流玩家与新玩家，召回与获客看起来一模一样。 |
| `S2S-O-02` | 发送 `deposit_initiated`，并带上之后的 `deposit` 或 `deposit_failed` 会重复的 `context.transaction_id` | 看不到收银台流失——这通常是 iGaming 漏斗中可挽回的最大损失。 |
| `S2S-O-03` | 发送 `context.user_agent` | 设备识别能力变弱，反欺诈信号也变弱。 |
| `S2S-O-04` | 回填时使用 `/v3/s2s/batch` | 逐条发送会耗尽单个密钥的限流额度，回填要花几个小时而不是几分钟。 |
| `S2S-O-05` | 对 `429` 做指数退避加抖动的重试 | 流量高峰时事件被丢弃——而那恰恰是它们最重要的时候。 |
| `S2S-O-06` | 预发环境与生产环境使用不同的 API Key | 测试事件污染线上报表和线上出价。 |

## 必需项修复方式 {#required-resolutions}

### `S2S-R-01` —— 没有有效的 API Key {#s2s-r-01-—-no-active-api-key}

**修复：** Product → Setup Wizard → **Step 3 · S2S Postback** → **Generate API Key**。或者
Manage Product → 你的产品 → **S2S** 卡片。密钥只以掩码形式显示一次——请立即复制到你的密钥管理器。

生成新密钥不会吊销旧密钥。请有计划地轮换，并在停用旧密钥之前先把它从你的后端移除。

### `S2S-R-02` —— 仍在调用 v2 {#s2s-r-02-—-still-calling-v2}

**修复：** 把基础路径从 `/v2/s2s/…` 改为 `/v3/s2s/…`，并把 `timestamp` 从秒改为毫秒发送。认证请求头与信封结构不变。见[从 v2 迁移](/cn/tracking/s2s/v3/migration)。

v2 将于 **2026 年 10 月 18 日**弃用。

v2 的任何问题都不会大声报错，这正是很多集成停留在 v2 上好几个月都没人察觉的原因。

### `S2S-R-03` —— API Key 缺失或已暴露 {#s2s-r-03-—-missing-or-exposed-api-key}

**修复：** 只从服务端代码向 `https://datapulse-api.revosurge.com/v3/s2s/event` 发起 `POST`，带上
`X-API-KEY: <your key>` 和 `Content-Type: application/json`。

如果密钥曾经出现在前端 JavaScript、移动端安装包、标签管理器或公开代码仓库中，就把它视为已泄露：生成新密钥、切换过去，然后停用旧密钥。

### `S2S-R-04` —— 未知的事件名 {#s2s-r-04-—-unknown-event-name}

**修复：** 对照[标准事件](/cn/tracking/s2s/v3/events-standard)和
[iGaming 事件](/cn/tracking/s2s/v3/events-igaming)核对名称。名称为小写加下划线，必须精确匹配。`first_deposit` 不是目录中的事件——首充以 `deposit` 发送。

::: info 首充是推导出来的，不是发送的
每一笔充值都以 `deposit` 发送。RevoSurge 把该用户收到的最早一笔 `deposit` 推导为 FTD——没有需要设置的首充事件或标记。

由此带来的后果见 `S2S-R-17`：如果你有存量玩家，他们的下一笔充值就是我们看到的第一笔，会被算作首充。
:::

### `S2S-R-05` —— 时间戳以秒为单位 {#s2s-r-05-—-timestamp-in-seconds}

**修复：** 乘以 1000。有效的 `timestamp` 是 13 位；10 位的值是秒，会被拒绝并返回 `rule: "not_milliseconds"`。

### `S2S-R-06` —— 时间戳在未来 {#s2s-r-06-—-timestamp-in-the-future}

**修复：** 发送 UTC 而不是本地时间，并检查发送主机的 NTP。常见原因是转换本地时间戳时没有调整时区——它只在时区早于 UTC 的服务器上失败，所以看起来像是偶发问题。

### `S2S-R-07` —— 缺少 `client_user_id` {#s2s-r-07-—-missing-client-user-id}

**修复：** 把你稳定的账户 ID 放进 `identity.client_user_id`。对于确实发生在登录之前的事件，改为发送 `identity.anonymous_id`——identity 至少要带其中之一。

对于 `app_install`、`app_open` 和 `app_uninstall`，这项要求会**放宽**——该字段从必填变为建议填写，而不是默认就可以不传。

### `S2S-R-08` —— 各接入方式的用户 ID 不一致 {#s2s-r-08-—-user-id-does-not-match-across-methods}

**修复：** 所有地方都用同一个 ID——对同一个人，Web 追踪器的 `user_id`、S2S 的 `identity.client_user_id` 和你 MMP 的 Customer User ID 必须是同一个字符串。大小写一致，也不能一边带前缀而另一边不带。

这是本页代价最高的错误，而且完全看不出来：每个请求都成功，事件全部存下，只是数字是错的。事后修复也无法把已经分裂的画像追溯合并。

### `S2S-R-09` —— 缺少 IP 地址 {#s2s-r-09-—-missing-ip-address}

**修复：** 在 `context.ip_address` 中放**终端用户**的 IP，而不是你服务器的 IP。如果位于代理或 CDN 之后，从 forwarded-for 请求头中读取。

对 `app_install` 和 `bet` 放宽为建议填写。`bet` 之所以放宽，是因为服务端下注可能确实没有终端用户 IP——这是兜底，不是可以省略它的许可。

### `S2S-R-10` —— 两个基础事件没有都上线 {#s2s-r-10-—-basic-events-not-both-live}

**修复：** `register` 和 `deposit` 是最低要求。如果只有一个在触发，漏斗就没有转化率，FTD 报表也无从计数。

### `S2S-R-11` —— dry run 报告了拼错的字段 {#s2s-r-11-—-dry-run-reports-misspelled-fields}

**修复：** 把你真实的负载发到 `/v3/s2s/event?dryrun=1`，然后查看回显。单条事件干净通过时返回 `"misspelledFields": []`。批量请求在没有拼错时这个键会**完全不存在**——而不是空数组——所以不要对批量响应断言 `=== []`，否则会得到误报的失败。

列在其中的任何键都与某个真实字段足够接近，我们能猜出你的本意，但它会被丢弃，而不是被纠正。

这项检查对**可选**字段才有意义。拼错的必填字段会以 `400` 明确报错；拼错的 `context.payment_method` 则返回 `202`，然后就这么消失了。

### `S2S-R-12` —— 仍处于 dry run {#s2s-r-12-—-still-in-dry-run}

**修复：** 从生产 URL 中去掉 `?dryrun=1`。真实流量返回 `202` 和
`{"status":"accepted","eventId":"…"}`。如果你看到的是 `200` 且带响应头
`X-Ingest-Mode: dryrun`，你发送的任何内容都没有被存下。

### `S2S-R-13` —— PII 未哈希 {#s2s-r-13-—-unhashed-pii}

**修复：** `context.privacy.email_hash` 是邮箱转小写、去除首尾空格后的 SHA-256。
`context.privacy.phone_hash` 是 E.164 规范化后号码的 SHA-256。两者都是小写十六进制，恰好 64 个字符（`^[a-f0-9]{64}$`）。格式错误的哈希会失败并返回 `rule: "pii_format"`。

### `S2S-R-14` —— 你的产品未启用 iGaming 事件 {#s2s-r-14-—-igaming-events-disabled-for-your-product}

**修复：** 这无法在代码里修复。iGaming 预设由 RevoSurge 按产品启用——请联系你的客户经理开启，然后重新测试。

标准事件（`general.core`）对每个产品自动启用。iGaming 事件则不是，而 `deposit` 就是 iGaming 事件。一个在其他方面完美无缺的集成，在订阅生效之前，每笔充值都会返回
`422 EVENT_DISABLED`。在排查其他任何问题之前，**先**检查这一项。

### `S2S-R-15` —— 缺少各事件的必填字段 {#s2s-r-15-—-missing-per-event-required-fields}

**修复：** 在[标准事件](/cn/tracking/s2s/v3/events-standard)和 [iGaming 事件](/cn/tracking/s2s/v3/events-igaming)中查看你发送的每个事件的必填字段列表。最容易踩坑的几个：

| 事件 | 必填的 context 字段 |
| --- | --- |
| `deposit` | `context.transaction_id` · `context.amount` · `context.currency` |
| `deposit_initiated` | `context.transaction_id` |
| `deposit_failed` | `context.transaction_id` |
| `withdraw` | `context.transaction_id` · `context.amount` · `context.currency` |
| `bet` | `context.transaction_id` |
| `app_install` · `app_open` · `app_uninstall` | `context.platform`（`ios` / `android` / `web`） |

在 `deposit` 上，`context.amount` 和 `context.currency` **不是可选的**。缺少它们的充值会被拒绝，返回 `400 VALIDATION_ERROR`、`rule: "required"`——它不会以一笔缺了金额、但仍可计数的充值到达。

在 `deposit_initiated` → `deposit` / `deposit_failed` 之间使用同一个 `context.transaction_id`，这样收银台漏斗才能配对。

### `S2S-R-16` —— 服务器事件上没有 `click_id` {#s2s-r-16-—-no-click-id-on-server-events}

**修复：** 在访客落地时捕获 RevoSurge 的点击 ID，把它与其会话或账户一起持久化，并在服务器事件上以 `identity.click_id` 发送。它在 `register` 和第一笔 `deposit` 上最重要。

`click_id` 本身并不满足 identity 要求——你仍然需要 `client_user_id` 或 `anonymous_id`（`S2S-R-07`）。

### `S2S-R-17` —— 未处理存量玩家 {#s2s-r-17-—-existing-players-not-accounted-for}

**修复：** 上线前二选一：

- **回填。** 通过 `/v3/s2s/batch`（每个请求 600 条）发送你的历史充值，让真正的首充在实时流量开始之前就已记录在案。
- **约定截止点**：与你的客户经理约定，并在第一个报表周期内剔除来自已知玩家的 FTD。

只有当该产品确实是一个没有存量玩家的全新品牌时，才可以跳过这一步。

这不是代码缺陷，也不会有任何报错。它表现为一个第一周看起来非常漂亮、第二周骤然崩塌的 FTD 数字——而在这期间它已经改变了你的出价。

## 建议项修复方式 {#recommended-resolutions}

### `S2S-O-01` —— 没有 `login` {#s2s-o-01-—-no-login}

**修复：** 在认证成功时发送 `login`。加上它成本很低，而报表正是靠它来区分召回与获客。

### `S2S-O-02` —— 没有 `deposit_initiated` {#s2s-o-02-—-no-deposit-initiated}

**修复：** 在玩家进入收银台时触发它，并带上一个 `context.transaction_id`，在随后产生的 `deposit` 或 `deposit_failed` 上重复使用。没有匹配的 ID，两个事件就无法配对，流失率也就无法使用。

### `S2S-O-03` —— 没有 user agent {#s2s-o-03-—-no-user-agent}

**修复：** 在 `context.user_agent` 中传入终端用户的 user-agent 字符串。

### `S2S-O-04` —— 回填时逐条发送事件 {#s2s-o-04-—-backfills-sent-one-event-at-a-time}

**修复：** 使用 `/v3/s2s/batch`，请求体为裸 JSON 数组。每个请求 600 条是硬上限——601 条会被拒绝并返回 `400 BATCH_TOO_LARGE`，而不是被截断。

批量请求返回 `{"status":"accepted","requestId":…,"count":…}`。批量响应中没有单个 `eventId`。

### `S2S-O-05` —— 遇到限流不重试 {#s2s-o-05-—-no-retry-on-rate-limit}

**修复：** 把 `429` 视为可重试，使用指数退避加抖动。限流按 API Key 计算，采用滚动的一分钟窗口。不要重试 `400` 或 `422`——那些是负载问题，无论重试多少次都会以同样的方式失败。

### `S2S-O-06` —— 所有环境共用一个密钥 {#s2s-o-06-—-one-key-for-all-environments}

**修复：** 生成第二个密钥并让预发环境使用它，或者让预发环境永久使用 `?dryrun=1`。注意 dry run 同样计入限流。

## 本页无法检查的两件事 {#two-things-this-page-cannot-check}

- **你的生产代码路径是否真的会触发。** 本页每条规则都可能在你在终端里手工构造的负载上全部通过，而真正的充值处理逻辑却什么都没发送。只有[上线测试](/cn/tracking/s2s/handoff#the-go-live-test)才能证明集成真正接入了你的产品。
- **我们的数字与你的是否一致。** 符合所有规则的数据仍可能与你的 BI 对不上——时区边界、归因窗口和币种处理都会让总数发生变化。请有意识地做对账，而不要默认差异就是 bug。

## 下一步 {#next-steps}

所有必需规则都通过后，前往[交付与上线](/cn/tracking/s2s/handoff)运行端到端测试，并告诉你的客户经理你已准备就绪。
