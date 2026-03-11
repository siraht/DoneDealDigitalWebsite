---
entity: page-instance
id: local-seo
page_type_ref: service-detail
slug: /local-seo
title: Local SEO
---

## Meta
- seo_title: Local SEO Services | Done Deal Digital
- meta_description: Local SEO for trades businesses that need to be easier to find in the markets they serve.

## Section Manifest
- header.global
- hero.main
- fit.split
- content.main
- content.fixes
- values.foundation
- objections.main
- content.compounding
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
- pattern_ref: hero.centered-cta
- variant_ref: hero-centered-dark
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h1-hero-1
- content: GET FOUND BY LOCAL CUSTOMERS WHO NEED YOU.

#### body
- mode: draft
- style_ref: body-1
- brief: Position local SEO as compounding visibility work for trade businesses with solid operations and realistic expectations.

#### primary_cta
- mode: literal
- component_ref: button.primary
- variant_ref: button-dark-2
- label: Get a Free SEO Review
- action_ref: seo-review

## Section: fit.split
- pattern_ref: section.comparison-split
- layout_ref: two-column-equal

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: WHEN LOCAL SEO MAKES SENSE

#### left_heading
- mode: literal
- content: BEST FIT

#### right_heading
- mode: literal
- content: POOR FIT

### Collections
#### left_items
- item: local-market
  - title: Local service businesses with a defined market
- item: response
  - title: Teams that answer the phone and follow up fast
- item: basics
  - title: Operators ready to clean up core local signals

#### right_items
- item: miracle
  - title: Anyone expecting instant ranking guarantees
- item: no-ops
  - title: Businesses that cannot support inbound demand operationally
- item: wrong-market
  - title: Non-local or irrelevant business models

## Section: content.main
- pattern_ref: section.content-list
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: WHAT LOCAL SEO ACTUALLY IS

#### body
- mode: draft
- style_ref: body-1
- brief: Explain local SEO in plain English and separate it from shallow ranking promises.

### Collections
#### items
- item: map-pack
  - title: Local visibility systems
  - body: Build the business's presence where nearby customers are already searching.
- item: foundations
  - title: Technical and content foundations
  - body: Use accurate business data, service pages, and trust signals that match the actual operation.

## Section: content.fixes
- pattern_ref: section.content-list
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: WHAT WE FIX FIRST

### Collections
#### items
- item: business-info
  - title: Business Info
  - body: Clean up core name, address, phone, and category signals.
- item: gbp
  - title: GBP Signals
  - body: Strengthen the Google Business Profile foundation before chasing more complex tactics.
- item: service-pages
  - title: Service Pages
  - body: Give Google and the visitor clearer commercial pages to land on.
- item: reviews
  - title: Review Quality
  - body: Improve proof and trust signals that local customers can actually see.

## Section: values.foundation
- pattern_ref: section.card-grid
- layout_ref: grid-3

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: GBP FOUNDATION

### Collections
#### cards
- item: categories
  - title: Accurate categories
  - body: Make the business easier to classify correctly.
- item: updates
  - title: Updated profile detail
  - body: Keep core profile information complete and current.
- item: trust
  - title: Trust signals
  - body: Reviews and local relevance cues support the whole effort.

## Section: objections.main
- pattern_ref: section.content-list
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: WHAT WE WILL NOT DO

### Collections
#### items
- item: guarantees
  - title: No fake guarantees
  - body: The page rejects guaranteed rankings and miracle claims.
- item: shortcuts
  - title: No shortcut theater
  - body: Avoid meaningless busywork that looks like activity but does not improve local visibility.

## Section: content.compounding
- pattern_ref: section.content-list
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: COMPOUNDING GROWTH

#### body
- mode: draft
- style_ref: body-1
- brief: Reinforce that local SEO is cumulative work rather than an instant switch.

### Collections
#### items
- item: patience
  - title: Local SEO compounds
  - body: Progress builds over time when the basics are corrected and maintained.

## Section: cta.final
- pattern_ref: cta.band
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: READY TO BE EASIER TO FIND?

#### body
- mode: draft
- style_ref: body-1
- brief: Invite a review of the current local presence and the first fixes worth making.

#### primary_cta
- mode: literal
- component_ref: button.primary
- variant_ref: button-dark-2
- label: Get a Free SEO Review
- action_ref: seo-review

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
