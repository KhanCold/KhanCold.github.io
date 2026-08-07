# Qiming Shi Academic Homepage

Static academic homepage built with Next.js. The production build is exported
as plain HTML, CSS, JavaScript, images, and PDFs in `out/`.

## Local development

Requires Node.js `>=22.13.0`.

```bash
npm ci
npm run dev
```

Create and preview the static export:

```bash
npm run build
npm start
```

The preview is available at `http://localhost:3000`.

## GitHub Pages

The repository workflow at `.github/workflows/deploy-pages.yml` builds and
deploys `website/out/` whenever `main` changes. It reads the Pages base URL and
base path from GitHub, so both `username.github.io` repositories and project
sites such as `username.github.io/docs/` are supported.

Before the first deployment, open the repository's **Settings → Pages** and set
**Source** to **GitHub Actions**. Then push the changes to `main`, or run the
workflow manually from the Actions tab.

To simulate a project-site build locally:

```bash
PAGES_BASE_PATH=/docs \
NEXT_PUBLIC_SITE_URL=https://khancold.github.io/docs \
npm run build
```

## Checks

```bash
npm test
```
