---
title: Getting Started — SSP Integration
description: Step-by-step guide to onboarding RevoSurge as a DSP buyer on your SSP.
---

# Getting Started

This guide walks you through connecting RevoSurge as a buyer on your SSP.

## Step 1 — Request an SSP ID

Contact the RevoSurge partnerships team to receive your assigned `sspId`. This ID is used in the bid endpoint URL and allows us to route traffic and track performance per SSP.

## Step 2 — Configure your endpoint

Point your OpenRTB traffic to:

```
POST http://rtb.revosurge.com/api/v1/openrtb2/{sspId}/bid
Content-Type: application/json
```

Replace `{sspId}` with the ID provided to you.

## Step 3 — Send a test request

Send a minimal bid request to verify connectivity:

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

**Expected responses:**
- `200 OK` with a bid response body — we placed a bid
- `204 No Content` — no matching campaign for this request (no action needed)

## Step 4 — Verify notification URLs

Ensure your SSP fires the notification URLs returned in our bid response:

| URL field | When to fire | Macro to substitute |
|---|---|---|
| `nurl` (win URL) | Immediately when your SSP determines RevoSurge won the auction | none |
| `burl` (billing URL) | When the impression is rendered / billed | none |
| `lurl` (loss URL) | When RevoSurge loses the auction (optional but recommended) | `${AUCTION_LOSS}` → loss reason code |

See [Notifications](/en/supply/notifications) for details.

## Step 5 — Go live checklist

- [ ] SSP ID received and configured in endpoint URL
- [ ] `Content-Type: application/json` header set on all requests
- [ ] Test request returns 200 or 204 (no error responses)
- [ ] Win notification (`nurl`) firing confirmed
- [ ] Billing notification (`burl`) firing confirmed
- [ ] Bid request includes `device.geo.country`, `device.ua`, `device.ip`
