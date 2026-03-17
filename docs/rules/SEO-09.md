# SEO-09 - Canonical conflict or empty canonical

Category
SEO

Severity
Warning

Type
standard

## Problem

The page has multiple canonical tags or a canonical tag with an empty href.

## Why it matters

Conflicting canonical signals can dilute indexing decisions and make preferred URL selection unreliable.

## How to fix

Keep a single canonical tag in head and set a non-empty preferred absolute URL.

## Bad example

```html
<head>
  <link rel="canonical" href="https://example.com/a" />
  <link rel="canonical" href="https://example.com/b" />
</head>
```

## Good example

```html
<head>
  <link rel="canonical" href="https://example.com/article" />
</head>
```

## References

Google Search Central - Consolidate duplicate URLs
<https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls>
