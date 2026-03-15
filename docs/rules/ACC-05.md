# ACC-05 - Control missing id/name

Category
Accessibility

Severity
Critical

Type
standard

## Problem

A form control is missing stable `id` or `name` attributes.

## Why it matters

Missing identifiers can break labeling, form handling, and automation.

## How to fix

Add unique `id` and meaningful `name` attributes to each form control.

## Bad example

```html
<input type="text">
```

## Good example

```html
<input id="first-name" name="firstName" type="text">
```

## References

WCAG 2.1 - 1.3.1 Info and Relationships
<https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html>
