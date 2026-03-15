# RWD-02 - Missing viewport

Category
Responsive

Severity
Critical

Type
standard

## Problem

The document is missing the viewport meta tag.

## Why it matters

Without viewport configuration, mobile browsers render pages at desktop width, making content unreadable and hard to interact with.

## How to fix

Add `<meta name="viewport" content="width=device-width, initial-scale=1">` in `<head>`.

## Bad example

```html
<head>
  <title>Home</title>
</head>
```

## Good example

```html
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Home</title>
</head>
```

## References

HTML Living Standard - Viewport metadata
<https://html.spec.whatwg.org/multipage/semantics.html#meta>
