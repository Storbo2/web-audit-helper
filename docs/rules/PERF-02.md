# PERF-02 - Too many fonts

Category
Performance

Severity
Recommendation

Type
heuristic

## Problem

Too many font families or weights are loaded.

## Why it matters

Each font variant adds network and render cost, delaying text paint.

## How to fix

Limit families and weights to the minimum needed and prefer system fonts when possible.

## Bad example

```html
<link href="https://fonts.example.com?family=A:100,300,400,700&family=B:300,400,700&family=C:400,700" rel="stylesheet">
```

## Good example

```html
<link href="https://fonts.example.com?family=Inter:400,600" rel="stylesheet">
```

## References

web.dev - Optimize web fonts
<https://web.dev/learn/performance/optimize-web-fonts>
