# Visual QA Artifact Tracking Policy

## Scope
This policy controls what visual regression outputs are versioned and how they are used as regression references.

## Tracked (committed) artifacts
- `qa/visual/baseline/` and `qa/visual/baseline/sections/`
  - Astro runtime output baseline used for day-to-day CI-like comparisons.
- `qa/visual/baseline-static/` and `qa/visual/baseline-static/sections/`
  - Static HTML baseline from local static preview flow.
- `qa/visual/baseline-static-http/` and `qa/visual/baseline-static-http/sections/`
  - Static HTML baseline collected via HTTP render flow.

## Ephemeral artifacts (never committed)
- `qa/visual/current/`
- `qa/visual/diff/`
- `qa/visual/full-diff/`
- `qa/visual/full-cropdiff/`
- `qa/visual/compare/`
- `qa-snapshots/`

These files are generated during comparison runs and should be recreated on demand.

## Capture and diff rules
- Use `npm run qa:visual` while iterating. This writes to current + section captures under ephemeral paths.
- Use `npm run qa:visual:baseline` only after visual intent is approved.
- Use explicit baseline selector when needed:
  - default → `qa/visual/baseline`
  - static local → `QA_BASELINE_DIR=qa/visual/baseline-static npm run qa:visual:baseline`
  - static HTTP → `QA_BASELINE_DIR=qa/visual/baseline-static-http npm run qa:visual:baseline`
- Use `npm run qa:visual:drift` prior to milestones and before commit groups that include visual intent changes.

## Baseline update procedure
1. Run full capture (`npm run qa:visual`) for the change set.
2. Validate diffs and review section-level drift.
3. If approved, run baseline command with the target directory.
4. Create a single commit containing only:
   - the intended baseline directory updates
   - policy/checklist/doc updates referencing the run
5. Use commit message template:
   - `qa: refresh visual baseline (<source>)`

## Checkpoint documentation
- For each accepted baseline refresh, record:
  - change date
  - command used
  - viewport profile
  - source path (`/`, static baseline, or HTTP static baseline)
  - summary of accepted visual delta rationale
