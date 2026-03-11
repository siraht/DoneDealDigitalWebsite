---
entity: page-instance
id: terms
page_type_ref: legal-compliance
slug: /terms
title: Terms
---

## Meta
- seo_title: Legal & Compliance | Done Deal Digital
- meta_description: Combined legal and compliance document with terms and service-agreement guidance for Done Deal Digital.

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
- content: 2. TERMS OF SERVICE

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
- item: terms
  - title: 2. Terms of Service
  - body: Covers website use terms and boundaries of liability in the public legal page.
- item: agreements
  - title: Service Agreements
  - body: Notes that actual project timelines and deliverables are defined in separate project blueprints or agreements.
- item: user-license
  - title: User License
  - body: Gives a limited personal, non-commercial viewing permission for the site materials.
- item: limitations
  - title: Limitations
  - body: Explains the liability boundary language visible in the terms block.
- item: requests
  - title: Data & Access Requests
  - body: Keeps the contact route for legal and access requests visible in the same combined document.

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
