# Component Detector Analysis

Validation set: 11408 labeled pairs (5704 positive, 5704 negative).

## Detector Calibration

| Detector | Threshold | Avg + | Avg - | Precision | Recall | F1 | FP | FN |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `typeHint` | 1.00 | 1.00 | 0.00 | 1.00 | 1.00 | 1.00 | 0 | 0 |
| `structure` | 0.24 | 0.86 | 0.12 | 0.97 | 0.97 | 0.97 | 149 | 143 |
| `layout` | 0.07 | 0.71 | 0.04 | 0.93 | 0.93 | 0.93 | 404 | 375 |
| `rootStyle` | 0.78 | 0.93 | 0.65 | 0.92 | 0.96 | 0.94 | 457 | 249 |
| `subtreeStyle` | 0.73 | 0.91 | 0.37 | 0.99 | 0.94 | 0.96 | 71 | 349 |
| `classes` | 0.48 | 0.72 | 0.18 | 1.00 | 0.76 | 0.86 | 7 | 1353 |
| `semantics` | 0.01 | 0.39 | 0.21 | 0.62 | 0.96 | 0.76 | 3308 | 227 |
| `patterns` | 0.35 | 0.35 | 0.32 | 0.52 | 0.98 | 0.67 | 5238 | 135 |
| `visual` | 0.79 | 0.86 | 0.47 | 0.99 | 0.88 | 0.93 | 42 | 667 |
| `combined` | 0.46 | 0.80 | 0.24 | 0.99 | 0.98 | 0.98 | 82 | 141 |

## Family Coverage

| Family | Pair count | Avg combined | Above threshold | Coverage |
| --- | --- | --- | --- | --- |
| `HeaderNavLink` | 1326 | 0.85 | 1326/1326 | 100.0% |
| `HeroButton` | 36 | 0.74 | 36/36 | 100.0% |
| `ComparisonPanel` | 15 | 0.62 | 15/15 | 100.0% |
| `ComparisonListItem` | 231 | 0.66 | 231/231 | 100.0% |
| `ProcessStep` | 36 | 0.67 | 36/36 | 100.0% |
| `AccordionItem` | 28 | 0.81 | 28/28 | 100.0% |
| `FooterLinkItem` | 3741 | 0.82 | 3740/3741 | 100.0% |
| `FormField` | 15 | 0.90 | 15/15 | 100.0% |
| `IconCard` | 276 | 0.50 | 136/276 | 49.3% |

## Misses To Review

### False Negatives

- [ ] `about::section-3::component-g1-i3` vs `lead-generation::section-5::component-g4-i3` in `IconCard` fell below threshold at 0.33; strongest signals: typeHint 1.00, visual 0.67, rootStyle 0.56.
- [ ] `about::section-3::component-g1-i3` vs `lead-generation::section-5::component-g4-i1` in `IconCard` fell below threshold at 0.33; strongest signals: typeHint 1.00, visual 0.67, rootStyle 0.56.
- [ ] `about::section-3::component-g1-i3` vs `lead-generation::section-5::component-g4-i2` in `IconCard` fell below threshold at 0.34; strongest signals: typeHint 1.00, visual 0.68, rootStyle 0.56.
- [ ] `about::section-3::component-g1-i1` vs `lead-generation::section-5::component-g4-i1` in `IconCard` fell below threshold at 0.34; strongest signals: typeHint 1.00, visual 0.67, rootStyle 0.58.
- [ ] `about::section-3::component-g1-i1` vs `lead-generation::section-5::component-g4-i3` in `IconCard` fell below threshold at 0.34; strongest signals: typeHint 1.00, visual 0.68, rootStyle 0.58.
- [ ] `about::section-3::component-g1-i1` vs `lead-generation::section-5::component-g4-i2` in `IconCard` fell below threshold at 0.34; strongest signals: typeHint 1.00, visual 0.67, rootStyle 0.58.
- [ ] `about::section-6::component-g1-i5` vs `lead-generation::section-5::component-g4-i2` in `IconCard` fell below threshold at 0.34; strongest signals: typeHint 1.00, rootStyle 0.78, visual 0.72.
- [ ] `about::section-6::component-g1-i1` vs `lead-generation::section-5::component-g4-i2` in `IconCard` fell below threshold at 0.34; strongest signals: typeHint 1.00, rootStyle 0.78, visual 0.73.
- [ ] `about::section-6::component-g1-i2` vs `lead-generation::section-5::component-g4-i2` in `IconCard` fell below threshold at 0.35; strongest signals: typeHint 1.00, rootStyle 0.78, visual 0.74.
- [ ] `about::section-6::component-g1-i5` vs `lead-generation::section-5::component-g4-i3` in `IconCard` fell below threshold at 0.35; strongest signals: typeHint 1.00, rootStyle 0.80, visual 0.71.
- [ ] `about::section-3::component-g1-i2` vs `lead-generation::section-5::component-g4-i1` in `IconCard` fell below threshold at 0.35; strongest signals: typeHint 1.00, visual 0.69, rootStyle 0.64.
- [ ] `about::section-6::component-g1-i5` vs `lead-generation::section-5::component-g4-i1` in `IconCard` fell below threshold at 0.35; strongest signals: typeHint 1.00, rootStyle 0.80, visual 0.71.
- [ ] `about::section-3::component-g1-i2` vs `lead-generation::section-5::component-g4-i3` in `IconCard` fell below threshold at 0.35; strongest signals: typeHint 1.00, visual 0.69, rootStyle 0.64.
- [ ] `about::section-6::component-g1-i1` vs `lead-generation::section-5::component-g4-i1` in `IconCard` fell below threshold at 0.35; strongest signals: typeHint 1.00, rootStyle 0.80, visual 0.72.
- [ ] `about::section-6::component-g1-i1` vs `lead-generation::section-5::component-g4-i3` in `IconCard` fell below threshold at 0.35; strongest signals: typeHint 1.00, rootStyle 0.80, visual 0.72.

### False Positives

- [ ] `case-studies::section-1::component-g1-i4` vs `index_original::section-2::component-g1-i2` crossed threshold at 0.53; strongest signals: layout 1.00, visual 0.79, rootStyle 0.64.
- [ ] `case-studies::section-1::component-g1-i1` vs `index_original::section-2::component-g1-i2` crossed threshold at 0.53; strongest signals: layout 1.00, visual 0.77, rootStyle 0.64.
- [ ] `case-studies::section-1::component-g1-i3` vs `index_original::section-2::component-g1-i2` crossed threshold at 0.53; strongest signals: layout 1.00, visual 0.77, rootStyle 0.64.
- [ ] `case-studies::section-1::component-g1-i1` vs `web-design::section-2::component-g2-i2` crossed threshold at 0.52; strongest signals: layout 1.00, visual 0.74, rootStyle 0.64.
- [ ] `case-studies::section-1::component-g1-i4` vs `web-design::section-2::component-g2-i2` crossed threshold at 0.52; strongest signals: layout 1.00, visual 0.74, rootStyle 0.64.
- [ ] `case-studies::section-1::component-g1-i3` vs `web-design::section-2::component-g2-i2` crossed threshold at 0.52; strongest signals: layout 1.00, visual 0.73, rootStyle 0.64.
- [ ] `about::section-1::component-g1-i2` vs `web-design::section-2::component-g2-i2` crossed threshold at 0.52; strongest signals: layout 1.00, visual 0.66, rootStyle 0.66.
- [ ] `about::section-1::component-g1-i2` vs `index_original::section-2::component-g1-i2` crossed threshold at 0.52; strongest signals: layout 1.00, rootStyle 0.66, visual 0.65.
- [ ] `about::section-1::component-g1-i1` vs `index_original::section-2::component-g1-i2` crossed threshold at 0.52; strongest signals: layout 1.00, rootStyle 0.66, visual 0.62.
- [ ] `about::section-1::component-g1-i1` vs `web-design::section-2::component-g2-i2` crossed threshold at 0.52; strongest signals: layout 1.00, rootStyle 0.66, visual 0.62.
- [ ] `about::section-1::component-g1-i3` vs `local-seo::section-2::component-standalone-1` crossed threshold at 0.52; strongest signals: layout 1.00, rootStyle 0.66, subtreeStyle 0.59.
- [ ] `about::section-1::component-g1-i3` vs `index_original::section-2::component-g1-i1` crossed threshold at 0.51; strongest signals: layout 1.00, rootStyle 0.66, subtreeStyle 0.59.
- [ ] `case-studies::section-1::component-g1-i2` vs `local-seo::section-2::component-standalone-1` crossed threshold at 0.51; strongest signals: layout 1.00, rootStyle 0.64, subtreeStyle 0.57.
- [ ] `about::section-1::component-g1-i3` vs `web-design::section-2::component-g2-i1` crossed threshold at 0.51; strongest signals: layout 1.00, rootStyle 0.66, subtreeStyle 0.59.
- [ ] `case-studies::section-1::component-g1-i2` vs `index_original::section-2::component-g1-i1` crossed threshold at 0.50; strongest signals: layout 1.00, rootStyle 0.64, subtreeStyle 0.57.

