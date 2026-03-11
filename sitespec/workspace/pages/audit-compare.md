---
entity: page-instance
id: audit-compare
page_type_ref: audit-method
slug: /audit/compare
title: Audit Compare
---

## Meta
- seo_title: Canonical Comparator | Audit Viewer
- meta_description: Internal comparator view for pinned canonical references and ranked variants.

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
- content: Method 2 of 5

#### heading
- mode: literal
- style_ref: h1-hero-1
- content: Canonical Comparator

#### back_link
- mode: literal
- content: All methods

### Collections
#### method_links
- item: audit
  - label: Overview
  - href: /audit
  - status: Live
- item: gallery
  - label: Family Gallery Wall
  - href: /audit/gallery
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
- content: Compare second

#### heading
- mode: literal
- style_ref: h2-section
- content: Pin one reference and make every variant argue its case.

#### body
- mode: literal
- style_ref: body-1
- content: Each board locks a canonical candidate and lines up comparison cases so variant boundaries are easier to judge.

#### note_title
- mode: literal
- content: How to read a board

#### note_body
- mode: literal
- style_ref: body-1
- content: Start with the pinned canonical, then inspect the right-side variants to decide whether they still belong in the same family.

### Collections
#### bullets
- item: props
  - body: Best for naming variant props and deciding what belongs in the base component.
- item: split
  - body: Best for spotting whether a family split is semantic, structural, or cosmetic.
- item: range
  - body: Best for judging how far a family can stretch before it stops being one component.

## Section: catalog.primary
- pattern_ref: section.audit-catalog
- variant_ref: audit-surface
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: SECTION FAMILY COMPARATORS

### Collections
#### entries
- item: section-boards
  - title: Section boards
  - body: Every section family is represented with a pinned canonical and a ranked comparison set.

## Section: catalog.secondary
- pattern_ref: section.audit-catalog
- variant_ref: audit-surface
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: PRIMITIVE FAMILY COMPARATORS

### Collections
#### entries
- item: component-boards
  - title: Component boards
  - body: Lower-level primitives use the same pinned-reference model for family comparison.
