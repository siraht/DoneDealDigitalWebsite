# STYLEGUIDE

This style guide is the second source of style truth after `src/styles/tokens.css`.

## 1) Principles

- Style system is utility-first with a token backbone.
- All reusable, cross-cutting values come from `src/styles/tokens.css`.
- New components should not invent colors, spacing, shadows, or font sizes inline.
- Prefer semantic components over page-specific ad hoc styles.
- Keep contrast and focus behavior visible for all interactive elements.

## 2) Token usage

- Import order: `tokens.css` is the source for design values.
- `global.css` should reference token variables; avoid hardcoded `rgb/rgba/#`.
- Tailwind utility classes remain the first line of styling, with component scope classes only for composition.

## 3) Core scales

### Color
- Primary brand: `--color-primary`
- Surface/background: `--color-background-light`, `--color-background-dark`
- Text/surface contrast: `--color-text`, `--color-slate`, `--color-text-muted`
- Border and overlays: `--color-border`, `--color-navy-10`, `--color-navy-20`, `--color-navy-60`, `--color-white-10`, `--color-white-30`, `--color-white-60`

### Spacing
- Use spacing tokens from `src/styles/tokens.css`:
  `--space-1` through `--space-28`
- Use container controls: `--container-max`, `--container-padding`

### Typography
- Font families: `--font-display`, `--font-heading`, `--font-body`
- Keep heading and CTA sizing in class utilities (`text-*`, `leading-*`) unless component-level rhythm requires a shared rule.

### Elevation
- Shadow tokens: `--shadow-primary`, `--shadow-accent`
- Surface border tokens are based on brand and accent tokens.

## 4) Interaction standards

- Focus ring: rely on `:focus-visible`, using `--focus-outline` + `--focus-outline-offset`.
- Hover/focus transitions: short utility transition for button/link interactions.
- Keep hover states perceptible and accessible.

## 5) Review gates (pre-build)

- No new hardcoded color values outside tokens.
- No inline style attributes for global layout or branding.
- Reused sections remain in component classes or existing utility patterns.
- Any new section-level override gets a short comment or a component-level token mapping.
