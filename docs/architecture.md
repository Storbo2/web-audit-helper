# Architecture Guide

Overview of WAH's system design and module organization.

## System Architecture

```
┌─────────────────────────────────┐
│     Browser Environment         │
│  (DOM, CSS, JavaScript APIs)    │
└────────────┬────────────────────┘
             │
     ┌───────┴────────┐
     │   WAH Core     │
     └───────┬────────┘
             │
    ┌────────┴─────────┐
    │                  │
    ▼                  ▼
┌──────────────┐  ┌──────────────┐
│ Rules Engine │  │ Scoring      │
│   (60+ rules) │  │ Engine       │
└──────┬───────┘  └──────┬───────┘
       │                 │
       └────────┬────────┘
                │
        ┌───────▼────────┐
        │ AuditResult    │
        │ (issues list + │
        │ score/grade)   │
        └───────┬────────┘
                │
    ┌───────────┴───────────┐
    │                       │
    ▼                       ▼
┌─────────────┐      ┌──────────────┐
│  Overlay UI │      │  Reporters   │
│ (drag, hide)│      │ (JSON/TXT/   │
└─────────────┘      │  HTML)       │
                     └──────────────┘
```

## Module Organization

### Core Module (`src/core/`)

**Responsibility**: Audit engine logic

**Structure**:
```
src/core/
├── index.ts           # Main runCoreAudit() export
├── types.ts          # Type definitions (IssueCategory, Severity, etc.)
├── scoring.ts        # Scoring calculation algorithm
├── config/
│   ├── registry.ts   # Rule registry - aggregates all rules
│   └── ruleIds.ts    # Rule ID constants (ACC-01, SEO-05, etc.)
└── rules/
    ├── index.ts      # Re-exports all rule functions
    ├── accessibility/  # 26 accessibility rules
    │   ├── aria.ts
    │   ├── buttons.ts
    │   ├── forms.ts
    │   ├── media.ts
    │   ├── text.ts
    │   └── ...
    ├── semantic.ts    # 7 semantic HTML rules
    ├── seo.ts         # 8 SEO rules
    ├── responsive.ts  # 5 responsive design rules
    ├── security.ts    # 1 security rule
    ├── quality.ts     # 2 quality rules
    ├── performance.ts # 10 performance rules
    └── form.ts        # 4 form rules
```

**Key Functions**:
- `runCoreAudit(config)`: Executes all rules, returns `AuditResult`
- `computeScore(issues)`: Calculates overall score based on severity and multipliers
- `computeCategoryScores(issues)`: Calculates per-category scores

### Overlay Module (`src/overlay/`)

**Responsibility**: Visual UI components and interaction logic

**Structure**:
```
src/overlay/
├── Overlay.ts        # Main overlay component lifecycle
├── config/
│   ├── settings.ts   # User settings state management
│   ├── hideStore.ts  # Hide settings (temporary/until-refresh)
│   └── settingsStore.ts  # Persistent sidebar settings
├── core/
│   ├── renderer.ts   # HTML generation for overlay elements
│   ├── template.ts   # HTML templates & structure
│   ├── utils.ts      # DOM utilities, selectors
│   ├── styles.ts     # CSS-in-JS styling
│   └── wahCss.ts     # WAH CSS stylesheet
├── interactions/
│   ├── drag.ts       # Drag & drop functionality
│   ├── highlight.ts  # Issue element highlighting
│   └── position.ts   # Overlay positioning logic
└── popover/
    ├── Popover.ts    # Popover main component
    ├── utils.ts      # Popover utilities
    └── components/
        ├── Filters.ts      # Severity/category filter UI
        ├── Settings.ts     # Config (font size, contrast) UI
        ├── UI.ts          # Display & scoring mode UI
        ├── Export.ts      # Report export UI
        └── index.ts
```

**Key Responsibilities**:
- Create floating overlay with score badge
- Manage issue list display and filtering
- Handle user interactions (drag, click, filters)
- Manage popover sub-panels
- Export reports in multiple formats
- Temporarily hide overlay

### Reporters Module (`src/reporters/`)

**Responsibility**: Generate and serialize audit reports

**Structure**:
```
src/reporters/
├── index.ts           # Main export
├── auditReport.ts     # Report building logic
├── builder.ts         # Helper functions for report objects
├── serializers.ts     # Serialize to JSON, TXT, HTML
├── utils.ts          # Formatting utilities
├── jsonReporter.ts   # JSON-specific logic
├── textReporter.ts   # TXT-specific logic
└── constants.ts      # Rule tokens, fixes, descriptions
```

**Key Functions**:
- `buildAuditReport(result)`: Creates structured report object
- `serializeReportToJSON(report)`: Exports as JSON
- `serializeReportToTXT(report)`: Exports as formatted text
- `serializeReportToHTML(report)`: Exports as styled HTML

**Report Format**:
```json
{
    "meta": {
        "url": "...",
        "date": "2026-03-01T...",
        "viewport": { "width": 1920, "height": 1080 },
        "scoringMode": "normal",
        "appliedFilters": { "severities": [...], "categories": [...] }
    },
    "score": {
        "overall": 75,
        "grade": "C",
        "byCategory": { "accessibility": 65, "seo": 80, ... }
    },
    "categories": [
        {
        "id": "accessibility",
        "title": "Accessibility",
        "score": 65,
        "rules": [
            {
            "id": "ACC-02",
            "title": "Image missing alt",
            "status": "critical",
            "message": "...",
            "fix": "...",
            "elements": [...]
            }
        ]
        }
    ],
    "stats": {
        "failed": 12,
        "warnings": 18,
        "recommendations": 5
    }
}
```

### Utils Module (`src/utils/`)

**Responsibility**: Shared utility functions

**Structure**:
```
src/utils/
├── dom.ts            # DOM helpers (getCssSelector, etc.)
└── consoleLogger.ts  # Console table formatting & logging
```

## Data Flow


### Rule Execution Flow

```
runCoreAudit()
  ├── Instantiate each rule checker
  │   (e.g., checkMissingAlt, checkMissingTitle, etc.)
  │
  ├── Collect all issues
  │   └── Each issue: { rule, message, severity, category, element, selector }
  │
  └── Return AuditResult
      ├── issues: AuditIssue[]
      └── score: number
```

### Scoring Flow

```
computeScore(issues)
  ├── filterIssuesForScoring()
  │   └── Apply custom filters if mode='custom'
  │
  ├── getAdjustedMultipliers()
  │   └── Returns severity weights (critical/warning/recommendation)
  │
  ├── computeCategoryScores()
  │   └── Calculate per-category scores
  │       └── For each category: 100 - (critical*mult + warning*mult + ...)
  │
  ├── computeWeightedOverall()
  │   └── Weighted average across categories
  │       └── Score = sum(categoryScore * categoryWeight) / totalWeight
  │
  └── Return: number (0-100)
```

### UI Rendering Flow

```
createOverlay()
  ├── Render overlay root
  ├── Display score badge
  ├── Create popover panels
  │   ├── Filters panel (severity/category toggles)
  │   ├── Settings panel (font size, contrast)
  │   ├── Export panel (JSON/TXT/HTML download)
  │   └── UI panel (scoring mode, hide)
  │
  ├── Render issue list
  │   └── Filterable by severity & category
  │
  ├── Attach event listeners
  │   ├── Drag overlay
  │   ├── Click to focus issue
  │   ├── Filter toggles
  │   └── Export buttons
  │
  └── Handle interactions
```

## Scoring Algorithm

### Per-Category Score Calculation

For each category:
```
1. Count critical, warning, recommendation issues
2. Apply multipliers (varies by mode)
3. categoryScore = max(0, 100 - (critical*20 + warning*8 + recommendation*4))
```

### Weighted Overall Score

```
Weights:
    accessibility: 0.25
    seo:          0.20
    responsive:   0.15
    semantic:     0.10
    security:     0.10
    quality:      0.10
    performance:  0.05
    form:         0.05

overallScore = sum(categoryScore * weight) / totalWeight
```

### Custom Filter Calibration

When 1 category is active, multipliers are divided by 4:
- critical: 20 → 5
- warning: 8 → 2
- recommendation: 4 → 1

This prevents scores from bottoming out with very restrictive filters.

## Type System

### Main Types

```typescript
// Issue definition
interface AuditIssue {
    rule: string;              // "ACC-02"
    message: string;           // Human readable
    severity: Severity;        // critical | warning | recommendation
    category?: IssueCategory;  // accessibility | seo | ...
    selector?: string;         // CSS selector for DOM targeting
    element?: HTMLElement;     // Reference to DOM element
}

// Audit result
interface AuditResult {
    issues: AuditIssue[];
    score: number;  // 0-100
}

// Configuration
interface WAHConfig {
    logs: boolean;
    logLevel: LogLevel;
    issueLevel: IssueLevel;
    accessibility: {
        minFontSize: number;
        contrastLevel: ContrastLevel;
    };
    overlay: {
        enabled: boolean;
        position: string;
        hide: number;
    };
    quality?: {
        inlineStylesThreshold?: number;
    };
}

// Report
interface AuditReport {
    meta: ReportMeta;
    score: ReportScore;
    categories: CategoryReport[];
    stats: AuditStats;
}
```

## Performance Considerations

### Optimization Strategies

1. **Rule Sampling**: Some rules sample elements (max 100 text elements for contrast checks)
2. **Lazy Rendering**: Issue list items render only when visible
3. **Event Delegation**: Use single listener for multiple elements
4. **DOM Caching**: Cache querySelector results within rule execution
5. **Debounced Scoring**: Recalculate score only on filter changes

### Bundle Size

- **Total**: ~108 KB (minified)
- **Core**: ~45 KB
- **Overlay**: ~35 KB
- **Reporters**: ~20 KB
- **Utils**: ~8 KB

### Browser Compatibility

- Modern browsers with ES2019 support
- Works with all DOM APIs (no shims needed)
- CSS Grid and Flexbox for overlay layout

## Extension Points

### Adding New Rules

See [CONTRIBUTING.md](../CONTRIBUTING.md) for detailed guide on adding rules.

### Custom Reporters

Extend `serializeReportToXYZ()` functions to create custom export formats.

### Custom Scoring

Modify `computeScore()` or `computeCategoryScores()` for different algorithms.

## State Management

### Local State

- **Overlay Settings**: Stored in `overlaySettingsStore` (in-memory)
- **Hide State**: Stored in `hideStore` (localStorage for persistence)
- **UI State**: Managed in Overlay component (current view, expanded panels)

### No External Dependencies

All state management is internal (no Redux, MobX, or other libraries).

## Testing Strategy

- **Unit Tests**: Rule logic (vitest)
- **Integration Tests**: Scoring calculation
- **Component Tests**: Overlay rendering and interactions
- **E2E Tests**: Full audit flow (future)

See `docs/testing.md` for testing guidelines.