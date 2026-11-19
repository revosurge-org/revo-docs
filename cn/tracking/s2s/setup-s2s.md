---
title: 设置并测试 S2S 服务器事件
description: 连接产品和 API 密钥，实现注册、充值及正式转化验证。
---

# 设置并测试 S2S 服务器事件

准备目标产品的访问权限、能修改后端的开发人员、落地页点击 ID 和稳定的玩家账号 ID。

## 上线前的准备 {#before-you-start}

确认后端能提供实际业务发生时间和对应事件的必填数据。

## 1. 接入最低要求事件 {#_1-implement-the-minimum-required-events}

正式上线前接入 **`register`** 和 **`deposit`**。

| 事件 | 触发时机 | 用途 |
| --- | --- | --- |
| `register` | 成功创建账号后 | 衡量注册 |
| `deposit` | 每笔充值确认成功后，包括复充 | 衡量充值金额和首充 |

每笔成功充值均发送 `deposit`，并提供 `context.transaction_id`、`context.amount` 和 `context.currency`。RevoSurge 判定首充。其他事件根据广告系列目标和报表需求选择。

## 2. 连接产品与 API 密钥 {#_2-connect-your-product-and-api-key}

打开 **Product → Choose your setup → Our own back office**，检查 Web Tracker 和 S2S，然后选择 **Use this setup**。

<img class="doc-screenshot" src="/img/handbook/wizard-v4/choose-setup-s2s.png" alt="建议的 Web Tracker 和 S2S 接入方案" width="416" height="268">

1. 打开 **Account menu → API Keys & Postbacks → API Keys**。
2. 选择 **Create API Key**。在 **Generate new API key** 选择产品、输入名称并生成密钥。

<img class="doc-screenshot" src="/img/handbook/wizard-v4/api-key-create.png" alt="选择目标产品并生成 API 密钥" width="384" height="280">

## 3. 构造事件请求 {#_3-build-the-event-request}

请求地址为 `https://datapulse-api.revosurge.com/v3/s2s/event`，请求头包含 `X-API-KEY` 和 `Content-Type: application/json`。

| 对象 | 内容 |
| --- | --- |
| `event` | 精确的已登记事件名 |
| `timestamp` | 真实发生时间，UTC Unix 毫秒 |
| `identity` | 至少提供 `client_user_id` 或 `anonymous_id`，点击 ID 仅用于归因 |
| `context` | 该事件要求的字段 |

`identity.click_id` 使用原始落地页点击 ID，`identity.client_user_id` 使用与 Web 追踪器一致的稳定账号 ID。字段名以 [API 示例](/cn/tracking/s2s/v3/server-events-api)及[产品事件定义](/cn/tracking/events/choose-events)为准。

## 4. 校验请求负载 {#_4-validate-the-payload-safely}

| 模式 | 成功响应 | 作用 |
| --- | --- | --- |
| `?dryrun=1` | `200`，`X-Ingest-Mode: dryrun` | 校验并回显，未写入业务事件 |
| `X-Test-Mode: true` | `200`，test 模式 | 测试记录保留 14 天，不参与报表、归因或计费 |
| Live | `202 Accepted` | 进入正式处理队列 |

单条 dry run 成功时返回 `misspelledFields: []`，批量成功时可省略。可选 context 字段需要根据目录另行核对。详见 [S2S 校验](/cn/tracking/s2s/validation)。

## 5. 接入实际后端处理器 {#_5-connect-the-real-backend-handlers}

注册成功后发送 `register`，支付确认成功后发送 `deposit`。金额事件重试时保留原交易 ID。部署真实处理逻辑并验证其触发条件。

## 6. 验证正式转化路径 {#_6-verify-the-live-conversion-path}

1. 记录目标产品、事件及预期身份和业务值。
2. 使用约定点击和真实业务流程，由广告主执行已批准的注册或支付操作。
3. 确认实际后端发送请求，记录 `eventId` 或批量 `requestId` 和 `count`。
4. 打开 **Verify Your Source → S2S Server Events → View event stream**，选择正确的流量模式和 UTC 时段。
5. 核对事件类型、用户、点击、交易、金额和币种。
6. 检查 **Campaign conversion events**，确认所用出价策略支持目标转化。测试事件与 dry run 不计入正式转化验证。

### 排查问题 {#troubleshooting}

| 现象 | 优先检查 |
| --- | --- |
| `400` 且含 `violations` | 错误字段及规则、时间戳单位、该事件的必填字段 |
| `422 EVENT_DISABLED` | 产品市场类别及事件可用性 |
| `422 UNKNOWN_EVENT_TYPE` | 精确事件名，首充使用 `deposit` |
| 正式请求返回 `200` | 是否保留 dryrun 或测试标记 |
| `429` | 检查单个密钥的流量，使用带随机抖动的退避 |
| 已接收但未归因 | 原始点击 ID、产品、稳定玩家 ID |
| 首充异常偏高 | 既有玩家历史充值及回补或截止时间 |

来源显示 **Active** 或 **Previously verified** 时，仍需分别检查注册和充值是否已通过这次 Live 验证。

![检查原始接收记录](/img/handbook/wizard-v4/event-stream.png)

## 7. 完成上线检查 {#_7-complete-the-launch-checks}

确认实际后端上报的 `register` 和 `deposit` 已由 Live 流量验证。核对[校验规则](/cn/tracking/s2s/validation)、产品授权、市场类别和正式环境密钥。清除正式请求中的测试标记。确认老玩家历史充值处理，以及事件接收和报表监控的负责人。

向客户经理提供产品与域名、事件名、UTC 时间、请求标识、预期和实测结果及未验证项。密钥保持私有。密钥、处理逻辑、字段结构、产品、域名或身份字段变更后重新核对。

[服务器事件 API](/cn/tracking/s2s/v3/server-events-api) · [事件可用性](/cn/tracking/events/catalog-validation)
