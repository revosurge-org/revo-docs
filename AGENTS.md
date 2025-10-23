# Repository Guidelines

## Project Structure & Module Organization
Keep route-level pages in `src/pages`, using kebab-case filenames that map directly to URL paths (e.g., `getting-started.astro` → `/getting-started`). Place reusable Vue components in `src/components` with scoped CSS, and keep any page-specific assets beside their `.astro` file. Ship static downloads from `public/` (such as updated `tracker-sdk-1.3.0.zip` bundles) so they deploy untouched. Shared configuration lives at the repo root (`astro.config.mjs`, `tsconfig.json`, `package.json`); update them together when adding integrations or tooling.

## Build, Test, and Development Commands
- `npm install` (Node 18+) installs dependencies.
- `npm run dev` launches the Astro dev server at `http://localhost:4321` with hot reloads.
- `npm run build` produces the static site in `dist/` for deployment targets.
- `npm run preview` serves the built output for smoke testing before release.
- `npm run astro -- check` executes Astro diagnostics; run it prior to sizable changes or releases.

## Coding Style & Naming Conventions
Vue single-file components use `<script setup lang="ts">` with single quotes in scripts, two-space indentation in script/style blocks, and tabs in Vue templates. Components stay in PascalCase (`Counter.vue`), while route files remain kebab-case. Use scoped `<style>` blocks and existing CSS variables to avoid global leakage. Default to ASCII characters unless you have a deliberate localization need.

## Testing Guidelines
No automated test suite ships yet; add Vitest or Playwright specs under `tests/` or `src/__tests__` when you introduce new features. Name specs after their subject (`Counter.spec.ts`) and cover the interactive states demonstrated in the docs. Always run `npm run build` plus any new `npm run test` you add before opening a pull request.

## Commit & Pull Request Guidelines
Follow Conventional Commits (e.g., `feat: add quickstart guide`, `fix: align sidebar spacing`) to aid future changelog tooling. Scope changes narrowly and supply clear pull request descriptions, linking tracking issues when relevant. Include screenshots or GIFs for any UI adjustments and document manual rollout steps, such as refreshing SDK archives in `public/`. Confirm green runs of `npm run build` and diagnostics before requesting review.
