# SEC-01 - Unsafe target=_blank

Category
Security

Severity
Warning

Type
standard

## Problem

A link uses `target="_blank"` without `rel="noopener noreferrer"`.

## Why it matters

The opened page can access `window.opener` and potentially redirect the original tab (reverse tabnabbing risk).

## How to fix

When using `target="_blank"`, always add `rel="noopener noreferrer"`.

## Bad example

```html
<a href="https://example.com" target="_blank">Open docs</a>
```

## Good example

```html
<a href="https://example.com" target="_blank" rel="noopener noreferrer">Open docs</a>
```

## References

OWASP - Reverse Tabnabbing
<https://owasp.org/www-community/attacks/Reverse_Tabnabbing>
