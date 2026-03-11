---
entity: section-pattern
id: global.site-header
title: Global Site Header
---

## Intent
- orient the visitor
- route to the core public pages
- expose a persistent high-intent CTA

## Allowed Variants
- theme-public-light

## Layout
- layout_ref: shell-topbar

## Required Slots
### Slot: brand
- type: short_text
- required: true

### Slot: primary_cta
- type: button
- required: true
- component_ref: button.primary

## Collections
### Collection: nav_links
- min: 2
- max: 6
- item_fields:
  - label
  - href

## Behavior
- sticky_header: true

## Constraints
- must_include:
  - home link
  - primary CTA
- avoid:
  - more than one primary CTA in the header

## Acceptance
- required_slots_present
- nav_links_present
- primary_cta_present
