# SEM-03 - Multiple H1

Category
Semantic

Severity
Warning

Type
heuristic

## Problem

The page contains more than one `h1` heading.

## Why it matters

Multiple top-level headings can make document hierarchy less clear for users and crawlers.

## How to fix

Use one primary `h1` per page and continue section structure with `h2` and lower levels.

## Bad example

```html
<h1>Catalog</h1>
<h1>Featured products</h1>
```

## Good example

```html
<h1>Catalog</h1>
<h2>Featured products</h2>
```

## References

Heuristic - heading hierarchy best practice
<https://developer.mozilla.org/docs/Web/HTML/Element/Heading_Elements>
