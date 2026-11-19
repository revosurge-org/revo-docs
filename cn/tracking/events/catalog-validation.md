---
title: 事件可用性与校验
description: 查看产品市场类别、共享事件目录和校验规则。
---

<a id="事件目录与校验"></a>
<a id="event-catalog-validation"></a>

# 事件可用性与校验

S2S v3 与 Partner Postback v2 使用产品当前生效的事件目录，包括事件名、字段路径、类型、必填级别和允许值。请求中使用相应的传输版本，事件目录版本由服务端选择。

<a id="为什么要型别化"></a>

## 为什么定义字段类型？ {#why-typed}

注册事件名和字段类型让两种接入方式表达相同的业务动作。服务先解析请求格式，再按产品契约校验。响应和数据发布规则见各 API 参考。

<a id="标准与行业预设"></a>
<a id="standard-and-industry-presets"></a>

## 标准与行业事件 {#standard-and-industry-events}

| 事件集合 | 可用条件 | 参考 |
| --- | --- | --- |
| 标准 | 对所有产品启用 | [标准事件](/cn/tracking/events/events-standard) |
| iGaming | 由产品的 iGaming 市场类别启用 | [iGaming 事件](/cn/tracking/events/events-igaming) |
| Crypto | 由产品的 Crypto 市场类别启用。界面示例为 Crypto & Trading | [Crypto 事件](/cn/tracking/events/events-crypto) |
| 自定义 | 向客户经理确认特定产品的可用事件和字段 | 见下文 |

核对产品市场类别及有效事件目录，并单独确认报表和出价策略支持哪些事件。

<a id="字段要求级别"></a>

## 字段要求级别 {#field-requirement-levels}

| 级别 | 要求 |
| --- | --- |
| 必填 | 必须提供，并满足类型和值域限制 |
| 建议 | 建议提供以改善数据质量或归因。提供时须满足约束 |
| 选填 | 可以省略。提供时须满足适用约束 |

条件必填字段在各事件定义中说明。按业务实际值发送。

<a id="校验哪些内容"></a>

## 校验内容 {#what-gets-validated}

核对事件名、身份、发生时间、必填字段、类型和枚举。见[通用字段](/cn/tracking/events/common-fields)。以下参考分别说明各方式的编码、模式和响应。

- [S2S API](/cn/tracking/s2s/v3/server-events-api)说明 JSON、批量、响应及测试模式的请求头。
- [Postback v2 API](/cn/tracking/postback/v2-api#v2-api)说明点分路径、URL 编码、校验结果及查询参数。
- 参加正式转化验证时，按对应接入指南检查真实业务流程。Dry run 成功只证明请求通过校验。

<a id="目录更新"></a>

## 目录更新 {#catalog-updates}

事件定义和可用性随产品有效目录更新。验收时核对当前定义。目录冲突或持续不可用时，按对应接口的规则重试，并联系 RevoSurge 排查。

<a id="自定义事件"></a>

## 自定义事件 {#custom-events}

与客户经理确认业务动作、触发时机、来源字段、类型和要求级别。确认产品支持该事件及其精确字段路径后再发送。Postback v2 只接收目录允许的查询参数路径。

**下一步**　[选择事件](/cn/tracking/events/choose-events)，然后查看 [S2S 设置](/cn/tracking/s2s/setup-s2s)或 [Postback 设置](/cn/tracking/postback/setup-postback)。
