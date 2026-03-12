# ACC-23 - Duplicate IDs

Category
Accessibility

Severity
Critical

Type
standard

## Problem

Two or more elements share the same `id` value.

## Why it matters

Duplicate IDs break label associations, ARIA references, fragment links, and scripts that rely on unique selectors.

## How to fix

Make each `id` unique across the entire document.

## Bad example

```html
<input id="email">
<div id="email"></div>
```

## Good example

```html
<input id="email-input">
<div id="email-help"></div>
```

## References

HTML Standard - The id attribute must be unique in the document tree
<https://html.spec.whatwg.org/multipage/dom.html#the-id-attribute>
