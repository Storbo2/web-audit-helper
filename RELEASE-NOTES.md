# WAH v1.4.2 Release Notes

**Release Date**: March 16, 2026  
**Type**: Patch (Accessibility Controls + Validation Feedback)

---

## Overview

Version 1.4.2 continues the pre-v1.5 incremental roadmap by expanding accessibility coverage for common UI controls and validation feedback patterns.

This release adds two accessibility rules (`ACC-30`, `ACC-31`) focused on icon-only button naming and invalid control error association.

---

## Highlights

- Added `ACC-30` (icon-only button naming) and `ACC-31` (invalid control error message association) end-to-end
- Included intentional fixture violations in `examples/basic.html` for manual and automated verification
- Added i18n labels so console tables display readable names for newly introduced rules

---

## Added

### New Accessibility Rules

- `ACC-30`: Icon-only button missing robust accessible name (`aria-label`/valid `aria-labelledby`)
- `ACC-31`: Invalid control (`aria-invalid="true"`) missing associated error message (`aria-describedby` or live region)

### Supporting Coverage

- New dedicated unit tests for control/error rule behavior
- Example fixture updates to trigger both rules in coverage flows

---

## Changed

### Registry and Docs Integration

- Rule IDs, registry wiring, and metadata overrides updated for `ACC-30` and `ACC-31`
- Rules catalog and rules guide (EN/ES) expanded with new entries and pages
- Rule range references in EN/ES configuration docs updated to `ACC-01 – ACC-31`
- Package version advanced to `1.4.2`

---

## Fixed

- Added missing `ruleLabels` mappings in EN/ES locales for:
  - `ACC-30`
  - `ACC-31`

---

## Validation Status

- i18n tests: passing (`npm run test -- src/utils/i18n.test.ts`)
- new rules tests: passing (`npm run test -- src/core/rules/__tests__/accessibility-controls.test.ts`)
- examples coverage tests: pending re-validation in this cycle
- Typecheck: passing (`npm run typecheck`)
- Test suite: passing (`npm test`)
- Build: passing (`npm run build`)

---

## Upgrade Notes

No breaking changes introduced.

- Existing integrations continue to work unchanged.
- New accessibility rules are additive and can be customized/disabled via `rules[ruleId]`.

---

*Previous release: [v1.4.1 Release Notes](https://github.com/Storbo2/web-audit-helper/releases/tag/v1.4.1)*
