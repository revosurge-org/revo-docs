---
title: Notifications
description: Win, billing, and loss notification handling for RevoSurge RTB integration.
---

# Notifications

When RevoSurge bids, we include three notification URLs in the bid response. Your SSP is responsible for firing these URLs at the right time with the correct macro values substituted.

## Notification URLs

| Field | Fires when | Required |
|---|---|---|
| `nurl` (win) | Your SSP determines RevoSurge won the auction | Yes |
| `burl` (billing) | The impression is rendered and billed | Yes |
| `lurl` (loss) | RevoSurge loses the auction | Recommended |

## Macro substitution

Only the **loss URL** (`lurl`) contains a macro that your SSP must substitute. Win and billing URLs do not include a price macro — they only carry the auction and impression IDs.

| URL | Macro | Required |
|---|---|---|
| `nurl` | none | — |
| `burl` | none | — |
| `lurl` | `${AUCTION_LOSS}` | Yes — loss reason code per OpenRTB spec |

## Example URLs (as returned in bid response)

**Win notification:**
```
GET http://rtb.revosurge.com/rtb/win?id=xqoErTidWX&impId=AhpTG
```

**Billing notification:**
```
GET http://rtb.revosurge.com/rtb/bill?id=xqoErTidWX&impId=AhpTG
```

**Loss notification** (substitute `${AUCTION_LOSS}` before firing):
```
GET http://rtb.revosurge.com/rtb/loss?id=xqoErTidWX&impId=AhpTG&nbr=100
```

## Important notes

- All notification URLs use **HTTP GET**
- We expect a `200 OK` response; we do not retry on failure
- Loss reason codes follow the [OpenRTB 2.5 loss reason codes](https://github.com/InteractiveAdvertisingBureau/openrtb/blob/master/OpenRTB%20v2.5%20FINAL.pdf)
