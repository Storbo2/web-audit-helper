# ACC-29 - Modal missing focusable element

Category
Accessibility

Severity
Warning

Type
heuristic

## Problem

A modal dialog (`aria-modal="true"`) has no focusable element for initial keyboard interaction.

## Why it matters

Keyboard and assistive-technology users can get trapped in a modal with no actionable focus target.

## How to fix

Ensure each modal contains at least one focusable control (for example a close button or primary action button).

## Bad example

```html
<div role="dialog" aria-modal="true" aria-label="Read only modal">
  <p>Only static text.</p>
</div>
```

## Good example

```html
<div role="dialog" aria-modal="true" aria-label="Confirm action">
  <p>Are you sure?</p>
  <button type="button">Close</button>
</div>
```

## References

WCAG 2.1 - 2.1.1 Keyboard
<https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html>
