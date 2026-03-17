# PERF-10 - Excess third-party scripts from same domain

Category
Performance

Severity
Recommendation

Type
web-dev

## Problem

Multiple scripts are loaded from the same external (third-party) domain, resulting in unnecessary network overhead and request multiplicity.

## Why it matters

Each script request incurs network latency and setup costs. When multiple scripts originate from the same domain, consolidating them into fewer requests can:

1. Reduce TCP connection overhead
2. Decrease DNS resolution queries
3. Improve parallelization and caching efficiency
4. Speed up overall page load time

This is especially important on slow networks or high-latency environments where connection setup dominates transfer time.

## How to fix

**Identify the problematic scripts:**
The audit will report the external domain and the count of scripts from that domain.

**Consolidation strategies:**

1. **Combine related scripts** from the same vendor into a single file:

   ```html
   <!-- Bad: Multiple requests to same CDN -->
   <script src="https://cdn.example.com/lib1.js" defer></script>
   <script src="https://cdn.example.com/lib2.js" defer></script>
   <script src="https://cdn.example.com/lib3.js" defer></script>

   <!-- Good: Single combined file -->
   <script src="https://cdn.example.com/combined.js" defer></script>
   ```

2. **Use bundled/minified versions** from the CDN if available:

   ```html
   <!-- Request individual library bundles rather than multiple fragments -->
   <script src="https://cdn.example.com/analytics-bundle.min.js" defer></script>
   ```

3. **Lazy-load non-critical scripts:**

   ```html
   <script src="https://cdn.example.com/tracking.js" defer></script>
   <!-- Other critical scripts loaded immediately -->
   ```

4. **Evaluate necessity:**
   - Remove duplicate or redundant scripts
   - Check if functionality can be achieved with fewer dependencies

## Threshold

The default threshold is **5 scripts per domain**. You can customize this in your WAH configuration:

```javascript
runWAH({
    rules: {
        "PERF-10": {
            threshold: 8  // Flag only when >8 scripts from same domain
        }
    }
});
```

## Special cases

- **Same-origin scripts** (from your own domain) are excluded from this check
- Only **external third-party domains** are counted
- The audit reports **one issue per offending domain**, listing the total count

## References

Google Web.dev - Reduce JavaScript payloads with code splitting
<https://web.dev/articles/reduce-javascript-payloads-with-code-splitting>

Chrome DevTools - Network panel analysis
<https://developer.chrome.com/docs/devtools/network/>

web.dev - Lazy loading
<https://web.dev/articles/lazy-loading>
