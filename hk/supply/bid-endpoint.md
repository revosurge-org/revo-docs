---
title: 競價接口參考
description: RevoSurge RTB 接入的 OpenRTB 2.5 競價請求與響應欄位參考。
---

# 競價接口參考

## 接口地址

| | |
|---|---|
| **URL** | `http://rtb.revosurge.com/api/v1/openrtb2/{sspId}/bid` |
| **方法** | `POST` |
| **Content-Type** | `application/json` |
| **協議** | OpenRTB 2.5 |

## 競價請求

### 頂層欄位

| 欄位 | 類型 | 是否必需 | 說明 |
|---|---|---|---|
| `id` | string | 是 | 本次競價請求的唯一 ID |
| `imp` | array | 是 | 曝光對象列表（見下文） |
| `site` | object | 建議 | 廣告展示所在網站 |
| `device` | object | 建議 | 裝置與用戶環境 |
| `user` | object | 否 | 用戶身份 |
| `at` | integer | 否 | 競價類型。我們支援 `1`（一價競價） |
| `tmax` | integer | 否 | 最大響應超時（毫秒，例如 `250`） |
| `cur` | array | 否 | 允許的貨幣（例如 `["USD"]`） |
| `allimps` | integer | 否 | 可用曝光指示 |

### 曝光對象（`imp[]`）

| 欄位 | 類型 | 是否必需 | 說明 |
|---|---|---|---|
| `id` | string | 是 | 唯一曝光 ID |
| `banner` | object | 二選一 | 橫幅廣告位（見下文） |
| `native` | object | 二選一 | 原生廣告位 |
| `bidfloor` | float | 否 | 最低出價（CPM，USD）。預設為 `0` |
| `bidfloorcur` | string | 否 | 底價貨幣。預設為 `USD` |
| `instl` | integer | 否 | 彈窗（全屏/插屏）時設為 `1` |
| `tagid` | string | 否 | SSP 側該曝光的廣告位/標籤 ID |
| `ext.type` | string | 否 | SSP 提供的格式提示。使用 `"pop"` 表示彈窗 |

### 橫幅對象（`imp[].banner`）

| 欄位 | 類型 | 說明 |
|---|---|---|
| `w` | integer | 寬度（像素） |
| `h` | integer | 高度（像素） |

### 網站對象（`site`）

| 欄位 | 類型 | 說明 |
|---|---|---|
| `id` | string | 網站在您平台上的 ID |
| `name` | string | 網站名稱（可讀） |
| `domain` | string | 網站域名 |
| `page` | string | 頁面完整 URL |
| `cat` | array | IAB 內容分類 |
| `publisher.id` | string | 發布商 ID |
| `keywords` | string | 逗號分隔的關鍵詞 |

### 裝置對象（`device`）

| 欄位 | 類型 | 說明 |
|---|---|---|
| `ua` | string | User-Agent 字符串 |
| `ip` | string | 用戶的 IPv4 地址 |
| `ipv6` | string | 用戶的 IPv6 地址（無 IPv4 時發送） |
| `geo.country` | string | ISO 3166-1 alpha-3 國家代碼（例如 `IND`、`IDN`、`USA`） |
| `os` | string | 操作系統（例如 `Android`、`iOS`） |
| `devicetype` | integer | OpenRTB 裝置類型代碼（例如 `1` = 移動裝置） |
| `language` | string | 瀏覽器/裝置語言代碼 |
| `carrier` | string | 移動運營商名稱 |
| `js` | integer | 支援 JavaScript 為 `1`，否則為 `0` |

### 用戶對象（`user`）

| 欄位 | 類型 | 說明 |
|---|---|---|
| `id` | string | 買方側用戶 ID |

---

## 競價響應

成功出價時，我們返回 HTTP `200` 及 JSON 響應體。若沒有匹配的廣告系列，我們返回 HTTP `204 No Content`（無響應體）。

### 頂層欄位

| 欄位 | 類型 | 說明 |
|---|---|---|
| `id` | string | 回顯競價請求的 `id` |
| `seatbid` | array | 包含一個 seat bid 對象的數組 |
| `cur` | string | 貨幣 — 始終為 `USD` |

### 出價對象（`seatbid[].bid[]`）

| 欄位 | 類型 | 說明 |
|---|---|---|
| `id` | string | 唯一出價 ID |
| `impid` | string | 請求中的曝光 ID |
| `price` | float | 出價（CPM，USD） |
| `adid` | string | 廣告系列 ID |
| `crid` | string | 創意 ID |
| `adm` | string | 廣告代碼 — 橫幅/原生為 HTML；彈窗為跳轉 URL |
| `ext.popurl` | string | 彈窗落地頁 URL（僅彈窗，與 `adm` 相同） |
| `w` | integer | 創意寬度（彈窗為 `0`） |
| `h` | integer | 創意高度（彈窗為 `0`） |
| `nurl` | string | 獲勝通知 URL（我們勝出時觸發） |
| `burl` | string | 計費通知 URL（曝光時觸發） |
| `lurl` | string | 失敗通知 URL，包含 `${AUCTION_LOSS}` 宏（我們失敗時觸發） |

---

## 示例

### 請求

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

### 響應（有出價）

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

### 響應（不出價）

```
HTTP 204 No Content
```

---

## 彈窗（Popunder）格式

如需請求彈窗庫存，請設置 `imp[].instl: 1` 和 `imp[].ext.type: "pop"`。響應中的 `adm` 將是跳轉 URL（而非 HTML），出價對象還會包含值相同的 `ext.popurl`。

### 請求（彈窗）

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

### 響應（彈窗出價）

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
