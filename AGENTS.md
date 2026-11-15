# SnapDog Web

Public website and documentation for the SnapDog multiroom audio project (snapdog.cc). The audience is tech-savvy home users.

## Stack

Astro 7 with Starlight 0.42 (docs), MDX, Tailwind CSS 4, pnpm. Deployed on Vercel (`vercel.json`). This is not a Next.js project.

## Commands

- `pnpm dev`: start the dev server on http://localhost:4321
- `pnpm build`: production build into `dist/`
- `pnpm docs:generate`: regenerate `src/content/docs/docs/api-reference.mdx` from `src/assets/openapi.json`
- `pnpm docs:check`: fail if the generated reference is stale or the API docs drift from the spec

Run `pnpm docs:check` and `pnpm build` before committing content changes.

## Where things live

- `src/pages/index.astro`: landing page
- `src/pages/privacy.astro`, `src/pages/imprint.astro`: legal pages, change facts only and keep the legal wording
- `src/components/`: landing page and docs visuals
- `src/content/docs/docs/`: Starlight documentation pages
- `src/assets/openapi.json`: copy of the server's OpenAPI spec
- `src/data/`: SnapDog OS installer release JSON used by the landing page

## Rules

- `api-reference.mdx` is generated. Never edit it by hand, run `pnpm docs:generate`.
- `src/assets/openapi.json` must stay identical to `openapi.json` in the `snapdog` server repository. Change the spec there, not here.
- KNX support is unofficial. SnapDog is not certified or endorsed by the KNX Association and is not meant for professional installations. Keep this disclaimer visible wherever KNX is described.
- The native clients are in beta and distributed through TestFlight only. Do not describe them as generally available.
- Licensing differs per component (see `src/content/docs/docs/license.mdx`). Do not change licence statements without the maintainer's decision.

## Docs style

Plain English, short sentences, no "we". Address the reader as "you". Use no em dashes.
