---
entity: page-instance
id: privacy
page_type_ref: legal-compliance
slug: /privacy
title: Privacy
---

## Meta
- seo_title: Legal & Compliance | Done Deal Digital
- meta_description: Combined legal and compliance document with privacy-first ordering for Done Deal Digital.

## Section Manifest
- header.global
- hero.main
- document.legal
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
- content: LEGAL & COMPLIANCE

#### heading
- mode: literal
- style_ref: h1-hero-1
- content: TRANSPARENT TERMS FOR A STRAIGHT-TALK BUSINESS.

#### body
- mode: literal
- style_ref: body-1
- content: Last Updated: October 24, 2024

## Section: document.legal
- pattern_ref: section.legal-document
- layout_ref: sidebar-300-main

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: 1. PRIVACY POLICY

#### updated_label
- mode: literal
- content: Last Updated: October 24, 2024

### Collections
#### nav_items
- item: privacy
  - label: Privacy Policy
  - href: #privacy
- item: tos
  - label: Terms of Service
  - href: #tos
- item: cookies
  - label: Cookie Policy
  - href: #cookies
- item: data
  - label: Data Requests
  - href: #data-requests

#### doc_sections
- item: privacy
  - title: 1. Privacy Policy
  - body: Describes the information collected, the trade-business context, and how the site handles inquiry and usage data.
- item: processors
  - title: Third-Party Processors
  - body: Names Google Analytics, Meta Pixel, and Mailchimp as the observable third-party tools on the page.
- item: terms
  - title: 2. Terms of Service
  - body: Explains website use terms and distinguishes them from project-specific service agreements.
- item: cookies
  - title: 3. Cookie Policy
  - body: States that cookies support analytics, understanding usage, and improving the site experience.
- item: requests
  - title: Data & Access Requests
  - body: Directs legal and access requests to the provided email and mailing address.

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
- The current Astro implementation uses the same combined legal-compliance layout on the privacy, terms, and cookie-policy routes.
