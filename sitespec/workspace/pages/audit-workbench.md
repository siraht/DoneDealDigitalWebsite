---
entity: page-instance
id: audit-workbench
page_type_ref: audit-method
slug: /audit/workbench
title: Audit Workbench
---

## Meta
- seo_title: Conversion Workbench | Audit Viewer
- meta_description: Internal workbench for stitch precedent, tokenized reference, and rollout target planning.

## Section Manifest
- shell.header
- hero.main
- catalog.primary
- catalog.secondary

## Section: shell.header
- pattern_ref: section.audit-shell-header
- variant_ref: audit-surface
- layout_ref: shell-topbar

### Slots
#### kicker
- mode: literal
- content: Method 5 of 5

#### heading
- mode: literal
- style_ref: h1-hero-1
- content: Conversion Workbench

#### back_link
- mode: literal
- content: All methods

### Collections
#### method_links
- item: audit
  - label: Overview
  - href: /audit
  - status: Live
- item: compare
  - label: Canonical Comparator
  - href: /audit/compare
  - status: Live
- item: matrix
  - label: Coverage Heatmap
  - href: /audit/matrix
  - status: Live

## Section: hero.main
- pattern_ref: section.audit-explainer
- variant_ref: audit-surface
- layout_ref: two-column-equal

### Slots
#### eyebrow
- mode: literal
- content: Migrate fifth

#### heading
- mode: literal
- style_ref: h2-section
- content: Turn the audit into an actual stitch-to-token conversion surface.

#### body
- mode: literal
- style_ref: body-1
- content: This view organizes families by the exact migration pattern available in the repo: stitched precedent, tokenized reference, and rollout targets.

#### note_title
- mode: literal
- content: How to use it

#### note_body
- mode: literal
- style_ref: body-1
- content: Start with families that already have both stitched and tokenized references, then move to families that still need a first canonical definition.

### Collections
#### bullets
- item: order
  - body: Best for planning actual implementation order, not just analysis.
- item: precedent
  - body: Reuses the index_original to index precedent instead of inventing rules per page.
- item: source
  - body: Separates home-derived families from families that still need a new source of truth.

## Section: catalog.primary
- pattern_ref: section.audit-catalog
- variant_ref: audit-surface
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: STITCH PRECEDENT TO TOKENIZED REFERENCE TO ROLLOUT TARGETS

### Collections
#### entries
- item: home-derived
  - title: Home-derived section families
  - body: Families that already have a usable homepage conversion precedent.
- item: primitives
  - title: Primitive rollout boards
  - body: Lower-level component families organized with the same migration surface.

## Section: catalog.secondary
- pattern_ref: section.audit-catalog
- variant_ref: audit-surface
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: FAMILIES THAT STILL NEED THEIR FIRST CANONICAL DEFINITION

### Collections
#### entries
- item: new-sources
  - title: New section sources of truth
  - body: Families that cannot simply inherit the homepage precedent yet.
- item: new-components
  - title: New component sources of truth
  - body: Primitive families still waiting on their first stable definition.
