---
entity: section-pattern
id: section.comparison-split
title: Comparison Split
---

## Intent
- clarify fit and expectations
- qualify leads before they convert

## Allowed Variants
- theme-public-light

## Layout
- layout_ref: two-column-equal

## Required Slots
### Slot: heading
- type: headline
- required: true
- semantic_tag: h2
- allowed_style_refs:
  - h2-section

### Slot: left_heading
- type: short_text
- required: true

### Slot: right_heading
- type: short_text
- required: true

## Collections
### Collection: left_items
- min: 1
- max: 8
- item_fields:
  - title

### Collection: right_items
- min: 1
- max: 8
- item_fields:
  - title

## Behavior
- symmetric_panels: true

## Constraints
- must_include:
  - positive fit guidance
  - negative fit guidance

## Acceptance
- required_slots_present
- all_required_collections_present
