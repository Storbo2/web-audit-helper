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
   - `[WAH] External audit bootstrap failed. CSP may be blocking script injection. Review console for details.`
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

## Troubleshooting

- If permissive fixture fails, verify bookmarklet URL references current package version.
- If both cases fail identically, confirm bookmarklet points to `dist/external-runtime.iife.js` and fallback `dist/external-runtime.mjs`.
- If metadata is missing, ensure export is generated from external run (not embedded run).
