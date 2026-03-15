# SEO-06 - Robots noindex

Category
SEO

Severity
Warning

Type
standard

## Problem

The page includes a `noindex` directive in robots metadata.

## Why it matters

Search engines will avoid indexing the page, making it unavailable in search results.

## How to fix

Remove `noindex` when the page should be discoverable, or scope it only to non-public environments.

## Bad example

```html
<meta name="robots" content="noindex">
```

## Good example

```html
<meta name="robots" content="index,follow">
```

## References

Google Search Central - Robots meta tag
<https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag>
