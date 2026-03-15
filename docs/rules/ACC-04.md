# ACC-04 - Button missing name

Category
Accessibility

Severity
Warning

Type
standard

## Problem

A button has no accessible name from text, label, or ARIA attributes.

## Why it matters

Screen reader users depend on accessible names to understand what each button does.

## How to fix

Provide visible button text or use `aria-label` or `aria-labelledby` with meaningful text.

## Bad example

```html
<button aria-label=""></button>
```

## Good example

```html
<button type="button">Add to cart</button>
```

## References

WCAG 2.1 - 1.1.1 Non-text Content
<https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html>
