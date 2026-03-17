# Configuration Guide

Complete reference for all WAH configuration options.

## Basic Configuration

```javascript
import { runWAH } from 'web-audit-helper';

await runWAH({
    logs: true,
    logLevel: 'full',
    issueLevel: 'all',
    locale: 'en',
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

## Full Configuration Reference

### Root Level Options

- `logs`
    Type: `boolean`
    Default: `true`
    Description: Enable/disable console logging of audit results.

- `logLevel`
    Type: `'full' | 'summary' | 'none'`
    Default: `'full'`
    Description: Console output verbosity.

- `issueLevel`
    Type: `'critical' | 'warnings' | 'all'`
    Default: `'all'`
    Description: Filter which issue severities to report.

- `locale`
    Type: `'en' | 'es'`
    Default: `auto`
    Description: User-facing language for overlay, console, and TXT/HTML reports.

- `scoringMode`
    Type: `'strict' | 'normal' | 'moderate' | 'soft' | 'custom'`
    Default: `'normal'`
    Description: Scoring profile and DOM visibility analysis mode.

### Locale Resolution and Persistence

- `runWAH({ locale })` has highest priority.
- If no locale is provided in config, WAH uses the persisted language selected in Settings page 2.
- If no persisted language exists, WAH auto-detects browser language (`es*` -> `es`, otherwise `en`).

Notes:

- Overlay main title is always `WAH Report`.
- Human-facing report title is always `Web Audit Helper Report`.
- JSON report output remains English for integrations.

### Accessibility Options

```javascript
accessibility: {
    // Minimum font size in pixels (warn if below)
    minFontSize: 12,           // default: 12
    
    // WCAG contrast requirement level
    contrastLevel: 'AA',       // 'AA' or 'AAA' (default: 'AA')
    
    // Optional: Custom minimum contrast ratio
    minContrastRatio: 4.5,     // default: 4.5 for AA, 7 for AAA
    
    // Optional: Minimum line-height
    minLineHeight: 1.4         // default: 1.4
}
```

### Overlay Options

```javascript
overlay: {
    // Show/hide the visual overlay interface
    enabled: true,             // default: true
    
    // Position of overlay on screen
    position: 'bottom-right',  // 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
                                // default: 'bottom-right'
    
    // Hide overlay for X milliseconds on initial load
    hide: 0,                   // 0 = show immediately (default: 0)
                                // 300000 = hide for 5 minutes
                                // -1 = hide until page refresh
}
```

### Quality Options (Optional)

```javascript
quality: {
    // Threshold for inline styles detection
    inlineStylesThreshold: 10  // warn if >10 elements (default: 10)
}
```

## Configuration Presets

### Development (Recommended)

```javascript
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
        position: 'bottom-right'
    }
});
```

### Strict Mode

```javascript
await runWAH({
    logs: true,
    logLevel: 'full',
    issueLevel: 'critical',  // Only critical issues
    accessibility: {
        minFontSize: 14,  // Stricter font size
        contrastLevel: 'AAA'  // Stricter contrast
    }
});
```

### CI/CD Mode

```javascript
await runWAH({
    logs: false,  // No console output
    logLevel: 'none',
    issueLevel: 'critical',  // Only critical issues
    overlay: {
        enabled: false  // Don't show overlay
    }
});
```

### Performance Focused

```javascript
await runWAH({
    logs: true,
    logLevel: 'summary',  // Less verbose
    issueLevel: 'warnings',  // Skip recommendations
    accessibility: {
        minFontSize: 14,
        contrastLevel: 'AA'
    },
    overlay: {
        enabled: true
    }
});
```

## Scoring Configuration

WAH scoring automatically uses different multipliers based on configuration:

- **strict**: 25/10/5 (critical/warning/recommendation)
- **normal**: 20/8/4 (default)
- **moderate**: 20/8/0 (ignores recommendations)
- **soft**: 20/0/0 (only critical)
- **custom**: User-defined filters

Scoring mode can be changed via overlay UI after initialization (or passed directly in config).

### DOM Visibility Behavior by Scoring Mode

- **strict**: analyzes the full DOM, including hidden variants.
- **normal / moderate / soft / custom**: analyzes perceivable elements only.

Perceivable-only filtering excludes elements hidden via common mechanisms such as:

- `display: none`
- `visibility: hidden`
- `opacity: 0`
- `[hidden]`
- `[inert]`
- `aria-hidden="true"`

## Environment-Specific Configuration

### Development

```javascript
if (process.env.NODE_ENV === 'development') {
    await runWAH({
        logs: true,
        logLevel: 'full',
        overlay: { enabled: true }
    });
}
```

### Staging

```javascript
if (process.env.NODE_ENV === 'staging') {
    await runWAH({
        logs: true,
        logLevel: 'summary',
        overlay: { enabled: true }
    });
}
```

### Production

```javascript
if (process.env.NODE_ENV === 'production') {
    // Usually disabled in production, but can be enabled for testing:
    // await runWAH({
    //   logs: false,
    //   overlay: { enabled: false }
    // });
}
```

## Error Handling

```javascript
try {
    const result = await runWAH({
        /* config */
    });
    
    if (result.score < 50) {
        console.warn('Critical accessibility issues detected');
    }
    } catch (error) {
    console.error('WAH encountered an error:', error);
}
```

## Rule Intelligence

### Disabling Rules by ID

Any rule can be disabled entirely by passing `'off'` as its value. A disabled rule is skipped at runtime — it does not execute and its count is reflected in `AuditMetrics.skippedRules`.

```javascript
await runWAH({
    rules: {
        'ACC-02': 'off',   // Disable alt-text check
        'SEO-05': 'off',   // Disable canonical check
        'PERF-06': 'off'   // Disable cache headers check
    }
});
```

### Severity Overrides

You can change the severity of any rule without disabling it. The rule still runs normally — WAH replaces the severity on all issues returned by that rule before score calculation and `issueLevel` filtering.

**String shorthand (most common):**

```javascript
await runWAH({
    rules: {
        'PERF-01': 'recommendation',    // Downgrade: was warning, now recommendation
        'SEO-02': 'critical',           // Upgrade: was warning, now critical
        'ACC-13': 'warning'             // Upgrade: was recommendation, now warning
    }
});
```

**Object form (allows combining with threshold):**

```javascript
await runWAH({
    rules: {
        'ACC-10': { severity: 'warning' }   // same as 'warning' string form
    }
});
```

Valid severity values: `'critical'` | `'warning'` | `'recommendation'` | `'off'`

> **Note**: Setting `{ severity: 'off' }` or the string `'off'` both disable the rule.

### Per-Rule Thresholds

The following rules expose a configurable numeric threshold:

| Rule ID | Controls | Unit | Replaces |
| --------- | ---------- | ------ | --------- |
| `ACC-22` | Minimum font size | pixels | `accessibility.minFontSize` |
| `ACC-25` | Minimum contrast ratio | ratio | derived from `contrastLevel` (4.5 / 7) |
| `ACC-26` | Minimum line-height | unitless value | `accessibility.minLineHeight` |
| `UX-01` | Minimum touch target size | pixels | `quality.minTouchSize` |
| `ACC-21` | Interactive elements sampled for focus-visibility check | element count | - |
| `RWD-01` | Minimum width flagged as fixed-width risk | pixels | - |
| `RWD-04` | Minimum viewport-height ratio flagged for fixed/sticky overlap | ratio (0-1) | - |
| `PERF-02` | Maximum font resources before warning | resource count | - |
| `PERF-03` | Maximum external scripts before warning | script count | - |
| `PERF-06` | Minimum static resources that trigger cache-header reminder | resource count | - |
| `PERF-08` | Images sampled for modern-format analysis | image count | - |

```javascript
await runWAH({
    rules: {
        'ACC-22': { threshold: 16 },    // Require font size >= 16px
        'ACC-25': { threshold: 5.0 },   // Require contrast ratio >= 5.0
        'ACC-26': { threshold: 1.5 },   // Require line-height >= 1.5
        'UX-01':  { threshold: 48 },    // Require touch targets >= 48px
        'RWD-01': { threshold: 1024 },  // Flag only widths > 1024px
        'RWD-04': { threshold: 0.25 },  // Flag fixed/sticky overlap at >= 25% viewport height
        'PERF-02': { threshold: 2 },    // Allow at most 2 font resources
        'PERF-03': { threshold: 8 },    // Allow at most 8 external scripts
        'PERF-06': { threshold: 10 },   // Trigger only when page has >10 static resources
        'PERF-08': { threshold: 150 },  // Inspect first 150 images for modern formats
        'ACC-21': { threshold: 60 }     // Inspect first 60 interactive elements for focus visibility
    }
});
```

### Costly Rules and Performance Tuning

Some heuristics are heavier on large pages (layout/computed-style scans or wide DOM traversals). Use rule-level thresholds and `off` overrides to keep audit time predictable.

Most relevant controls:

| Rule ID | Why It Can Be Costly | Recommended Tuning |
| --------- | ---------------------- | -------------------- |
| `ACC-21` | Computed-style checks over interactive elements | Lower threshold to reduce sampled elements (for example `40-80`) |
| `ACC-25` | Contrast calculations on sampled visible text nodes | Keep default unless needed; this rule already samples up to 100 elements |
| `ACC-26` | Computed line-height checks on sampled text containers | Keep default unless needed; this rule already samples up to 100 elements |
| `RWD-01` | Broad element traversal with width parsing | Raise threshold to reduce findings noise on layout-heavy pages |
| `RWD-04` | Fixed/sticky element scan + geometry checks | Raise ratio threshold (for example `0.22-0.3`) to focus on high-impact overlaps |
| `PERF-08` | Image traversal on media-heavy pages | Lower threshold (for example `100-200`) |

If you need strict run-time bounds for CI or demo environments, combine tuning with selective disabling:

```javascript
await runWAH({
    rules: {
        'ACC-21': { threshold: 50 },
        'RWD-04': { threshold: 0.25 },
        'PERF-08': { threshold: 120 },
        'PERF-06': 'off'
    }
});
```

Threshold and severity can be combined in the same rule:

```javascript
await runWAH({
    rules: {
        'ACC-22': { severity: 'critical', threshold: 16 },   // Both override threshold AND upgrade severity
        'UX-01':  { severity: 'recommendation', threshold: 40 }  // More lenient + downgraded
    }
});
```

### Rule IDs Reference

All stable rule IDs are available in `RULE_IDS` (exported from the package for TypeScript users):

```typescript
import { RULE_IDS } from 'web-audit-helper';

await runWAH({
    rules: {
        [RULE_IDS.accessibility.imgMissingAlt]: 'off',
        [RULE_IDS.accessibility.textTooSmall]: { threshold: 16 }
    }
});
```

Or use string literals directly — IDs are stable across minor versions:

```text
Accessibility: ACC-01 – ACC-29
SEO:           SEO-01 – SEO-08
Semantics:     SEM-01 – SEM-07
Responsive:    RWD-01 – RWD-05
Security:      SEC-01
Quality:       HTML-01, HTML-02, QLT-01, QLT-02, UX-01
Performance:   IMG-01 – IMG-03, MEDIA-01, PERF-01 – PERF-08
Forms:         FORM-01 – FORM-04
```

---

## Console Output Preset

The `consoleOutput` option selects a preset that controls all console output behavior as a single cohesive choice. It can be set in code or changed interactively via the Settings overlay (persisted to `localStorage`).

```javascript
await runWAH({
    consoleOutput: 'standard'   // 'none' | 'minimal' | 'standard' | 'detailed' | 'debug'
});
```

| Level | Description |
| ------- | ------------- |
| `'none'` | Disables all audit output. Only essential WAH hide/reset notices still appear |
| `'minimal'` | Compact summary only: screen context, score, issue count |
| `'standard'` | Single flat issue table sorted by severity (no category grouping) |
| `'detailed'` | Issues grouped by category + statistics summary |
| `'debug'` | Everything from Detailed plus score breakdown, timestamps, and per-rule metrics |

> Each preset sets `logLevel`, `logging`, `scoreDebug`, and `auditMetrics` as a unit. If you pass `consoleOutput`, those individual fields are overridden by the preset.

### Audit Performance Metrics

Controlled by `auditMetrics` (or automatically by the `debug` console preset):

```javascript
await runWAH({
    auditMetrics: {
        enabled: true,                // Track total + per-rule execution time (default: true)
        includeInReports: true,       // Include metrics section in JSON/TXT/HTML exports (default: false)
        consoleTopSlowRules: 5,       // Show top N slowest rules in console table (default: 10)
        consoleMinRuleMs: 1           // Minimum ms a rule must take to appear in the table (default: 0)
    }
});
```

The `AuditResult` returned by `runWAH()` always contains a `metrics` object when `enabled: true`:

```typescript
const result = await runWAH({ auditMetrics: { enabled: true } });
console.log(result.metrics?.totalMs);        // Total audit time in ms
console.log(result.metrics?.executedRules);  // Number of rules that ran
console.log(result.metrics?.skippedRules);   // Number of rules disabled via overrides
console.log(result.metrics?.ruleTimings);    // Per-rule timing array
```

### Score Debugging

```javascript
await runWAH({ scoreDebug: true });
```

When enabled, the console output includes a detailed score breakdown showing how the final score is calculated: per-category scores, multipliers, rule counts, and weighted contributions.

### Enhanced Logging Options

```javascript
await runWAH({
    logging: {
        timestamps: true,           // Include timestamps in console output
        groupByCategory: true,      // Group issues by category block instead of flat table
        showStatsSummary: true,     // Display statistics tables (severity distribution, category breakdown)
        useIcons: true              // Add visual icons to severities and categories (🔴 ⚠️ 💡)
    }
});
```

> These options are most useful when setting `consoleOutput` to `'none'` or building a custom output pipeline. For typical usage, the `consoleOutput` preset is the recommended approach.

---

## Type Definitions

```typescript
import type { WAHConfig } from 'web-audit-helper';

const config: WAHConfig = {
    logs: true,
    consoleOutput: 'standard',
    issueLevel: 'all',
    rules: {
        'ACC-02': 'off',
        'ACC-22': { severity: 'critical', threshold: 16 }
    },
    accessibility: {
        minFontSize: 12,
        contrastLevel: 'AA'
    },
    overlay: {
        enabled: true,
        position: 'bottom-right',
        hide: 0
    },
    quality: {
        inlineStylesThreshold: 10
    },
    auditMetrics: {
        enabled: true,
        includeInReports: false
    }
};

await runWAH(config);
```

## FAQ

**Q: How do I disable the overlay but keep console logs?**

```javascript
await runWAH({
    logs: true,
    overlay: { enabled: false }
});
```

**Q: Can I change configuration after initialization?**
A: No, configure before calling `runWAH()`. To re-run with different config, use `__WAH_RERUN__()` followed by a new `runWAH()` call.

**Q: What's the difference between `logLevel` and `issueLevel`?**

- `logLevel`: Controls console output verbosity (full/summary/none)
- `issueLevel`: Filters which severities are reported (critical/warnings/all)

**Q: What's the difference between `consoleOutput` and `logLevel`?**
A: `consoleOutput` is the recommended high-level preset (`none/minimal/standard/detailed/debug`). It sets `logLevel`, `logging`, `scoreDebug`, and `auditMetrics` together as a unit. Use it for typical usage. `logLevel` is a lower-level field that `consoleOutput` overrides.

**Q: Can I disable a rule for a single page only?**
A: Yes — pass `rules: { 'RULE-ID': 'off' }` when calling `runWAH()`. Since WAH runs per page-load, this naturally scopes to that run.

**Q: Do severity overrides affect the score?**
A: Yes. The overridden severity is used everywhere: score calculation, `issueLevel` filtering, overlay display, and reports.

**Q: Should I use AAA contrast level?**
A: AA (4.5:1) covers most cases. AAA (7:1) is recommended for body text in important applications.

**Q: Can I hide sensitive data from exported reports?**
A: Currently no, but you can use `consoleOutput: 'none'` and set `auditMetrics: { includeInReports: false }` to minimize output.
