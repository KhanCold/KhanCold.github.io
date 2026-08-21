# Repository Guidelines

## Project Structure & Module Organization

The deployable project lives in `website/`. The Next.js App Router entry points are `website/app/layout.tsx` and `website/app/page.tsx`; shared styling is in `website/app/globals.css`. Place static images, icons, and paper PDFs under `website/public/`, preserving the existing `assets/` and `papers/` grouping. Build-validation tests live in `website/tests/`. Database and hosting integrations are isolated in `website/db/`, `website/drizzle/`, `website/worker/`, and `website/build/`. GitHub Pages deployment is defined in `.github/workflows/deploy-pages.yml`. Generated directories such as `website/out/` and `website/.next/` must not be committed.

## Build, Test, and Development Commands

Run project commands from `website/` and use Node.js 22.13 or newer.

- `npm ci` installs the exact dependency versions in `package-lock.json`.
- `npm run dev` starts the Next.js development server.
- `npm run build` creates the static export in `out/`.
- `npm start` serves the exported site at `http://localhost:3000`.
- `npm run lint` checks TypeScript, React, and Next.js conventions with ESLint.
- `npm test` builds the site, then runs all `node:test` assertions.
- `npm run db:generate` creates Drizzle migrations after schema changes.

For project-site routing checks, follow the environment-variable example in `website/README.md`.

## Coding Style & Naming Conventions

Use TypeScript/TSX with two-space indentation, double quotes, semicolons, and trailing commas where the existing formatter style permits. Keep React components and types in `PascalCase`, variables and functions in `camelCase`, and asset filenames descriptive and lowercase (for example, `assets/papers/merchantbench.jpg`). Prefer small typed data structures over duplicated markup. Run `npm run lint` before submitting; ESLint is the repository's source of truth.

## Testing Guidelines

Tests use Node's built-in `node:test` and strict assertions. Name new files `*.test.mjs` in `website/tests/`. Add focused checks for rendered HTML, required static assets, and configuration whenever content or deployment behavior changes. There is no numeric coverage threshold; every change should protect its user-visible or build-critical behavior. Run `npm test` before opening a pull request.

## Local-First Workflow & Performance Conventions

Treat requests such as “先本地部署” or “不要 push” as a strict boundary: edit, build, test, and preview locally only. Do not commit, push, open a pull request, trigger GitHub Pages, or otherwise mutate remote state until the user explicitly approves publishing. Reuse an existing matching server on port 3000 when available instead of terminating unrelated processes, and verify the local production export at `http://localhost:3000` after the final build.

For performance work, measure before changing code and prefer the smallest high-impact fix. Prioritize appropriately sized static assets, native lazy loading for below-the-fold images, explicit image dimensions, asynchronous decoding, and high priority only for genuinely critical above-the-fold media. Preserve original source images when generating lighter display assets unless cleanup is explicitly requested. Avoid adding image CDNs, runtime optimization services, dependencies, or broad component refactors unless measurements show that the simpler static approach is insufficient; in this static export, `next/image` does not provide automatic optimization while `images.unoptimized` remains enabled.

Validate performance changes with `npm run lint`, `npm test`, and real browser checks at desktop and mobile widths. Confirm that required images load after scrolling, no horizontal overflow or layout shift is introduced, and below-the-fold images are not emitted as initial preload links. Add focused rendered-HTML or asset-existence assertions for these guarantees. Do not compare localhost Lighthouse scores directly with GitHub Pages because the local static server does not reproduce production compression, CDN routing, or cache headers; report request counts and transferred asset bytes locally, then measure the live site only after publishing is authorized.

## Commit & Pull Request Guidelines

The current history uses a short, lowercase, imperative subject (`publish academic homepage`). Follow that style and keep each commit focused. Pull requests should summarize the change, list verification commands, and link relevant issues. Include before/after screenshots for layout, responsive, typography, or asset changes. Call out changes to Pages paths, environment variables, database schema, or generated migrations explicitly.

## Security & Configuration

Do not commit secrets or local environment files. Keep public URLs and base-path behavior configurable through the documented environment variables, and verify external links and licensed assets before publishing.
