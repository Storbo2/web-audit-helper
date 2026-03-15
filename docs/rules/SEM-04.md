# SEM-04 - Missing main element

Category
Semantic

Severity
Warning

Type
heuristic

## Problem

The page does not include a `<main>` element for primary content.

## Why it matters

A clear main landmark improves navigation for assistive technologies and makes document structure easier to understand.

## How to fix

Wrap the primary content area in a single `<main>` element, excluding repeated page chrome like header and footer.

## Bad example

```html
<body>
  <header>...</header>
  <div class="content">...</div>
</body>
```

## Good example

```html
<body>
  <header>...</header>
  <main>...</main>
</body>
```

## References

HTML5 best practice - Main landmark
<https://developer.mozilla.org/docs/Web/HTML/Element/main>
