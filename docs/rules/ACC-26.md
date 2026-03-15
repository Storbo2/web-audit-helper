# ACC-26 - Line-height too low

Category
Accessibility

Severity
Recommendation

Type
heuristic

## Problem

Text line-height is too tight for comfortable reading.

## Why it matters

Low line spacing reduces readability, especially in paragraphs and dense content.

## How to fix

Set line-height to at least 1.4 to 1.5 for body text and long-form content.

## Bad example

```html
<p style="line-height:1.1">Long paragraph content...</p>
```

## Good example

```html
<p style="line-height:1.5">Long paragraph content...</p>
```

## References

WCAG 2.1 - 1.4.12 Text Spacing (related guidance)
<https://www.w3.org/WAI/WCAG21/Understanding/text-spacing.html>
