# IMG-03 - Image missing async decode

Category
Performance

Severity
Recommendation

Type
standard

## Problem

Image elements are missing `decoding="async"` where applicable.

## Why it matters

Asynchronous decoding helps avoid blocking rendering on large image decode tasks.

## How to fix

Add `decoding="async"` to non-critical images.

## Bad example

```html
<img src="gallery.jpg" alt="Gallery image">
```

## Good example

```html
<img src="gallery.jpg" alt="Gallery image" decoding="async">
```

## References

MDN - HTMLImageElement.decoding
<https://developer.mozilla.org/docs/Web/API/HTMLImageElement/decoding>
