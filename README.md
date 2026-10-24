# SnapDog Web

Public website and documentation portal for the
[SnapDog](https://github.com/SnapDogRocks/snapdog) multiroom audio ecosystem.
It contains the product landing page, SnapDog server/client documentation, API
reference, and SnapDog OS installation guides.

## Stack

- [Astro](https://astro.build/)
- [Starlight](https://starlight.astro.build/) documentation
- MDX and Tailwind CSS
- Vercel deployment

## Development

Requires Node.js 22 or newer.

```bash
pnpm install
pnpm run dev
```

Open <http://localhost:4321>. Production output is generated with:

```bash
pnpm run build
pnpm run preview
```

## Content layout

- `src/pages/index.astro` — landing page and channel-aware OS downloads
- `src/content/docs/docs/` — Starlight documentation pages
- `src/components/` — shared landing-page and documentation visuals
- `src/assets/openapi.json` — generated API contract from the `snapdog` repository
- `src/content/docs/docs/api-reference.mdx` — generated, visible endpoint and schema reference
- `public/` — static images and downloadable presentation assets

## API documentation synchronization

The `snapdog` repository generates its OpenAPI contract from the Rust route
registry and synchronizes it through an auto-merge PR. The same workflow
regenerates the visible API reference. Website CI rejects a stale generated
reference, missing REST paths, and schema-bound JSON examples that no longer
match required OpenAPI fields.
When adding or changing an API route:

1. Update the Rust OpenAPI annotations and registry in `snapdog`.
2. Run `cargo run --package xtask -- gen-api-spec openapi.json` and commit it.
3. Update curated examples in `src/content/docs/docs/api-rest.mdx` when needed.
4. Run `pnpm run docs:generate`, `pnpm run docs:check`, and `pnpm run build`.

## Deployment

Vercel deploys the Astro site. SnapDog OS release workflows trigger a fresh
deployment after publishing so the landing page resolves the current release
and beta manifests from `updates.snapdog.cc`.
