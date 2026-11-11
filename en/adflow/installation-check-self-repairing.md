---
title: AdFlow Installation Check Failure - Self-Troubleshooting & Docs Entry
description: Troubleshoot missing AdFlow installation-check requests, verify your page and placement code, and contact support.
---

# AdFlow Installation Check Failure - Self-Troubleshooting & Docs Entry

## Background & Conclusion

The AdFlow installation check only queries whether a real Bid Request from the specified website and placement reached Prebid Server within the check window; it does not generate requests itself. "No matching request found" only means "none found this time." Do not conclude from this result alone that the code failed to take effect, that no ad returned, or that the site cannot display ads. After installing the code, the user must open or refresh the published target page and trigger that placement; a Save or Publish action by itself does not guarantee that a page already open by the site owner refreshes automatically.

## Goal

Provide a visible but lightweight self-troubleshooting entry on the installation-check failure card that links to "Installation Check Troubleshooting" in the AdFlow section of the RevoSurge Docs Center. Users troubleshoot by symptom; if still unresolved, they use the existing support-chat contact. Keep the existing "try again later" wording and do not promise a fixed wait time in minutes on the check UI.

## Scope & Interaction

1. The installation check to the right of the AdFlow two-step integration code: when the check fails (no matching request this time), show a text link "Having installation issues? View the troubleshooting guide" at the bottom of the failure-reason card. Clicking it opens the doc in a new tab while preserving the current AdFlow check state. The success state does not show this entry.
2. In the AdFlow section of the Docs Center, add "Installation Check Troubleshooting" under the "S2S Debugger"; the suggested path is `/en/adflow/install-check-qa`; the Chinese versions map to `/cn/adflow/install-check-qa` and `/hk/adflow/install-check-qa`.
3. The doc first explains the success boundary of the check: a matching real Bid Request was received by Prebid Server. `NO_BID`, auction filtering, or an ad not yet rendered does not mean the installation failed.
4. When the system cannot directly read the user's page or browser console, it only reports the verifiable "no matching request received" and does not auto-attribute a single error cause.

## Self-Troubleshooting Content

| Symptom or possible cause | What the user checks and how to resolve |
| --- | --- |
| Code saved only in the editor, preview, or test environment; the production page is not published yet; an old page has not reloaded or is affected by cache. | Confirm the change is published to the target environment. Reopen or refresh the public page containing the target placement and confirm the page actually loaded the new code. Publishing does not generically refresh already-open pages. |
| The shared script or placement code is missing, installed on the wrong page, or put in the wrong template. | Compare with the AdFlow two-step code. Confirm both the shared script and this placement's code exist on the target page; install the shared script only once per site template. |
| Account ID, placement ID, or code attributes do not match the target object in AdFlow. | Re-copy the production code from the correct website and placement, and verify `data-account-id`, `data-placement-id`, and other attributes. Do not mix example code or code from other accounts. |
| The page is open but the placement has not yet triggered. | Scroll to the placement, complete the required page interaction, or trigger it per the site's lazy-loading / single-page-app logic. Confirm a request in the browser's Network panel, then return to AdFlow and re-run the check. |
| The script did not load or execute. | In the browser's developer tools Network/Console, check script loading, JavaScript errors, CSP blocking, or network blocking, and have the site developer fix the configuration. Temporarily rule out extension blocking only in your own test browser; do not ask regular visitors to disable security features. |
| The request was sent, but this check has not indexed it yet. | Try again later and confirm you are checking the same website, the same placement, and the correct page; data processing has a short delay. |
| There is a Bid Request but no ad. | The installation check already passed. `NO_BID`, format/size/demand matching, or later rendering issues belong to ad-delivery troubleshooting and are not treated as a failed installation. |
| The placement status is pending or disabled. | In the AdFlow console, confirm the placement status is active. A newly created placement defaults to pending and becomes active only after the code installs successfully and verification is triggered. If the status is disabled, enable it manually or contact an administrator. |
| The website status is not active. | A prerequisite for the installation check is that the Website is active and not deleted. Confirm in AdFlow site management that the website is enabled. If the website is disabled, checks for all placements under it will fail. |
| The account status is disabled. | Once an account is disabled, check requests for all placements are not queried. Confirm the AdFlow account is active; if it shows disabled, contact an administrator to restore it. |
| The check result shows "unknown". | When the reporting channel is unavailable (`adflow.reporting.enabled=false`) or the datapulse/reporting service is down, the check returns "unknown" instead of "not found." This is not an installation problem; the system temporarily cannot verify. Try again later; if it persists, contact support. |
| The placement's externalPlacementId has not synced yet. | The check matches bid requests in BQ by the `PL_XXXXXX` external ID. For a just-created placement, the external ID may not yet be synced to the data pipeline. Wait 1-2 minutes after creation before triggering the check. |
| The BQ bid-request mirror has data latency. | The check reads from `kafka.bid_requests_raw_recent` (the BigQuery bid-request mirror table). There is a minute-level delay from Prebid Server receiving a request to it being queryable in BQ. A just-triggered request may need 2-5 minutes to become visible to the check. |
| The publisher ID (`AC_XXXXXX`) does not match the one in the code. | BQ verification matches `externalAccountId` (format `AC_XXXXXX`) + `externalPlacementId` (format `PL_XXXXXX`) exactly. Confirm the page code's `data-account-id` and `data-placement-id` values match the AdFlow console values exactly; do not edit IDs manually. |
| There really is no matching request within the check window (confirmed on the data-pipeline side). | The check only queries whether a real Bid Request from the specified website and placement reached Prebid Server within the window; it does not generate requests. If the page is installed correctly but the check still fails, confirm in the browser's Network panel whether a request to `prebid-server.revosurge.com` was sent and whether it carried the correct publisher/placement IDs. |

## Human Support

If still unresolved, guide the user to contact support via the existing chat in the bottom-right of AdFlow. Suggest providing the website domain, the actual page URL, the placement ID, the code publish time, the last check time, and relevant browser Network/Console screenshots. Do not send passwords, keys, or users' private data.

When the user contacts support, suggest providing the following code-level diagnostics:
AdFlow console screenshots: placement status (pending/active/disabled), website status
Check result shown: recent_request_seen / not_seen_yet / unknown
Browser Network panel screenshot: the request URL to Prebid Server and the response status code
Page source: confirm the data-account-id and data-placement-id attribute values
Placement creation time: determine whether it is within the sync-delay window

## Acceptance Criteria

- The first click on the "Check site requests" demo shows failure and the troubleshooting link; the second click shows success and clearly states "a real Bid Request was received," without promising an ad display.
- The failure link goes to the Docs Center AdFlow -> "Installation Check Troubleshooting" under the S2S Debugger; the user can return to AdFlow with the check state preserved.
- The doc covers publish/refresh, the two code fragments, IDs, trigger conditions, script and network blocking, short delays, distinguishing `NO_BID`/display, and human support.
- The check is read-only on real requests and does not fabricate test traffic; when no request is received, it does not assume a single failure cause.

## References

- [RevoSurge Publisher Integration Guide](https://docs.revosurge.com/en/adflow/integration-guide)
- [MDN: Location.reload()](https://developer.mozilla.org/en-US/docs/Web/API/Location/reload)
- [MDN: CSP script-src](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/script-src)
- [Prebid: requestBids](https://docs.prebid.org/dev-docs/publisher-api-reference/requestBids.html)
- [Prebid: getNoBids](https://docs.prebid.org/dev-docs/publisher-api-reference/getNoBids.html)

Status: Approved in product review and synced to the Linear backlog; technical implementation, error observability, and doc publication scheduling are pending engineering assessment.