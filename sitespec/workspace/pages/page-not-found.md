---
entity: page-instance
id: page-not-found
page_type_ref: system-message
slug: /404
title: 404
---

## Meta
- seo_title: Page Not Found | Done Deal Digital
- meta_description: Recovery page for invalid routes.

## Section Manifest
- system.main

## Section: system.main
- pattern_ref: section.system-message
- variant_ref: system-dark
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h1-hero-1
- content: 404

#### body
- mode: literal
- style_ref: body-1
- content: The page you are looking for does not exist.

#### primary_cta
- mode: literal
- component_ref: button.primary
- variant_ref: button-dark-2
- label: Back to Home
- action_ref: back-home
