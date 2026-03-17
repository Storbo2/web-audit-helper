# SEO-10 - Invalid or incomplete hreflang set

Category
SEO

Severity
Recommendation

Type
heuristic

## Problem

Hreflang alternates are malformed, missing href, or missing x-default.

## Why it matters

Incorrect hreflang signals can send users to the wrong language/region page and weaken international SEO targeting.

## How to fix

Use valid hreflang codes, provide href on all alternates, and include one x-default entry.

## Bad example

```html
<head>
  <link rel="alternate" hreflang="english-us" href="" />
  <link rel="alternate" hreflang="es" href="https://example.com/es" />
</head>
```

## Good example

```html
<head>
  <link rel="alternate" hreflang="en" href="https://example.com/en" />
  <link rel="alternate" hreflang="es" href="https://example.com/es" />
  <link rel="alternate" hreflang="x-default" href="https://example.com/" />
</head>
```

## References

Google Search Central - Tell Google about localized versions
<https://developers.google.com/search/docs/specialty/international/localized-versions>
