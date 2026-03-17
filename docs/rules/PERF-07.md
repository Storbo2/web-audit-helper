# PERF-07 - CSS @import usage

Category
Performance

Severity
Recommendation

Type
web-dev

## Problem

Runtime CSS uses `@import`, which delays stylesheet discovery and extends the critical rendering path.

## Why it matters

Browsers must parse the parent stylesheet before discovering imported files, which slows initial rendering.

## How to fix

Prefer direct `<link>` tags or build-time bundling instead of runtime `@import`.

## References

web.dev - Render-blocking CSS
<https://web.dev/critical-rendering-path-render-blocking-css/>
