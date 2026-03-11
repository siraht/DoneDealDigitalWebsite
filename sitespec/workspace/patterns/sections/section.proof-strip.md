---
entity: section-pattern
id: section.proof-strip
title: Proof Strip
---

## Intent
- add fast social proof
- reassure skeptical visitors without slowing the scroll

## Allowed Variants
- theme-public-light

## Layout
- layout_ref: grid-4

## Required Slots

## Collections
### Collection: proof_items
- min: 3
- max: 6
- item_fields:
  - label
  - note

## Behavior
- compact_band: true

## Constraints
- avoid:
  - long paragraphs

## Acceptance
- all_required_collections_present
