---
entity: section-pattern
id: section.audit-summary
title: Audit Summary
---

## Intent
- show condensed key metrics before a deeper browser section

## Allowed Variants
- audit-surface

## Layout
- layout_ref: grid-3

## Required Slots

## Collections
### Collection: metrics
- min: 1
- max: 6
- item_fields:
  - label
  - value
  - note

## Behavior
- compact_cards: true

## Constraints
- avoid:
  - duplicate metric cards

## Acceptance
- all_required_collections_present
