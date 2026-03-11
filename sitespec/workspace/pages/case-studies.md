---
entity: page-instance
id: case-studies
page_type_ref: proof-library
slug: /case-studies
title: Case Studies
---

## Meta
- seo_title: Case Studies | Done Deal Digital
- meta_description: Proof-forward case study overview for trades businesses evaluating Done Deal Digital.

## Section Manifest
- header.global
- hero.main
- filters.main
- proof.library
- reporting.main
- cta.final
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
- pattern_ref: hero.centered-copy
- variant_ref: hero-centered-dark
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h1-hero-1
- content: PROOF, NOT PROMISES.

#### body
- mode: draft
- style_ref: body-1
- brief: Position the page as a believable proof library grounded in real work, real data, and qualified claims only.

## Section: filters.main
- pattern_ref: section.content-list
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: FILTER TRADES

### Collections
#### items
- item: all-work
  - title: All Work
  - body: Show the full proof library by default.
- item: hvac
  - title: HVAC
  - body: Filter for HVAC examples.
- item: roofing
  - title: Roofing
  - body: Filter for roofing examples.
- item: plumbing
  - title: Plumbing
  - body: Filter for plumbing examples.
- item: electricians
  - title: Electricians
  - body: Filter for electrician examples.
- item: solar
  - title: Solar
  - body: Filter for solar examples.

## Section: proof.library
- pattern_ref: section.card-grid
- layout_ref: grid-3

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: CASE STUDY SNAPSHOTS

#### body
- mode: draft
- style_ref: body-1
- brief: Summarize that each card shows trade, geography, and a proof-led outcome instead of vanity metrics.

### Collections
#### cards
- item: plumbing
  - title: 200% Increase in Calls in 90 Days
  - body: Plumbing case study in Dallas, TX.
  - label: Read the Case Study
- item: hvac
  - title: Dominating Local Search for A/C Repair
  - body: HVAC case study in Phoenix, AZ.
  - label: Read the Case Study
- item: roofing
  - title: From Zero to 50 Organic Leads Per Month
  - body: Roofing case study in Nashville, TN.
  - label: Read the Case Study

## Section: reporting.main
- pattern_ref: section.content-list
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: OUR REPORTING DEPTH

### Collections
#### items
- item: starting-point
  - title: Starting Point
  - body: Capture the baseline metrics before any changes are made.
- item: what-changed
  - title: What We Changed
  - body: Show the strategy and implementation choices that materially affected the outcome.
- item: results
  - title: The Results
  - body: Keep proof tied to calls, tracked inquiries, visibility, and bottom-line impact.

## Section: cta.final
- pattern_ref: cta.band
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: READY TO BE OUR NEXT SUCCESS STORY?

#### body
- mode: draft
- style_ref: body-1
- brief: Invite a conversation with owners who want to review the numbers and see if the fit is real.

#### primary_cta
- mode: literal
- component_ref: button.primary
- variant_ref: button-dark-2
- label: Let's Talk
- action_ref: lets-talk

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
