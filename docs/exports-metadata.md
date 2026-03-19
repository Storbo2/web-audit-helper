# Exports and Metadata

WAH supports JSON, TXT, and HTML export formats.

## Export Formats

- JSON: machine-readable and automation-friendly
- TXT: quick human-readable snapshot
- HTML: visual report with grouped sections and run comparison summary

## Metadata (v1.5.0)

External and embedded runs can include:

- `runId`
- `targetUrl` (with sensitive query redaction)
- `executedAt`
- `runtimeMode` (`embedded` or `external`)
- `wahVersion`
- `issueCountBySeverity`
- `categoryScores`
- `rulesExecuted`
- `rulesSkipped`
- `totalAuditMs`

## Run Comparison

When a previous run is provided, JSON/HTML comparison can include:

- overall score delta
- severity deltas (`critical`, `warning`, `recommendation`)
- added/removed `ruleId`
- category score deltas
- optional timing delta (when metrics exist)

## Practical Validation

For external runs, verify at minimum:

1. `meta.runtimeMode = external`
2. run identity fields exist (`runId`, `executedAt`)
3. `targetUrl` exists and is redacted when needed
4. comparison block appears on second export

## Related Docs

- [External Auditing Guide](external-auditing.md)
- [External Auditing QA Checklist](external-auditing-qa.md)
- [Configuration](configuration.md)
