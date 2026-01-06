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

- **Docs live in Markdown**: add/edit pages under the top-level folders (e.g. `tracking/`, `growth/`, `api/`, `adwave/`).
- **Navigation lives in VitePress config**: update sidebar/nav in `.vitepress/config.mts` when you add/move pages.
- **Prefer clean, stable paths**: avoid renaming/moving pages unless necessary; keep links relative.
- **Keep pages concise**: lead with the “how”, include copy-pastable snippets, and avoid long essays.


