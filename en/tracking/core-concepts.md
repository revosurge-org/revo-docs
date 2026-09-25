---
title: Core concepts
description: The five rules that decide whether your conversions are counted, credited to the right campaign, and counted once — identity, the click join, the attribution window, deduplication and first deposits.
---

# Core concepts

**For:** Everyone. Media buyers should read sections 1, 3 and 5; developers should read all five.

Whichever of the four methods you use, the same five rules decide what happens to the events
you send. Get these right and the method you pick is an implementation detail. Get them wrong
and every request still succeeds while the numbers stay quietly incorrect — which is the
expensive failure mode in tracking, because nothing alerts you to it.

<nav class="article-toc" aria-label="In this article">
<p class="article-toc-title">In this article</p>

- [1. One user, one ID](#_1-one-user-one-id)
- [2. How a conversion joins back to an ad](#_2-how-a-conversion-joins-back-to-an-ad)
- [3. The attribution window](#_3-the-attribution-window)
- [4. Deduplication](#_4-deduplication)
- [5. First deposits](#_5-first-deposits)
- [The contract, in one place](#the-contract-in-one-place)

</nav>

## 1. One user, one ID

**The same person must carry the same identifier in every method you use.**

| Method | Field | Who sets it |
| --- | --- | --- |
| Web Tracker | `user_id` | You, on login or registration |
| S2S | `identity.client_user_id` | You, on every event |
| AppsFlyer | Customer User ID | You, in the SDK |
| Partner Postback | `user_id` | Your affiliate platform |

Same string. Same casing. No prefix on one and not the others. `player_88213` and `88213` are
two different people as far as we are concerned.

### Why this is the most expensive rule on the page

When the IDs disagree, nothing fails. Every request returns success, every event is stored,
and the reporting is simply wrong:

- The browser knows a click happened. Your backend knows a deposit happened. Nothing connects
  them, so the deposit is not credited to the campaign that produced it.
- The same player exists as two profiles, so one registration can be counted twice.
- Player-value models train on split histories, which makes them worse at exactly the job you
  bought them for.

::: warning Fixing this later does not repair the past
Correcting the IDs stops new events from splitting. It does not merge profiles that were
already created apart, and it does not re-attribute deposits that already landed unjoined.
Check it before you launch, not after the numbers look odd.
:::

### Before the user has an account

Send `identity.anonymous_id` instead — a stable pseudonymous ID of your own, usually a
first-party cookie or device ID. Identity must carry at least one of `client_user_id` or
`anonymous_id`.

Once the player registers, start sending `client_user_id`. Keep sending `anonymous_id`
alongside it where you have it.

## 2. How a conversion joins back to an ad

A conversion is only useful if we can tell which ad produced it. That join has one strong key.

### `click_id` is the strong key

When a visitor arrives from a RevoSurge ad, the landing URL carries a click identifier. If you
have used `fbclid` or `gclid`, it is the same idea.

**What to do with it:**

1. Read it from the landing URL
2. Store it against the visitor's session, and against their account once they register
3. Send it back as `identity.click_id` on the first event that identifies the user — normally
   `register`

The Web Tracker captures the click for you. **S2S does not** — your backend only knows what
you pass it, so the click ID has to survive the trip from landing page to database to event.
That hand-off is where most integrations lose it.

::: info `click_id` does not replace the user ID
It anchors the conversion to an ad. `client_user_id` anchors it to a person. You need both —
sending `click_id` alone does not satisfy the identity requirement.
:::

### When there is no `click_id`

**There is no fallback.**

`click_id` is the only deterministic attribution key RevoSurge supports. Hashed email, hashed
phone and IP + user-agent matching are **not** used for attribution, and there is no fallback
ladder behind `click_id`.

A conversion that arrives without one is still recorded — it just may not be credited to any
campaign.

::: danger This is the single biggest cause of lost attribution
If you treat `click_id` as optional, you are choosing not to have your conversions attributed.
It is a required rule (`S2S-R-16`), not a recommended one.

The fragile part is not the API call. It is the hand-off: landing page → session → database →
event. Test that path specifically, with a real click, before you launch.
:::

### You do not need `click_id` on every event

The click binds the **user** to the campaign. Send `click_id` once, on the first event that
identifies them, and every later event from that same `client_user_id` inherits the binding.

| Event | Carries `click_id` | Attributed? |
| --- | --- | --- |
| `register` | Yes | Yes — this is what binds the user to the campaign |
| `login` | No | Yes, through the same `client_user_id` |
| `deposit` | No | Yes, through the same `client_user_id` |

This is what makes section 1 load-bearing rather than merely tidy. **The binding travels on the
user identifier.** If your `deposit` carries a different `client_user_id` than the `register`
that was attributed, it belongs to a different person as far as we can tell, and it inherits
nothing.

So the two rules compound: a broken `click_id` costs you one conversion; a broken
`client_user_id` costs you every conversion that user will ever make.

::: warning The binding does not outlive the window
Binding and attribution window are separate limits, and both apply. A deposit from a bound user
that arrives more than 14 days after the ad interaction is still recorded, but not attributed —
see [3. The attribution window](#_3-the-attribution-window).

For iGaming this is worth checking against your own data. If first deposits typically land more
than two weeks after the click, being bound will not rescue them.
:::

## 3. The attribution window

**A conversion is attributed to a RevoSurge campaign when it arrives within 14 days of the ad
interaction.** Both a click and an impression open the window.

The window is the same 14 days for registrations and for first deposits.

### When a user both clicked and saw an ad

**The click is credited.** An impression is credited only when there is no click in the path
inside the window.

So a user who clicks on day 1, sees an impression on day 10 and deposits on day 12 is credited
to the day-1 click.

### Conversions that arrive late

**They are still recorded. They are simply not attributed to a campaign.** They stay in your
event data and in your own reporting; they do not credit a campaign.

This has one practical consequence, and it is the opposite of what people assume:

::: tip Send late events anyway — do not filter by age
A deposit you hold back because it "looks too old to matter" is data lost permanently. A
deposit you send is recorded either way, and it still counts toward first-deposit derivation
(section 5), player value, and your own reconciliation.

The only thing age changes is whether a campaign gets credit.
:::

## 4. Deduplication

Different methods handle repeat sends differently. Know which one you are relying on before you
build a retry.

| Method | Dedup key | A resend of the same event |
| --- | --- | --- |
| Partner Postback | `event_id`, then `txid`, then a hash of the query string | Collapses onto the original |
| S2S — money events | `context.transaction_id` | Collapses onto the original |
| S2S — other events | None | **Creates a second event** |
| Web Tracker | None | Creates a second event |

### What this means in practice

- **On Partner Postback**, send a globally unique, stable `event_id` and repeat it verbatim on
  every retry. The query-string hash is a last-resort fallback, not a safety net — reorder a
  parameter and the same conversion is counted twice.
- **On S2S**, `deposit`, `withdraw` and `bet` are safe to retry because `context.transaction_id`
  identifies them. Other events are **not idempotent** — retry them only when the request
  genuinely failed, never speculatively.

### When two methods report the same conversion

Precedence applies: **S2S → Partner Postback → Web Tracker**, and amounts are taken from S2S
only.

But precedence is a safety net, not a design. Running two methods for the same event means
building the same thing twice and reconciling two sources forever. Pick one system as the source
of truth per event — see
[Choose your setup](/en/tracking/overview#_2-2-which-system-holds-your-conversion-data).

## 5. First deposits

**There is no first-deposit event and no first-deposit flag in S2S.** You send every deposit as
`deposit`, and the first deposit is derived as **the earliest `deposit` we have received for
that user**.

Partner Postback is the exception: it has separate `/first-deposit` and `/repeat-deposit`
endpoints, and the path you post to decides the classification.

`deposit_initiated` is never a first deposit. It records an attempt entering the cashier, not a
settled payment.

### If you already have players, read this before you launch

The first deposit is the earliest one **we have seen** — not the earliest one that exists.

On the day you switch tracking on, an existing player's next deposit is the first one we have
ever received for them, so it counts as a first deposit. An operator with a large existing base
will see a first-deposit spike in week one that is not real acquisition — and if a campaign is
optimising on first deposits, bidding will chase it.

**Backfill first.** Send your historical deposits through `/v3/s2s/batch` before you go live.
Anything older than the attribution window is recorded but not attributed (section 3), so it
establishes the real first deposits without crediting campaigns that did not earn them.

If backfilling is not possible, agree a cut-off date with your account manager and discount
first deposits from known players for the first reporting period.

## The contract, in one place

Everything above, as a checklist:

- [ ] The same person carries the same identifier in every method
- [ ] Every event has a registered `event` name and a valid millisecond `timestamp`
- [ ] Every event carries `client_user_id`, or `anonymous_id` before registration
- [ ] `click_id` is captured on landing and sent back on `register` and the first `deposit`
- [ ] Money events carry `context.transaction_id`, so a retry collapses instead of duplicating
- [ ] Partner Postback events carry a stable `event_id`, repeated verbatim on retries
- [ ] Events are sent when they happen — including late ones
- [ ] Historical deposits are backfilled before launch, if the Product has existing players
- [ ] One system is the source of truth per event

## Next steps

- [Tracking overview](/en/tracking/overview) — the four methods and which combination you need
- [S2S validation](/en/tracking/s2s/validation) · [Partner Postback validation](/en/tracking/postback/validation) —
  the rules checked before launch
- [Standard events](/en/tracking/s2s/v3/events-standard) · [iGaming events](/en/tracking/s2s/v3/events-igaming) —
  the catalog
