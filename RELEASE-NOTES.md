# WAH v1.3.0 Release Notes

**Release Date**: March 15, 2026  
**Type**: Minor (Documentation + Developer Guidance)

---

## Overview

Version 1.3.0 completes the educational documentation layer of WAH and standardizes how users discover and consume rule guidance across report HTML, console diagnostics, and overlay interactions.

This release focuses on turning WAH into a practical educational auditing tool without changing core API ergonomics.

---

## Highlights

- Full rule documentation coverage: **61/61 rules** in `docs/rules/*.md`
- Learn more links available in:
  - HTML report
  - Console issue detail
  - Overlay issue context menu (right-click)
- Rule index guides added:
  - `docs/rules-guide.md`
  - `docs/es/rules-guide.md`
- Contributor guides added:
  - `docs/contributing.md`
  - `docs/es/contributing.md`

---

## Added

### Educational Rule Pages

Every currently implemented rule now has a dedicated documentation page with:

- Problem
- Why it matters
- How to fix
- Bad example
- Good example
- References

### Rule Indexes (EN/ES)

Added fast navigation guides by rule ID:

- `docs/rules-guide.md`
- `docs/es/rules-guide.md`

### Contributor Workflow Guides

Added rule contribution guidance in both languages:

- `docs/contributing.md`
- `docs/es/contributing.md`

---

## Changed

### Learn More URL Strategy

Learn more links now resolve to canonical GitHub docs URLs:

`https://github.com/Storbo2/web-audit-helper/blob/main/docs/rules/{RULE-ID}.md`

### Overlay Context Menu Theming

The right-click issue menu now follows active overlay theme tokens for improved visual consistency in light/dark/auto modes.

### README and Docs Navigation

Updated docs navigation references to include rules index and contribution guides.

---

## Fixed

- Improved console Learn more output formatting for more reliable URL handling across browser DevTools variants.

---

## Validation Status

- Build: passing (`npm run build`)
- Rule docs coverage check: `61/61`
- Overlay/report/console Learn more integration: verified

---

## Upgrade Notes

No breaking changes introduced.

- Existing integrations continue to work unchanged.
- Users can immediately consume richer educational links in current overlay/report/console flows.

---

*Previous release: [v1.2.0 Release Notes](https://github.com/Storbo2/web-audit-helper/releases/tag/v1.2.0)*
