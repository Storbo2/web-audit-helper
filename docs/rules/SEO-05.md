# SEO-05 - Missing canonical

Category
SEO

Severity
Recommendation

Type
standard

## Problem

The page is missing a canonical URL declaration.

## Why it matters

Canonical tags help search engines consolidate duplicate or similar URLs under a preferred page.

## How to fix

Add a canonical link element in head pointing to the preferred public URL.

## Bad example

```html
<head>
  <title>Blog article</title>
</head>
```

## Good example

```html
<head>
  <title>Blog article</title>
  <link rel="canonical" href="https://example.com/blog/article">
</head>
```

## References

Google Search Central - Canonicalization
<https://developers.google.com/search/docs/crawling-indexing/canonicalization>
