# Audit Retrospective

Date: 2026-03-05

This document records what was learned while building and running the page audit system for this repo, what failed, what was fixed, what worked well, and what should be trusted or treated cautiously in the generated outputs.

## Goal

Build one practical audit path that:

- scans the actual pages in this repo
- records DOM structure, classes, and computed styles
- groups shared sections and repeatable sub-patterns
- surfaces exact style differences
- outputs markdown tasklists that can drive consolidation work

The goal was not to build a perfect universal analyzer. The goal was to build a useful repo-specific consolidation map that works on the current Astro + stitch-generated page set.

## What Was Built

Primary implementation:

- [page-audit.mjs](/home/travis/Projects/Done%20Deal%20Digital/Website/scripts/page-audit.mjs)
- npm command: `npm run qa:audit`

Generated outputs:

- [01-page-map.md](/home/travis/Projects/Done%20Deal%20Digital/Website/docs/audit/01-page-map.md)
- [02-section-matrix.md](/home/travis/Projects/Done%20Deal%20Digital/Website/docs/audit/02-section-matrix.md)
- [03-style-deltas.md](/home/travis/Projects/Done%20Deal%20Digital/Website/docs/audit/03-style-deltas.md)
- [04-consolidation-checklist.md](/home/travis/Projects/Done%20Deal%20Digital/Website/docs/audit/04-consolidation-checklist.md)
- [raw manifest](/home/travis/Projects/Done%20Deal%20Digital/Website/docs/audit/raw/manifest.json)
- per-page raw captures in [docs/audit/raw/pages](/home/travis/Projects/Done%20Deal%20Digital/Website/docs/audit/raw/pages)

Supporting fix made during audit:

- Added missing `@tailwind base;`, `@tailwind components;`, and `@tailwind utilities;` directives to the stitch-style pages so Astro stops erroring on inline `@layer utilities`.

## Repo Reality Confirmed

The audit confirmed the repo currently has two implementation families:

1. Converted reference page:
   - [index.astro](/home/travis/Projects/Done%20Deal%20Digital/Website/src/pages/index.astro)
   - tokenized
   - BEM-based
   - global CSS driven

2. Stitch-style prototype pages:
   - most non-home routes
   - inline Tailwind config
   - inline `text/tailwindcss`
   - utility-heavy markup

Also confirmed:

- [index_original.astro](/home/travis/Projects/Done%20Deal%20Digital/Website/src/pages/index_original.astro) is the direct stitch source for the already-converted homepage.
- [privacy.astro](/home/travis/Projects/Done%20Deal%20Digital/Website/src/pages/privacy.astro), [terms.astro](/home/travis/Projects/Done%20Deal%20Digital/Website/src/pages/terms.astro), and [cookie-policy.astro](/home/travis/Projects/Done%20Deal%20Digital/Website/src/pages/cookie-policy.astro) are effectively one template family.
- [404.astro](/home/travis/Projects/Done%20Deal%20Digital/Website/src/pages/404.astro) is an outlier and should not drive shared component decisions.

## Failures Encountered

### 1. Initial audit execution failed on real repo CSS errors

The first attempt used a build/preview flow. That failed because the stitch pages contained inline `@layer utilities` blocks without matching `@tailwind utilities` directives.

Error shape:

- Astro build failed with:
  - `` `@layer utilities` is used but no matching `@tailwind utilities` directive is present. ``

Why this mattered:

- The audit correctly exposed a real repo problem instead of silently proceeding.
- The audit could not trust rendered pages until this was fixed.

### 2. Port collisions caused ambiguous server selection

An earlier dev server kept `4322` occupied. A later audit run drifted to another port.

Why this mattered:

- A scan must know exactly which server it is hitting.
- Anything ambiguous here weakens confidence in the results.

### 3. First classification pass was too generic

The initial audit captured data correctly, but section naming was too broad:

- home sections were labeled as generic `FeatureSection` and `ContentSection`
- interior heroes were mixed with non-hero content
- FAQ groups were split too much
- CTA sections that used links instead of buttons were not grouped cleanly

Why this mattered:

- raw data was fine
- decision-making was still too manual

### 4. Pattern-level grouping can be noisy

Some low-level repeatable patterns, especially generic `repeatable-block`, cluster together technically but are not always useful as immediate extraction targets.

Why this mattered:

- exact data does not automatically mean useful decision output
- some pattern families are too abstract to drive direct component extraction

## What Was Fixed

### 1. Tailwind inline-style directives were added to stitch pages

Affected pages included:

- [about.astro](/home/travis/Projects/Done%20Deal%20Digital/Website/src/pages/about.astro)
- [case-studies.astro](/home/travis/Projects/Done%20Deal%20Digital/Website/src/pages/case-studies.astro)
- [contact.astro](/home/travis/Projects/Done%20Deal%20Digital/Website/src/pages/contact.astro)
- [cookie-policy.astro](/home/travis/Projects/Done%20Deal%20Digital/Website/src/pages/cookie-policy.astro)
- [faq.astro](/home/travis/Projects/Done%20Deal%20Digital/Website/src/pages/faq.astro)
- [index_original.astro](/home/travis/Projects/Done%20Deal%20Digital/Website/src/pages/index_original.astro)
- [lead-generation.astro](/home/travis/Projects/Done%20Deal%20Digital/Website/src/pages/lead-generation.astro)
- [local-seo.astro](/home/travis/Projects/Done%20Deal%20Digital/Website/src/pages/local-seo.astro)
- [privacy.astro](/home/travis/Projects/Done%20Deal%20Digital/Website/src/pages/privacy.astro)
- [terms.astro](/home/travis/Projects/Done%20Deal%20Digital/Website/src/pages/terms.astro)
- [thank-you.astro](/home/travis/Projects/Done%20Deal%20Digital/Website/src/pages/thank-you.astro)
- [web-design.astro](/home/travis/Projects/Done%20Deal%20Digital/Website/src/pages/web-design.astro)

Result:

- `npm run build` now passes
- `npm run qa:audit` now runs against valid page output

### 2. Audit server management was made deterministic

The audit now:

- finds an available local port
- starts one server on that port
- records the runtime `baseURL` in the manifest

Result:

- less ambiguity
- repeatable runs

### 3. Section heuristics were refined until labels became usable

The script now correctly identifies:

- `SiteHeader`
- `HeroSection`
- `CredibilityStrip`
- `ServicesSection`
- `ProcessSection`
- `FinalCtaSection`
- `SiteFooter`
- `SectionNav`
- `FaqSection`
- `FormSection`
- `LegalContent`
- `CallToAction`
- `SystemMessage`

Result:

- the markdown reports are now much more actionable
- the home reference page is mapped in the language already used by the converted implementation

## What Made This Successful

### 1. One path, not multiple audit systems

This stayed maintainable because it did not branch into separate source-only, screenshot-only, and manual-report systems.

The working path is:

- render pages
- capture DOM and computed style data
- classify sections
- emit markdown and raw JSON

That simplicity is why it became usable quickly.

### 2. The scan used rendered output, not guessed source interpretation

This mattered because stitch pages rely heavily on:

- inline Tailwind config
- utility class composition
- inline utility layers

Source parsing alone would not have been enough to know the final styling.

### 3. The converted homepage gave a canonical naming reference

[index.astro](/home/travis/Projects/Done%20Deal%20Digital/Website/src/pages/index.astro) was critical.

Without it, the audit could still cluster things, but naming shared component families would be weaker and more subjective.

### 4. Iterative heuristic refinement was necessary

The audit became useful only after real runs were inspected and corrected.

This was the right sequence:

1. capture real output
2. read the generated matrix/checklist
3. fix bad classifications
4. rerun

That iteration turned raw correctness into decision usefulness.

### 5. Raw JSON plus markdown was the right split

This division worked well:

- raw JSON for exhaustive traceability
- markdown for actual human consolidation decisions

If everything had been forced into markdown, it would have become unreadable.

## What Did Not Work Well

### 1. Generic pattern families are still noisier than section families

The pattern clustering is useful for:

- cards
- nav items
- accordion items
- repeated CTA/action items

It is less useful for:

- generic nested text/image wrappers
- broad `repeatable-block` groups

Takeaway:

- trust section-level grouping more than low-level generic pattern grouping
- use pattern output as supporting evidence, not the primary decision artifact

### 2. Root-level style deltas can include content-driven differences

Examples:

- height
- padding
- spacing around longer copy

These are still useful, but they are not always direct proof of a component design difference.

Takeaway:

- treat root deltas as a review list, not automatic variant definitions

### 3. Interior hero sections are similar, but not identical

The audit correctly grouped them as a family, but their sizes and spacing differ quite a bit because some are:

- legal heroes
- thank-you/confirmation heroes
- service landing heroes
- contact hero

Takeaway:

- they should likely become one hero component with variants, not one rigid single version

### 4. The raw output is large

The audit output is intentionally exhaustive. On the current run, `docs/audit/` is large because it stores:

- full per-page snapshots
- full computed style maps
- full element trees

Takeaway:

- this is acceptable for now because the explicit requirement was full recordkeeping
- future optimization is possible if storage becomes a problem

## What The Audit Learned About Consolidation Priority

### Immediate wins

1. Legal template
   - `privacy`
   - `terms`
   - `cookie-policy`

2. Global header
   - all primary routes share the same basic header pattern

3. Global footer
   - same family across almost all pages

4. Interior hero family
   - most stitch pages use the same general hero pattern

5. CTA family
   - repeated end-of-page conversion sections exist across multiple pages

6. FAQ details family
   - the individual FAQ sections are clearly a repeatable section type

### Strong next-wave candidates

1. Icon card grids
   - about
   - local seo
   - lead generation
   - web design
   - stitch home services

2. Image card grids
   - about team cards
   - case studies cards

3. Case studies filter bar
   - should remain its own `SectionNav` family

### Low-priority or do-later items

1. 404 page
2. unique story/content sections that only appear once
3. very generic nested `repeatable-block` families

## What To Trust Most In The Current Outputs

Strongest outputs:

- [01-page-map.md](/home/travis/Projects/Done%20Deal%20Digital/Website/docs/audit/01-page-map.md)
- [02-section-matrix.md](/home/travis/Projects/Done%20Deal%20Digital/Website/docs/audit/02-section-matrix.md)
- [04-consolidation-checklist.md](/home/travis/Projects/Done%20Deal%20Digital/Website/docs/audit/04-consolidation-checklist.md)

Use with caution:

- [03-style-deltas.md](/home/travis/Projects/Done%20Deal%20Digital/Website/docs/audit/03-style-deltas.md)
  - very useful
  - but some deltas are content-driven, not necessarily component-driven

Supporting evidence only:

- low-level generic pattern clusters in the raw data

## Why The Current Audit Is Good Enough To Use

It now does the important part correctly:

- identifies page families
- identifies major shared sections
- exposes exact styling differences
- records every page and element tree in raw form
- produces tasklists that can drive consolidation work

It is not perfect, but it is already good enough to make consolidation decisions without flying blind.

## What Was Intentionally Not Added

No separate nondeterministic LLM naming layer was added yet.

Reason:

- the deterministic layer became good enough after heuristic refinement
- adding another interpretation path would have increased complexity and made failures harder to reason about

If a later pass is needed, the best use of an LLM would be:

- renaming generic `ContentSection:*` families
- suggesting canonical component names
- proposing variant boundaries

It should not replace the deterministic scan.

## Recommended Use Order

When using the audit for actual consolidation work:

1. Start with [01-page-map.md](/home/travis/Projects/Done%20Deal%20Digital/Website/docs/audit/01-page-map.md)
2. Move to [02-section-matrix.md](/home/travis/Projects/Done%20Deal%20Digital/Website/docs/audit/02-section-matrix.md)
3. Use [04-consolidation-checklist.md](/home/travis/Projects/Done%20Deal%20Digital/Website/docs/audit/04-consolidation-checklist.md) as the working tasklist
4. Open [03-style-deltas.md](/home/travis/Projects/Done%20Deal%20Digital/Website/docs/audit/03-style-deltas.md) only when making variant decisions
5. Use [raw manifest](/home/travis/Projects/Done%20Deal%20Digital/Website/docs/audit/raw/manifest.json) and [raw page captures](/home/travis/Projects/Done%20Deal%20Digital/Website/docs/audit/raw/pages) when exact evidence is needed

## Commands Verified

- `npm run qa:audit`
- `npm run build`

Both passed after the stitch-page Tailwind directive fix.

## If This Audit Needs A Later Upgrade

Best next improvements:

1. section screenshots per page family
2. tighter pattern naming for generic content blocks
3. normalized style-delta reporting that downranks content-driven properties like height
4. optional semantic labeling pass on top of the deterministic data

Do not add a second parallel audit system unless the current script proves insufficient. One path is easier to trust.
