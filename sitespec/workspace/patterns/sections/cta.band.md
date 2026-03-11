---
entity: section-pattern
id: cta.band
title: CTA Band
---

## Intent
- close the page with one clear CTA
- reinforce trust without shifting to a new offer

## Allowed Variants
- theme-public-light
- theme-public-dark

## Layout
- layout_ref: stack-mobile

## Required Slots
### Slot: heading
- type: headline
- required: true

### Slot: body
- type: body
- required: true

### Slot: primary_cta
- type: button
- required: true
- component_ref: button.primary

## Collections
### Collection: support_points
- min: 0
- max: 3
- item_fields:
  - label
  - note

## Behavior
- align: center
- full_width: true

## Constraints
- must_include:
  - one clear CTA
- avoid:
  - multiple competing CTAs

## Acceptance
- required_slots_present
- primary_cta_present
