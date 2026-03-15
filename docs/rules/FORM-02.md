# FORM-02 - Required without indicator

Category
Forms

Severity
Recommendation

Type
heuristic

## Problem

A required field is not clearly marked as required in its visible label.

## Why it matters

Users may submit incomplete forms or face avoidable validation errors when requirements are not explicit.

## How to fix

Add a clear required indicator in the label, such as `*` or `(required)`.

## Bad example

```html
<label for="name">Name</label>
<input id="name" required>
```

## Good example

```html
<label for="name">Name (required)</label>
<input id="name" required>
```

## References

Heuristic - form clarity best practice
<https://www.nngroup.com/articles/web-form-design/>
