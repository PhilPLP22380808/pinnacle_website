/**
 * ============================================================
 * PINNACLE LAW — SINGLE SOURCE OF TRUTH FOR ALL BRANDING
 * ============================================================
 * This file is the canonical reference for every design and
 * branding value used across the Pinnacle Law website.
 *
 * To rebrand the firm — change the firm name, colours, fonts,
 * contact details, pricing, or logo — edit ONLY THIS FILE,
 * then propagate non-CSS values (firm name in HTML, pricing
 * figures) to the relevant HTML pages.
 *
 * All visual tokens are also declared as CSS custom properties
 * in theme/variables.css, which is linked in every HTML page.
 * CSS changes must be made there (keep both files in sync).
 *
 * This module uses ES Module syntax and works with any build
 * tool or a <script type="module"> tag.
 * ============================================================
 */

export const theme = {

  /* Firm Identity */
  firm: {
    name:          'Pinnacle Law',
    legalName:     'Pinnacle Property Lawyers Ltd',
    companyNumber: '14308410',
    vatNumber:     'GB449169360',
    clcLicence:    '14971',
    tagline:       'Conveyancing that puts you back in control',
    description:   'Fixed fees, real-time updates, and expert solicitors who actually respond.',
  },

  /* Contact Details */
  contact: {
    email: 'hello@pinnacle.law',
    offices: [
      { city: 'London',   address: '1 King William Street, EC4N 7BJ',                    phone: '020 3948 6660', tel: 'tel:02039486660' },
      { city: 'Norwich',  address: 'Fuel Studios, Pottergate, NR2 1DX',                   phone: '01603 517660',  tel: 'tel:01603517660'  },
      { city: 'Bradford', address: 'Carlisle Business Centre, 60 Carlisle Road, BD8 8BD', phone: '020 3948 6660', tel: 'tel:02039486660' },
    ],
    hours: { weekdays: '9:00am \u2013 5:30pm', weekends: 'Closed' },
  },

  /* Pricing (all figures ex-VAT unless noted) */
  pricing: {
    buying:        { fee: 1795, incVat: 2154, label: '\u00a31,795 + VAT' },
    selling:       { fee: 1595, incVat: 1914, label: '\u00a31,595 + VAT' },
    both:          { fee: 3390, incVat: 4068, label: '\u00a33,390 + VAT' },
    searchPackage: { fee: 245,                label: '\u00a3245 + VAT'   },
  },

  /* Logo */
  logo: {
    src:    'assets/Pinnacle logo.png', /* relative to HTML files at site root */
    alt:    'Pinnacle Law',
    height: '50px',
  },

  /* Colours — mirror of theme/variables.css */
  colors: {
    bg:     '#FFFFFF',
    bgOff:  '#FAFAFA',
    text:        '#1A1A1A',
    textLight:   'rgba(26,26,26,0.6)',
    textLighter: 'rgba(26,26,26,0.45)',

    accent:        '#8B1538',
    accentLight:   '#A91D45',
    accentLighter: '#C42952',

    accentBg:     'rgba(139,21,56,0.04)',
    accentBorder: 'rgba(139,21,56,0.10)',
    border:       'rgba(139,21,56,0.08)',

    accentHoverSubtle:     'rgba(139,21,56,0.06)',
    accentHoverMedium:     'rgba(139,21,56,0.08)',
    accentHoverBorder:     'rgba(139,21,56,0.20)',
    accentFeaturedBorder:  'rgba(139,21,56,0.15)',
    accentFeaturedBg:      'rgba(139,21,56,0.05)',
    accentFeaturedBgLight: 'rgba(139,21,56,0.02)',

    accentShadowSm: 'rgba(139,21,56,0.12)',
    accentShadowMd: 'rgba(139,21,56,0.25)',
    accentShadowLg: 'rgba(139,21,56,0.08)',

    aurora: {
      accentStrong:        'rgba(139,21,56,0.28)',
      accentMid:           'rgba(139,21,56,0.10)',
      accentLightStrong:   'rgba(169,29,69,0.22)',
      accentLightMid:      'rgba(169,29,69,0.08)',
      accentLighterStrong: 'rgba(196,41,82,0.18)',
      accentLighterMid:    'rgba(196,41,82,0.05)',
    },

    navBg:      'rgba(255,255,255,0.92)',
    navBgSolid: 'rgba(255,255,255,0.95)',

    whiteGlassHeavy: 'rgba(255,255,255,0.85)',
    whiteGlass:      'rgba(255,255,255,0.80)',
    white70: 'rgba(255,255,255,0.70)',
    white60: 'rgba(255,255,255,0.60)',
    white50: 'rgba(255,255,255,0.50)',
    white40: 'rgba(255,255,255,0.40)',
    white10: 'rgba(255,255,255,0.10)',
    white05: 'rgba(255,255,255,0.05)',
  },

  /* Typography */
  typography: {
    fontBody:       "'DM Sans', -apple-system, sans-serif",
    fontHeading:    "'Fraunces', Georgia, serif",
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&display=swap',
  },

};

export default theme;
