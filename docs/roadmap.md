# Product Roadmap

## Current

### v1.5.0 - External Auditing

Delivered:

- bookmarklet-based external runtime flow
- dual runtime load strategy (IIFE primary, ESM fallback)
- enriched metadata in exports
- run comparison in JSON/HTML
- CSP permissive/blocking QA fixtures and checklists

## Near-Term (Post 1.5.0)

### Adoption and Polish

- visual evidence assets (screenshots, short GIF)
- clearer documentation map for faster onboarding
- concise mode guidance (`embedded` vs `external`)

## v2.0 Direction

### Goal

Evolve from interactive browser helper into reusable audit platform.

### Core Themes

- stable JSON export contract as automation source of truth
- headless execution path
- CLI MVP for URL-based audits
- reusable run comparison utilities for CI workflows
- formalized rule registry/plugin extension surface

### Delivery Status (March 2026)

- Phase 1 (Foundation): completed
- Phase 2.1 (headless API): completed
- Phase 2.2 (CLI static via jsdom): completed
- Phase 2.3 (CLI Playwright for real URLs): completed
- Phase 3 (Reusable comparison engine): in progress (`compareReports`, comparison contract versioning, CLI `--compare-with` and delta gates)

### Phase 3 Detail - Reusable Comparison Engine

Goal: decouple run comparison from HTML/UI so it can be consumed by CI pipelines and custom tooling.

Planned deliverables:

- `compareReports(prev, next)` pure API with typed output
- normalization of rule identity and severity deltas independent of renderer
- stable comparison schema (`comparison.contractVersion`)
- JSON-first diff payload suitable for GitHub Actions annotations/comments
- threshold-based gates on deltas (example: critical +N, score delta <= -X)
- helper adapters for HTML/TXT renderers (renderer reads comparison payload, does not compute it)
- deterministic fixtures for regression tests (added/removed rules, category shifts, timing changes)

Acceptance criteria:

- comparison result can be generated without DOM or overlay code
- CI can fail by score delta and/or severity delta using CLI flags
- JSON comparison output is backward-compatible inside the same contract major version

## Longer-Term (v2.x)

- DevTools extension
- team policy profiles
- ecosystem integrations

## Detailed History

See:

- [CHANGELOG](../CHANGELOG.md)
- [Release Notes](../RELEASE-NOTES.md)
