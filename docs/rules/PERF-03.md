# PERF-03 - Too many scripts

Category
Performance

Severity
Recommendation

Type
heuristic

## Problem

The page loads a high number of scripts.

## Why it matters

Excessive JavaScript increases download, parse, and execution time, delaying interactivity.

## How to fix

Remove unused scripts, bundle where possible, and defer non-critical code.

## Bad example

```html
<script src="a.js"></script>
<script src="b.js"></script>
<script src="c.js"></script>
<script src="d.js"></script>
```

## Good example

```html
<script src="app.bundle.js" defer></script>
```

## References

web.dev - Reduce JavaScript payloads
<https://web.dev/learn/performance/reduce-javascript-payloads>
