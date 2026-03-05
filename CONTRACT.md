# Project Contract — Astro + Bookshop Static Site

## Purpose
This repository uses **Astro + CloudCannon Bookshop** to implement the mockup into a token-first, component-driven static site.

## Canonical references
- Astro setup docs: https://docs.astro.build/en/install-and-setup/
- Bookshop Astro docs: https://cloudcannon.com/documentation/developer-guides/bookshop-astro-guide/

## Version baseline (checked 2026-03-04)
- astro: 5.18.0
- @bookshop/astro-bookshop: 3.17.1
- @bookshop/astro-engine: 3.17.1
- @bookshop/generate: 3.17.1
- @bookshop/browser: 3.17.1
- @bookshop/sass: 3.17.1

## Core stack setup (non-negotiable)
1. Node runtime must be Astro-supported (`>=18.20.8`, `20.3.0`, or `>=22.0.0`).
2. Local dependency install only.
3. Scripts in `package.json`:
   - `dev`: `astro dev`
   - `build`: `astro build`
   - `preview`: `astro preview`
4. Bookshop integration:
   - `src/bookshop/bookshop.config.cjs` with `@bookshop/astro-engine`
   - `astro.config.mjs` registers `@bookshop/astro-bookshop`
   - `.cloudcannon/postbuild` runs `npx @bookshop/generate`
5. Install:
   - `@bookshop/astro-bookshop` runtime
   - `@bookshop/generate`, `@bookshop/browser`, `@bookshop/astro-engine` dev dependencies
   - `@bookshop/sass` if using Bookshop style pipeline

## Design-implementation workflow (one contract for all agents)
1. Keep one canonical design system artifact:
   - `src/styles/tokens.css` (CSS variables only, prefer `OKLCH`/`HSL`)
   - `src/styles/global.css`
2. Establish standards docs:
   - `STYLEGUIDE.md` (spacing, type, buttons, hover/focus, tokens usage)
   - `COMPONENTS.md` (component inventory + prop signatures)
3. Every page work must reuse this contract and the component inventory; do not invent new visual patterns without adding to the inventory first.
4. Do not keep legacy selector aliases for the same component family. Migrate to one canonical class namespace and remove duplicates during each conversion phase.

## Gemini 3 Pro conversion protocol
For each mockup pass, explicitly require this output:
1. `tokens.css`
2. `STYLEGUIDE.md`
3. `COMPONENTS.md`
4. `tailwind.config.*` (optional)
5. Include only tokenized styling, spacing scale discipline, and explicit accessibility constraints.
   - `CONTRACT`: all typography, spacing, border, shadow, radius, and state values in `src/styles/global.css` must map to `src/styles/tokens.css` variables.

Required prompt skeleton:
> Produce design tokens and a layout spec for a {industry} site. Output: (1) tokens.css variables, (2) type scale, (3) spacing scale, (4) component inventory with props, (5) accessibility requirements (focus rings, contrast), (6) do-not-violate rules: only token colors/typography/borders/shadows/radii, one canonical component namespace, no inline scale overrides.

## Page construction rules
1. Each page first becomes a one-file prototype:
   - `prototype/<page>.html` or transitional `src/pages/<page>.astro`
   - semantic structure (`header`, `nav`, `main`, `section`, `footer`)
   - minimal JS only for menu toggles/accordions
   - no hardcoded colors; use `:root` tokens only
2. Then extract to Astro + Bookshop components.
3. Component-first composition mandatory:
   - pages are composition points
   - no bespoke one-off styling in pages unless promoted to shared component

## Astro + Bookshop component rules
1. Editable components use component + matching `<name>.bookshop.yml`.
2. Use `bookshop:live` in Astro templates for editable components.
3. Use `_bookshop_name` + props in block-driven frontmatter (`content_blocks` arrays).
4. Keep server-only behavior out of live-edit paths.

## Quality gates
1. `npm run build` passes.
2. A11y check for focus states, semantic structure, contrast.
3. Run screenshot/visual regression checks where practical.
4. Re-run Bookshop generation after any `.bookshop.yml` change.
5. Do not hand-edit generated files.
6. Before moving from Astro to Bookshop, complete the "design-system coherence" checklist in `docs/astro-bookshop-mockup-conversion-checklist.md`.

## Repo structure required for this workflow
- src/styles/tokens.css
- src/styles/global.css
- src/components/
- src/pages/
- src/content/config.ts
- src/content/
- keystatic.config.ts
- .agents/astrobookshop.md (tooling setup/details)

## Governance
- For conflicting instructions, prioritize this contract.
- Keep one source of truth by updating `CONTRACT.md` and `AGENTS.md` references together.
- Prefer deterministic, reviewable edits and avoid ad-hoc style drift.
