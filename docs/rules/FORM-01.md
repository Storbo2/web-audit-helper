# FORM-01 - Submit button outside form

Category
Forms

Severity
Warning

Type
standard

## Problem

A submit button is outside its associated `<form>` element.

## Why it matters

The button may not submit the intended form reliably, especially for keyboard and assistive technology users.

## How to fix

Place the submit button inside the form, or bind it explicitly with the `form` attribute.

## Bad example

```html
<form id="checkout-form"></form>
<button type="submit">Pay now</button>
```

## Good example

```html
<form id="checkout-form">
  <button type="submit">Pay now</button>
</form>
```

## References

HTML Living Standard - Form submission
<https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#form-submission-algorithm>
