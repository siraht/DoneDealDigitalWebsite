# Single-Page Mockup Conversion Checklist (Astro first, then Bookshop)

Use this checklist to track the single-page conversion from static mockup to live Astro implementation, then to Bookshop for editable components.

## Phase 1 — Convert to Astro first (live reload in place)

- [x] Confirm source-of-truth is aligned
  - [x] `CONTRACT.md` is current and authoritative
  - [x] `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` reference `CONTRACT.md`

- [x] Environment and repo prep
  - [ ] Node version is Astro-supported (`18.20.8`, `20.3.0`, or `>=22.0.0`)
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
  - [x] No hardcoded color values used in page markup/styles
  - [ ] Accessibility baseline documented (`focus`, `contrast`, `semantics`)

- [x] Build one-page Astro prototype
  - [x] Add/update `src/pages/index.astro` (or route-matching page)
  - [x] Use semantic sections: `header`, `nav`, `main`, `section`, `footer`
  - [x] Include minimal JS only for required interactions
  - [ ] Page matches mockup structure closely enough for visual review

- [x] Style wiring
  - [x] Move page styles into `src/styles/global.css`
  - [x] Apply token variables consistently in template styles
  - [x] Confirm no ad-hoc inline/component-local token bypasses

- [x] Verify Astro conversion works
  - [x] `npm run dev` runs and updates via live reload
  - [x] `npm run build` succeeds
  - [x] Single-page iteration loop is unblocked for design/layout fixes

- [x] Astro phase completion gate
  - [x] Mockup is implemented as an Astro page
  - [x] Remaining work is explicitly itemized for componentization

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
