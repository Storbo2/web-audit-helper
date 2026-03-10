# API Reference

Complete reference for WAH's public API.

## Main Entry Point

### `runWAH(userConfig?: Partial<WAHConfig>): Promise<AuditResult>`

Runs the complete audit and initializes the overlay.

**Parameters:**

- `userConfig` (optional): Partial configuration to override defaults

**Returns:**

- `Promise<AuditResult>` containing issues array and overall score

**Example:**

```javascript
import { runWAH } from 'web-audit-helper';

const result = await runWAH({
    logs: true,
    logLevel: 'full',
    overlay: { enabled: true }
});

console.log(`Audit score: ${result.score}%`);
console.log(`Found ${result.issues.length} issues`);
```

---

## Global Console Commands

### `__WAH_FOCUS_ISSUE__(index: number): AuditIssue | null`

Focuses on a specific issue by highlighting its DOM element.

**Parameters:**

- `index`: Issue index from the console table

**Returns:**

- Issue object or `null` if not found

**Example:**

```javascript
__WAH_FOCUS_ISSUE__(0)  // Highlight first issue
__WAH_FOCUS_ISSUE__(5)  // Highlight sixth issue
```

### `__WAH_RESET_HIDE__(): void`

Clears the hide state and reloads the overlay.

**Example:**

```javascript
__WAH_RESET_HIDE__()  // Restore overlay if hidden
```

### `__WAH_RERUN__(): void`

Re-runs the audit after DOM changes.

**Example:**

```javascript
// Make DOM changes
document.querySelector('img').setAttribute('alt', 'Fixed');

// Re-run audit
__WAH_RERUN__()
```

---

## Types

### `AuditIssue`

Single audit issue found.

```typescript
interface AuditIssue {
    rule: string;              // "ACC-02", "SEO-01", etc.
    message: string;           // "Image missing alt"
    severity: Severity;        // "critical" | "warning" | "recommendation"
    category?: IssueCategory;  // "accessibility", "seo", etc.
    selector?: string;         // CSS selector: "html > body > img:nth-of-type(1)"
    element?: HTMLElement;     // Reference to DOM element
}
```

### `AuditResult`

Complete audit result.

```typescript
interface AuditResult {
    issues: AuditIssue[];      // All issues found
    score: number;             // 0-100 overall score
}
```

### `WAHConfig`

Configuration options passed to `runWAH()`.

```typescript
interface WAHConfig {
    // Console logging
    logs?: boolean;                    // Enable/disable logging
    logLevel?: 'full' | 'summary' | 'none';  // Console verbosity
    
    // Issue filtering
    issueLevel?: 'critical' | 'warnings' | 'all';
    
    // Accessibility settings
    accessibility?: {
        minFontSize?: number;            // Minimum font size (default: 12)
        contrastLevel?: 'AA' | 'AAA';    // WCAG level (default: 'AA')
        minContrastRatio?: number;       // Custom contrast ratio
        minLineHeight?: number;          // Minimum line height (default: 1.4)
    };
    
    // Overlay UI
    overlay?: {
        enabled?: boolean;               // Show overlay (default: true)
        position?: string;               // Position on screen
        hide?: number;                   // Hide duration in ms
    };
    
    // Quality settings
    quality?: {
        inlineStylesThreshold?: number;  // Warn threshold (default: 10)
    };
}
```

### `Severity`

Issue severity level.

```typescript
type Severity = 'critical' | 'warning' | 'recommendation';
```

### `IssueCategory`

Category of audit issue.

```typescript
type IssueCategory = 
    | 'accessibility'
    | 'semantic'
    | 'seo'
    | 'responsive'
    | 'security'
    | 'quality'
    | 'performance'
    | 'form';
```

### `LogLevel`

Console output verbosity.

```typescript
type LogLevel = 'full' | 'summary' | 'none';
```

### `ScoringMode`

Scoring calculation mode.

```typescript
type ScoringMode = 'strict' | 'normal' | 'moderate' | 'soft' | 'custom';
```

---

## Usage Examples

### Default Configuration

```javascript
import { runWAH } from 'web-audit-helper';

// Runs with default settings
await runWAH();
```

### Custom Configuration

```javascript
import { runWAH } from 'web-audit-helper';

const result = await runWAH({
    logs: true,
    logLevel: 'full',
    issueLevel: 'all',
    accessibility: {
        minFontSize: 14,
        contrastLevel: 'AAA'
    },
    overlay: {
        enabled: true,
        position: 'top-right',
        hide: 0
    }
});
```

### Accessing Results

```javascript
const result = await runWAH();

// Overall score
console.log(`Score: ${result.score}%`);

// Total issues
console.log(`Issues: ${result.issues.length}`);

// Critical issues only
const criticalIssues = result.issues.filter(i => i.severity === 'critical');
console.log(`Critical: ${criticalIssues.length}`);

// By category
const accessibilityIssues = result.issues.filter(i => i.category === 'accessibility');
console.log(`Accessibility issues: ${accessibilityIssues.length}`);
```

### Conditional Logic

```javascript
const result = await runWAH();

if (result.score < 50) {
    console.error('Critical quality issues detected!');
    // Fail CI/CD
    process.exit(1);
} else if (result.score < 70) {
    console.warn('Quality issues need attention');
} else {
    console.log('Good score!');
}
```

### CI/CD Integration

```javascript
import { runWAH } from 'web-audit-helper';

async function auditPage() {
    const result = await runWAH({
        logs: false,           // No console noise
        logLevel: 'none',
        issueLevel: 'critical', // Only critical issues
        overlay: {
        enabled: false      // No UI in CI
        }
    });

    // Report
    console.log(`Audit Score: ${result.score}%`);
    
    // Fail if too many critical issues
    const criticalCount = result.issues.filter(i => i.severity === 'critical').length;
    if (criticalCount > 5) {
        throw new Error(`Too many critical issues: ${criticalCount}`);
    }
}

await auditPage();
```

### Programmatic Score Calculation

```javascript
const result = await runWAH();

// Build custom report
const report = {
    score: result.score,
    timestamp: new Date(),
    issues: result.issues,
    summary: {
        critical: result.issues.filter(i => i.severity === 'critical').length,
        warnings: result.issues.filter(i => i.severity === 'warning').length,
        recommendations: result.issues.filter(i => i.severity === 'recommendation').length
    }
};

// Save to database
await saveAuditReport(report);
```

### Environment-Based Configuration

```javascript
const isDev = process.env.NODE_ENV === 'development';

await runWAH({
    logs: isDev,
    logLevel: isDev ? 'full' : 'none',
    overlay: {
        enabled: isDev,
        position: 'bottom-right'
    }
});
```

---

## Not Currently Exposed

The following are internal implementation details and not part of the public API:

- Individual rule functions (`checkMissingAlt`, etc.)
- Scoring calculation functions
- Overlay component internals
- Report serialization functions
- Local storage/state management

Use only the documented public API for stability across versions.

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires ES2019 support (native async/await, Promise, etc.)

---

## Error Handling

WAH doesn't throw errors during normal operation. Issues are captured as `AuditIssue` objects in the result.

```javascript
try {
    const result = await runWAH();
    // Handle result
    } catch (error) {
    // Handle unexpected errors (should be rare)
    console.error('WAH encountered an error:', error);
}
```

---

## Versioning

WAH follows semantic versioning:

- **MAJOR**: Breaking API changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

The public API documented here is stable within MAJOR versions.
