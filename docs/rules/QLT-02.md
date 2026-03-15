# QLT-02 - Dummy link

Category
Quality

Severity
Recommendation

Type
heuristic

## Problem

A link uses placeholder href values like `#` or `javascript:void(0)`.

## Why it matters

Dummy links hurt semantics and accessibility, and can create confusing keyboard behavior.

## How to fix

Use real URLs for navigation and `<button>` for actions.

## Bad example

```html
<a href="#">Open details</a>
```

## Good example

```html
<button type="button">Open details</button>
```

## References

MDN - Button vs link usage
<https://developer.mozilla.org/docs/Learn/Accessibility/HTML>
