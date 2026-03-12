# ACC-02 - Image missing alt

Category
Accessibility

Severity
Critical

Type
standard

## Problem

Informative images are missing alternative text in the `alt` attribute.

## Why it matters

Screen reader users need alternative text to understand the meaning and purpose of images.

## How to fix

Add meaningful `alt` text for informative images. Use `alt=""` only for decorative images.

## Bad example

```html
<img src="product.jpg">
```

## Good example

```html
<img src="product.jpg" alt="Blue running shoes">
```

## References

WCAG 2.1 - 1.1.1 Non-text Content
<https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html>
