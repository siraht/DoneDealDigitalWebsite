---
entity: page-instance
id: audit-properties
page_type_ref: audit-method
slug: /audit/properties
title: Audit Properties
---

## Meta
- seo_title: Property Atlas | Audit Viewer
- meta_description: Internal property-level atlas for repeated, drifting, and token-mapped values.

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
- content: Property system

#### heading
- mode: literal
- style_ref: h1-hero-1
- content: Property Atlas

#### back_link
- mode: literal
- content: All methods

### Collections
#### method_links
- item: audit
  - label: Overview
  - href: /audit
  - status: Live
- item: tokens
  - label: Token Coverage
  - href: /audit/tokens
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
- content: Property-first consolidation

#### heading
- mode: literal
- style_ref: h2-section
- content: See which values repeat, drift, and already map to tokens.

#### body
- mode: literal
- style_ref: body-1
- content: The atlas keeps the raw tracking exhaustive while surfacing the most design-relevant properties in the browser.

#### note_title
- mode: literal
- content: Decision viewport

#### note_body
- mode: literal
- style_ref: body-1
- content: The atlas is centered on the primary decision viewport used in the current consolidation pass.

### Collections
#### bullets
- item: groups
  - body: Groups properties by semantic lane rather than alphabetical CSS noise.
- item: matches
  - body: Shows the strongest value clusters and token matches together.
- item: examples
  - body: Keeps every property discussion attached to real audited elements.

## Section: summary.metrics
- pattern_ref: section.audit-summary
- variant_ref: audit-surface
- layout_ref: grid-3

### Collections
#### metrics
- item: tracked
  - label: Tracked
  - value: Computed properties
  - note: Retained in the audit capture.
- item: surfaced
  - label: Surfaced
  - value: Actionable properties
  - note: Elevated into the browser view.
- item: groups
  - label: Groups
  - value: Semantic lanes
  - note: Used to organize the atlas.

## Section: catalog.primary
- pattern_ref: section.audit-catalog
- variant_ref: audit-surface
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: ACTIONABLE PROPERTIES BY SEMANTIC GROUP

### Collections
#### entries
- item: atlas-lanes
  - title: Atlas lanes
  - body: Each lane shows the most variant-heavy or high-usage properties first, with example previews attached.
