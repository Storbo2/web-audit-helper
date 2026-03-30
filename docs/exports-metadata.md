# Exports and Metadata

WAH supports JSON, TXT, and HTML export formats.

## Export Formats

- JSON: machine-readable and automation-friendly
- TXT: quick human-readable snapshot
- HTML: visual report with grouped sections and run comparison summary

## Metadata (v1.5.0)

External, embedded, and headless runs can include:

- `contractVersion` (report JSON contract version)
- `runId`
- `targetUrl` (with sensitive query redaction)
- `executedAt`
- `runtimeMode` (`embedded`, `external`, or `headless`)
- `wahVersion`
- `issueCountBySeverity`
- `categoryScores`
- `rulesExecuted`
- `rulesSkipped`
- `totalAuditMs`

## Stable JSON Contract (v2.0 Phase 1)

Canonical schema (source of truth):

- [audit-report-contract.v1.0.0.schema.json](contracts/audit-report-contract.v1.0.0.schema.json)

Minimal required top-level fields:

- `meta`
- `score`
- `categories`
- `stats`

Minimal required `meta` fields:

- `contractVersion` (currently `1.0.0`)
- `runId`
- `targetUrl`
- `executedAt`
- `runtimeMode`
- `wahVersion`
- `issueCountBySeverity`
- `categoryScores`
- `rulesExecuted`
- `rulesSkipped`
- `totalAuditMs`

Example excerpt:

```json
{
  "meta": {
    "contractVersion": "1.0.0",
    "runId": "5ccffee10-cd5d-45f5-9c83-4cedf89c00e8",
    "targetUrl": "https://example.com/page",
    "executedAt": "2026-03-26T04:16:27.916Z",
    "runtimeMode": "external",
    "wahVersion": "1.5.3",
    "issueCountBySeverity": {
      "critical": 11,
      "warning": 26,
      "recommendation": 26
    },
    "categoryScores": {
      "accessibility": 0,
      "semantic": 68
    },
    "rulesExecuted": 77,
    "rulesSkipped": 0,
    "totalAuditMs": 0
  }
}
```

## Contract Compatibility Policy

- Patch (`x.y.z`): bug fixes only, no breaking contract changes.
- Minor (`x.y.0`): additive fields only, existing required fields keep meaning and type.
- Major (`x.0.0`): breaking changes allowed (rename/remove/type changes, required set changes).

Consumer guidance:

- Validate `meta.contractVersion` before processing reports.
- Ignore unknown extra fields to remain forward-compatible.
- Fail fast when required fields are missing.

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

For CLI headless runs, verify at minimum:

1. `meta.runtimeMode = headless`
2. `meta.contractVersion` is present
3. output serialization is valid in requested format (`json` / `html` / `txt`)
4. expected output file exists (recommended path during local validation: `dist/out/*`)

## Related Docs

- [External Auditing Guide](external-auditing.md)
- [External Auditing QA Checklist](external-auditing-qa.md)
- [Configuration](configuration.md)
