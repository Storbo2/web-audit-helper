# ACC-01 - Missing html lang

Category
Accessibility

Severity
Warning

Type
standard

## Problem

The page is missing a valid `lang` attribute on the `<html>` element.

## Why it matters

Screen readers, translation tools, and search engines use page language metadata to process and present content correctly.

## How to fix

Set the primary language on the root element, for example `lang="en"` or `lang="es"`.

## Bad example

```html
<html>
  <head><title>Home</title></head>
  <body>...</body>
</html>
```

## Good example

```html
<html lang="en">
  <head><title>Home</title></head>
  <body>...</body>
</html>
```

## References

WCAG 2.1 - 3.1.1 Language of Page
<https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html>
