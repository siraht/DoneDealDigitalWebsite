---
entity: section-pattern
id: section.media-callout
title: Media Callout
---

## Intent
- pair a strong claim with supporting media or screenshot proof
- break up long pages with visual evidence

## Allowed Variants
- theme-public-light

## Layout
- layout_ref: split-60-40

## Required Slots
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

### Slot: media
- type: image
- required: true

## Collections
### Collection: points
- min: 0
- max: 6
- item_fields:
  - title
  - body

## Behavior
- media_supports_claim: true

## Constraints
- must_include:
  - alt_brief for media

## Acceptance
- required_slots_present
- alt_brief_present_for_media
