---
entity: variant
id: audit-surface
title: Audit Surface
---

## Purpose
- internal audit viewer surface with noise, stat bars, and matrix tooling

## Context Rules
- allowed_contexts:
  - shell.header
  - hero.main
  - catalog.main
  - matrix.main
  - queue.main
- disallowed_contexts:
  - footer.global

## Token Mapping
- token_bundle_ref: theme.audit.surface

## States
- default
