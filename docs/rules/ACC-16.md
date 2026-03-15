# ACC-16 - Video missing controls

Category
Accessibility

Severity
Warning

Type
standard

## Problem

A video element is missing user controls.

## Why it matters

Users need controls to play, pause, and navigate media content, especially when autoplay is disabled.

## How to fix

Add the `controls` attribute to user-facing videos.

## Bad example

```html
<video src="intro.mp4"></video>
```

## Good example

```html
<video src="intro.mp4" controls></video>
```

## References

WCAG 2.1 - 2.1.1 Keyboard
<https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html>
