# revo-docs

Documentation site powered by **VitePress** (Vue 3).

## How to run (npm only)

```bash
npm i
npm run dev
```

`pnpm` will cause issues here — **use npm**.

## Deploy / branching

- **Push directly to `main`** (this repo is an exception; no PR / third-party merge required).
- `main` is deployed to **`docs.revosurge.com`** via **GitHub Workflows**.

## Development guidelines (keep it simple)

- **Docs live in Markdown**: add/edit pages under `en/`, `cn/`, `hk/` (example: `en/tracking/`, `en/growth/`, `en/api/`, `en/adwave/`).
- **English is the source of truth**: 简/繁 (`cn/`, `hk/`) are **AI-generated translations** and may need occasional tweaks.
- **Navigation lives in VitePress config**: update nav/sidebar in `.vitepress/config/en.ts`, `.vitepress/config/cn.ts`, `.vitepress/config/hk.ts` when you add/move pages. (Ask Bobby)
- **Prefer clean, stable paths**: avoid renaming/moving pages unless necessary; keep links relative.
- **Keep pages concise**: lead with the “how”, include copy-pastable snippets, and avoid long essays.

## How to edit on GitHub

Use this for **small edits to a single page** (typos, wording updates, adding a paragraph).

- **Find the file** under `en/`, `cn/`, or `hk/`, then click the `.md` file you want to change.
- Click the **pencil icon (Edit)**.
- Make your changes in the editor.
- Click **Commit changes…**
  - **Commit message**: write a short description (example: “Fix typo on API Quickstart”).
  - **Branch**: select **Commit directly to the `main` branch**.
- Click **Commit changes**. Your update will publish automatically after the site rebuilds, which typically happen within 1 minute.

If your change involves more complex tasks such as **adding/moving pages**, **navigation/sidebars**, or anything that feels unclear, **ask Bobby**.



## OG images (social sharing previews)

Per-page Open Graph images are generated at build time. Run manually before deploying:

```bash
npm run generate:og
```

This creates `public/og/{locale}/{path}.png` for each page. Commit the generated images so they deploy with the site. Add `public/og-logo.png` or `public/logo.png` for a custom logo (otherwise “RevoSurge” text is used).