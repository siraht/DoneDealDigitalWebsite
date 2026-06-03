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
| `heading-text-wrap` | Default ACSS heading wrapping. Set to `pretty` so headings use orphan prevention instead of heavier-handed balancing. |
| `text-wrap` | Default ACSS body/text wrapping. Set to `pretty` for paragraphs, list items, blockquotes, and text utility classes. |
| `base-radius` | Default ACSS radius token. Set to `0px` because this site uses square corners and ACSS auto-radius applies `--radius` to images/figures. |
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
  "h6-max": 14,
  "heading-text-wrap": "pretty",
  "text-wrap": "pretty",
  "base-radius": "0px"
}
```

Rationale:

- Keep `text-m` fixed at 16px so body copy remains stable and readable.
- Let display headings become responsive instead of hard-coding large desktop sizes onto small screens.
- Preserve the brand's compressed display look by keeping `h1/h2/h3` large, but set mobile floors to avoid cramped wrapping.
- Use per-token overrides for text and headings because the current art direction has deliberate jumps: 16px body, 24px loud labels, 36px card heads, 60px section heads, and 96px hero/final display.
- Keep semantic elements intact. `h1` maps to `--h1`, major `h2` section titles map to `--h2`, card `h3` titles map to `--h3`, FAQ `h3` questions map to `--text-xxl` because they are semantically questions under an FAQ section but visually smaller than card titles.
- Let ACSS own default wrapping with `text-wrap: pretty` for both headings and text. Avoid local `text-wrap: balance` on content unless a component has a specific short-label reason to opt out.
- Keep ACSS radius tokens square with `base-radius: 0px`; ACSS auto-radius can stay enabled because it now resolves image/figure `border-radius: var(--radius)` to `0px`.

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

## Migration Lessons And Adjustments

### ACSS heading color defaults are not purely inherited

ACSS generates this global heading rule:

```css
h1,
:where(.h1),
h2,
:where(.h2),
h3,
:where(.h3),
h4,
:where(.h4),
h5,
:where(.h5),
h6,
:where(.h6) {
  color: var(--heading-color);
}
```

Because `--heading-color` defaults to `var(--text-dark)`, headings and heading utility classes can become dark even when their parent section has `color: var(--color-white)`. This affected the hero, dark FAQ/frustration sections, and footer.

Adjustment:

- Keep using ACSS heading selectors and classes.
- Set contextual ACSS variables on dark site sections instead of fighting each individual heading:
  - `.hero`, `.site-footer`: `--heading-color: var(--color-white)`, `--text-color: var(--color-concrete)`
  - `.home-frustrations`, `.home-faq`: `--heading-color: var(--color-white)`, `--text-color: var(--color-white)`
- Keep explicit component text colors where the design needs muted copy or orange accents.

### ACSS section padding should live on the outer section shell

ACSS generates a low-specificity section shell rule:

```css
:where(section:not(section section)) {
  display: flex;
  flex-direction: column;
  padding-block: var(--section-padding-block);
  padding-inline: var(--gutter);
}
```

The first pass tried to protect the existing layout by removing ACSS inline padding from the outer sections and keeping the old inner `.site-container` padding. That avoided immediate double padding, but it kept the site on the old spacing model and made ACSS responsible for typography only.

The final direction is better: the outer top-level section owns ACSS spacing, and the inner wrapper owns max-width/layout only.

Adjustment:

- Keep `display: block` on top-level sections because ACSS defaults to `display: flex`, while these components already define their own inner grid/flex layout.
- Use ACSS inline section padding on the outer shell:
  - `.hero`, `.cred-strip`, `.services`, `.home-frustrations`, `.process`, `.home-faq`, `.final-cta`, `.site-footer`: `padding-inline: var(--gutter)`
- Remove inner wrapper gutters inside ACSS-managed homepage sections:
  - `.hero > .site-container`
  - `.services > .site-container`
  - `.home-frustrations > .site-container`
  - `.process > .site-container`
  - `.home-faq > .site-container`
  - `.final-cta__wrap`
  - `.site-footer .site-container`
- Move vertical rhythm to ACSS section/space variables:
  - `.hero`: `padding-block: var(--section-space-l)`
  - `.services`, `.home-frustrations`, `.home-faq`, `.process`, `.final-cta`: `padding-block: var(--section-space-m)`
  - `.site-footer`: `padding-block: var(--section-space-s)`
  - `.cred-strip`: `padding-block: var(--space-xl)` because it is a compact credibility band, not a full content section.
- Remove old hero inner padding (`.hero__inner`) so the hero spacing comes from the outer ACSS section padding while the inner wrapper remains responsible for grid columns, max width, and alignment.

### Practical boundary for this migration

ACSS is currently used as the responsive typography and outer section spacing source, while local component CSS still owns the internal component layouts. That boundary keeps the migration stable:

- Use ACSS for `--h*`, `--text-*`, `.h*`, and `.text--*`.
- Use ACSS for `text-wrap: pretty` on headings, body text, list items, blockquotes, and text utility classes.
- Use ACSS for `--radius`, but keep the base value at `0px` so auto-radius and dependent controls remain square.
- Use ACSS for section gutters and vertical section rhythm through `--gutter`, `--section-space-*`, and `--space-*`.
- Use local component CSS for inner media grids, cards, badges, FAQ rows, final CTA panel framing, and dark/light contextual color treatment.
- Avoid putting padding on both the outer section and the inner `.site-container`; pick one owner. For this homepage, the owner is the outer section.

### Header spacing needs the same single-owner rule

ACSS also generates a top-level header shell rule:

```css
:where(body > header) {
  padding-block: var(--space-xs);
  padding-inline: var(--gutter);
}
```

The header became too tall when this ACSS padding stacked with the old `.site-header .site-container { padding: 1rem; }` and the desktop `.site-header__brand` block padding.

Adjustment:

- Let `.site-header` own the ACSS shell padding with `padding-block: var(--space-xs)` and `padding-inline: var(--gutter)`.
- Set `.site-header .site-container` to max-width/layout only with `padding: 0`.
- Remove the desktop brand padding so the header height is driven by ACSS shell spacing and the CTA/nav contents, not multiple nested padding layers.

### Compact bands should use space variables, not section-space variables

The credibility strip is a compact utility band, not a full content section. Giving it full section spacing, or a large token such as `--space-xl`, made the top and bottom padding feel oversized.

Adjustment:

- Keep the strip on the ACSS outer gutter model.
- Use compact ACSS spacing for the band:
  - `.cred-strip { padding-block: var(--space-xs); }`
  - `.cred-strip__item { padding-block: var(--space-xs); }`
- Keep `--section-space-*` for major sections that need full editorial rhythm.

### Footer internals should not be `section` elements

ACSS section defaults target `section:not(section section)`. Footer child `<section>` elements are not nested inside a parent section, so ACSS treated each footer column like a top-level section and injected section padding/gutters.

Adjustment:

- Keep the semantic `<footer>` landmark.
- Replace footer child `<section>` elements with `<div>` columns.
- Keep column headings as `h2`/`h3` where useful for footer scanability.
- Add `.site-footer__col { padding: 0; }` as a defensive guard against any utility/default padding on footer columns.

## Cross-Page CTA Conversion Map

Shared components:

| Component | Role | Base selectors/classes | Typography | Color/surface | Notes |
|---|---|---|---|---|---|
| `CtaLink.astro` | Link CTA | `.cta`, `.cta--accent`/`.cta--secondary`, `.cta--sm`/`md`/`lg`/`xl`, optional `.cta--full` | `--text-xs` through `--text-xxl` by size | accent uses `--color-primary` + white text + `--shadow-accent`; secondary uses white + navy text + `--shadow-primary` | Used for navigation CTAs, hero CTAs, phone CTAs, and 404/home actions. |
| `CtaButton.astro` | Form/action button CTA | Same `.cta` classes as `CtaLink` | Same size scale as link CTA | Same variants as link CTA | Used where semantics require `<button>`, currently the contact form submit. |
| `FinalCTA.astro` | Full CTA panel section | `.final-cta`, `.final-cta__wrap`, `.final-cta__panel`, `.final-cta__title`, `.final-cta__copy`, `.final-cta__actions`, `.final-cta__button`, `.final-cta__secondary` | title uses `.h1` / `--h1`; copy uses `.text--xl` / `--text-xl`; button uses `.cta--xl` / `--text-xxl` | surface variants: white/light/concrete; panel variants: light/dark; shadow variants: none/primary/accent; border variants: navy/primary | Uses homepage final CTA as the base structure and consolidates page-specific panel treatments into modifiers. |

Current page usage:

| Page | CTA element | Component / selector | Attributes | Visual attributes preserved |
|---|---|---|---|---|
| Header | Site-wide quote link | `.site-header__cta cta cta--accent cta--sm` | `href="/contact"`, `id="site-cta"` | compact ACSS text size, accent fill, header-specific padding. |
| Home hero | Primary hero CTA | `CtaLink`, `.hero__cta cta cta--accent cta--md` | `href="/contact"` | homepage accent button size and placement. |
| Home final | Final CTA panel | `FinalCTA` | title/copy/action props | homepage `.final-cta` panel, `.h1` title, `.text--xl` copy, `.cta--xl` button. |
| About final | Final CTA with eyebrow | `FinalCTA` | `eyebrow="READY TO WORK?"`, `actionLabel="LET'S TALK"`, `shadow="primary"` | retained floating-style label as consolidated `.final-cta__eyebrow`; kept primary block shadow. |
| Web design hero | Primary + secondary hero CTAs | `CtaLink` accent and secondary | contact link, phone link | retained orange primary and white secondary button pair. |
| Web design final | Dark final CTA with phone action | `FinalCTA` | `panel="dark"`, `shadow="accent"`, phone secondary action | retained navy panel, orange block shadow, white heading/copy treatment, secondary phone link. |
| Lead generation hero | Primary hero CTA | `CtaLink` | `href="/contact"`, `label="GET A FREE AD REVIEW"`, `size="lg"` | retained larger hero CTA scale and accent shadow. |
| Lead generation final | Dark final CTA with secondary copy | `FinalCTA` | `panel="dark"`, `shadow="accent"`, `secondaryCopy` | retained second support paragraph and dark panel treatment. |
| Local SEO hero | Primary hero CTA | `CtaLink` | `href="/contact"`, `label="GET A FREE SEO REVIEW"` | retained accent CTA. |
| Local SEO final | Dark final CTA on light section | `FinalCTA` | `surface="light"`, `panel="dark"`, `border="primary"`, `shadow="primary"` | retained navy panel, primary border, and block shadow. |
| FAQ final | Final CTA with phone secondary | `FinalCTA` | `surface="concrete"`, `shadow="accent"`, phone secondary action | retained concrete section surface, white panel, orange shadow, and phone secondary CTA. |
| Case studies final | Light final CTA | `FinalCTA` | `surface="light"`, `shadow="primary"`, `actionLabel="LET'S TALK"` | retained light section and block shadow. |
| Contact form | Submit CTA | `CtaButton` | `type="submit"`, `label="GET MY QUOTE"`, `size="xl"` | kept button semantics while using the same `.cta` styling scale. |
| Thank you | Phone CTA | `CtaLink` | `href={tel:...}`, `size="xl"`, `full` | retained full-width phone CTA and icon. |
| 404 | Return-home CTA | `CtaLink` | `href="/"`, `label="GO HOME"` | moved standalone page action into shared CTA system. |
| `index_original` | Archived visible CTAs | `CtaLink` | contact/case-study/phone paths | left the archived layout intact but replaced one-off buttons/primary link with shared CTA classes. |

## Cross-Page ACSS Lessons

### Page heroes should use the shared `Hero` component

The homepage hero established the site hero typography contract:

- Hero title: semantic `h1` with `.hero__headline h1`, using ACSS `--h1`.
- Hero copy: `.hero__copy text--l`, using ACSS `--text-l`.
- Hero accent spans: `.hero__headline-accent`, color only.

Several other pages had copied hero sections with page-specific Tailwind font-size utilities such as `text-5xl`, `md:text-9xl`, and `md:text-[140px]`. That created inconsistent hero sizing and bypassed the ACSS typography scale.

Adjustment:

- Use `Website/src/components/Hero.astro` for public page heroes.
- Put hero title text in the `title` slot; do not add font-size utility classes to hero `h1`s.
- Put hero body text in the `copy` prop or `copy` slot; do not add page-specific text-size utilities to hero copy.
- Use component props for layout only:
  - `align="start|center"`
  - `spacing="standard|compact|large"`
  - `width="standard|narrow|wide"`
- Use `actions` and `media` slots for CTA rows, proof badges, and hero images while keeping the title/copy typography fixed.
- If a page needs visual emphasis inside the hero title, use `.hero__headline-accent` or decoration classes on a nested span; do not change the hero heading size.

### Content groups inside articles and FAQ lists should not be `section`

Legal pages used `<section>` inside `<article>`, and the FAQ page used `<section>` for each category inside a `<main>` wrapper. Those elements were not nested inside another section, so ACSS treated them as top-level sections and applied section padding/gutters to paragraph/list groups.

Adjustment:

- Keep the page hero and major standalone page bands as `<section>`.
- Use `<article>` for legal document bodies.
- Use neutral `<div>` groups for legal clauses and FAQ categories when they are content subdivisions inside an existing article/main flow.
- Preserve heading semantics inside those groups with `h2`/`h3`; the grouping element does not need to be a section for the heading hierarchy to remain understandable.

### Cross-page hero spacing follows the same single-owner rule

Several non-homepage hero sections had no vertical padding on the outer `<section>` but did have `py-*` utilities on the inner max-width wrapper. ACSS also applied top-level section padding to the outer shell, creating double vertical rhythm.

Adjustment:

- Move hero `py-*` utilities onto the outer hero section.
- Remove `py-*` from the immediate max-width/grid wrapper.
- Let the outer section own vertical rhythm and background/border treatment.
- Let the inner wrapper own max-width, gutters, z-index, and grid/flex layout.

### Dark utility surfaces should set ACSS color variables

Many generated pages rely on utility classes such as `bg-navy` and `bg-background-dark`. Text color inheritance alone is not enough because ACSS heading selectors read `--heading-color`.

Adjustment:

- Add a contextual bridge for dark utility surfaces:
  - `.bg-navy, .bg-background-dark { --heading-color: var(--color-white); --text-color: var(--color-concrete); }`
- Keep explicit heading utility colors where they already exist, but prefer contextual variables for sections and reusable components.
- Dark `FinalCTA` panels set these same variables at the component modifier level so variants remain self-contained.
