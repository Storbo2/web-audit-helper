# FORM-03 - Email/tel without type

Category
Forms

Severity
Recommendation

Type
standard

## Problem

An email or phone field uses a generic input type instead of semantic input types.

## Why it matters

Correct input types improve validation and provide optimized virtual keyboards on mobile devices.

## How to fix

Use `type="email"` for email addresses and `type="tel"` for phone numbers.

## Bad example

```html
<input name="email" type="text">
```

## Good example

```html
<input name="email" type="email" autocomplete="email">
```

## References

HTML Living Standard - Email state
<https://html.spec.whatwg.org/multipage/input.html#e-mail-state-(type=email)>
