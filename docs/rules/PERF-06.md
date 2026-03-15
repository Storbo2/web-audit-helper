# PERF-06 - Missing cache headers

Category
Performance

Severity
Recommendation

Type
heuristic

## Problem

Static assets appear to be served without effective cache policy.

## Why it matters

Missing cache headers force repeated downloads and slow repeat visits.

## How to fix

Set long-lived `Cache-Control` headers for fingerprinted static assets.

## Bad example

```text
Cache-Control: no-store
```

## Good example

```text
Cache-Control: public, max-age=31536000, immutable
```

## References

MDN - Cache-Control
<https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control>
