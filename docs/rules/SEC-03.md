# SEC-03 - Mixed content over HTTP in secure context

Category
Security

Severity
Warning

Type
owasp

## Problem

An HTTPS page embeds one or more subresources over `http://` using `src`, `href`, or `data` on resource-loading elements.

## Why it matters

Mixed content weakens transport security, can cause browser blocking, and may leave users with broken or downgraded page functionality.

## How to fix

Serve all embedded resources over HTTPS.

## Bad example

```html
<img src="http://cdn.example.com/banner.jpg" alt="Banner" />
```

## Good example

```html
<img src="https://cdn.example.com/banner.jpg" alt="Banner" />
```

## References

OWASP - Transport Layer Protection
<https://owasp.org/www-project-top-ten/>

MDN - Mixed content
<https://developer.mozilla.org/docs/Web/Security/Mixed_content>
