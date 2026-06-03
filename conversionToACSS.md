# Homepage Typography Conversion To ACSS

Source files:

- `Website/src/pages/index.astro`
- `Website/src/styles/tokens.css`
- `Website/src/styles/global.css`
- `/home/travis/Projects/automatic.css-4.0.0-beta-3/non-wp/README.md`
- `/home/travis/Projects/automatic.css-4.0.0-beta-3/automaticcss-plugin/config/ui.json`
- `/home/travis/Projects/automatic.css-4.0.0-beta-3/automaticcss-plugin/assets/scss/automatic-imports_precompiled.scss`

## Current Homepage Typography Map

| Element / selector | Semantic element | Existing classes | Current size token | Current px | Other type attributes |
|---|---:|---|---:|---:|---|
| Hero headline | `h1` | `hero__headline` | `--type-size-8xl` | 96 | Bebas Neue, uppercase, line-height `0.85`, letter-spacing `0.02em` |
| Hero accent | `span` | `hero__headline-accent` | inherits headline | 96 | color accent only |
| Hero copy | `p` | `hero__copy` | `--type-size-l` | 18 | line-height `1.333`, max-width `32rem` |
| Hero CTA | `a` | `hero__cta cta cta--accent cta--md` | `--type-size-lg` | 18 | uppercase, weight 700, letter-spacing `0.1em`, line-height `1.5556` |
| Hero badge eyebrow | `p` | `hero__badge-copy` | `--type-size-xs` | 12 | uppercase, weight 700 |
| Hero badge title | `p` | `hero__badge-title` | `--type-size-4xl` | 36 | Bebas Neue, letter-spacing `0.18em` |
| Credibility item | `div` | `cred-strip__item` | `--type-size-2xl` | 24 | Bebas Neue, weight 700, line-height `1.333` |
| Credibility text | `span` | `cred-strip__text` | inherit | 24 | uppercase, letter-spacing `0.05em`, line-height `1` |
| Services title | `h2` | `services__title` | `--type-size-6xl` | 60 | Bebas Neue, line-height `1`, letter-spacing `0.02em` |
| Service card title | `h3` | `services-card__title` | `--type-size-card-title` | 36 | Bebas Neue, uppercase, line-height `1.1111` |
| Service description | `p` | `services-card__description` | `--type-size-base` | 16 | weight 500, line-height `1.625` |
| Service follow-up | `p` | `services-card__followup` | `--type-size-base` | 16 | italic, line-height `1.45` |
| Frustrations section title | `h2` | `home-frustrations__title` | `--type-size-6xl` | 60 | Bebas Neue, uppercase, line-height `0.85`, letter-spacing `0.02em` |
| Frustration quote | `p` | `home-frustrations-quote` | `--type-size-2xl` | 24 | Bebas Neue, uppercase, line-height `1.2`, letter-spacing `0.04em` |
| Frustration copy | `p` | `home-frustrations-copy` | `--type-size-base` | 16 | line-height `1.65`, max-width `32ch` |
| Process title | `h2` | `process__title` | `--type-size-6xl` | 60 | Bebas Neue, uppercase, line-height `1` |
| Process step number | `div` | `process-step__number` | `--type-size-3xl` | 30 | Bebas Neue |
| Process step title | `h4` | `process-step__title` | `--type-size-xl` | 20 | uppercase, weight 700, line-height `1.333`, letter-spacing `0.05em` |
| Process step copy | `p` | `process-step__copy` | `--type-size-base` | 16 | line-height `1.625` |
| FAQ title | `h2` | `home-faq__title` | `--type-size-6xl` | 60 | Bebas Neue, uppercase, line-height `0.85`, letter-spacing `0.04em` |
| FAQ number | `span` | `home-faq__number` | custom clamp | 40-52 | Bebas Neue, line-height `1` |
| FAQ question | `h3` | `home-faq__question` | `--type-size-2xl` | 24 | Bebas Neue, uppercase, letter-spacing `0.02em` |
| FAQ answer | `p` | `home-faq__answer` | `--type-size-base` | 16 | line-height `1.65`, max-width `45ch` |
| Final CTA title | `h2` | `final-cta__title` | `--type-size-7xl`, then `--type-size-8xl` at 48rem container | 72-96 | Bebas Neue, uppercase, line-height `1`, letter-spacing `0.02em` |
| Final CTA copy | `p` | `final-cta__copy` | `--type-size-xl` | 20 | line-height `2rem`, max-width `42rem` |
| Final CTA button | `a` | `final-cta__button cta cta--accent cta--xl` | `--type-size-2xl` | 24 | uppercase, weight 700, line-height `2rem`, letter-spacing `0.1em` |

## ACSS Typography Model

The local ACSS non-WP generator uses `src/data/acss.settings.json` and writes generated files to `public/automatic-css/`.

Generation command:

```bash
php /home/travis/Projects/automatic.css-4.0.0-beta-3/non-wp/generate-css.php \
  --settings="/home/travis/Projects/Done Deal Digital/Website/src/data/acss.settings.json" \
  --output-dir="/home/travis/Projects/Done Deal Digital/Website/public" \
  --modules=core \
  --base-url=http://localhost:4321
```

The generated ACSS files are committed in `Website/public/automatic-css/`. `automatic-custom-css.css` and `automatic-tokens.css` are currently empty because these settings do not define custom CSS or inline token output; keeping them linked preserves ACSS load order.

Relevant ACSS settings:

| Setting | Role |
|---|---|
| `root-font-size` | Percent value for browser root. `100` keeps `1rem = 16px`. |
| `vp-min`, `vp-max` | Viewport range used by generated `clamp()` values. |
| `base-text-mob`, `base-text-desk` | Base `--text-m` values in px. |
| `mob-text-scale`, `text-scale` | Mobile and desktop multipliers for `--text-xs` through `--text-xxl`. |
| `text-xs-min/max` through `text-xxl-min/max` | Per-token overrides when the global text scale is not exact enough. |
| `base-heading-mob`, `base-heading-desk` | Base `--h4` values in px. |
| `mob-heading-scale`, `heading-scale` | Mobile and desktop heading multipliers. Defaults derive `h3/h2/h1` upward from `h4` and `h5/h6` downward. |
| `h1-min/max` through `h6-min/max` | Per-heading overrides when a display system needs deliberate jumps. |
| `option-text-size-classes` | Generates `.text--xs`, `.text--s`, `.text--m`, `.text--l`, `.text--xl`, `.text--xxl`. |
| `option-text-size-variables` | Generates `--text-xs` through `--text-xxl`. |
| `option-heading-size-variables` | Generates `--h1` through `--h6` and bridge variables such as `--h2-to-h3`. |

Generated ACSS class/variable targets:

| Site need | ACSS variable/class |
|---|---|
| 96px hero display | `--h1`, `.h1` |
| 60px section display | `--h2`, `.h2` |
| 36px card title / badge title | `--h3`, `.h3` |
| 24px large label/question/button | `--text-xxl`, `.text--xxl` |
| 20px compact heading / CTA copy | `--text-xl`, `.text--xl` or `--h4` for true headings |
| 18px lead copy / medium CTA | `--text-l`, `.text--l` |
| 16px body copy | `--text-m`, `.text--m` |
| 14px nav / small label | `--text-s`, `.text--s` |
| 12px micro label | `--text-xs`, `.text--xs` |

## Recommended Site Settings

The selected settings are stored in `Website/src/data/acss.settings.json`.

```json
{
  "root-font-size": 100,
  "vp-min": 360,
  "vp-max": 1366,
  "base-text-mob": 16,
  "base-text-desk": 16,
  "text-scale": 1.2,
  "mob-text-scale": 1.125,
  "text-xs-min": 12,
  "text-xs-max": 12,
  "text-s-min": 14,
  "text-s-max": 14,
  "text-m-min": 16,
  "text-m-max": 16,
  "text-l-min": 17,
  "text-l-max": 18,
  "text-xl-min": 18,
  "text-xl-max": 20,
  "text-xxl-min": 22,
  "text-xxl-max": 24,
  "base-heading-mob": 20,
  "base-heading-desk": 20,
  "heading-scale": 1.75,
  "mob-heading-scale": 1.42,
  "h1-min": 58,
  "h1-max": 96,
  "h2-min": 42,
  "h2-max": 60,
  "h3-min": 32,
  "h3-max": 36,
  "h4-min": 20,
  "h4-max": 20,
  "h5-min": 16,
  "h5-max": 16,
  "h6-min": 14,
  "h6-max": 14
}
```

Rationale:

- Keep `text-m` fixed at 16px so body copy remains stable and readable.
- Let display headings become responsive instead of hard-coding large desktop sizes onto small screens.
- Preserve the brand's compressed display look by keeping `h1/h2/h3` large, but set mobile floors to avoid cramped wrapping.
- Use per-token overrides for text and headings because the current art direction has deliberate jumps: 16px body, 24px loud labels, 36px card heads, 60px section heads, and 96px hero/final display.
- Keep semantic elements intact. `h1` maps to `--h1`, major `h2` section titles map to `--h2`, card `h3` titles map to `--h3`, FAQ `h3` questions map to `--text-xxl` because they are semantically questions under an FAQ section but visually smaller than card titles.

## Homepage Conversion Plan

| Selector | Conversion |
|---|---|
| `body` | Use ACSS text family, `font-size: var(--text-m)`, `line-height: var(--text-line-height, var(--leading-relaxed))`. |
| `.hero__headline` | Use `font-size: var(--h1)`, semantic `h1`, ACSS class `.h1`. |
| `.hero__copy` | Use `font-size: var(--text-l)`, ACSS class `.text--l`. |
| `.cta--md` | Use `font-size: var(--text-l)`. |
| `.cta--xl` | Use `font-size: var(--text-xxl)`. |
| `.hero__badge-copy` | Use `font-size: var(--text-xs)`. |
| `.hero__badge-title` | Use `font-size: var(--h3)`. |
| `.cred-strip__item` | Use `font-size: var(--text-xxl)`. |
| `.services__title`, `.home-frustrations__title`, `.process__title`, `.home-faq__title` | Use `font-size: var(--h2)`, semantic `h2`, ACSS class `.h2`. |
| `.services-card__title` | Use `font-size: var(--h3)`, semantic `h3`, ACSS class `.h3`. |
| `.home-frustrations-quote` | Use `font-size: var(--text-xxl)`. |
| `.process-step__number` | Use `font-size: var(--h3)`. |
| `.process-step__title` | Keep semantic `h4`, use `font-size: var(--h4)` and ACSS class `.h4`. |
| `.home-faq__number` | Use `font-size: clamp(var(--h3), 4vw, var(--h2))` because it is decorative numbering, not a heading. |
| `.home-faq__question` | Keep semantic `h3`, use `font-size: var(--text-xxl)` / class `.text--xxl` because visual hierarchy is below section title and card titles. |
| `.final-cta__title` | Use `font-size: var(--h1)`, semantic `h2` styled as display with ACSS class `.h1`. |
| `.final-cta__copy` | Use `font-size: var(--text-xl)`. |
