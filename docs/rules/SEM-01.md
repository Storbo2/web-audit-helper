# SEM-01 - Use strong/em

Category
Semantic

Severity
Recommendation

Type
heuristic

## Problem

Text uses presentational tags (`<b>`, `<i>`) where semantic emphasis is intended.

## Why it matters

Semantic tags communicate meaning to assistive technologies and improve document structure.

## How to fix

Use `<strong>` and `<em>` when emphasis has semantic meaning.

## Bad example

```html
<p><b>Important:</b> Read carefully.</p>
```

## Good example

```html
<p><strong>Important:</strong> Read carefully.</p>
```

## References

MDN - Text-level semantics
<https://developer.mozilla.org/docs/Web/HTML/Element/strong>
