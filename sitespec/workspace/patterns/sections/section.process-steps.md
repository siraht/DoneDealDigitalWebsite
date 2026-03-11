---
entity: section-pattern
id: section.process-steps
title: Process Steps
---

## Intent
- explain the implementation path
- reduce uncertainty about what happens next

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
### Collection: steps
- min: 2
- max: 6
- item_fields:
  - title
  - body
  - number

## Behavior
- ordered_steps: true

## Constraints
- must_include:
  - chronological progression

## Acceptance
- required_slots_present
- all_required_collections_present
