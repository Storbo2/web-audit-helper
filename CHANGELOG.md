# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
- SEM-01: Improper use of <b>/<i> instead of <strong>/<em>
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

### [1.1.0] - Planned

- 10+ additional audit rules (deprecated HTML, ARIA validation, touch targets, etc.)
- Extended testing coverage (>80%)
- Performance improvements for large DOMs
- Advanced rule customization
- CLI tool for programmatic access

### [2.0.0] - Future

- CLI tool for CI/CD integration
- Framework-specific plugins (React, Vue, Angular)
- Performance profiling and metrics
- Chrome DevTools integration
- Custom rule registration API

---

## Migration Guide

### From Previous Versions

This is the initial release. No migration needed.

---

## Support

For issues, feature requests, or questions:
- 📧 GitHub Issues: https://github.com/Storbo2/web-audit-helper/issues
- 📖 Documentation: See docs/ folder
- 💬 Discussions: GitHub Discussions (coming soon)