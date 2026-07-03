---
title: 快速开始 — SSP 接入
description: 在您的 SSP 上将 RevoSurge 接入为 DSP 买方的分步指南。
---

# 快速开始

本指南将引导您在您的 SSP 上把 RevoSurge 接入为买方。

## 第 1 步 — 申请 SSP ID

联系 RevoSurge 商务合作团队获取分配给您的 `sspId`。该 ID 用于竞价接口 URL，便于我们按 SSP 路由流量并跟踪表现。

## 第 2 步 — 配置接口地址

将您的 OpenRTB 流量指向：

```
POST http://rtb.revosurge.com/api/v1/openrtb2/{sspId}/bid
Content-Type: application/json
```

将 `{sspId}` 替换为分配给您的 ID。

## 第 3 步 — 发送测试请求

发送一个最简竞价请求以验证连通性：

```bash
curl -X POST http://rtb.revosurge.com/api/v1/openrtb2/{sspId}/bid \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-001",
    "imp": [{ "id": "1", "banner": { "w": 300, "h": 250 }, "bidfloor": 0 }],
    "site": { "domain": "example.com", "page": "https://example.com" },
    "device": { "ua": "Mozilla/5.0", "ip": "1.2.3.4", "geo": { "country": "IND" } },
    "at": 1
  }'
```

**预期响应：**
- `200 OK` 并返回竞价响应体 — 我们已出价
- `204 No Content` — 没有匹配该请求的广告系列（无需处理）

## 第 4 步 — 验证通知 URL

确保您的 SSP 会触发我们竞价响应中返回的通知 URL：

| URL 字段 | 触发时机 | 需替换的宏 |
|---|---|---|
| `nurl`（获胜 URL） | 您的 SSP 判定 RevoSurge 竞价胜出时立即触发 | 无 |
| `burl`（计费 URL） | 广告曝光渲染 / 计费时 | 无 |
| `lurl`（失败 URL） | RevoSurge 竞价失败时（可选，但建议触发） | `${AUCTION_LOSS}` → 失败原因码 |

详见[通知回调](/cn/supply/notifications)。

## 第 5 步 — 上线检查清单

- [ ] 已获取 SSP ID 并配置到接口 URL 中
- [ ] 所有请求均设置 `Content-Type: application/json` 请求头
- [ ] 测试请求返回 200 或 204（无错误响应）
- [ ] 已确认获胜通知（`nurl`）正常触发
- [ ] 已确认计费通知（`burl`）正常触发
- [ ] 竞价请求包含 `device.geo.country`、`device.ua`、`device.ip`
