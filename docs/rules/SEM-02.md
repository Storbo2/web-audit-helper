# SEM-02 - Low semantic structure

Category
Semantic

Severity
Warning

Type
heuristic

## Problem

The page relies heavily on generic containers without semantic landmarks.

## Why it matters

Low semantic structure makes navigation harder for assistive technologies and maintainers.

## How to fix

Use semantic sections like `header`, `nav`, `main`, `article`, `section`, and `footer` where appropriate.

## Bad example

```html
<div class="header">...</div>
<div class="content">...</div>
<div class="footer">...</div>
```

## Good example

```html
<header>...</header>
<main>...</main>
<footer>...</footer>
```

## References

MDN - HTML5 semantic elements
<https://developer.mozilla.org/docs/Glossary/Semantics>
