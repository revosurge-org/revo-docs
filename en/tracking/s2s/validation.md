---
title: "S2S integration validation"
description: "Validate S2S authorization, payload fields, delivery modes and live campaign conversions."
---

# S2S integration validation


**For:** The developer who built the integration. Run this **before** the first campaign goes live, not after it underdelivers.

**Two tiers of rule**
**Required** rules block a launch — if one fails, the data RevoSurge optimises on is wrong or
absent. **Recommended** rules do not block, but each one costs you something specific.

Rule IDs (`S2S-R-01`, `S2S-O-01`…) are stable. Quote them in tickets and partner emails
instead of re-describing the problem.

## Required rules

| ID | Rule | What breaks if it fails |
| --- | --- | --- |
| `S2S-R-01` | API key is enabled and authorized for the intended Product | An inactive or incorrectly scoped key cannot authorize the request. Source activity is separate from credential validity. |
| `S2S-R-02` | Requests go to the **v3** endpoints (`/v3/s2s/event`, `/v3/s2s/batch`) | Unsupported endpoints do not follow the documented v3 contract. |
| `S2S-R-03` | `X-API-KEY` header is sent on every request, from your backend only | Missing header is rejected outright. A key shipped in frontend or app code is a credential leak — anyone can write events into your account. |
| `S2S-R-04` | `event` is an exact catalog name | `422 UNKNOWN_EVENT_TYPE`. The event never lands, and nothing in reporting tells you it is missing. |
| `S2S-R-05` | `timestamp` is UTC epoch **milliseconds** (13 digits) | Rejected with `rule: "not_milliseconds"`. Seconds are the single most common integration bug. |
| `S2S-R-06` | `timestamp` is not more than 5 minutes ahead of real time | Rejected with `rule: "future_skew"`. Usually an unsynced server clock or a local-time conversion. |
| `S2S-R-07` | `identity` contains `client_user_id` or `anonymous_id`, plus any identity field required by the event | `click_id` alone is insufficient. Missing required identity fails validation; it must not be treated as an accepted anonymous conversion. |
| `S2S-R-08` | `client_user_id` is the **same string** you pass the Web Tracker as `user_id` and your MMP as Customer User ID | The same player becomes two profiles. Deposits do not attach to the click that won them, and the same conversion can be counted twice. |
| `S2S-R-09` | The event’s IP requirement is met using the end-user IP | A missing required IP fails validation. Where IP is suggested, omission can reduce geo enrichment. See the event exceptions below. |
| `S2S-R-10` | Both Basic events are live: `register` and `deposit` | Below this, S2S buys you nothing the Web Tracker does not already do. FTD reporting stays empty. |
| `S2S-R-11` | Dry run has no reported misspellings or violations; context fields are also checked against the catalog | The typo check covers envelope and identity keys, not optional context keys. A clean result does not prove every context field is spelled correctly. |
| `S2S-R-12` | Production traffic returns `202`, not `200` | A `200` means the event never reached production. `X-Ingest-Mode: dryrun` means nothing is being stored; `X-Ingest-Mode: test` means every event is being stored as a test event that no report, attribution or bid ever sees. |
| `S2S-R-13` | Email and phone are sent hashed, never raw | Rejected with `rule: "pii_format"`, and sending raw PII at all is a compliance problem you own. |
| `S2S-R-14` | The Product’s **market category** matches the industry events you send | The corresponding industry preset is enabled by this category. Check the category and event availability before testing. |
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
| `S2S-O-05` | Handle `429`, `5xx` and ambiguous transport outcomes with bounded retries and reconciliation | Missing retries can lose events; blind retries after an unknown outcome can duplicate them. |
| `S2S-O-06` | Use separate API keys for staging and production, or send staging traffic in test mode | Test events pollute live reporting and live bidding. |

## Required resolutions

### `S2S-R-01` — No active API key

**Fix:** **Account menu → API Keys & Postbacks → API Keys → Create API Key**. Select the intended Product, set the API key name, then choose **Generate key**. Check **Attached to** and Enabled status. Store the key in your server-side secret manager; keep it out of browser code and documentation screenshots.

Generating a new key does not revoke the old one. Rotate deliberately, and remove the old key
from your backend before you disable it.

### `S2S-R-02` — Incorrect endpoint {#s2s-r-02-incorrect-endpoint}

**Fix:** Send requests to `/v3/s2s/event` or `/v3/s2s/batch`, using the [request envelope](/en/tracking/events/common-fields) and Unix millisecond timestamps. See the [Server Events API](/en/tracking/s2s/v3/server-events-api).

### `S2S-R-03` — Missing or exposed API key

**Fix:** `POST` to `https://datapulse-api.revosurge.com/v3/s2s/event` with
`X-API-KEY: <your key>` and `Content-Type: application/json`, from server-side code only.

If the key has ever been in frontend JavaScript, a mobile binary, a tag manager or a public
repo, treat it as compromised: generate a new one, cut over, then disable the old one.

### `S2S-R-04` — Unknown event name

**Fix:** Check the name against [Standard events](/en/tracking/events/events-standard) and
[iGaming events](/en/tracking/events/events-igaming). Names are lowercase with underscores and must match
exactly. `first_deposit` is not a catalog event — a first deposit is sent as `deposit`.

**First deposits are derived, not sent**
Send every deposit as `deposit`. RevoSurge derives the FTD as the earliest `deposit` received
for that user — there is no first-deposit event or flag to set.

The consequence is in `S2S-R-17`: if you have existing players, their next deposit is the first
one we have seen, and it counts as a first deposit.

### `S2S-R-05` — Timestamp in seconds

**Fix:** Multiply by 1000. A valid `timestamp` is 13 digits; a 10-digit value is seconds and
is rejected with `rule: "not_milliseconds"`.

### `S2S-R-06` — Timestamp in the future

**Fix:** Send UTC, not local time, and check NTP on the sending host. Converting a local
timestamp without adjusting the zone is the usual cause — it fails only for servers ahead of
UTC, so it can look intermittent.

<a id="s2s-r-07-—-missing-client-user-id"></a>

### `S2S-R-07` — Missing or incorrect identity

**Fix:** Send at least one of `identity.client_user_id` or `identity.anonymous_id`. `identity.click_id` is an attribution identifier and does not satisfy this requirement on its own.

Use your stable account ID once known. Before registration/login, use a genuine stable anonymous ID where the event permits it. For `app_install`, `app_open` and `app_uninstall`, `client_user_id` is suggested; this does not remove the envelope's requirement for a usable user or anonymous identity.

Check the event-specific requirements as well. The updated `bonus_claimed` and `withdraw_rejected` definitions require `client_user_id`; do not substitute a click ID or fabricate an account ID. Missing required identity is a validation failure, not a successfully stored event without attribution. See [base properties](/en/tracking/events/common-fields#identity).

### `S2S-R-08` — User ID does not match across methods

**Fix:** Use one ID everywhere — the Web Tracker's `user_id`, S2S `identity.client_user_id`,
and your MMP's Customer User ID must be the same string for the same person. Same casing, no
prefixes on one and not the other.

This is the single most expensive mistake on this page, and it is invisible: every request
succeeds, the events are all stored, and the numbers are simply wrong. Fixing it later does
not retroactively join the split profiles.

<a id="s2s-r-09-—-missing-ip-address"></a>

### `S2S-R-09` — Missing or incorrect end-user IP

**Fix:** Send the actual end-user IPv4/IPv6 address in `context.ip_address` when required by the event. Do not send the backend server IP. Behind a proxy/CDN, use the client IP resolved through your trusted proxy configuration rather than blindly trusting an incoming forwarded header.

IP is suggested for `app_install` and `bet`; it remains required for `app_open` and `app_uninstall` under the documented base rules. A missing required IP fails validation; an allowed omission is different from that failure.

For `withdraw_rejected`, use the original withdrawal-request IP. If a required source IP is unavailable, resolve the integration gap rather than inventing a value. Check the [base-property exceptions](/en/tracking/events/common-fields#downgrades) and the actual event definition.

### `S2S-R-10` — Basic events not both live

**Fix:** `register` and `deposit` are the minimum. If only one is firing, the funnel has no
conversion rate and FTD reporting has nothing to count.

<a id="s2s-r-11-—-dry-run-reports-misspelled-fields"></a>

### `S2S-R-11` — Check the dry-run result and context fields

Send your payload to `/v3/s2s/event?dryrun=1`. Fix every reported misspelling and violation. A clean single result contains `"misspelledFields": []`; a clean batch can omit the key.

The typo check covers the envelope and `identity`. It does **not** check `context` spelling. Required context fields are checked by catalog validation; compare optional context keys with the event catalog yourself. See [What v3 checks](/en/tracking/s2s/v3/server-events-api#what-v3-checks).

### `S2S-R-12` — Still in dry run or test mode {#s2s-r-12-—-still-in-dry-run}

**Fix:** Remove `?dryrun=1` from the production URL, and stop sending the `X-Test-Mode` header
from production code. Real traffic returns `202` with `{"status":"accepted","eventId":"…"}` and
no `X-Ingest-Mode` header.

If you are seeing `200`, read `X-Ingest-Mode`:

- `dryrun` — nothing you have sent has been stored.
- `test` — your events are being stored, but only as
  [test events](/en/tracking/s2s/v3/server-events-api#test-mode): they are kept for 14 days and
  never reach reporting, attribution or billing. They do not become live events when you turn
  test mode off. Run the approved live business flow separately; do not automatically replay synthetic test events into production.

### `S2S-R-13` — Unhashed PII

**Fix:** `context.privacy.email_hash` is SHA-256 of the lowercased, trimmed email.
`context.privacy.phone_hash` is SHA-256 of the E.164-normalised number. Both are lowercase
hex, exactly 64 characters (`^[a-f0-9]{64}$`). A malformed hash fails with `rule: "pii_format"`.

<a id="s2s-r-14-—-igaming-events-disabled-for-your-product"></a>

### `S2S-R-14` — Industry events unavailable for your Product

**Fix:** Check the Product’s **market category**. The iGaming category enables the iGaming preset; the Crypto category enables the Crypto preset. Standard events are auto-enabled for every Product.

If an expected event remains unavailable with the correct market category, send your Account Manager the Product, event name and validation response. Do not assume that a manual preset subscription is required.

### `S2S-R-15` — Missing per-event required fields

**Fix:** Read the required list for each event you send in
[Standard events](/en/tracking/events/events-standard) and [iGaming events](/en/tracking/events/events-igaming). The ones that
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

### `S2S-O-05` — Retry and unknown-outcome handling

Use exponential backoff with jitter and a bounded retry budget for `429` and `5xx`. Limits apply per API key on a rolling one-minute window. Honor `Retry-After` if the response supplies it; do not assume it is always present.

| Result | Action |
| --- | --- |
| `202 Accepted` | Record the single `eventId` or batch `requestId`/`count`. Do not resend simply because downstream reporting has not updated; acceptance is asynchronous, not proof of final attribution |
| `200` with `X-Ingest-Mode: dryrun` | Validation only; no stored event. Correct the payload as needed, then deliberately choose the next test mode |
| `200` with `X-Ingest-Mode: test` | Test processing only. For a batch, inspect per-item failures; do not resend successful items as a whole batch |
| `400` or `422` | Inspect the code and violations. Correct payload, event/category availability or configuration before resubmitting; unchanged retries do not fix these errors |
| Authentication/authorization failure | Correct the key, scope or access configuration before resubmitting |
| `429` | Back off and retry within the agreed budget |
| `5xx` | Back off; preserve the original event data and reconcile any uncertain prior outcome before repeating a non-idempotent event |
| Timeout or connection loss | The outcome may be unknown: the server may have accepted the request before the response was lost. Check available request/receipt evidence before replaying |

Preserve the original occurrence time, identity and source business IDs on retries. For events using `context.transaction_id`, retain the same transaction ID; do not generate a new one for each attempt. A trace/request ID is not an idempotency key. Do not assume arbitrary events or whole batches are safe to replay, and do not apply Partner Postback's deduplication rules to S2S.

If the outcome cannot be established, retain the event in your retry/reconciliation queue with its source reference and error details, and resolve it with the integration owner. See the [API rate-limit guidance](/en/tracking/s2s/v3/server-events-api#6-rate-limits-and-retries).

### `S2S-O-06` — One key for all environments

**Fix:** Generate a second key and point staging at it, or send all staging traffic with the
`X-Test-Mode: true` header. Test-mode events are stored for 14 days so you can
[review them](/en/tracking/s2s/v3/server-events-api#viewing-your-test-events), and never reach
reporting or bidding. `?dryrun=1` keeps staging out of production too, but stores nothing to look
back at.

Test-mode and dry-run requests still count against the rate limit. On a key shared with
production, staging traffic eats into production's limit — another reason to use a second key.

## Two things this page cannot check

- **That your production code path actually fires.** Every rule here can pass on a payload you
  built by hand in a terminal while the real deposit handler sends nothing. Only the
  [go-live test](/en/tracking/s2s/setup-s2s) proves the integration is wired into your product.
- **That our numbers match yours.** Rule-clean data can still disagree with your BI — timezone
  boundaries, attribution windows and currency handling all move totals. Reconcile deliberately
  rather than assuming a discrepancy is a bug.

## Next steps

Once every required rule passes, go to [Setup, testing and launch checks](/en/tracking/s2s/setup-s2s) to run the end-to-end
test and tell your account manager you are ready.
