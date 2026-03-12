# ACC-11 - Invalid aria-labelledby reference

Category
Accessibility

Severity
Critical

Type
standard

## Problem

`aria-labelledby` points to one or more IDs that do not exist in the DOM.

## Why it matters

If references are broken, assistive technologies cannot compute the accessible name correctly.

## How to fix

Ensure every ID listed in `aria-labelledby` exists and points to visible, meaningful labeling text.

## Bad example

```html
<input aria-labelledby="email-label">
```

## Good example

```html
<label id="email-label" for="email">Email</label>
<input id="email" aria-labelledby="email-label">
```

## References

WCAG 2.1 - 1.3.1 Info and Relationships
<https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html>
