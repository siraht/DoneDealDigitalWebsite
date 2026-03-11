---
entity: page-instance
id: index-original
page_type_ref: home-marketing
slug: /index_original
title: Home Original
---

## Meta
- seo_title: Done Deal Digital | Websites for the Trades
- meta_description: Original stitched homepage route retained as a conversion precedent.

## Section Manifest
- header.global
- hero.main
- trust.strip
- services.grid
- process.main
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
- pattern_ref: hero.split-media
- variant_ref: hero-authority-right
- layout_ref: split-60-40

### Slots
#### eyebrow
- mode: literal
- style_ref: subheading-1
- content: WE BUILD

#### heading
- mode: literal
- style_ref: h1-hero-1
- content: WE BUILD WEBSITES THAT WORK AS HARD AS YOU DO.

#### body
- mode: draft
- style_ref: body-1
- brief: Preserve the stitched precedent of the core home offer before tokenized consolidation.

#### primary_cta
- mode: literal
- component_ref: button.primary
- variant_ref: button-dark-2
- label: Get a Free Quote
- action_ref: consult-form

#### media
- mode: draft
- brief: Original stitched hero media showing contractor credibility and a practical digital touchpoint.
- alt_brief: Precedent hero image showing a trade-friendly credibility scene.

### Collections
#### proof_points
- item: trust-1
  - label: Direct positioning
  - note: No generic agency abstraction.
- item: trust-2
  - label: Service clarity
  - note: Web design, local SEO, and lead gen are introduced fast.

## Section: trust.strip
- pattern_ref: section.proof-strip
- layout_ref: grid-4

### Collections
#### proof_items
- item: process
  - label: Proven home precedent
  - note: Used as the stitched source route for the audit workbench.
- item: clarity
  - label: Clear service ladder
  - note: Web design first, then SEO and lead generation.
- item: offers
  - label: Conversion-first
  - note: Strong CTA path from the first screen.

## Section: services.grid
- pattern_ref: section.card-grid
- layout_ref: grid-3

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: NO FLUFF. JUST RESULTS.

### Collections
#### cards
- item: web-design
  - title: Web Design
  - body: The clearest offer and strongest entry point.
  - href: /web-design
- item: local-seo
  - title: Local SEO
  - body: Visibility systems for map-pack and local discovery.
  - href: /local-seo
- item: lead-generation
  - title: Lead Generation
  - body: Paid acquisition for businesses operationally ready to support it.
  - href: /lead-generation

## Section: process.main
- pattern_ref: section.process-steps
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: THE DONE DEAL PROCESS

### Collections
#### steps
- item: consultation
  - number: 1
  - title: Consultation
  - body: Understand the business and the current state.
- item: structured-build
  - number: 2
  - title: Structured Build
  - body: Turn the strongest offer into a conversion-ready site.
- item: rollout
  - number: 3
  - title: Rollout
  - body: Launch the strongest version and iterate from real leads.

## Section: cta.final
- pattern_ref: cta.band
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: READY TO SCALE YOUR CREW?

#### body
- mode: draft
- style_ref: body-1
- brief: Keep the stitched route focused on practical growth language and a direct quote request.

#### primary_cta
- mode: literal
- component_ref: button.primary
- variant_ref: button-dark-2
- label: Get a Free Quote
- action_ref: consult-form

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

## Notes
- This route exists as a retained stitched reference and is intentionally modeled separately from the tokenized home route.
