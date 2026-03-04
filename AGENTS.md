# AGENTS

Single source-of-truth is `CONTRACT.md`.

## What to read first
- [CONTRACT.md](/home/travis/Projects/Done%20Deal%20Digital/Website/CONTRACT.md): project-wide rules, stack, workflow, quality gates.
- [/.agents/astrobookshop.md](/home/travis/Projects/Done%20Deal%20Digital/Website/.agents/astrobookshop.md): Astro + Bookshop install and implementation specifics, versions, file conventions.

## Where key files live
- `src/styles/tokens.css`: design tokens (OKLCH/HSL vars).
- `src/styles/global.css`: global site styles.
- `src/components/`: reusable component implementation.
- `src/pages/`: Astro routes/pages.
- `src/content/config.ts`: content schema definitions.
- `src/content/`: content source files.
- `keystatic.config.ts`: CMS/content tooling config.
- `.cloudcannon/postbuild`: runs `npx @bookshop/generate`.

## Symlinked instruction files
- [CLAUDE.md](/home/travis/Projects/Done%20Deal%20Digital/Website/CLAUDE.md) → this AGENTS file.
- [GEMINI.md](/home/travis/Projects/Done%20Deal%20Digital/Website/GEMINI.md) → this AGENTS file.

## Keep in sync
Update this AGENTS file (and `CONTRACT.md`) when structure or build rules change.
