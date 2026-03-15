# PERF-05 - Render-blocking CSS

Category
Performance

Severity
Recommendation

Type
heuristic

## Problem

Stylesheets are loaded in a way that blocks first render.

## Why it matters

Render-blocking CSS delays first paint and worsens perceived performance.

## How to fix

Inline critical CSS, preload key styles, and defer non-critical styles where safe.

## Bad example

```html
<link rel="stylesheet" href="/large-theme.css">
```

## Good example

```html
<link rel="preload" as="style" href="/critical.css" onload="this.rel='stylesheet'">
```

## References

web.dev - Eliminate render-blocking resources
<https://web.dev/render-blocking-resources/>
