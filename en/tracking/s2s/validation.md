---
title: S2S integration validation
description: The rules your S2S integration must pass before you launch a campaign, what breaks when each one fails, and how to fix it.
---

# S2S integration validation

**For:** The developer who built the integration, and the AM or BD confirming it is ready.
Run this **before** the first campaign goes live, not after it underdelivers.

::: info Two tiers of rule
**Required** rules block a launch — if one fails, the data RevoSurge optimises on is wrong or
absent. **Recommended** rules do not block, but each one costs you something specific.

Rule IDs (`S2S-R-01`, `S2S-O-01`…) are stable. Quote them in tickets and partner emails
instead of re-describing the problem.
:::

## Required rules

| ID | Rule | What breaks if it fails |
| --- | --- | --- |
| `S2S-R-01` | API Key is generated and **S2S Status** reads Active | Every request is rejected. Nothing is stored. |
| `S2S-R-02` | Requests go to the **v3** endpoints (`/v3/s2s/event`, `/v3/s2s/batch`) | v2 will be deprecated on **18 October 2026**. Anything added to the catalog after v3 is not reachable from v2, and nothing tells you it is missing. |
| `S2S-R-03` | `X-API-KEY` header is sent on every request, from your backend only | Missing header is rejected outright. A key shipped in frontend or app code is a credential leak — anyone can write events into your account. |
| `S2S-R-04` | `event` is an exact catalog name | `422 UNKNOWN_EVENT_TYPE`. The event never lands, and nothing in reporting tells you it is missing. |
| `S2S-R-05` | `timestamp` is UTC epoch **milliseconds** (13 digits) | Rejected with `rule: "not_milliseconds"`. Seconds are the single most common integration bug. |
| `S2S-R-06` | `timestamp` is not more than 5 minutes ahead of real time | Rejected with `rule: "future_skew"`. Usually an unsynced server clock or a local-time conversion. |
| `S2S-R-07` | `identity.client_user_id` is present | The event cannot be joined to a user. It is counted, but it optimises nothing. |
| `S2S-R-08` | `client_user_id` is the **same string** you pass the Web Tracker as `user_id` and your MMP as Customer User ID | The same player becomes two profiles. Deposits do not attach to the click that won them, and the same conversion can be counted twice. |
| `S2S-R-09` | `context.ip_address` is present | No geo enrichment. Country-level reporting and geo targeting degrade. |
| `S2S-R-10` | Both Basic events are live: `register` and `deposit` | Below this, S2S buys you nothing the Web Tracker does not already do. FTD reporting stays empty. |
| `S2S-R-11` | A dry run reports no misspelled fields and no `violations` | A near-miss name on an **optional** field (`context.payment_metod`) is dropped silently. The request still returns success, so nothing looks wrong. |
| `S2S-R-12` | Production traffic returns `202`, not `200` | A `200` with `X-Ingest-Mode: dryrun` means you are still in dry run. Nothing is being stored. |
| `S2S-R-13` | Email and phone are sent hashed, never raw | Rejected with `rule: "pii_format"`, and sending raw PII at all is a compliance problem you own. |
| `S2S-R-14` | The **iGaming preset is enabled** for your Product | `422 EVENT_DISABLED`. Every iGaming event — including `deposit` — is rejected until RevoSurge enables it. This is not something you can fix in code. |
| `S2S-R-15` | Every event carries the context fields **that event** requires | `400 VALIDATION_ERROR` with `rule: "required"`. `deposit` needs `context.transaction_id`, `context.amount` and `context.currency` — all three, on every deposit. |
| `S2S-R-16` | `identity.click_id` is passed on server events wherever you have it | Attribution falls back to user-ID stitching alone. First-session conversions — the ones a new campaign is judged on — are the most likely to be missed. |
| `S2S-R-17` | If you have **existing players**, historical deposits are backfilled or a cut-off is agreed before launch | FTD is the earliest deposit we have seen. Every existing player's next deposit counts as a first deposit, inflating week-one FTD and misdirecting any campaign bidding on it. |

## Recommended rules

| ID | Rule | What it costs |
| --- | --- | --- |
| `S2S-O-01` | Send `login` | Cannot separate returning players from new ones, so reactivation and acquisition look the same. |
| `S2S-O-02` | Send `deposit_initiated`, carrying the `context.transaction_id` that the later `deposit` or `deposit_failed` repeats | No visibility into cashier drop-off — usually the largest recoverable loss in an iGaming funnel. |
| `S2S-O-03` | Send `context.user_agent` | Weaker device intelligence and a weaker fraud signal. |
| `S2S-O-04` | Use `/v3/s2s/batch` for backfills | Sending one at a time burns the per-key rate limit and makes a backfill take hours instead of minutes. |
| `S2S-O-05` | Retry `429` with exponential backoff and jitter | Events dropped during traffic spikes — exactly when they matter most. |
| `S2S-O-06` | Use separate API keys for staging and production | Test events pollute live reporting and live bidding. |

## Required resolutions

### `S2S-R-01` — No active API key

**Fix:** Product → Setup Wizard → **Step 3 · S2S Postback** → **Generate API Key**. Or
Manage Product → your product → **S2S** card. The key is shown masked once — copy it to your
secret manager immediately.

Generating a new key does not revoke the old one. Rotate deliberately, and remove the old key
from your backend before you disable it.

### `S2S-R-02` — Still calling v2

**Fix:** Change the base path from `/v2/s2s/…` to `/v3/s2s/…`, and send `timestamp` in
milliseconds rather than seconds. The auth header and envelope are unchanged. See
[Migration](/en/tracking/s2s/v3/migration).

v2 will be deprecated on **18 October 2026**.

Nothing about v2 fails loudly, which is why integrations sit on it for months without anyone
noticing.

### `S2S-R-03` — Missing or exposed API key

**Fix:** `POST` to `https://datapulse-api.revosurge.com/v3/s2s/event` with
`X-API-KEY: <your key>` and `Content-Type: application/json`, from server-side code only.

If the key has ever been in frontend JavaScript, a mobile binary, a tag manager or a public
repo, treat it as compromised: generate a new one, cut over, then disable the old one.

### `S2S-R-04` — Unknown event name

**Fix:** Check the name against [Standard events](/en/tracking/s2s/v3/events-standard) and
[iGaming events](/en/tracking/s2s/v3/events-igaming). Names are lowercase with underscores and must match
exactly. `first_deposit` is not a catalog event — a first deposit is sent as `deposit`.

::: info First deposits are derived, not sent
Send every deposit as `deposit`. RevoSurge derives the FTD as the earliest `deposit` received
for that user — there is no first-deposit event or flag to set.

The consequence is in `S2S-R-17`: if you have existing players, their next deposit is the first
one we have seen, and it counts as a first deposit.
:::

### `S2S-R-05` — Timestamp in seconds

**Fix:** Multiply by 1000. A valid `timestamp` is 13 digits; a 10-digit value is seconds and
is rejected with `rule: "not_milliseconds"`.

### `S2S-R-06` — Timestamp in the future

**Fix:** Send UTC, not local time, and check NTP on the sending host. Converting a local
timestamp without adjusting the zone is the usual cause — it fails only for servers ahead of
UTC, so it can look intermittent.

### `S2S-R-07` — Missing `client_user_id`

**Fix:** Put your stable account ID in `identity.client_user_id`. For genuinely pre-login
events, send `identity.anonymous_id` instead — identity must carry at least one of the two.

For `app_install`, `app_open` and `app_uninstall` this requirement is **relaxed** — the field
becomes suggested rather than required, not something to drop by default.

### `S2S-R-08` — User ID does not match across methods

**Fix:** Use one ID everywhere — the Web Tracker's `user_id`, S2S `identity.client_user_id`,
and your MMP's Customer User ID must be the same string for the same person. Same casing, no
prefixes on one and not the other.

This is the single most expensive mistake on this page, and it is invisible: every request
succeeds, the events are all stored, and the numbers are simply wrong. Fixing it later does
not retroactively join the split profiles.

### `S2S-R-09` — Missing IP address

**Fix:** Put the **end user's** IP in `context.ip_address`, not your server's. Behind a proxy
or CDN, read it from the forwarded-for header.

Relaxed to suggested for `app_install` and `bet`. `bet` is relaxed because server-side bets may
genuinely have no end-user IP — it is a fallback, not a licence to omit it.

### `S2S-R-10` — Basic events not both live

**Fix:** `register` and `deposit` are the minimum. If only one is firing, the funnel has no
conversion rate and FTD reporting has nothing to count.

### `S2S-R-11` — Dry run reports misspelled fields

**Fix:** Send your real payload to `/v3/s2s/event?dryrun=1` and read the echo. On a single
event, a clean result is `"misspelledFields": []`. On a batch the key is **absent entirely**
when nothing is misspelled — not an empty array — so do not assert `=== []` against a batch
response or you will get a false failure.

Anything listed there is close enough to a real field that we can guess what you meant, but it
is being dropped, not corrected.

This check matters for **optional** fields. A misspelled required field fails loudly with a
`400`; a misspelled `context.payment_method` returns `202` and is simply gone.

### `S2S-R-12` — Still in dry run

**Fix:** Remove `?dryrun=1` from the production URL. Real traffic returns `202` with
`{"status":"accepted","eventId":"…"}`. If you are seeing `200` and the header
`X-Ingest-Mode: dryrun`, nothing you have sent has been stored.

### `S2S-R-13` — Unhashed PII

**Fix:** `context.privacy.email_hash` is SHA-256 of the lowercased, trimmed email.
`context.privacy.phone_hash` is SHA-256 of the E.164-normalised number. Both are lowercase
hex, exactly 64 characters (`^[a-f0-9]{64}$`). A malformed hash fails with `rule: "pii_format"`.

### `S2S-R-14` — iGaming events disabled for your Product

**Fix:** You cannot fix this in code. The iGaming preset is enabled per Product by RevoSurge —
ask your account manager to switch it on, then re-test.

Standard events (`general.core`) are auto-enabled for every Product. iGaming events are not, and
`deposit` is an iGaming event. An integration that is otherwise perfect will return
`422 EVENT_DISABLED` on every deposit until the subscription is in place. Check this **first**,
before debugging anything else.

### `S2S-R-15` — Missing per-event required fields

**Fix:** Read the required list for each event you send in
[Standard events](/en/tracking/s2s/v3/events-standard) and [iGaming events](/en/tracking/s2s/v3/events-igaming). The ones that
catch people out:

| Event | Required context fields |
| --- | --- |
| `deposit` | `context.transaction_id` · `context.amount` · `context.currency` |
| `deposit_initiated` | `context.transaction_id` |
| `deposit_failed` | `context.transaction_id` |
| `withdraw` | `context.transaction_id` · `context.amount` · `context.currency` |
| `bet` | `context.transaction_id` |
| `app_install` · `app_open` · `app_uninstall` | `context.platform` (`ios` / `android` / `web`) |

`context.amount` and `context.currency` are **not optional** on `deposit`. A deposit without
them is rejected with `400 VALIDATION_ERROR`, `rule: "required"` — it does not arrive as a
countable deposit with a missing value.

Use the same `context.transaction_id` across `deposit_initiated` → `deposit` / `deposit_failed`
so the cashier funnel can be paired.

### `S2S-R-16` — No `click_id` on server events

**Fix:** Capture RevoSurge's click ID when the visitor lands, persist it against their session
or account, and send it as `identity.click_id` on your server events. It matters most on
`register` and the first `deposit`.

`click_id` does not satisfy the identity requirement on its own — you still need
`client_user_id` or `anonymous_id` (`S2S-R-07`).

### `S2S-R-17` — Existing players not accounted for

**Fix:** Pick one before you launch:

- **Backfill.** Send your historical deposits through `/v3/s2s/batch` (600 per request) so the
  genuine first deposits are on record before live traffic starts.
- **Agree a cut-off** with your account manager, and discount FTDs from known players for the
  first reporting period.

Only skip this if the Product is a genuinely new brand with no existing player base.

This is not a code defect and nothing will error. It shows up as an FTD number that looks
excellent in week one, collapses in week two, and has already moved your bids in between.

## Recommended resolutions

### `S2S-O-01` — No `login`

**Fix:** Send `login` on successful authentication. Cheap to add, and it is what separates
reactivation from acquisition in reporting.

### `S2S-O-02` — No `deposit_initiated`

**Fix:** Fire it when the player enters the cashier, with a `context.transaction_id` you repeat
on the resulting `deposit` or `deposit_failed`. Without the matching ID the two events cannot be
paired and the drop-off rate is unusable.

### `S2S-O-03` — No user agent

**Fix:** Pass the end user's user-agent string in `context.user_agent`.

### `S2S-O-04` — Backfills sent one event at a time

**Fix:** Use `/v3/s2s/batch` with a bare JSON array. 600 events per request is a hard ceiling —
601 is rejected with `400 BATCH_TOO_LARGE`, not truncated.

A batch returns `{"status":"accepted","requestId":…,"count":…}`. There is no single `eventId` on
a batch response.

### `S2S-O-05` — No retry on rate limit

**Fix:** Treat `429` as retryable with exponential backoff and jitter. The limit is per API key
on a rolling one-minute window. Do not retry `400` or `422` — those are payload problems that
will fail identically forever.

### `S2S-O-06` — One key for all environments

**Fix:** Generate a second key and point staging at it, or keep staging on `?dryrun=1`
permanently. Note that dry runs still count against the rate limit.

## Two things this page cannot check

- **That your production code path actually fires.** Every rule here can pass on a payload you
  built by hand in a terminal while the real deposit handler sends nothing. Only the
  [go-live test](/en/tracking/s2s/handoff#the-go-live-test) proves the integration is wired into your product.
- **That our numbers match yours.** Rule-clean data can still disagree with your BI — timezone
  boundaries, attribution windows and currency handling all move totals. Reconcile deliberately
  rather than assuming a discrepancy is a bug.

## Next steps

Once every required rule passes, go to [Handoff & go-live](/en/tracking/s2s/handoff) to run the end-to-end
test and tell your account manager you are ready.
