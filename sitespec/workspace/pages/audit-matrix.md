---
entity: page-instance
id: audit-matrix
page_type_ref: audit-method
slug: /audit/matrix
title: Audit Matrix
---

## Meta
- seo_title: Coverage Heatmap | Audit Viewer
- meta_description: Internal coverage heatmap for page-by-family intersections.

## Section Manifest
- shell.header
- hero.main
- catalog.primary
- matrix.sections
- matrix.components

## Section: shell.header
- pattern_ref: section.audit-shell-header
- variant_ref: audit-surface
- layout_ref: shell-topbar

### Slots
#### kicker
- mode: literal
- content: Method 3 of 5

#### heading
- mode: literal
- style_ref: h1-hero-1
- content: Coverage Heatmap

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
- content: Map third

#### heading
- mode: literal
- style_ref: h2-section
- content: See the whole site as page-to-family coverage, then open the live evidence.

#### body
- mode: literal
- style_ref: body-1
- content: Each populated cell opens a live preview dock so coverage questions stay tied to the actual rendered element.

#### note_title
- mode: literal
- content: How to use it

#### note_body
- mode: literal
- style_ref: body-1
- content: Scan one row to see where a family appears, then scan one page column to see what makes that page unique.

### Collections
#### bullets
- item: one-offs
  - body: Best for spotting isolated one-offs and over-repeated families.
- item: rollout
  - body: Best for deciding rollout order across pages.
- item: reuse
  - body: Best for checking whether a proposed component really has site-wide reuse.

## Section: catalog.primary
- pattern_ref: section.audit-catalog
- variant_ref: audit-surface
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: COVERAGE VIEWS

### Collections
#### entries
- item: sections
  - title: Section coverage
  - body: Review page-by-section-family intersections with a preview dock.
- item: components
  - title: Component coverage
  - body: Review page-by-component-family intersections with the same interaction model.

## Section: matrix.sections
- pattern_ref: section.audit-matrix
- variant_ref: audit-surface
- layout_ref: matrix-dock

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: PAGES BY SECTION FAMILIES

#### body
- mode: literal
- style_ref: body-1
- content: Sticky row labels keep family names visible while scanning horizontally across pages.

### Collections
#### columns
- item: index
  - label: index
- item: index-original
  - label: index_original
- item: about
  - label: about
- item: web-design
  - label: web-design
- item: local-seo
  - label: local-seo

#### rows
- item: site-header
  - label: Site Header
  - note: Shared shell across public pages.
- item: hero
  - label: Hero Section
  - note: High-reuse family across marketing routes.
- item: footer
  - label: Site Footer
  - note: Shared footer family across public pages.

## Section: matrix.components
- pattern_ref: section.audit-matrix
- variant_ref: audit-surface
- layout_ref: matrix-dock

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: PAGES BY COMPONENT FAMILIES

#### body
- mode: literal
- style_ref: body-1
- content: Counts above one flag repeated primitives from the same page inside a shared family.

### Collections
#### columns
- item: index
  - label: index
- item: about
  - label: about
- item: contact
  - label: contact
- item: faq
  - label: faq
- item: web-design
  - label: web-design

#### rows
- item: buttons
  - label: CTA Buttons
  - note: Shared action surface across public pages.
- item: cards
  - label: Card Primitives
  - note: Repeated panel treatment across many routes.
- item: nav-links
  - label: Navigation Links
  - note: Shared shell navigation treatment.
