# WAH – Web Audit Helper 🧠

[![npm version](https://img.shields.io/npm/v/web-audit-helper)](https://www.npmjs.com/package/web-audit-helper)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)

WAH is a **framework-agnostic JavaScript/TypeScript library** that helps developers audit web pages for accessibility, SEO, semantic HTML, responsive design, security, quality, performance, and form validation.

It provides **real-time DOM analysis**, a **floating visual overlay**, **console diagnostics**, and **exportable reports** without any runtime dependencies.

---

## ✨ Features

- ♿ **60+ Accessibility checks** (WCAG AA/AAA, font size, alt text, labels, contrast, ARIA, skip links)
- 🧱 **Semantic HTML analysis** (proper elements, H1 hierarchy, main/nav/section structure)
- 🔍 **SEO best practices** (title, meta description, viewport, canonical, Open Graph, Twitter Cards)
- 📱 **Responsive design heuristics** (viewport meta, fixed-width, 100vh issues, overflow)
- 🔒 **Security checks** (target=_blank, tabnabbing, unsafe patterns)
- ✨ **Code quality patterns** (inline styles, semantic IDs/classes, deprecated elements)
- ⚡ **Performance optimization** (image optimization, lazy loading, async decode, script placement, caching, render-blocking resources)
- 📋 **Form validation** (proper types, autocomplete, required indicators, label association)
- 🎨 **Interactive overlay** with drag, hide, category filters, and issue focus
- 📊 **5 scoring modes** (strict/normal/moderate/soft/custom) with auto-calibration
- 📤 **Export reports** (JSON, TXT, HTML) with complete metadata
- 🧩 **Framework-agnostic** (works with vanilla JS, React, Vue, Angular, etc.)
- 🧹 **Zero runtime dependencies** (only dev dependencies)
- ⏳ **Temporary hide system** (hide overlay for X minutes or until next refresh)
- 🧠 **Console diagnostics** with issue focusing and timestamps

---

## 🚀 Installation

```bash
npm install web-audit-helper
```

---

## 📖 Quick Start

### Browser (via CDN)

```html
<script type="module">
    import { runWAH } from 'https://unpkg.com/web-audit-helper@1.0.0/dist/index.js';

    // Run with default configuration
    await runWAH();
</script>
```

### Node.js / Module Bundler

```javascript
import { runWAH } from 'web-audit-helper';

// Default configuration (recommended for development)
await runWAH();

// Custom configuration
await runWAH({
    logs: true,
    logLevel: 'full',
    issueLevel: 'all',
    accessibility: {
        minFontSize: 12,
        contrastLevel: 'AA'
    },
    overlay: {
        enabled: true,
        position: 'bottom-right',
        hide: 0
    }
});
```

---

## ⚙️ Configuration

WAH supports extensive configuration options for customization:

| Option                        | Type                                | Default          | Description                                                    |
| ----------------------------- | ----------------------------------- | ---------------- | -------------------------------------------------------------- |
| `logs`                        | `boolean`                           | `true`           | Enable console logging                                         |
| `logLevel`                    | `'full' \| 'summary' \| 'none'`     | `'full'`         | Console verbosity level                                        |
| `issueLevel`                  | `'critical' \| 'warnings' \| 'all'` | `'all'`          | Filter which issues to report                                  |
| `accessibility.minFontSize`   | `number`                            | `12`             | Minimum font size in pixels                                    |
| `accessibility.contrastLevel` | `'AA' \| 'AAA'`                     | `'AA'`           | WCAG contrast requirement level                                |
| `overlay.enabled`             | `boolean`                           | `true`           | Show visual overlay interface                                  |
| `overlay.position`            | `string`                            | `'bottom-right'` | Overlay position (bottom-left/bottom-right/top-left/top-right) |
| `overlay.hide`                | `number`                            | `0`              | Hide overlay for X milliseconds on load                        |

**For complete configuration documentation**, see [Configuration Guide](docs/configuration.md).

---

## 📊 Scoring System

WAH calculates a score from **0-100** with letter grades **A-F**:

### Scoring Modes

- **strict** (25/10/5): Most aggressive penalties – catches all issues
- **normal** (20/8/4): Balanced default – recommended for general use
- **moderate** (20/8/0): Ignores recommendations – focuses on critical/warnings
- **soft** (20/0/0): Only critical issues – strictest scope
- **custom**: User-controlled filters with auto-calibrated multipliers

### Custom Filters

Enable custom mode to filter by:
- **Severities**: critical, warning, recommendation
- **Categories**: accessibility, seo, semantic, responsive, security, quality, performance, form

Multipliers automatically calibrate based on active categories:
- 1 category: 4x reduction
- 2 categories: 2x reduction
- 3-4 categories: 1.33x reduction
- 5+ categories: no reduction

---

## 🎯 Audit Rules (+60 Total)

WAH implements comprehensive audit rules across **8 categories**:

### Accessibility
Font size, alt text, labels, links, buttons, ARIA, skip links, headings, focus, contrast, line-height, etc.

### Semantic HTML
H1 hierarchy, semantic elements (strong/em), main, nav, canonical structure

### SEO
Title, meta description, viewport, canonical, Open Graph, Twitter Cards, charset, robots

### Responsive Design
Viewport meta, fixed widths, overflow, fixed elements, 100vh issues

### Security
Target=_blank security (tabnabbing prevention)

### Quality
Inline styles, dummy links, semantic naming

### Performance
Image optimization, lazy loading, async decode, script placement, fonts, caching, render-blocking CSS

### Forms
Submit buttons, required indicators, input types, autocomplete

**For complete rules reference**, see [Rules Documentation](docs/rules.md).

---

## 🎮 Console Commands

WAH exposes global commands for interaction:

### `__WAH_FOCUS_ISSUE__(index)`
Highlights a specific issue element in the DOM and logs its details.
```javascript
__WAH_FOCUS_ISSUE__(0)  // Focus on first issue
```

### `__WAH_RESET_HIDE__()`
Clears hide settings and reloads the overlay.
```javascript
__WAH_RESET_HIDE__()  // Restore overlay immediately
```

### `__WAH_RERUN__()`
Re-runs the audit after DOM changes without page reload.
```javascript
__WAH_RERUN__()  // Refresh audit
```

---

## 📤 Export Reports

Run WAH with logging enabled to export reports to the console:

```javascript
await runWAH({
    logs: true,
    logLevel: 'full'
});

// Reports are printed to console as:
// - Table format (filtered by category and severity)
// - JSON export
// - TXT export (with detailed formatting)
// - HTML export (full report with styling)
```

Reports include:
- Overall score and grade
- Score by category
- Detailed issue list with CSS selectors
- Applied filters and scoring mode
- Viewport and user agent info
- Timestamp and WAH version

---

## 🎨 Overlay & Interface

<!-- TODO: Add screenshots of overlay at different positions, popover components -->
<!-- Screenshots should show:
  - Overlay positioned bottom-right with score badge
  - Overlay positioned top-left
  - Popover expanded showing filters
  - Popover showing export options
  - Popover showing settings
  - Console table with issues
-->

The overlay provides a floating interface with:

- **Score badge**: Displays overall score and grade
- **Category breakdown**: Shows individual category scores
- **Issue list**: Filterable by severity (critical/warning/recommendation) and category
- **Issue focus**: Click to highlight elements in the DOM
- **Filters**: Toggle severities and categories to customize scoring
- **Settings**: Configure min font size, contrast level, scoring mode
- **Export**: Download audit reports in JSON, TXT, or HTML format
- **Hide**: Temporarily hide overlay for X minutes or until next refresh

---

## 🏗️ Architecture

WAH is organized into clear modules:

- **`core/`**: Audit engine with 60+ rules across 8 categories
- **`overlay/`**: Visual UI components (Overlay, Popover, filters, drag)
- **`reporters/`**: Export formats (JSON, TXT, HTML) with metadata
- **`utils/`**: Shared utilities (console logging, DOM helpers)

**For architecture details**, see [Architecture Guide](docs/architecture.md).

---

## 🔧 API Reference

### `runWAH(userConfig?: Partial<WAHConfig>): Promise<AuditResult>`

Main entry point to run the audit.

**Parameters:**
- `userConfig` (optional): Partial configuration object to override defaults

**Returns:**
- `AuditResult`: Object containing issues array and overall score

**Example:**
```javascript
const result = await runWAH({ logLevel: 'summary' });
console.log(`Score: ${result.score}%`);
console.log(`Issues: ${result.issues.length}`);
```

**For complete API documentation**, see [API Reference](docs/api.md).

---

## 🧪 Testing

```bash
npm run test        # Run tests once
npm run test:watch  # Watch mode
npm run test:ui     # Interactive UI
```

---

## 🤝 Contributing

We welcome contributions! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:
- Reporting issues
- Submitting pull requests
- Adding new rules
- Code style and conventions

---

## 📋 Roadmap

### v1.0.0 (Current)
- 60+ audit rules implemented
- Visual overlay with filtering and export
- 5 scoring modes with auto-calibration
- Console diagnostics and commands
- Zero runtime dependencies

### v1.1.0 (Planned)
- 10+ additional rules (obsolete elements, ARIA, touch targets, etc.)
- Extended testing framework
- Comprehensive documentation
- Performance improvements

### v2.0.0 (Future)
- CLI tool for CI/CD integration
- Framework plugins (React, Vue, Angular)
- Advanced performance profiling
- DevTools integration
- Custom rule registration

---

## 📄 License

MIT – See [LICENSE](LICENSE) for details

---