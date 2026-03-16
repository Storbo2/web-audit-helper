# WAH v1.4.0 Release Notes

**Release Date**: March 16, 2026  
**Type**: Minor (Core Consistency + Registry Hardening)

---

## Overview

Version 1.4.0 consolidates WAH internal architecture so future feature growth can rely on stronger consistency guarantees.

This release focuses on registry hardening, uniform contracts, anti self-audit protections, and bounded costly heuristics.

---

## Highlights

- Registry is now the primary source of rule metadata for reporting and docs fields
- Contract validation runs on startup and fails fast on malformed registry entries
- Anti self-audit protections are now covered by dedicated tests across overlay surfaces
- Costly heuristic controls expanded via rule-level thresholds and sampling bounds
- EN/ES configuration docs now include costly-rule tuning guidance

---

## Added

### Registry Hardening

- Enriched registry metadata model:
  - `category`
  - `defaultSeverity`
  - `title`
  - `fix`
  - `docsSlug`
  - `standardType`
  - `standardLabel`
- Centralized metadata overrides for all registered rules
- Metadata coverage tests to enforce full registry completeness

### Registry Contract Validation

- Startup assertion for rule contract integrity
- Detailed validation diagnostics for CI:
  - duplicate IDs
  - invalid category
  - invalid default severity
  - missing docs slug
- Unit tests for validation logic and error formatting

### Anti Self-Audit Test Coverage

- Core audit test coverage for ignored WAH surfaces:
  - overlay root
  - popover
  - context menu
  - dynamic loading state nodes
- Overlay behavior test ensuring context menu carries `data-wah-ignore`

---

## Changed

### Metadata Resolution Path

- Reporter utilities and category builder now resolve core metadata from registry first, then fallback constants for compatibility.

### Costly Heuristic Controls

- Threshold/sampling support added to selected heavy rules:
  - `ACC-21`
  - `RWD-01`
  - `RWD-04`
  - `PERF-02`
  - `PERF-03`
  - `PERF-06`
  - `PERF-08`
- Rule registry wiring now forwards per-rule threshold overrides to these heuristics.

### Documentation

- Updated `docs/configuration.md` and `docs/es/configuration.md` with:
  - expanded threshold-capable rules table
  - practical costly-rule tuning guidance

---

## Fixed

- Stabilized phase 4 threshold tests using deterministic geometry-based overlap assertions in jsdom.

---

## Validation Status

- Typecheck: passing (`npm run typecheck`)
- Test suite: passing (`npm test`)
- Build: passing (`npm run build`)

---

## Upgrade Notes

No breaking changes introduced.

- Existing integrations continue to work unchanged.
- Existing `rules[ruleId]` override style remains backward compatible.
- New threshold-capable rules are opt-in and only apply when configured.

---

*Previous release: [v1.3.0 Release Notes](https://github.com/Storbo2/web-audit-helper/releases/tag/v1.3.0)*
