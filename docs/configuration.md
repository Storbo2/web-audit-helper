# Configuration Guide

Complete reference for all WAH configuration options.

## Basic Configuration

```javascript
import { runWAH } from 'web-audit-helper';

await runWAH({
    logs: true,
    logLevel: 'full',
    issueLevel: 'all',
    accessibility: {
        minFontSize: 12,
        contrastLevel: 'AA'
    },
    overlay: {
        enabled: true,
        position: 'bottom-right',
        hide: 0
    }
});
```

## Full Configuration Reference

### Root Level Options

| Option       | Type                                | Default  | Description                                     |
| ------------ | ----------------------------------- | -------- | ----------------------------------------------- |
| `logs`       | `boolean`                           | `true`   | Enable/disable console logging of audit results |
| `logLevel`   | `'full' \| 'summary' \| 'none'`     | `'full'` | Console output verbosity                        |
| `issueLevel` | `'critical' \| 'warnings' \| 'all'` | `'all'`  | Filter which issue severities to report         |

### Accessibility Options

```javascript
accessibility: {
    // Minimum font size in pixels (warn if below)
    minFontSize: 12,           // default: 12
    
    // WCAG contrast requirement level
    contrastLevel: 'AA',       // 'AA' or 'AAA' (default: 'AA')
    
    // Optional: Custom minimum contrast ratio
    minContrastRatio: 4.5,     // default: 4.5 for AA, 7 for AAA
    
    // Optional: Minimum line-height
    minLineHeight: 1.4         // default: 1.4
}
```

### Overlay Options

```javascript
overlay: {
    // Show/hide the visual overlay interface
    enabled: true,             // default: true
    
    // Position of overlay on screen
    position: 'bottom-right',  // 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
                                // default: 'bottom-right'
    
    // Hide overlay for X milliseconds on initial load
    hide: 0,                   // 0 = show immediately (default: 0)
                                // 300000 = hide for 5 minutes
                                // -1 = hide until page refresh
}
```

### Quality Options (Optional)

```javascript
quality: {
    // Threshold for inline styles detection
    inlineStylesThreshold: 10  // warn if >10 elements (default: 10)
}
```

## Configuration Presets

### Development (Recommended)

```javascript
await runWAH({
    logs: true,
    logLevel: 'full',
    issueLevel: 'all',
    accessibility: {
        minFontSize: 12,
        contrastLevel: 'AA'
    },
    overlay: {
        enabled: true,
        position: 'bottom-right'
    }
});
```

### Strict Mode

```javascript
await runWAH({
    logs: true,
    logLevel: 'full',
    issueLevel: 'critical',  // Only critical issues
    accessibility: {
        minFontSize: 14,  // Stricter font size
        contrastLevel: 'AAA'  // Stricter contrast
    }
});
```

### CI/CD Mode

```javascript
await runWAH({
    logs: false,  // No console output
    logLevel: 'none',
    issueLevel: 'critical',  // Only critical issues
    overlay: {
        enabled: false  // Don't show overlay
    }
});
```

### Performance Focused

```javascript
await runWAH({
    logs: true,
    logLevel: 'summary',  // Less verbose
    issueLevel: 'warnings',  // Skip recommendations
    accessibility: {
        minFontSize: 14,
        contrastLevel: 'AA'
    },
    overlay: {
        enabled: true
    }
});
```

## Scoring Configuration

WAH scoring automatically uses different multipliers based on configuration:

- **strict**: 25/10/5 (critical/warning/recommendation)
- **normal**: 20/8/4 (default)
- **moderate**: 20/8/0 (ignores recommendations)
- **soft**: 20/0/0 (only critical)
- **custom**: User-defined filters

Scoring mode is changed via the overlay UI after initialization.

## Environment-Specific Configuration

### Development

```javascript
if (process.env.NODE_ENV === 'development') {
    await runWAH({
        logs: true,
        logLevel: 'full',
        overlay: { enabled: true }
    });
}
```

### Staging

```javascript
if (process.env.NODE_ENV === 'staging') {
    await runWAH({
        logs: true,
        logLevel: 'summary',
        overlay: { enabled: true }
    });
}
```

### Production

```javascript
if (process.env.NODE_ENV === 'production') {
    // Usually disabled in production, but can be enabled for testing:
    // await runWAH({
    //   logs: false,
    //   overlay: { enabled: false }
    // });
}
```

## Error Handling

```javascript
try {
    const result = await runWAH({
        /* config */
    });
    
    if (result.score < 50) {
        console.warn('Critical accessibility issues detected');
    }
    } catch (error) {
    console.error('WAH encountered an error:', error);
}
```

## Type Definitions

```typescript
import type { WAHConfig } from 'web-audit-helper';

const config: WAHConfig = {
    logs: true,
    logLevel: 'full',
    issueLevel: 'all',
    accessibility: {
        minFontSize: 12,
        contrastLevel: 'AA'
    },
    overlay: {
        enabled: true,
        position: 'bottom-right',
        hide: 0
    },
    quality: {
        inlineStylesThreshold: 10
    }
};

await runWAH(config);
```

## FAQ

**Q: How do I disable the overlay but keep console logs?**
```javascript
await runWAH({
    logs: true,
    overlay: { enabled: false }
});
```

**Q: Can I change configuration after initialization?**
A: No, configure before calling `runWAH()`. To re-run with different config, use `__WAH_RERUN__()` followed by a new `runWAH()` call.

**Q: What's the difference between `logLevel` and `issueLevel`?**
- `logLevel`: Controls console output verbosity (full/summary/none)
- `issueLevel`: Filters which severities are reported (critical/warnings/all)

**Q: Should I use AAA contrast level?**
A: AA (4.5:1) covers most cases. AAA (7:1) is recommended for body text in important applications.

**Q: Can I hide sensit data from exported reports?**
A: Currently no, but you can use `logLevel: 'none'` and disable console sharing.