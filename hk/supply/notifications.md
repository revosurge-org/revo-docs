---
title: 通知回調
description: RevoSurge RTB 接入中獲勝、計費與競價失敗通知的處理說明。
---

# 通知回調

RevoSurge 出價時，會在競價響應中包含三個通知 URL。您的 SSP 需要在正確的時機觸發這些 URL，並替換相應的宏值。

## 通知 URL

| 欄位 | 觸發時機 | 是否必需 |
|---|---|---|
| `nurl`（獲勝） | 您的 SSP 判定 RevoSurge 競價勝出 | 是 |
| `burl`（計費） | 廣告曝光渲染並計費 | 是 |
| `lurl`（失敗） | RevoSurge 競價失敗 | 建議 |

## 宏替換

只有**失敗 URL**（`lurl`）包含需要您的 SSP 替換的宏。獲勝和計費 URL 不包含價格宏 — 它們只攜帶競價 ID 和曝光 ID。

| URL | 宏 | 是否必需 |
|---|---|---|
| `nurl` | 無 | — |
| `burl` | 無 | — |
| `lurl` | `${AUCTION_LOSS}` | 是 — 按 OpenRTB 規範的失敗原因碼 |

## URL 示例（競價響應中返回的格式）

**獲勝通知：**
```
GET http://rtb.revosurge.com/rtb/win?id=xqoErTidWX&impId=AhpTG
```

**計費通知：**
```
GET http://rtb.revosurge.com/rtb/bill?id=xqoErTidWX&impId=AhpTG
```

**失敗通知**（觸發前需替換 `${AUCTION_LOSS}`）：
```
GET http://rtb.revosurge.com/rtb/loss?id=xqoErTidWX&impId=AhpTG&nbr=100
```

## 重要說明

- 所有通知 URL 均使用 **HTTP GET**
- 我們期望收到 `200 OK` 響應；失敗時不會重試
- 失敗原因碼遵循 [OpenRTB 2.5 失敗原因碼規範](https://github.com/InteractiveAdvertisingBureau/openrtb/blob/master/OpenRTB%20v2.5%20FINAL.pdf)
