---
entity: page-instance
id: faq
page_type_ref: faq-resource
slug: /faq
title: FAQ
---

## Meta
- seo_title: FAQ | Straight Answers | Done Deal Digital
- meta_description: Straight answers for busy owners evaluating Done Deal Digital.

## Section Manifest
- header.global
- hero.main
- faq.getting-started
- faq.pricing-scope
- faq.working-with-us
- faq.seo-ads
- faq.technical
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
#### eyebrow
- mode: literal
- style_ref: subheading-1
- content: FAQ / HELP CENTER

#### heading
- mode: literal
- style_ref: h1-hero-1
- content: STRAIGHT ANSWERS FOR BUSY OWNERS.

#### body
- mode: draft
- style_ref: body-1
- brief: Invite owners to skim the major questions and promise a direct answer if they still need help.

## Section: faq.getting-started
- pattern_ref: section.faq-group
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: GETTING STARTED

### Collections
#### faqs
- item: timeline
  - question: How long does a typical build take?
  - answer: Most custom trade sites launch within two to three weeks once the necessary content is in hand.
- item: inputs
  - question: What do I need to provide?
  - answer: The client provides business context and real photos where possible, while the team handles structure, copy direction, and implementation.

## Section: faq.pricing-scope
- pattern_ref: section.faq-group
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: PRICING & SCOPE

### Collections
#### faqs
- item: ownership
  - question: Do I own my website and assets?
  - answer: The implemented FAQ states that the client owns the site and related assets instead of being locked in.
- item: contract
  - question: Is there a long-term contract?
  - answer: The page frames ongoing work as earned month to month rather than forced through long lock-ins.

## Section: faq.working-with-us
- pattern_ref: section.faq-group
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: WORKING WITH US

### Collections
#### faqs
- item: communication
  - question: How do we communicate?
  - answer: Email, phone, and text are positioned as the core working channels so field operators can respond quickly.

## Section: faq.seo-ads
- pattern_ref: section.faq-group
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: SEO & ADS

### Collections
#### faqs
- item: guarantees
  - question: Can you guarantee a #1 ranking on Google?
  - answer: No. The page explicitly rejects guaranteed rankings and frames the work around effective, ethical local SEO.
- item: lead-timing
  - question: How soon will I see more leads?
  - answer: Paid ads can move quickly, while SEO is framed as a slower compounding channel.

## Section: faq.technical
- pattern_ref: section.faq-group
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: TECHNICAL

### Collections
#### faqs
- item: mobile
  - question: Will my site work on mobile?
  - answer: Yes. Mobile-first usage is positioned as critical because many trades searches happen on phones.

## Section: cta.final
- pattern_ref: cta.band
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: STILL HAVE QUESTIONS? LET'S TALK.

#### body
- mode: draft
- style_ref: body-1
- brief: Offer a direct follow-up path for anyone who would rather ask a human than keep guessing.

#### primary_cta
- mode: literal
- component_ref: button.primary
- variant_ref: button-dark-2
- label: Contact Us
- action_ref: contact-us


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
