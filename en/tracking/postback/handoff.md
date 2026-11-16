---
title: Partner Postback handoff & go-live
description: Partner Postback version selection, field mapping, dryrun/test/live verification, migration and handoff.
---

# Partner Postback handoff & go-live

Choose the API version first. [v2 validation](/en/tracking/postback/validation#v2-validation) checks the canonical request; this page checks that your actual platform sends it and that the agreed delivery stage is verified. The [v1 procedure](#v1-handoff) below retains the original anchors for existing integrations.

## v2 handoff and go-live {#v2-handoff}

### Readiness and field ownership {#v2-readiness}

- [ ] RevoSurge has confirmed the target origin, deployed version, `/v2/pb/**` routing, enabled receiver, loaded effective catalog and valid Connection configuration. A technical test in another environment does not prove production readiness.
- [ ] The active Connection links exactly one intended product; the key and any rotation expiry are known. Build the v2 URL explicitly: the current Connection generator returns v1 URLs.
- [ ] The agreed event list has exact canonical names and enabled product contracts. A shared endpoint does not guarantee one third-party template or that all products support the same events.
- [ ] A field worksheet records source field → canonical path → type/enum/unit/precision → required level → provider → verified/missing/not tested. Include base fields, stable user identity, actual business timestamp, source event/transaction IDs, RevoSurge click ID and independent monetary fields.
- [ ] Real expanded server-side requests are available. A click ID plus event ID alone cannot satisfy v2 identity/time requirements. If the platform cannot supply the fields, record the blocker and agree additional source data or a separately validated S2S route; do not invent user IDs, times or amounts.
- [ ] All `PB2-R-*` rules pass; skipped recommended rules have an owner and explanation. The platform rule is enabled and scoped to the correct product/campaign.

### Three verification stages {#v2-stages}

| Stage | Run | Required evidence |
| --- | --- | --- |
| Dryrun | Real expanded template with `dryrun=1`, including negative probes | Actual receiver `200 validated`, `stored=false`, `not_attempted`; typed values and violations checked; technical confirmation of no business publication |
| Isolated test | Remove dryrun; use `testmode=1` and distinct synthetic source IDs | `200 accepted`, `stored=true`, `confirmed`; matching isolated message read back and compared field by field |
| Controlled live | After target readiness is confirmed, remove both mode flags; run the agreed source event | Same confirmed result and matching live message; separately verify downstream availability and attribution if included in the launch scope |

Use the [API examples](/en/tracking/postback/partner-postback#v2-examples) and [negative probes](/en/tracking/postback/validation#v2-probes). Cover `register`, the agreed original-currency `deposit` or `trade`, `false`, a genuine zero value and independent fees where the catalog permits. Compare decoded values containing `+`, `&`, `%` and Unicode. Verify your platform's actual outbound request, not just a relay's earlier `200`.

For each accepted test keep: source case/run and whether it is synthetic or real business data; redacted expanded URL; response; source event/transaction IDs; `requestId` and `catalogVersion`; actual destination and message readback reference. The technical owner records Kafka topic/partition/offset and correlated business/audit fields. Confirm decimal values using decimal-aware tooling. Never include `k` in shared evidence.

An audit record, a generated dedup key or an upstream platform's success flag alone proves neither business delivery nor final statistics. Kafka confirmation/readback establishes transport delivery. ClickHouse visibility, consumer compatibility, reporting, FTD and campaign attribution require their own evidence; a synthetic click ID cannot prove attribution. Record each stage as verified, missing or not tested, with its owner.

### Migrating from v1 {#v2-migration}

| v1 input | v2 input / decision |
| --- | --- |
| Legacy `{partner}` | Use an authenticated single-product `{connectionId}` and its key |
| Path-selected event; optional `event` | Exact required canonical `event`; agree the business event mapping |
| `user_id` | `identity.client_user_id` when it is the real stable user ID; no click-to-user fallback |
| `click_id` | `identity.click_id` if allowed; attribution evidence, not user identity |
| `ts` | `timestamp`, actual UTC integer milliseconds; no seconds correction |
| `txid` | `context.transaction_id` if authorized for that event |
| `amount`, `currency` | Catalog `context.amount` / `context.currency` where defined; original currency, no automatic USD conversion |
| `ctx`, claims, taxonomy, aliases or extra fields | Check each against the effective catalog. There is no general alias or passthrough migration |

First/repeat deposit paths both describe deposits; preserve first-deposit declarations only through fields actually defined for the target event, and verify FTD downstream. Do not map KYC or an install to v1 `app_launch`, or assume a v1 launch/revenue name is a v2 alias. `payout` cannot fill a missing deposit/trade/fee amount without an agreed matching business definition.

Agree a source-ID/time cutover boundary and preserve original IDs on retries. Cross-v1/v2 double sending is not guaranteed to deduplicate. If a new Connection is required, its key scope changes too; plan reconciliation. For rollback, restore the previous verified source configuration at an agreed boundary and reconcile uncertain sends; do not replay overlapping history blindly.

### What to hand over {#v2-deliverables}

Deliver the chosen version/environment and product/Connection IDs; platform/version and event/template count; field worksheet and remaining gaps; redacted templates; verification records for each stage; retry/mode settings; cutover/rollback boundary; and owners for downstream and real customer acceptance. Technical acceptance with synthetic fixtures does not complete real customer business acceptance.

Re-run probes after key rotation, product binding/catalog changes, platform upgrades or template edits. A new event requires an enabled contract and a verified source template, even when the receiver path is unchanged. Use the [v2 response matrix](/en/tracking/postback/partner-postback#v2-responses) when diagnosing failures.

## v1 handoff and go-live {#v1-handoff}

The following steps apply only to existing v1 integrations. Use the v2 stages above for canonical events. The v1 `decision` verdict and tolerant identity behavior must not be used to judge v2 requests.

For v1, confirm the business destination and synchronous ACK behavior are enabled before interpreting `200 ok` as a confirmed publish. v1 testmode submits asynchronously; its `stored` flag is not a v2 ACK receipt. Check business records separately from audit and reporting. Remove both `dryrun` and `testmode` for live traffic.

### Before you hand off

- [ ] Every required rule in [Validation](/en/tracking/postback/validation) passes (`PB-R-01` … `PB-R-12`)
- [ ] Recommended rules pass, or you have written down which you are skipping and why
- [ ] The postback is configured **server-side** in the affiliate platform, not as a pixel
- [ ] The postback rule is **enabled** and scoped to the campaigns or links RevoSurge traffic
      lands on — not saved as a draft, and not scoped to a different brand
- [ ] Every event path you use is wired, each to the correct URL (`/app-launch` only if you send app launches)
- [ ] `dryrun` has been removed from the registered URLs (`PB-R-10`)
- [ ] The `k` key is stored in the platform's postback config, not in any player-facing page

### The four dry-run probes

Run these before the real test. Append `dryrun=1` to the URL — nothing is recorded, and the
response shows the decision, the dedup key, resolved identities and parsed values.

A dry-run response is a verdict, not a write receipt: it carries the header
`X-Ingest-Mode: dryrun` and reports a `decision`, not `{"status":"ok"}`.

| # | Probe | Expected verdict |
| --- | --- | --- |
| 1 | Happy path with a valid key and identity | `200`, `"decision": "accepted"`, with the resolved identities and parsed values echoed back |
| 2 | Deliberately wrong `k` | `403` |
| 3 | No `click_id` and no `user_id` | `200`, `"decision": "dropped"` |
| 4 | `click_id` left as a literal macro, e.g. `{sub1}` | `200`, `"decision": "dropped"` |

Read probe 1's echo field by field — it is the only place you can confirm that `ts` parsed as
milliseconds, that `event_id` arrived rather than falling back to a query-string hash, and that
`amount` parsed with the right sign.

Probes 3 and 4 matter more than probe 1. They are what you will be looking at when a launch
underdelivers, and you need to have seen what "silently discarded" looks like in your own logs
**before** it happens in production.

::: warning Remove `dryrun` afterwards
A probe URL accidentally saved into the back-office config is `PB-R-10`, and it fails completely
silently. Search the config for `dryrun` — `dryrun`, `dryrun=1` and `dryrun=true` are all
accepted.

Dry runs count against your rate limit, so script the probes rather than looping them.
:::

### What to send your account manager

| Deliverable | Why it is needed | Exceptions |
| --- | --- | --- |
| Which of the five endpoints you have wired | Decides what the campaign can optimise on. A campaign set to FTD with no `/first-deposit` postback will look broken from day one. | None |
| Your affiliate platform name and version | Macro syntax and server-side postback behaviour differ between platforms; we have seen the failure modes of most of them. | None |
| The registered postback URLs, with `k` redacted | Lets us spot a wrong path or a missing parameter before launch rather than after. Send as **text**. | None |
| A real `event_id` and `txid` from a successful test conversion, with the time — **fill this in after the go-live test** | One traceable example resolves an attribution question in minutes. | None |
| Original `amount` and declared `currency` | Agree source currency and check any USD conversion status/target separately; the legacy amount/USD pair is not proof of conversion. | None |
| Your attribution model, if credit is shared | Otherwise we treat every conversion as whole-credit. | Skip if you use last-click whole-credit |
| Which events you are **not** sending yet | Stops us proposing goals you cannot support. | None |

::: tip Send URLs as text, with the key redacted
A screenshot of the back-office config cannot be checked character by character, and a wrong
path or a mistyped macro is invisible to the eye.
:::

### The go-live test

Do this with a real click on a live ad and a real conversion through the normal player journey.
Firing a postback URL by hand tests our endpoint, not your platform.

1. Click a live RevoSurge ad
2. Land on your site
3. Register a **new** test account
4. Make a small real deposit through the normal cashier

| Step | Expected result | Where to verify |
| --- | --- | --- |
| 3. Register | Back-office fires `/registration`, returns `200 {"status":"ok"}` — check the configured confirmation behavior and matching business record | Your platform's postback log |
| 3. Register | `click_id` arrives as a real value, not a literal macro | Dry-run echo, or the stored value |
| 4. Deposit | Back-office fires `/first-deposit`, returns `200 {"status":"ok"}` | Your platform's postback log |
| 4. Deposit | `amount` matches the real deposit, `ts` is 13 digits | Your platform's postback log |
| 4. Deposit | `event_id` is a real unique ID, not a hash fallback | Dry-run echo on an equivalent payload |
| Both | The same `user_id` on both calls, matching what your other tracking sends | Compare the two logged URLs |
| After | Separately verify that the test player appears as a registration and FTD attributed to the campaign | Portal reporting |

Then make a **second** deposit on the same account and confirm it goes to `/repeat-deposit`
and does not increment FTD. This catches `PB-R-05`, which otherwise surfaces a week later as
an FTD count nobody can explain.

If you send app launches, also close and reopen the app **twice** on the same account. Each
launch should fire `/app-launch` and return `200 {"status":"ok"}` with its own `event_id` and
the same `user_id` as the registration — two launches, two records. Then launch once on a fresh
install **before** registering, and dry-run that payload: if it carries neither `click_id` nor
`user_id`, the verdict is `decision=dropped`; tell your account manager.

### If the test fails

| Symptom | Check these rules |
| --- | --- |
| `403` | `PB-R-01` — key/Connection state, or legacy source IP is not allowed |
| `429` | Honor `Retry-After` |
| `200 {"status":"ignored"}` | `PB-R-03`, `PB-R-04` — no identity, or a macro did not substitute |
| `503` | `PB-R-09` — retry it; the write was not confirmed |
| Postback never fires at all | The rule is disabled, saved as a draft, or scoped to the wrong campaign — not a payload problem |
| Deposit recorded as a registration | `PB-R-02` — wrong endpoint path |
| Several app launches recorded as one | `PB-R-08` — no unique `event_id` per launch |
| FTD count too high or too low | `PB-R-05` — first and repeat deposits on the same path |
| Same conversion counted twice | `PB-R-08` — no stable `event_id`, so a retry became a new record |
| Conversions arrive but are not attributed to the campaign | `PB-R-11`, `PB-O-01` — identifier mismatch, or no `ctx` fallback |
| Revenue figures wrong by orders of magnitude | `PB-R-07` — source currency, sign, conversion status and target amount |
| Timeline looks wrong but nothing errored | `PB-R-06` — `ts` in seconds |
| Nothing recorded, everything returns `200` | `PB-R-10` — `dryrun` still on the registered URL |

### After go-live: changes that require a re-check

| Change | Impact | Re-validate |
| --- | --- | --- |
| Affiliate platform upgrade or migration | Macro syntax and postback rules rarely survive intact | `PB-R-04`, `PB-R-02`, and re-run the probes |
| Rotating the `k` key | Every postback returns `403` from the moment the old key stops working | `PB-R-01` |
| Adding a brand, skin or new domain | Postback rules are usually scoped per brand and do not carry over | `PB-R-02`, plus the scoping checkbox above |
| Changing how player IDs are generated | Silently splits every profile | `PB-R-11` |
| Changing payment provider or cashier | The deposit trigger may move, duplicate or stop | `PB-R-05`, `PB-R-07` |
| Starting revenue-share settlement | A new endpoint, and negative amounts become live | `PB-R-02`, `PB-R-07` |
| Starting app-launch postbacks | A new endpoint, often fired before the player has an id | `PB-R-02`, `PB-R-03`, `PB-R-08`, and re-run the probes |
| Changing attribution or credit model | Our reporting and yours diverge without warning | `PB-O-07` |
| Any change to the postback URL template | One character breaks it, and the failure is a `200` | Re-run all four probes |

::: tip Re-run the four probes after any back-office change
They take two minutes and they are the only cheap way to catch a silent `ignored`.
:::

### Agencies

- The **operator** owns the `k` key and the back-office configuration. An agency cannot
  configure postbacks on the operator's behalf without access to that platform.
- If an agency runs the campaigns, send them the list of wired endpoints — they choose the
  optimisation goal and need to know what it can be set to.
- An identifier mismatch (`PB-R-11`) cannot be fixed from the campaign side. It has to be
  fixed where the IDs are generated.

### Next steps

- [Partner Postback reference](/en/tracking/postback/partner-postback) — full parameter list and response semantics
- [Validation](/en/tracking/postback/validation) — the full rule list
- [Tracking overview](/en/tracking/overview) — how Partner Postback fits with the other three methods
