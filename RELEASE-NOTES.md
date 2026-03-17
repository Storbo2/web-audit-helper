# WAH v1.4.4 Release Notes

**Release Date**: March 16, 2026  
**Type**: Patch (Performance & Optimization)

---

## Overview

Version 1.4.4 adds two high-impact performance rules to complement the Core Web Vitals and script loading optimization strategies.

This release introduces `PERF-09` (above-the-fold image prioritization) and `PERF-10` (third-party script consolidation), bringing the total rule count to **73**.

---

## Highlights

- Added `PERF-09` (missing fetchpriority on above-the-fold images) for LCP optimization
- Added `PERF-10` (excess scripts from same third-party domain) for network efficiency
- Both rules include configurable thresholds and comprehensive documentation
- Full end-to-end integration with tests, examples, and i18n labels

---

## Added

### New Performance Rules

- `PERF-09`: Detects above-the-fold images missing `fetchpriority="high"` attribute
  - Heuristic: flags large images (>300x300px) in viewport or within `<header>` containers
  - Impacts: Largest Contentful Paint (LCP) Core Web Vitals metric
  
- `PERF-10`: Detects excess scripts from same third-party domain
  - Threshold-based: flags domains with >5 scripts (configurable)
  - Impacts: Network request efficiency and page load performance

### Supporting Coverage

- Unit tests for both rules (14 tests covering edge cases and boundaries)
- Example fixtures in `basic.html` demonstrating violations
- Threshold configuration support in rule metadata

---

## Changed

### Registry and Docs Integration

- Rule IDs `PERF-09` and `PERF-10` added to `ruleIds.ts`
- Registry entries and metadata overrides in performance module
- Rules catalog (EN/ES) updated to show 12 performance rules (was 10)
- Configuration docs updated with new rule ID ranges
- README updated to show 73 total rules (was 71)
- Package version advanced to `1.4.4`

---

## Fixed

- Added mappings for `PERF-09` and `PERF-10` in:
  - EN/ES `ruleLabels` in locale files
  - Reporter fallback constants (`rule-metadata`, `rule-fixes`, `rule-tokens`)
  - Configuration documentation

---

## Validation Status

- i18n tests: passing
- new rules tests: passing (14 performance-advanced tests)
- examples coverage tests: passing (all 73 rules triggered)
- Typecheck: passing (`npm run typecheck`)
- Test suite: passing (260 tests)
- Build: passing (`npm run build`)

---

## Configuration Example

```javascript
await runWAH({
    rules: {
        'PERF-09': { threshold: 400 },    // Flag images larger than 400x400px
        'PERF-10': { threshold: 8 }       // Flag domains with >8 scripts
    }
});
```

---

## Upgrade Notes

No breaking changes introduced.

- Existing configurations and integrations remain unchanged.
- New performance rules are additive and can be customized/disabled via `rules[ruleId]`.

---

*Previous release: [v1.4.3 Release Notes](https://github.com/Storbo2/web-audit-helper/releases/tag/v1.4.3)*

---

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
