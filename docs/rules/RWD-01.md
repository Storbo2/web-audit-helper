# RWD-01 - Large fixed width

Category
Responsive

Severity
Warning

Type
heuristic

## Problem

Elements use large fixed pixel widths that do not adapt to smaller screens.

## Why it matters

Fixed widths can force horizontal scrolling and break mobile layouts.

## How to fix

Use fluid sizing (`%`, `vw`) and constraints like `max-width: 100%`.

## Bad example

```html
<div style="width:1200px">...</div>
```

## Good example

```html
<div style="width:100%;max-width:1200px">...</div>
```

## References

MDN - Responsive design basics
<https://developer.mozilla.org/docs/Learn/CSS/CSS_layout/Responsive_Design>
