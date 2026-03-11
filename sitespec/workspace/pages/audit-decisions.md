---
entity: page-instance
id: audit-decisions
page_type_ref: audit-method
slug: /audit/decisions
title: Audit Decisions
---

## Meta
- seo_title: Decision Queue | Audit Viewer
- meta_description: Internal decision-queue view for turning the audit into prioritized token and variable work.

## Section Manifest
- shell.header
- hero.main
- summary.metrics
- catalog.primary
- queue.main

## Section: shell.header
- pattern_ref: section.audit-shell-header
- variant_ref: audit-surface
- layout_ref: shell-topbar

### Slots
#### kicker
- mode: literal
- content: Decision-first queue

#### heading
- mode: literal
- style_ref: h1-hero-1
- content: Decision Queue

#### back_link
- mode: literal
- content: All methods

### Collections
#### method_links
- item: audit
  - label: Overview
  - href: /audit
  - status: Live
- item: properties
  - label: Property Atlas
  - href: /audit/properties
  - status: Live
- item: tokens
  - label: Token Coverage
  - href: /audit/tokens
  - status: Live

## Section: hero.main
- pattern_ref: section.audit-explainer
- variant_ref: audit-surface
- layout_ref: two-column-equal

### Slots
#### eyebrow
- mode: literal
- content: Action queue

#### heading
- mode: literal
- style_ref: h2-section
- content: Turn the audit into an ordered list of token and variable decisions.

#### body
- mode: literal
- style_ref: body-1
- content: This view ranks reusable values first, keeps token hints attached, and points back to the exact elements affected by a decision.

#### note_title
- mode: literal
- content: Reading order

#### note_body
- mode: literal
- style_ref: body-1
- content: Start with adoption candidates, then near-token cleanup, then new shared tokens that need a naming decision.

### Collections
#### bullets
- item: adopt
  - body: Adopt existing token means the value already fits the system.
- item: unify
  - body: Unify to nearby token means the value likely represents drift.
- item: create
  - body: Create shared token means the value recurs often enough to deserve an explicit variable.

## Section: summary.metrics
- pattern_ref: section.audit-summary
- variant_ref: audit-surface
- layout_ref: grid-3

### Collections
#### metrics
- item: decisions
  - label: Decisions
  - value: Ranked items
  - note: Full queue entries.
- item: groups
  - label: Groups
  - value: Action buckets
  - note: Surfaced in the browser.

## Section: catalog.primary
- pattern_ref: section.audit-catalog
- variant_ref: audit-surface
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: DECISION GROUPS

### Collections
#### entries
- item: queue
  - title: Ranked decision groups
  - body: The page organizes token and variable work into action buckets before the detailed queue cards.

## Section: queue.main
- pattern_ref: section.audit-queue
- variant_ref: audit-surface
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: PRIORITIZED ACTION GROUPS

#### body
- mode: literal
- style_ref: body-1
- content: Each group clusters high-priority value decisions, rationale, token hints, and affected examples.

### Collections
#### groups
- item: adopt
  - title: Adopt Existing Token
  - body: Values that already match the system and should be reused immediately.
- item: unify
  - title: Unify to Nearby Token
  - body: Values close enough to an existing token that they likely represent drift rather than intent.
- item: create
  - title: Create Shared Token
  - body: Values that repeat enough to justify a new variable or primitive.
