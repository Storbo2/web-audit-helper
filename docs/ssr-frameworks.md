# SSR / Next.js Guide

WAH runs in the browser only and requires DOM APIs. In SSR frameworks, load it on the client side only.

## When To Use This Guide

Use this guide if your app is built with:

- Next.js
- Nuxt
- SvelteKit
- Remix
- Any framework that renders on the server before hydrating on the client

## Core Rule

Do not execute WAH during server-side rendering. Import it dynamically from a client-only component.

This avoids errors such as `window is not defined` and prevents the server from evaluating browser-only code.

## Next.js App Router (JavaScript)

```jsx
// src/components/WahRunner.jsx
'use client';

import { useEffect } from 'react';

export default function WahRunner() {
  useEffect(() => {
    import('web-audit-helper')
      .then(({ runWAH }) => runWAH())
      .catch(console.error);
  }, []);

  return null;
}
```

```jsx
// app/layout.js
import WahRunner from '@/components/WahRunner';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <WahRunner />
        {children}
      </body>
    </html>
  );
}
```

## Next.js App Router (TypeScript)

```tsx
// src/components/WahRunner.tsx
'use client';

import { useEffect, useRef } from 'react';

export default function WahRunner() {
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    import('web-audit-helper')
      .then(({ runWAH }) => runWAH())
      .catch(console.error);
  }, []);

  return null;
}
```

```tsx
// app/layout.tsx
import type { ReactNode } from 'react';
import WahRunner from '@/components/WahRunner';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WahRunner />
        {children}
      </body>
    </html>
  );
}
```

## Why Dynamic Import

Dynamic import prevents the server from eagerly evaluating the module and isolates WAH to the browser runtime.

## Why `useRef` In TypeScript Example

React Strict Mode can invoke `useEffect` twice in development. The `useRef` guard ensures WAH initializes only once.

## Practical Notes

- Keep WAH in development-only paths when possible.
- If you only need headless audits, prefer the CLI instead of embedding WAH into the app runtime.
- If your framework uses islands or partial hydration, the same rule applies: load WAH only where `window` and `document` are available.

## Related Docs

- [README](../README.md)
- [API Reference](api.md)
- [Configuration](configuration.md)
