---
title: 通知回调
description: RevoSurge RTB 接入中获胜、计费与竞价失败通知的处理说明。
---

# 通知回调

RevoSurge 出价时，会在竞价响应中包含三个通知 URL。您的 SSP 需要在正确的时机触发这些 URL，并替换相应的宏值。

## 通知 URL

| 字段 | 触发时机 | 是否必需 |
|---|---|---|
| `nurl`（获胜） | 您的 SSP 判定 RevoSurge 竞价胜出 | 是 |
| `burl`（计费） | 广告曝光渲染并计费 | 是 |
| `lurl`（失败） | RevoSurge 竞价失败 | 建议 |

## 宏替换

只有**失败 URL**（`lurl`）包含需要您的 SSP 替换的宏。获胜和计费 URL 不包含价格宏 — 它们只携带竞价 ID 和曝光 ID。

| URL | 宏 | 是否必需 |
|---|---|---|
| `nurl` | 无 | — |
| `burl` | 无 | — |
| `lurl` | `${AUCTION_LOSS}` | 是 — 按 OpenRTB 规范的失败原因码 |

## URL 示例（竞价响应中返回的格式）

**获胜通知：**
```
GET http://rtb.revosurge.com/rtb/win?id=xqoErTidWX&impId=AhpTG
```

**计费通知：**
```
GET http://rtb.revosurge.com/rtb/bill?id=xqoErTidWX&impId=AhpTG
```

**失败通知**（触发前需替换 `${AUCTION_LOSS}`）：
```
GET http://rtb.revosurge.com/rtb/loss?id=xqoErTidWX&impId=AhpTG&nbr=100
```

## 重要说明

- 所有通知 URL 均使用 **HTTP GET**
- 我们期望收到 `200 OK` 响应；失败时不会重试
- 失败原因码遵循 [OpenRTB 2.5 失败原因码规范](https://github.com/InteractiveAdvertisingBureau/openrtb/blob/master/OpenRTB%20v2.5%20FINAL.pdf)
