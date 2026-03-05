# Single-Page Mockup Conversion Checklist (Astro first, then Bookshop)

Use this checklist to track the single-page conversion from static mockup to live Astro implementation, then to Bookshop for editable components.

## Progress tracker (update as work proceeds)

- [ ] 0) Initial state captured
  - [x] Existing one-page mockup identified
  - [x] Baseline page identified: `docs/mockups/stitch_blueorange/blueorange.html`
  - [x] Current build issues logged
    - [ ] Header alignment does not match mockup
    - [ ] Site container width appears narrower than mockup
    - [ ] Body text appears smaller than mockup
    - [ ] Cred strip borders/icons have visual drift
    - [ ] Process gallery images have reduced size
    - [ ] “Get My Free Audit” button is smaller than mockup
- [ ] 1) Scope locked for this cycle
  - [x] Astro conversion first (live reload)
  - [x] Bookshop deferred until Astro visual parity is stable

## Phase 1 — Convert to Astro first (live reload in place)

- [x] Confirm source-of-truth is aligned
  - [x] `CONTRACT.md` is current and authoritative
  - [x] `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` reference `CONTRACT.md`
  - [x] Checklist file exists in `docs/` for tracking

- [x] Environment and repo prep
  - [x] Node version is Astro-supported (`18.20.8`, `20.3.0`, or `>=22.0.0`)
  - [x] `package.json` scripts include:
    - [x] `dev: astro dev`
    - [x] `build: astro build`
    - [x] `preview: astro preview`
  - [x] Required dirs exist:
    - [x] `src/styles/`
    - [x] `src/styles/tokens.css`
    - [x] `src/styles/global.css`
    - [x] `src/components/`
    - [x] `src/pages/`

- [x] Capture and apply design system
  - [x] `src/styles/tokens.css` defined with project tokens (colors, spacing, type, radii, shadows)
  - [x] No hardcoded color values introduced in new production classes
  - [x] Font family tokens and border/radius tokens mapped to Tailwind theme

- [x] Build one-page Astro prototype
  - [x] Add/update `src/pages/index.astro` (route page)
  - [x] Use semantic sections in order: `header`, `nav`, `main`, `section`, `footer`
  - [x] Keep JavaScript minimal (none required for static render path)
  - [x] Preserve one-page structure for visual parity

- [x] Tailwind build-time migration (sustainable)
  - [x] Install runtime-independent Tailwind toolchain
    - [x] `@astrojs/tailwind`
    - [x] `tailwindcss`
    - [x] `postcss`
    - [x] `autoprefixer`
    - [x] `@tailwindcss/forms`
    - [x] `@tailwindcss/container-queries`
  - [x] Add `tailwind.config.mjs`
  - [x] Configure Astro integration in `astro.config.mjs`
  - [x] Move inline `text/tailwindcss` utilities into project CSS
  - [x] Remove CDN/runtime script injection from page source (`https://cdn.tailwindcss.com`)

- [x] Style wiring
  - [x] Keep site-specific token file in `src/styles/tokens.css`
  - [x] Keep global style layer in `src/styles/global.css`
  - [x] Ensure all page-specific utility classes from the original mockup are represented
  - [x] Confirm class structure maps to tokenized values
  - [x] Confirm no ad-hoc inline/component-local token bypasses

- [x] Verify Astro conversion works
  - [x] `npm run dev` runs and updates via live reload
  - [x] `npm run build` succeeds
  - [x] `npm run preview` serves a matching production build
  - [x] Browser parity checks completed
    - [x] 320px mobile view
    - [x] 768px tablet view
    - [x] 1280px desktop view
    - [x] 1920px large desktop view

- [x] Regression validation before componentization
  - [x] Header: sticky behavior, spacing, link heights, CTA sizing
  - [x] Overall width: max container and side padding match baseline
  - [x] Typography scale: hero headlines, section titles, paragraphs
  - [x] Border and shadows: hero/process/final panels and cred strip separators
  - [x] Cred strip icon color and hierarchy
  - [x] Process gallery: image dimensions, offsets, and overflow behavior
  - [x] CTA hierarchy: “Get My Free Audit” prominence relative to body scale

- [x] Astro phase completion gate
  - [x] Mockup implemented as Astro page
  - [x] Open visual issues resolved or moved into explicit follow-up checklist items
  - [x] Remaining work is itemized for Bookshop component extraction

## Phase 2 — Convert to Bookshop (editable component system)

- [ ] Install/configure Bookshop
  - [ ] Add `src/bookshop/bookshop.config.cjs` with `@bookshop/astro-engine`
  - [ ] Register `@bookshop/astro-bookshop` in `astro.config.mjs`
  - [ ] Add `.cloudcannon/postbuild` with `npx @bookshop/generate`
  - [ ] Install matching version family:
    - [ ] `@bookshop/astro-bookshop`
    - [ ] `@bookshop/astro-engine`
    - [ ] `@bookshop/generate`
    - [ ] `@bookshop/browser`
    - [ ] `@bookshop/sass` (if needed)

- [ ] Component inventory and contracts
  - [ ] Create/update `COMPONENTS.md` with components and prop signatures
  - [ ] Define component boundaries from the existing Astro page
  - [ ] Define prop structure for repeatable sections/content blocks

- [ ] Create Bookshop-compatible components
  - [ ] For each component create:
    - [ ] `src/components/<ComponentFolder>/<ComponentName>.astro`
    - [ ] `src/components/<ComponentFolder>/<ComponentName>.bookshop.yml`
  - [ ] Use `bookshop:live` for editable instances in Astro templates
  - [ ] Render with spread props where appropriate (e.g., `<MyBlock bookshop:live {...props} />`)

- [ ] Add block-driven content model
  - [ ] Add/update `src/content/config.ts` schema(s)
  - [ ] Add initial content files under `src/content/`
  - [ ] Represent page sections using `content_blocks` with `_bookshop_name`

- [ ] Refactor page into composition
  - [ ] Replace inline page sections with component rendering map
  - [ ] Extract shared patterns into reusable components only
  - [ ] Remove duplicate one-off styles unless promoted to shared design tokens/components

- [ ] Bookshop quality gates
  - [ ] `npm run build` passes with Bookshop pipeline
  - [ ] A11y check completed (focus flow, contrast, semantics)
  - [ ] Re-run generation after each `.bookshop.yml` change
  - [ ] Do not hand-edit generated output files

- [ ] Completion criteria
  - [ ] Single-page mockup is fully represented with editable Bookshop blocks
  - [ ] Token discipline is fully enforced across pages/components
  - [ ] No generated-file manual edits remain
