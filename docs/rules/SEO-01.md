# SEO-01 - Missing title

Category
SEO

Severity
Critical

Type
standard

## Problem

The page is missing a `<title>` element or it is empty.

## Why it matters

Search engines and browsers use the title as the main label for the page in results, tabs, and bookmarks.

## How to fix

Add a unique, descriptive title inside `<head>` that summarizes the page content.

## Bad example

```html
<head>
</head>
```

## Good example

```html
<head>
  <title>Product catalog | WAH Store</title>
</head>
```

## References

Google Search Central - Title links
<https://developers.google.com/search/docs/appearance/title-link>
