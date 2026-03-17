# WAH v1.4.1 Release Notes

**Release Date**: March 16, 2026  
**Type**: Patch (Accessibility Expansion + Console Label Consistency)

---

## Overview

Version 1.4.1 builds on 1.4.0 by delivering the first incremental rule package before v1.5, focused on accessibility components and output consistency.

This release adds two accessibility rules (`ACC-28`, `ACC-29`) and ensures readable console labels for newly added and previously unmapped rule IDs.

---

## Highlights

- Added `ACC-28` (dialog name) and `ACC-29` (modal focusability) end-to-end
- Included intentional fixture violations in `examples/basic.html` for manual and automated verification
- Completed missing i18n rule labels so console tables display readable rule names instead of raw IDs

---

## Added

### New Accessibility Rules

- `ACC-28`: Dialog missing accessible name (`aria-label`/valid `aria-labelledby`)
- `ACC-29`: Modal (`aria-modal="true"`) missing focusable element

### Supporting Coverage

- New dedicated unit tests for dialog and modal rule behavior
- Example fixture updates to trigger both rules in coverage flows

---

## Changed

### Registry and Docs Integration

- Rule IDs, registry wiring, and metadata overrides updated for `ACC-28` and `ACC-29`
- Rules catalog and rules guide (EN/ES) expanded with new entries and pages
- Package version advanced to `1.4.1`

---

## Fixed

- Fixed missing `ruleLabels` mappings in EN/ES locales so console output no longer falls back to raw IDs for:
  - `ACC-27`, `ACC-28`, `ACC-29`
  - `UX-01`
  - `HTML-01`, `HTML-02`
  - `PERF-07`, `PERF-08`

---

## Validation Status

- i18n tests: passing (`npm run test -- src/utils/i18n.test.ts`)
- examples coverage tests: passing (`npm run test -- src/core/rules/__tests__/examples-coverage.test.ts`)
- Typecheck: passing (`npm run typecheck`)
- Test suite: passing (`npm test`)
- Build: passing (`npm run build`)

---

## Upgrade Notes

No breaking changes introduced.

- Existing integrations continue to work unchanged.
- New accessibility rules are additive and can be customized/disabled via `rules[ruleId]`.

---

*Previous release: [v1.4.0 Release Notes](https://github.com/Storbo2/web-audit-helper/releases/tag/v1.4.0)*
