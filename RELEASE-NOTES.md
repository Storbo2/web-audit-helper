# WAH v1.0.8 Release Notes

**Release Date**: March 8, 2026  
**Type**: Minor Enhancement (Breakpoint Context + Visual Improvements)

---

## Overview

Version 1.0.8 enhances report context by adding breakpoint classification to all export formats and improves visual feedback for large element highlighting. This release removes unused configuration while adding valuable viewport context to help understand audit results in responsive design contexts.

---

## Added

### Report Enhancements
- **Breakpoint information in all reports**: JSON, TXT, and HTML exports now include breakpoint classification alongside viewport dimensions
  - Example: `Breakpoint: xl (laptops, desktops)`
- **Standard breakpoint system**: Internal utility classifies viewports into xs/sm/md/lg/xl/2xl/3xl with device type descriptions
- **Device context**: Reports now show typical device types for the current viewport (e.g., "mobile phones (portrait)", "tablets (landscape)", "large desktops, monitors")

### Visual Improvements
- **Enhanced large element highlighting**: Elements covering >50% of viewport now receive animated flash overlay effect for better visibility
- **Improved highlight UX**: Critical issues on `<html>`, `<body>`, or large sections now clearly visible with pulsing color overlay

---

## Changed

### Configuration
- **Removed `breakpoints` from WAHConfig**: Previously unused configuration option has been removed for cleaner API
  - **Breaking Change**: If you were passing `breakpoints` in config, you can safely remove it - it was never used by any rules
  - **Migration**: Simply delete the `breakpoints` property from your config object
- **Simplified config**: Default configuration is now more focused with fewer unused options

### Report Format
- All report formats now include breakpoint metadata:
  ```json
  "breakpoint": {
    "name": "xl",
    "label": "Extra Large", 
    "devices": "laptops, desktops"
  }
  ```

---

## Fixed

### Highlighting
- Large elements (html, body, full-page sections) now properly highlighted with visible flash effect instead of just border
- Improved perceivability of issue elements that span most/all of the viewport

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

**Before (1.0.7):**
```javascript
await runWAH({
    logs: true,
    overlay: { enabled: true },
    breakpoints: {  // ← Remove this
        xs: 480,
        sm: 640,
        // ...
    }
});
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

## Notes for Maintainers

Suggested release commit message:

```bash
git commit -m "chore: release v1.0.8 - breakpoint context in reports + visual improvements"
```

Suggested tag:

```bash
git tag v1.0.8
```

---

## Previous Release

For v1.0.7 notes, see the previous version of this file or CHANGELOG.md.