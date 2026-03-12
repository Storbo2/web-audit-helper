# ACC-07 - Control missing label

Category
Accessibility

Severity
Critical

Type
standard

## Problem

A form control does not have an accessible label.

## Why it matters

Assistive technologies rely on labels to announce what each input does. Without labels, forms become confusing or unusable.

## How to fix

Associate each form control with a visible `<label>` using `for`/`id`, or provide `aria-label`/`aria-labelledby` when needed.

## Bad example

```html
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
