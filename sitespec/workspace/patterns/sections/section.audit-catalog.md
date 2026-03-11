---
entity: section-pattern
id: section.audit-catalog
title: Audit Catalog
---

## Intent
- browse family boards, method cards, or other audit collections

## Allowed Variants
- audit-surface

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
### Collection: entries
- min: 1
- max: 12
- item_fields:
  - title
  - body
  - note

## Behavior
- detail_boards_allowed: true

## Constraints
- avoid:
  - empty collections

## Acceptance
- required_slots_present
- all_required_collections_present
