# Multi-Signal Similarity Retrospective

## Goal

This pass was meant to improve the consolidation audit beyond DOM structure matching so the system could recognize what a human designer sees:

- the same section with different copy
- the same section with image/no-image variants
- the same component with spacing, layout, or background changes
- visually similar blocks that should still stay separate because they are different component families

## What Changed

The audit in [scripts/page-audit.mjs](/home/travis/Projects/Done%20Deal%20Digital/Website/scripts/page-audit.mjs) now compares each primary section using multiple signals instead of relying mostly on section type plus root styles.

Signals added:

- `structure`: subtree tag shape and size similarity
- `layout`: normalized descendant geometry and role distribution
- `rootStyle`: root-level computed decision styles
- `subtreeStyle`: computed style-value distribution across the whole subtree
- `classes`: class token and utility-family distribution across the subtree
- `semantics`: heading/body token similarity
- `patterns`: repeated child-pattern similarity
- `visual`: real Playwright section screenshot fingerprints

New outputs:

- [06-similarity-detectors.md](/home/travis/Projects/Done%20Deal%20Digital/Website/docs/audit/06-similarity-detectors.md)
- [07-section-neighbors.md](/home/travis/Projects/Done%20Deal%20Digital/Website/docs/audit/07-section-neighbors.md)
- [section-similarity.json](/home/travis/Projects/Done%20Deal%20Digital/Website/docs/audit/raw/section-similarity.json)

## Iteration Path

### Round 1

Added the detector framework, pairwise scoring, validation families, screenshot fingerprints, detector calibration, and nearest-neighbor reporting.

What worked immediately:

- headers, footers, legal content, CTA family, services family, process family, and comparison family all became much easier to validate
- the raw reports became much more inspectable because each match now carries score evidence
- screenshot fingerprints helped recover similarities that class and semantic matching missed

What failed immediately:

- hero variants were still under-clustered
- empty pattern sets were falsely acting like a strong positive signal
- allowing broad cross-type compatibility caused unrelated sections to merge into the same main cluster

### Round 2

Refined the ensemble to reduce accidental matches:

- narrowed cross-type clustering so only `FinalCtaSection` and `CallToAction` can merge in the main matrix
- reduced the influence of `rootStyle` and `patterns`
- changed empty-pattern comparisons from "strong match" to neutral/weak
- lowered the hero-family clustering threshold so the full hero family stays together
- raised the fallback `ContentSection` threshold so generic prose sections are treated more skeptically

This produced the current balance:

- main shared families stay grouped
- generic content is less noisy
- cross-type similarities still show up in nearest-neighbor output instead of polluting the main matrix

## What Worked Best

- `combined` scoring is the most useful output, not any single detector by itself
- `visual` was valuable for same-shape sections with different copy
- `subtreeStyle` was valuable for exact and near-exact families
- `layout` was especially useful on headers, footers, FAQs, and split comparison sections
- `nearest-neighbor` output is the safest place to inspect "looks similar but maybe not the same component" cases

## What Was Misleading

- `rootStyle` alone is too generic across this design system and creates false positives
- `typeHint` is useful for clustering but it is not an independent truth signal, because it depends on the section classifier
- `semantics` is weak for this repo because many equivalent sections use very different marketing copy
- `ContentSection` remains the least trustworthy family because it is the fallback bucket for everything not given a stronger section type

## Final Read On Reliability

High confidence:

- `SiteHeader`
- `HeroSection` as one family with variants
- `CredibilityStrip`
- `ServicesSection`
- `ProcessSection`
- `ComparisonSplitSection`
- `FinalCtaSection` plus framed CTA variants
- `SiteFooter`
- `LegalContent`
- FAQ category sections

Use judgment:

- `IconCardGrid`
- `ImageCardGrid`
- all `ContentSection` clusters

Treat `07-section-neighbors.md` as exploratory evidence, not final grouping truth.

## Practical Guidance

Use the audit docs in this order:

1. [02-section-matrix.md](/home/travis/Projects/Done%20Deal%20Digital/Website/docs/audit/02-section-matrix.md) for the main family view
2. [04-consolidation-checklist.md](/home/travis/Projects/Done%20Deal%20Digital/Website/docs/audit/04-consolidation-checklist.md) for actual extraction planning
3. [06-similarity-detectors.md](/home/travis/Projects/Done%20Deal%20Digital/Website/docs/audit/06-similarity-detectors.md) when a cluster feels wrong and needs explanation
4. [07-section-neighbors.md](/home/travis/Projects/Done%20Deal%20Digital/Website/docs/audit/07-section-neighbors.md) when you want to explore possible variants not promoted into the main cluster

## Next Improvements

If this gets another pass, the most valuable next changes are:

- add a simplified DOM wireframe image detector so text content matters less than block layout
- move the repo-specific truth set into a separate config file instead of hardcoding it in the audit script
- add explicit family-level thresholds instead of relying mostly on one global combined threshold
- add a reviewer-facing "why not grouped" report for near-miss hero and CTA pairs
