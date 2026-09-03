---
title: Partner permissions
sidebar_label: Partner permissions
description: Which AppsFlyer ad network permissions to grant RevoSurge, split into the minimum to run and the set recommended for optimization — named toggles, not screenshots.
---

# Partner permissions

**Audience:** AppsFlyer account admins, agencies running RevoSurge on a client's behalf

Permissions decide what RevoSurge can **see and configure** inside your AppsFlyer account. They are granted on the same RevoSurge tile as your postbacks, per app.

> [!IMPORTANT]
> Postbacks flow regardless of what you grant here. Permissions do not switch the integration on or off — they decide whether RevoSurge can **verify and fix** your setup directly, or whether every correction has to round-trip through you as instructions and screenshots. A working integration with no permissions granted is a working integration that nobody can support.

## Where to find it

**Collaborate → Partner Marketplace → RevoSurge tile → Permissions**.

Same tile as [Set up postbacks](/en/mmp/appsflyer/postbacks), and like the rest of that configuration it is **per app** — granting on Android does not grant on iOS.

## What to grant

| Permission | What it lets RevoSurge do | Minimum to run | Recommended |
|---|---|---|---|
| **Ad network permissions** (master toggle) | Nothing on its own — it gates every permission below | Yes | Yes |
| **Access aggregate conversions** | See installs as AppsFlyer counted them, not only as postbacks delivered them | Yes | Yes |
| **Access aggregate in-app events** | Same, for post-install events | Yes | Yes |
| **Access aggregate revenue** | Same, for revenue — needed to check ROAS against your numbers | Yes | Yes |
| **Configure integration** | Fix the tile — a toggle left off, a lookback window set wrong — without sending you instructions | — | Yes |
| **Configure in-app event postbacks** | Correct and extend your event mapping as your funnel changes | — | Yes |
| **View validation rules** | See the validation state AppsFlyer reports for the integration, and catch a misconfiguration before it costs you spend | — | Yes |
| **Access Protect360 dashboard and raw data** | See which installs AppsFlyer blocked as fraudulent, and why | — | Yes, if you own Protect360 |

### Why the read permissions are the minimum

Without aggregate access, RevoSurge sees only what postbacks delivered. When your AppsFlyer numbers and your RevoSurge numbers disagree — and [they will differ somewhat by design](/en/mmp/appsflyer/macros#reconciling-appsflyer-against-revosurge) — we cannot tell a genuine attribution gap from a postback that never arrived. Every discrepancy becomes an exchange of screenshots instead of a lookup.

### Why Protect360 access matters if you have it

Installs that Protect360 blocks as fraudulent do not reach us as postbacks. Without dashboard access, they are indistinguishable from installs that never happened — so RevoSurge keeps buying the traffic that produced them. With access, we can see the block reason and cut the source.

## Grant tile permissions, not user seats

Use the permissions on the RevoSurge tile. Do **not** invite RevoSurge staff as team members on your AppsFlyer account unless a specific task requires it, and remove the access when that task is done.

The two are not equivalent:

| | Tile permissions | Team member seat |
|---|---|---|
| Scope | The RevoSurge integration on that app | Your AppsFlyer account |
| Granularity | The named permissions above | Whatever the seat's role allows |
| Revoking | Toggle off | Remove the user, and hope it was noticed |

Tile permissions are the mechanism designed for this. A user seat is a broader grant that outlives the reason it was created.

## Agencies

- **The advertiser grants these, not the agency.** Only the app owner can set permissions on the tile. If you run RevoSurge on a client's behalf, this page is something you send the client, not something you action yourself.
- **RevoSurge's click carries no `af_prt`.** AppsFlyer's agency dimension will not be populated for RevoSurge traffic — see the [complete parameter set](/en/mmp/appsflyer/macros#parameters). Read RevoSurge performance in the advertiser's AppsFlyer account, or in RevoSurge reporting, rather than through agency transparency reporting.
- You still need **Configure integration** on the tile if the client expects you to complete the AppsFlyer setup.

## Checklist

Before you consider permissions done, per app:

- [ ] Ad network permissions is ON
- [ ] All three aggregate access permissions are granted
- [ ] Configure integration and Configure in-app event postbacks are granted, or you have accepted that every fix routes through your team
- [ ] View validation rules is granted
- [ ] Protect360 access is granted, if you own Protect360
- [ ] No RevoSurge staff hold a team member seat that a tile permission would have covered

## Next steps

- [Set up postbacks](/en/mmp/appsflyer/postbacks) and [Click forwarding](/en/mmp/appsflyer/click-forwarding) are the two configuration halves of the integration.
- [Integration validation](/en/mmp/appsflyer/validation) checks the whole setup, permissions included ([AF-O-05](/en/mmp/appsflyer/validation#af-o-05) through [AF-O-08](/en/mmp/appsflyer/validation#af-o-08)).
