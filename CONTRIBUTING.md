# Contributing to WAH

Thank you for your interest in contributing to Web Audit Helper! We welcome contributions in any form.

## Code of Conduct

Be respectful and constructive in all interactions.

## How to Contribute

### Reporting Issues

1. **Search existing issues** to avoid duplicates
2. **Include reproducible example** (simplified HTML test case)
3. **Specify your environment**: Browser, Node.js version, WAH version
4. **Describe expected vs actual behavior**

Example:
```
Title: ACC-02 rule incorrectly flags images with empty alt=""

Browser: Chrome 120
WAH Version: 1.0.0

Description:
The ACC-02 rule flags images with alt="" as missing alt, but alt="" is valid for decorative images.

Test Case:
<img src="decoration.png" alt="">

Expected: No issue (decorative image)
Actual: ACC-02 critical issue reported
```

### Submitting Pull Requests

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature`
3. **Make your changes** following code style guidelines
4. **Test your changes**: `npm run typecheck && npm run build`
5. **Add tests** if applicable (in `src/**/__tests__/`)
6. **Commit with clear messages**: `git commit -m "Add: New rule description"`
7. **Push to your fork** and create a Pull Request

### Adding New Rules

#### 1. Create Rule Function

```typescript
// src/core/rules/accessibility/yourRuleFile.ts
import type { AuditIssue } from "../../types";
import { getCssSelector } from "../../../utils/dom";
import { RULE_IDS } from "../../config/ruleIds";

export function checkYourRule(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    // Your rule logic here
    document.querySelectorAll("element").forEach((element) => {
        if (/* issue detected */) {
            issues.push({
                rule: RULE_IDS.accessibility.yourRule,  // Define this next
                message: "Human-readable issue message",
                severity: "critical",  // critical | warning | recommendation
                category: "accessibility",
                element: element as HTMLElement,
                selector: getCssSelector(element)
            });
        }
    });

    return issues;
}
```

#### 2. Register Rule ID

```typescript
// src/core/config/ruleIds.ts
export const RULE_IDS = {
    accessibility: {
        // ... existing rules
        yourRule: "ACC-XX",  // Next available ID
    }
};
```

#### 3. Add Token (Compact representation)

```typescript
// src/reporters/constants.ts
export const RULE_TOKENS_COMPACT: Record<string, string> = {
    // ... existing tokens
    "ACC-XX": "your:rule token",  // Compact description
};
```

#### 4. Add Fix Message

```typescript
// src/reporters/constants.ts
export const RULE_FIXES: Record<string, string> = {
    // ... existing fixes
    "ACC-XX": "Detailed action to fix this issue.",
};
```

#### 5. Register in Main Registry

```typescript
// src/core/rules/accessibility/index.ts
export { checkYourRule } from "./yourRuleFile";

// src/core/config/registry.ts
const rules = [
    // ... existing rules
    checkYourRule,
];
```

#### 6. Add Tests

```typescript
// src/core/rules/accessibility/__tests__/yourRule.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { checkYourRule } from '../yourRuleFile';

describe('ACC-XX: Your rule', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('should detect issue when condition is met', () => {
        document.body.innerHTML = '<element>bad</element>';
        const issues = checkYourRule();
        expect(issues).toHaveLength(1);
        expect(issues[0].rule).toBe('ACC-XX');
    });

    it('should pass when condition is not met', () => {
        document.body.innerHTML = '<element good>text</element>';
        const issues = checkYourRule();
        expect(issues).toHaveLength(0);
    });
});
```

#### 7. Update Documentation

- Link rule in `docs/rules.md`
- Update `planes.txt` with rule status
- Add entry to `CHANGELOG.md` if applicable

### Code Style

- **Language**: TypeScript with strict mode
- **Format**: Prettier (run `npm run build`)
- **Naming**: camelCase for functions/variables, PascalCase for types
- **Comments**: JSDoc for public APIs

Example:
```typescript
/**
 * Checks for missing alt text on images
 * @returns Array of issues found
 */
export function checkMissingAlt(): AuditIssue[] {
    // ...
}
```

### Testing

```bash
npm run test        # Run once
npm run test:watch  # Watch mode
npm run test:ui     # Interactive UI
```

Tests should:
- Use descriptive names
- Test both positive and negative cases
- Be isolated and not depend on DOM state
- Use proper setup/teardown

### Commit Messages

Use clear, conventional commits:

```
Add: Implement new ACC-XX rule for validation
Fix: Correct false positive in existing rule
Docs: Update README with configuration example
Test: Add tests for rule validation
Refactor: Simplify scoring calculation logic
Build: Update dependency versions
```

### Release Process

Maintainers follow semantic versioning:

- **MAJOR** (X.0.0): Breaking API changes
- **MINOR** (_.X.0): New features, backward compatible
- **PATCH** (_._.X): Bug fixes only

---

## Development Setup

```bash
# Install dependencies
npm install

# Type checking
npm run typecheck

# Build
npm run build

# Tests
npm run test
npm run test:watch
npm run test:ui

# Full CI simulation
npm run typecheck && npm run build && npm run test
```

## Project Structure

```
src/
├── core/              # Audit engine
│   ├── rules/        # All 61 audit rules
│   ├── config/       # Rule registry and IDs
│   └── scoring.ts    # Scoring algorithm
├── overlay/          # UI components
├── reporters/        # Export formats (JSON, TXT, HTML)
└── utils/           # Shared utilities
```

## Questions?

- 📖 See [docs/](docs/) for detailed guides
- 📝 Check [README.md](README.md) for API reference
- 💬 Open an issue to discuss ideas

---

Thank you for contributing to making the web more accessible and better quality! 🙏