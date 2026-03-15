# Contributing Guide

This guide defines how to add or update audit rules and related documentation in WAH.

## Scope

Use this guide when you:

- Add a new rule
- Change existing rule logic or severity
- Update educational documentation for a rule
- Update "Learn more" integration metadata

## Rule Authoring Checklist

For every rule change, complete all items:

1. Rule implementation exists and returns stable `rule` ID, severity, and message.
2. Rule ID is registered in `RULE_IDS` and the category registry.
3. Rule fix text exists in `RULE_FIXES`.
4. Rule docs page exists in `docs/rules/{RULE-ID}.md`.
5. Rule is mapped in `RULE_DOCS_SLUG`.
6. Rule metadata is consistent:
   - `RULE_DESCRIPTIONS`
   - `RULE_WHY`
   - `RULE_STANDARD_TYPE`
   - `RULE_STANDARD_LABEL`
7. Unit tests are updated or added.
8. Build and targeted tests pass.

## Documentation Template (Required)

Each rule page must use this structure:

- Problem
- Why it matters
- How to fix
- Bad example
- Good example
- References

Keep it concise and actionable.

## Standard vs Heuristic

Mark rule guidance accurately:

- `standard`: backed by WCAG, HTML spec, OWASP, web.dev, etc.
- `heuristic`: best practice without strict normative requirement.

Do not present heuristic guidance as mandatory standard compliance.

## Linking and Learn More

When a rule page is added:

1. Add/confirm `docs/rules/{RULE-ID}.md`.
2. Add/confirm `RULE_DOCS_SLUG[{RULE-ID}] = "{RULE-ID}"`.
3. Verify output in:
   - HTML report Learn more
   - Console issue detail Learn more
   - Overlay context menu Learn more

## Style and Consistency

Keep wording consistent between:

- Rule docs page
- Constants metadata
- Overlay/report user-facing text

Preferred style:

- Short sentences
- Concrete fixes
- One minimal bad example and one minimal good example

## Validation Commands

Run before PR/commit:

```bash
npm run build
npm test -- --run src/reporters/builder.test.ts src/reporters/serializers/serializers.test.ts src/overlay/interactions/highlight.test.ts
```

Run broader tests when rule logic changed:

```bash
npm test
```

## Pull Request Expectations

Include in the PR description:

- Rule IDs affected
- Whether change is standard or heuristic
- Docs pages added/updated
- Tests added/updated
- Any user-visible behavior change in overlay/report/console
