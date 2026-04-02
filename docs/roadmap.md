# Product Roadmap

## Current

### v2.0.0 - Reusable Audit Platform

Delivered:

- bookmarklet-based external runtime flow
- dual runtime load strategy (IIFE primary, ESM fallback)
- enriched metadata in exports
- stable JSON contract and report validation
- headless API and CLI for static HTML + real URLs
- reusable comparison engine with delta gates
- CI/PR outputs:
  - compact JSON summary
  - generic Markdown summary
  - GitHub Actions summary
  - GitLab CI summary

## Near-Term (Post 2.0.0)

### Adoption and Polish

- visual evidence assets (screenshots, short GIF)
- clearer documentation map for faster onboarding
- concise mode guidance (`embedded` vs `external`)

## v2.0 Delivered

### Goal

Evolve from interactive browser helper into reusable audit platform.

### Core Themes

- stable JSON export contract as automation source of truth
- headless execution path
- CLI MVP for URL-based audits
- reusable run comparison utilities for CI workflows
- formalized rule registry/plugin extension surface

### Delivery Status (April 2026)

- Phase 1 (Foundation): completed
- Phase 2 (Headless + CLI MVP): completed
- Phase 3 (Reusable comparison engine): completed
- Phase 4 (Automation helpers & PR/CI reporting): completed
- Phase 5 (Base extensibility API): completed in main, planned for v2.0.1 release line

### Post-2.0 Plan

- v2.0.1: release packaging of the Phase 5 extensibility surface plus minor fixes if needed
- v2.1+: ecosistema, DevTools extension, policy profiles e integraciones avanzadas

## Longer-Term (v2.x)

- DevTools extension
- team policy profiles
- ecosystem integrations

## Detailed History

See:

- [CHANGELOG](../CHANGELOG.md)
- [Release Notes](../RELEASE-NOTES.md)
