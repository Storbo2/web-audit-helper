# PERF-09 - Above-the-fold image without fetch priority

Category
Performance

Severity
Recommendation

Type
web-dev

## Problem

A large image visible on initial page load (above-the-fold) lacks the `fetchpriority="high"` attribute, which means the browser does not prioritize its download relative to other resources.

## Why it matters

Setting `fetchpriority="high"` on above-the-fold images signals to the browser to prioritize their loading. This can improve **Largest Contentful Paint (LCP)**, one of Google's Core Web Vitals metrics, which directly impacts search ranking and user experience.

Without explicit priority hints, the browser uses heuristics that may not optimally schedule large hero images, resulting in slower perceived page load times.

## How to fix

Add `fetchpriority="high"` to images that are:

1. Visible in the initial viewport (above-the-fold)
2. Large (typically hero or banner images > 300x300px)
3. Critical to the user's understanding of the page

```html
<!-- Bad: No fetchpriority hint -->
<img src="hero.jpg" alt="Hero" width="800" height="400" loading="eager" />

<!-- Good: Fetchpriority set to high -->
<img src="hero.jpg" alt="Hero" width="800" height="400" loading="eager" fetchpriority="high" />
```

## Special cases

- Images in a `<header>`, `[role="banner"]`, or elements with classes like `.hero` or `.banner` are automatically flagged if missing `fetchpriority`.
- Small decorative images and images below the fold should not use `fetchpriority="high"` to avoid competing for bandwidth.
- Use `fetchpriority="low"` for off-screen images that are less critical.

## Browser support

- `fetchpriority` is supported in modern browsers (Chrome 102+, Firefox 121+, Safari 16.4+, Edge 102+)
- Older browsers safely ignore the attribute

## References

Google Web.dev - Optimize Largest Contentful Paint
<https://web.dev/articles/optimize-lcp>

MDN - fetchpriority
<https://developer.mozilla.org/docs/Web/API/HTMLImageElement/fetchpriority>

Google Search Central - Core Web Vitals
<https://developers.google.com/search/docs/appearance/core-web-vitals>
