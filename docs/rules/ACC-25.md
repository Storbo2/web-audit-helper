# ACC-25 - Insufficient contrast

Category
Accessibility

Severity
Critical

Type
standard

## Problem

Text and background colors do not meet minimum contrast requirements.

## Why it matters

Low contrast makes content hard or impossible to read for users with low vision or color vision deficiencies.

## How to fix

Adjust foreground/background colors until normal text reaches at least 4.5:1 (AA) or 7:1 (AAA).

## Bad example

```html
<p style="color:#888;background:#fff">Sale ends today</p>
```

## Good example

```html
<p style="color:#1f2937;background:#fff">Sale ends today</p>
```

## References

WCAG 2.1 - 1.4.3 Contrast (Minimum)
<https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html>
