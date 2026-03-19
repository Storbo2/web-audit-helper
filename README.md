# WAH – Web Audit Helper 🧠

[![npm version](https://img.shields.io/npm/v/web-audit-helper?cacheSeconds=300)](https://www.npmjs.com/package/web-audit-helper)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)

WAH is a **framework-agnostic JavaScript/TypeScript library** that helps developers audit web pages for accessibility, SEO, semantic HTML, responsive design, security, quality, performance, and form validation.

It provides **real-time DOM analysis**, a **floating visual overlay**, **console diagnostics**, and **exportable reports** without any runtime dependencies.

---

## ✨ Features

- ♿ **75 Audit rules** across 8 categories (Accessibility, SEO, Semantics, Responsive, Security, Quality, Performance, Forms)
- 🧱 **Semantic HTML analysis** (proper elements, H1 hierarchy, main/nav/section structure)
- 🔍 **SEO best practices** (title, meta description, viewport, canonical, Open Graph, Twitter Cards)
- 📱 **Responsive design heuristics** (viewport meta, fixed-width, 100vh issues, overflow)
- 🔒 **Security checks** (target=_blank, tabnabbing, mixed content, unsafe patterns)
- ⚡ **Performance optimization** (image optimization, lazy loading, async decode, script placement, caching, render-blocking resources)
- 📋 **Form validation** (proper types, autocomplete, required indicators, label association)
- 🎨 **Interactive overlay** with drag, hide, category filters, and issue focus
- 📊 **5 scoring modes** (strict/normal/moderate/soft/custom) with auto-calibration
- 📤 **Export reports** (JSON, TXT, HTML) with complete metadata
- 🧩 **Framework-agnostic** (works with vanilla JS, React, Vue, Angular, etc.)
- 🧹 **Zero runtime dependencies** (only dev dependencies)
- ⏳ **Temporary hide system** (hide overlay for X minutes or until next refresh)
- 🧠 **Console diagnostics** with issue focusing and timestamps
- 🌐 **Internationalization** with English and Spanish support

---

## 🚀 Installation

```bash
npm install web-audit-helper
```

---

## 📖 Quick Start

### Documentation Map

- Quick Start (this file)
- External Auditing: [External Auditing Guide](docs/external-auditing.md)
- SSR/Next usage: [Next.js / SSR Frameworks](#nextjs--ssr-frameworks)
- Advanced config: [Configuration](docs/configuration.md)
- Exports and metadata: [Exports and Metadata](docs/exports-metadata.md)
- Roadmap: [Product Roadmap](docs/roadmap.md)

### Which Mode Should I Use?

| Mode | Best for |
| --- | --- |
| embedded | local development and direct app integration |
| external | bookmarklet-driven audits on already-open pages |

Common use cases:

- I am building a site/app and want continuous feedback: use embedded mode.
- I want to audit any page from the browser quickly: use external mode.
- I want CI/headless automation: planned for v2.0 CLI, not part of v1.5.0.

### Browser (via CDN)

```html
<script type="module">
  import { runWAH } from 'https://unpkg.com/web-audit-helper@1.5.0/dist/index.js';

    // Run with default configuration
    await runWAH();
</script>
```

### Browser Bundlers (Vite / Create React App / Vue SPA)

> **⚠️ SSR Frameworks**: If using Next.js, Nuxt, SvelteKit or similar, see the [Next.js / SSR Frameworks](#nextjs--ssr-frameworks) section below.

```javascript
import { runWAH } from 'web-audit-helper';

// Default configuration (recommended for development)
await runWAH();

// Custom configuration
await runWAH({
    logs: true,
    logLevel: 'full',
    issueLevel: 'all',
  auditMetrics: {
    enabled: true,
    includeInReports: false,
    consoleTopSlowRules: 10,
    consoleMinRuleMs: 0
  },
  rules: {
    'ACC-02': 'off',
    'ACC-22': { severity: 'warning', threshold: 14 },
    'ACC-10': 'critical',
    'ACC-25': { threshold: 5 },
    'UX-01': { threshold: 48 }
  },
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

### External Auditing (Bookmarklet)

WAH now includes a generated bookmarklet for external audits against already-open pages.

1. Run build:

```bash
npm run build
```

1. Copy the single line from `dist/bookmarklet.txt`.
2. Create a browser bookmark and paste that line as URL.
3. Open any target page and click the bookmark.

Runtime loading strategy:

- Primary: IIFE runtime from jsDelivr (`external-runtime.iife.js`)
- Fallback: ESM runtime from jsDelivr (`external-runtime.mjs`)

If CSP blocks both loads, WAH shows a clear error and aborts external execution.

Where is `dist/bookmarklet.txt`?

- It is generated when building this repository (`npm run build`), because `postbuild` runs `scripts/gen-bookmarklet.mjs`.
- If you are inside another app repo (for example React/PHP) and only installed WAH as dependency, you will not automatically get this repository build pipeline output.
- For external auditing, use either:
  - bookmarklet from this repository build output, or
  - bookmarklet generated from the published version (`web-audit-helper@1.5.0`).

Detailed external auditing flow:

1. Build local artifacts (`npm run build`).
2. Install bookmarklet from `dist/bookmarklet.txt`.
3. Open a target page already loaded in your browser.
4. Trigger the bookmarklet.
5. Export JSON/HTML from the overlay.
6. Run a second audit and export again to validate run comparison.

v1.5 capabilities now available in external mode:

- `runtimeMode = external` in exported metadata
- Extended metadata (`runId`, `targetUrl`, `executedAt`, `wahVersion`, `issueCountBySeverity`, `categoryScores`, `rulesExecuted`, `rulesSkipped`, `totalAuditMs`)
- Optional run comparison in JSON and HTML exports (overall score delta, severity delta, added/removed rule IDs, category deltas, timing delta when metrics exist)

Pre1.5 local validation flow (before npm publish):

1. Build artifacts locally:

```bash
npm run build
```

1. Start a local static server from repository root:

```bash
npx http-server . -p 4173 --cors
```

1. Use a local bookmarklet URL that targets `http://127.0.0.1:4173/dist`.
2. Validate permissive and blocking fixtures:
   - `http://127.0.0.1:4173/examples/csp-permissive.html`
   - `http://127.0.0.1:4173/examples/csp-blocking.html`

Post-publish real-page flow (release validation):

1. Publish `web-audit-helper@1.5.0` to npm.
2. Rebuild bookmarklet so it points to fixed jsDelivr `@1.5.0` assets.
3. Validate in at least one static target and one SPA target.
4. Export JSON/HTML and verify `meta.runtimeMode = external` and run comparison block.

Release-gate checklist for real pages:

1. Validate at least one static website and one SPA website.
2. Confirm no fatal bootstrap error on successful targets.
3. Confirm JSON export includes `meta.runtimeMode = external`.
4. Confirm second-run export includes comparison diff in JSON/HTML.
5. Record evidence (screenshots + console/network excerpts).

Quick FAQ (v1.5 external audits):

- Why does external auditing fail on some pages?
  - Strict CSP can block script injection and dynamic imports. WAH aborts with a clear error in this case.
- Does it work behind login?
  - Yes, if the page is already open and authenticated in the current tab/session.
- Does it crawl multiple pages?
  - No. v1.5 audits only the currently open page.
- Can I run it in CI headless mode?
  - Not in v1.5. That is planned for future CLI/headless milestones.

Troubleshooting matrix:

- `ERR_CONNECTION_REFUSED` for `127.0.0.1:4173`:
  - Local static server is not running. Start `npx http-server . -p 4173 --cors`.
- `Failed to load external-runtime.iife.js` on real pages:
  - Usually strict CSP or blocked third-party script injection.
- `Failed to fetch dynamically imported module`:
  - ESM fallback blocked by CSP/CORS/network policy.
- Overlay appears on fixture but not on enterprise sites:
  - Expected for strict CSP sites. Use that as controlled failure evidence.

QA checklist for CSP permissive/blocking validation:

- English: [External Auditing QA](docs/external-auditing-qa.md)
- Espanol: [QA de Auditoria Externa](docs/es/external-auditing-qa.md)

### Next.js / SSR Frameworks

**WAH runs in the browser only (requires DOM).**

SSR frameworks must run it client-side using a **Client Component** + `useEffect`.

Use **dynamic import** to avoid `window is not defined` errors.

#### JavaScript Example (App Router)

```jsx
// src/components/WahRunner.jsx
'use client';

import { useEffect } from 'react';

export default function WahRunner() {
  useEffect(() => {
    import('web-audit-helper')
      .then(({ runWAH }) => runWAH())
      .catch(console.error);
  }, []);

  return null;
}
```

```jsx
// app/layout.js
import WahRunner from '@/components/WahRunner';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <WahRunner />
        {children}
      </body>
    </html>
  );
}
```

#### TypeScript Example (App Router)

```tsx
// src/components/WahRunner.tsx
'use client';

import { useEffect, useRef } from 'react';

export default function WahRunner() {
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    import('web-audit-helper')
      .then(({ runWAH }) => runWAH())
      .catch(console.error);
  }, []);

  return null;
}
```

```tsx
// app/layout.tsx
import type { ReactNode } from 'react';
import WahRunner from '@/components/WahRunner';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WahRunner />
        {children}
      </body>
    </html>
  );
}
```

**Why dynamic import?** It prevents the server from evaluating the module, eliminating `window is not defined` errors.

**Why `useRef` in TypeScript?** React Strict Mode runs `useEffect` twice in development; `useRef` ensures WAH only runs once.

---

## ⚙️ Configuration

WAH supports extensive configuration options for customization:

- `logs` (`boolean`, default: `true`): Enable console logging.
- `consoleOutput` (`'none' | 'minimal' | 'standard' | 'detailed' | 'debug'`, default: `'standard'`): Console output preset (controls `logLevel`, `logging`, `scoreDebug`, and `auditMetrics`).
- `issueLevel` (`'critical' | 'warnings' | 'all'`, default: `'all'`): Filter which issues to report.
- `locale` (`'en' | 'es'`, default: auto): User-facing language (`es` if browser language is Spanish).
- `rules` (`Record<string, RuleOverrideValue>`, default: `undefined`): Rule-level overrides by stable rule ID (disable, severity, threshold).
- `accessibility.minFontSize` (`number`, default: `12`): Minimum font size in pixels.
- `accessibility.contrastLevel` (`'AA' | 'AAA'`, default: `'AA'`): WCAG contrast requirement level.
- `overlay.enabled` (`boolean`, default: `true`): Show visual overlay interface.
- `overlay.position` (`string`, default: `'bottom-right'`): Overlay position (`bottom-left`/`bottom-right`/`top-left`/`top-right`).
- `overlay.hide` (`number`, default: `0`): Hide overlay for X milliseconds on load.

**Rule overrides** (`rules` field):

- `'off'` disables a rule entirely by ID — it is skipped at runtime.
- Severity override — string: `'critical'`, `'warning'`, `'recommendation'` — or object: `{ severity: 'warning' }`.
- `threshold` is supported for: `ACC-21` (focus sample size), `ACC-22` (min font size px), `ACC-25` (min contrast ratio), `ACC-26` (min line-height), `UX-01` (min touch target px), `RWD-01` (min width risk px), `RWD-04` (min fixed/sticky overlap ratio), `PERF-02` (max font resources), `PERF-03` (max external scripts), `PERF-06` (min static resources for cache reminder), `PERF-08` (image sample size).
- Threshold and severity can be combined: `{ severity: 'critical', threshold: 16 }`.

Audit metrics options (`auditMetrics` field):

- `enabled` (default: `true`): track total and per-rule execution time.
- `includeInReports` (default: `false`): include metrics in JSON/TXT/HTML exports.
- `consoleTopSlowRules` (default: `10`): max slow rules shown in console timing table.
- `consoleMinRuleMs` (default: `0`): minimum ms threshold to appear in timing table.

Score debugging:

- `scoreDebug` (default: `false`): shows detailed per-category score breakdown with multipliers and weighted contributions in the console.

Enhanced logging options (`logging` object):

- `timestamps` (default: `false`): include timestamps in console logs.
- `groupByCategory` (default: `true` only in detailed/debug presets): group issues by category.
- `showStatsSummary` (default: `true` only in detailed/debug presets): display statistics tables.
- `useIcons` (default: `true` in standard/detailed/debug): add visual icons (🔴 ⚠️ 💡) to issues.

### Configuration Examples

```javascript
// Full developer experience with all enhancements
await runWAH({
  scoreDebug: true,
  logging: {
    timestamps: true,
    groupByCategory: true,
    showStatsSummary: true,
    useIcons: true
  }
});

// Minimal clean output
await runWAH({
  logging: {
    timestamps: false,
    groupByCategory: false,
    showStatsSummary: false,
    useIcons: false
  }
});

// Custom rule configuration with metrics
await runWAH({
  rules: {
    'ACC-22': { threshold: 16 },  // Custom font size minimum
    'ACC-01': 'off',              // Disable html lang check
    'SEO-01': { severity: 'critical' }  // Upgrade to critical
  },
  auditMetrics: {
    enabled: true,
    consoleTopSlowRules: 5,
    consoleMinRuleMs: 1
  }
});
```

**For complete configuration documentation**, see [Configuration Guide](docs/configuration.md).
Spanish version: [Guia de Configuracion](docs/es/configuration.md).
Contribution guide: [Contributing](docs/contributing.md).
Guia de contribucion: [Contribuir](docs/es/contributing.md).

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

## 🎯 Audit Rules (75 Total)

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

Target=_blank security, mixed-content detection, transport safety

### Quality

Inline styles, dummy links, duplicate controls, semantic naming

### Performance

Image optimization, lazy loading, async decode, script placement, fonts, caching, render-blocking CSS

### Forms

Submit buttons, required indicators, input types, autocomplete

**For complete rules reference**, see [Rules Documentation](docs/rules.md).
Quick index by rule ID: [Rules Guide](docs/rules-guide.md).
Spanish version: [Documentacion de Reglas](docs/es/rules.md).
Indice rapido en espanol: [Guia de Reglas](docs/es/rules-guide.md).

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

## ⌨️ Keyboard Shortcuts

WAH overlay supports keyboard shortcuts for improved accessibility and productivity:

- **Escape**: Toggle overlay collapse/expand
- **Ctrl/Cmd + E**: Rerun audit
- **Alt + W**: Focus on overlay (for keyboard navigation)
- **Tab/Shift+Tab**: Navigate through overlay controls with focus trap

All interactive elements support keyboard navigation with visible focus indicators.

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
- **Settings**: Configure scoring mode, hide behavior, and language selector (`en`/`es`) with persistence across reloads
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
Spanish version: [Guia de Arquitectura](docs/es/architecture.md).

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
Spanish version: [Referencia de API](docs/es/api.md).

---

## 🌐 Internationalization

- Built-in locales: `en`, `es`
- Internal IDs and config keys remain in English
- User-facing strings are localized (overlay, console, TXT/HTML reports, docs)
- Locale resolution order: `userConfig.locale` -> persisted selector value -> browser detection (`es*` => `es`, otherwise `en`)
- Runtime translations are loaded from JSON locale payloads in `locales/<lang>/common.json`
- JSON reports stay in English for machine integrations
- Overlay header title is fixed as `WAH Report`; report title is fixed as `Web Audit Helper Report`

For contribution workflow and community translation model, see [Translations Guide](docs/translations.md).

---

## ❓ FAQ / Troubleshooting

### `Module not found: Can't resolve 'web-audit-helper'`

**Cause**: Package not installed, workspace misconfigured, or lockfile inconsistency.

**Solution**:

```bash
rm -rf node_modules package-lock.json
npm install
```

Or verify the package is listed in `package.json` dependencies:

```bash
npm install web-audit-helper --save-dev
```

### `ReferenceError: window is not defined`

**Cause**: You're importing or executing WAH during server-side rendering (SSR).

**Solution**: Use a Client Component with dynamic import:

```tsx
'use client';
import { useEffect } from 'react';

export default function WahRunner() {
  useEffect(() => {
    import('web-audit-helper')
      .then(({ runWAH }) => runWAH())
      .catch(console.error);
  }, []);
  return null;
}
```

See the [Next.js / SSR Frameworks](#nextjs--ssr-frameworks) section for complete examples.

### WAH runs twice in development (React Strict Mode)

**Cause**: React Strict Mode intentionally double-invokes `useEffect` in development to detect side effects.

**Solution**: Use a `useRef` guard:

```tsx
const ran = useRef(false);

useEffect(() => {
  if (ran.current) return;
  ran.current = true;
  
  import('web-audit-helper')
    .then(({ runWAH }) => runWAH())
    .catch(console.error);
}, []);
```

### Issues detected vary between page refresh (F5) and re-run button

**Cause**: DOM state may differ between fresh page load and re-audit after dynamic changes.

**Solution**: Use `__WAH_RERUN__()` after significant DOM changes, or refresh the page (F5) for a clean audit.

---

## 🧪 Testing

```bash
npm run test        # Run tests once
npm run test:watch  # Watch mode
npm run test:ui     # Interactive UI
```

---

## 🤝 Contributing

We welcome contributions! Please read [Contributing Guide](docs/contributing.md) and [Guia de Contribucion](docs/es/contributing.md) for guidelines on:

- Reporting issues
- Submitting pull requests
- Adding new rules
- Code style and conventions

---

## 📋 Roadmap

Current and future roadmap is maintained in:

- [Product Roadmap](docs/roadmap.md)

Release-by-release historical details are maintained in:

- [CHANGELOG](CHANGELOG.md)
- [Release Notes](RELEASE-NOTES.md)

---

## 📄 License

MIT – See [LICENSE](LICENSE) for details

---
