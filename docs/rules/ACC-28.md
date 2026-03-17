# ACC-28 - Dialog missing accessible name

Category
Accessibility

Severity
Critical

Type
standard

## Problem

Dialog or alertdialog container has no accessible name.

## Why it matters

Screen reader users need a clear dialog name to understand context when focus moves into modal or dialog content.

## How to fix

Provide a descriptive `aria-label` or a valid `aria-labelledby` that points to visible title text.

## Bad example

```html
<div role="dialog">
  <p>Settings content</p>
</div>
```

## Good example

```html
<h2 id="settings-title">Settings</h2>
<div role="dialog" aria-labelledby="settings-title">
  <p>Settings content</p>
</div>
```

## References

WCAG 2.1 - 4.1.2 Name, Role, Value
<https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html>
