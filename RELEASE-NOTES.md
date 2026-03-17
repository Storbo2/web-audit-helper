# WAH v1.4.3 Release Notes

**Release Date**: March 16, 2026  
**Type**: Patch (Technical SEO Consistency)

---

## Overview

Version 1.4.3 continues the pre-v1.5 incremental roadmap by expanding technical SEO coverage in head-level checks.

This release adds two SEO rules (`SEO-09`, `SEO-10`) focused on canonical consistency and hreflang integrity.

---

## Highlights

- Added `SEO-09` (canonical conflict/empty canonical) and `SEO-10` (invalid or incomplete hreflang) end-to-end
- Included intentional fixture violations in `examples/basic.html` for manual and automated verification
- Added labels and reporter mappings so console/report output remains readable for new IDs

---

## Added

### New SEO Rules

- `SEO-09`: Canonical conflict (multiple canonical tags) or empty canonical href
- `SEO-10`: Hreflang alternates with missing href, invalid locale code, or missing `x-default`

### Supporting Coverage

- New dedicated unit tests for canonical and hreflang rule behavior
- Example fixture updates to trigger both rules in coverage flows

---

## Changed

### Registry and Docs Integration

- Rule IDs, registry wiring, and metadata overrides updated for `SEO-09` and `SEO-10`
- Rules catalog and rules guide (EN/ES) expanded with new entries and pages
- Rule range references in EN/ES configuration docs updated to `SEO-01 – SEO-10`
- Package version advanced to `1.4.3`

---

## Fixed

- Added missing mappings for:
  - `SEO-09` and `SEO-10` in EN/ES `ruleLabels`
  - reporter fallback constants (`rule-metadata`, `rule-fixes`, `rule-tokens`)
- Removed overlap between canonical rules:
  - `SEO-05` now reports only when canonical is missing
  - `SEO-09` handles empty canonical href and multiple canonical conflicts

---

## Validation Status

- i18n tests: passing (`npm run test -- src/utils/i18n.test.ts`)
- new rules tests: passing (`npm run test -- src/core/rules/__tests__/seo-technical.test.ts`)
- examples coverage tests: passing (`npm run test -- src/core/rules/__tests__/examples-coverage.test.ts`)
- Typecheck: passing (`npm run typecheck`)
- Test suite: passing (`npm test`)
- Build: passing (`npm run build`)

---

## Upgrade Notes

No breaking changes introduced.

- Existing integrations continue to work unchanged.
- New SEO rules are additive and can be customized/disabled via `rules[ruleId]`.

---

*Previous release: [v1.4.2 Release Notes](https://github.com/Storbo2/web-audit-helper/releases/tag/v1.4.2)*
