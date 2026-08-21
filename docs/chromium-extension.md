# Chromium Extension Plan

WAH can become a Chromium extension without replacing the audit engine. The
recommended first release is a Manifest V3 extension that runs only after the
user clicks its toolbar action and injects a packaged WAH bundle into the active
tab.

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

## Required repository changes

1. Add dedicated extension entry points, for example:

   - `src/extension/content.ts`: starts or removes WAH in the inspected page.
   - `src/extension/popup.ts`: queries the active tab and injects the content
     bundle with `chrome.scripting.executeScript()`.
   - `src/extension/popup.html` and its local stylesheet.

2. Add a separate build target that emits a self-contained bundle into
   `dist/extension/`. All executable code must be packaged with the extension.
   The bookmarklet's jsDelivr IIFE/ESM fallback must not be used by the
   extension.

3. Add `"extension"` to `RuntimeMode` and report it in export metadata. Keep the
   existing external runtime for bookmarklet users.

4. Introduce a storage adapter. WAH currently reads and writes `localStorage`
   synchronously for settings, filters, locale, overlay position, and hide
   state. The extension should hydrate those values from `chrome.storage.local`
   before starting WAH and persist changes through a small extension-specific
   adapter. This gives consistent settings across audited sites and avoids
   writing WAH data into each site's storage.

5. Make injection idempotent. Repeated toolbar clicks should reuse the existing
   overlay or trigger `__WAH_RERUN__()` instead of registering duplicate global
   handlers. Removing the overlay must also detach listeners and clear
   extension-owned DOM nodes.

6. Validate style isolation. The current overlay injects `<style>` elements into
   the page and uses prefixed IDs/classes. Test it on pages with strict CSP and
   aggressive global CSS. If necessary, move the UI into a Shadow DOM or inject
   packaged CSS through `chrome.scripting.insertCSS()`.

7. Handle restricted targets explicitly. Chromium does not allow normal
   extension injection into pages such as `chrome://*`, the Chrome Web Store,
   or other protected browser surfaces. `file://` access also requires the user
   to enable it in the extension details page. The popup should show a clear
   message for these cases.

8. Create icons at 16, 32, 48, and 128 pixels from the existing square logo,
   plus store listing artwork and screenshots.

## Testing and packaging

- Unit-test popup messaging, storage hydration, duplicate injection, and cleanup.
- Add Playwright tests that launch Chromium with an unpacked
  `dist/extension/`, open the existing issue-detection fixture, click the action,
  and verify overlay, rerun, issue focus, settings, and exports.
- Test strict-CSP pages, SPAs after navigation, iframes, `file://` behavior, and
  restricted browser pages.
- Add `pnpm run build:extension`, `pnpm run test:extension`, and a deterministic
  ZIP task. Keep the extension artifact separate from the npm package unless it
  is intentionally included.
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
