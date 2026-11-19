---
title: "Set up and test S2S Server Events"
description: "Connect your Product and API key, implement register and deposit, and verify live S2S conversions."
---

# Set up and test S2S Server Events

Follow the steps below to choose your events, connect your backend and verify live conversions.

## Before you start

Have access to the intended Product, a developer who can update your backend, and access to your landing-page click ID and stable player IDs.

## 1. Implement the minimum required events

The minimum required S2S events are **`register`** and **`deposit`**. Implement both before launch:

| Event | When to send it | What it supports |
| --- | --- | --- |
| `register` | After the account is successfully created | Registration measurement |
| `deposit` | After each successful deposit is confirmed, including repeat deposits | Deposit value and first-deposit measurement |

Send every successful deposit as `deposit`; RevoSurge derives the first deposit rather than requiring a separate first-deposit event. Include `context.transaction_id`, `context.amount` and `context.currency` on each deposit. Add other catalog events as your campaign goals and reporting needs expand.

## 2. Connect your Product and API key

Open **Product → Choose your setup → Our own back office**. Review Web Tracker and S2S, then apply **Use this setup** when ready.

<img class="doc-screenshot" src="/img/handbook/wizard-v4/choose-setup-s2s.png" alt="Recommended Web Tracker and S2S setup" width="416" height="268">

1. Open **Account menu → API Keys & Postbacks → API Keys**.
2. Select **Create API Key**. In **Generate new API key**, select the Product, enter the key name and select **Generate key**.

<img class="doc-screenshot" src="/img/handbook/wizard-v4/api-key-create.png" alt="Generate an API key for the intended Product; advertiser values blurred" width="384" height="280">

## 3. Build the event request

Send JSON to `https://datapulse-api.revosurge.com/v3/s2s/event` with `X-API-KEY` and `Content-Type: application/json`.

| Part | What to send |
| --- | --- |
| event | Exact registered event name |
| timestamp | Actual occurrence time in UTC Unix milliseconds |
| identity | client_user_id or anonymous_id; click_id alone is not sufficient |
| context | Required fields for that event |

Use `identity.click_id` for the original landing-page click ID and `identity.client_user_id` for the same stable account ID used by Web Tracker. For deposit, send `context.transaction_id`, `context.amount` and `context.currency`.

Use the complete [API examples](/en/tracking/s2s/v3/server-events-api) and [event contracts](/en/tracking/events/events-igaming), keeping their field names unchanged.

## 4. Validate the payload safely

Start with a dry run to check the payload without writing events. Use test mode when you need stored test records; reserve Live mode for production verification.

| Mode | Successful response | Effect |
| --- | --- | --- |
| ?dryrun=1 | 200; X-Ingest-Mode: dryrun | Validates and echoes; stores nothing |
| X-Test-Mode: true | 200; test mode | Test records retained for 14 days; excluded from reporting, attribution and billing |
| Live | 202 Accepted | Queued for production processing |

A clean single dry run reports `misspelledFields: []`; a clean batch may omit it. Optional context fields are not covered by this typo check. Compare them with the event catalog. Full rules are in [S2S validation](/en/tracking/s2s/validation).

## 5. Connect the real backend handlers

Send register after successful registration and deposit after the payment confirmation your backend trusts. Keep transaction IDs stable for money-event retries. Deploy the handler, not only a manually constructed test request.

## 6. Verify the live conversion path

1. Record Product, intended event and expected identity/value fields.
2. Use the agreed click and real business flow. The advertiser performs any approved registration/payment action.
3. Confirm the actual backend handler sends the request and record its eventId, or requestId/count for a batch.
4. Inspect **Verify Your Source → S2S Server Events → View event stream**, selecting the correct traffic mode and UTC period.
5. Reconcile event type, user/click/transaction identity and applicable amount/currency.
6. Review **Campaign conversion events** and confirm that the bidding strategy supports your intended conversion. Test events and dry runs do not verify campaign conversions.

### Troubleshooting

| Symptom | First checks |
| --- | --- |
| 400 with violations | Read field and rule; check timestamp units and per-event required fields |
| 422 EVENT_DISABLED | Product’s market category and event availability |
| 422 UNKNOWN_EVENT_TYPE | Exact catalog name; S2S first deposits use deposit |
| 200 in production | dryrun parameter or X-Test-Mode header left on |
| 429 | Backoff with jitter; check per-key traffic |
| Accepted event but no attribution | Preserved click ID, correct Product and stable user identity |
| Inflated first-deposit count | Existing-player history and backfill/cut-off plan |

An **Active** S2S source or **Previously verified** history does not prove that registration or deposit has current Live verification. Check the named conversion separately.

![Search and filter raw receipts](/img/handbook/wizard-v4/event-stream.png)

## 7. Complete the launch checks

- Confirm both `register` and `deposit` are sent by the real backend handlers and verified with Live traffic.

- Complete the [required validation rules](/en/tracking/s2s/validation) and confirm the Product’s market category, event availability, Product scope and production credentials.
- Remove `dryrun` and `X-Test-Mode` from production requests; production ingestion returns `202`.
- Confirm shared player identity, click identity and business values using the actual backend handler.
- Confirm the agreed historical-deposit backfill or cut-off is in place for existing players.
- Review the intended campaign conversion and agree who monitors receipt and reporting differences with your AM.

Share the Product/domain, implemented event names, test UTC time, eventId or batch requestId/count, expected values and observed results. List any events still missing. Keep the API key private. Recheck after key rotation, handler, schema, Product/domain or identity changes.

**Reference:** [Server Events API](/en/tracking/s2s/v3/server-events-api) · [Event catalogs](/en/tracking/events/catalog-validation) · [Validation rules](/en/tracking/s2s/validation).
