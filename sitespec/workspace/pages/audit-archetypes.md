---
entity: page-instance
id: audit-archetypes
page_type_ref: audit-method
slug: /audit/archetypes
title: Audit Archetypes
---

## Meta
- seo_title: Style Archetype Atlas | Audit Viewer
- meta_description: Internal view for clustering shared visual primitives across families.

## Section Manifest
- shell.header
- hero.main
- catalog.primary

## Section: shell.header
- pattern_ref: section.audit-shell-header
- variant_ref: audit-surface
- layout_ref: shell-topbar

### Slots
#### kicker
- mode: literal
- content: Method 4 of 5

#### heading
- mode: literal
- style_ref: h1-hero-1
- content: Style Archetype Atlas

#### back_link
- mode: literal
- content: All methods

### Collections
#### method_links
- item: audit
  - label: Overview
  - href: /audit
  - status: Live
- item: deltas
  - label: Family Deltas
  - href: /audit/deltas
  - status: Live
- item: properties
  - label: Property Atlas
  - href: /audit/properties
  - status: Live

## Section: hero.main
- pattern_ref: section.audit-explainer
- variant_ref: audit-surface
- layout_ref: two-column-equal

### Slots
#### eyebrow
- mode: literal
- content: Abstract fourth

#### heading
- mode: literal
- style_ref: h2-section
- content: Look past family names and group what is visually built from the same surface.

#### body
- mode: literal
- style_ref: body-1
- content: This viewer shifts from semantic family names to shared visual treatments such as borders, spacing, fills, and casing.

#### note_title
- mode: literal
- content: How to use it

#### note_body
- mode: literal
- style_ref: body-1
- content: Start with the signature row, then inspect mixed samples to see whether several semantic families are actually one shared primitive.

### Collections
#### bullets
- item: primitives
  - body: Best for discovering shared primitives across different component families.
- item: tokens
  - body: Best for token and utility extraction decisions.
- item: consolidation
  - body: Best for finding when several components are really one visual surface.

## Section: catalog.primary
- pattern_ref: section.audit-catalog
- variant_ref: audit-surface
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: CROSS-FAMILY VISUAL PRIMITIVES

### Collections
#### entries
- item: atlas
  - title: Archetype atlas
  - body: Group instances by shared visual signature, component kind, and section type.
