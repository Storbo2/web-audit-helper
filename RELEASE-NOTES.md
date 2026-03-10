# WAH v1.1.0 Release Notes

**Release Date**: March 9, 2026  
**Type**: Minor (New Features + Enhancements)

---

## Overview

Version 1.1.0 is a significant feature release introducing **complete internationalization (i18n)**, **6 new audit rules**, **end-to-end testing infrastructure**, and **bilingual documentation**. This release brings multilingual support to all user-facing components while maintaining full backward compatibility.

---

## Added

### Internationalization System (i18n)

- **Bilingual Support**: Complete English and Spanish translations for all user-facing content
- **Automatic Language Detection**: Auto-detects browser language with fallback to English
- **Manual Language Selection**: Settings popover includes persistent language selector (page 2)
- **Live Language Switching**: Audit automatically re-runs when locale changes for immediate UI update
- **Comprehensive Translation Coverage**:
  - Overlay UI and all popovers (Filters, Settings, Export, UI)
  - Report formats (HTML, TXT, JSON)
  - Console logger messages
  - 61 audit rules (labels, fixes, and issue messages)
- **Extensible Architecture**: Dictionary-based system designed for community contributions
- **Developer Guide**: New `docs/translations.md` with detailed instructions for adding new languages

### New Audit Rules (6 Total, bringing total to 65+)

- **ACC-27** (Accessibility): Click events without keyboard support
- **UX-01** (UX): Touch targets smaller than 44x44px
- **HTML-01** (Quality): Obsolete HTML elements (marquee, center, font, etc.)
- **HTML-02** (Quality): Obsolete HTML attributes (align, bgcolor, border, etc.)
- **PERF-07** (Performance): @import in CSS (render-blocking)
- **PERF-08** (Performance): Images without modern formats (WebP/AVIF)

### Testing Infrastructure

- **End-to-End Tests**: Playwright test suite with smoke tests and audit flow validation
- **Coverage Enforcement**: Automated coverage thresholds (80%+ for branches/functions/lines/statements)
- **Targeted Unit Tests**: New test coverage for scoring engine and settings persistence
- **Current Coverage**: 81.32% branches, 92.13% statements, 100% functions, 97.75% lines

### Bilingual Documentation

- **API Reference**: English (`docs/api.md`) + Spanish (`docs/es/api.md`)
- **Architecture Guide**: English (`docs/architecture.md`) + Spanish (`docs/es/architecture.md`)
- **Configuration Guide**: English (`docs/configuration.md`) + Spanish (`docs/es/configuration.md`)
- **Rules Catalog**: English (`docs/rules.md`) + Spanish (`docs/es/rules.md`)
- **Translation Guide**: Comprehensive guide for contributing new languages (`docs/translations.md`)

---

## Changed

### Standardization

- **Report Titles**: Unified naming: "WAH Report" (overlay), "Web Audit Helper Report" (exports)
- **Scoring System**: Enhanced custom mode with category-based multiplier auto-scaling
- **Settings Persistence**: Improved localStorage handling with robust fallback for invalid values

### Developer Experience

- **TypeScript Configuration**: Added Vitest globals to tsconfig for proper test type inference
- **Test Reliability**: Improved E2E test stability with correct selectors and localStorage cleanup

---

## Fixed

### TypeScript Compilation

- Resolved missing type definitions for Vitest test globals (describe, it, expect, beforeEach)
- All test files now pass TypeScript strict mode checks

### Contrast Detection

- Refined ACC-25 algorithm to reduce false positives near animated or image-containing elements (inherited from v1.0.9)

---

## Files Updated (High Level)

**Core:**

- `package.json` (version bump to `1.1.0`)
- `tsconfig.json` (added Vitest type definitions)
- `CHANGELOG.md` (new `1.1.0` entry)
- `RELEASE-NOTES.md` (this file)

**Internationalization:**

- `locales/en/common.json` (NEW - English dictionary)
- `locales/es/common.json` (NEW - Spanish dictionary)
- `src/core/types.ts` (added Locale type and localization interfaces)
- `src/config/defaultConfig.ts` (added locale detection)
- `src/overlay/popover/components/SettingsPopover.ts` (added language selector)
- `src/reporters/*.ts` (integrated translations)
- `src/utils/consoleLogger.ts` (integrated translations)

**Rules:**

- `src/core/rules/accessibility/keyboard.ts` (NEW - ACC-27)
- `src/core/rules/ux/touchTargets.ts` (NEW - UX-01)
- `src/core/rules/quality/obsoleteElements.ts` (NEW - HTML-01)
- `src/core/rules/quality/obsoleteAttributes.ts` (NEW - HTML-02)
- `src/core/rules/performance/cssImport.ts` (NEW - PERF-07)
- `src/core/rules/performance/modernImageFormats.ts` (NEW - PERF-08)

**Testing:**

- `src/core/scoring.test.ts` (NEW - scoring engine tests)
- `src/overlay/config/settings.test.ts` (NEW - settings tests)
- `tests/e2e/smoke.spec.ts` (NEW - smoke tests)
- `tests/e2e/audit-flow.spec.ts` (NEW - interaction tests)
- `playwright.config.ts` (NEW - E2E configuration)
- `vitest.config.mjs` (updated coverage thresholds)

**Documentation:**

- `docs/translations.md` (NEW - translation guide)
- `docs/es/*.md` (NEW - Spanish documentation)
- Updated all existing English docs with v1.1.0 features

---

## Validation

- ✅ `npm run typecheck` passed (0 errors)
- ✅ `npm test` passed (52/52 tests)
- ✅ `npm run test:coverage` passed (81.32% branches, exceeds 80% threshold)
- ✅ `npm run build` successful
- ✅ All TypeScript compilation clean
- ✅ Backward compatible (no breaking changes)

---

## Upgrade

```bash
npm update web-audit-helper
```

### Migration Notes

**No breaking changes.** Fully backward compatible with `v1.0.x`.

**New Configuration Options:**

```javascript
await runWAH({
    locale: 'es', // Optional: 'en' | 'es' (auto-detected if omitted)
    // All existing options remain unchanged
});
```

**Language Detection Order:**

1. Explicit `locale` in configuration
2. Persisted preference in localStorage (`wah:settings:locale`)
3. Browser language detection (`navigator.language`)
4. Default fallback: `'en'`

**Adding a New Language:**

See `docs/translations.md` for detailed instructions. Summary:

1. Copy `locales/en/common.json` to `locales/{locale}/common.json`
2. Translate all keys while preserving structure
3. Update `src/core/types.ts` to add new locale to `Locale` type
4. Follow pattern matching for issue messages (exact + regex patterns)

---

## Roadmap

### v1.2 - Rule Intelligence

- Rule-level customization (enable/disable by rule ID, severity overrides, custom thresholds)
- Stable rule IDs + centralized registry + override system
- Audit performance metrics (total duration + per-rule timings)
- Minor improvements (score debugging, logging upgrades, overlay UX polish)

### v1.3 - Documentation & Developer Guidance

- Rule Fix Guides (Problem, Why it matters, How to fix, Bad/Good examples)
- "Learn more" links from overlay/reports to rule-specific documentation
- Stronger architecture/rules/contribution guides

### v1.4 - External Auditing

- Official bookmarklet for one-click audits on any site
- Export improvements (run comparison, richer metadata, visual enhancements, code suggestions)

### v1.5 - Ecosystem Preparation

- Experimental Plugin API for external rules
- Internal rule registry hardening for plugins, advanced config, and doc generation

### v2.0 - Automation & Ecosystem

- CLI tool for URL/file audits with headless browser automation
- CI/CD integration with score-based fail conditions
- Official plugin system for framework/domain extensions

### v2.x - Ecosystem Growth

- DevTools browser extension
- Team/company policy profiles with custom rule standards

---

## Notes for Maintainers

Suggested release commit message:

```bash
git commit -m "feat: release v1.1.0 - internationalization, 6 new rules, E2E testing"
```

Suggested tag:

```bash
git tag v1.1.0
git push origin v1.1.0
```

npm publish:

```bash
npm publish
```

---

## Contributors

Thank you to everyone who contributed to this release through code, testing, documentation, and feedback!
