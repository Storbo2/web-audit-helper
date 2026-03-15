# QLT-01 - Too many inline styles

Category
Quality

Severity
Recommendation

Type
heuristic

## Problem

The page uses an excessive number of inline style attributes.

## Why it matters

Inline styles reduce maintainability, hinder reuse, and make design consistency harder to enforce.

## How to fix

Move repeated style rules to CSS classes and external stylesheets.

## Bad example

```html
<div style="color:#333;font-size:14px">...</div>
<div style="color:#333;font-size:14px">...</div>
```

## Good example

```html
<style>.text-default{color:#333;font-size:14px}</style>
<div class="text-default">...</div>
<div class="text-default">...</div>
```

## References

Heuristic - maintainable CSS practices
<https://developer.mozilla.org/docs/Learn/CSS/Building_blocks/Organizing>
