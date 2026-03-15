# RWD-03 - Horizontal overflow

Category
Responsive

Severity
Warning

Type
heuristic

## Problem

Page content exceeds viewport width and causes horizontal scrolling.

## Why it matters

Horizontal overflow harms readability and touch usability on mobile devices.

## How to fix

Remove oversized widths and ensure child elements can shrink within viewport limits.

## Bad example

```html
<div style="width:110vw">...</div>
```

## Good example

```html
<div style="max-width:100%;overflow-wrap:anywhere">...</div>
```

## References

MDN - overflow-x
<https://developer.mozilla.org/docs/Web/CSS/overflow-x>
