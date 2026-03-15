# SEO-08 - Missing Twitter Card

Category
SEO

Severity
Recommendation

Type
standard

## Problem

Twitter/X card metadata is missing.

## Why it matters

Without card tags, shared links may render incomplete or generic previews on X.

## How to fix

Add required Twitter card tags including twitter:card, twitter:title, and twitter:description.

## Bad example

```html
<head>
  <title>Release notes</title>
</head>
```

## Good example

```html
<head>
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Release notes">
  <meta name="twitter:description" content="Latest product updates.">
</head>
```

## References

X Developer Platform - Cards markup
<https://developer.x.com/en/docs/x-for-websites/cards/overview/markup>
