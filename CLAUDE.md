# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Static React + TypeScript + Vite site for the BPM club. No backend, no CMS, no env vars — all content is hardcoded in TS data modules or JSON next to the assets.

## Commands

```bash
npm run dev          # or: make dev
npm run typecheck    # tsc --noEmit — run this, `npm run build` does NOT typecheck
npm run lint
npm run format       # prettier --write .
npm test             # vitest run
```

Node 24 (`.nvmrc`); the local machine may be on 22.

## Code style

- Prettier non-defaults: **double quotes**, semicolons, `trailingComma: "none"`, `printWidth: 110`.
- `@typescript-eslint/consistent-type-imports` is an **error** — type-only imports must use `import type { ... }`.
- Components are arrow-function consts with `export default` at the bottom of the file; no named component exports.
- Props typed with a local `type XProps = { ... }` alias, not `interface`.
- Plain CSS files co-located with each component (no Tailwind, no CSS modules). Theme variables live on `:root` in `src/styles/base.css`; the site is dark-only.
- User-facing strings are **French**; identifiers and comments are **English**.

## Imports and structure

- `@/*` → `src/*`. The alias is declared in **three** files — `tsconfig.json`, `vite.config.ts`, `vitest.config.ts` — keep them in sync.
- Feature-sliced: `src/features/<feature>/` holds `XPage.tsx` + `.css` + `data/` + `components/` + `hooks/`; cross-feature code goes in `src/shared/`.
- New pages should render inside `PageShell` (`src/shared/components/layout/PageShell.tsx`) so the nav menu stays consistent.
- `import.meta.glob` calls in `eventSlides.ts` and `EventsPage.tsx` use **relative** paths on purpose — Vite requires literal relative globs. Do not rewrite them to use `@/`.

## Testing

Vitest runs with `environment: "node"` and `include: ["src/**/*.test.ts"]`. That means `.test.tsx` files are **not** collected and there is no jsdom or testing-library — React component tests can't run without adding deps and changing `vitest.config.ts` first. Only pure logic under `src/shared/lib/` is currently tested.

## Content data

Adding images to `src/assets/events/` (home carousel) or a new folder under `src/assets/events_page/` (timeline, needs a `data.json`) is picked up automatically by glob. Everything else — team members, equipment cards, logos — requires editing the matching file in `data/` to import the image explicitly. Full editing guide: @README.md

Gotchas: the team headcount is a hardcoded literal in `TeamPage.tsx`, decoupled from `teamMembers.ts`. Some `events_page/` folder names contain spaces — quote them in shell commands.

## Repo etiquette

- Conventional commits in English, lowercase after the prefix (`fix:`, `feat:`, `chore:`).
- Never commit directly to `main` — branch first and open a PR.

## Deploy

Manual: build the Docker image and run it on the Minet server (`docker build -t site-bpm .`, `docker run --rm -p 8080:80 site-bpm`). No CI. The app uses BrowserRouter, so any host must keep the `try_files $uri $uri/ /index.html` SPA fallback from `docker/nginx.conf`.
