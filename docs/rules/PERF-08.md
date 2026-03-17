# PERF-08 - Image without modern format alternative

Category
Performance

Severity
Warning

Type
web-dev

## Problem

Large images are served only in legacy formats without WebP or AVIF alternatives.

## Why it matters

Next-generation image formats usually reduce transfer size and improve load performance compared with JPG or PNG.

## How to fix

Use `<picture>` and provide WebP or AVIF alternatives for large visual assets.

## References

web.dev - Serve images in next-gen formats
<https://web.dev/serve-images-webp/>
