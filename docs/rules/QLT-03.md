# QLT-03 - Consecutive duplicate controls

Category
Quality

Severity
Recommendation

Type
heuristic

## Problem

Two adjacent interactive controls expose the same visible label and the same action, creating unnecessary duplication in the interface.

## Why it matters

Duplicate controls increase scanning effort, add UX noise, and can make users wonder whether the repeated controls behave differently.

## How to fix

Keep a single control for a single action unless duplicated controls are intentionally required for different UI contexts.

## Bad example

```html
<a href="/pricing">View pricing</a>
<a href="/pricing">View pricing</a>
```

## Good example

```html
<a href="/pricing">View pricing</a>
```

## Notes

- This rule excludes common grouped UI patterns such as pagination and tablists.
- Dummy links like `href="#"` remain covered by `QLT-02` and are not reported again by this rule.

## References

NN/g - Repetition and redundancy in interface design
<https://www.nngroup.com/articles/>
