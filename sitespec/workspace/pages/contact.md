---
entity: page-instance
id: contact
page_type_ref: contact-conversion
slug: /contact
title: Contact
---

## Meta
- seo_title: Contact Done Deal Digital | Get A Quote
- meta_description: Contact Done Deal Digital for a practical website, SEO, or paid ads conversation.

## Section Manifest
- header.global
- hero.main
- form.contact
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
- content: TELL US WHAT YOU NEED.

#### body
- mode: draft
- style_ref: body-1
- brief: Reassure the visitor that the reply will be prompt and practical, with no pushy sales routine.

## Section: form.contact
- pattern_ref: section.contact-form
- layout_ref: two-column-equal

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: QUICK CONTACT

#### body
- mode: literal
- style_ref: body-1
- content: Share the basics and Done Deal Digital will reply within one business day. Direct options are available for urgent questions.

#### primary_cta
- mode: literal
- component_ref: button.primary
- variant_ref: button-dark-2
- label: Get My Quote
- action_ref: consult-form

### Collections
#### form_fields
- item: full-name
  - label: Full Name
  - field_type: text
  - required: true
- item: business-name
  - label: Business Name
  - field_type: text
  - required: true
- item: phone
  - label: Phone Number
  - field_type: tel
  - required: true
- item: email
  - label: Email Address
  - field_type: email
  - required: true
- item: website
  - label: Website URL
  - field_type: url
  - required: false
- item: service-area
  - label: City / Service Area
  - field_type: text
  - required: true
- item: need
  - label: What do you need?
  - field_type: select
  - required: true
- item: notes
  - label: Anything Else?
  - field_type: textarea
  - required: false

#### quick_actions
- item: phone
  - label: Call Us Directly
  - detail: (555) 123-4567
  - action_ref: call-now
- item: email
  - label: Email Our Team
  - detail: hello@donedealdigital.com
  - action_ref: email-team

#### trust_notes
- item: response
  - title: Response Time
  - body: Expect a reply within one business day, usually sooner.
- item: no-sales-games
  - title: No Sales Games
  - body: The contact experience is framed as fit-checking help, not a high-pressure sales funnel.

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
