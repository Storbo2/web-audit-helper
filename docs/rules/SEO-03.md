# SEO-03 - Missing charset

Category
SEO

Severity
Warning

Type
standard

## Problem

The document is missing a charset declaration.

## Why it matters

Without explicit encoding, browsers may misinterpret characters and break text rendering.

## How to fix

Add `<meta charset="UTF-8">` at the start of `<head>`.

## Bad example

```html
<head>
  <title>About</title>
</head>
```

## Good example

```html
<head>
  <meta charset="UTF-8">
  <title>About</title>
</head>
```

## References

HTML Living Standard - Character encoding declaration
<https://html.spec.whatwg.org/multipage/semantics.html#charset>
