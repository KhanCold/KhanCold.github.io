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

## Commit & Pull Request Guidelines

The current history uses a short, lowercase, imperative subject (`publish academic homepage`). Follow that style and keep each commit focused. Pull requests should summarize the change, list verification commands, and link relevant issues. Include before/after screenshots for layout, responsive, typography, or asset changes. Call out changes to Pages paths, environment variables, database schema, or generated migrations explicitly.

## Security & Configuration

Do not commit secrets or local environment files. Keep public URLs and base-path behavior configurable through the documented environment variables, and verify external links and licensed assets before publishing.
