# Chromium Extension Plan

WAH can become a Chromium extension without replacing the audit engine. The
recommended first release is a Manifest V3 extension that runs only after the
user clicks its toolbar action and injects a packaged WAH bundle into the active
tab.

## Phase 1 implementation

The initial unpacked extension is implemented in `src/extension/`. It includes:

- A Manifest V3 popup with **Run audit**, **Re-run**, and **Remove overlay**.
- Explicit user-triggered injection using `activeTab` and `chrome.scripting`.
- A self-contained content bundle with no CDN or remote executable code.
- English and Spanish popup copy selected from the browser locale.
- Shared WAH settings backed by `chrome.storage.local`.
- Idempotent content-script registration and overlay cleanup.
- Clear handling for protected Chromium URLs.

Build and load it locally:

```bash
pnpm run build:extension
```

1. Open `chrome://extensions` in Chrome, Chromium, Brave, Edge, or another
   compatible browser.
2. Enable **Developer mode**.
3. Choose **Load unpacked**.
4. Select the generated `dist/extension` directory.
5. Open a normal HTTP(S) page, click the WAH toolbar icon, and choose
   **Run audit**.

After source changes, run the build again and click the extension card's reload
button on `chrome://extensions`. For `file://` pages, enable **Allow access to
file URLs** in the extension details.

To produce the store-style artifact:

```bash
pnpm run package:extension
```

The ZIP is written to `dist/web-audit-helper-extension-v<version>.zip`.

## Recommended MVP

- A small popup with **Run audit**, **Re-run**, and **Remove overlay** actions.
- The existing overlay, filters, issue focus, scoring, and JSON/TXT/HTML exports.
- English and Spanish UI.
- No account, backend, telemetry, or remote JavaScript.
- Audit only the active top-level document in the first version. Frame support
  can be added later because cross-origin frames need separate injection and
  result aggregation.

The minimum manifest can start with:

```json
{
  "manifest_version": 3,
  "name": "WAH - Web Audit Helper",
  "version": "2.1.1",
  "action": {
    "default_popup": "popup.html"
  },
  "permissions": ["activeTab", "scripting", "storage"],
  "icons": {
    "16": "icons/icon-16.png",
    "32": "icons/icon-32.png",
    "48": "icons/icon-48.png",
    "128": "icons/icon-128.png"
  }
}
```

`activeTab` is preferable to permanent `<all_urls>` access for the MVP. It
grants temporary access after an explicit user gesture and avoids a broad host
permission warning. Add `downloads` only if exports are moved from the current
Blob/link implementation to `chrome.downloads`.

## Implementation status

- [x] Dedicated content and popup entry points.
- [x] Self-contained `dist/extension` build with no bookmarklet CDN fallback.
- [x] `extension` runtime metadata in generated reports.
- [x] Shared `chrome.storage.local` adapter for WAH preferences.
- [x] Idempotent injection, re-run, listener cleanup, and overlay removal.
- [x] Protected-page detection and actionable popup feedback.
- [x] Minimal `activeTab`, `scripting`, and `storage` permissions.
- [x] Dedicated extension artwork sourced from
  `docs/assets/logos/wah-logo-extension.png`.
- [x] Reproducible ZIP generation and static artifact checks.
- [x] Dedicated unpacked-extension Playwright coverage for run, re-run, cleanup,
  SPA navigation, storage isolation/persistence, and strict CSP.
- [ ] Aggressive host-style validation; move to packaged CSS or Shadow DOM if
  the current prefixed style injection is insufficient.
- [ ] Production-size icon exports, store listing artwork, and screenshots. The
  development build currently scales the dedicated extension logo for every
  icon slot.

## Testing and packaging

- Popup URL/locale behavior, storage hydration, and runtime storage selection
  have unit coverage. The generated manifest and bundles also have static
  artifact validation.
- `pnpm run test:extension:e2e` launches Chromium with an unpacked copy of
  `dist/extension/` and verifies overlay execution, re-run after SPA navigation,
  cleanup, storage isolation/persistence, and a strict-CSP page. Because
  Chromium headless cannot produce a toolbar `activeTab` user gesture, the test
  copy grants access only to the localhost fixture; the distributed manifest is
  still statically required to have no `host_permissions`.
- Iframes, `file://` behavior, restricted browser pages, and hostile global CSS
  remain in the extended compatibility matrix.
- `pnpm run build:extension`, `pnpm run test:extension`, and the deterministic
  `pnpm run package:extension` ZIP task are available. The extension artifact
  remains separate from the npm package.
- Run the existing `pnpm run check` gate as well as extension tests before each
  store upload.

## Store readiness

- Publish under Manifest V3 and keep all executable JavaScript/Wasm local to the
  extension package; remote hosted code is not accepted.
- Request only permissions used by the shipped functionality and explain each
  permission in the listing.
- Provide a privacy policy and accurate data-use disclosures, even if the MVP
  processes page data locally and collects nothing.
- Document that page content is analyzed locally, what is saved in
  `chrome.storage`, and whether exported reports ever leave the browser.
- Prepare a reviewer test path and screenshots that demonstrate the extension's
  single, clear purpose.

Useful official references:

- [Manifest file format](https://developer.chrome.com/docs/extensions/reference/manifest)
- [chrome.scripting](https://developer.chrome.com/docs/extensions/reference/api/scripting)
- [Declare permissions](https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions)
- [Manifest V3 remote hosted code policy](https://developer.chrome.com/docs/webstore/program-policies/mv3-requirements)
- [Chrome Web Store privacy fields](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy)
