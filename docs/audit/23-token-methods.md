# Property and Token Methods

- Raw node styles are not duplicated here. The source of truth remains the per-page snapshots in `docs/audit/raw/pages/*.json`, and the new ledger indexes those existing style profiles back to page, section family, and component family.
- The atlas, value graph, token coverage, and family deltas are all driven from visible nodes in the primary decision viewport: `desktop`.
- Every computed property remains tracked in the page snapshots. The atlas layers a usefulness filter on top of that raw capture so the browser views can stay decision-oriented.
- Token matching is deterministic. It uses normalized values, token var-chain resolution from `src/styles/tokens.css`, and near-match thresholds for colors, lengths, numbers, and shadows.
- The decision queue is a recommendation surface, not an auto-refactor plan. It prioritizes adoption of existing tokens first, then creation of new shared tokens, then component-scoped variables, then true one-offs.
- Existing tokens with no observed matches are still reported so dead or overly-specific tokens are visible.

Summary:
- Atlas properties: **94**
- Tokens parsed: **118**
- Decision items: **306**
