# ACC-12 - Invalid aria-describedby reference

Category
Accessibility

Severity
Warning

Type
standard

## Problem

`aria-describedby` references IDs that are missing or invalid.

## Why it matters

Users of assistive technologies miss important supporting instructions or context when descriptions cannot be resolved.

## How to fix

Point `aria-describedby` only to existing elements that contain useful helper or validation text.

## Bad example

```html
<input aria-describedby="password-help">
```

## Good example

```html
<p id="password-help">Use at least 12 characters.</p>
<input aria-describedby="password-help">
```

## References

WCAG 2.1 - 1.3.1 Info and Relationships
<https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html>
