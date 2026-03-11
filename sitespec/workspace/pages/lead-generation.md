---
entity: page-instance
id: lead-generation
page_type_ref: service-detail
slug: /lead-generation
title: Lead Generation
---

## Meta
- seo_title: Lead Generation | Done Deal Digital
- meta_description: Paid ads and lead generation management for local service businesses that are ready to support it.

## Section Manifest
- header.global
- hero.main
- fit.split
- content.problem
- services.grid
- content.measurement
- content.budget
- objections.main
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
- content: PAID ADS BUILT TO BRING IN REAL CALLS.

#### body
- mode: draft
- style_ref: body-1
- brief: Position paid acquisition as a fit-dependent service for operators with budget, responsiveness, and operational readiness.

#### primary_cta
- mode: literal
- component_ref: button.primary
- variant_ref: button-dark-2
- label: Get a Free Ad Review
- action_ref: ad-review

## Section: fit.split
- pattern_ref: section.comparison-split
- layout_ref: two-column-equal

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: WHEN PAID ADS MAKE SENSE

#### left_heading
- mode: literal
- content: BEST FIT

#### right_heading
- mode: literal
- content: POOR FIT

### Collections
#### left_items
- item: budget
  - title: Businesses with real ad budget
- item: response
  - title: Teams that answer and follow up fast
- item: reviews
  - title: Operators with enough trust signals to convert paid traffic

#### right_items
- item: tiny-budget
  - title: Businesses expecting miracles on tiny budgets
- item: slow-response
  - title: Teams that cannot answer the phone consistently
- item: weak-ops
  - title: Businesses not operationally ready to support ad spend

## Section: content.problem
- pattern_ref: section.content-list
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: THE PROBLEM WITH MOST ADVERTISING

### Collections
#### items
- item: boosted
  - title: Boosted Posts
  - body: Activity that looks busy but does not behave like serious lead generation.
- item: landing-pages
  - title: Lazy Landing Pages
  - body: Paid traffic without a credible conversion path is wasted quickly.
- item: tracking
  - title: Zero Tracking
  - body: If the calls and forms are not traceable, the spend cannot be judged honestly.

## Section: services.grid
- pattern_ref: section.card-grid
- layout_ref: grid-3

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: WHAT WE MANAGE

### Collections
#### cards
- item: ads
  - title: Search and Local Service Ads
  - body: Manage the channels most likely to produce qualified local demand.
- item: landing-pages
  - title: Landing Page Alignment
  - body: Match the click to a page built to convert, not just absorb traffic.
- item: attribution
  - title: Call and Form Tracking
  - body: Keep real attribution visible so decisions are tied to leads, not guesses.

## Section: content.measurement
- pattern_ref: section.content-list
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: HOW WE MEASURE SUCCESS

### Collections
#### items
- item: calls
  - title: Real calls
  - body: Prioritize qualified phone calls and usable form inquiries.
- item: cost
  - title: Cost by lead quality
  - body: Frame spend against whether the business can actually use the inbound demand.

## Section: content.budget
- pattern_ref: section.content-list
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: BUDGET & EXPECTATIONS

#### body
- mode: draft
- style_ref: body-1
- brief: Set direct expectations around the spend, responsiveness, and proof discipline needed for ads to make sense.

### Collections
#### items
- item: budget-realism
  - title: Budget realism
  - body: Paid acquisition needs enough spend to generate signal, not just wishful thinking.
- item: fit
  - title: Operational fit
  - body: The service only works when the business can answer, quote, and close efficiently.

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
- item: junk-leads
  - title: No junk-lead promises
  - body: The page avoids volume-first positioning and stresses qualified demand.
- item: vanity
  - title: No vanity-metric reporting
  - body: Clicks and impressions alone are not treated as success.

## Section: cta.final
- pattern_ref: cta.band
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: READY TO SEE IF PAID ADS MAKE SENSE?

#### body
- mode: draft
- style_ref: body-1
- brief: Invite a fit check around budget, readiness, and whether paid acquisition is the right next move.

#### primary_cta
- mode: literal
- component_ref: button.primary
- variant_ref: button-dark-2
- label: Get a Free Ad Review
- action_ref: ad-review

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
