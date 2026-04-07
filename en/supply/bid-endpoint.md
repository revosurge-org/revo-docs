---
title: Bid Endpoint Reference
description: OpenRTB 2.5 bid request and response field reference for RevoSurge RTB integration.
---

# Bid Endpoint Reference

## Endpoint

| | |
|---|---|
| **URL** | `http://rtb.revosurge.com/api/v1/openrtb2/{sspId}/bid` |
| **Method** | `POST` |
| **Content-Type** | `application/json` |
| **Protocol** | OpenRTB 2.5 |

## Bid Request

### Top-level fields

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | Yes | Unique ID for this bid request |
| `imp` | array | Yes | List of impression objects (see below) |
| `site` | object | Recommended | Site where the ad will appear |
| `device` | object | Recommended | Device and user environment |
| `user` | object | No | User identity |
| `at` | integer | No | Auction type. We support `1` (first-price) |
| `tmax` | integer | No | Maximum response timeout in milliseconds (e.g. `250`) |
| `cur` | array | No | Allowed currencies (e.g. `["USD"]`) |
| `allimps` | integer | No | Indicator of available impressions |

### Impression object (`imp[]`)

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | Yes | Unique impression ID |
| `banner` | object | One of | Banner ad slot (see below) |
| `native` | object | One of | Native ad slot |
| `bidfloor` | float | No | Minimum bid price in CPM (USD). Defaults to `0` |
| `bidfloorcur` | string | No | Currency for bid floor. Defaults to `USD` |
| `instl` | integer | No | Set to `1` for popunder (fullscreen/interstitial) |
| `tagid` | string | No | SSP zone/tag ID for the impression |
| `ext.type` | string | No | Format hint from SSP. Use `"pop"` to signal popunder |

### Banner object (`imp[].banner`)

| Field | Type | Description |
|---|---|---|
| `w` | integer | Width in pixels |
| `h` | integer | Height in pixels |

### Site object (`site`)

| Field | Type | Description |
|---|---|---|
| `id` | string | Site ID on your platform |
| `name` | string | Human-readable site name |
| `domain` | string | Site domain |
| `page` | string | Full URL of the page |
| `cat` | array | IAB content categories |
| `publisher.id` | string | Publisher ID |
| `keywords` | string | Comma-separated keywords |

### Device object (`device`)

| Field | Type | Description |
|---|---|---|
| `ua` | string | User agent string |
| `ip` | string | IPv4 address of the user |
| `ipv6` | string | IPv6 address of the user (send if no IPv4 is available) |
| `geo.country` | string | ISO 3166-1 alpha-3 country code (e.g., `IND`, `IDN`, `USA`) |
| `os` | string | Operating system (e.g., `Android`, `iOS`) |
| `devicetype` | integer | OpenRTB device type code (e.g., `1` = mobile) |
| `language` | string | Browser/device language code |
| `carrier` | string | Mobile carrier name |
| `js` | integer | `1` if JavaScript is supported, `0` otherwise |

### User object (`user`)

| Field | Type | Description |
|---|---|---|
| `id` | string | Buyer-specific user ID |

---

## Bid Response

On a successful bid, we return HTTP `200` with a JSON body. If we have no matching campaign, we return HTTP `204 No Content` (no body).

### Top-level fields

| Field | Type | Description |
|---|---|---|
| `id` | string | Echoes the bid request `id` |
| `seatbid` | array | Array with one seat bid object |
| `cur` | string | Currency — always `USD` |

### Bid object (`seatbid[].bid[]`)

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique bid ID |
| `impid` | string | Impression ID from the request |
| `price` | float | Bid price in CPM (USD) |
| `adid` | string | Campaign ID |
| `crid` | string | Creative ID |
| `adm` | string | Ad markup — HTML for banner/native; redirect URL for popunder |
| `ext.popurl` | string | Popunder landing URL (popunder only, mirrors `adm`) |
| `w` | integer | Creative width (`0` for popunder) |
| `h` | integer | Creative height (`0` for popunder) |
| `nurl` | string | Win notification URL (fire when we win) |
| `burl` | string | Billing notification URL (fire on impression) |
| `lurl` | string | Loss notification URL with `${AUCTION_LOSS}` macro (fire when we lose) |

---

## Example

### Request

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

### Response (bid)

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

### Response (no bid)

```
HTTP 204 No Content
```

---

## Popunder format

To request popunder inventory, set `imp[].instl: 1` and `imp[].ext.type: "pop"`. The response `adm` will be a redirect URL (not HTML), and the bid will also include `ext.popurl` with the same value.

### Request (popunder)

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

### Response (popunder bid)

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
