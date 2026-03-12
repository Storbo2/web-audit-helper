# ACC-15 - Iframe missing title

Category
Accessibility

Severity
Warning

Type
standard

## Problem

An `iframe` is missing a descriptive `title` attribute.

## Why it matters

Screen readers announce iframe titles so users can understand the purpose of embedded content before entering it.

## How to fix

Add a concise and specific `title` describing what the iframe contains.

## Bad example

```html
<iframe src="/map"></iframe>
```

## Good example

```html
<iframe src="/map" title="Store location map"></iframe>
```

## References

WCAG 2.1 - 2.4.1 Bypass Blocks
<https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks.html>
