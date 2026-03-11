---
entity: section-pattern
id: section.card-grid
title: Card Grid
---

## Intent
- present grouped offerings, values, case studies, or next steps
- keep scanning easy on mobile

## Allowed Variants
- theme-public-light
- theme-public-dark

## Layout
- layout_ref: grid-3

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
### Collection: cards
- min: 1
- max: 8
- item_fields:
  - title
  - body
  - label
  - href
  - alt_brief

## Behavior
- card_surface_repeat: true

## Constraints
- must_include:
  - a useful headline
- avoid:
  - purely decorative cards

## Acceptance
- required_slots_present
- all_required_collections_present
