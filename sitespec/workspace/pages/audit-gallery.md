---
entity: page-instance
id: audit-gallery
page_type_ref: audit-method
slug: /audit/gallery
title: Audit Gallery
---

## Meta
- seo_title: Family Gallery Wall | Audit Viewer
- meta_description: Internal gallery wall for scanning mapped families as live previews.

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
- content: Method 1 of 5

#### heading
- mode: literal
- style_ref: h1-hero-1
- content: Family Gallery Wall

#### back_link
- mode: literal
- content: All methods

### Collections
#### stat_items
- item: mapped
  - label: Scope
  - value: Section and component families

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
- content: Scan first

#### heading
- mode: literal
- style_ref: h2-section
- content: Group every family into a wall of focused live previews.

#### body
- mode: literal
- style_ref: body-1
- content: This viewer helps answer whether several mapped elements really belong to the same family before digging into finer deltas.

#### note_title
- mode: literal
- content: How to use it

#### note_body
- mode: literal
- style_ref: body-1
- content: Start with the canonical preview, then scan the variants to decide whether the family should stay unified or split.

### Collections
#### bullets
- item: scan
  - body: Best for broad scanning across all families.
- item: drift
  - body: Best for spotting visual drift before comparing exact properties.
- item: split
  - body: Best for deciding whether a family should stay unified or split.

## Section: catalog.primary
- pattern_ref: section.audit-catalog
- variant_ref: audit-surface
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: LIVE FAMILY PREVIEW WALLS

### Collections
#### entries
- item: sections
  - title: Shared sections as live strips
  - body: Preview mapped section families with canonical candidates and representative variants.
- item: components
  - title: Repeated primitives as live tiles
  - body: Preview lower-level primitives across the project.
