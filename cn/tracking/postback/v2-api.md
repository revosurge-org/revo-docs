---
title: "Partner Postback API (v2)"
description: "Partner Postback v2 的 Connection、规范查询参数、示例、校验及响应规则。"
---

# Partner Postback API (v2)

先[选择版本](/cn/tracking/postback/overview#choose-version)，再按[设置与测试指南](/cn/tracking/postback/setup-postback)完成平台配置。生产 MMP origin 为 `https://mmp.revosurge.com`。测试 origin 和接入范围请与 RevoSurge 确认。

## v2 API {#v2-api}

<HttpMethod method="GET" path="/v2/pb/{connectionId}/events" />

`v2` 是传输版本。服务端选择产品当前有效的事件目录，调用方不在 URL 中选择 preset 或目录版本。事件和字段定义复用[事件目录](/cn/tracking/events/catalog-validation)、[Standard](/cn/tracking/events/events-standard)、[iGaming](/cn/tracking/events/events-igaming) 和 [Crypto](/cn/tracking/events/events-crypto) 参考。事件可用性、必填字段及已启用的自定义事件以实际产品目录为准。HTTP 响应遵循下方 Postback 规则，不直接套用 S2S 错误码表。

### Connection 与密钥 {#v2-authentication}

使用处于启用状态、**恰好关联一个产品**的 Postback Connection，在 `k` 中携带其密钥。legacy partner slug 不能使用 v2。query 不能选择或覆盖产品。已有参数名映射仅适用于 v1，v2 必须直接发送 canonical 路径。

通过账号可用的配置流程或 RevoSurge 联系人创建／选择 Connection，配置服务端模板时获取完整密钥。ACTIVE key 和轮换宽限期内的 RETIRING key 可用；过期／已撤销 key 或停用的 Connection 返回 `403`。重新生成密钥时若未设置宽限期，旧 key 立即撤销；设置的宽限期最长七天。legacy partner 的 IP 白名单是独立的 v1 配置，不是 Connection 设置。

当前 Connection URL 生成器返回 v1 地址。请使用上述路径和已有 Connection ID/key 组装 v2 URL。**一个接收路径不代表第三方平台只需一条配置：**平台可能要求每个 canonical 事件分别配置规则和模板。

将 `k` 保存在服务端配置中。它不进入业务负载，请求审计会脱敏；分享 URL 或验收证据时也应遮盖密钥。

### Canonical query 参数 {#v2-parameters}

| 参数 | 要求 | 含义 |
| --- | --- | --- |
| `k` | 必填 | Connection 密钥 |
| `event` | 必填 | 产品已启用的精确 canonical 事件名 |
| `event_id` | 建议；同时遵循目录要求 | 稳定来源事件 ID：1–256 个 ASCII 字符，首字符为字母或数字，后续为字母、数字或 `._:~-` |
| `timestamp` | 必填 | 业务实际发生时间，UTC epoch **整数毫秒**，有符号 64 位；至少 `1000000000000`，未来偏差不超过五分钟 |
| `identity.client_user_id` / `identity.anonymous_id` | 至少一个，并满足目录要求 | 稳定用户或匿名身份；目录仍可能要求其中某个特定字段必填 |
| `identity.click_id` | 可取得且目录允许时发送 | 用于归因的 RevoSurge click ID，不能替代用户身份 |
| `context.*`、其他 `identity.*` | 按有效目录 | 精确 canonical 路径、类型、枚举和必填级别 |
| `dryrun`、`testmode` | 可选控制参数 | 校验或隔离测试模式；不进入业务 `raw` 和哈希兜底 |

v2 不会用 click ID 回填缺失的用户身份。联盟平台自己的 click ID 与 RevoSurge click ID 应分别记录；不能按每次点击伪造用户 ID，也不能用接收时间替代业务发生时间。

解析规则如下：

- 点分路径形成嵌套对象，例如 `context.privacy.marketing_consent`。只接受目录授权的标量路径；在 query 值里塞入任意 JSON 对象不会形成嵌套对象。
- 缺失、空白和不区分大小写的字面量 `null` 视为未提供。可选空值从 typed envelope 省略，解码后的输入仍保留在 `raw`；必填字段仍须提供。
- String 保留原内容；Number 使用精确十进制解析并保留 `0`。Boolean 仅接受小写 `true`、`false`，`1`、`0`、`yes`、`TRUE` 均不能替代；合法 `false` 会保留。
- 秒级时间、ISO 时间字符串和小数毫秒会被拒绝；v1 的时间纠正不适用于 v2。
- 未知路径、业务值中的未展开宏、重复 query 名（包括同值重复、`k` 和模式参数）及父子路径冲突均拒收。例如同时发送 `context.reward` 和 `context.reward.value`。
- 值只做一次 UTF-8 form URL 编码：`+` 表示空格，字面加号用 `%2B`，`&` 用 `%26`，`%` 用 `%25`。错误百分号转义或 UTF-8 会被拒绝；`%252B` 只解码一次，得到字面量 `%2B`。

### 注册设备字段 {#v2-registration-device}

`register`、`referral_register` 可通过 canonical 点分 query 参数发送 `context.device_brand`、`context.device_model`、`context.platform` 和 `context.os`。四个字段均为 **String / 建议**；在其余负载有效时，可提供任意子集，也可全部省略。`platform` 仅接受 `web`、`android`、`ios`；其他三个字段没有封闭枚举。

使用实际完成本次注册的设备；推荐注册使用**新用户**的设备。保留原始机型标识，并省略无法获取的值，完整规则参见[注册设备采集](/cn/tracking/events/events-standard#registration-device)。v2 会从 typed envelope 省略空白值，但不会自动清理品牌、机型和操作系统字段中的 `-`，应由上报端清理不可用值。

### 金额与币种 {#v2-values}

在目录规定的 canonical 字段中发送原币金额和币种，v2 不自动换算成 USD。对于 `trade` 契约，`context.amount` / `context.currency` 表示交易，`context.fee_amount` / `context.fee_currency` 独立表示手续费。精确小数和合法负手续费会保留；缺失金额不会补成零。

`payout` 不是存款、交易额或手续费的别名。仅当有效目录授权了精确路径时，才能按其业务定义使用 payout／reward／summary 字段。未知 payout 参数会被拒收。

### 模式、响应与重试 {#v2-responses}

默认 live。`dryrun=1` 校验但不发布业务事件；`testmode=1` 发布到隔离测试流。两者同时启用时 dryrun 优先。参数存在且值不是 `0`、不区分大小写的 `false` 或 `no` 时启用，裸参数也启用。接收器响应通过 `X-Ingest-Mode` 回显实际模式。

| HTTP／结果 | `status` / `code` | `stored` / `publishOutcome` | 处理方式 |
| --- | --- | --- | --- |
| `200`，合法 dryrun | `validated` / `VALIDATED` | `false` / `not_attempted` | 检查 envelope；没有发布业务事件 |
| `200`，live/test broker ACK | `accepted` / `PUBLISHED` | `true` / `confirmed` | 不重试 |
| `400`，错误编码 | `rejected` / `INVALID_QUERY` | `false` / `not_attempted` | 修正编码 |
| `400`，重复参数／宏／未知或冲突路径 | `rejected` / `VALIDATION_ERROR` | `false` / `not_attempted` | 修正指出的字段／规则 |
| `422`，必填／类型／枚举／时间／身份错误 | `rejected` / `VALIDATION_ERROR` | `false` / `not_attempted` | 修正负载 |
| `422`，Connection 未恰好绑定一个产品 | `rejected` / `SINGLE_PRODUCT_REQUIRED` | `false` / `not_attempted` | 修正 Connection 关联 |
| `422`，事件不可用 | `rejected` / `UNKNOWN_EVENT_TYPE` 或 `EVENT_DISABLED` | `false` / `not_attempted` | 核对精确名称、产品授权和启用状态 |
| `403`，鉴权失败 | 现有鉴权响应 | 不发布业务事件 | 修正 key／Connection，勿盲目重试 |
| `429`，限流 | 现有限流响应 | 不发布业务事件 | 遵循 `Retry-After` |
| `503`，目录未加载／冲突 | `rejected` / `CONFIGURATION_UNAVAILABLE` 或 `CATALOG_EVENT_CONFLICT` | `false` / `not_attempted` | 退避重试；持续配置错误由 RevoSurge 排查 |
| `503`，目的流关闭／不可用 | `rejected` / `PUBLISH_DISABLED` 或 `TEST_STREAM_UNAVAILABLE` | `false` / `not_attempted` | 联系 RevoSurge 恢复目的流，避免紧密重试 |
| `503`，发送失败 | `rejected` / `PUBLISH_FAILED` | `false` / `failed` | 退避重试，保留来源 ID |
| `503`，等待 ACK 超时 | `rejected` / `PUBLISH_TIMEOUT` | `false` / `unknown` | 可能晚到；重试保留来源 ID |

接收器 verdict 包含 `status`、`code`、`mode`、`stored`、`publishOutcome`、`requestId`、`catalogVersion`、`envelope` 和 `violations`（`field` / `rule`）。鉴权及限流响应不承诺此结构。合法 dryrun 返回 `200`；错误 dryrun 可以返回 `400`、`422`、`403`、`429` 或 `503`。

v2 的 live/test 始终等待 broker ACK。`stored=true` 表示已确认发布到对应流，不代表已完成 ClickHouse 入库、统计去重、报表或 Campaign 归因。`stored=false` 且 outcome 为 `unknown` 只表示响应时尚未确认，不会取消已在途发送。审计记录独立于业务发布；仅有 `requestId` 或审计记录不能证明业务送达。

连接错误／超时及可重试 `503` 使用指数退避。每次尝试保留原 `event_id`、交易 ID、业务发生时间和业务值；`requestId` 标识请求，不能替代来源业务 ID。

### 请求示例 {#v2-examples}

将 `MMP_URL` 设为已确认的 MMP origin（无末尾斜杠），`CONNECTION_ID` 设为单产品 Connection ID，`POSTBACK_KEY` 设为其密钥。下方 `TS_MS` 为示例生成一次合成事件时间，重试复用；真实事件使用实际发生时间。

使用隔离测试产品及已确认的测试 origin。以下是合成示例，不是生产转化证据。`register` 必须满足有效目录的基础字段要求，文档中的 Standard 契约包括 `identity.client_user_id` 和 `context.ip_address`。`trade` 还要求已启用兼容的 Crypto 契约，并提供交易 ID、产品类型、金额／币种及手续费金额／币种。运行前确认这些要求，不应为通过示例而省略必填字段。

```bash
TS_MS=$(python3 -c 'import time; print(time.time_ns() // 1000000)')

# 校验 register，不发布业务事件；false 应保留。
curl --get "$MMP_URL/v2/pb/$CONNECTION_ID/events" \
  --data-urlencode "k=$POSTBACK_KEY" --data-urlencode 'dryrun=1' \
  --data-urlencode 'event=register' --data-urlencode 'event_id=docs-register-1' \
  --data-urlencode "timestamp=$TS_MS" \
  --data-urlencode 'identity.client_user_id=测试 + & 用户' \
  --data-urlencode 'context.ip_address=192.0.2.139' \
  --data-urlencode 'context.device_brand=Apple' \
  --data-urlencode 'context.device_model=iPhone15,3' \
  --data-urlencode 'context.platform=ios' \
  --data-urlencode 'context.os=iOS' \
  --data-urlencode 'context.privacy.marketing_consent=false'

# 隔离测试：原币、高精度金额和独立的负手续费。
curl --get "$MMP_URL/v2/pb/$CONNECTION_ID/events" \
  --data-urlencode "k=$POSTBACK_KEY" --data-urlencode 'testmode=1' \
  --data-urlencode 'event=trade' --data-urlencode 'event_id=docs-trade-1' \
  --data-urlencode "timestamp=$TS_MS" \
  --data-urlencode 'identity.client_user_id=docs-player' \
  --data-urlencode 'context.ip_address=192.0.2.139' \
  --data-urlencode 'context.transaction_id=docs-order-1' \
  --data-urlencode 'context.product_type=futures' \
  --data-urlencode 'context.amount=0.12345678901234567890123456789' \
  --data-urlencode 'context.currency=BTC' \
  --data-urlencode 'context.fee_amount=-0.000000000000000001' \
  --data-urlencode 'context.fee_currency=USDT'
```

零手续费交易使用新的事件／交易 ID，并发送 `context.fee_amount=0`。存款使用产品已启用的 `deposit` 契约及其必填字段，不复用交易专属字段。经过约定的受控 live 测试移除两个模式参数并使用新的来源事件 ID；重试该事件时保留原时间和 ID。

经约定的受控 live 阶段使用确认的 origin 和新事件 ID，不携带两个模式参数：

```bash
curl --get "$MMP_URL/v2/pb/$CONNECTION_ID/events" \
  --data-urlencode "k=$POSTBACK_KEY" \
  --data-urlencode 'event=register' --data-urlencode 'event_id=docs-live-register-1' \
  --data-urlencode "timestamp=$TS_MS" \
  --data-urlencode 'identity.client_user_id=docs-player' \
  --data-urlencode 'context.ip_address=192.0.2.139'
```

第一条示例的合法 dryrun verdict 示意（请求 ID、目录版本和时间按实际结果变化）：

```json
{
  "status": "validated",
  "code": "VALIDATED",
  "mode": "dryrun",
  "stored": false,
  "publishOutcome": "not_attempted",
  "requestId": "synthetic-request-example",
  "catalogVersion": 42,
  "envelope": {
    "event": "register",
    "event_id": "docs-register-1",
    "timestamp": 1794801600000,
    "identity": {
      "client_user_id": "测试 + & 用户"
    },
    "context": {
      "ip_address": "192.0.2.139",
      "device_brand": "Apple",
      "device_model": "iPhone15,3",
      "platform": "ios",
      "os": "iOS",
      "privacy": {
        "marketing_consent": false
      }
    }
  },
  "violations": []
}
```

### 来源 ID 与交付边界 {#v2-deduplication}

业务键为 `<connectionId>:<source-key>`。source-key 优先级为 `event_id`，其次 `context.transaction_id`，最后为 `h:` 加上排序、解码后、采用 JSON framing 的 raw 业务参数 SHA-256。`k`、模式、请求 ID、协议和目录版本不进入哈希；业务值或时间变化可能改变兜底键。

来源 `event_id` 应在 Connection 内跨事件类型唯一，不能只在某个事件名下唯一。dryrun 请求同样计入鉴权后的限流。

该键为下游去重提供依据，生成键和取得 Kafka ACK 本身不会删除重复事件。跨 v1/v2 双发不保证自动去重；请约定切换边界，并用保留的来源业务 ID 对账。继续完成[集成校验](/cn/tracking/postback/validation#v2-validation)和[交付](/cn/tracking/postback/setup-postback#_5-before-launch-and-after-changes)。
