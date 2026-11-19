# Requests are sent but no ad appears

Use this guide when you’ve confirmed the target placement sends a request and no ad appears. Have a page where you can reproduce the issue and the placement ID ready.

## 1. Check whether an ad was returned

Check that the request succeeded and the auction returned an eligible ad. If there’s no bid or no fill, use [your integration guide](./choose-integration) to check the placement, format, size, and fallback behavior.

## 2. Check whether the ad rendered

If an ad was returned, confirm that the target container is visible, the dimensions match the placement, and the browser hasn’t blocked resources. If you use GAM, check whether the line item and creative matched, then follow the corresponding GAM guide to check rendering conditions.

## 3. Reproduce the issue with the relevant debugger

Open [Debugging tools](./debuggers), choose the ad format or S2S, and record any differences from the live page. If the response is valid and the ad still doesn’t render, send your account manager the page, placement, test period, and screenshots with sensitive information removed.
