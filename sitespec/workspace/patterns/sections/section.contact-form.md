---
entity: section-pattern
id: section.contact-form
title: Contact Form
---

## Intent
- collect qualified inquiries
- offer direct contact alternatives
- reduce fear of a pushy sales process

## Allowed Variants
- theme-public-light

## Layout
- layout_ref: two-column-equal

## Required Slots
### Slot: heading
- type: headline
- required: true
- semantic_tag: h2
- allowed_style_refs:
  - h2-section

### Slot: body
- type: body
- required: false
- allowed_style_refs:
  - body-1

### Slot: primary_cta
- type: button
- required: false
- component_ref: button.primary

## Collections
### Collection: form_fields
- min: 4
- max: 10
- item_fields:
  - label
  - field_type
  - required

### Collection: quick_actions
- min: 1
- max: 3
- item_fields:
  - label
  - detail
  - action_ref

### Collection: trust_notes
- min: 0
- max: 3
- item_fields:
  - title
  - body

## Behavior
- keyboard_safe_on_mobile: true
- sticky_cta_bar_disabled_when_form_visible: true

## Constraints
- must_include:
  - direct phone option
  - expected response time

## Acceptance
- required_slots_present
- all_required_collections_present
