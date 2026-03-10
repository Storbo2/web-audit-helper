# WAH v1.2.0 Release Notes

**Release Date**: March 10, 2026  
**Type**: Minor (New Features + Enhancements)

---

## Overview

Version 1.2.0 is the **Rule Intelligence** release. It delivers full rule-level configuration, audit performance metrics, score debugging, a unified console output preset system, and a round of overlay UX refinements — all while remaining fully backward-compatible with v1.1.x.

---

## Added

### Rule Intelligence

WAH now supports fine-grained control over every audit rule via the `rules` config field.

**Disable a rule entirely:**

```javascript
rules: { 'ACC-02': 'off' }
```

Disabled rules are skipped at runtime and counted in `AuditMetrics.skippedRules`.

**Override severity:**

```javascript
rules: {
    'PERF-01': 'recommendation',    // Downgrade
    'SEO-02': 'critical',           // Upgrade
    'ACC-10': { severity: 'warning' }  // Object form
}
```

The rule still executes normally; WAH replaces the severity on all returned issues before score calculation and `issueLevel` filtering.

**Per-rule thresholds** (4 rules currently supported):

| Rule | Controls | Unit |
| ------ | ---------- | ------ |
| `ACC-22` | Min font size | px |
| `ACC-25` | Min contrast ratio | ratio |
| `ACC-26` | Min line-height | unitless |
| `UX-01` | Min touch target size | px |

```javascript
rules: {
    'ACC-22': { threshold: 16 },
    'ACC-25': { threshold: 5.0 },
    'ACC-26': { threshold: 1.5 },
    'UX-01':  { threshold: 48 }
}
```

**Override threshold and severity together:**

```javascript
rules: { 'ACC-22': { severity: 'critical', threshold: 16 } }
```

`RULE_IDS` is now exported from the package for typed access to all stable rule IDs.

---

### Audit Performance Metrics

Track how long each rule takes to run:

```javascript
auditMetrics: {
    enabled: true,               // default: true
    includeInReports: true,      // include in JSON/TXT/HTML exports (default: false)
    consoleTopSlowRules: 5,      // show top 5 slowest rules in console
    consoleMinRuleMs: 1          // only show rules that took >= 1ms
}
```

`AuditResult.metrics` is populated when `enabled: true`:

- `totalMs` — end-to-end audit time
- `executedRules` — rules that ran
- `skippedRules` — rules disabled via overrides
- `ruleTimings` — per-rule `{ rule, ms, issues }` array

---

### Console Output Presets

A single `consoleOutput` option replaces the need to manually configure `logLevel` + `logging` + `scoreDebug` + `auditMetrics`:

```javascript
consoleOutput: 'standard'  // 'none' | 'minimal' | 'standard' | 'detailed' | 'debug'
```

| Level | Output |
| ------- | -------- |
| `none` | Silent — only WAH hide/reset notices |
| `minimal` | Score + issue count only |
| `standard` | Single flat issue table |
| `detailed` | Issues grouped by category + statistics |
| `debug` | Detailed + score breakdown + timestamps + metrics |

- Default: `'standard'`
- Configurable from Settings overlay (persisted to `localStorage`)
- WAH hide/reset notices always print regardless of level

---

### Score Debugging

```javascript
scoreDebug: true
```

Console output shows per-category score breakdown with multipliers, rule counts, and weighted contributions.

---

### Overlay UX Improvements

- **Keyboard shortcuts**: Escape (toggle), Ctrl/Cmd+E (rerun), Alt+W (focus overlay)
- **Loading states**: visual feedback during rerun
- **Accessibility**: improved focus trap and keyboard navigation in all popovers
- **Settings page 0** reordered: Highlight duration → Console logs level → live description box
- **Settings page 1** reordered: Language → Scoring mode
- **Settings page 2** section headers aligned to the same visual style as pages 0/1
- **Score messages**: contextual emoji added (🚀 ✅ ⚠️ ⛔) in both EN and ES

---

## Changed

- `consoleOutput` is now the primary API for controlling console output. It overrides `logLevel`/`logging`/`scoreDebug`/`auditMetrics` as a unit when set.
- Preset is fully authoritative in `loadConfig` — user config changes to those sub-fields do not override the selected preset.
- WAH hide/reset notices (`logHideMessage`) now always print, even when `consoleOutput` is `none`.

---

## Fixed

- `logHideMessage` was inadvertently silenced by `logLevel: 'none'`. Essential overlay hide/reset notices now always appear.

---

## Documentation

- `docs/configuration.md` — new **Rule Intelligence** and **Console Output Preset** sections with full reference tables
- `docs/es/configuration.md` — same in Spanish
- `README.md` — configuration table updated; `rules` annotation updated from "v1.2 groundwork" to full description

---

## Files Updated (High Level)

**Core:**

- `src/core/types.ts` — `ConsoleOutputLevel` extended with `"none"`
- `src/core/index.ts` — `isOffOverride`, `resolveSeverityOverride`, `applyRuleSeverityOverrides`, metrics collection
- `src/core/config/ruleIds.ts` — stable `RULE_IDS` constant (all categories)
- `src/core/config/registry/types.ts` — `getRuleThreshold` helper
- `src/core/config/registry/accessibility.ts` — threshold wiring for ACC-22, ACC-25, ACC-26
- `src/core/config/registry/quality.ts` — threshold wiring for UX-01

**Config:**

- `src/config/defaultConfig.ts` — `consoleOutputPresets`, `consoleOutputDescriptions` (with `details` field)
- `src/config/loadConfig.ts` — preset fully authoritative post-merge

**Overlay:**

- `src/overlay/config/settings.ts` — `consoleOutput` required, default `'standard'`, persisted + cleared on reset
- `src/overlay/popover/components/settings/pages.ts` — page reordering, page 2 header style
- `src/overlay/popover/components/settings/helpers.ts` — `renderLogLevelOptions` removed, `getConsoleOutputInfo` returns `.details`
- `src/overlay/popover/components/settings/wiring.ts` — console output radios + live info box

**Utilities:**

- `src/utils/consoleLogger.ts` — `logHideMessage` unconditional; scoring emoji; enhanced logging options

**Locales:**

- `locales/en/common.json` — `consoleLog` pluralized; score messages with emoji
- `locales/es/common.json` — `consoleLog` pluralized; score messages with emoji

**Docs:**

- `docs/configuration.md`
- `docs/es/configuration.md`
- `README.md`
- `CHANGELOG.md`
- `RELEASE-NOTES.md`

---

*Previous release: [v1.1.0 Release Notes](https://github.com/Storbo2/web-audit-helper/releases/tag/v1.1.0)*
