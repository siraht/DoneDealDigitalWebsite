---
entity: page-instance
id: thank-you
page_type_ref: thank-you-confirmation
slug: /thank-you
title: Thank You
---

## Meta
- seo_title: Thank You | Done Deal Digital
- meta_description: Post-submit confirmation page for Done Deal Digital inquiries.

## Section Manifest
- header.global
- hero.main
- steps.next
- footer.global

## Section: header.global
- pattern_ref: global.site-header
- layout_ref: shell-topbar

### Slots
#### brand
- mode: literal
- content: DONE DEAL DIGITAL

#### primary_cta
- mode: literal
- component_ref: button.primary
- variant_ref: button-dark-2
- label: Get a Free Quote
- action_ref: consult-form

### Collections
#### nav_links
- item: services
  - label: Services
  - href: /#services
- item: about
  - label: About
  - href: /about
- item: contact
  - label: Contact
  - href: /contact

## Section: hero.main
- pattern_ref: hero.centered-cta
- variant_ref: hero-centered-dark
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h1-hero-1
- content: WE GOT IT. HERE'S WHAT HAPPENS NEXT.

#### body
- mode: draft
- style_ref: body-1
- brief: Confirm the form was submitted successfully and explain that the team will respond within one business day, usually sooner.

#### primary_cta
- mode: literal
- component_ref: button.primary
- variant_ref: button-dark-2
- label: Call Us Directly
- action_ref: call-now

## Section: steps.next
- pattern_ref: section.card-grid
- layout_ref: grid-3

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: WHAT HAPPENS NEXT

### Collections
#### cards
- item: review
  - title: Review
  - body: Review the current site, market, and growth goals.
- item: discovery
  - title: Discovery Call
  - body: Hold a short fit-check call to understand the business and opportunity.
- item: action-plan
  - title: Action Plan
  - body: Return with a direct quote and a clear roadmap for the next move.

## Section: footer.global
- pattern_ref: global.site-footer
- layout_ref: grid-4

### Slots
#### brand_heading
- mode: literal
- content: DONE DEAL DIGITAL

#### brand_body
- mode: literal
- style_ref: body-1
- content: The digital partner for trades businesses that want clear execution, practical growth, and fewer empty promises.

### Collections
#### service_links
- item: web
  - label: Web Design
  - href: /web-design
- item: seo
  - label: Local SEO
  - href: /local-seo
- item: ads
  - label: Lead Generation
  - href: /lead-generation

#### company_links
- item: about
  - label: About
  - href: /about
- item: faq
  - label: FAQ
  - href: /faq
- item: contact
  - label: Contact
  - href: /contact

#### legal_links
- item: privacy
  - label: Privacy Policy
  - href: /privacy
- item: terms
  - label: Terms of Service
  - href: /terms
- item: cookies
  - label: Cookie Policy
  - href: /cookie-policy
