# FORM-04 - Missing autocomplete

Category
Forms

Severity
Recommendation

Type
standard

## Problem

Common form fields are missing relevant `autocomplete` attributes.

## Why it matters

Autocomplete improves speed, reduces typing errors, and helps users complete forms with less cognitive and motor effort.

## How to fix

Add the appropriate `autocomplete` token (for example `name`, `email`, `tel`, `street-address`) to each known field.

## Bad example

```html
<label>Email</label>
<input type="email">
```

## Good example

```html
<label for="email">Email</label>
<input id="email" type="email" autocomplete="email">
```

## References

WCAG 2.1 - 1.3.5 Identify Input Purpose
<https://www.w3.org/WAI/WCAG21/Understanding/identify-input-purpose.html>
