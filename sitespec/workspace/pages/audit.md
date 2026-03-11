---
entity: page-instance
id: audit
page_type_ref: audit-overview
slug: /audit
title: Audit Viewer
---

## Meta
- seo_title: Similarity Viewer | Audit Viewer
- meta_description: Internal overview of the audit viewer methods available in the project.

## Section Manifest
- shell.header
- hero.main
- catalog.methods

## Section: shell.header
- pattern_ref: section.audit-shell-header
- variant_ref: audit-surface
- layout_ref: shell-topbar

### Slots
#### kicker
- mode: literal
- content: Visual audit modes

#### heading
- mode: literal
- style_ref: h1-hero-1
- content: Similarity Viewer

#### back_link
- mode: literal
- content: All methods

### Collections
#### stat_items
- item: pages
  - label: Pages
  - value: Live audit dataset
- item: families
  - label: Families
  - value: Section and component family counts

#### method_links
- item: gallery
  - label: Family Gallery Wall
  - href: /audit/gallery
  - status: Live
- item: compare
  - label: Canonical Comparator
  - href: /audit/compare
  - status: Live
- item: matrix
  - label: Coverage Heatmap
  - href: /audit/matrix
  - status: Live
- item: archetypes
  - label: Style Archetype Atlas
  - href: /audit/archetypes
  - status: Live
- item: deltas
  - label: Family Deltas
  - href: /audit/deltas
  - status: Live
- item: properties
  - label: Property Atlas
  - href: /audit/properties
  - status: Live
- item: tokens
  - label: Token Coverage
  - href: /audit/tokens
  - status: Live
- item: decisions
  - label: Decision Queue
  - href: /audit/decisions
  - status: Live
- item: workbench
  - label: Conversion Workbench
  - href: /audit/workbench
  - status: Live

## Section: hero.main
- pattern_ref: section.audit-explainer
- variant_ref: audit-surface
- layout_ref: two-column-equal

### Slots
#### eyebrow
- mode: literal
- content: Visual roadmap

#### heading
- mode: literal
- style_ref: h2-section
- content: Audit viewer modes turn the existing mapping into browser-native decision surfaces.

#### body
- mode: draft
- style_ref: body-1
- brief: Explain that the goal is not another text report but a set of visual tools grounded in docs/audit/raw.

#### note_title
- mode: literal
- content: Current status

#### note_body
- mode: literal
- style_ref: body-1
- content: All listed methods are live and operate on the same underlying audit datasets.

### Collections
#### bullets
- item: bullet-1
  - body: See canonical references and variants as live page previews.
- item: bullet-2
  - body: Keep one data source in docs/audit/raw.
- item: bullet-3
  - body: Use different visual organizations for scan, compare, coverage, tokens, and decisions.

## Section: catalog.methods
- pattern_ref: section.audit-catalog
- variant_ref: audit-surface
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: VIEWER MODES

### Collections
#### entries
- item: gallery
  - title: Family Gallery Wall
  - body: Broad scan surface for section and component families.
- item: compare
  - title: Canonical Comparator
  - body: Pinned-reference comparison boards for family variants.
- item: matrix
  - title: Coverage Heatmap
  - body: Page-by-family coverage with preview dock behavior.
- item: archetypes
  - title: Style Archetype Atlas
  - body: Cross-family visual primitive grouping.
- item: workbench
  - title: Conversion Workbench
  - body: Stitch precedent to rollout-target planning surface.

## Notes
- This route is internal tooling rather than public marketing content, but it is still an implemented Astro page and is included per the requested page-complete scope.
