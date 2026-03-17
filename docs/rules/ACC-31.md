# ACC-31 - Invalid control missing error message

Category
Accessibility

Severity
Warning

Type
standard

## Problem

A control marked with `aria-invalid="true"` has no associated error message.

## Why it matters

Users need clear validation feedback to understand what failed and how to fix input errors.

## How to fix

Connect the control to descriptive error text using `aria-describedby` or provide a nearby live error region.

## Bad example

```html
<label for="email">Email</label>
<input id="email" type="email" aria-invalid="true" />
```

## Good example

```html
<label for="email">Email</label>
<input id="email" type="email" aria-invalid="true" aria-describedby="email-error" />
<p id="email-error">Enter a valid email address.</p>
```

## References

WCAG 2.1 - 3.3.1 Error Identification
<https://www.w3.org/WAI/WCAG21/Understanding/error-identification.html>
