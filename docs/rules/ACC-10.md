# ACC-10 - Heading order jump

Category
Accessibility

Severity
Warning

Type
standard

## Problem

Heading levels are skipped (for example, `h1` directly to `h3`).

## Why it matters

Many users navigate by headings. Broken hierarchy makes content structure harder to understand.

## How to fix

Use sequential heading levels (`h1`, `h2`, `h3`, etc.) that match document structure.

## Bad example

```html
<h1>Checkout</h1>
<h3>Shipping details</h3>
```

## Good example

```html
<h1>Checkout</h1>
<h2>Shipping details</h2>
```

## References

WCAG 2.1 - 1.3.1 Info and Relationships
<https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html>
