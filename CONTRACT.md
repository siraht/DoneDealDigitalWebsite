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
2. Package manager is Bun (`bun`): use `bun install` and `bun run <script>` for all local workflows.
3. Scripts in `package.json`:
   - `dev`: `astro dev`
   - `build`: `astro build`
   - `preview`: `astro preview`
   - `qa:visual`: `node ./scripts/visual-regression.mjs` (capture current screenshots)
   - `qa:visual:baseline`: `node ./scripts/visual-regression.mjs --baseline`
   - `qa:visual:diff`: `node ./scripts/visual-regression.mjs --compare`
   - `qa:visual:drift`: `node ./scripts/visual-regression.mjs --compare --sections --strict`
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
5. Add utility namespace rules under `@layer utilities` as `u-*` when a style is intentionally shared and not component-scoped.
6. Use container query driven responsiveness:
   - Set `container-type: inline-size` for component wrappers that need responsive behavior.
   - Use `@container` queries for adaptive layout, spacing, and typography decisions.
   - Limit viewport `@media` queries to true global/system concerns (for example prefers-reduced-motion).

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
1. `bun run build` passes.
2. A11y check for focus states, semantic structure, contrast.
3. Run screenshot/visual regression checks where practical.
   - `bun run qa:visual` for baseline capture review
   - `bun run qa:visual:baseline` after approved design intent changes
   - `bun run qa:visual:diff` before milestone merges
   - `bun run qa:visual:drift` for section-level strict threshold checks
4. Re-run Bookshop generation after any `.bookshop.yml` change.
5. Do not hand-edit generated files.
6. Responsive regression gate:
   - No new component-level `@media` rules should be added without a justified global exception.
   - Record completion of container-query migration in the active conversion checklist before marking a conversion phase complete.
   - Prefer `@container` in component CSS and document exceptions in the relevant conversion checklist.
7. Before moving from Astro to Bookshop, complete the "design-system coherence" checklist in `docs/astro-bookshop-mockup-conversion-checklist.md`.

### Visual QA output retention policy
- Tracked references (source-of-truth for regressions):
  - `qa/visual/baseline/` and `qa/visual/baseline/sections/`
  - `qa/visual/baseline-static/` and `qa/visual/baseline-static/sections/`
  - `qa/visual/baseline-static-http/` and `qa/visual/baseline-static-http/sections/` (if compared against HTTP-rendered static source)
 - Ephemeral outputs (do not commit):
   - `qa/visual/current/`
   - `qa/visual/diff/`
   - `qa/visual/full-diff/`
   - `qa/visual/full-cropdiff/`
   - `qa/visual/compare/`
 - Capture commands and targets:
   - `bun run qa:visual:baseline` saves to `qa/visual/baseline`
   - `QA_BASELINE_DIR=qa/visual/baseline-static` before your first approved static baseline capture
   - `bun run qa:visual:diff` compares current captures to the chosen baseline directory
   - `bun run qa:visual:drift` runs section-level strict checks for regression risk before merge

### QA artifact workflow (required)
- Baseline updates must be reviewed in one commit containing only visual-tracking changes.
- Do not update baselines during exploratory style work unless explicitly approved in checkpoint notes.
- Required cadence:
  - Milestone closeout: compare full and section captures against the current baseline.
  - Major visual change approved: capture new baseline in the intended family (`baseline`, `baseline-static`, or `baseline-static-http`) and update `docs/qa-visual-regression-policy.md` run summary.
  - Any baseline refresh must include:
    - command used
    - viewport set
    - route(s)
    - rationale
    - person/date
- Runbook for committed artifacts:
  - `qa/visual/baseline/` = Astro baseline used for continuous regression
  - `qa/visual/baseline-static/` = local static file served baseline
  - `qa/visual/baseline-static-http/` = remote HTTP static baseline
- Commit naming convention for baseline refresh:
  - `qa: refresh visual baseline (<source>)`

## Netlify deployment setup
1. This site is configured as a static Netlify output.
2. Required Netlify config exists in [`netlify.toml`](/home/travis/Projects/Done%20Deal%20Digital/Website/netlify.toml).
3. Netlify defaults:
   - Build command: `bun run build`
   - Publish directory: `dist`
4. Headers and fallback handling are defined in `netlify.toml`.
5. Project creation workflow:
   - Install/run Netlify CLI (`bun i -D netlify-cli` or `bunx netlify-cli`)
   - Run `netlify init` in the repo root and attach to a new Netlify site
   - Point production branch and deploy settings to this repo
   - Set optional environment variable `SITE_URL` (for canonical links)
6. Optional deployment command:
   - `bunx netlify-cli deploy --dir=dist --prod` (once site link is established)

## CI/CD for push-based Netlify deploys
1. Netlify is updated on every push to `main` and `master` via [`/.github/workflows/netlify-deploy.yml`](/home/travis/Projects/Done%20Deal%20Digital/Website/.github/workflows/netlify-deploy.yml).
2. The workflow requires either:
   - `NETLIFY_BUILD_HOOK_URL` (preferred)
   - Or both `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID`
3. The same Bun command flow is used in CI:
   - `bun install --frozen-lockfile`
   - `bun run build`
4. Netlify will run the repo-defined `bun run build` command as configured in [`netlify.toml`](/home/travis/Projects/Done%20Deal%20Digital/Website/netlify.toml).

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
