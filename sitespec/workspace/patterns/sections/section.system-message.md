---
entity: section-pattern
id: section.system-message
title: System Message
---

## Intent
- communicate a routing error clearly
- give the user a fast recovery path

## Allowed Variants
- system-dark

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
  - technical error jargon

## Acceptance
- required_slots_present
- primary_cta_present
