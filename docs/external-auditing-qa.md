# External Auditing QA Checklist

This checklist validates the v1.5 external auditing flow under permissive and blocking CSP scenarios.

## Scope

- Bookmarklet loads jsDelivr runtime using fixed version.
- Runtime fallback sequence works: IIFE first, ESM second.
- Blocking CSP path returns explicit error and aborts execution.
- External runs export metadata with `runtimeMode = external`.
- Run comparison is available in JSON and HTML when a previous baseline report exists.

## Prerequisites

1. Build the project:

```bash
npm run build
```

1. Create bookmarklet from `dist/bookmarklet.txt`.
2. Start a local static server from repository root:

```bash
npx http-server . -p 4173 --cors
```

1. Open browser DevTools (Console + Network).

## If bookmarklet.txt is missing

`dist/bookmarklet.txt` is created by this repository build pipeline (`npm run build` + postbuild script).

If you are testing from another project repository that does not run WAH build scripts, the file may not exist there.

Use one of these options:

1. Generate bookmarklet from this repository root.
2. Use a bookmarklet generated from the published package version.

## Local Bookmarklet for Pre-Release Validation

If npm `1.5.0` is not published yet, use a local bookmarklet:

1. Start local server from repository root:

```bash
npx http-server . -p 4173 --cors
```

1. Ensure these files are reachable in browser:
   - `http://127.0.0.1:4173/dist/external-runtime.iife.js`
   - `http://127.0.0.1:4173/dist/external-runtime.mjs`
2. Create a bookmarklet where `runtimeBaseUrl` points to `http://127.0.0.1:4173/dist`.

## Test Fixtures

- Permissive CSP: `http://127.0.0.1:4173/examples/csp-permissive.html`
- Blocking CSP: `http://127.0.0.1:4173/examples/csp-blocking.html`

## Real-Page Validation (Release Gate)

After publishing npm `1.5.0` and regenerating bookmarklet with fixed version:

1. Validate one static page (marketing/docs style).
2. Validate one SPA page (React/Next/Vue style).
3. Export JSON and verify:
   - `meta.runtimeMode = external`
   - `meta.runId`, `meta.targetUrl`, `meta.executedAt`, `meta.wahVersion`
4. Run a second audit in the same session and export JSON/HTML again.
5. Verify comparison block includes:
   - overall score delta
   - severity deltas
   - added/removed `ruleId`
   - category score deltas

## Validation Matrix

### Case A: Permissive CSP (Expected Success)

1. Open permissive fixture.
2. Trigger bookmarklet.
3. Confirm runtime script request succeeds:
   - `external-runtime.iife.js` should load from jsDelivr.
4. Confirm WAH overlay appears.
5. Export JSON report from overlay.
6. Verify metadata in JSON:
   - `meta.runtimeMode` equals `external`
   - `meta.runId`, `meta.targetUrl`, `meta.executedAt`, `meta.wahVersion` exist

Pass criteria:

- Overlay rendered.
- No fatal external bootstrap error.
- JSON metadata contains `runtimeMode = external`.

### Case B: Blocking CSP (Expected Controlled Failure)

1. Open blocking fixture.
2. Trigger bookmarklet.
3. Confirm failed script load in Network/Console for jsDelivr runtime.
4. Confirm fallback to ESM also fails.
5. Confirm explicit user-facing error message appears:
   - `[WAH:E-EXT-CSP-OR-NETWORK] External audit could not start.` (common for strict CSP/network blocks)
   - or another explicit code such as `WAH:E-EXT-IIFE-API`, `WAH:E-EXT-ESM-API`, `WAH:E-EXT-BOOTSTRAP`
6. Confirm overlay is not rendered.

Pass criteria:

- Clear error shown to user.
- Execution aborts without partial overlay state.

## Evidence Template

Record each run using the template below.

### Evidence Record

- Date:
- Tester:
- WAH version:
- Browser + version:
- Scenario: `permissive` or `blocking`
- Target URL:
- Result: `pass` or `fail`
- Screenshot(s):
- Console excerpt:
- Network excerpt:
- Notes:

## Evidence Examples (Media Backlog)

Recommended assets to keep with this checklist:

- Screenshot: external overlay success on target page
- Screenshot: blocking CSP error message
- Screenshot: HTML report comparison section
- Screenshot: JSON metadata with `runtimeMode = external`
- GIF (short): bookmarklet setup and execution

Suggested locations:

- `docs/media/images/external-auditing/`
- `docs/media/gifs/external-auditing/`

Current screenshots:

![External overlay success](media/images/external-overlay-success.png)

![External CSP blocked error](media/images/external-csp-blocked-error.png)

![HTML report comparison](media/images/external-report-comparison.png)

![JSON metadata with runtimeMode external](media/images/external-report-json-meta.png)

## Troubleshooting

- If permissive fixture fails, verify bookmarklet URL references current package version.
- If both cases fail identically, confirm bookmarklet points to `dist/external-runtime.iife.js` and fallback `dist/external-runtime.mjs`.
- If metadata is missing, ensure export is generated from external run (not embedded run).

Common error diagnosis:

- `WAH:E-EXT-CSP-OR-NETWORK`:
  - IIFE and ESM runtime paths both failed (frequently CSP, CORS, or network policy).
- `WAH:E-EXT-IIFE-API`:
  - IIFE loaded but global API `window.WAHExternalRuntime.runExternalWAH` is unavailable.
- `WAH:E-EXT-ESM-API`:
  - ESM loaded but `runExternalWAH` export is unavailable.
- `WAH:E-EXT-BOOTSTRAP`:
  - Generic fallback code when failure does not match known patterns.
- `ERR_CONNECTION_REFUSED`:
  - Local host runtime is unreachable. Confirm static server is running on `127.0.0.1:4173`.
- `Failed to load external-runtime.iife.js`:
  - IIFE was blocked (often CSP) or URL is wrong.
- `Failed to fetch dynamically imported module`:
  - ESM fallback blocked by CSP/CORS/network policy.
- Overlay works on fixtures but not on enterprise domains:
  - Expected when strict CSP blocks script injection. Record as controlled failure.
