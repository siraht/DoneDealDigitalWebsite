---
entity: page-instance
id: web-design
page_type_ref: service-detail
slug: /web-design
title: Web Design
---

## Meta
- seo_title: Web Design Services | Done Deal Digital
- meta_description: Contractor websites built to convert visits into calls for local service businesses.

## Section Manifest
- header.global
- hero.main
- fit.split
- pain.grid
- content.deliverables
- process.main
- feature.callout
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
- content: WEB DESIGN SERVICES

#### heading
- mode: literal
- style_ref: h1-hero-1
- content: WE BUILD CONTRACTOR WEBSITES THAT TURN VISITS INTO CALLS.

#### body
- mode: draft
- style_ref: body-1
- brief: Position web design as the clearest entry offer, focused on speed, credibility, and phone-first conversion.

#### primary_cta
- mode: literal
- component_ref: button.primary
- variant_ref: button-dark-2
- label: Get a Free Quote
- action_ref: consult-form

#### secondary_cta
- mode: literal
- component_ref: button.primary
- variant_ref: button-light-outline
- label: Call Us Directly
- action_ref: call-now

#### media
- mode: draft
- brief: Show a contractor website mockup or device presentation that makes the service feel tangible and mobile-first.
- alt_brief: Contractor website shown on a device with a practical, industrial visual tone.

### Collections
#### proof_points
- item: mobile-first
  - label: Mobile-first
  - note: The page explicitly positions mobile usability as critical.
- item: copy-guidance
  - label: Copy guidance
  - note: Messaging support is part of the service pitch.
- item: launch-window
  - label: 2 to 3 week launch
  - note: The observed page uses a fast launch cue.

## Section: fit.split
- pattern_ref: section.comparison-split
- layout_ref: two-column-equal

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: WHEN WEB DESIGN IS THE RIGHT MOVE

#### left_heading
- mode: literal
- content: BEST FIT

#### right_heading
- mode: literal
- content: NOT THE RIGHT FIT

### Collections
#### left_items
- item: trade-owners
  - title: Plumbers, roofers, and electricians
- item: outdated-site
  - title: Businesses with an outdated website
- item: call-focus
  - title: Owners who want more phone calls
- item: growth-ready
  - title: Service pros ready to scale staff

#### right_items
- item: ecommerce
  - title: Ecommerce stores and dropshipping
- item: saas
  - title: National SaaS or tech startups
- item: blogger
  - title: Personal lifestyle bloggers
- item: bargain
  - title: Companies shopping for the cheapest possible option

## Section: pain.grid
- pattern_ref: section.card-grid
- layout_ref: grid-4

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: A WEAK SITE COSTS MORE THAN YOU THINK.

### Collections
#### cards
- item: trust
  - title: Lost Trust
  - body: An outdated site makes customers question the quality of the underlying business.
- item: patience
  - title: Lost Patience
  - body: Slow or confusing pages lose prospects before they even find the phone number.
- item: rankings
  - title: Lost Rankings
  - body: Weak mobile performance and structure make visibility harder.
- item: revenue
  - title: Lost Revenue
  - body: Every bounce becomes a lead for the next contractor in the market.

## Section: content.deliverables
- pattern_ref: section.content-list
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: THE DELIVERABLES

#### body
- mode: draft
- style_ref: body-1
- brief: Summarize the website deliverables around messaging clarity, mobile conversion, and practical build quality.

### Collections
#### items
- item: clarity
  - title: Clear service positioning
  - body: Each core service should be easy to understand in a fast skim.
- item: trust
  - title: Trust-building structure
  - body: Use reviews, proof, and credibility cues where they help the visitor move.
- item: conversion
  - title: Phone-first conversion path
  - body: Make the next action obvious and easy on mobile.

## Section: process.main
- pattern_ref: section.process-steps
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: THE 5-STEP BLUEPRINT

#### body
- mode: draft
- style_ref: body-1
- brief: Explain the page's implementation blueprint in practical, operator-friendly language.

### Collections
#### steps
- item: audit
  - number: 1
  - title: Audit
  - body: Review the current site, offer, and local competitors.
- item: structure
  - number: 2
  - title: Structure
  - body: Organize the site around services, trust, and conversion flow.
- item: write
  - number: 3
  - title: Write
  - body: Tighten copy so it sounds direct and commercially useful.
- item: build
  - number: 4
  - title: Build
  - body: Implement the design, responsiveness, and CTA path.
- item: launch
  - number: 5
  - title: Launch
  - body: Publish and monitor how visitors actually respond.

## Section: feature.callout
- pattern_ref: section.media-callout
- layout_ref: split-60-40

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: RESULTS DON'T COME FROM TEMPLATES.

#### body
- mode: draft
- style_ref: body-1
- brief: Reinforce that useful websites are built around the business, offer, and local customer behavior rather than generic templates.

#### media
- mode: draft
- brief: Show a clean service-site mockup on device to support the claim about useful, custom implementation.
- alt_brief: Service-business website mockup on mobile or tablet with an industrial visual treatment.

### Collections
#### points
- item: custom
  - title: Fit before polish
  - body: The site needs to match the business and market, not a template marketplace demo.

## Section: cta.final
- pattern_ref: cta.band
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: READY FOR A SITE THAT EARNS ITS KEEP?

#### body
- mode: draft
- style_ref: body-1
- brief: Invite the prospect to start with a practical quote request rather than a vague discovery process.

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
