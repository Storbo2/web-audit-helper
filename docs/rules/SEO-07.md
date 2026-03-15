# SEO-07 - Missing Open Graph

Category
SEO

Severity
Recommendation

Type
standard

## Problem

Open Graph metadata is missing for social sharing.

## Why it matters

Social platforms use Open Graph tags to generate previews; missing tags reduce control over title, description, and image.

## How to fix

Add core Open Graph tags such as og:title, og:description, and og:image.

## Bad example

```html
<head>
  <title>Docs</title>
</head>
```

## Good example

```html
<head>
  <meta property="og:title" content="Docs">
  <meta property="og:description" content="Technical documentation.">
  <meta property="og:image" content="https://example.com/cover.png">
</head>
```

## References

Open Graph Protocol
<https://ogp.me/>
