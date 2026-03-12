# ACC-09 - Missing H1

Category
Accessibility

Severity
Warning

Type
heuristic

## Problem

The page does not include an `h1` heading to define its main topic.

## Why it matters

A clear primary heading improves scanability and helps users and search engines understand page purpose quickly.

## How to fix

Add one meaningful `h1` near the start of main content and keep it aligned with page intent.

## Bad example

```html
<main>
  <h2>Product catalog</h2>
</main>
```

## Good example

```html
<main>
  <h1>Product catalog</h1>
  <h2>Featured products</h2>
</main>
```

## References

Best practice - document heading structure
<https://developer.mozilla.org/docs/Web/HTML/Element/Heading_Elements>
