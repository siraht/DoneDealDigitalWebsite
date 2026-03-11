---
entity: section-pattern
id: hero.split-media
title: Hero Split Offer
---

## Intent
- establish authority
- state the offer clearly
- qualify the visitor
- drive primary CTA

## Allowed Variants
- hero-authority-right
- hero-centered-dark

## Layout
- layout_ref: split-60-40

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

### Slot: primary_cta
- type: button
- required: true
- component_ref: button.primary

### Slot: media
- type: image
- required: true

## Collections
### Collection: proof_points
- min: 0
- max: 6
- item_fields:
  - label
  - note

## Behavior
- mobile_stack: true
- media_priority: secondary
- cta_full_width_on_mobile: true

## Constraints
- must_include:
  - audience signal
  - offer clarity
- avoid:
  - vague stock-image briefs

## Acceptance
- required_slots_present
- one_h1_only
- primary_cta_present
- alt_brief_present_for_media
