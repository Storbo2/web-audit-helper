# ACC-14 - Nested interactive elements

Category
Accessibility

Severity
Warning

Type
standard

## Problem

An interactive element is nested inside another interactive element.

## Why it matters

Nested controls create conflicting focus and activation behavior, confusing keyboard and assistive technology users.

## How to fix

Keep one interactive control per clickable region; separate actions into sibling controls.

## Bad example

```html
<button>
  Save
  <a href="/help">Help</a>
</button>
```

## Good example

```html
<button>Save</button>
<a href="/help">Help</a>
```

## References

WCAG 2.1 - 2.1.1 Keyboard
<https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html>
