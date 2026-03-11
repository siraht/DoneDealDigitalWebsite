---
entity: section-pattern
id: section.legal-document
title: Legal Document
---

## Intent
- present compliance content accessibly
- support anchor navigation for long legal pages

## Allowed Variants
- theme-public-light

## Layout
- layout_ref: sidebar-300-main

## Required Slots
### Slot: heading
- type: headline
- required: true
- semantic_tag: h2
- allowed_style_refs:
  - h2-section

### Slot: updated_label
- type: short_text
- required: false

## Collections
### Collection: nav_items
- min: 1
- max: 8
- item_fields:
  - label
  - href

### Collection: doc_sections
- min: 1
- max: 10
- item_fields:
  - title
  - body

## Behavior
- sticky_sidebar: true

## Constraints
- must_include:
  - legally distinct sections

## Acceptance
- required_slots_present
- all_required_collections_present
