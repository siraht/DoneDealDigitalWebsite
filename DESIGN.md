---
version: "alpha"
name: Industrial Bold
description: "A high-impact, bold, and high-contrast design system built for tradesmen, home service operators, and physical contractors. Rooted in neo-brutalist flat shadows, heavy borders, and tall industrial typography."
colors:
  primary: "#ff7b00"
  navy: "#0b1d33"
  slate: "hsl(215 25% 34%)"
  concrete: "hsl(214 31% 91%)"
  background-light: "hsl(228 18% 97%)"
  background-dark: "hsl(214 53% 11%)"
  white: "#ffffff"
typography:
  display:
    fontFamily: "Bebas Neue"
    fontSize: "4.5rem"
    fontWeight: "700"
    lineHeight: "0.85"
    letterSpacing: "0.03em"
  section-title:
    fontFamily: "Bebas Neue"
    fontSize: "3.75rem"
    fontWeight: "700"
    lineHeight: "0.85"
    letterSpacing: "0.03em"
  card-title:
    fontFamily: "Bebas Neue"
    fontSize: "2.25rem"
    fontWeight: "700"
    lineHeight: "1.11"
    letterSpacing: "0.03em"
  body:
    fontFamily: "DM Sans"
    fontSize: "1rem"
    fontWeight: "400"
    lineHeight: "1.625"
  body-large:
    fontFamily: "DM Sans"
    fontSize: "1.25rem"
    fontWeight: "500"
    lineHeight: "1.333"
  eyebrow:
    fontFamily: "Work Sans"
    fontSize: "1.5rem"
    fontWeight: "700"
    lineHeight: "1"
    letterSpacing: "0.1em"
  badge:
    fontFamily: "Bebas Neue"
    fontSize: "2.25rem"
    fontWeight: "700"
    lineHeight: "1"
    letterSpacing: "0.18em"
rounded:
  none: "0px"
  pill: "9999px"
spacing:
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  xxl: "3rem"
  gutter: "1.5rem"
  section: "6rem"
components:
  page-body:
    backgroundColor: "{colors.background-light}"
    textColor: "{colors.navy}"
    typography: "{typography.body}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.white}"
    rounded: "{rounded.none}"
    padding: "1.25rem 2.5rem"
    typography: "{typography.body}"
  button-primary-hover:
    backgroundColor: "#d96900"
  button-secondary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.navy}"
    rounded: "{rounded.none}"
    padding: "1.25rem 2.5rem"
    typography: "{typography.body}"
  button-secondary-hover:
    backgroundColor: "{colors.concrete}"
  services-card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.navy}"
    rounded: "{rounded.none}"
    padding: "2.5rem"
  services-card-description:
    textColor: "{colors.slate}"
    typography: "{typography.body}"
  hero-section:
    backgroundColor: "{colors.background-dark}"
    textColor: "{colors.white}"
  site-header:
    backgroundColor: "{colors.white}"
    textColor: "{colors.navy}"
---

## Overview

Industrial Bold is a premium, high-impact design system tailored specifically for home service operators and tradesmen (e.g., plumbers, HVAC technicians, builders, and landscapers). The system communicates reliability, directness, and utility. It rejects soft gradients, pastels, and rounded corners in favor of heavy borders, thick neo-brutalist flat offsets, solid blocks of color, and high-visibility typography. The visual identity evokes a premium heavy-duty tool or a high-contrast schematic.

## Colors

The palette is rooted in high-contrast utility colors and a single high-visibility orange accent.

- **Primary (#ff7b00):** Done Deal Orange — a safety-orange accent used for primary interactions, credibility highlights, and focal points.
- **Navy (#0b1d33):** Deep Ink — the primary typography, border, and heavy container color. Replaces standard black with a deep, authoritative ink.
- **Concrete (hsl(214 31% 91%)):** A cool structural mid-tone gray used for borders, secondary backgrounds, and muted panels.
- **Slate (hsl(215 25% 34%)):** A sophisticated charcoal slate for captions, metadata, and body copy variants.
- **Background Light (hsl(228 18% 97%)):** Warm limestone foundation that softens page layouts.
- **Background Dark (hsl(214 53% 11%)):** Deep navy-black canvas used for hero and footer backgrounds.

## Typography

Typographic choices emphasize bold readability and vintage industrial signage.

- **Display Fonts (Bebas Neue):** Tall, condensed, high-tracking uppercase headers for heroic impact.
- **Eyebrow Fonts (Work Sans):** Wide, geometric sans-serif for uppercase labels, badges, and structural metadata.
- **Body Fonts (DM Sans / Inter):** Highly readable geometric sans-serif optimized for legibility at small sizes and high-density copy.

## Layout

The layout system is container-driven, structured around a strict grid and responsive container queries.

- **Max Container Width:** 70rem (1120px) to maintain readable line lengths and layout alignment.
- **Gutter / Container Padding:** 1.5rem (clamp(1.5rem, 4vw, 5rem)) for layout breathing room.
- **Section Spacing:** 6rem (--space-section-top) of vertical isolation between main content blocks.
- **Grid Layout:** Neo-brutalist bento grids that stack vertically on smaller containers/viewports using CSS container queries rather than viewport-level media queries.

## Elevation & Depth

In alignment with the industrial theme, there are zero soft shadows, gradients, or blur overlays. Depth is hard-edged and structural:

- **Primary Navy Shadow:** A flat `6px 6px 0 0 var(--color-navy)` offset. Applied to cards, form containers, and interactive elements.
- **Accent Orange Shadow:** A flat `6px 6px 0 0 var(--color-primary)` offset, typically applied to hero media frames and call-to-action buttons.
- **Borders:** Every boundary is reinforced with solid borders (`2px` or `4px` in thickness) to create physical partitions on the page.

## Shapes

- All components, cards, forms, and media frames have **sharp, 90-degree corners** (`border-radius: 0px`).
- The only exception is the pill shape (`border-radius: 9999px`), reserved exclusively for inline badges and tag-like elements.

## Components

- **SiteHeader:** A sticky top navigation bar with a solid bottom border, using navy text, white background, and a sharp layout.
- **HeroSection:** A dark-themed, high-impact introductory block featuring a bold Bebas Neue title, orange accents, and an offset-shadowed media frame.
- **ServicesCard:** A white-background, flat-shadowed container featuring bold category headers, slate body copy, and a square icon wrapper.
- **CtaLink (Primary Button):** A sharp rectangular button using primary orange background and white text, paired with a solid navy outline and hover transitions that darken the background fill.
- **CtaLink (Secondary Button):** A sharp white button with a navy border and navy flat shadow, providing secondary action hierarchy.

## Do's and Don'ts

- **DO** use absolute `border-radius: 0` for all cards, containers, and media elements.
- **DO** use container queries (`@container`) for component-level responsiveness instead of global media queries.
- **DO** map all color usages to tokens; do not hardcode new hex values in style layers.
- **DO** preserve high typographic contrast with large headings in Bebas Neue and legible body copy in DM Sans.
- **DON'T** use soft box-shadows, blurs, or gradients. All depth must use the hard-offset flat shadow tokens (`6px 6px 0 0`).
- **DON'T** mix rounded pills with hard borders within the same container block.
- **DON'T** use generic Tailwind visual utility classes for typography or spacing; stick to the custom tokens.
