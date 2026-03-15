# IMG-02 - Image missing lazy loading

Category
Performance

Severity
Recommendation

Type
standard

## Problem

Below-the-fold images are missing `loading="lazy"`.

## Why it matters

Eagerly loading offscreen images increases initial payload, slows rendering, and wastes bandwidth.

## How to fix

Add `loading="lazy"` to non-critical images not needed for the initial viewport.

## Bad example

```html
<img src="gallery-4.jpg" alt="Gallery photo">
```

## Good example

```html
<img src="gallery-4.jpg" alt="Gallery photo" loading="lazy">
```

## References

web.dev - Browser-level image lazy loading
<https://web.dev/browser-level-image-lazy-loading/>
