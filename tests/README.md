# Browser regression tests

The AdFlow tests start a local VitePress server on port 4175 and check all five formats in all three languages. The Crypto catalog tests use port 4176 and check event chips, payload types, clipboard output, and preset isolation across all three languages. They exercise preview generation and clipboard actions without running live advertising requests.

Install the development dependencies with `npm ci`, then install the test browser and run:

```sh
npx playwright install chromium
npm test
```

An existing Playwright installation can be selected with `PLAYWRIGHT_MODULE` (absolute module directory). `PLAYWRIGHT_CHROMIUM_EXECUTABLE` optionally selects an existing Chromium executable. No additional runtime dependency is needed by the docs site.
