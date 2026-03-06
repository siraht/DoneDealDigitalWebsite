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
- Generic child blocks are now split into more useful families such as `CredibilityItem`, `HeroEyebrow`, `HeroChecklistItem`, `FooterMeta`, `FooterColumnHeading`, `LegalBulletItem`, `LegalInfoRow`, `LegalTextBlock`, `FormFieldRow`, and `FeatureItem`.
- Raw page captures remain the source of truth for every instance, while markdown reports stay readable.
- Context-aware clustering is the main reason the component matrix is now usable.
- Canonical alignment is now explicit, so it is clear which families already have an `index` or `index_original` precedent and which ones need a fresh definition.
- Style archetype clustering now gives a cross-family view of repeated visual primitives like footer links, nav pills, CTA buttons, elevated cards, and bordered info rows.

## What Is Weak

- Some `ContentSection` clusters are still broader than a human reviewer would want, especially when different sections reuse very similar wrapper markup.
- `IconCard` still spans multiple visual subfamilies inside `ServicesSection` and `IconCardGrid`.
- `LegalTextBlock` still combines legal headings and legal body paragraphs because they are intentionally using nearly identical structures.
- Semantic text similarity is helpful for naming, but weak for deciding component boundaries.
- Style archetypes are useful for identifying shared primitives, but they are not the source of truth for extraction decisions.

## Next Worthwhile Methods

- `Content-section role alignment`
  Goal: split broad `ContentSection` families into clearer internal roles such as media column, heading block, stat card rail, and explanatory copy stack.
  Why: this is the main remaining source of over-broad section clustering.

- `Conversion blueprint extraction`
  Goal: compare `index_original` and `index` family by family to document exactly how stitch markup was normalized into tokens, BEM, and reusable components.
  Why: this would turn the existing precedent into a direct migration playbook for the remaining stitch pages.

- `Cluster-specific style baselines`
  Goal: emit one canonical style baseline per section/component family instead of only delta summaries.
  Why: this would make implementation checklists more prescriptive.

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
3. Use canonical alignment and component style deltas to start real consolidation work.
4. Refine broad `ContentSection` families next.
5. Extract an explicit `index_original` to `index` conversion blueprint.
6. Only then test stronger visual embeddings if the remaining misses are still mostly visual.
