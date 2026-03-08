# Pinnacle Law — Quote Flow Redesign: Developer Prompt

## Overview & Objective

You are rebuilding the client acquisition flow for the Pinnacle Law website — a static HTML/CSS/JS site with a centralised design token architecture (`theme/variables.css` and `theme/config.js`). The goal is to replace the current two-CTA homepage pattern and standalone quote form with a unified, intelligent self-serve journey that takes a visitor from the homepage through to a personalised quote page and, if ready, directly into instructing via the InTouch CRM webhook.

**No third-party frameworks. No build tools. Vanilla HTML, CSS, and JavaScript only.** All code must respect the existing design system exactly — every colour, font, shadow, radius, and spacing token must come from `theme/variables.css`. Do not introduce new hardcoded values.

---

## Files to Create or Modify

1. **`index.html`** — Modify CTAs only (homepage)
2. **`quote.html`** — Completely rebuild (quote selector flow)
3. **`quote-result.html`** — Create new (personalised quote page + email modal + instruction CTA)
4. **`instruct.html`** — Create new (dedicated instruction form page)

Do not modify any other files. Do not touch `theme/variables.css`, `theme/config.js`, or any service pages.

---

## Existing Codebase Context

### Design System
- **Fonts:** `DM Sans` (body), `Fraunces` (headings) — loaded via Google Fonts
- **Accent colour:** `#8B1538` (Pinnacle Crimson) — available as `var(--accent)`
- **Full token set** in `theme/variables.css` — use exclusively
- **Nav pattern:** Fixed, glass-effect, grid `1fr auto 1fr`, logo left, pill nav centre, CTAs right
- **Button classes:** `.btn .btn-primary`, `.btn .btn-secondary`, `.btn-large`
- **Aurora background:** Animated radial gradient layers used on hero and CTA sections

### InTouch CRM Integration
The site uses InTouch for both quote forms and instruction forms via their JavaScript SDK:
```html
<script src="https://static.intouch.cloud/forms/forms.js"></script>
<link rel="stylesheet" href="https://static.intouch.cloud/forms/forms.css">
```

Initialised per form type:
```javascript
intouchForm.init({
  guid: 'GUID_HERE',
  container: document.getElementById('container-id'),
  serverUrl: 'https://go.intouchapp.co.uk',
  country: 'UK'
});
```

**Existing quote form GUIDs (already working — do not change):**
```javascript
buying:  '6093ac2d-3f4b-4f0c-8cb4-931755487955'
selling: '948bc661-71db-4b01-bd9d-0d56b552ffc5'
both:    '88d63f94-d199-4464-aad4-04abb8e2d2ae'
```

**Instruction form GUIDs** — Phil will provide these. Use placeholders:
```javascript
instruct_buying:  'INSTRUCT_BUYING_GUID'
instruct_selling: 'INSTRUCT_SELLING_GUID'
instruct_both:    'INSTRUCT_BOTH_GUID'
```

---

## Pricing Reference (from `theme/config.js`)
```
Purchase:      £1,795 + VAT  (£2,154 inc VAT)
Sale:          £1,595 + VAT  (£1,914 inc VAT)
Sale & Buy:    £3,390 + VAT  (£4,068 inc VAT)
Search pkg:    £245 + VAT    (purchase/both only)
```

---

## Part 1: `index.html` — Homepage CTA Changes

### Change Required
The homepage currently has two CTAs: "Get Quote Information" and "Start My Transaction". These both link to `quote.html`. This is the **only** change needed to `index.html`.

Replace all instances of the two-CTA button pattern with a **single CTA**:

```html
<a href="quote.html" class="btn btn-primary btn-large">Get Started</a>
```

This applies in three locations:
1. `.hero-buttons` div in the hero section
2. `.cta-buttons` div in the bottom CTA section
3. The `.nav-right` div in the navigation (replace both buttons with one primary button)

The nav-right single CTA should use `.btn .btn-primary` (not `.btn-large`).

---

## Part 2: `quote.html` — Transaction Type Selector

This page is a clean, minimal step that asks the client one question before forwarding them to the correct quote result page. It should feel like the beginning of a journey, not a form.

### Remove
- The existing InTouch quote form embed entirely
- The tab-based form panels
- All InTouch SDK references (script and CSS)

### Page Structure

**Header:** Keep existing nav (copy from current `quote.html` verbatim). Keep page header with title "Get Your Fixed-Fee Quote" and subtitle "Takes less than 30 seconds. No obligation. No upfront cost."

**Selector Section:** A single centred card (max-width: 720px) containing:

1. A short prompt above the cards: `"What are you looking to do?"`  — use `var(--font-heading)`, ~22px, centred.

2. Three large, clickable selection cards laid out in a row (CSS grid, 3 columns, gap 16px). Each card:
   - Full border-radius 20px
   - Border: `1px solid var(--border)`
   - Background: `var(--bg)`
   - Padding: 32px 24px
   - Hover: border-color `var(--accent-border)`, background `var(--accent-bg)`, translateY(-4px), transition 0.25s
   - Selected state: border-color `var(--accent)`, background `var(--accent-bg)`, box-shadow `0 0 0 3px var(--accent-border)`
   - Contains: emoji icon (large, ~40px), transaction type heading (DM Sans, 600, 18px), short description (text-light, 14px)

   Card content:
   - 🏠 **Selling a Property** — "You have a buyer and need a conveyancer for your sale"
   - 🔑 **Buying a Property** — "You have an offer accepted and need a conveyancer for your purchase"
   - 🔄 **Selling & Buying** — "You are selling your current home and buying a new one"

3. A "Continue" button (`btn btn-primary btn-large`, full width, border-radius 14px) that is **disabled and visually muted** until a card is selected. On click, navigate to:
   - `quote-result.html?type=selling`
   - `quote-result.html?type=buying`
   - `quote-result.html?type=both`

4. Below the button, a small trust strip (same pattern as existing site):
   `✓ Fixed fee · ✓ No upfront cost · ✓ No fee if it falls through · ✓ CLC Regulated`

### JavaScript Logic
```javascript
let selected = null;

function selectType(type) {
  // Remove selected state from all cards
  document.querySelectorAll('.type-card').forEach(c => c.classList.remove('selected'));
  // Add to clicked card
  document.querySelector('[data-type="' + type + '"]').classList.add('selected');
  selected = type;
  // Enable continue button
  document.getElementById('continue-btn').disabled = false;
  document.getElementById('continue-btn').classList.add('active');
}

document.getElementById('continue-btn').addEventListener('click', function() {
  if (selected) window.location.href = 'quote-result.html?type=' + selected;
});
```

---

## Part 3: `quote-result.html` — The Personalised Quote Page

This is the centrepiece of the new flow. It is a long-form, conversion-optimised page that replicates the content of the existing PDF quotes in a rich, interactive web format. It must work as a **complete standalone page** — a client could land here cold (e.g. from a referral link) and have everything they need to instruct.

### URL Parameter
On page load, read `?type=` from the URL. Valid values: `buying`, `selling`, `both`. Default to `buying` if absent or invalid.

Use this to populate all dynamic content throughout the page.

### Sticky CTA Bar

A fixed bar at the bottom of the viewport. Always visible. Slim (64px height). Does not obscure content — add `padding-bottom: 80px` to page body to compensate.

```
Left side:  Transaction type badge — e.g. "Buying a Property · £2,154 inc VAT"
Right side: Two buttons — "📧 Email Me This Quote"  |  "Start My Instruction →"
```

Styling:
- Background: white
- Border-top: `1px solid var(--border)`
- Box-shadow: `0 -4px 24px rgba(0,0,0,0.06)`
- z-index: 200
- Padding: 0 48px
- Display: flex, justify-content: space-between, align-items: center

Buttons in sticky bar:
- "Email Me This Quote": `.btn .btn-secondary` (triggers email modal)
- "Start My Instruction →": `.btn .btn-primary` (navigates to `instruct.html?type=[type]`)

### Page Sections (in order)

Wrap all content sections in a `max-width: 860px` centred container with `padding: 80px 48px`.

---

#### Section 1: Quote Hero

A prominent, personalised fee display at the very top of the page content (below nav, above everything else). Uses aurora background (same as homepage hero, but lighter opacity — `opacity: 0.4`).

Content:
- Small label: `"Your Fixed-Fee Quote"` — uppercase, letter-spacing, `var(--accent)` colour
- Large heading (Fraunces, ~52px): Dynamic based on type:
  - buying: `"Buying a Property"`
  - selling: `"Selling a Property"`
  - both: `"Selling & Buying"`
- Fee display card (white, border, rounded, shadow) containing:
  - The fee ex-VAT (large, Fraunces, ~44px, accent colour)
  - "inc. VAT: £X,XXX" in text-light below
  - For `both`: show two lines (sale fee + purchase fee = total)
  - For `buying`: show search package note below: "+ Search Package from £294 inc VAT (if required)"
- Three guarantee pills in a row:
  - `✓ Fixed — price never changes`
  - `✓ No move, no fee`
  - `✓ No upfront cost`

Then immediately: the **first set of inline CTAs** (not sticky — these live in the page flow):
```html
<div class="inline-cta-block">
  <button class="btn btn-primary btn-large" onclick="openEmailModal()">📧 Email Me This Quote</button>
  <a href="instruct.html?type=[type]" class="btn btn-secondary btn-large">Start My Instruction →</a>
</div>
```

---

#### Section 2: Payment Terms

Section title: `"Payment Terms"` (Fraunces, ~28px)

Three cards in a row (grid, 3 columns, gap 16px). Each card: white background, border, rounded-16, padding 28px, accent icon.

- **No Upfront Cost** — "There is no deposit and no upfront payment required. Once you complete the instruction form, we simply get to work."
- **Pay on Completion** — "Our fees are only due if your transaction completes successfully. You'll be asked to pay just before you pick up your keys."
- **No Abortive Fees** — "If your transaction falls through for any reason, you owe us nothing. We'd rather keep you as a client for your next move."

---

#### Section 3: What Makes Us Different — Comparison Table

Section title: `"How is this different from other conveyancing quotes?"`

Intro paragraph: "Our fee is fully comprehensive, fixed and guaranteed. It never changes, even if complexities arise. We never charge more than quoted — ever."

A styled comparison table. Full width. Alternating row backgrounds (`var(--bg)` / `var(--bg-off)`). Border: `1px solid var(--border)`. Border-radius: 16px (clip overflow). Header row background: `var(--accent)`, white text.

Columns: | What's Included | Pinnacle Law | Other Conveyancers |

Rows:
| Row | Pinnacle | Others |
|---|---|---|
| 'Base' Legal Fees | ✅ Included | ⚠️ Included, but only part of the total |
| 'Case Set Up' Fees | ✅ Included | ❌ Not included — added separately |
| ID Check Costs | ✅ Included | ❌ Not included — added separately |
| Bank Transfer Fees | ✅ Included | ❌ Not included — added separately |
| Land Registry Document Costs | ✅ Included | ❌ Not included — added separately |
| Stamp Duty Return Submission | ✅ Included | ❌ Not included — added separately |
| Mortgage Legal Fee (if applicable) | ✅ Included | ❌ Not included — added separately |
| Leasehold Legal Fee (if applicable) | ✅ Included | ❌ Not included — added separately |
| Gifted Funds AML Fees (if applicable) | ✅ Included | ❌ Not included — added separately |
| Any other legal costs | ✅ Included | ❌ Not included — added separately |

Pinnacle column cells: green tick emoji, bold "Included", accent colour text.
Others column cells: red cross emoji, italic grey text.

Note: for the `selling` type, omit "Stamp Duty Return Submission" and "Gifted Funds AML Fees" rows as these are purchase-specific. For `both`, include all rows.

---

#### Section 4: Other Costs to Consider

Section title: `"What other costs should I budget for?"`

Intro: "Our fee covers everything we do. These are third-party costs outside our control that you should be aware of."

Render as styled expandable accordion items (click to expand/collapse). Each item has a heading and body text. Closed state shows heading + chevron only. Open state reveals the explanatory paragraph.

**Items for `buying` and `both`:**
- Mortgage Broker Fees
- Mortgage Arrangement Fees & Lender Charges
- Land Registry Registration Fee
- Stamp Duty Land Tax (with link to HMRC calculator: https://www.tax.service.gov.uk/calculate-stamp-duty-land-tax)
- Indemnity Insurance (if needed)
- Removal Costs

**Additional item for `selling` and `both`:**
- Estate Agent Fees
- Mortgage Exit / Early Repayment Charges

Use the exact explanatory copy from the PDFs for each item. This is important for accuracy.

Accordion implementation: pure CSS + JS toggle. No libraries. Add/remove `.open` class on click. Animate max-height for smooth expand.

---

#### Section 5: FAQ

Section title: `"Frequently Asked Questions"`

Same accordion pattern as Section 4. Always show all FAQ items regardless of transaction type.

Questions and answers (use exact copy from PDF — this is client-facing legal/commercial content):

1. **Is this really a fixed fee quote?**
2. **Other companies claim to offer a 'fixed fee' — how is yours different?**
3. **Do you take any upfront payments or deposit payments?**
4. **What happens if my transaction falls through?**
5. **I've found a cheaper quote — what is it missing?**
6. **I've found a much more expensive quote — why is yours cheaper?**
7. **How do I accept the quote and get started?** — Answer should reference the "Start My Instruction" button on this page, not an email link
8. **What are the next steps after instructing?**
9. **Who will I work with?**
10. **Do you have capacity?**
11. **Do you have the expertise?**

---

#### Section 6: Second Inline CTA Block

Identical to the CTA block in Section 1. Repeat it here so it's always visible after reading the FAQ without needing to scroll back up.

```html
<div class="inline-cta-block">
  <button class="btn btn-primary btn-large" onclick="openEmailModal()">📧 Email Me This Quote</button>
  <a href="instruct.html?type=[type]" class="btn btn-secondary btn-large">Start My Instruction →</a>
</div>
```

Below the buttons, add: `"Have questions? Call us: 020 3948 6660 · hello@pinnacle.law"`

---

#### Section 7: Testimonials Strip

Three testimonial cards in a row. Same `.testimonial-card` pattern from `index.html`. Use the three existing testimonials (Lucy, Oscar, Anita). This is a trust reinforcement section — keep it clean and consistent with the rest of the site.

---

### Email Quote Modal

Triggered by any "Email Me This Quote" button. A modal overlay.

**Overlay:** `position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 300; display: flex; align-items: center; justify-content: center;`

**Modal card:** `background: white; border-radius: 24px; padding: 48px; max-width: 480px; width: 90%; position: relative;`

**Close button:** Top-right corner. `×` symbol. Clicking closes modal and resets form.

**Content:**
- Heading: `"Get this quote by email"` (Fraunces, 28px)
- Subtext: `"We'll send you a copy of this quote to keep. Takes 10 seconds."`
- Three fields (standard HTML inputs, styled to match site aesthetic):
  - Full Name (required)
  - Email Address (required, type="email")
  - Phone Number (required, type="tel")
- Primary submit button: `"Send My Quote"` (full width, `.btn .btn-primary`)

**On submit:**
1. Validate all three fields (non-empty, valid email format)
2. Fire the InTouch quote webhook for the current transaction type using the existing GUIDs
3. Show a success state within the modal (replace form with a confirmation message):
   - Heading: `"Quote sent! ✓"`
   - Body: `"Check your inbox — we've sent your quote to [email]. Our team may be in touch to answer any questions."`
   - Button: `"Close"` (closes modal)
4. Also update the sticky bar "Email Me This Quote" button to show `"✓ Quote Sent"` with muted styling (non-clickable) for the remainder of the session

**InTouch form initialisation for email capture:**
The quote forms (buying/selling/both) already exist via the GUIDs above. The modal should initialise the relevant InTouch form invisibly in the background on page load (not inside the modal — render into a hidden `div`), then programmatically submit it with the name/email/phone values when the modal form is submitted.

Alternatively, if the InTouch SDK does not support programmatic submission, the modal should instead POST to the InTouch webhook endpoint directly using `fetch()` with the form data. Phil will confirm which approach the InTouch API supports — use the programmatic SDK approach as the primary implementation and add a `// TODO: confirm InTouch submission method` comment.

---

## Part 4: `instruct.html` — Instruction Form Page

A clean, focused page for completing the instruction form. The client arrives here from `quote-result.html`.

### URL Parameter
Read `?type=` from URL. Use to:
1. Display the correct transaction type heading
2. Load the correct InTouch instruction form GUID

### Page Structure

**Nav:** Standard nav (copy from `quote.html`). No active state on Get a Quote link.

**Page header (no aurora — keep it clean and focused):**
- Breadcrumb: `Home › Get a Quote › Start My Instruction`
- Heading: `"Let's Get Started"` (Fraunces)
- Subtext: Dynamic: e.g. `"You're instructing us for your [purchase / sale / sale and purchase]. This form takes around 5 minutes to complete."`
- Below subtext, three small guarantee pills (same as quote-result.html hero)

**Progress indicator:**
A slim visual indicator showing the client where they are:
```
[1. Get a Quote ✓]  →  [2. Your Details ←you are here]  →  [3. We Get to Work]
```
Style: horizontal flex, steps connected by a line, completed steps in accent colour, current step highlighted.

**Form section:**
A white card (border, shadow, border-radius 20px, padding 48px) containing the InTouch instruction form embed.

For `buying` and `selling`, initialise a single form:
```javascript
intouchForm.init({
  guid: QUOTE_CONFIG[type].intouchInstructGuid,
  container: document.getElementById('intouch-instruct-form'),
  serverUrl: 'https://go.intouchapp.co.uk',
  country: 'UK'
});
```

For `both`, the instruction flow requires **two sequential forms** — the sale leg must be completed first, after which InTouch triggers the purchase leg automatically. Implement as follows:

- On page load, render a sub-step indicator above the form: `"Step 1 of 2: Your Sale Details → Step 2 of 2: Your Purchase Details"`
- Initialise the sale leg form first (guid: `99b10b5b-1cd6-4755-93fa-585b86644deb`)
- InTouch handles the transition to the purchase leg form (guid: `c313a1ae-9ffa-418b-bc43-4ceed7a23b70`) automatically after sale form submission — do not attempt to programmatically trigger this
- Add a note below the form: `"As you are both selling and buying, you'll complete two short forms — one for each transaction. InTouch will guide you through both."`

**Alongside the form (sidebar on desktop, stacked on mobile):**
A slim summary card showing:
- Transaction type
- Fee (inc VAT)
- Three guarantee bullets
- Contact info: "Questions? Call 020 3948 6660"

Layout: `display: grid; grid-template-columns: 1fr 320px; gap: 40px;` on desktop. Single column on mobile.

**On mobile (< 768px):** Summary card collapses to an accordion above the form.

---

## Responsive Behaviour

All pages must be fully responsive. Breakpoints:

- **> 900px:** Full desktop layout as described above
- **768px–900px:** Three-column grids collapse to two columns. Nav centre hides (hamburger).
- **< 768px:**
  - All grids collapse to single column
  - Sticky CTA bar stacks vertically (two buttons full width, fee label above)
  - Modal is full-height on mobile (`border-radius: 24px 24px 0 0`, anchored to bottom)
  - Comparison table scrolls horizontally (overflow-x: auto on wrapper)
  - Accordion items remain full width

---

## Animations & Polish

- Reuse the `fadeUp` / `fade-up-1` through `fade-up-4` animation pattern from `index.html` on page hero content
- Accordion open/close: smooth `max-height` transition (0 → auto equivalent using max-height: 1000px trick)
- Modal open: fade-in overlay + scale-up card (`transform: scale(0.95) → scale(1)`, 200ms ease)
- Card hover states: `transition: all 0.25s ease` throughout
- Sticky bar CTA "Start My Instruction →" should pulse subtly on first load to draw attention (single animation, not looping):
  ```css
  @keyframes pulse-once {
    0% { box-shadow: 0 0 0 0 var(--accent-shadow-md); }
    50% { box-shadow: 0 0 0 8px transparent; }
    100% { box-shadow: none; }
  }
  ```

---

## Code Quality Requirements

- All JavaScript must be vanilla ES5-compatible (no arrow functions, no destructuring, no template literals in the InTouch init blocks) for maximum browser compatibility, **except** where the existing codebase already uses ES6 — match the existing standard
- No inline `style=""` attributes on elements — all styling via classes or `<style>` blocks
- All dynamic text (fee amounts, transaction type labels) should be driven from a single JavaScript config object at the top of each page's `<script>` block — not scattered throughout the DOM manipulation code
- Use `const` and `let` throughout (consistent with existing codebase)
- All pages must pass basic accessibility: semantic HTML, `aria-label` on icon-only buttons, `role="dialog"` and `aria-modal="true"` on modal, focus trapping inside open modal, `Escape` key closes modal
- Add `<!-- PLACEHOLDER: INSTRUCT_[TYPE]_GUID -->` comments next to instruction form GUIDs so Phil can find and replace them easily

---

## Data Config Object (top of each script block)

At the top of `quote-result.html` and `instruct.html`, define:

```javascript
const QUOTE_CONFIG = {
  buying: {
    label: 'Buying a Property',
    feeExVat: '£1,795',
    feeIncVat: '£2,154',
    feeExVatRaw: 1795,
    feeIncVatRaw: 2154,
    showSearchPackage: true,
    showStampDuty: true,
    showGiftedFunds: true,
    intouchQuoteGuid: '6093ac2d-3f4b-4f0c-8cb4-931755487955',
    intouchInstructGuid: '22670c8b-c0bc-4b2e-af5e-b11ecfdd2ce4'
  },
  selling: {
    label: 'Selling a Property',
    feeExVat: '£1,595',
    feeIncVat: '£1,914',
    feeExVatRaw: 1595,
    feeIncVatRaw: 1914,
    showSearchPackage: false,
    showStampDuty: false,
    showGiftedFunds: false,
    intouchQuoteGuid: '948bc661-71db-4b01-bd9d-0d56b552ffc5',
    intouchInstructGuid: '50a6928d-638c-4324-823c-741088daa8fc'
  },
  both: {
    label: 'Selling & Buying',
    feeExVat: '£3,390',
    feeIncVat: '£4,068',
    feeExVatRaw: 3390,
    feeIncVatRaw: 4068,
    saleFeeExVat: '£1,595',
    saleFeeIncVat: '£1,914',
    purchaseFeeExVat: '£1,795',
    purchaseFeeIncVat: '£2,154',
    showSearchPackage: true,
    showStampDuty: true,
    showGiftedFunds: true,
    intouchQuoteGuid: '88d63f94-d199-4464-aad4-04abb8e2d2ae',
    // Sale & Purchase requires TWO instruction forms — sale leg first, then purchase leg
    // The sale leg form (below) must be completed first; InTouch then triggers the purchase leg
    intouchInstructSaleGuid: '99b10b5b-1cd6-4755-93fa-585b86644deb',
    intouchInstructPurchaseGuid: 'c313a1ae-9ffa-418b-bc43-4ceed7a23b70'
  }
};
```

---

## Summary of Files & Deliverables

| File | Action | Key Changes |
|---|---|---|
| `index.html` | Modify | Single "Get Started" CTA replacing two CTAs in hero, CTA section, and nav |
| `quote.html` | Rebuild | Transaction type selector only — no forms, no InTouch embeds |
| `quote-result.html` | Create | Full personalised quote page — fee display, comparison table, other costs accordion, FAQ accordion, email modal, sticky CTA bar |
| `instruct.html` | Create | Focused instruction form page with InTouch embed, progress indicator, summary sidebar |

---

## Final Notes for the Developer

- The `.claude/` folder in the repo suggests this project is already being worked on with Claude Code — check for any existing project instructions or memory files there before starting
- The `theme/variables.css` file is the canonical source for all CSS tokens — if you find yourself writing a colour value, font name, or shadow that isn't already in a variable, stop and use the nearest existing token
- The `pinnacle_website` file at root (no extension) in the repo may be a Claude Code project file — do not delete or overwrite it
- Test the `?type=` URL parameter logic thoroughly — this parameter drives the entire personalisation of `quote-result.html` and `instruct.html`
- The InTouch SDK is loaded asynchronously — ensure the `intouchForm.init()` call is wrapped in a `DOMContentLoaded` listener or placed at the bottom of the body
- Phil uses VS Code with Claude integration to manage this codebase — write clean, well-commented code that is easy to amend incrementally
