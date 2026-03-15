# ACC-13 - Positive tabindex

Category
Accessibility

Severity
Recommendation

Type
standard

## Problem

Elements use positive tabindex values greater than zero.

## Why it matters

Positive tabindex changes natural keyboard order and can create confusing navigation.

## How to fix

Avoid positive tabindex; use semantic HTML order and only `tabindex="0"` or `tabindex="-1"` when needed.

## Bad example

```html
<button tabindex="3">Checkout</button>
```

## Good example

```html
<button>Checkout</button>
```

## References

WCAG 2.1 - 2.1.1 Keyboard
<https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html>
