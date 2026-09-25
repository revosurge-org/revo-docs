---
title: S2S handoff & go-live
description: What to send your account manager, the end-to-end test that proves S2S is wired into your product, and what to re-check after launch.
---

# S2S handoff & go-live

**For:** Whoever owns the launch — usually the advertiser's UA manager, with the developer on
hand for the test.

[Validation](/en/tracking/s2s/validation) proves your payloads are correct. This page proves your **product**
sends them, and hands the integration to your account manager so campaigns can start
optimising on it.

## Before you hand off

- [ ] Every required rule in [Validation](/en/tracking/s2s/validation) passes (`S2S-R-01` … `S2S-R-17`)
- [ ] Recommended rules pass, or you have written down which ones you are skipping and why
- [ ] The **iGaming preset is enabled** for your Product (`S2S-R-14`) — confirm with your account
      manager before the test, not during it
- [ ] `register` and `deposit` fire from **production** code, not staging
- [ ] The events fire from your real handlers — the deposit event comes from the payment
      confirmation callback, not from the page the player sees afterwards
- [ ] Your `client_user_id` matches the `user_id` sent by the Web Tracker on the same site
      (`S2S-R-08`)
- [ ] The API key lives in a secret manager, and staging is on a separate key or `dryrun`

## What to send your account manager

| Deliverable | Why it is needed | Exceptions |
| --- | --- | --- |
| Which tier you have implemented — **Basic** or **Full** | Decides which optimisation goals your campaigns can use. Setting a campaign to a goal you do not feed is the most common cause of a bad first week. | None |
| The exact list of event names you send | We check them against the catalog before launch rather than after. Send as **text**, not a screenshot — the names have to be compared character by character. | None |
| Your Product name and domain | Confirms events are landing on the right Product. | None |
| Confirmation that the iGaming preset is enabled for your Product | `deposit` is an iGaming event. Without the subscription every deposit returns `422 EVENT_DISABLED`, whatever your code does. | None |
| Whether this Product has an **existing player base**, and your backfill or cut-off plan | FTD is derived as the earliest deposit we have seen. Without a plan, week-one FTD is inflated by existing players and bidding chases it. | Skip only for a genuinely new brand |
| A sample `eventId` from a real `202` response, with the time you sent it — **fill this in after the go-live test** | Lets us trace one known-good event end to end instead of searching blind. | Batch returns `requestId` and `count` rather than an `eventId` — send those instead |
| Which events are **not** implemented yet, and when they are coming | Stops us proposing goals you cannot support, and tells us when to revisit. | None |

::: tip Send the event list as text
Copy the names out of your code. A screenshot of a config screen cannot be diffed against the
catalog, and a single wrong character is invisible to the eye but fatal to the integration.
:::

## The go-live test

Do this with a real click on a live ad and a real deposit. A synthetic payload from a terminal
does not test the thing that usually breaks — your own code path.

1. Click a live RevoSurge ad
2. Land on your site, and let the Web Tracker fire (this is what captures the click)
3. Register a **new** test account
4. Log in
5. Make a small real deposit through the normal cashier

| Step | Expected result | Where to verify |
| --- | --- | --- |
| 2. Landing | The Web Tracker fires and the click ID is captured and stored against the session | Your own logs; Web Tracker event count in the portal |
| 3. Register | Your backend POSTs `register` and receives `202` with an `eventId` | Your request logs |
| 4. Login | `login` sent and accepted, same `client_user_id` | Your request logs |
| 5. Deposit | `deposit` sent from the **payment confirmation** handler, `202` returned | Your request logs |
| 5. Deposit | `context.transaction_id`, `context.amount` and `context.currency` all present and matching the real deposit — all three are required | The dry-run echo, or your logged payload |
| All | Every event carries the **same** `client_user_id`, and it matches the Web Tracker's `user_id` | Compare the payloads side by side |
| After | The test user appears with a registration and a deposit attributed to the campaign | Portal reporting |

## If the test fails

| Symptom | Check these rules |
| --- | --- |
| No `202` — request rejected outright | `S2S-R-01`, `S2S-R-02`, `S2S-R-03` |
| `200` instead of `202` | `S2S-R-12` — you are still in dry run |
| `422 EVENT_DISABLED` on `deposit` or any iGaming event | `S2S-R-14` — the preset is not enabled for your Product. Check this before anything else |
| `422 UNKNOWN_EVENT_TYPE` | `S2S-R-04` — that name is not in the catalog |
| `400` with `violations` | `S2S-R-05`, `S2S-R-06`, `S2S-R-07`, `S2S-R-13`, `S2S-R-15` — read the `field` and `rule` in the response |
| Everything returns `202`, but an optional field is missing downstream | `S2S-R-11` — a near-miss field name is being dropped silently |
| Events arrive but the deposit is not attributed to the campaign | `S2S-R-08`, `S2S-R-16` — the user ID does not match, or no click ID was passed |
| Registration counted twice | `S2S-R-08` — the same person exists as two profiles |
| FTD count far higher than expected in week one | `S2S-R-17` — existing players' deposits are landing as first deposits |
| Events arrive from staging | `S2S-O-06` — one key is serving both environments |

If every rule passes and the numbers are still wrong, stop and send your account manager the
`eventId` and timestamp of a specific event that behaved unexpectedly. One traceable example
resolves faster than a description of the symptom.

## After go-live: changes that require a re-check

| Change | Impact | Re-validate |
| --- | --- | --- |
| Rotating the API key | Every request fails the moment the old key is disabled | `S2S-R-01`, `S2S-R-03` |
| Adding events to move Basic → Full | New names may not match the catalog, may be subscription-gated, and each has its own required fields | `S2S-R-04`, `S2S-R-11`, `S2S-R-14`, `S2S-R-15` |
| Changing how account IDs are generated | Silently splits every user profile | `S2S-R-08` |
| Adding a new domain or Product | Events may land on the wrong Product, and a new Product has no deposit history | `S2S-R-01`, `S2S-R-10`, `S2S-R-17` |
| Changing payment provider or cashier flow | The deposit event may move, duplicate or stop, and `context.transaction_id` pairing can break | `S2S-R-10`, `S2S-R-15`, `S2S-O-02` |
| Server migration or new region | Clock skew and forwarded-IP handling both change | `S2S-R-06`, `S2S-R-09` |
| Adding a mobile app with an MMP | A third ID must line up with the other two | `S2S-R-08` |
| Upgrading to a new API version | Endpoint paths change | `S2S-R-02` |

::: tip Make two of these automatic
A test that asserts your deposit handler returns `202`, and one that asserts the ID you send
matches the ID the Web Tracker sends, will catch the two most expensive failures on this page
before they reach production.
:::

## Agencies

- The **advertiser** generates and owns the API key. An agency should not hold it, because it
  authenticates writes to the advertiser's data.
- If the agency runs the campaigns, send the event list and tier to the agency as well —
  they choose the optimisation goal, and they need to know what it can be set to.
- The advertiser's developer still owns the integration. Agencies cannot fix a `S2S-R-08`
  mismatch from the campaign side.

## Next steps

- [S2S overview](/en/tracking/s2s/overview) — tiers, catalog and portal setup
- [Validation](/en/tracking/s2s/validation) — the full rule list
- [Tracking overview](/en/tracking/overview) — how S2S fits with the other three methods
