# Similarity Detector Analysis

Validation set: 556 labeled pairs (278 positive, 278 negative).

## Detector Calibration

| Detector | Threshold | Avg + | Avg - | Precision | Recall | F1 | FP | FN |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `typeHint` | 1.00 | 1.00 | 0.00 | 1.00 | 1.00 | 1.00 | 0 | 0 |
| `structure` | 0.25 | 0.55 | 0.15 | 0.92 | 0.89 | 0.91 | 21 | 30 |
| `layout` | 0.20 | 0.55 | 0.10 | 0.96 | 0.85 | 0.90 | 11 | 41 |
| `rootStyle` | 0.84 | 0.93 | 0.78 | 0.79 | 0.94 | 0.86 | 68 | 17 |
| `subtreeStyle` | 0.75 | 0.81 | 0.44 | 0.98 | 0.72 | 0.83 | 4 | 79 |
| `classes` | 0.32 | 0.61 | 0.21 | 0.94 | 0.80 | 0.86 | 15 | 57 |
| `semantics` | 0.06 | 0.50 | 0.07 | 0.81 | 0.74 | 0.77 | 48 | 73 |
| `patterns` | 0.35 | 0.64 | 0.06 | 0.88 | 0.84 | 0.86 | 32 | 44 |
| `visual` | 0.61 | 0.87 | 0.48 | 0.82 | 0.97 | 0.89 | 60 | 9 |
| `combined` | 0.38 | 0.72 | 0.28 | 0.98 | 0.96 | 0.97 | 6 | 10 |

## Family Coverage

| Family | Pair count | Avg combined | Above threshold | Coverage |
| --- | --- | --- | --- | --- |
| `SiteHeader` | 78 | 0.86 | 78/78 | 100.0% |
| `HeroSection` | 78 | 0.51 | 68/78 | 87.2% |
| `SiteFooter` | 78 | 0.83 | 78/78 | 100.0% |
| `CredibilityStrip` | 1 | 0.68 | 1/1 | 100.0% |
| `ServicesSection` | 3 | 0.62 | 3/3 | 100.0% |
| `ProcessSection` | 3 | 0.55 | 3/3 | 100.0% |
| `ComparisonSplitSection` | 3 | 0.57 | 3/3 | 100.0% |
| `CallToAction` | 21 | 0.59 | 21/21 | 100.0% |
| `LegalContent` | 3 | 0.99 | 3/3 | 100.0% |
| `FaqSection` | 10 | 0.63 | 10/10 | 100.0% |

## Misses To Review

### False Negatives

- [ ] `case-studies::section-2` vs `web-design::section-2` in `HeroSection` fell below threshold at 0.35; strongest signals: typeHint 1.00, rootStyle 0.94, visual 0.67.
- [ ] `cookie-policy::section-2` vs `web-design::section-2` in `HeroSection` fell below threshold at 0.35; strongest signals: typeHint 1.00, rootStyle 0.94, visual 0.65.
- [ ] `privacy::section-2` vs `web-design::section-2` in `HeroSection` fell below threshold at 0.35; strongest signals: typeHint 1.00, rootStyle 0.94, visual 0.65.
- [ ] `terms::section-2` vs `web-design::section-2` in `HeroSection` fell below threshold at 0.35; strongest signals: typeHint 1.00, rootStyle 0.94, visual 0.65.
- [ ] `contact::section-2` vs `web-design::section-2` in `HeroSection` fell below threshold at 0.36; strongest signals: typeHint 1.00, rootStyle 0.98, visual 0.64.
- [ ] `cookie-policy::section-2` vs `index::section-2` in `HeroSection` fell below threshold at 0.36; strongest signals: typeHint 1.00, rootStyle 0.80, visual 0.66.
- [ ] `index::section-2` vs `privacy::section-2` in `HeroSection` fell below threshold at 0.36; strongest signals: typeHint 1.00, rootStyle 0.80, visual 0.66.
- [ ] `index::section-2` vs `terms::section-2` in `HeroSection` fell below threshold at 0.36; strongest signals: typeHint 1.00, rootStyle 0.80, visual 0.66.
- [ ] `about::section-2` vs `web-design::section-2` in `HeroSection` fell below threshold at 0.37; strongest signals: typeHint 1.00, rootStyle 0.98, visual 0.75.
- [ ] `case-studies::section-2` vs `index::section-2` in `HeroSection` fell below threshold at 0.37; strongest signals: typeHint 1.00, rootStyle 0.80, visual 0.67.

### False Positives

- [ ] `about::section-9` vs `index_original::section-5` crossed threshold at 0.41; strongest signals: rootStyle 0.82, visual 0.79, subtreeStyle 0.76.
- [ ] `about::section-8` vs `faq::section-7` crossed threshold at 0.41; strongest signals: rootStyle 0.88, subtreeStyle 0.77, visual 0.65.
- [ ] `about::section-8` vs `faq::section-5` crossed threshold at 0.41; strongest signals: rootStyle 0.88, subtreeStyle 0.77, visual 0.65.
- [ ] `about::section-8` vs `local-seo::section-2` crossed threshold at 0.40; strongest signals: subtreeStyle 0.76, rootStyle 0.72, classes 0.47.
- [ ] `about::section-2` vs `lead-generation::section-9` crossed threshold at 0.40; strongest signals: subtreeStyle 0.72, rootStyle 0.72, visual 0.57.
- [ ] `about::section-2` vs `web-design::section-9` crossed threshold at 0.38; strongest signals: rootStyle 0.78, subtreeStyle 0.66, visual 0.57.

