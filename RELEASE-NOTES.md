# WAH v1.0.9 Release Notes

**Release Date**: March 8, 2026  
**Type**: Patch (Contrast Detection Improvements)

---

## Overview

Version 1.0.9 further refines contrast detection (ACC-25) to virtually eliminate false positives, especially in strict mode. This patch improves element analysis by detecting and skipping text adjacent to visual elements like animations and background images.

---

## Added

### Contrast Detection Improvements
- **Sibling element detection**: Automatically skips text contrast analysis when adjacent siblings contain images or background images
- **Parent animation detection**: Detects animations/transitions in parent elements and skips analysis accordingly
- **Tolerance tuning**: Increased tolerance threshold from 95% to 90% of minimum contrast ratio for edge cases

---

## Fixed

### Contrast Ratio (ACC-25)
- Significantly reduced false positives in all scoring modes, particularly in strict mode
- Fixed issue where white text on black backgrounds could incorrectly flag as low-contrast when near animated or image-containing elements
- Improved detection of legitimate contrast scenarios with complex layouts

---

## Files Updated (High Level)

- `package.json` (version bump to `1.0.8`)
- `CHANGELOG.md` (new `1.0.8` entry)
- `RELEASE-NOTES.md` (this file)
- `src/utils/breakpoints.ts` (NEW - breakpoint classification utility)
- `src/core/types.ts` (removed `breakpoints` from WAHConfig, added to AuditReportMeta)
- `src/config/defaultConfig.ts` (removed breakpoints)
- `src/reporters/builder.ts` (added breakpoint info to report meta)
- `src/reporters/serializers.ts` (display breakpoint in TXT and HTML)
- `src/overlay/interactions/highlight.ts` (large element detection and flash effect)
- `src/overlay/styles/base.css` (flash animation for large elements)
- All test files (removed unused breakpoints config)

---

## Validation

- ✅ `npm test` passed (38/38 tests)
- ✅ `npm run build` passed
- ✅ All TypeScript compilation clean
- ✅ Backwards compatible (except unused `breakpoints` config removal)

---

## Upgrade

```bash
npm update web-audit-helper
```

### Migration Notes

If your code previously included `breakpoints` in the config:

**Before (1.0.7):**9`)
- `CHANGELOG.md` (new `1.0.9` entry)
- `RELEASE-NOTES.md` (this file)
- `src/core/rules/accessibility/text.ts` (improved contrast detection with nearby element checkin
```

**After (1.0.8):**
```javascript
await runWAH({
    logs: true,
    overlay: { enabled: true }
    // breakpoints removed - handled internally
});
```

The `breakpoints` were never used by any rules or functionality, so removing them has zero functional impact.

---

## NNo breaking changes from 1.0.8

---

## Upgrade

```bash
npm update web-audit-helper
```

No breaking changes. Fully backward compatible with `v1.0.8`.

---

## Notes for Maintainers

Suggested release commit message:

```bash
git commit -m "chore: release v1.0.9 - improved contrast detection (ACC-25 false positives fix)"
```

Suggested tag:

```bash
git tag v1.0.9
```

---

## Previous Release

For v1.0.8