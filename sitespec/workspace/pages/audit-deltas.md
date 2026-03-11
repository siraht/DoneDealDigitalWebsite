---
entity: page-instance
id: audit-deltas
page_type_ref: audit-method
slug: /audit/deltas
title: Audit Deltas
---

## Meta
- seo_title: Family Deltas | Audit Viewer
- meta_description: Internal view for inspecting varying properties inside each family before splitting or consolidating it.

## Section Manifest
- shell.header
- hero.main
- summary.metrics
- catalog.primary

## Section: shell.header
- pattern_ref: section.audit-shell-header
- variant_ref: audit-surface
- layout_ref: shell-topbar

### Slots
#### kicker
- mode: literal
- content: Family-first deltas

#### heading
- mode: literal
- style_ref: h1-hero-1
- content: Family Deltas

#### back_link
- mode: literal
- content: All methods

### Collections
#### method_links
- item: audit
  - label: Overview
  - href: /audit
  - status: Live
- item: properties
  - label: Property Atlas
  - href: /audit/properties
  - status: Live
- item: decisions
  - label: Decision Queue
  - href: /audit/decisions
  - status: Live

## Section: hero.main
- pattern_ref: section.audit-explainer
- variant_ref: audit-surface
- layout_ref: two-column-equal

### Slots
#### eyebrow
- mode: literal
- content: Variant boundaries

#### heading
- mode: literal
- style_ref: h2-section
- content: See what actually varies inside each family before you split or consolidate it.

#### body
- mode: literal
- style_ref: body-1
- content: This view stays family-centered and surfaces only the root-level deltas that actually matter for consolidation.

#### note_title
- mode: literal
- content: Viewport

#### note_body
- mode: literal
- style_ref: body-1
- content: The page calls out that the deltas are calculated from the primary viewport styles for each family instance.

### Collections
#### bullets
- item: canonical
  - body: Every family keeps its canonical preview in view.
- item: varying
  - body: Only varying properties are surfaced first because those drive real consolidation decisions.
- item: hints
  - body: Token hints are attached directly to the candidate values.

## Section: summary.metrics
- pattern_ref: section.audit-summary
- variant_ref: audit-surface
- layout_ref: grid-3

### Collections
#### metrics
- item: families
  - label: Families
  - value: Section and component families
  - note: Included in the delta pass.
- item: sections
  - label: Sections
  - value: Section families
  - note: Count surfaced in the viewer.
- item: components
  - label: Components
  - value: Component families
  - note: Count surfaced in the viewer.

## Section: catalog.primary
- pattern_ref: section.audit-catalog
- variant_ref: audit-surface
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: VARYING PROPERTIES BY FAMILY

#### body
- mode: literal
- style_ref: body-1
- content: Families with the broadest variation are surfaced first in the viewer.

### Collections
#### entries
- item: family-boards
  - title: Family boards
  - body: Each board pairs a canonical preview with the varying property list for that family.
