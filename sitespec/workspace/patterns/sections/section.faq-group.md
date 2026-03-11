---
entity: section-pattern
id: section.faq-group
title: FAQ Group
---

## Intent
- answer grouped objections or operational questions
- keep answers scannable for busy owners

## Allowed Variants
- theme-public-light

## Layout
- layout_ref: stack-mobile

## Required Slots
### Slot: heading
- type: headline
- required: true
- semantic_tag: h2
- allowed_style_refs:
  - h2-section

## Collections
### Collection: faqs
- min: 1
- max: 8
- item_fields:
  - question
  - answer

## Behavior
- multiple_items_can_open: true

## Constraints
- avoid:
  - vague non-answers

## Acceptance
- required_slots_present
- all_required_collections_present
