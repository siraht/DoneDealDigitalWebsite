---
entity: section-pattern
id: section.audit-explainer
title: Audit Explainer
---

## Intent
- explain the current viewer mode
- tell the user how to read the surface

## Allowed Variants
- audit-surface

## Layout
- layout_ref: two-column-equal

## Required Slots
### Slot: eyebrow
- type: short_text
- required: true

### Slot: heading
- type: headline
- required: true
- semantic_tag: h2
- allowed_style_refs:
  - h2-section

### Slot: body
- type: body
- required: true
- allowed_style_refs:
  - body-1

### Slot: note_title
- type: short_text
- required: true

### Slot: note_body
- type: body
- required: true
- allowed_style_refs:
  - body-1

## Collections
### Collection: bullets
- min: 1
- max: 5
- item_fields:
  - body

## Behavior
- explanatory_aside: true

## Constraints
- avoid:
  - implementation details without user value

## Acceptance
- required_slots_present
- all_required_collections_present
