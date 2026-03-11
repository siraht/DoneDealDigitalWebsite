---
entity: section-pattern
id: hero.centered-copy
title: Hero Centered Copy
---

## Intent
- frame the page quickly
- state the page topic in a direct, high-contrast way

## Allowed Variants
- hero-centered-dark

## Layout
- layout_ref: stack-mobile

## Required Slots
### Slot: eyebrow
- type: short_text
- required: false
- allowed_style_refs:
  - subheading-1

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

## Collections

## Behavior
- centered_content: true

## Constraints
- avoid:
  - multiple competing CTAs

## Acceptance
- required_slots_present
- one_h1_only
