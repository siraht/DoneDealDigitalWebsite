---
entity: section-pattern
id: section.content-list
title: Content List
---

## Intent
- explain a concept with a supporting list of details
- handle long-form sections without inventing unique patterns every time

## Allowed Variants
- theme-public-light
- theme-public-dark

## Layout
- layout_ref: stack-mobile

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
### Collection: items
- min: 0
- max: 8
- item_fields:
  - title
  - body

## Behavior
- stacked_sections: true

## Constraints
- avoid:
  - placeholder lorem text

## Acceptance
- required_slots_present
