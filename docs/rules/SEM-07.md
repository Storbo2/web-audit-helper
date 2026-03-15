# SEM-07 - False list structure

Category
Semantic

Severity
Recommendation

Type
heuristic

## Problem

List containers include non-list children instead of `li` items.

## Why it matters

Invalid list structure reduces semantic clarity and can affect assistive technology interpretation.

## How to fix

Ensure direct children of `ul` and `ol` are `li` elements.

## Bad example

```html
<ul>
  <div>Item A</div>
  <div>Item B</div>
</ul>
```

## Good example

```html
<ul>
  <li>Item A</li>
  <li>Item B</li>
</ul>
```

## References

HTML Living Standard - ul element content model
<https://html.spec.whatwg.org/multipage/grouping-content.html#the-ul-element>
