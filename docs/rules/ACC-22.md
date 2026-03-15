# ACC-22 - Text too small

Category
Accessibility

Severity
Critical

Type
heuristic

## Problem

Text is rendered below the configured minimum readable size.

## Why it matters

Very small text increases reading effort and can be unusable for many users, especially on mobile.

## How to fix

Increase base font size and ensure body text meets at least your chosen readability threshold.

## Bad example

```html
<p style="font-size:10px">Terms and conditions apply.</p>
```

## Good example

```html
<p style="font-size:16px">Terms and conditions apply.</p>
```

## References

Heuristic - readability best practice
<https://www.nngroup.com/articles/legibility-readability-comprehension/>
