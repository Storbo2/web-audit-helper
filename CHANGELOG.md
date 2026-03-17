# Changelog

<!-- markdownlint-disable MD024 -->

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.4] - 2026-03-16

### Added

- **Performance optimization rules (v1.4.4)**:
  - `PERF-09`: Above-the-fold images missing `fetchpriority="high"` for LCP improvement
  - `PERF-10`: Excess scripts from same third-party domain (threshold-based, default: 5)
- New unit suite for performance rules with 14 tests covering both new checks and edge cases.
- Example fixture violations in `examples/basic.html` for PERF-09/PERF-10 coverage.
- Comprehensive documentation pages for both new rules with configuration examples.

### Changed

- Performance registry, metadata overrides, and rule exports updated for `PERF-09` and `PERF-10`.
- Performance rule guides and catalogs updated to show 12 rules (was 10).
- Configuration docs updated with new PERF rule ID ranges (`PERF-01 – PERF-10`).
- README updated to show 73 total audit rules (was 71).
- Package version advanced to 1.4.4.

### Fixed

- Added label and reporter fallback mappings for `PERF-09` and `PERF-10` in EN/ES locale files.

## [1.4.3] - 2026-03-16

### Added

- **Technical SEO incremental rules (v1.4.3)**:
  - `SEO-09`: Canonical conflict or empty canonical
  - `SEO-10`: Invalid or incomplete hreflang set
- New unit suite for advanced SEO head checks.
- Intentional head fixture violations in `examples/basic.html` for SEO-09/SEO-10 coverage.

### Changed

- SEO registry, metadata overrides, and rule exports updated for `SEO-09` and `SEO-10`.
- Rule guides and rules catalog docs updated to include new rule pages.
- SEO ID ranges in EN/ES configuration docs updated to `SEO-01 – SEO-10`.

### Fixed

- Added label and reporter fallback mappings for `SEO-09` and `SEO-10` so console/report output remains readable.
- Removed canonical rule overlap: `SEO-05` now covers missing canonical only, while `SEO-09` covers empty/conflicting canonical definitions.

## [1.4.2] - 2026-03-16

### Added

- **Accessibility controls and error feedback rules (v1.4.2)**:
  - `ACC-30`: Icon-only button missing robust accessible name
  - `ACC-31`: Invalid control (`aria-invalid="true"`) missing associated error message
- New unit suite for accessibility control/error checks.
- Intentional example fixture violations in `examples/basic.html` to validate both new rules in manual runs and coverage tests.

### Changed

- Accessibility registry, metadata overrides, and rule exports updated for `ACC-30` and `ACC-31`.
- Rule guides and rules catalog docs updated to include new rule pages.
- Rule ID ranges in EN/ES configuration docs updated to `ACC-01 – ACC-31`.

### Fixed

- Added locale label mappings for `ACC-30` and `ACC-31` to keep readable console rule names in EN/ES.

## [1.4.1] - 2026-03-16

### Added

- **Accessibility component rules (v1.4.1)**:
  - `ACC-28`: Dialog missing accessible name (`aria-label` / valid `aria-labelledby`)
  - `ACC-29`: Modal (`aria-modal="true"`) missing focusable element
- New unit suite for dialog/modal accessibility checks.
- Intentional example fixture violations in `examples/basic.html` to validate both new rules in manual runs and coverage tests.

### Changed

- Accessibility registry, metadata overrides, and rule exports updated for `ACC-28` and `ACC-29`.
- Rule guides and rules catalog docs updated to include new rule pages.

### Fixed

- Maintained full registry metadata contract coverage after adding new accessibility rules.

## [1.4.0] - 2026-03-16

### Added

- **Registry metadata hardening**:
  - Added enriched registry metadata contract (`category`, `defaultSeverity`, `title`, `fix`, `docsSlug`, `standardType`, `standardLabel`)
  - Added centralized metadata override map for all registered rules
  - Added metadata coverage tests to guarantee complete registry metadata population
- **Registry contract validation**:
  - Added startup/runtime contract assertion for the enriched registry
  - Added detailed validation errors for CI diagnostics (duplicate IDs, invalid category/severity, missing docsSlug)
  - Added dedicated unit test suite for registry contract validation and formatting
- **Self-audit protection coverage**:
  - Added tests to verify WAH ignores overlay/popover/context-menu/loading nodes marked with `data-wah-ignore`
  - Added overlay test ensuring context menu is marked as ignored for subsequent runs

### Changed

- **Rule metadata sourcing**:
  - Report builder and reporter utilities now resolve metadata from registry first, with constants fallback for compatibility
- **Costly heuristic controls (phase 4)**:
  - Added threshold/sampling parameters to selected heavy heuristics:
    - `ACC-21` (focus visibility sample size)
    - `RWD-01` (large fixed width threshold)
    - `RWD-04` (fixed/sticky overlap ratio threshold)
    - `PERF-02` (font resources threshold)
    - `PERF-03` (external script threshold)
    - `PERF-06` (cache reminder resource threshold)
    - `PERF-08` (image sample size)
  - Registry rule wiring now supports these thresholds via `rules[ruleId].threshold`
- **Documentation updates**:
  - Expanded EN/ES configuration docs with the new threshold-capable rules
  - Added explicit costly-rule tuning guidance for predictable audit runtime

### Fixed

- Stabilized phase 4 threshold tests by using deterministic geometry-based overlap assertions in jsdom.

## [1.3.0] - 2026-03-15

### Added

- **Educational rule documentation completed**:
  - Added per-rule documentation pages for all current implemented rules in `docs/rules/*.md` (61/61 coverage)
  - Added rule index pages:
    - `docs/rules-guide.md`
    - `docs/es/rules-guide.md`
- **Rule-level educational metadata integration**:
  - Added/expanded rule metadata fields used in reports and overlay:
    - `whyItMatters`
    - `standardType`
    - `standardLabel`
    - `docsSlug`
    - `docsUrl`
- **Learn more integration across outputs**:
  - HTML report now renders `Why it matters`, `Standard`, and `Learn more`
  - Console issue detail now renders full absolute `Learn more` URL
  - Overlay issue list now supports right-click context menu with `Learn more` action opening docs in a new tab
- **Contributor guidance for rule ecosystem**:
  - Added `docs/contributing.md`
  - Added `docs/es/contributing.md`

### Changed

- `Learn more` URLs now resolve to canonical GitHub docs paths:
  - `https://github.com/Storbo2/web-audit-helper/blob/main/docs/rules/{RULE-ID}.md`
- Overlay context menu styling now follows active theme tokens for better light/dark consistency

### Fixed

- Improved console output formatting for `Learn more` URL rendering consistency across DevTools

## [1.2.0] - 2026-03-10

### Added

- **Rule Intelligence** release:
  - Rule-level configuration by ID (`off`, severity override, per-rule threshold)
  - Threshold controls for `ACC-22`, `ACC-25`, `ACC-26`, `UX-01`
  - `RULE_IDS` exported for typed rule usage
- **Audit performance metrics** (`auditMetrics`) with optional report export
- **Console presets** (`none`, `minimal`, `standard`, `detailed`, `debug`)
- **Overlay and settings UX improvements** including keyboard shortcuts and loading states
- **Bilingual docs updates** for config/reference pages

### Changed

- `consoleOutput` became the preferred high-level logging configuration
- Preset behavior in `loadConfig` became authoritative when selected

### Fixed

- `logHideMessage` now always prints even when output level is `none`

## [1.1.0] - 2026-03-09

### Added

- **Internationalization (i18n) System**: Complete bilingual support for English and Spanish
  - Dictionary-based translation system with locale detection (`locales/en/` and `locales/es/`)
  - Automatic language detection from browser settings with manual override
  - Language selector in Settings popover (page 2) with persistent storage
  - Auto-rerun of audit when locale changes for immediate UI update
  - Translated overlay UI, popovers, reports (HTML/TXT/JSON), and console messages
  - 61 rules with translated labels, fixes, and issue messages
  - Extensible system for community-contributed translations (see `docs/translations.md`)
- **6 New Audit Rules** (Total: 65+):
  - ACC-27: Click events without keyboard support
  - UX-01: Touch targets smaller than 44x44px
  - HTML-01: Obsolete HTML elements (marquee, center, font, etc.)
  - HTML-02: Obsolete HTML attributes (align, bgcolor, border, etc.)
  - PERF-07: @import in CSS (render-blocking)
  - PERF-08: Images without modern formats (WebP/AVIF)

- **Testing Infrastructure**:
  - End-to-end testing with Playwright (smoke tests + audit flow tests)
  - Improved test coverage with targeted unit tests for scoring and settings modules
  - Coverage monitoring with 80%+ thresholds enforced (branches: 81.32%, statements: 92.13%)
- **Bilingual Documentation**: Complete docs in English and Spanish
  - API reference (`docs/api.md`, `docs/es/api.md`)
  - Architecture guide (`docs/architecture.md`, `docs/es/architecture.md`)
  - Configuration guide (`docs/configuration.md`, `docs/es/configuration.md`)
  - Rules catalog (`docs/rules.md`, `docs/es/rules.md`)
  - Translation contribution guide (`docs/translations.md`)

### Changed

- Standardized report titles: "WAH Report" (overlay), "Web Audit Helper Report" (exports)
- Enhanced scoring system to properly handle custom mode with category-based multiplier scaling
- Improved settings persistence with fallback handling for invalid localStorage values

### Fixed

- Fixed TypeScript compilation for test files by adding Vitest globals to tsconfig
- Improved contrast detection algorithm to reduce false positives near animated or image-containing elements

## [1.0.9] - 2026-03-08

### Fixed

- Reduced false positives in contrast ratio detection (ACC-25) by checking for nearby visual elements (background images, parent animations, adjacent sibling content)
- Increased contrast ratio tolerance from 95% to 90% of minimum requirement to account for edge cases with animations and complex layouts
- Fixed white-on-black text incorrectly flagging as low contrast in strict mode when near animated or image-containing elements

## [1.0.8] - 2026-03-08

### Added

- Added breakpoint information to all report formats (JSON, TXT, HTML) showing viewport classification and typical device types
- Added internal breakpoint utility system with standard breakpoints (xs, sm, md, lg, xl, 2xl, 3xl)
- Enhanced large element highlighting with visual flash effect for better visibility on viewport-filling elements (html, body)

### Changed

- Removed `breakpoints` from user configuration (WAHConfig) - now uses fixed internal breakpoints for consistency
- Reports now display breakpoint context (e.g., "Breakpoint: xl (laptops, desktops)") alongside viewport dimensions

### Fixed

- Improved element highlight visibility for large elements that cover significant viewport area using animated flash overlay

## [1.0.7] - 2026-03-08

### Changed

- Upgraded popover base typography and inheritance defaults (`line-height`, alignment, spacing inheritance) to reduce host-page style interference
- Strengthened popover row layout for radios, checkboxes, labels, spans, and slider controls using explicit flex behavior
- Added dedicated `.wah-pop-row-text` wrappers in Filters, Settings, and UI popovers for stable text flow and wrapping
- Improved mobile responsiveness for popovers with tuned widths, paddings, control sizing, and compact row spacing at narrow breakpoints

### Fixed

- Fixed score breakdown popover open/close instability by aligning it with the shared popover lifecycle and click-outside handling
- Fixed score breakdown overflow/placement edge cases when overlay is compact or near viewport boundaries
- Fixed list scrolling ergonomics by enabling item-level scroll snapping so issues land cleanly in view with wheel/touch scroll

## [1.0.6] - 2026-03-05

### Added

- Added scoring-mode visibility behavior tests to validate strict full-DOM analysis and perceivable-only filtering in other modes

### Changed

- `strict` mode now analyzes all elements present in the DOM (including hidden variants)
- `normal`, `moderate`, `soft`, and `custom` modes now apply perceivable-only filtering during audit aggregation
- Updated Settings popover scoring mode descriptions to document the new visibility behavior

### Fixed

- Improved fixed/sticky overlap rule behavior (`RWD-04`) so hidden variant handling is mode-aware and consistent with scoring mode intent

## [1.0.5] - 2026-03-05

### Fixed

- Refined popover placement behavior so menus open consistently around their trigger button while staying inside viewport bounds
- Fixed alignment of toolbar button emojis/icons so they render centered inside each button
- Added dedicated badge symbol styling (`.wah-badge-symbol`) and applied targeted vertical offset for better symbol alignment

### Changed

- Rebalanced overlay spacing in list/filter areas (`.wah-filter`, `.wah-panel`, `.wah-list`, `.wah-issue-item`) to avoid excessive padding and improve readability
- Updated chip styling (`.wah-chip`) with tuned typography and corner radius for a less aggressive pill shape

## [1.0.4] - 2026-03-02

### Fixed

- Fixed popover styling issues where Filters, Settings, and UI settings popovers displayed collapsed/overlapping text
- Consolidated `.wah-pop-row` styles to `popover-base.css` for consistent styling across all popovers
- Improved re-run consistency by implementing `cleanupWAH()` function that properly resets overlay, styles, and viewport patches between audits

### Changed

- Moved common popover styles from `popover-filters.css` to `popover-base.css` for better maintainability

### Documentation

- Added comprehensive Next.js / SSR frameworks section with JavaScript and TypeScript examples
- Added FAQ / Troubleshooting section covering common errors (`Module not found`, `window is not defined`, React Strict Mode double execution)
- Updated Quick Start section to distinguish between Browser Bundlers (SPAs) and SSR frameworks
- Fixed CDN example version from 1.0.0 to 1.0.3
- Added SSR-specific warnings and best practices

## [1.0.3] - 2026-03-01

### Fixed

- Fixed SSR compatibility by moving `window` and `document` access from top-level to inside `runWAH()` function
- Added SSR guard (`typeof window === "undefined"`) to prevent "window is not defined" errors in Next.js and other SSR frameworks
- Moved global handler registration (`__WAH_RERUN__`, `__WAH_RESET_HIDE__`, `__WAH_FOCUS_ISSUE__`) inside function scope

### Changed

- Refactored module initialization to be SSR-safe with lazy window access
- Module can now be safely imported in SSR contexts without runtime errors

## [1.0.2] - 2026-02-28

### Changed

- Added dual module format support (ESM + CommonJS) for maximum compatibility
- Updated build output to generate `.mjs` (ESM) and `.cjs` (CommonJS) files
- Added conditional exports in package.json with proper type definitions for both formats
- Enhanced tsup configuration to output separate `.d.ts` and `.d.cts` type definitions

### Fixed

- Fixed module resolution issues in CommonJS projects
- Improved compatibility with bundlers that don't fully support ESM

## [1.0.1] - 2026-02-27

### Changed

- Updated Node.js version requirement to >=18.0.0 in package.json
- Created `.nvmrc` file specifying Node.js 22.12.0 for consistent development environment
- Regenerated package-lock.json with clean install

### Infrastructure

- Enhanced GitHub Actions CI workflow with dependency verification
- Added proper npm authentication using NODE_AUTH_TOKEN
- Configured multi-Node testing matrix (18.x, 20.x, 21.x)
- Fixed Rollup native dependency issues in CI pipeline

## [1.0.0] - 2026-03-01

### Added

#### Core Features

- **61 comprehensive audit rules** across 8 categories (Accessibility, SEO, Semantic HTML, Responsive Design, Security, Quality, Performance, Forms)
- **Visual overlay interface** with drag & drop, collapsible panels, and responsive positioning
- **Interactive popover** with advanced filtering by severity and category
- **5 scoring modes**: strict (25/10/5), normal (20/8/4), moderate (20/8/0), soft (20/0/0), custom
- **Auto-calibrated custom filters** that adjust multipliers based on active categories
- **Export reports** in JSON, TXT, and HTML formats with complete metadata
- **Console diagnostics** with filterable tables, issue focusing, and timestamps
- **Global commands**: `__WAH_RERUN__()`, `__WAH_RESET_HIDE__()`, `__WAH_FOCUS_ISSUE__(index)`

#### Accessibility Checks (26)

- ACC-01: Missing HTML lang attribute
- ACC-02: Image missing alt text
- ACC-03: Link missing accessible name
- ACC-04: Button missing accessible name
- ACC-05: Form control missing id/name
- ACC-06: Label missing for attribute
- ACC-07: Form control missing label
- ACC-09: Missing H1 heading
- ACC-10: Heading hierarchy jumps
- ACC-11: Invalid aria-labelledby references
- ACC-12: Invalid aria-describedby references
- ACC-13: Positive tabindex usage
- ACC-14: Nested interactive elements
- ACC-15: Iframe missing title
- ACC-16: Video missing controls
- ACC-17: Table missing caption
- ACC-18: Table header missing scope
- ACC-19: Vague link text (e.g., "click here")
- ACC-20: Link missing href attribute
- ACC-21: Focus not visible (outline disabled)
- ACC-22: Text too small (minimum 12px detected)
- ACC-23: Duplicate IDs in DOM
- ACC-24: Missing skip link to main content
- ACC-25: Insufficient color contrast (WCAG AA/AAA detection)
- ACC-26: Low line-height (< 1.4 detected)

#### SEO Checks (8)

- SEO-01: Missing or empty title element
- SEO-02: Missing meta description
- SEO-03: Missing charset declaration
- SEO-05: Missing canonical link
- SEO-06: Meta robots contains noindex
- SEO-07: Missing Open Graph tags (og:title, og:description, og:image)
- SEO-08: Missing Twitter Card tags

#### Semantic HTML Checks (7)

- SEM-01: Improper use of `<b>/<i>` instead of `<strong>/<em>`
- SEM-02: Low semantic structure (excessive generic divs)
- SEM-03: Multiple H1 elements
- SEM-04: Missing main element
- SEM-05: Multiple main elements
- SEM-06: Navigation without list structure
- SEM-07: False list structure (divs instead of li)

#### Responsive Design Checks (5)

- RWD-01: Large fixed-width elements
- RWD-02: Missing viewport meta tag
- RWD-03: Horizontal overflow detected
- RWD-04: Fixed/sticky element obscuring content
- RWD-05: Problematic 100vh usage

#### Security Checks (1)

- SEC-01: target=_blank without noopener/noreferrer

#### Quality Checks (2)

- QLT-01: Excessive inline styles
- QLT-02: Dummy links (href="#" patterns)

#### Performance Checks (10)

- PERF-01: Images missing srcset/sizes
- PERF-02: Excessive font families/weights
- PERF-03: Excessive external scripts
- PERF-04: Scripts without defer in head
- PERF-05: Render-blocking CSS
- PERF-06: Missing cache headers
- IMG-01: Images missing width/height attributes
- IMG-02: Images missing lazy loading
- IMG-03: Images missing async decode
- MEDIA-01: Video autoplay without muted

#### Form Checks (4)

- FORM-01: Submit button outside form
- FORM-02: Required input without indicator
- FORM-03: Email/tel input with wrong type
- FORM-04: Missing autocomplete attribute

#### UI & Configuration

- Framework-agnostic overlay positioning (bottom-right, bottom-left, top-right, top-left)
- Configurable minimum font size (default: 12px)
- Configurable WCAG contrast level (AA/AAA)
- Hide overlay temporarily (in minutes) or until page refresh
- Drag & drop overlay repositioning
- Real-time category score breakdown
- Dynamic status indicator (A-F grading)
- Responsive design with mobile support

#### Output & Reporting

- **JSON export**: Complete audit data with metadata
- **TXT export**: Human-readable format with issue details
- **HTML export**: Styled report with visual score indicators
- Report metadata includes:
  - Scoring mode and applied filters
  - Viewport dimensions and user agent
  - Timestamp and WAH version
  - Issue summary statistics

#### Developer Experience

- Zero runtime dependencies (TypeScript + tsup only)
- Full TypeScript support with strict mode enabled
- Console-friendly diagnostic tables
- Issue selector display for DOM targeting
- Detailed fix recommendations for each issue
- Global helper functions for debugging and interaction

### Technical Details

- **Bundle size**: ~108 KB (minified)
- **Browser support**: All modern browsers (ES2019+)
- **Node.js support**: 18.0.0 or higher
- **Build tool**: tsup (TypeScript bundler)
- **Type definitions**: Full TypeScript exports included

### Documentation

- Comprehensive README with Quick Start guide
- Detailed configuration reference
- Complete rules documentation with descriptions and fixes
- Architecture overview
- API reference
- Contributing guidelines
- Roadmap for future versions

### Infrastructure

- GitHub Actions CI/CD pipeline for automated testing and building
- Unit tests framework setup (Vitest)
- .npmignore for clean package distribution
- Semantic versioning strategy

---

## Planned Changes

### [1.3] - Documentation & Developer Guidance (Planned)

- Rule Fix Guides for each rule (Problem, Why, Fix, Bad/Good examples)
- "Learn more" links from overlay and reports to rule docs
- Expanded architecture/rules/contribution guides
- Consistency pass across rule metadata, overlay copy, report output, and docs

### [1.4] - Core Consistency & Registry Hardening (Planned)

- Internal registry hardening as single source of truth for rules
- Standardized per-rule metadata contracts for overlay/report/docs
- Overlay isolation hardening to avoid self-auditing false positives
- Keep expensive heuristics bounded via sampling caps, thresholds, and opt-out

### [1.5] - External Auditing (Planned)

- Official bookmarklet for auditing any site
- Export enhancements (run comparison, richer metadata, better HTML report, code suggestions)

### [2.0] - Automation & Ecosystem (Future)

- CLI audits for URLs/files with headless automation
- CI/CD integration with score thresholds
- Official plugin system

### [2.x] - Ecosystem Growth (Future)

- DevTools browser extension
- Team/company policy profiles and standards

---

## Migration Guide

### From Previous Versions

This is the initial release. No migration needed.

---

## Support

For issues, feature requests, or questions:

- 📧 GitHub Issues: <https://github.com/Storbo2/web-audit-helper/issues>
- 📖 Documentation: See docs/ folder
- 💬 Discussions: GitHub Discussions (coming soon)
