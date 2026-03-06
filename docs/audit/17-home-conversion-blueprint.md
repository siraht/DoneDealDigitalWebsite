# Home Conversion Blueprint

This report compares the original stitch homepage against the converted homepage and treats that pair as the migration precedent for the remaining stitch pages.

## SiteHeader

- Source stitch precedent: `index_original` section 1 (DONE DEAL DIGITAL).
- Converted target: `index` section 1 (DONE DEAL DIGITAL).
- Source utility families to replace: text, border, items, px, flex, font, tracking, h.
- Target custom class namespace already exists: site-header__nav-link, cta, cta--accent, cta--sm, material-symbols-outlined, site-container, site-header, site-header__actions.
- Root style deltas between source and target: `z-index` (40 vs 50), `font-family` ("DM Sans", Inter, system-ui, sans-serif vs "DM Sans", sans-serif), `line-height` (24px vs 26px), `border-top-color` (rgb(11, 29, 51) vs rgb(229, 231, 235)), `border-right-color` (rgb(11, 29, 51) vs rgb(229, 231, 235)), `border-left-color` (rgb(11, 29, 51) vs rgb(229, 231, 235)).
- Child primitives already preserved through conversion: `HeaderNavLink` source x4 -> target x4.
- Suggested migration rule: replace stitch utilities with the existing target component namespace and keep the tokenized styles as the contract.

## HeroSection

- Source stitch precedent: `index_original` section 2 (WE BUILD WEBSITES THAT WORK AS HARD AS YOU DO.).
- Converted target: `index` section 2 (WE BUILD WEBSITES THAT WORK AS HARD AS YOU DO.).
- Source utility families to replace: text, border, font, bg, block, flex, relative, tracking.
- Target custom class namespace already exists: cta, cta--md, hero__cta, cta--primary, cta--secondary, hero, hero__actions, hero__badge.
- Root style deltas between source and target: `height` (1098px vs 985.953px), `background-color` (rgb(11, 29, 51) vs rgb(13, 26, 43)), `color` (rgb(11, 29, 51) vs rgb(255, 255, 255)), `font-family` ("DM Sans", Inter, system-ui, sans-serif vs "DM Sans", sans-serif), `line-height` (24px vs 26px), `border-top-color` (rgb(11, 29, 51) vs rgb(229, 231, 235)).
- Child primitives already preserved through conversion: `Button` source x2 -> target x2, `HeroEyebrow: Consider it...` source x2 -> target x2.
- Suggested migration rule: replace stitch utilities with the existing target component namespace and keep the tokenized styles as the contract.

## CredibilityStrip

- Source stitch precedent: `index_original` section 3.
- Converted target: `index` section 3.
- Source utility families to replace: text, flex, gap, items, bg, font, h, hidden.
- Target custom class namespace already exists: cred-strip__icon, cred-strip__item, cred-strip__text, material-symbols-outlined, cred-strip__divider, cred-strip, cred-strip__inner, site-container.
- Root style deltas between source and target: `font-family` ("DM Sans", Inter, system-ui, sans-serif vs "DM Sans", sans-serif), `line-height` (24px vs 26px), `border-top-color` (rgb(11, 29, 51) vs rgb(229, 231, 235)), `border-right-color` (rgb(11, 29, 51) vs rgb(229, 231, 235)), `border-left-color` (rgb(11, 29, 51) vs rgb(229, 231, 235)).
- Suggested migration rule: replace stitch utilities with the existing target component namespace and keep the tokenized styles as the contract.

## ServicesSection

- Source stitch precedent: `index_original` section 4 (NO FLUFF. JUST RESULTS.).
- Converted target: `index` section 4 (NO FLUFF. JUST RESULTS.).
- Source utility families to replace: text, bg, flex, h, items, w, gap, font.
- Target custom class namespace already exists: services-card__list-item, material-symbols-outlined, services-card, services-card__description, services-card__icon, services-card__icon-wrap, services-card__list, services-card__title.
- Root style deltas between source and target: `height` (814px vs 829.984px), `font-family` ("DM Sans", Inter, system-ui, sans-serif vs "DM Sans", sans-serif), `line-height` (24px vs 26px).
- Child primitives already preserved through conversion: `ListItem: Fast Loading` source x9 -> target x9, `IconCard` source x3 -> target x3.
- Suggested migration rule: replace stitch utilities with the existing target component namespace and keep the tokenized styles as the contract.

## ProcessSection

- Source stitch precedent: `index_original` section 5 (THE DONE DEAL PROCESS).
- Converted target: `index` section 5 (THE DONE DEAL PROCESS).
- Source utility families to replace: text, border, flex, font, h, items, bg, gap.
- Target custom class namespace already exists: process-step, process-step__body, process-step__copy, process-step__number, process-step__title, process-gallery__cell, process-gallery__frame, process-gallery__image.
- Root style deltas between source and target: `height` (720.75px vs 749.953px), `background-color` (rgb(11, 29, 51) vs rgb(13, 26, 43)), `color` (rgb(11, 29, 51) vs rgb(255, 255, 255)), `font-family` ("DM Sans", Inter, system-ui, sans-serif vs "DM Sans", sans-serif), `line-height` (24px vs 26px), `border-right-color` (rgb(11, 29, 51) vs rgb(229, 231, 235)).
- Child primitives already preserved through conversion: `ProcessStep` source x3 -> target x3, `RepeatableBlock` source x2 -> target x2.
- Suggested migration rule: replace stitch utilities with the existing target component namespace and keep the tokenized styles as the contract.

## FinalCtaSection

- Source stitch precedent: `index_original` section 6 (READY TO SCALE YOUR CREW?).
- Converted target: `index` section 6 (READY TO GROW?).
- Source utility families to replace: text, border, font, bg, flex, px, py, gap.
- Target custom class namespace already exists: cta, cta--primary, cta--xl, final-cta, final-cta__actions, final-cta__button, final-cta__copy, final-cta__panel.
- Root style deltas between source and target: `font-family` ("DM Sans", Inter, system-ui, sans-serif vs "DM Sans", sans-serif), `line-height` (24px vs 26px), `border-top-color` (rgb(11, 29, 51) vs rgb(229, 231, 235)), `border-right-color` (rgb(11, 29, 51) vs rgb(229, 231, 235)), `border-left-color` (rgb(11, 29, 51) vs rgb(229, 231, 235)).
- Child primitives already preserved through conversion: `Button` source x1 -> target x1.
- Suggested migration rule: replace stitch utilities with the existing target component namespace and keep the tokenized styles as the contract.

## SiteFooter

- Source stitch precedent: `index_original` section 7 (DONE DEAL DIGITAL).
- Converted target: `index` section 7 (DONE DEAL DIGITAL).
- Source utility families to replace: text, font, hover:text, tracking, transition, uppercase, flex, gap.
- Target custom class namespace already exists: site-footer__link, site-footer__list-item, site-container, site-footer__col, site-footer__col-title, site-footer__list, site-footer, site-footer__bottom.
- Root style deltas between source and target: `height` (462px vs 486px), `background-color` (rgb(11, 29, 51) vs rgb(13, 26, 43)), `color` (rgb(11, 29, 51) vs rgb(255, 255, 255)), `font-family` ("DM Sans", Inter, system-ui, sans-serif vs "DM Sans", sans-serif), `line-height` (24px vs 26px).
- Child primitives already preserved through conversion: `FooterLinkItem: WEB DESIGN` source x7 -> target x7, `FooterMeta: © 2024 DONE DEAL DIGITAL. ALL RIGHTS RESERVED.` source x2 -> target x2.
- Suggested migration rule: replace stitch utilities with the existing target component namespace and keep the tokenized styles as the contract.

