# IMG-01 - Image missing dimensions

Category
Performance

Severity
Warning

Type
standard

## Problem

An image is missing explicit `width` and `height` attributes.

## Why it matters

Without reserved space, layout shifts when images load, hurting visual stability and Core Web Vitals (CLS).

## How to fix

Set intrinsic `width` and `height` attributes (or reserve equivalent aspect-ratio space via CSS).

## Bad example

```html
<img src="hero.jpg" alt="Storefront">
```

## Good example

```html
<img src="hero.jpg" alt="Storefront" width="1200" height="675">
```

## References

web.dev - Optimize Cumulative Layout Shift
<https://web.dev/optimize-cls/>
