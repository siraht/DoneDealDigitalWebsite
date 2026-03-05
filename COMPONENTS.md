# COMPONENTS

Component inventory for the current single-page conversion.

## Conversion boundary

These are the page-level building blocks in `src/pages/index.astro` used by the current single-page build and the target boundaries for Bookshop extraction.

## 1) `SiteHeader`

- Selector family: `.site-header`, `.site-header__inner`, `.site-header__brand`, `.site-header__brand-icon`, `.site-header__brand-title`, `.site-header__nav`, `.site-header__nav-link`, `.site-header__actions`
- Purpose: sticky brand/navigation + header CTA
- Props (Bookshop-ready):
  - `brandTitle: string`
  - `brandLogoIcon: string`
  - `ctaLabel: string`
  - `menuItems: { label, href }[]`

## 2) `HeroSection`

- Selector family: `.hero`, `.hero__inner`, `.hero__content`, `.hero__headline`, `.hero__headline-accent`, `.hero__copy`, `.hero__actions`, `.hero__media`, `.hero__media-frame`, `.hero__media-inner`, `.hero__media-image`, `.hero__media-overlay`, `.hero__badge`, `.hero__badge-copy`, `.hero__badge-title`
- Purpose: firstfold conversion and CTA section
- Props:
  - `headline: string`
  - `headlineAccent?: string`
  - `intro: string`
  - `primaryCtaLabel: string`
  - `secondaryCtaLabel: string`
  - `heroImageSrc: string`
  - `badgeText: string`

## 3) `CredibilityStrip`

- Selector family: `.cred-strip`, `.cred-strip__inner`, `.cred-strip__item`, `.cred-strip__divider`, `.cred-strip__text`
- Purpose: proof/credibility messaging strip
- Props:
  - `items: { icon: string; text: string }[]`

## 4) `ServicesSection`

- Selector family: `.services`, `.services__heading`, `.services__title`, `.services__rule`
- Card family: `.services-card`, `.services-card__icon-wrap`, `.services-card__icon`, `.services-card__title`, `.services-card__description`, `.services-card__list`, `.services-card__list-item`
- Purpose: marketing services presentation
- Props:
  - `title: string`
  - `items: {
    icon: string;
    title: string;
    description: string;
    bullets: string[];
  }[]`

## 5) `ProcessSection`

- Selector family: `.process`, `.process__overlay`, `.process__inner`, `.process__grid`, `.process__copy`, `.process__title`, `.process__steps`
- Step family: `.process-step`, `.process-step__number`, `.process-step__body`, `.process-step__title`, `.process-step__copy`
- Gallery family: `.process-gallery__cell`, `.process-gallery__cell--offset`, `.process-gallery__frame`, `.process-gallery__image`, `.process-gallery__overlay`
- Purpose: process explanation and proof gallery
- Props:
  - `title: string`
  - `steps: { number: string; title: string; description: string }[]`
  - `galleryImages: { src: string; alt: string }[]`

## 6) `FinalCtaSection`

- Selector family: `.final-cta`, `.final-cta__wrap`, `.final-cta__panel`, `.final-cta__text`, `.final-cta__title`, `.final-cta__copy`, `.final-cta__actions`, `.final-cta__button`
- Purpose: conversion close + primary action
- Props:
  - `title: string`
  - `copy: string`
  - `ctaLabel: string`

## 7) `SiteFooter`

- Selector family: `.site-footer`, `.site-footer__top`, `.site-footer__brand`, `.site-footer__brand-heading`, `.site-footer__brand-title`, `.site-footer__description`, `.site-footer__col`, `.site-footer__col-title`, `.site-footer__list`, `.site-footer__list-item`, `.site-footer__link`, `.site-footer__bottom`, `.site-footer__copyright`, `.site-footer__tagline`
- Purpose: global site footer and legal nav
- Props:
  - `companyName: string`
  - `tagline: string`
  - `description: string`
  - `serviceLinks: { label, href }[]`
  - `legalLinks: { label, href }[]`
  - `copyright: string`
  - `footerPill: string`
