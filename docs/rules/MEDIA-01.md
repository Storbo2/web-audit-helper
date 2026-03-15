# MEDIA-01 - Autoplay without muted

Category
Performance

Severity
Warning

Type
standard

## Problem

A video uses `autoplay` without `muted`.

## Why it matters

Modern browsers restrict autoplay with audio, causing inconsistent behavior and poor user experience.

## How to fix

If autoplay is required, include the `muted` attribute.

## Bad example

```html
<video autoplay src="promo.mp4"></video>
```

## Good example

```html
<video autoplay muted src="promo.mp4"></video>
```

## References

MDN - Autoplay guide for media
<https://developer.mozilla.org/docs/Web/Media/Autoplay_guide>
