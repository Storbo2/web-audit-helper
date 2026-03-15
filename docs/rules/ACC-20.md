# ACC-20 - Link missing href

Category
Accessibility

Severity
Warning

Type
standard

## Problem

An anchor element is used without a valid `href`.

## Why it matters

Links without href are not reliable navigation targets and can confuse keyboard users.

## How to fix

Provide a valid URL in `href`, or use a `<button>` for non-navigation actions.

## Bad example

```html
<a>Open modal</a>
```

## Good example

```html
<button type="button">Open modal</button>
```

## References

HTML Living Standard - The a element
<https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-a-element>
