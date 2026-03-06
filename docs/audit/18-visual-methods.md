# Visual Audit Methods

This document defines five browser-native ways to turn the similarity audit into visual review surfaces that use the actual rendered page elements.

## 1. Family Gallery Wall

- Group section families and component families into expandable visual shelves.
- Use live previews centered on the mapped element path inside each real page.
- Show the canonical candidate first, then the most divergent retained variants.
- Best for rapid scanning and intuitive “same enough or not?” judgments.

## 2. Canonical Comparator

- Pin one canonical reference beside selected variants from the same family.
- Surface the strongest and weakest detector matches with their similarity signals.
- Best for naming variants and deciding whether a family needs one component, modifiers, or a split.

## 3. Coverage Heatmap

- Plot pages against shared section/component families in a matrix.
- Open each page-family intersection into a tray of live previews.
- Best for spotting reuse gaps, isolated outliers, and consolidation priority across the whole site.

## 4. Style Archetype Atlas

- Group components by shared visual signature even when they belong to different semantic families.
- Show mixed examples of the same visual surface, spacing pattern, or button/card treatment.
- Best for extracting lower-level design primitives and token opportunities.

## 5. Conversion Workbench

- Put `index_original`, `index`, and the remaining stitch variants into one actionable migration surface.
- Show the stitch precedent, tokenized precedent, and current target family side by side.
- Best for planning actual conversion work from mockup classes into the canonical system.
