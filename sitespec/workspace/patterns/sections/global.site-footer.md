---
entity: section-pattern
id: global.site-footer
title: Global Site Footer
---

## Intent
- restate the brand
- provide site-wide navigation clusters
- link legal and company pages

## Allowed Variants
- theme-public-dark

## Layout
- layout_ref: grid-4

## Required Slots
### Slot: brand_heading
- type: short_text
- required: true

### Slot: brand_body
- type: body
- required: true
- allowed_style_refs:
  - body-1

## Collections
### Collection: service_links
- min: 1
- max: 4
- item_fields:
  - label
  - href

### Collection: company_links
- min: 1
- max: 4
- item_fields:
  - label
  - href

### Collection: legal_links
- min: 1
- max: 4
- item_fields:
  - label
  - href

### Collection: meta_lines
- min: 0
- max: 2
- item_fields:
  - label

## Behavior
- stacked_bottom_bar: true

## Constraints
- must_include:
  - legal links
  - company links

## Acceptance
- required_slots_present
- all_required_collections_present
