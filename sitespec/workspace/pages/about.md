---
entity: page-instance
id: about
page_type_ref: company-story
slug: /about
title: About
---

## Meta
- seo_title: About Us | Done Deal Digital
- meta_description: Learn why Done Deal Digital exists, who runs it, and how the team works with trades businesses.

## Section Manifest
- header.global
- hero.main
- values.main
- team.main
- story.why-trades
- values.work-ethic
- partnership.main
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
- content: YOU'RE NOT HIRING A MYSTERY AGENCY.

#### body
- mode: draft
- style_ref: body-1
- brief: Explain that Done Deal Digital is direct, accountable, and built to work like an operator partner rather than a vague outsourced marketing shop.

## Section: values.main
- pattern_ref: section.card-grid
- layout_ref: grid-3

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: WHY WE EXIST

#### body
- mode: draft
- style_ref: body-1
- brief: Frame the company around accountability, clarity, and practical execution for trades businesses.

### Collections
#### cards
- item: accountability
  - title: Total Accountability
  - body: Set clear expectations, own the work, and communicate what is happening.
- item: clarity
  - title: Radical Clarity
  - body: Remove jargon and keep offers, timelines, and next steps understandable.
- item: theater
  - title: No Marketing Theater
  - body: Focus on useful deliverables and believable outcomes instead of inflated agency language.

## Section: team.main
- pattern_ref: section.card-grid
- layout_ref: grid-3

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: THE OPERATORS BEHIND THE SCREENS

#### body
- mode: draft
- style_ref: body-1
- brief: Introduce the working roles behind Done Deal Digital and emphasize hands-on execution.

### Collections
#### cards
- item: strategist
  - title: The Strategist
  - body: Owns offer clarity, lead flow thinking, and the commercial narrative.
- item: architect
  - title: The Architect
  - body: Owns the structure, build quality, and technical implementation path.

## Section: story.why-trades
- pattern_ref: section.content-list
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: WHY THE TRADES?

#### body
- mode: draft
- style_ref: body-1
- brief: Explain the focus on owner-led service businesses, practical operators, and local markets where trust and responsiveness matter.

### Collections
#### items
- item: fit
  - title: Best-fit businesses
  - body: Owner-involved local service businesses that answer the phone and care about lead quality.
- item: anti-hype
  - title: Clearer market fit
  - body: The team is not trying to be a generalist agency for every industry.

## Section: values.work-ethic
- pattern_ref: section.card-grid
- layout_ref: grid-3

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: OUR WORK ETHIC

### Collections
#### cards
- item: direct
  - title: Direct
  - body: Say exactly what is happening, what is included, and what comes next.
- item: practical
  - title: Practical
  - body: Build what helps the client win more calls, not what pads a strategy deck.
- item: follow-through
  - title: Follow Through
  - body: Make commitments that can actually be delivered.

## Section: partnership.main
- pattern_ref: section.content-list
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: THE PARTNERSHIP EXPERIENCE

#### body
- mode: draft
- style_ref: body-1
- brief: Describe the expected communication style, pace, and straight-answer posture of the relationship.

### Collections
#### items
- item: communication
  - title: Clear communication
  - body: Short, useful updates instead of vague status language.
- item: decision-speed
  - title: Fast decision loops
  - body: Keep momentum with direct asks and concrete recommendations.

## Section: cta.final
- pattern_ref: cta.band
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: READY TO WORK WITH PEOPLE WHO FOLLOW THROUGH?

#### body
- mode: draft
- style_ref: body-1
- brief: Invite a direct conversation for owners who want practical help and less agency drama.

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
