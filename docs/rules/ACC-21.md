# ACC-21 - Focus not visible

Category
Accessibility

Severity
Warning

Type
standard

## Problem

Interactive elements do not show a clear visible focus indicator.

## Why it matters

Keyboard users must see where focus is to navigate reliably through controls and actions.

## How to fix

Do not remove browser focus styles unless you provide an equal or stronger custom focus indicator.

## Bad example

```html
<style>
  button:focus { outline: none; }
</style>
```

## Good example

```html
<style>
  button:focus-visible {
    outline: 2px solid #0b63ce;
    outline-offset: 2px;
  }
</style>
```

## References

WCAG 2.1 - 2.4.7 Focus Visible
<https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html>
