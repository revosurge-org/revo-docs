---
title: 供应端接入概述
description: RevoSurge RTB 需求概述 — 支持的广告格式、地域范围，以及 SSP 接入方式。
---

# 供应端接入概述

**目标读者：** 希望将 RevoSurge 作为 DSP 买方接入的 SSP 工程师与商务合作团队。

RevoSurge 是一个通过实时竞价（RTB）购买广告库存的需求方平台（DSP）。SSP 只需将 OpenRTB 流量指向我们的竞价接口，即可将 RevoSurge 接入为买方。

## 我们购买的流量

| 维度 | 说明 |
|---|---|
| **协议** | OpenRTB 2.5 |
| **广告格式** | Banner（横幅）、Native（原生）、Popunder（弹窗） |
| **竞价类型** | 一价竞价（`at: 1`） |
| **货币** | USD |
| **地域范围** | 全球 — 亚洲、美国、欧盟区域已开通 |

## 工作流程

1. 您的 SSP 通过 HTTP POST 向我们的接口发送 OpenRTB 2.5 竞价请求
2. RevoSurge 根据在投广告系列（定向、预算、底价）评估该请求
3. 我们返回包含出价、广告代码和通知 URL 的竞价响应；若不出价则返回 HTTP 204
4. 您的 SSP 进行竞价；若我们胜出，则触发我们的获胜通知 URL
5. 广告曝光时，触发我们的计费 URL

## 接口地址

```
POST http://rtb.revosurge.com/api/v1/openrtb2/{sspId}/bid
```

您的 `sspId` 会在接入时分配。详见[快速开始](/cn/supply/getting-started)。

## 区域节点

我们的接口使用动态 DNS，会自动解析到亚洲、美国、欧盟区域中距离最近的服务器 — 您无需进行任何区域配置。

## 后续步骤

- [快速开始](/cn/supply/getting-started) — 接入步骤与测试清单
- [竞价接口参考](/cn/supply/bid-endpoint) — 完整的请求/响应字段说明
- [通知回调](/cn/supply/notifications) — 获胜、计费与竞价失败通知的处理
