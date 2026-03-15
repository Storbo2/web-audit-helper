# ACC-18 - TH missing scope

Category
Accessibility

Severity
Recommendation

Type
standard

## Problem

Table header cells are missing a scope attribute.

## Why it matters

Screen readers rely on header relationships to correctly announce row and column context.

## How to fix

Set `scope="col"` for column headers and `scope="row"` for row headers where applicable.

## Bad example

```html
<table>
  <tr><th>Name</th><th>Price</th></tr>
</table>
```

## Good example

```html
<table>
  <tr><th scope="col">Name</th><th scope="col">Price</th></tr>
</table>
```

## References

WCAG 2.1 - 1.3.1 Info and Relationships
<https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html>
