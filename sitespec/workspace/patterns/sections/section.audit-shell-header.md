---
entity: section-pattern
id: section.audit-shell-header
title: Audit Shell Header
---

## Intent
- orient internal audit users
- expose shared stats and method navigation

## Allowed Variants
- audit-surface

## Layout
- layout_ref: shell-topbar

## Required Slots
### Slot: kicker
- type: short_text
- required: true

### Slot: heading
- type: headline
- required: true
- semantic_tag: h1
- allowed_style_refs:
  - h1-hero-1

### Slot: back_link
- type: short_text
- required: true

## Collections
### Collection: stat_items
- min: 0
- max: 6
- item_fields:
  - label
  - value

### Collection: method_links
- min: 1
- max: 10
- item_fields:
  - label
  - href
  - status

## Behavior
- sticky_topbar: false

## Constraints
- must_include:
  - route back to /audit

## Acceptance
- required_slots_present
- all_required_collections_present
