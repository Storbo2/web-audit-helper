# SEO-02 - Missing description

Category
SEO

Severity
Warning

Type
standard

## Problem

The page is missing a meta description or has one with insufficient content.

## Why it matters

Search engines often use meta descriptions in result snippets, which affects clarity and click-through rate.

## How to fix

Add a concise, page-specific meta description in the head section.

## Bad example

```html
<head>
  <title>Pricing</title>
</head>
```

## Good example

```html
<head>
  <title>Pricing</title>
  <meta name="description" content="Compare plans and pricing for teams and individuals.">
</head>
```

## References

Google Search Central - Snippet guidelines
<https://developers.google.com/search/docs/appearance/snippet>
