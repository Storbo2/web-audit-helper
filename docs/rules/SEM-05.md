# SEM-05 - Multiple main elements

Category
Semantic

Severity
Warning

Type
heuristic

## Problem

The page contains more than one `<main>` element.

## Why it matters

Multiple main landmarks create ambiguous structure and make navigation harder for assistive technologies.

## How to fix

Keep only one active `<main>` per document and move repeated or secondary content to other semantic containers.

## Bad example

```html
<main>Product details</main>
<main>Related products</main>
```

## Good example

```html
<main>
  <section>Product details</section>
  <section>Related products</section>
</main>
```

## References

HTML5 best practice - Main landmark
<https://developer.mozilla.org/docs/Web/HTML/Element/main>
