# WAH – Web Audit Helper 🧠

WAH (Web Audit Helper) is a framework-agnostic JavaScript/TypeScript library that helps developers audit web pages during development.

It provides real-time DOM analysis, a floating visual overlay, console diagnostics, and exportable reports.

WAH focuses on:

- Accessibility
- Responsive design
- Semantic HTML
- Basic SEO best practices
- Quality (code patterns and best practices)
- Security (basic security checks)

---

## ✨ Features

- ✔ Accessibility checks (font size, alt, labels, vague links, headings)
- 🧱 Semantic HTML analysis (multiple H1, semantic usage heuristics)
- 🔍 Basic SEO checks (title, meta description, viewport)
- 📱 Responsive heuristics (viewport, fixed-width detection)
- 🔒 Security checks (inline scripts, external resources)
- ✨ Quality checks (code patterns and best practices)
- 🎨 Floating configurable overlay
- 📊 Scoring system (excellent → critical)
- 📤 Export reports (JSON / TXT)
- 🧩 Framework-agnostic
- 🧹 Zero runtime dependencies
- ⏳ Temporary hide system (hide overlay for X minutes)
- 🧠 Console diagnostics with restore timestamp

---

## 🚀 Installation

```bash
npm install web-audit-helper
```

---

## 🎮 Console Commands

WAH exposes global commands in the browser console for debugging and interaction:

### `__WAH_FOCUS_ISSUE__(index)`

Highlights an issue element in the DOM and logs its details.

- **Parameter**: `index` (number) - The index of the issue from the console table
- **Returns**: The issue object or `null` if not found
- **Example**: `__WAH_FOCUS_ISSUE__(0)` - Focuses on the first issue in the table

### `__WAH_RESET_HIDE__()`

Clears all hide settings (both temporary and until-refresh) and reloads the WAH overlay.

- **Parameters**: None
- **Use case**: When you've hidden the overlay and want to restore it immediately
- **Example**: `__WAH_RESET_HIDE__()`

### `__WAH_RERUN__()`

Removes the current overlay and popover, then re-runs the audit with the same configuration.

- **Parameters**: None
- **Use case**: Refresh the audit after making DOM changes without reloading the page
- **Example**: `__WAH_RERUN__()`