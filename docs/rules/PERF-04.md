# PERF-04 - Script without defer

Category
Performance

Severity
Warning

Type
standard

## Problem

A script in the head is loaded without `defer` or `async`.

## Why it matters

Blocking scripts delay HTML parsing and can significantly slow first render.

## How to fix

Use `defer` for scripts that depend on DOM order or `async` for independent scripts.

## Bad example

```html
<head>
  <script src="/app.js"></script>
</head>
```

## Good example

```html
<head>
  <script src="/app.js" defer></script>
</head>
```

## References

web.dev - Efficiently load third-party JavaScript
<https://web.dev/efficiently-load-third-party-javascript/>
