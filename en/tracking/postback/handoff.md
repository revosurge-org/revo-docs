---
title: Partner Postback handoff & go-live
description: The dry-run probes, the end-to-end test with a real conversion, what to send your account manager, and what to re-check after launch.
---

# Partner Postback handoff & go-live

**For:** Whoever owns the launch, with access to the affiliate back-office where the postback
is configured.

[Validation](/en/tracking/postback/validation) proves your postback URL is correct. This page proves your
**back-office actually fires it** on a real conversion — which is a different thing, and the
one that usually fails.

## Before you hand off

- [ ] Every required rule in [Validation](/en/tracking/postback/validation) passes (`PB-R-01` … `PB-R-12`)
- [ ] Recommended rules pass, or you have written down which you are skipping and why
- [ ] The postback is configured **server-side** in the affiliate platform, not as a pixel
- [ ] The postback rule is **enabled** and scoped to the campaigns or links RevoSurge traffic
      lands on — not saved as a draft, and not scoped to a different brand
- [ ] All four event paths are wired if you use all four, each to the correct URL
- [ ] `dryrun` has been removed from the registered URLs (`PB-R-10`)
- [ ] The `k` key is stored in the platform's postback config, not in any player-facing page

## The four dry-run probes

Run these before the real test. Append `dryrun=1` to the URL — nothing is recorded, and the
response shows the decision, the dedup key, resolved identities and parsed values.

A dry-run response is a verdict, not a write receipt: it carries the header
`X-Ingest-Mode: dryrun` and reports a `decision`, not `{"status":"ok"}`.

| # | Probe | Expected verdict |
| --- | --- | --- |
| 1 | Happy path with a valid key and identity | `200`, `"decision": "accepted"`, with the resolved identities and parsed values echoed back |
| 2 | Deliberately wrong `k` | `403` |
| 3 | No `click_id` and no `user_id` | `200`, `"decision": "ignored"` |
| 4 | `click_id` left as a literal macro, e.g. `{sub1}` | `200`, `"decision": "ignored"` |

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

## What to send your account manager

| Deliverable | Why it is needed | Exceptions |
| --- | --- | --- |
| Which of the four endpoints you have wired | Decides what the campaign can optimise on. A campaign set to FTD with no `/first-deposit` postback will look broken from day one. | None |
| Your affiliate platform name and version | Macro syntax and server-side postback behaviour differ between platforms; we have seen the failure modes of most of them. | None |
| The registered postback URLs, with `k` redacted | Lets us spot a wrong path or a missing parameter before launch rather than after. Send as **text**. | None |
| A real `event_id` and `txid` from a successful test conversion, with the time — **fill this in after the go-live test** | One traceable example resolves an attribution question in minutes. | None |
| Whether you send `amount` in USD | No currency conversion is performed. If you settle in another currency we need to know before reconciling. | None |
| Your attribution model, if credit is shared | Otherwise we treat every conversion as whole-credit. | Skip if you use last-click whole-credit |
| Which events you are **not** sending yet | Stops us proposing goals you cannot support. | None |

::: tip Send URLs as text, with the key redacted
A screenshot of the back-office config cannot be checked character by character, and a wrong
path or a mistyped macro is invisible to the eye.
:::

## The go-live test

Do this with a real click on a live ad and a real conversion through the normal player journey.
Firing a postback URL by hand tests our endpoint, not your platform.

1. Click a live RevoSurge ad
2. Land on your site
3. Register a **new** test account
4. Make a small real deposit through the normal cashier

| Step | Expected result | Where to verify |
| --- | --- | --- |
| 3. Register | Back-office fires `/registration`, returns `200 {"status":"ok"}` — a confirmed durable write, not just receipt | Your platform's postback log |
| 3. Register | `click_id` arrives as a real value, not a literal macro | Dry-run echo, or the stored value |
| 4. Deposit | Back-office fires `/first-deposit`, returns `200 {"status":"ok"}` | Your platform's postback log |
| 4. Deposit | `amount` matches the real deposit, `ts` is 13 digits | Your platform's postback log |
| 4. Deposit | `event_id` is a real unique ID, not a hash fallback | Dry-run echo on an equivalent payload |
| Both | The same `user_id` on both calls, matching what your other tracking sends | Compare the two logged URLs |
| After | The test player appears as a registration and an FTD attributed to the campaign | Portal reporting |

Then make a **second** deposit on the same account and confirm it goes to `/repeat-deposit`
and does not increment FTD. This catches `PB-R-05`, which otherwise surfaces a week later as
an FTD count nobody can explain.

## If the test fails

| Symptom | Check these rules |
| --- | --- |
| `403` | `PB-R-01` — key wrong, or the source IP is not allowed |
| `200 {"status":"ignored"}` | `PB-R-03`, `PB-R-04` — no identity, or a macro did not substitute |
| `503` | `PB-R-09` — retry it; the write was not confirmed |
| Postback never fires at all | The rule is disabled, saved as a draft, or scoped to the wrong campaign — not a payload problem |
| Deposit recorded as a registration | `PB-R-02` — wrong endpoint path |
| FTD count too high or too low | `PB-R-05` — first and repeat deposits on the same path |
| Same conversion counted twice | `PB-R-08` — no stable `event_id`, so a retry became a new record |
| Conversions arrive but are not attributed to the campaign | `PB-R-11`, `PB-O-01` — identifier mismatch, or no `ctx` fallback |
| Revenue figures wrong by orders of magnitude | `PB-R-07` — sign, or a non-USD amount |
| Timeline looks wrong but nothing errored | `PB-R-06` — `ts` in seconds |
| Nothing recorded, everything returns `200` | `PB-R-10` — `dryrun` still on the registered URL |

## After go-live: changes that require a re-check

| Change | Impact | Re-validate |
| --- | --- | --- |
| Affiliate platform upgrade or migration | Macro syntax and postback rules rarely survive intact | `PB-R-04`, `PB-R-02`, and re-run the probes |
| Rotating the `k` key | Every postback returns `403` from the moment the old key stops working | `PB-R-01` |
| Adding a brand, skin or new domain | Postback rules are usually scoped per brand and do not carry over | `PB-R-02`, plus the scoping checkbox above |
| Changing how player IDs are generated | Silently splits every profile | `PB-R-11` |
| Changing payment provider or cashier | The deposit trigger may move, duplicate or stop | `PB-R-05`, `PB-R-07` |
| Starting revenue-share settlement | A new endpoint, and negative amounts become live | `PB-R-02`, `PB-R-07` |
| Changing attribution or credit model | Our reporting and yours diverge without warning | `PB-O-07` |
| Any change to the postback URL template | One character breaks it, and the failure is a `200` | Re-run all four probes |

::: tip Re-run the four probes after any back-office change
They take two minutes and they are the only cheap way to catch a silent `ignored`.
:::

## Agencies

- The **operator** owns the `k` key and the back-office configuration. An agency cannot
  configure postbacks on the operator's behalf without access to that platform.
- If an agency runs the campaigns, send them the list of wired endpoints — they choose the
  optimisation goal and need to know what it can be set to.
- An identifier mismatch (`PB-R-11`) cannot be fixed from the campaign side. It has to be
  fixed where the IDs are generated.

## Next steps

- [Partner Postback reference](/en/tracking/postback/partner-postback) — full parameter list and response semantics
- [Validation](/en/tracking/postback/validation) — the full rule list
- [Tracking overview](/en/tracking/overview) — how Partner Postback fits with the other three methods
