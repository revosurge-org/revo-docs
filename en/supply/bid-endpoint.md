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
| `native` | object | One of | Native ad slot — used for Push format. `native.request` is a JSON string per [OpenRTB Native 1.2](https://iabtechlab.com/standards/openrtb-native/) |
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

## Example — Banner

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

---

## Push format

Push notification ads use the **OpenRTB Native 1.2** wire format. The SSP signals push inventory by populating `imp[].native.request` with a JSON-encoded native spec listing the assets to fill (title, body data, icon image, optional main image). RevoSurge responds with `bid.adm` set to a JSON-encoded native response that echoes each requested asset by `id`, plus a `link.url` (click target) and `imptrackers[]` (impression beacons).

### Native request spec (`imp.native.request`)

`imp.native.request` is a **JSON-encoded string** containing a top-level `native` object (some SSPs send the object directly without the wrapper — both are accepted). Inside, list the asset IDs you want filled. Common assets:

| Asset purpose | OpenRTB type | Notes |
|---|---|---|
| Title | `title.len` | Headline text. Recommended `len: 75-80` |
| Body / description | `data.type: 1` or `2`, `data.len` | Sub-text shown under the title |
| Icon image | `img.type: 1`, `wmin`/`hmin: 192` | Square icon (typical `192×192`) |
| Main image | `img.type: 3`, `wmin: 360`, `hmin: 240` | Optional landscape creative |

The asset `id` values you choose in the request are echoed back unchanged in the response — pick any consistent numbering.

### Response (`bid.adm`)

`bid.adm` is a JSON-encoded string with the shape:

```json
{
  "native": {
    "ver": "1.2",
    "link": { "url": "<click tracker → landing>" },
    "assets": [
      { "id": <yourAssetId>, "title": { "text": "..." } },
      { "id": <yourAssetId>, "data":  { "type": 1, "value": "..." } },
      { "id": <yourAssetId>, "img":   { "type": 1, "url": "...", "w": 192, "h": 192 } }
    ],
    "imptrackers": ["<impression tracker URL>"]
  }
}
```

Notes:
- `bid.adm` is a JSON **string**, not a JSON object (matches OpenRTB Native 1.2 wire convention).
- Each response asset's `id` matches the corresponding request asset's `id`.
- `link.url` is RevoSurge's `/click` tracker; it 302-redirects to the advertiser landing page.
- `imptrackers[]` contains URLs the SSP must fire when the push impression is rendered. Fire all of them (typically one).
- `bid.w`/`bid.h` reflect the main image dimensions when present; for icon-only push these may be the icon size.

### Example 1 — Push (SSP1, asset ids 1–4 with main image)

#### Request

```json
{
  "id": "8ac5b5082d76bd4f6257fe939a4d9ea9",
  "imp": [
    {
      "id": "1",
      "bidfloor": 0,
      "bidfloorcur": "USD",
      "secure": 1,
      "ext": { "ad_type": 30, "limit": 1 },
      "native": {
        "ver": "1.2",
        "request": "{\"plcmtcnt\":1,\"assets\":[{\"id\":1,\"required\":1,\"title\":{\"len\":75}},{\"id\":2,\"required\":1,\"data\":{\"type\":2,\"len\":70}},{\"id\":3,\"required\":1,\"img\":{\"wmin\":360,\"hmin\":240,\"type\":3,\"mimes\":[\"image/jpeg\",\"image/png\",\"image/gif\"]}},{\"id\":4,\"required\":1,\"img\":{\"wmin\":192,\"hmin\":192,\"type\":1,\"mimes\":[\"image/jpeg\",\"image/png\",\"image/gif\"]}}]}"
      }
    }
  ],
  "site": {
    "id": "1561372142393335",
    "domain": "example.com",
    "page": "http://example.com/",
    "cat": ["IAB1-5"]
  },
  "device": {
    "ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "ip": "42.119.65.0",
    "geo": { "country": "VNM" },
    "language": "ru",
    "devicetype": 2
  },
  "user": { "id": "0Rlj845qeg2NTXYsk7du" },
  "at": 2,
  "tmax": 175,
  "cur": ["USD"]
}
```

#### Response (push bid)

```json
{
  "id": "8ac5b5082d76bd4f6257fe939a4d9ea9",
  "seatbid": [
    {
      "bid": [
        {
          "id": "f159e84f-98a4-4f28-b6fe-46355a5efdd7",
          "impid": "1",
          "price": 0.3537,
          "adid": "AWA-20260512-032538-136-0607",
          "crid": "AWR-20260407-102628-441-3855",
          "adm": "{\"native\":{\"ver\":\"1.2\",\"link\":{\"url\":\"https://ingestor.revosurge.com/click?...&lp=https%3A%2F%2Fgoogle.com\"},\"assets\":[{\"id\":1,\"title\":{\"text\":\"TF88 ưu đãi thành viên mới\"}},{\"id\":2,\"data\":{\"type\":2,\"value\":\"THAM GIA NGAY\"}},{\"id\":3,\"img\":{\"type\":3,\"url\":\"https://storage.googleapis.com/.../main.png\",\"w\":492,\"h\":328}},{\"id\":4,\"img\":{\"type\":1,\"url\":\"https://ingestor.revosurge.com/push?...&icon_url=...\",\"w\":192,\"h\":192}}],\"imptrackers\":[\"https://ingestor.revosurge.com/push?...&icon_url=...\"]}}",
          "w": 492,
          "h": 328,
          "nurl": "http://rtb.revosurge.com/rtb/win?id=...&impId=1",
          "burl": "http://rtb.revosurge.com/rtb/bill?id=...&impId=1",
          "lurl": "http://rtb.revosurge.com/rtb/loss?id=...&impId=1&nbr=${AUCTION_LOSS}"
        }
      ],
      "seat": "revo"
    }
  ],
  "cur": "USD"
}
```

### Example 2 — Push (SSP2, asset ids 100–102 icon-only)

#### Request

```json
{
  "id": "ec936b20-46d9-41cb-bb64-cf55574cbf54",
  "imp": [
    {
      "id": "f7db2c67-1a0d-444f-98a8-6007264ad399",
      "bidfloor": 0,
      "secure": 1,
      "tagid": "23355",
      "native": {
        "ver": "1.2",
        "request": "{\"native\":{\"ver\":\"1.2\",\"plcmtcnt\":1,\"context\":1,\"plcmttype\":3,\"assets\":[{\"id\":100,\"required\":1,\"title\":{\"len\":80}},{\"id\":101,\"required\":1,\"data\":{\"len\":80,\"type\":1}},{\"id\":102,\"required\":1,\"img\":{\"type\":1,\"w\":192,\"h\":192,\"wmin\":192,\"hmin\":192}}]}}"
      }
    }
  ],
  "site": {
    "id": "218774",
    "domain": "https://www.example.com",
    "ref": "https://www.example.com/",
    "cat": ["IAB1-6"],
    "publisher": { "name": "23355" }
  },
  "device": {
    "ua": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36",
    "ip": "157.32.120.16",
    "geo": { "country": "IND" },
    "os": "Android",
    "language": "en-US",
    "carrier": "Jio",
    "connectiontype": 3,
    "js": 1
  },
  "user": { "id": "67e611989325729c5df4ef" },
  "at": 1,
  "tmax": 950,
  "cur": ["USD"]
}
```

#### Response (push bid)

```json
{
  "id": "ec936b20-46d9-41cb-bb64-cf55574cbf54",
  "seatbid": [
    {
      "bid": [
        {
          "id": "e2557481-ce10-43fa-ba5b-bb784ce4bb4c",
          "impid": "f7db2c67-1a0d-444f-98a8-6007264ad399",
          "price": 0.0276,
          "adid": "AWA-20260513-124333-003-5164",
          "crid": "AWR-20260407-102628-441-3855",
          "adm": "{\"native\":{\"ver\":\"1.2\",\"link\":{\"url\":\"https://ingestor.revosurge.com/click?...&lp=https%3A%2F%2Fgoogle.com\"},\"assets\":[{\"id\":100,\"title\":{\"text\":\"TF88\"}},{\"id\":101,\"data\":{\"type\":1,\"value\":\"TF88\"}},{\"id\":102,\"img\":{\"type\":1,\"url\":\"https://ingestor.revosurge.com/push?...&icon_url=...\",\"w\":192,\"h\":192}}],\"imptrackers\":[\"https://ingestor.revosurge.com/push?...&icon_url=...\"]}}",
          "w": 492,
          "h": 328,
          "nurl": "http://rtb.revosurge.com/rtb/win?id=...&impId=...",
          "burl": "http://rtb.revosurge.com/rtb/bill?id=...&impId=...",
          "lurl": "http://rtb.revosurge.com/rtb/loss?id=...&impId=...&nbr=${AUCTION_LOSS}"
        }
      ],
      "seat": "revo"
    }
  ],
  "cur": "USD"
}
```

### Push integration checklist

- [ ] `imp[].native.request` is a JSON **string** (not a parsed object).
- [ ] Asset IDs in your request are echoed back unchanged in the response — render assets by matching `id`.
- [ ] On render, fire ALL entries in `adm.native.imptrackers[]` (typically 1).
- [ ] Click on the creative navigates to `adm.native.link.url` (RevoSurge handles the redirect to the advertiser landing).
- [ ] Win notification (`nurl`) and billing (`burl`) follow the same rules as banner/popunder.
