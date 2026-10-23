# RS-1241: AdFlow code preview implementation plan

**Goal:** Split installation guidance into a page-level script and placement-level iframe, with independent copying, across the five AdFlow debuggers.

**Authority:** Approved RS-1241 requirements and the user's instruction to implement. Keep the existing debugger layout, controls, test execution, status reporting, navigation, and format-specific attributes. The repository requires aligned English, Simplified Chinese, and Traditional Chinese pages.

**Architecture:** Add `.vitepress/theme/components/AdFlowCodePreview.vue`, imported locally in each debugger page. Existing snippet generators write highlighted script and iframe HTML into separate Vue refs; the shared component renders the two steps and copies plain text from the selected code block. No SDK detection or combined copy action. Existing generators retain script URL, account/server options, debug flag, type, and dimensions.

**Tech stack:** VitePress, Vue 3, Playwright.

## Tasks

- [x] Add browser regression coverage in `tests/adflow-code-preview.test.mjs`, using a local VitePress server. Verify two separate script/iframe blocks, clipboard contents before and after input edits, escaped input, dimensions/type for all formats and locales, clipboard failure feedback, and unchanged initial test areas. Run against the existing implementation and confirm the split-preview check fails.
- [x] Build the shared preview component with translated once-per-page instructions, manual existing-installation check, format-specific placement notes, separate accessible copy controls and localized success/failure feedback. Preserve Pop/Push placeholder meaning and Push permission requirements.
- [x] Wire the shared component and split output refs into `en/adflow`, `cn/adflow`, and `hk/adflow` pages for Pop, Banner, Push, In-page Push, and Native. Keep all code outside preview markup and generation unchanged.
- [x] Run browser coverage and `npm run build`. Inspect Pop on desktop and mobile in light/dark themes. Review the diff for scope and leave the result local for review.

## Decisions

- Work in the current checkout and leave unrelated `.idea/workspace.xml` and `.claude/` changes untouched. The initial implementation stayed local; the user subsequently requested a PR to main and merge.
- Do not alter integration-guide, S2S debugger, SDK runtime or live advertising behavior.
- Graph discovery was attempted; the project was unindexed and automatic review blocked indexing. Continue with local source inspection.

## Verification

- The initial Pop browser regression failed because the split preview was absent.
- All 15 format/locale browser regressions passed after implementation, including real clipboard round trips and clipboard denial.
- Production build passed; Vite reported a chunk-size warning.
- Desktop light and mobile dark Pop previews inspected. Code remains horizontally scrollable within the mobile card.
- Compared every page against HEAD with the preview markup/generator excluded: configuration, test execution, status, preview, logging, and styles are byte-for-byte unchanged.
