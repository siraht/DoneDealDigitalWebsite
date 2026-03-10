# Visual Drift QA Gate - Implementation Plan (Deferred)

## Goal
- Add an automated visual QA gate (`qa:visual:drift`) so intended visual changes are approved explicitly and all other visual changes are blocked until baselines are refreshed.

## Canonical commands (already in use)
- `npm run qa:visual`
- `npm run qa:visual:baseline -- --sections`
- `npm run qa:visual:drift`
- Policy reference: `docs/qa-visual-regression-policy.md`

## Gate behavior
- `qa:visual:drift` should be required for any branch or push gate.
- A branch is blocked when `qa:visual:drift` fails.
- A failed drift is treated as either:
  - unintentional visual regression (fix code), or
  - intended visual change (run baseline refresh and commit baselines intentionally).

## Intended change workflow (review-first)
1. Run `VISUAL_ROUTE=/ npm run qa:visual:drift` after changes.
2. If drift appears, inspect diffs in:
   - `qa/visual/diff/*`
   - `qa/visual/diff/sections/*`
3. If the change is intended, refresh approved baseline:
   - `VISUAL_ROUTE=/ npm run qa:visual:baseline -- --sections`
4. Re-run `VISUAL_ROUTE=/ npm run qa:visual:drift` and require clean.
5. Commit baseline refresh in a separate qa-focused commit.

## Suggested integration options (for later)
- GitHub Actions job:
  1. Start dev server on `127.0.0.1:4322`.
  2. Run `VISUAL_ROUTE=/ npm run qa:visual:drift`.
  3. Fail job on non-zero exit.
- Pre-push hook (deferred):
  1. Add local hook that runs a lightweight smoke command (`npm run qa:visual` or `npm run qa:visual:drift` depending on desired strictness).
  2. Document manual override steps for emergency, approved exceptions.

## Baseline policy reminders
- Keep drift baselines in `qa/visual/baseline` and section baselines in `qa/visual/baseline/sections`.
- Do not commit `qa/visual/current`, `qa/visual/diff`, `qa/visual/full-*`, or `qa-snapshots`.
- Commit baseline changes only when visual intent is approved.
- Record command + rationale whenever baselines are refreshed.

## Deferred implementation checklist
- [ ] Decide gate location (CI only, CI + pre-push, or both).
- [ ] Add explicit workflow file and required environment (`node`, `npm`, install, dev server).
- [ ] Add a short decision note in PR template:
  - pass/fail of `qa:visual:drift`
  - links to baseline artifacts if updated.
- [ ] Require baseline update checklist on approved visual PRs.
