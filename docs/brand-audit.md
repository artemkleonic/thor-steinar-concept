# Technical audit — brand-grounded Thor Steinar concept

Date: 9 November 2026. Scope: final `src/App.jsx`, `Storefront.jsx`, `ProductCard.jsx`, `SearchPanel.jsx`, `Dialog.jsx`, `Toast.jsx`, `brand.css`, `data.js`, production asset output, and read-only HTTP checks of official product links. No application source was changed by this audit.

## Implementation integrity verdict

**Pass, with one product-handoff correction recommended.** The implementation is product-specific: six named original garments, original product photographs, explicit product facts and source links, two disclosed AI campaign photographs, a German category/audience search flow, and clearly described demo sizes/basket. The detector returned **zero findings** (`[]`); this is a source scan, not an accessibility certificate. No generic content or decorative invented metrics were found.

## Audit health score

| # | Dimension | Score | Key finding |
|---|---|---:|---|
| 1 | Accessibility | 3/4 | Native modal, visible-focus rule, labelled controls, pressed states, live status; rendered focus/contrast and assistive technology remain outside this independent pass. |
| 2 | Performance | 4/4 | Small local WebP assets, lazy below-fold imagery, high-priority responsive hero, reserved image dimensions, lean production output. Lab timing remains unmeasured. |
| 3 | Theming | 3/4 | Coherent intentionally dark palette; repeated interaction colors remain literals. |
| 4 | Responsive design | 3/4 | Fluid grids, targeted breakpoints, native controls, mobile 44px targets; viewport and physical-touch evidence belongs to root QA. |
| 5 | Implementation integrity | 3/4 | Product-specific and disclosed, but two source links initially land on different pictured colors. |
| **Total** | | **16/20** | **Good — address weak dimensions.** |

These are bounded engineering judgments, not claims of universal AA compliance or measured Core Web Vitals.

## Executive summary

At the inspected source snapshot: **P0: 0; P1: 0; P2: 1; P3: 1**. No task-blocking defect was verified. Prioritize exact pictured-color source handoffs, then optionally consolidate interaction tokens. Independently check image-button keyboard focus visibility in root browser QA before claiming completion.

## Detailed findings

### [P2] Two original-shop links select a different color

- **Location:** `src/data.js:29` (LINES), `src/data.js:44` (SUPPORT 2.0); rendered by `ProductCard.jsx` and `App.jsx` product details.
- **Category:** Implementation integrity.
- **Evidence:** parent source links returned HTTP 200, but official HTML titles were `KAPUZENSWEATSHIRT LINES | weiß | 2XL | 700019178-30-2XL` and `T-SHIRT SUPPORT 2.0 | granat | 3XL | 200010434-89-3XL`. The concept shows Schwarz and Weiß respectively.
- **Impact:** Visitors following a pictured product arrive on a different initial color and must change variants themselves. The model is correct and browsing remains possible.
- **Standard:** Product handoff consistency; no specific WCAG violation established.
- **Recommendation:** Link the verified matching-color variants. LINES `/KAPUZENSWEATSHIRT-LINES/700019178-20-M` and SUPPORT 2.0 `/T-SHIRT-SUPPORT-2.0/200010434-30-M` both returned 200 with matching color titles. Sizes remain illustrative; do not imply live stock.
- **Suggested command:** `$impeccable harden`.

### [P3] Repeated interaction colors bypass tokens

- **Location:** `src/brand.css:104`, `:111`, `:178`, `:201`, `:347`, `:449`, `:724`.
- **Category:** Theming.
- **Evidence:** focus/caret `#df8f83` and hover `#e9a99f` repeat as literals alongside root tokens.
- **Impact:** A future palette adjustment can update primary tokens while leaving interaction colors behind. Current dark rendering is intentional; no broken alternate theme is claimed.
- **Standard:** Design-system maintenance, not a WCAG failure.
- **Recommendation:** Add semantic focus and interactive-hover tokens and use them consistently when next editing this stylesheet.
- **Suggested command:** `$impeccable polish`.

## Explicitly unresolved verification item

`brand.css:511` clips `.product-photo`; its full-size `.photo-button` inherits an outward focus outline (5px offset). That geometry can clip the outline. A different visible focus-within state reveals the quick-view action, so this source observation alone does **not** establish an invisible-focus failure. Root is checking the rendered keyboard state. This item is excluded from issue counts until visually verified.

## Detector evidence and false positives

Executed exactly once after the UI was complete:

`C:/Users/denys/.codex/skills/impeccable/scripts/impeccable.cmd detect --json src`

Complete output saved as `docs/brand-audit-detector.json`: `[]`. There were no detector findings to reclassify and therefore no detector false positives. Do not infer that the detector tested dynamic state, pixel contrast, touch, screen readers, official product accuracy, or all responsive widths.

## Read-only official-link evidence

All six initial model-level URLs returned 200. Checked proposed pictured variants:

| Exact path suffix | HTTP | Resulting title |
|---|---:|---|
| JACKE-EIKIN-II/300015286-20-M | 200 | JACKE EIKIN II · schwarz · M |
| KAPUZENSWEATSHIRT-LINES/700019178-20-M | 200 | KAPUZENSWEATSHIRT LINES · schwarz · M |
| T-SHIRT-SUPPORT-2.0/200010434-30-M | 200 | T-SHIRT SUPPORT 2.0 · weiß · M |
| MUETZE-HALSA/120041564-20 | 200 | MÜTZE HALSA · schwarz |
| DAMEN-KAPUZENJACKE-LEGENDARY/70025076-30-M | 200 | DAMEN KAPUZENJACKE LEGENDARY · weiß · M |
| DAMEN-T-SHIRT-SUPPORT/20020088-30-M | **404** | No product title |

Women's SUPPORT model-level `/DAMEN-T-SHIRT-SUPPORT/20020088` returned 200 and the matching white color, initially 2XL. Retain that valid parent link unless a matching available white suffix is separately verified; do not replace it with the tested 404. These results are time-specific and do not establish stock or availability.

## Positive findings and systemic observations

- Native `dialog.showModal()` supplies modal semantics and inert background; code includes Escape, scroll locking, focus return, and Tab wrapping.
- Buttons use native semantics; favorites and sizes expose `aria-pressed`; inputs and selects have accessible names. Search results and basket confirmations use status/live regions. Headings, landmarks, image descriptions, and a skip link are present.
- Reduced motion removes entry/travel while preserving immediate state changes and short color/opacity feedback; no blanket 0.01ms animation kill.
- Hero has a smaller mobile source and high fetch priority. Other major imagery is lazy loaded with dimensions. Brand WebP images range from about 22–207KB; desktop hero about 88KB and mobile hero about 41KB. Production JS is about 254KB and CSS about 25KB before transport compression. Fonts are local with swap.
- No layout-measurement loops, global will-change, broad filters, third-party tracking, fabricated checkout, or unexplained prices were found. Six products do not warrant speculative memoization work.
- Root colors, typography and surfaces are consistent. A dark-only brief does not require inventing a light-mode switch. Original imagery and AI imagery are described distinctly in visible copy and alt text.

## Recommended actions

1. **[P2] `$impeccable harden`** — use verified pictured-color official product links.
2. **[P3] `$impeccable polish`** — optionally consolidate repeated interaction colors; confirm keyboard photo-button focus visibility while reviewing the final rendered result.

The owner can request these one at a time, together, or in any order. Re-run `$impeccable audit` after fixes to reassess the score; the task-specific detector instruction was to run once, so this audit did not repeat it.

## Limits and context drift

This independent audit intentionally used source, production-file inventory and read-only HTTP only. Root performs browser interaction, screenshots and the requested widths; those results are separate evidence. No browser navigation, storage changes, viewport changes, touch synthesis, Lighthouse/axe run, physical device test, screen-reader session, browser matrix, runtime network trace or pixel contrast sampling was performed here. Existing `docs/QA.md` described the previous anonymous-clothing iteration at inspection time and was not treated as current brand-UI evidence.

Impeccable context reported `PRODUCT.md` legacy-schema drift. Context content was read, no drift or hook wiring was repaired, and an optional future `$impeccable init` owns that metadata migration. The audit used the supplied brief as a subagent without its own discovery interview.

## Post-polish disposition — source review, 9 November 2026

The original audit above is retained as the initial inspected snapshot. This follow-up reviewed only the specific source changes below; it did not rerun the detector or use the browser.

| Item | Disposition | Source evidence |
|---|---|---|
| P2 pictured-color original-shop handoff | **Addressed in source** | `src/data.js:14/29/44/59/74` now use the five exact suffix URLs independently verified as HTTP 200 earlier in this audit. Women's SUPPORT at line 89 retains the valid white parent URL, avoiding the tested M-variant 404. No new live availability claim is made. |
| P3 repeated interaction-color literals | **Addressed in source** | `src/brand.css:27–29` defines `--accent-hover`, `--focus`, `--wish`; focus/caret, repeated hover colors and favorite states now consume these tokens. |
| Photo-button focus clipping concern | **Source mitigation verified; rendered result belongs to root QA** | `.photo-button:focus-visible` at `src/brand.css:522` has a 3px ring with `outline-offset: -5px`, placing it inside the clipped image button. This removes the outward-outline geometry concern; no pixel or keyboard-browser claim is added here. |
| Mobile control sizing | **Source support confirmed** | Mobile icon/favorite controls, quick-view, product-name button, footer controls and toast undo have explicit 44px minimum heights in the inspected stylesheet. Actual target rectangles, text scaling and physical touch remain outside this follow-up. |
| Toast intercepting bottom navigation | **Root-reported reproduced issue; source mitigation verified** | `src/brand.css:1136` keeps `.toast.show` at `pointer-events: none`; `:1141` enables `pointer-events: auto` on the undo button only. Non-action confirmation area therefore does not become a pointer target. Root owns the final interaction regression and undo checks. |

**Disposition count:** zero unresolved verified P0/P1/P2/P3 issues from this independent audit's two original findings. The original 16/20 score is historical: it is not silently promoted to a new rendered-quality score from source edits alone. Broad UI, screenshot, viewport, focus, contrast and gesture verification remain with root's final-build QA. The saved one-time detector output remains `[]`; it predates these small polish changes and was not rerun, as instructed.
