---
title: Installation Check Troubleshooting
description: Troubleshoot missing AdFlow installation requests, verify your page and placement code, and contact support.
---

# Installation Check Troubleshooting

The installation check did not find a matching request for your placement? Follow these steps in order. The check only looks for real requests; it does not generate test traffic.

::: tip What counts as a successful installation check?
A real Bid Request from the placement on the target website reaches Prebid Server. No ad returned, `NO_BID`, auction filtering, or an ad that has not rendered are bidding or display issues; they do not mean the code was installed incorrectly.
:::

## 1. Publish the code and open the target page {#publish}

Clicking **Save** or **Publish** in your website editor does not guarantee that an already-open page refreshes automatically. Open or refresh the published page containing the placement. If your site uses a cache or CDN, confirm that it serves the latest page code. A preview or test page may differ from the public page.

## 2. Check both code fragments and the placement {#codes}

### Are the shared script and placement code both on the target page?

Compare your page with the two installation steps in AdFlow. The shared script must load and the target placement code must be present on that same page. Do not install only one fragment, or put it in the wrong page template. Install the shared script only once in the same site template.

Copy production code from the correct website and placement in AdFlow, rather than using example code. See the [Integration Guide](./integration-guide#adflow-usage) for the two-step setup.

### Do the account and placement IDs match?

Confirm that `data-account-id` and `data-placement-id` match the account and placement you are checking, and that the placement belongs to the selected website. Do not mix code from different accounts or placements. If unsure, copy the code again from the correct placement in AdFlow.

## 3. Trigger a real ad request {#trigger}

After refreshing, make sure the placement's part of the page actually loads. If your website uses lazy loading, single-page navigation, or an interaction to trigger the placement, scroll to it or complete the required action. Check for a request in your browser's **Network** panel, then return to AdFlow and run the installation check again.

## 4. Check browser blocking and errors {#browser}

Ask your website developer to open the browser's developer tools and inspect **Network** and **Console**:

- Did the AdFlow script load and execute?
- Is there a JavaScript error?
- Did Content Security Policy (CSP) block the script or a request?
- Did a network request fail, or did a browser extension block it?

Have your developer fix any site or network configuration errors. When diagnosing extensions, temporarily isolate their effect in your own test browser; do not ask all visitors to disable security settings.

The [Integration Guide's debugging tools](./integration-guide#adflow-diagnostic) can help your developer investigate. For bidding and rendering issues after requests arrive, use the relevant [format debugger](./integration-guide#adflow-sdk) or [S2S Debugger](./s2s-debugger).

## 5. Retry later and confirm what you are checking {#retry}

Request records may have a short processing delay. Try again later and confirm that the website and placement selected in AdFlow match the page you just visited.

No matching request found in this check does not mean that no request has ever existed. It also does not identify a single cause. If the check itself fails, retry later rather than assuming the installation is broken.

## Still need help? {#help}

Contact support through the existing chat in the bottom-right corner of AdFlow. Include:

- Website domain and the actual page URL.
- Placement ID.
- When you published the code and last ran the check, including the time zone.
- Relevant Network and Console screenshots.

Do not send passwords, keys, or private visitor data.
