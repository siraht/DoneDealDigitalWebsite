---
entity: section-pattern
id: section.audit-queue
title: Audit Queue
---

## Intent
- prioritize cleanup decisions with rationale and examples

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
### Collection: groups
- min: 1
- max: 12
- item_fields:
  - title
  - body
  - note

## Behavior
- ranked_groups: true

## Constraints
- must_include:
  - prioritization cue

## Acceptance
- required_slots_present
- all_required_collections_present
