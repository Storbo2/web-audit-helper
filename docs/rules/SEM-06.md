# SEM-06 - Nav missing list

Category
Semantic

Severity
Recommendation

Type
heuristic

## Problem

A navigation region does not use list semantics for grouped links.

## Why it matters

List semantics provide clearer structure for assistive technologies and improve maintainability.

## How to fix

Wrap grouped navigation links in `ul`/`ol` and `li` items.

## Bad example

```html
<nav>
  <a href="/">Home</a>
  <a href="/pricing">Pricing</a>
</nav>
```

## Good example

```html
<nav>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/pricing">Pricing</a></li>
  </ul>
</nav>
```

## References

Heuristic - semantic navigation structure
<https://developer.mozilla.org/docs/Web/HTML/Element/nav>
