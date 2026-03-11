---
entity: page-instance
id: audit-tokens
page_type_ref: audit-method
slug: /audit/tokens
title: Audit Tokens
---

## Meta
- seo_title: Token Coverage | Audit Viewer
- meta_description: Internal token-coverage view tying live site values back to the token file.

## Section Manifest
- shell.header
- hero.main
- summary.metrics
- catalog.primary
- catalog.secondary

## Section: shell.header
- pattern_ref: section.audit-shell-header
- variant_ref: audit-surface
- layout_ref: shell-topbar

### Slots
#### kicker
- mode: literal
- content: Token system

#### heading
- mode: literal
- style_ref: h1-hero-1
- content: Token Coverage

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
- item: decisions
  - label: Decision Queue
  - href: /audit/decisions
  - status: Live

## Section: hero.main
- pattern_ref: section.audit-explainer
- variant_ref: audit-surface
- layout_ref: two-column-equal

### Slots
#### eyebrow
- mode: literal
- content: Coverage first

#### heading
- mode: literal
- style_ref: h2-section
- content: See which existing tokens already cover the live site, and which shared values are still orphaned.

#### body
- mode: literal
- style_ref: body-1
- content: This viewer connects the family graph to src/styles/tokens.css so adoption, near-match cleanup, and missing-token decisions stay grounded.

#### note_title
- mode: literal
- content: How to use it

#### note_body
- mode: literal
- style_ref: body-1
- content: Work top-down: adopt existing tokens first, then decide whether the remaining shared values deserve new global tokens.

### Collections
#### bullets
- item: matched
  - body: Matched tokens stay attached to the values and properties they already cover.
- item: uncovered
  - body: Uncovered values are ranked because they recur across actual pages and families.
- item: previews
  - body: Live previews keep each token conversation tied to the affected elements.

## Section: summary.metrics
- pattern_ref: section.audit-summary
- variant_ref: audit-surface
- layout_ref: grid-3

### Collections
#### metrics
- item: tokens
  - label: Tokens
  - value: Parsed variables
  - note: Sourced from src/styles/tokens.css.
- item: matched
  - label: Matched
  - value: High-signal tokens
  - note: Surfaced in the view.
- item: orphans
  - label: Orphans
  - value: Shared uncovered values
  - note: Still need a variable decision.

## Section: catalog.primary
- pattern_ref: section.audit-catalog
- variant_ref: audit-surface
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: EXISTING TOKENS WITH LIVE COVERAGE

### Collections
#### entries
- item: matched-tokens
  - title: Matched tokens
  - body: Shows the best live value groups already covered by the existing token set.

## Section: catalog.secondary
- pattern_ref: section.audit-catalog
- variant_ref: audit-surface
- layout_ref: stack-mobile

### Slots
#### heading
- mode: literal
- style_ref: h2-section
- content: SHARED VALUES THAT STILL NEED A TOKEN OR VARIABLE DECISION

### Collections
#### entries
- item: uncovered-values
  - title: Uncovered values
  - body: Ranks the most repeated values that do not currently match the token set.
