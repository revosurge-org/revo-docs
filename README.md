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

## How to edit on GitHub

Use this for **small edits to a single page** (typos, wording updates, adding a paragraph).

- **Find the file** by clicking the folder for the area you want (e.g. `tracking/`, `growth/`, `api/`), then click the `.md` file you want to change.
- Click the **pencil icon (Edit)**.
- Make your changes in the editor.
- Click **Commit changes…**
  - **Commit message**: write a short description (example: “Fix typo on API Quickstart”).
  - **Branch**: select **Commit directly to the `main` branch**.
- Click **Commit changes**. Your update will publish automatically after the site rebuilds, which typically happen within 1 minute.

If your change involves more complex tasks such as **adding/moving pages**, **navigation/sidebars**, or anything that feels unclear, **ask Bobby**.


