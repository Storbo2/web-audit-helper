# WAH v1.0.7 Release Notes

**Release Date**: March 8, 2026  
**Type**: Patch Release (Popover UX + Responsive Hardening)

---

## Overview

Version 1.0.7 improves popover reliability and visual stability across desktop and mobile.
This patch focuses on resilient popover row layout, score breakdown consistency, and responsive behavior in narrow viewports while preserving full API compatibility.

---

## Changed

### Popover Styling & Structure
- Standardized popover typography inheritance (`line-height`, alignment, spacing inheritance) to reduce host-style conflicts.
- Hardened row structure for radios, checkboxes, labels/spans/divs, and range inputs using explicit flex constraints.
- Introduced `.wah-pop-row-text` wrappers and applied them across Filters, Settings, and UI popovers.

### Responsive Behavior
- Added mobile-focused popover breakpoints with tuned width, paddings, row spacing, and control sizing.
- Improved compact layout handling for constrained viewports.

## Fixed

### Popover Reliability
- Fixed score breakdown popover lifecycle issues where open/close could behave inconsistently.
- Aligned score breakdown interactions with shared popover click-outside behavior.
- Fixed score breakdown placement issues when overlay is compact or near viewport edges.

### List Scrolling UX
- Added per-item scroll snapping for issue lists to avoid partially cut items after wheel/touch scrolling.

---

## Files Updated (High Level)

- `package.json` (version bump to `1.0.7`)
- `package-lock.json` (version bump to `1.0.7`)
- `CHANGELOG.md` (new `1.0.7` entry)
- `RELEASE-NOTES.md` (this file)
- `src/overlay/Overlay.ts`
- `src/overlay/core/template.ts`
- `src/overlay/popover/Popover.ts`
- `src/overlay/popover/utils.ts`
- `src/overlay/popover/components/Filters.ts`
- `src/overlay/popover/components/Settings.ts`
- `src/overlay/popover/components/UI.ts`
- `src/overlay/styles/items.css`
- `src/overlay/styles/popover/popover-base.css`
- `src/overlay/core/wahCss.ts`

---

## Validation

- `npm run build` passed

---

## Upgrade

```bash
npm update web-audit-helper
```

No breaking changes. Fully backward compatible with `v1.0.6`.

---

## Notes for Maintainers

Suggested release commit message:

```bash
git commit -m "chore: release v1.0.7 - popover UX and responsive hardening"
```

Suggested tag:

```bash
git tag v1.0.7
```