# Similarity Methods

## Current Stack

- `DOM structure fingerprint`: useful for catching exact or near-exact repeated markup.
- `Computed style comparison`: useful for separating same-structure blocks that make different layout or spacing decisions.
- `Class and utility signature comparison`: useful for spotting reused stitch fragments and the converted `index` equivalents.
- `Semantic token comparison`: useful as a weak supporting signal, not a primary one.
- `Repeat-pattern detection`: useful for surfacing cards, list rows, footer links, accordions, and form fields.
- `Playwright screenshot fingerprints`: useful as a tie-breaker when structure is similar but visual treatment differs.
- `Section/context gating`: essential for keeping the primary matrix trustworthy.

## What Is Working

- Section families are now reliable enough for consolidation planning.
- Child-component families now catch buttons, header links, section-nav chips, footer links, comparison panels/items, process steps, image cards, icon cards, form fields, and accordion items.
- Raw page captures remain the source of truth for every instance, while markdown reports stay readable.
- Context-aware clustering is the main reason the component matrix is now usable.

## What Is Weak

- Generic `RepeatableBlock` remains a catch-all for content rows, hero bullets, legal prose chunks, and footer meta.
- `IconCard` still spans multiple visual subfamilies inside `ServicesSection` and `IconCardGrid`.
- Semantic text similarity is helpful for naming, but weak for deciding component boundaries.
- Full pairwise raw dumps are expensive and create repo bloat without adding much review value.

## Next Worthwhile Methods

- `Generic-block subtyping`
  Goal: split `RepeatableBlock` into clearer families such as `FeatureItem`, `FooterMeta`, `LegalInfoRow`, `StatRow`, and `HeroChecklistItem`.
  Why: this would reduce the largest remaining source of matrix noise.

- `Canonical DOM alignment`
  Goal: align each stitch page section against the converted `index` and `index_original` section trees to detect equivalent wrapper/content roles even when classes differ.
  Why: this would help map stitch markup to the token/BEM implementation model more directly.

- `Style vector clustering`
  Goal: cluster components using normalized vectors of spacing, border, radius, shadow, text treatment, and alignment.
  Why: this would make visual variant families easier to name and compare without relying on raw class text.

- `Crop-level visual embeddings`
  Goal: replace the current lightweight screenshot fingerprint with a stronger embedding-based visual similarity score.
  Why: this could help with cards that are visibly related but structurally drifted.
  Risk: higher complexity, extra dependencies, and less deterministic behavior.

## Probably Not Worth It Right Now

- `OCR-heavy screenshot analysis`
  Reason: the DOM already exposes the text more accurately and cheaply.

- `Full screenshot-only clustering`
  Reason: too hard to explain, too brittle, and weaker than combined DOM/style/context signals for implementation decisions.

- `LLM-only similarity detection`
  Reason: useful for naming or prioritizing, but not trustworthy enough as the source of truth for consolidation checklists.

## Recommended Order

1. Keep the current multi-signal section audit.
2. Keep the new child-component audit tier.
3. Improve `RepeatableBlock` subtyping next.
4. Add canonical DOM alignment against `index` / `index_original`.
5. Only then test stronger visual embeddings if the remaining misses are still mostly visual.
