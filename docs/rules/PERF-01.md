# PERF-01 - Image missing srcset

Category
Performance

Severity
Recommendation

Type
standard

## Problem

Responsive image candidates are missing (`srcset` and/or `sizes`).

## Why it matters

Browsers may download oversized images on small screens, increasing transfer cost and render time.

## How to fix

Provide responsive image sources with `srcset` and `sizes` that match your layout breakpoints.

## Bad example

```html
<img src="hero-1600.jpg" alt="Hero image">
```

## Good example

```html
<img src="hero-800.jpg" srcset="hero-800.jpg 800w, hero-1600.jpg 1600w" sizes="(max-width: 768px) 100vw, 50vw" alt="Hero image">
```

## References

web.dev - Serve responsive images
<https://web.dev/serve-responsive-images/>
