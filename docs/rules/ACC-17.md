# ACC-17 - Table missing caption

Category
Accessibility

Severity
Recommendation

Type
standard

## Problem

A data table is missing a caption or accessible table label.

## Why it matters

Captions help users understand the table purpose before navigating cell-by-cell content.

## How to fix

Add a concise `<caption>` as the first child of the table, or provide a clear aria label.

## Bad example

```html
<table>
  <tr><th>Month</th><th>Sales</th></tr>
</table>
```

## Good example

```html
<table>
  <caption>Monthly sales report</caption>
  <tr><th>Month</th><th>Sales</th></tr>
</table>
```

## References

WCAG 2.1 - 1.3.1 Info and Relationships
<https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html>
