# ACC-03 - Link missing name

Category
Accessibility

Severity
Warning

Type
standard

## Problem

A link has no accessible name from content or ARIA.

## Why it matters

Users of assistive technologies cannot identify link purpose when no label is exposed.

## How to fix

Ensure links have descriptive visible text or an appropriate `aria-label`/`aria-labelledby`.

## Bad example

```html
<a href="/contact"></a>
```

## Good example

```html
<a href="/contact">Contact support</a>
```

## References

WCAG 2.1 - 1.1.1 Non-text Content
<https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html>
