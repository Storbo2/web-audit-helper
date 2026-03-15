# ACC-06 - Label missing for

Category
Accessibility

Severity
Warning

Type
standard

## Problem

A label element is not correctly associated with a form control.

## Why it matters

Without proper association, assistive technologies may not announce label text when the field receives focus.

## How to fix

Use matching `for` and `id` values, or wrap the input directly inside the label.

## Bad example

```html
<label>Email</label>
<input id="email" type="email">
```

## Good example

```html
<label for="email">Email</label>
<input id="email" type="email">
```

## References

WCAG 2.1 - 1.3.1 Info and Relationships
<https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html>
