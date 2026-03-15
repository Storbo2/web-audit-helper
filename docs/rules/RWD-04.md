# RWD-04 - Fixed element overlap

Category
Responsive

Severity
Warning

Type
heuristic

## Problem

A fixed or sticky element occupies excessive viewport space and overlaps content.

## Why it matters

Important content can become hidden or unreachable, especially on short mobile viewports.

## How to fix

Reduce fixed element height and add layout offsets so content remains visible.

## Bad example

```html
<header style="position:fixed;height:40vh">...</header>
```

## Good example

```html
<header style="position:sticky;top:0;height:64px">...</header>
<main style="padding-top:64px">...</main>
```

## References

Heuristic - mobile layout stability
<https://web.dev/learn/design/responsive-layouts/>
