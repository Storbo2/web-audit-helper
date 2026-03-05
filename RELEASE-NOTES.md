# WAH v1.0.6 Release Notes

**Release Date**: March 5, 2026  
**Type**: Patch Release (Visibility Analysis + Stability)

---

## Overview

Version 1.0.6 introduces mode-aware DOM visibility analysis to better handle responsive hidden variants (for example desktop/mobile headers that coexist in DOM).
This release keeps API compatibility while improving audit signal quality and documentation clarity.

---

## Added

### New Visibility-Mode Tests
- Added tests validating strict-mode full DOM analysis behavior.
- Added tests validating perceivable-only filtering for `normal`, `moderate`, `soft`, and `custom`.

## Changed

### Scoring Mode Behavior
- `strict` now analyzes all matching elements present in the DOM (including hidden elements).
- `normal`, `moderate`, `soft`, and `custom` now analyze perceivable elements only.
- Updated Settings scoring mode helper text to clearly document this behavior.

## Fixed

### Responsive Overlap Detection (`RWD-04`)
- Fixed mode mismatch so hidden fixed/sticky variants are only filtered in perceivable-only modes.
- In `strict`, hidden variants can now be reported consistently with full DOM analysis.

---

## Files Updated (High Level)

- `package.json` (version bump to `1.0.6`)
- `CHANGELOG.md` (new `1.0.6` entry)
- `RELEASE-NOTES.md` (this file)
- `docs/configuration.md`
- `src/core/index.ts`
- `src/core/config/registry.ts`
- `src/core/rules/responsive.ts`
- `src/overlay/popover/components/Settings.ts`
- `src/core/rules/__tests__/accessibility-responsive.test.ts`

---

## Validation

- `npm run build` passed
- `npm run typecheck` passed
- `npm test` passed

---

## Upgrade

```bash
npm update web-audit-helper
```

No breaking changes. Fully backward compatible with `v1.0.5`.

---

## Notes for Maintainers

Suggested release commit message:

```bash
git commit -m "chore: release v1.0.6 - mode-aware visibility analysis and docs"
```

Suggested tag:

```bash
git tag v1.0.6
```