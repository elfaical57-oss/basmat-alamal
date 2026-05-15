# Design Spec — جمعية بصمة الأمل Website
**Date:** 2026-05-15

## Overview

A bilingual (Arabic/French) one-page scrollable website for **جمعية بصمة الأمل** (Basmat Al Amal Association), a community organization based in Tangier, Morocco, that helps families in need through donations.

## Goals

- Present the association and its mission
- Enable visitors to donate via bank transfer
- Provide a contact point (phone/WhatsApp/Facebook)

## Out of Scope

- CMS or admin panel
- Payment gateway integration
- Blog or news feed
- Volunteer registration

---

## Visual Design

**Colors** (extracted from logo):
- Primary Blue: `#4a7fa5`
- Primary Red: `#c0392b`
- White: `#ffffff`
- Light background: `#f4f7fa`

**Typography:**
- Arabic: Cairo (Google Fonts) — RTL
- French: Poppins (Google Fonts) — LTR
- Language toggle switches direction of entire page

**Logo:** Provided by client (fingerprint on hand, blue + red)

---

## Architecture

Single HTML file (`index.html`) with embedded CSS and vanilla JS. No framework, no build step. Deployable on any static host (GitHub Pages, Netlify, shared hosting).

```
basmat-alamal/
├── index.html       # All sections in one file
├── assets/
│   └── logo.png     # Association logo
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-05-15-basmat-alamal-website-design.md
```

---

## Page Sections

### 1. Navigation (fixed top)
- Logo (left) + association name
- Anchor links: Accueil / À propos / Faire un don / Contact
- Language toggle button: **AR | FR**
- Background: white, bottom border red `#c0392b`

### 2. Hero
- Full-width gradient background (blue shades)
- Centered logo
- Arabic slogan: "ضع البصمة ترسم البسمة"
- French slogan: "Laissez une empreinte, dessinez un sourire"
- Red CTA button → scrolls to Donation section

### 3. À propos / من نحن
- White background
- Two columns (icon + text) describing mission
- Key message: helping families in need during hard times
- Bilingual text block

### 4. Faire un don / تبرع الآن
- Blue background card
- BMC Bank RIB: `011.640.0000.09.200.00.13473.55`
- Note about cardless service
- WhatsApp button linking to `0645384897`
- Clear step-by-step instructions

### 5. Contact / اتصل بنا
- White background
- Phone number: `0645384897`
- Facebook page link
- WhatsApp button

### 6. Footer
- Association name + slogan
- © 2026

---

## Bilingual Behavior

- Default language: Arabic (RTL, `dir="rtl"`)
- Toggle button switches to French (LTR, `dir="ltr"`)
- All text nodes have `data-ar` and `data-fr` attributes
- JS swaps text content and page direction on toggle

---

## Responsiveness

- Mobile-first CSS
- Navigation collapses on small screens
- All sections stack vertically on mobile

---

## Accessibility

- Semantic HTML (`<nav>`, `<section>`, `<footer>`)
- `lang` attribute updated on toggle (`ar` / `fr`)
- Sufficient color contrast on all text
