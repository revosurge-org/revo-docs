---
title: "Set up and test Partner Postback"
description: "Connect your affiliate platform to AdWave, configure event callbacks and verify the live conversion path."
---

# Set up and test Partner Postback

**For:** Affiliate-platform administrators, developers and Account Managers.

Choose [v2 or v1](/en/tracking/postback/overview#choose-version) for your platform. **v2 is recommended when supported.** Have Product access, server-side postback settings and your source event data ready.

## 1. Choose the affiliate setup

Open **Product → Choose your setup → An affiliate platform → Use this setup**.

![Affiliate source recommendation](/img/handbook/wizard-v4/affiliate-setup.png)

## 2. Create or select a Connection

Open **Account menu → API Keys & Postbacks → Postback Connections → Create Connection**. Enter the name, platform and authorized Product. **v2 requires exactly one linked Product.**

![Create Connection form](/img/handbook/wizard-v4/postback-form.png)

Obtain the Connection ID/key and confirm the target origin and receiver readiness with RevoSurge. For v2, confirm the route and effective Product catalog too. Keep the key server-side and redact it in shared evidence.

## 3. Configure your platform

- **v2:** Build `/v2/pb/{connectionId}/events` with the confirmed origin and key. The portal generator currently returns **v1 URLs**. Select [Product events](/en/tracking/events/choose-events) and map source macros using the [v2 field contract](/en/tracking/postback/v2-api#v2-parameters).
- **v1:** Use the issued URLs for the applicable [event paths](/en/tracking/postback/v1-api#endpoints) and map flat macros using the [v1 parameters](/en/tracking/postback/v1-api#parameters). The path selects the event.

For each event, record its source field → destination field, type/unit/precision, required level and owner. Resolve missing data; do not invent values. Use stable player/source event IDs, the original RevoSurge click ID and actual business times. Keep original IDs and values on retries.

Enable each server-side rule for the intended Product/campaign. Your platform may need one template per event even with v2’s single receiver path.

## 4. Test the complete path

Use the [validation checklist and probes](/en/tracking/postback/validation) for your version.

| Stage | Action | Evidence |
| --- | --- | --- |
| Dry run | Send the real expanded template with `dryrun=1` | Correct parsed values; no business publication |
| Isolated test | Remove dryrun; use `testmode=1` and distinct synthetic IDs | Match the isolated business message to the source |
| Controlled live | After readiness approval, remove both flags; use a real ad click and normal customer journey | Match live receipt, then check reporting, FTD and campaign attribution separately |

Use the [v2](/en/tracking/postback/v2-api#v2-responses) or [v1](/en/tracking/postback/v1-api#responses) verdict/retry rules. A relay’s success, audit record or synthetic click ID does not prove delivery or attribution.

### Check the real journey

- **v2:** Trigger each agreed real business action and compare its received fields with the source.
- **v1 deposits:** Register a new test account, make an agreed small real deposit, then a second deposit. Confirm the registration, first-deposit and repeat-deposit paths, consistent player/click IDs, separate event IDs and correct amounts/times. The second deposit must not add another FTD.
- **v1 app launches, if used:** Reopen twice; confirm separate launch events with the same player ID. Dry-run a pre-registration launch; without usable identity it must be dropped—notify your AM.

In AdWave, open **Verify Your Source → Partner Postback → View event stream**. Select the intended source, mode and UTC period. The screenshot shows Web Tracker controls; switch to Partner Postback.

![Event-stream controls](/img/handbook/wizard-v4/event-stream.png)

Keep redacted expanded URLs as text, the version/environment, platform/version, Product/Connection, event list, source IDs/time, response and request ID. For v2, include `catalogVersion`. The technical owner compares values with the matching business-message readback, including decimals, and keeps its destination/reference (topic/partition/offset where applicable). Mark each stage verified, missing or not tested with an owner.

<a id="5-before-launch"></a>
<a id="_5-before-launch"></a>

## 5. Before launch and after changes

Confirm campaign-goal eligibility in **Campaign conversion events**, monitoring/recovery ownership and any unsent events or field gaps with your AM. Share the evidence and credit model if attribution is shared. Technical test acceptance does not replace real business verification.

The operator owns the key and back-office rules; agencies need platform access to change them. Share the enabled event list with the campaign owner. Use one agreed source/version per action; do not assume overlapping sends deduplicate.

Re-check after changes to keys, Product/catalog, platform/templates, brands/domains, player IDs, payment providers, event rules or attribution. Reconcile uncertain sends using original source IDs before replaying.
