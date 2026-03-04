# Astro + Bookshop implementation contract

Use this document as the canonical source for building this project with Astro + Bookshop. Keep it versioned and align all agent instructions to this file.

## Last checked
- 2026-03-04

## Sources
- Astro install/setup: https://docs.astro.build/en/install-and-setup/
- CloudCannon Bookshop for Astro: https://cloudcannon.com/documentation/developer-guides/bookshop-astro-guide/

## Baseline versions (latest at check time)
- `astro`: `5.18.0`
- `@bookshop/astro-bookshop`: `3.17.1`
- `@bookshop/astro-engine`: `3.17.1`
- `@bookshop/generate`: `3.17.1`
- `@bookshop/browser`: `3.17.1`
- `@bookshop/sass`: `3.17.1`

## Node and setup requirements
1. Use Node version supported by Astro: `18.20.8`, `20.3.0`, or `>=22.0.0`.
2. Local install only (no global runtime dependency).
3. Keep package manager consistent.
4. Standard scripts:
   - `dev`: `astro dev`
   - `build`: `astro build`
   - `preview`: `astro preview`

## Mandatory Bookshop integration steps
1. Create `src/bookshop/bookshop.config.cjs`:

   ```js
   module.exports = {
     engines: {
       "@bookshop/astro-engine": {}
     }
   };
   ```

2. Install packages:
   - `npm i --save-exact @bookshop/astro-bookshop`
   - `npm i -D --save-exact @bookshop/generate @bookshop/browser @bookshop/astro-engine`
   - `npm i -D --save-exact @bookshop/sass`
3. Register integration in `astro.config.mjs`:

   ```js
   import { defineConfig } from 'astro/config';
   import bookshop from '@bookshop/astro-bookshop';

   export default defineConfig({
     integrations: [bookshop()]
   });
   ```
4. Add `.cloudcannon/postbuild`:
   - `npx @bookshop/generate`

## Component rules
1. Component path pattern: `src/components/<ComponentFolder>/<ComponentName>.astro`.
2. Editable components require companion `src/components/.../<ComponentName>.bookshop.yml`.
3. Mark renderable instances with `bookshop:live` in Astro templates.
4. `bookshop:live` is compile-time and must be in `.astro` templates.
5. Use spread props if needed: `<MyBlock bookshop:live {...props} />`.

## Data model rules
1. Use `frontmatter`/content data for component props.
2. Page blocks should be represented as `content_blocks` arrays with `_bookshop_name` + props.
3. Shared block renderer should own the mapping from `_bookshop_name` -> component.

## Mockup-to-stack conversion checklist

### Step 1 — Contract prep (before any implementation)
1. Lock a canonical implementation doc: `CONTRACT.md`.
2. Ensure agent instruction files point to it:
   - `AGENTS.md`
   - `CLAUDE.md`
   - `GEMINI.md`
3. Add repository skeleton:
   - `src/styles/tokens.css`
   - `src/styles/global.css`
   - `src/components/*`
   - `src/pages/*`
   - `src/content/config.ts`
   - `src/content/*`
   - `keystatic.config.ts`
4. Freeze design vocabulary: section spacing scale, breakpoints, typography scale, button sizing, focus behavior.

### Step 2 — Gemini 3 Pro contract prompt (repeat per page family)
When handing the mockup to Gemini, always demand this exact output shape:
- `tokens.css` (variables in `OKLCH` or `HSL`)
- `tailwind.config.*` (optional)
- `STYLEGUIDE.md` (section padding, typography usage, button sizing, hover/focus behavior)
- `COMPONENTS.md` (component list and prop signatures)

Use this prompt skeleton:

> Produce design tokens and a layout spec for a {industry} site. Output: (1) tokens.css variables, (2) type scale, (3) spacing scale, (4) component inventory with props, (5) accessibility requirements (focus rings, contrast), (6) do-not-violate rules: only token colors, only spacing scale, no inline styles.

### Step 3 — Single-file prototype from each mockup
1. Convert each page mockup into one transitional file:
   - `prototype/homepage.html` or `src/pages/index.astro` with single-file structure.
2. Allowed structure:
   - `index` file can contain `<style>` and `<script>` blocks.
   - `<style>` must use `:root` variables copied from `tokens.css`.
   - zero hardcoded hex/RGB values outside tokens.
   - semantic HTML only (`header`, `nav`, `main`, `section`, `footer`).
   - minimal JS (menu toggles, accordion behavior only).

### Step 4 — Extract into Astro/Bookshop
1. Move global styles into `src/styles/tokens.css` and `src/styles/global.css`.
2. Create or refine components from prototype sections and record signatures in `COMPONENTS.md`.
3. Implement each component as props-driven and token-only.
4. For editable components add `.bookshop.yml` with:
   - `spec`, `blueprint`, and optional `_inputs`.
5. Replace page inline blocks with component composition.

### Step 5 — Bind content and harden
1. Add content schemas in `src/content/config.ts`.
2. Create content files under `src/content/*`.
3. Build block-driven pages from the same mockup data.
4. For every additional page:
   - reuse same tokens + same component inventory
   - add only 1 or 2 new components if absolutely necessary
   - do not reinvent spacing, color, or typography scale

### Step 6 — Quality gates (must pass)
1. `npm run build` passes.
2. Quick a11y review is performed (focus states, contrast, semantic structure, keyboard flow).
3. Run screenshot/visual diff checks for regression (optional but recommended).
4. Do not bypass generated outputs.
5. Keep Bookshop packages aligned at same release family until an explicit upgrade is approved.

### Step 7 — Consistent styling discipline
1. Token-only colors:
   - no raw color tokens in components or pages.
2. Fixed spacing scale:
   - use shared `--space-*` variables and section padding tokens.
3. Component-level ownership:
   - pages compose components; no bespoke one-off UI unless componentized and tracked.
4. Refactor funnel:
   - prototype HTML → Astro page → extract components → bind content → hardening pass.
