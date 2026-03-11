---
entity: section-pattern
id: section.audit-matrix
title: Audit Matrix
---

## Intent
- show page-to-family coverage in a table
- dock live previews for selected intersections

## Allowed Variants
- audit-surface

## Layout
- layout_ref: matrix-dock

## Required Slots
### Slot: heading
- type: headline
- required: true
- semantic_tag: h2
- allowed_style_refs:
  - h2-section

### Slot: body
- type: body
- required: false
- allowed_style_refs:
  - body-1

## Collections
### Collection: columns
- min: 1
- max: 20
- item_fields:
  - label

### Collection: rows
- min: 1
- max: 20
- item_fields:
  - label
  - note

## Behavior
- interactive_selection: true

## Constraints
- must_include:
  - row dimension
  - column dimension

## Acceptance
- required_slots_present
- all_required_collections_present
