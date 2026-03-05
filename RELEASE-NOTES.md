# WAH v1.0.5 Release Notes

**Release Date**: March 5, 2026  
**Type**: Patch Release (UI/UX Refinements)

---

## Overview

Version 1.0.5 focuses on polishing the overlay user interface after introducing `reset.css`.
This release improves visual consistency and interaction quality across chips, issue lists, badges, and popovers without introducing breaking API changes.

---

## Fixed

### Popover Positioning and Behavior
- Restored stable popover behavior so menus open around the trigger button.
- Kept viewport clamping to avoid off-screen rendering on edge positions.
- Fixed regressions where popovers could look oversized or feel detached from their trigger.

### Toolbar Icon Alignment
- Fixed centering for emoji/icon buttons used to open popovers.
- Ensured icons are visually centered inside their button hit area.

### Badge Symbol Alignment
- Added a dedicated badge symbol class (`.wah-badge-symbol`) in list rendering.
- Applied a targeted vertical offset (`margin-top: 0.12rem`) only to the symbol element.
- Avoided unintended layout changes to `.wah-msg` text content.

---

## Changed

### Overlay List Spacing
- Rebalanced list spacing to avoid overly compressed or overly padded rows.
- Updated `.wah-list` and `.wah-issue-item` spacing to a tighter, more readable baseline.
- Removed `border-radius` from `.wah-issue-item` per latest UI direction.

### Panel and Filter Layout
- Removed internal panel padding from `.wah-panel` / `.wah-all-panel` so list-item spacing controls the rhythm.
- Updated `.wah-filter` horizontal margins to `0.5rem` for better alignment with panel content.

### Chip Visual Style
- Kept chip padding while increasing text size to `0.9rem` for readability.
- Adjusted chip corner radius to a softer rounded rectangle (less pill-like, not square).
- Preserved hover and active feedback behavior.

---

## Files Updated (High Level)

- `package.json` (version bump to `1.0.5`)
- `CHANGELOG.md` (new `1.0.5` entry)
- `RELEASE-NOTES.md` (this file)
- `src/overlay/styles/items.css`
- `src/overlay/styles/utilities.css`
- `src/overlay/core/renderer.ts`
- `src/overlay/popover/utils.ts`
- `src/overlay/core/wahCss.ts` (auto-generated)

---

## Validation

- `npm run build` passed
- `npm run typecheck` passed

---

## Upgrade

```bash
npm update web-audit-helper
```

No breaking changes. Fully backward compatible with `v1.0.4`.

---

## Notes for Maintainers

Suggested release commit message:

```bash
git commit -m "chore: release v1.0.5 - refine overlay spacing, chips, badges, and popovers"
```

Suggested tag:

```bash
git tag v1.0.5
```