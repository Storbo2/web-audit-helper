# ACC-24 - Missing skip link

Category
Accessibility

Severity
Recommendation

Type
standard

## Problem

The page does not provide a skip link to bypass repeated navigation.

## Why it matters

Keyboard and screen reader users benefit from skipping repeated content and moving directly to main content.

## How to fix

Add a visible-on-focus skip link at the top of the page that targets the main content container.

## Bad example

```html
<body>
  <nav>...</nav>
  <main id="main">...</main>
</body>
```

## Good example

```html
<a href="#main" class="skip-link">Skip to main content</a>
<nav>...</nav>
<main id="main">...</main>
```

## References

WCAG 2.1 - 2.4.1 Bypass Blocks
<https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks.html>
