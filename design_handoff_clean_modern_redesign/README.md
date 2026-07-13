# Handoff: "Clean & Modern" visual refresh — TETFUND Staff Attendance

## Overview
A visual refresh of the existing TETFUND Attendance PWA (repo: `successdanesy/Tetfund-Attendance-App`). Same structure, routes, and components as today — only the design tokens, elevation, and a few icon/illustration touches change. No new screens, flows, or data requirements.

## About the design files
The bundled file (`Attendance Redesign.dc.html`) is a **design reference built in HTML**, not production code. It is a set of static mobile-frame mockups of the real screens, in canvas/board layout for review. Your job is to **port the visual changes into the existing Next.js codebase** — edit the real components in `components/` and the token file `app/globals.css`, not copy any HTML/CSS from the mockup verbatim.

## Fidelity
**High-fidelity.** Exact hex values, radii, spacing and shadow values are given below and should be applied pixel-for-pixel.

## Where this plugs into the real codebase
Everything flows from `app/globals.css`'s `@theme` block, consumed by `components/Screen.tsx`, `Button.tsx`, `Field.tsx`, `Note.tsx`, `StatusBadge.tsx`, `BottomNav.tsx`, `AdminShell.tsx`, `Logo.tsx`, and `Stamp.tsx`. Because every screen consumes those tokens/components, most of this refresh is achievable by editing the theme + those ~9 shared files rather than each `app/**/page.tsx`.

## Design tokens — changes to `app/globals.css` `@theme`

| Token | Current | New |
|---|---|---|
| `--color-brand` | `#1b5e3f` | `#146b45` |
| `--color-brand-dark` | `#14472f` | `#0e4a30` |
| `--color-surface` | `#f7f8f5` | `#f6f7f5` (keep, close match) |
| `--color-line` | `#dcdcd4` | `#e2e5e1` |
| `--color-ink` | `#1a1a18` | `#14171a` |
| `--color-ink-soft` | `#5c5c57` | `#5c6168` |
| new: `--color-accent` | — | `#d97706` (warm amber/orange — the app's new secondary color) |
| `--color-success-bg` / `-ink` | `#eaf3de` / `#173404` | `#e7f2e9` / `#0f3d21` |
| `--color-pending-bg` / `-ink` | `#faeeda` / `#412402` | keep, or lighten bg slightly — not critical |
| `--color-error-bg` / `-ink` | `#fcebeb` / `#501313` | keep `#fcebeb` / recolor ink to `#b0261a` to match new danger color |
| new: `--radius-card` | — | `14px` (was ad hoc `rounded-xl`/`rounded-2xl` — now consistent) |
| Font | `--font-public-sans` (body) | Add `Manrope` (Google Font, weights 400/500/600/700/800) as the display/heading weight for `h1`/`h2` and nav/button labels; keep Public Sans for body copy. Swap in `app/layout.tsx`'s font loader + reference in `@theme`'s `--font-sans` fallback chain, or add a second `--font-heading: var(--font-manrope), ...` token and apply it via a utility class on headings only. |

Shadow / elevation (new — the current app has none):
- Card/list-item elevation: `box-shadow: 0 2px 6px rgba(20,23,26,0.04), 0 16px 32px rgba(20,23,26,0.08)` — add to whatever the top-level page card/list-item wrapper is (e.g. `AdminShell`'s `<main>`, `history`/`approvals` list items).
- Primary button shadow: `box-shadow: 0 8px 16px rgba(20,107,69,0.22)` on `Button.tsx`'s `primary` variant only (not secondary/danger).
- Increase corner radius app-wide: buttons/inputs from `rounded-xl` (12px) → `14px`; big cards (list items, approval cards) from `rounded-2xl` → `16–20px`.

## Component-by-component changes

### `components/Button.tsx` / `components/LinkButton.tsx`
- `primary` variant: add the shadow above (unchanged color, still `--color-brand` green).
- **New rule — orange is the secondary/standalone-action color, not a full new `variant`:**
  - `LinkButton`'s existing `secondary` variant (currently green border/text) → recolor to `--color-accent` orange border + text. This is the "Create account" button on the Welcome screen (`app/page.tsx`) and any other outline/secondary CTA.
  - Any **solid, non-primary-flow action button** — i.e. a button that isn't the main "do the primary task" button on its screen but still needs a solid fill (e.g. "Download CSV" in `app/admin/attendance/page.tsx`) — switch from green to solid orange (`background: var(--color-accent)`, shadow `0 6px 14px rgba(217,119,6,0.25)`).
  - Keep `danger` (red, Sign out/Reject) and the main-flow `primary` (green, Sign in/Approve/Clock in) exactly as they are — orange only replaces the *secondary* outline case and one-off utility actions like CSV export, never the primary or destructive actions.
- No structural/size change — same component props, just new color logic for `secondary`.

### `components/BottomNav.tsx`
- Active item: add a 4px amber (`--color-accent`) dot centered above the active icon (`position:absolute; top:0`).

### `components/Stamp.tsx`
- Change the checkmark path's stroke color from `var(--color-brand)` to `var(--color-accent)` (amber) so ring = brand green, check = amber.
- Add a soft radial amber glow behind the whole stamp: a `position:absolute` div, `radial-gradient(circle, rgba(217,119,6,0.14), rgba(217,119,6,0) 70%)`, sized ~1.1x the stamp, centered behind it.

### `components/Note.tsx` / `StatusBadge.tsx`
- Just the token color swaps above — no structural change.

### `components/AdminShell.tsx`
- Active tab: replace the `bg-white text-brand` solid-fill treatment with white bg + a 2px amber bottom-inset border (`box-shadow: 0 -2px 0 var(--color-accent) inset`) so the active state reads as an underline rather than a filled tab.
- Give the pending-count badge (`t.count`) the amber accent color instead of the current green-on-white / white-on-green swap.

### `app/page.tsx` (Welcome/root screen)
No structural change, but suggest adding a simple line-icon illustration (a location-pin, brand green stroke + amber circle) above the headline, in a soft amber radial-glow circle — purely decorative, sits between `<Logo compact />` and the `<h1>`. See the mockup's "WELCOME" frame for exact proportions (icon ~86px in a 120px glow circle).

### `app/profile/page.tsx`
- Add a small camera-icon badge (16–24px circle, brand green fill, white 2px border) overlapping the bottom-right of the reference photo `<img>`, to reinforce "this is a photo."
- Add small icon chips (34px rounded-square, `bg-surface`) to the left of the "Department" and "Work email" rows — simple building icon and envelope icon respectively (see mockup for exact strokes).

### `app/login/page.tsx`
- Add a shield-check icon in a soft green glow circle (72px) centered above the "Work email" field — reinforces the secure/verified sign-in moment.

### `app/history/page.tsx` and `app/admin/approvals/page.tsx`
- Same camera-icon-badge treatment as Profile, applied to each list item's/card's photo thumbnail.
- Approvals cards additionally get a small amber "pending clock" icon badge instead of camera (differentiates "awaiting review" from "this is a photo").

### `app/admin/attendance/page.tsx`
- No layout change requested/needed — this handoff does not require converting the desktop `<table>` to a card list; the "make admin mobile too" request was about the **design-review mockup's frame size**, not the real responsive breakpoint. If you *do* want a true mobile breakpoint for this page, that's a separate scope — flag it back to design rather than guessing at it.
- "Download CSV" button: add a small download-arrow icon (15px, matches mockup) to the left of the label, and the primary-button shadow above.

## Assets
No new binary assets. All "illustrations" in the mockup are inline SVGs built from simple shapes (paths/circles) — recreate them directly as SVG in the relevant `.tsx` file rather than importing images. Exact paths are visible in the mockup's markup if you want to lift them verbatim (view source of the frames in `Attendance Redesign.dc.html`).

## Files in this bundle
- `Attendance Redesign.dc.html` — the design reference (open in a browser; each rounded-rect is a mobile-frame mock of one real screen/route).
