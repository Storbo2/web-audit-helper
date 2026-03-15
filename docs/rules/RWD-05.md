# RWD-05 - Problematic 100vh

Category
Responsive

Severity
Recommendation

Type
heuristic

## Problem

The layout relies on `100vh`, which can be inaccurate on mobile browsers.

## Why it matters

Mobile browser UI chrome can change viewport height dynamically and cause clipping or overflow.

## How to fix

Prefer `min-height`, dynamic viewport units (`dvh`), or fallbacks that account for browser UI.

## Bad example

```html
<section style="height:100vh">...</section>
```

## Good example

```html
<section style="min-height:100dvh">...</section>
```

## References

web.dev - Large, small, and dynamic viewport units
<https://web.dev/blog/viewport-units>
