# WAH v2.0.0 Release Notes

<!-- markdownlint-disable MD025 MD024 -->

**Release Date**: April 1, 2026  
**Type**: Major (Reusable Audit Platform)

---

## Overview

Version 2.0.0 turns WAH into a reusable audit platform.

You can now run headless audits from Node.js, compare runs with stable contracts, enforce delta-based CI gates, and emit specialized outputs for GitHub Actions, GitLab CI, and generic machine-readable pipelines.

---

## Highlights

- Stable JSON report contract with validation and compatibility policy
- Headless API + Node.js CLI for static HTML and real URL audits
- Reusable comparison engine with delta gates for CI
- Specialized CI outputs: generic Markdown, GitHub Actions, GitLab CI, compact JSON
- External auditing workflow preserved and fully aligned with the new platform release

---

## Added

- stable JSON contract validation and compatibility documentation
- `runWAHHeadless()` official headless API
- Node.js CLI for static and Playwright-backed audits
- comparison engine and CLI delta gates
- CI-oriented outputs:
  - `--comparison-output`
  - `--comparison-summary-output`
  - `--github-actions-summary-output`
  - `--gitlab-summary-output`
  - `--comparison-ci-json-output`
- QA snippets and workflow examples for GitHub Actions and GitLab CI

---

## Fixed

- CLI path normalization now avoids `dist/dist/out` duplication when running from the `dist` directory.
- Comparison serialization reuses precomputed payloads instead of recomputing diffs unnecessarily.

---

## Validation Status

- Typecheck: passing (`npm run typecheck`)
- Test suite: passing (`npm test`)
- Build: passing (`npm run build`)
- Smoke validations: passing for comparison outputs, GitHub Actions, GitLab CI, and compact CI JSON summary

---

## Upgrade Notes

- Existing embedded and external usage remain compatible.
- CI consumers should prefer `--comparison-ci-json-output` for machine parsing.
- Markdown outputs are intended for human-facing summaries and can evolve cosmetically within the same major version.

---

## WAH v1.5.0 Release Notes

**Release Date**: March 18, 2026  
**Type**: Minor (External Auditing)

---

## Overview (v1.5.0)

Version 1.5.0 delivers external auditing as an official workflow.

You can now audit already-open pages using a bookmarklet runtime, export richer execution metadata, and compare consecutive runs directly in JSON/HTML reports.

---

## WAH v1.4.5 Release Notes

**Release Date**: March 16, 2026  
**Type**: Patch (Security & Quality Finalization)

---

### Overview (v1.4.5)

Version 1.4.5 closes the incremental pre-v1.5 roadmap with two final rules focused on secure transport and UX noise reduction.

This release introduces `SEC-03` (mixed content) and `QLT-03` (consecutive duplicate controls), bringing the total rule count to **75**.

---

### Highlights (v1.4.5)

- Added `SEC-03` to detect insecure `http://` subresources in secure page contexts
- Added `QLT-03` to detect adjacent duplicate controls with the same label and action
- Added explicit non-overlap coverage for `SEC-03` vs `SEC-01`, `QLT-03` vs `QLT-02`, and `IMG-02` vs `PERF-09`
- Completed the 10-rule incremental roadmap planned for pre-v1.5

---

### Added (v1.4.5)

#### New Security and Quality Rules (v1.4.5)

- `SEC-03`: Mixed content in secure context
  - Flags embedded subresources loaded over `http://` when the page context is secure
  - Covers scripts, images, iframes, media, stylesheets, and similar subresources

- `QLT-03`: Consecutive duplicate controls
  - Flags adjacent controls that expose the same visible label and action
  - Excludes common grouped UI patterns such as pagination, tablists, and dummy-link cases already covered elsewhere

#### Supporting Coverage (v1.4.5)

- Dedicated test suite for security/quality boundaries
- Example fixture updates in `basic.html` for SEC-03 and QLT-03 coverage
- Docs pages for both rules plus updated rule guides and catalogs

---

### Changed (v1.4.5)

- Security and quality registry, metadata, locale labels, and reporter fallbacks updated for `SEC-03` and `QLT-03`
- README updated to reflect 75 total rules and the new current release
- Rule guides brought in sync with PERF-07 through PERF-10 documentation coverage
- Package version advanced to `1.4.5`

---

### Fixed (v1.4.5)

- Removed overlap between `IMG-02` and `PERF-09`
  - likely hero/above-the-fold images no longer receive lazy-load recommendations
  - those images are now covered by fetch-priority guidance only

---

### Validation Status (v1.4.5)

- security/quality tests: passing
- performance boundary tests: passing
- examples coverage tests: passing (all 75 rules triggered)
- Typecheck: passing (`npm run typecheck`)
- Test suite: passing (`npm test`)
- Build: passing (`npm run build`)

---

### Upgrade Notes (v1.4.5)

No breaking changes introduced.

- Existing integrations remain unchanged.
- New rules are additive and can be customized or disabled via `rules[ruleId]`.

---

*Previous release: [v1.4.4 Release Notes](https://github.com/Storbo2/web-audit-helper/releases/tag/v1.4.4)*

---

## WAH v1.4.4 Release Notes

**Release Date**: March 16, 2026  
**Type**: Patch (Performance & Optimization)

---

### Overview (v1.4.4)

Version 1.4.4 adds two high-impact performance rules to complement the Core Web Vitals and script loading optimization strategies.

This release introduces `PERF-09` (above-the-fold image prioritization) and `PERF-10` (third-party script consolidation), bringing the total rule count to **73**.

---

### Highlights (v1.4.4)

- Added `PERF-09` (missing fetchpriority on above-the-fold images) for LCP optimization
- Added `PERF-10` (excess scripts from same third-party domain) for network efficiency
- Both rules include configurable thresholds and comprehensive documentation
- Full end-to-end integration with tests, examples, and i18n labels

---

### Added (v1.4.4)

#### New Performance Rules (v1.4.4)

- `PERF-09`: Detects above-the-fold images missing `fetchpriority="high"` attribute
  - Heuristic: flags large images (>300x300px) in viewport or within `<header>` containers
  - Impacts: Largest Contentful Paint (LCP) Core Web Vitals metric
  
- `PERF-10`: Detects excess scripts from same third-party domain
  - Threshold-based: flags domains with >5 scripts (configurable)
  - Impacts: Network request efficiency and page load performance

#### Supporting Coverage (v1.4.4)

- Unit tests for both rules (14 tests covering edge cases and boundaries)
- Example fixtures in `basic.html` demonstrating violations
- Threshold configuration support in rule metadata

---

### Changed (v1.4.4)

#### Registry and Docs Integration (v1.4.4)

- Rule IDs `PERF-09` and `PERF-10` added to `ruleIds.ts`
- Registry entries and metadata overrides in performance module
- Rules catalog (EN/ES) updated to show 12 performance rules (was 10)
- Configuration docs updated with new rule ID ranges
- README updated to show 73 total rules (was 71)
- Package version advanced to `1.4.4`

---

### Fixed (v1.4.4)

- Added mappings for `PERF-09` and `PERF-10` in:
  - EN/ES `ruleLabels` in locale files
  - Reporter fallback constants (`rule-metadata`, `rule-fixes`, `rule-tokens`)
  - Configuration documentation

---

### Validation Status (v1.4.4)

- i18n tests: passing
- new rules tests: passing (14 performance-advanced tests)
- examples coverage tests: passing (all 73 rules triggered)
- Typecheck: passing (`npm run typecheck`)
- Test suite: passing (260 tests)
- Build: passing (`npm run build`)

---

### Configuration Example (v1.4.4)

```javascript
await runWAH({
    rules: {
        'PERF-09': { threshold: 400 },    // Flag images larger than 400x400px
        'PERF-10': { threshold: 8 }       // Flag domains with >8 scripts
    }
});
```

---

### Upgrade Notes (v1.4.4)

No breaking changes introduced.

- Existing configurations and integrations remain unchanged.
- New performance rules are additive and can be customized/disabled via `rules[ruleId]`.

---

*Previous release: [v1.4.3 Release Notes](https://github.com/Storbo2/web-audit-helper/releases/tag/v1.4.3)*

---

## WAH v1.4.3 Release Notes

**Release Date**: March 16, 2026  
**Type**: Patch (Technical SEO Consistency)

---

### Overview (v1.4.3)

Version 1.4.3 continues the pre-v1.5 incremental roadmap by expanding technical SEO coverage in head-level checks.

This release adds two SEO rules (`SEO-09`, `SEO-10`) focused on canonical consistency and hreflang integrity.

---

### Highlights (v1.4.3)

- Added `SEO-09` (canonical conflict/empty canonical) and `SEO-10` (invalid or incomplete hreflang) end-to-end
- Included intentional fixture violations in `examples/basic.html` for manual and automated verification
- Added labels and reporter mappings so console/report output remains readable for new IDs

---

### Added (v1.4.3)

#### New SEO Rules (v1.4.3)

- `SEO-09`: Canonical conflict (multiple canonical tags) or empty canonical href
- `SEO-10`: Hreflang alternates with missing href, invalid locale code, or missing `x-default`

#### Supporting Coverage (v1.4.3)

- New dedicated unit tests for canonical and hreflang rule behavior
- Example fixture updates to trigger both rules in coverage flows

---

### Changed (v1.4.3)

#### Registry and Docs Integration (v1.4.3)

- Rule IDs, registry wiring, and metadata overrides updated for `SEO-09` and `SEO-10`
- Rules catalog and rules guide (EN/ES) expanded with new entries and pages
- Rule range references in EN/ES configuration docs updated to `SEO-01 – SEO-10`
- Package version advanced to `1.4.3`

---

### Fixed (v1.4.3)

- Added missing mappings for:
  - `SEO-09` and `SEO-10` in EN/ES `ruleLabels`
  - reporter fallback constants (`rule-metadata`, `rule-fixes`, `rule-tokens`)
- Removed overlap between canonical rules:
  - `SEO-05` now reports only when canonical is missing
  - `SEO-09` handles empty canonical href and multiple canonical conflicts

---

### Validation Status (v1.4.3)

- i18n tests: passing (`npm run test -- src/utils/i18n.test.ts`)
- new rules tests: passing (`npm run test -- src/core/rules/__tests__/seo-technical.test.ts`)
- examples coverage tests: passing (`npm run test -- src/core/rules/__tests__/examples-coverage.test.ts`)
- Typecheck: passing (`npm run typecheck`)
- Test suite: passing (`npm test`)
- Build: passing (`npm run build`)

---

### Upgrade Notes (v1.4.3)

No breaking changes introduced.

- Existing integrations continue to work unchanged.
- New SEO rules are additive and can be customized/disabled via `rules[ruleId]`.

---

*Previous release: [v1.4.2 Release Notes](https://github.com/Storbo2/web-audit-helper/releases/tag/v1.4.2)*
