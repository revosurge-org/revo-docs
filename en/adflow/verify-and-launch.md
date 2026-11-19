# Verify and launch

After setup, choose a test placement and have a test page you can open, the account and placement IDs, and the test period ready. For GAM or S2S checks, see [the guide for your integration](./choose-integration).

## 1. Confirm the request was sent

Trigger the placement on the page where the code is deployed. If you installed the tag directly, use AdFlow’s installation check to verify that the request came from the correct site and placement. For GAM or Prebid.js, use the relevant guide to check trigger conditions and slot mappings.

If no request appears, see [Installation check failed](./install-check-qa).

## 2. Confirm an ad rendered

Check whether an ad renders in the target location. If you use GAM, also check whether the corresponding ad unit, line item, and creative matched. If the page sends a request and no ad appears, follow [Requests are sent but no ad appears](./no-ad-display) to distinguish an empty ad response from a rendering issue.

## 3. Check the report

Open the report for your integration and check the data for the test period and placement. If you have a GAM report, align the time zones and ad unit mappings before comparing equivalent request or impression metrics. If the data hasn’t appeared, see [Report data is missing or mismatched](./report-data-issues).

## How to tell you’re done

You can send a request from the target placement, see an ad render, and find the data for the test period in the corresponding report. Use [View placement data and reports](./reports) to monitor performance after launch.
