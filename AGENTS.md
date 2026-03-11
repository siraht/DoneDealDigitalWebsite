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
- `sitespec/workspace/`: SiteSpec semantic workspace covering the implemented site routes.
- `.cloudcannon/postbuild`: runs `npx @bookshop/generate`.

## Symlinked instruction files
- [CLAUDE.md](/home/travis/Projects/Done%20Deal%20Digital/Website/CLAUDE.md) → this AGENTS file.
- [GEMINI.md](/home/travis/Projects/Done%20Deal%20Digital/Website/GEMINI.md) → this AGENTS file.

## Keep in sync
Update this AGENTS file (and `CONTRACT.md`) when structure or build rules change.

## Commit-message standard for agent changes
Use one commit per logical change set and include clear intent in the subject.

1. Message template: `[scope]: [what changed]`
2. Include a short body with:
   - files changed
   - sections/components affected
   - why it was changed (goal)
   - side effects/risk (if any)

Example:
`content: refactor homepage hero copy and remove obsolete badge border`

Body:
`- docs/mockups/stitch_blueorange/blueorange.html: header, hero`
`- Removes decorative border around logo cluster to match updated logo lockup direction`
`- No behavior changes; only markup classes/structure`
