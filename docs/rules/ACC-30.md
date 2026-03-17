# ACC-30 - Icon-only button missing accessible name

Category
Accessibility

Severity
Critical

Type
standard

## Problem

An icon-only button has no robust accessible name.

## Why it matters

Buttons with only icons are ambiguous for screen reader users unless a clear programmatic name is provided.

## How to fix

Add a descriptive `aria-label` or a valid `aria-labelledby` that points to visible text.

## Bad example

```html
<button type="button">
  <svg aria-hidden="true"></svg>
</button>
```

## Good example

```html
<button type="button" aria-label="Close dialog">
  <svg aria-hidden="true"></svg>
</button>
```

## References

WCAG 2.1 - 4.1.2 Name, Role, Value
<https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html>
