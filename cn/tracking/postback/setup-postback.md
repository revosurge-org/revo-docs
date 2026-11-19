---
title: 设置并测试 Partner Postback
description: 连接联盟平台、配置事件回调并验证真实转化路径。
---

# 设置并测试 Partner Postback

先确认平台支持的[版本](/cn/tracking/postback/overview#choose-version)。条件允许时建议使用 v2。准备产品访问权限、服务端回调配置权限和源事件数据。

## 1. 选择联盟平台 {#_1-choose-the-affiliate-setup}

打开 **Product → Choose your setup → An affiliate platform → Use this setup**。

<img class="doc-screenshot" src="/img/handbook/wizard-v4/affiliate-setup.png" alt="联盟平台接入建议" width="416" height="268">

## 2. 创建或选择连接 {#_2-create-or-select-a-connection}

打开 **Account menu → API Keys & Postbacks → Postback Connections → Create Connection**。填写名称、平台和授权产品。v2 要求 Connection 恰好绑定一个产品。

<img class="doc-screenshot" src="/img/handbook/wizard-v4/postback-form.png" alt="创建 Connection 的表单" width="480" height="218">

获取 Connection ID 和密钥，并与 RevoSurge 确认目标 origin 和接收端是否就绪。v2 还须核对接收路径及产品有效目录。密钥仅保存在服务端，分享验收材料时须遮盖。

## 3. 配置联盟平台 {#_3-configure-your-platform}

- **v2**　使用确认的 origin、Connection ID 和密钥组装 `/v2/pb/{connectionId}/events`。门户当前生成的是 v1 URL。选择[产品事件](/cn/tracking/events/choose-events)，按 [v2 字段规则](/cn/tracking/postback/v2-api#v2-parameters)映射源宏。
- **v1**　使用已分配的 URL，请按相应[事件路径](/cn/tracking/postback/v1-api#endpoints)和[平铺参数](/cn/tracking/postback/v1-api#parameters)配置宏。URL 路径决定事件。
- 为每种事件记录来源字段、目标字段、类型、单位、精度、必填级别和负责人。使用稳定的玩家和来源事件 ID、原始 RevoSurge 点击 ID 及真实业务时间。重试时保留原值。
- 在目标产品或广告系列中启用服务端规则。即使 v2 只有一个接收路径，平台仍可能要求每种事件配置单独模板。

## 4. 测试完整流程 {#_4-test-the-complete-path}

按版本参考[校验清单](/cn/tracking/postback/validation)。

| 阶段 | 操作 | 检查结果 |
| --- | --- | --- |
| Dry run | 使用真实展开的模板发送，带上 `dryrun=1` | 解析值正确，未发布业务事件 |
| 隔离测试 | 移除 dryrun，设置 `testmode=1` 并使用独立测试 ID | 隔离流中的业务消息与源数据一致 |
| 正式验证 | 确认上线条件后移除两个标记，使用真实点击并完成正常业务流程 | 对照正式回传，分别检查报表、首充和广告系列归因 |

按 [v2](/cn/tracking/postback/v2-api#v2-responses) 或 [v1](/cn/tracking/postback/v1-api#responses) 的响应和重试规则处理结果。真实回传和归因需单独核对。

### 校验真实业务流程 {#check-the-real-journey}

- **v2**　触发约定的真实业务动作，逐项对照收到的字段与来源数据。
- **v1 充值**　用新测试账号完成约定的小额真实首充和第二笔充值。检查注册、首充、复充路径，核对玩家和点击 ID、独立事件 ID、金额及时间。第二笔充值不应被计为另一笔首充。
- **v1 应用启动**　适用时重新打开应用两次，确认同一玩家有两条独立的启动事件。用 dry run 检查注册前启动，缺少可用身份时应拒绝该事件。

在 AdWave 打开 **Verify Your Source → Partner Postback → View event stream**，选择对应的来源、模式和 UTC 时段。图中是 Web 追踪器的控件，请切换到 Partner Postback。

![事件流控件](/img/handbook/wizard-v4/event-stream.png)

保留已脱敏的完整 URL、版本和环境、平台版本、产品及 Connection、事件列表、来源 ID、时间、响应及请求 ID。v2 还应记录 `catalogVersion`。技术负责人比对业务消息中的值，包括小数精度，并记录可追踪的目标引用。为未验证或缺失的阶段指定负责人。

## 5. 上线前与变更后 {#_5-before-launch-and-after-changes}

在 **Campaign conversion events** 确认广告系列目标是否可用，并与客户经理确认监控、恢复负责人及尚未发送的字段或事件。共享归因时，交付验证证据和计入规则。

平台运营方负责密钥和后台规则。代理方需要平台授权才能修改。每类业务动作使用约定的来源和版本。更换密钥、产品、目录、模板、域名、身份、付款渠道或归因规则后重新检查。对结果不确定的请求，先根据原始来源 ID 对账，再决定是否重发。
