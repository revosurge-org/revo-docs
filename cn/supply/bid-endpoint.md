---
title: 竞价接口参考
description: RevoSurge RTB 接入的 OpenRTB 2.5 竞价请求与响应字段参考。
---

# 竞价接口参考

## 接口地址

| | |
|---|---|
| **URL** | `http://rtb.revosurge.com/api/v1/openrtb2/{sspId}/bid` |
| **方法** | `POST` |
| **Content-Type** | `application/json` |
| **协议** | OpenRTB 2.5 |

## 竞价请求

### 顶层字段

| 字段 | 类型 | 是否必需 | 说明 |
|---|---|---|---|
| `id` | string | 是 | 本次竞价请求的唯一 ID |
| `imp` | array | 是 | 曝光对象列表（见下文） |
| `site` | object | 建议 | 广告展示所在站点 |
| `device` | object | 建议 | 设备与用户环境 |
| `user` | object | 否 | 用户身份 |
| `at` | integer | 否 | 竞价类型。我们支持 `1`（一价竞价） |
| `tmax` | integer | 否 | 最大响应超时（毫秒，例如 `250`） |
| `cur` | array | 否 | 允许的货币（例如 `["USD"]`） |
| `allimps` | integer | 否 | 可用曝光指示 |

### 曝光对象（`imp[]`）

| 字段 | 类型 | 是否必需 | 说明 |
|---|---|---|---|
| `id` | string | 是 | 唯一曝光 ID |
| `banner` | object | 二选一 | 横幅广告位（见下文） |
| `native` | object | 二选一 | 原生广告位 |
| `bidfloor` | float | 否 | 最低出价（CPM，USD）。默认为 `0` |
| `bidfloorcur` | string | 否 | 底价货币。默认为 `USD` |
| `instl` | integer | 否 | 弹窗（全屏/插屏）时设为 `1` |
| `tagid` | string | 否 | SSP 侧该曝光的广告位/标签 ID |
| `ext.type` | string | 否 | SSP 提供的格式提示。使用 `"pop"` 表示弹窗 |

### 横幅对象（`imp[].banner`）

| 字段 | 类型 | 说明 |
|---|---|---|
| `w` | integer | 宽度（像素） |
| `h` | integer | 高度（像素） |

### 站点对象（`site`）

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 站点在您平台上的 ID |
| `name` | string | 站点名称（可读） |
| `domain` | string | 站点域名 |
| `page` | string | 页面完整 URL |
| `cat` | array | IAB 内容分类 |
| `publisher.id` | string | 发布商 ID |
| `keywords` | string | 逗号分隔的关键词 |

### 设备对象（`device`）

| 字段 | 类型 | 说明 |
|---|---|---|
| `ua` | string | User-Agent 字符串 |
| `ip` | string | 用户的 IPv4 地址 |
| `ipv6` | string | 用户的 IPv6 地址（无 IPv4 时发送） |
| `geo.country` | string | ISO 3166-1 alpha-3 国家代码（例如 `IND`、`IDN`、`USA`） |
| `os` | string | 操作系统（例如 `Android`、`iOS`） |
| `devicetype` | integer | OpenRTB 设备类型代码（例如 `1` = 移动设备） |
| `language` | string | 浏览器/设备语言代码 |
| `carrier` | string | 移动运营商名称 |
| `js` | integer | 支持 JavaScript 为 `1`，否则为 `0` |

### 用户对象（`user`）

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 买方侧用户 ID |

---

## 竞价响应

成功出价时，我们返回 HTTP `200` 及 JSON 响应体。若没有匹配的广告系列，我们返回 HTTP `204 No Content`（无响应体）。

### 顶层字段

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 回显竞价请求的 `id` |
| `seatbid` | array | 包含一个 seat bid 对象的数组 |
| `cur` | string | 货币 — 始终为 `USD` |

### 出价对象（`seatbid[].bid[]`）

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 唯一出价 ID |
| `impid` | string | 请求中的曝光 ID |
| `price` | float | 出价（CPM，USD） |
| `adid` | string | 广告系列 ID |
| `crid` | string | 创意 ID |
| `adm` | string | 广告代码 — 横幅/原生为 HTML；弹窗为跳转 URL |
| `ext.popurl` | string | 弹窗落地页 URL（仅弹窗，与 `adm` 相同） |
| `w` | integer | 创意宽度（弹窗为 `0`） |
| `h` | integer | 创意高度（弹窗为 `0`） |
| `nurl` | string | 获胜通知 URL（我们胜出时触发） |
| `burl` | string | 计费通知 URL（曝光时触发） |
| `lurl` | string | 失败通知 URL，包含 `${AUCTION_LOSS}` 宏（我们失败时触发） |

---

## 示例

### 请求

```json
{
  "id": "xqoErTidWX",
  "imp": [
    {
      "id": "AhpTG",
      "banner": { "w": 300, "h": 250 },
      "bidfloor": 0
    }
  ],
  "site": {
    "id": "674721464",
    "domain": "example.com",
    "page": "https://example.com",
    "cat": ["IAB25-3"],
    "publisher": { "id": "17918" }
  },
  "device": {
    "ua": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36",
    "geo": { "country": "IND" },
    "ip": "223.184.195.38",
    "os": "Android",
    "language": "en"
  },
  "user": { "id": "platform:2fda85882b825efbb54e84d014ff8fb9" },
  "at": 1
}
```

### 响应（有出价）

```json
{
  "id": "xqoErTidWX",
  "seatbid": [
    {
      "bid": [
        {
          "id": "xqoErTidWX",
          "impid": "AhpTG",
          "price": 0.5,
          "adid": "AWC-20251003-094732-029-6102",
          "crid": "AWC-20251003-094732-029-6102",
          "adm": "<a href='https://...' target='_blank'><img src='https://...' width='300' height='250'></a>",
          "w": 300,
          "h": 250,
          "nurl": "http://rtb.revosurge.com/rtb/win?id=xqoErTidWX&impId=AhpTG",
          "burl": "http://rtb.revosurge.com/rtb/bill?id=xqoErTidWX&impId=AhpTG",
          "lurl": "http://rtb.revosurge.com/rtb/loss?id=xqoErTidWX&impId=AhpTG&nbr=${AUCTION_LOSS}"
        }
      ],
      "seat": "revo"
    }
  ],
  "cur": "USD"
}
```

### 响应（不出价）

```
HTTP 204 No Content
```

---

## 弹窗（Popunder）格式

如需请求弹窗库存，请设置 `imp[].instl: 1` 和 `imp[].ext.type: "pop"`。响应中的 `adm` 将是跳转 URL（而非 HTML），出价对象还会包含值相同的 `ext.popurl`。

### 请求（弹窗）

```json
{
  "id": "pxBrQtYuWZ",
  "imp": [
    {
      "id": "ImpPop1",
      "instl": 1,
      "bidfloor": 0.1,
      "ext": { "type": "pop" }
    }
  ],
  "site": {
    "id": "70915",
    "domain": "example.com",
    "page": "https://example.com/",
    "ext": { "categories": "Entertainment" }
  },
  "device": {
    "ua": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36",
    "geo": { "country": "VNM" },
    "ip": "113.175.11.125",
    "os": "Android"
  },
  "at": 1,
  "tmax": 250
}
```

### 响应（弹窗出价）

```json
{
  "id": "pxBrQtYuWZ",
  "seatbid": [
    {
      "bid": [
        {
          "id": "b91c3e2a-7f4d-4b1a-93ec-8f21ad047c12",
          "impid": "ImpPop1",
          "price": 0.64,
          "adid": "AWA-20260403-060030-100-5550",
          "crid": "AWR-20260326-024959-045-0754",
          "adm": "https://ingestor.revosurge.com/pop?...",
          "ext": { "popurl": "https://ingestor.revosurge.com/pop?..." },
          "w": 0,
          "h": 0,
          "nurl": "http://rtb.revosurge.com/rtb/win?id=pxBrQtYuWZ&impId=ImpPop1",
          "burl": "http://rtb.revosurge.com/rtb/bill?id=pxBrQtYuWZ&impId=ImpPop1",
          "lurl": "http://rtb.revosurge.com/rtb/loss?id=pxBrQtYuWZ&impId=ImpPop1&nbr=${AUCTION_LOSS}"
        }
      ],
      "seat": "revo"
    }
  ],
  "cur": "USD"
}
```
