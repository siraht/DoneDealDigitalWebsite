---
entity: section-pattern
id: hero.centered-cta
title: Hero Centered CTA
---

## Intent
- frame the page quickly
- state the message
- provide one direct action without requiring media

## Allowed Variants
- hero-centered-dark

## Layout
- layout_ref: stack-mobile

## Required Slots
### Slot: heading
- type: headline
- required: true
- semantic_tag: h1
- allowed_style_refs:
  - h1-hero-1

### Slot: body
- type: body
- required: true
- allowed_style_refs:
  - body-1

### Slot: primary_cta
- type: button
- required: true
- component_ref: button.primary

## Collections

## Behavior
- centered_content: true

## Constraints
- avoid:
  - multiple competing CTAs

## Acceptance
- required_slots_present
- one_h1_only
- primary_cta_present
