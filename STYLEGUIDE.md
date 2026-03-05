# STYLEGUIDE

This style guide is the second source of style truth after `src/styles/tokens.css`.

## 1) Principles

- Style system is token-first with one canonical component API.
- All reusable, cross-cutting values come from `src/styles/tokens.css`.
- New components should not invent colors, spacing, typography, shadows, borders, radii, or z-index inline.
- Avoid legacy alias classes for component families.
- Prefer semantic components over page-specific ad hoc styles.
- Keep contrast and focus behavior visible for all interactive elements.
- Keep utility styles explicit under `@layer utilities` and namespaced with `u-` when they are shared cross-component effects.

## 2) Token usage

- Import order: `tokens.css` is the source for design values.
- `global.css` must consume token variables for all reusable decisions on spacing, typography, borders, shadows, radii, and motion.
- Tailwind utility classes should only be used for temporary prototypes and layout primitives, not for reusable typography/spacing rules.
- Utility-only visual effects are only permitted as:
  - shared helpers (for example grayscale overlays or paper/grid textures),
  - `u-*` namespaced classes in `@layer utilities`,
  - component usage that is documented and stable.

## 3) Class naming conventions

- Prefer strict BEM naming for components:
  - Block: `component`
  - Element: `component__part`
  - Modifier: `component--variant`

- `id` usage should be reserved for anchor and accessibility targets, not styling.
- Third-party classes (for example `material-symbols-outlined`) are exempt but all custom utility behavior should be tokenized.

## 4) Responsive behavior (container-first)

- Keep components adaptive using container queries:
  - Set `container-type: inline-size` on component roots that control their own layout at different widths.
  - Use `@container` breakpoints for two-column switches, spacing compression, and typography scaling.
- Avoid viewport-level `@media` switches for component-specific behavior.
- Exception-only `@media` usage:
  - Global/system preference rules (for example `prefers-reduced-motion`),
  - Browser/platform-level safety behaviors that cannot be expressed with container queries.
- Example pattern:
  - `html { container-type: inline-size; }` where appropriate for root containers
  - component root rules use `@container (min-width: ...)`.

## 5) Core scales

### Color
- Primary brand: `--color-primary`
- Surface/background: `--color-background-light`, `--color-background-dark`
- Text/surface contrast: `--color-text`, `--color-slate`, `--color-text-muted`
- Border and overlays: `--color-border`, `--color-navy-10`, `--color-navy-20`, `--color-navy-60`, `--color-white-10`, `--color-white-30`, `--color-white-60`

### Spacing
- Use spacing tokens from `src/styles/tokens.css`:
  `--space-*` plus derived layout tokens (`--space-container-gutter`, `--space-section-top`)
- Use container controls: `--container-max`, `--container-padding`

### Typography
- Font families: `--font-display`, `--font-heading`, `--font-body`
- Keep heading and CTA sizing in token variables:
  `--type-size-*` and `--leading-*`.
- Do not introduce `text-*`/`leading-*`/`gap-*`/`p-*`/`m-*` utilities for reusable component structure.

### Coherence checks

- If three or more styles share a tokenized value, no inline or utility-surface-scale fallback is allowed.
- Shared typography, spacing, and border behavior must be driven through `tokens.css` and inherited by `global.css`.
- Component classes are canonical; there is one active selector family per component.

### Elevation
- Shadow tokens: `--shadow-primary`, `--shadow-accent`
- Surface border tokens are based on brand and accent tokens.

## 6) Interaction standards

- Focus ring: rely on `:focus-visible`, using `--focus-outline` + `--focus-outline-offset`.
- Hover/focus transitions: short utility transition for button/link interactions.
- Keep hover states perceptible and accessible.

## 7) Review gates (pre-build)

- No new hardcoded color values outside tokens.
- No inline style attributes for global layout or branding.
- No utility classes for reusable typography, spacing, or border values (`text-*`, `leading-*`, `gap-*`, `p-*`, `m-*`, `w-*`, `h-*`, `space-*`, `border-*`).
- Reused sections remain in component classes or existing utility patterns.
- Any new section-level override gets a short comment or a component-level token mapping.
- Responsive gate:
  - New components should use `@container` for responsive rules.
  - Add `container-type: inline-size` in component roots when component-local adaptation is required.
  - If a viewport `@media` is introduced, capture and document the exception in the conversion checklist.
