# ACC-19 - Vague link text

Category
Accessibility

Severity
Warning

Type
standard

## Problem

Link text is vague and does not communicate destination or action.

## Why it matters

Users navigating by links need descriptive text to decide where to go.

## How to fix

Replace generic text like "click here" with meaningful destination-specific labels.

## Bad example

```html
<a href="/pricing">Click here</a>
```

## Good example

```html
<a href="/pricing">View pricing plans</a>
```

## References

WCAG 2.1 - 2.4.4 Link Purpose (In Context)
<https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html>
