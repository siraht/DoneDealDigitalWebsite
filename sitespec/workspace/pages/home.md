---
entity: page-instance
id: home
page_type_ref: home-marketing
slug: /
title: Home
---

## Meta
- seo_title: Done Deal Digital | Websites for the Trades
- meta_description: Direct, conversion-focused websites and digital marketing for local service businesses.

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
- brief: Explain that Done Deal Digital builds practical websites and lead systems for trades businesses, with direct language and no agency theater.

#### primary_cta
- mode: literal
- component_ref: button.primary
- variant_ref: button-dark-2
- label: Get a Free Quote
- action_ref: consult-form

#### media
- mode: draft
- brief: Show a credible trades business owner or crew in a work context, paired with a modern site or phone-driven conversion moment.
- alt_brief: Tradesperson in-field with a practical, work-ready setting that signals service credibility.

### Collections
#### proof_points
- item: trade-focus
  - label: Trade-focused builds
  - note: Positioned for owner-led local service businesses.
- item: mobile-first
  - label: Mobile-first conversion
  - note: Designed for call-first visitors on their phones.
- item: straight-talk
  - label: Straight-talk process
  - note: Clear expectations instead of vague agency promises.

## Section: trust.strip
- pattern_ref: section.proof-strip
- layout_ref: grid-4

### Collections
#### proof_items
- item: trust-1
  - label: Built for trades
  - note: Messaging tuned for local service businesses.
- item: trust-2
  - label: Clear process
  - note: Consultation, build, and launch rhythm.
- item: trust-3
  - label: No fluff
  - note: Direct positioning with practical deliverables.
- item: trust-4
  - label: Conversion-minded
  - note: Phone calls and qualified conversations first.

## Section: services.grid
- pattern_ref: section.card-grid
- variant_ref: theme-public-light
- layout_ref: grid-3

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: NO FLUFF. JUST RESULTS.

#### body
- mode: draft
- style_ref: body-1
- brief: Introduce the three service pillars, while keeping web design as the clearest entry offer.

### Collections
#### cards
- item: web-design
  - title: Web Design
  - body: Contractor websites built to look credible fast and convert visitors into calls.
  - href: /web-design
- item: local-seo
  - title: Local SEO
  - body: Google Business Profile and local visibility work for businesses ready to be found more often.
  - href: /local-seo
- item: lead-generation
  - title: Lead Gen
  - body: Paid acquisition for operators with the budget and follow-up process to support it.
  - href: /lead-generation

## Section: process.main
- pattern_ref: section.process-steps
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: THE DONE DEAL PROCESS

#### body
- mode: draft
- style_ref: body-1
- brief: Keep the process short, direct, and easy to scan for a skeptical owner.

### Collections
#### steps
- item: consultation
  - number: 1
  - title: Consultation
  - body: Review the current site, service mix, and lead bottlenecks.
- item: build
  - number: 2
  - title: Build
  - body: Write, structure, and launch a site around clear service offers and better conversion flow.
- item: rollout
  - number: 3
  - title: Rollout
  - body: Push the strongest offer live, track response, and build from real conversations.

## Section: cta.final
- pattern_ref: cta.band
- variant_ref: theme-public-light
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: READY TO GROW?

#### body
- mode: draft
- style_ref: body-1
- brief: Invite the visitor to start with a direct quote request and reinforce that the next step is practical, not high-pressure.

#### primary_cta
- mode: literal
- component_ref: button.primary
- variant_ref: button-dark-2
- label: Get a Free Quote
- action_ref: consult-form

## Section: footer.global
- pattern_ref: global.site-footer
- variant_ref: theme-public-dark
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

#### meta_lines
- item: copyright
  - label: Copyright 2024 Done Deal Digital. All rights reserved.
- item: tagline
  - label: Built for the bold.
