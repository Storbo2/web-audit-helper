# WAH v1.0.4 Release Notes

**Release Date**: March 2, 2026  
**Type**: Patch Release (Bug Fixes + Documentation)

---

## 🎯 Overview

Version 1.0.4 focuses on **bug fixes** and **comprehensive SSR documentation** to improve developer experience in modern frameworks like Next.js, Nuxt, and SvelteKit.

---

## 🐛 Bug Fixes

### Popover Styling Issues
**Problem**: Filters, Settings (page 1), and UI settings popovers displayed collapsed or overlapping text due to missing shared styles.

**Solution**: 
- Consolidated `.wah-pop-row`, `.wah-pop-select`, and `.wah-pop-info` styles to `popover-base.css`
- These common styles are now available across all popover components
- Improved maintainability by centralizing shared popover styles

**Files Modified**:
- `src/overlay/styles/popover/popover-base.css` - Added common row/select/info styles
- `src/overlay/styles/popover/popover-filters.css` - Removed duplicate styles

### Re-run Detection Inconsistency
**Problem**: Running `__WAH_RERUN__()` detected different issue counts compared to a fresh page refresh (F5), causing confusion.

**Solution**:
- Implemented `cleanupWAH()` function that properly resets all WAH state:
  - Removes overlay DOM element (`#wah-overlay-root`)
  - Removes popover DOM element (`#wah-pop`)
  - Removes injected styles (`#wah-styles`)
  - Resets viewport meta patches
  - Clears pending changes state
- Ensures consistent audit results between re-runs and page refreshes

**Files Modified**:
- `src/index.ts` - Added `cleanupWAH()` function with comprehensive cleanup logic

---

## 📚 Documentation Improvements

### Next.js / SSR Frameworks Section (NEW)
Added comprehensive guide for using WAH in SSR environments with:

- **JavaScript Example** (App Router): Client Component with dynamic import
- **TypeScript Example** (App Router): Same as JS + `useRef` guard for React Strict Mode
- Clear explanation of why dynamic import is required
- Layout.js/layout.tsx integration examples

### FAQ / Troubleshooting Section (NEW)
Added solutions for common issues:

1. **`Module not found: Can't resolve 'web-audit-helper'`**
   - Cause: Package not installed / workspace misconfigured
   - Solution: Clean install with `rm -rf node_modules package-lock.json && npm install`

2. **`ReferenceError: window is not defined`**
   - Cause: Importing WAH during SSR
   - Solution: Use Client Component with dynamic import

3. **WAH runs twice in development (React Strict Mode)**
   - Cause: React Strict Mode double-invokes `useEffect`
   - Solution: Use `useRef` guard to ensure single execution

4. **Issues detected vary between F5 and re-run**
   - Cause: DOM state differences
   - Solution: Use `__WAH_RERUN__()` or refresh for clean audit

### Quick Start Improvements
- Renamed "Node.js / Module Bundler" to **"Browser Bundlers (Vite / Create React App / Vue SPA)"**
- Added warning about SSR frameworks with link to dedicated section
- Updated CDN version from 1.0.0 → 1.0.4

---

## 📊 What's Included

### Core Functionality (Unchanged)
- ✅ 61 audit rules across 8 categories
- ✅ 5 scoring modes with auto-calibration
- ✅ Interactive overlay with drag & drop
- ✅ Export reports (JSON, TXT, HTML)
- ✅ Zero runtime dependencies
- ✅ SSR-safe module initialization (since v1.0.3)

### Bundle Size
```
dist/index.mjs:  108.71 KB (ESM, minified)
dist/index.cjs:  108.71 KB (CJS, minified)
dist/index.d.ts:   1.21 KB (TypeScript definitions)
dist/index.d.cts:  1.21 KB (CommonJS type definitions)
```

---

## 🚀 Installation & Upgrade

### New Installation
```bash
npm install web-audit-helper
```

### Upgrade from 1.0.x
```bash
npm update web-audit-helper
```

No breaking changes - fully backward compatible with v1.0.0-1.0.3.

---

## 🔄 Migration Notes

### From v1.0.3 → v1.0.4
✅ **No code changes required** - This is a patch release with bug fixes and documentation improvements.

If you're using Next.js or other SSR frameworks:
- Review the new [Next.js / SSR Frameworks](#nextjs--ssr-frameworks) section in README
- Follow the dynamic import pattern if experiencing `window is not defined` errors

---

## 📖 Updated Documentation

### README.md
- + Next.js / SSR Frameworks section (70+ lines)
- + FAQ / Troubleshooting section (50+ lines)
- ✏️ Quick Start section improvements
- ✏️ CDN version updated to 1.0.4

### CHANGELOG.md
- + v1.0.4 release notes
- + v1.0.3 release notes (SSR compatibility)
- + v1.0.2 release notes (dual module format)
- + v1.0.1 release notes (Node.js version + CI improvements)

---

## 🧪 Testing

All tests passing (21/21):
```bash
npm run test        # Run tests once
npm run test:watch  # Watch mode
npm run test:ui     # Interactive UI
```

**Test Results**:
```
✓ Accessibility Rules (8)
✓ SEO Rules (5)
✓ Semantic Rules (6)
✓ Responsive Design Rules (2)

Test Files  1 passed (1)
Tests       21 passed (21)
Duration    824ms
```

---

## 🎓 Developer Experience Improvements

### Better SSR Support
- Clear guidance for Next.js 13+ App Router
- Examples in both JavaScript and TypeScript
- Explanation of dynamic imports and React Strict Mode

### Enhanced Troubleshooting
- Common errors documented with solutions
- Copy-paste ready code examples
- Links between related sections

### Improved Quick Start
- Clear separation between SPA and SSR usage
- Updated CDN links
- Better framework categorization

---

## 🔮 Versioning Strategy

### Why v1.0.4 (PATCH)?
This release contains:
- ✅ Bug fixes (CSS styling, re-run cleanup) → PATCH
- ✅ Documentation improvements → PATCH
- ❌ No new features → Not MINOR
- ❌ No breaking changes → Not MAJOR

### Semantic Versioning
```
v1.0.4
│ │ └─ PATCH: Bug fixes, documentation
│ └─── MINOR: New features (backward compatible)
└───── MAJOR: Breaking changes
```

---

## 🔗 Resources

- **npm Package**: [web-audit-helper](https://www.npmjs.com/package/web-audit-helper)
- **GitHub Repository**: [Storbo2/web-audit-helper](https://github.com/Storbo2/web-audit-helper)
- **Documentation**: [docs/](./docs/)
- **Changelog**: [CHANGELOG.md](./CHANGELOG.md)
- **Contributing**: [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 📋 Checklist

- [x] Bug fixes implemented (popover CSS, re-run cleanup)
- [x] Next.js / SSR documentation added
- [x] FAQ / Troubleshooting section added
- [x] Quick Start improvements
- [x] CDN version updated
- [x] package.json version: 1.0.4
- [x] CHANGELOG.md updated
- [x] All tests passing (21/21)
- [x] TypeScript compilation successful
- [x] Build successful (npm run build)
- [ ] Git commit and push
- [ ] GitHub release tagged (v1.0.4)
- [ ] npm publish (automated via CI/CD)

---

## 🎉 What's Next?

### v1.1.0 (Planned)
- Extended rule set (10+ new rules)
- Comprehensive test coverage (>80%)
- Performance improvements
- i18n support

### v2.0.0 (Future)
- CLI tool for CI/CD
- Plugin system for custom rules
- DevTools extension
- Analytics dashboard

---

**Published**: March 2, 2026  
**Status**: ✅ Production Ready  
**Prepared by**: GitHub Copilot

---

## 📝 Notes for Maintainers

### Files Changed in v1.0.4
```
Modified:
  - README.md
  - CHANGELOG.md
  - package.json
  - src/index.ts
  - src/overlay/styles/popover/popover-base.css
  - src/overlay/styles/popover/popover-filters.css

Created:
  - RELEASE-NOTES-v1.0.4.md
```

### Deployment Command
```bash
git add .
git commit -m "chore: release v1.0.4 - fix popover styling, improve SSR docs"
git tag v1.0.4
git push origin main --tags
```

GitHub Actions will automatically:
1. Run tests
2. Build package
3. Publish to npm (if on main branch and tagged)
