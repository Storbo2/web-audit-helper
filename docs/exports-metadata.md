# Exports and Metadata

WAH supports JSON, TXT, and HTML export formats.

## Export Formats

- JSON: machine-readable and automation-friendly
- TXT: quick human-readable snapshot
- HTML: visual report with grouped sections and run comparison summary

## Metadata (v2.0.0)

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
    "wahVersion": "2.0.0",
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

## CI Output Contracts (v2.0 Phase 4)

WAH now exposes dedicated CI-oriented outputs from the CLI when `--compare-with` is provided:

- `--comparison-ci-json-output <file>`
- `--comparison-summary-output <file>`
- `--github-actions-summary-output <file>`
- `--gitlab-summary-output <file>`

Recommended consumer policy:

- Prefer `--comparison-ci-json-output` for machine parsing in CI.
- Treat Markdown outputs as human-readable summaries for job/step summaries and merge request comments.
- Do not parse Markdown line-by-line as a strict API contract.

### Compact CI JSON Schema

Current schema version:

- `schemaVersion = 1.0.0`

Current top-level fields:

- `schemaVersion`
- `status`
- `baseline`
- `delta`
- `rules`
- `gate`

Example:

```json
{
  "schemaVersion": "1.0.0",
  "status": "pass",
  "baseline": {
    "runId": "62b165d5-dffd-44dc-8e1a-c70b804a6b22",
    "executedAt": "2026-04-01T04:22:02.493Z",
    "targetUrl": "file:///C:/repo/examples/issues-detection-test.html"
  },
  "delta": {
    "overallScore": 0,
    "critical": 0,
    "warning": 0,
    "recommendation": 0
  },
  "rules": {
    "added": [],
    "removed": []
  },
  "gate": {
    "passed": true,
    "reasons": []
  }
}
```

Compatibility policy for CI outputs:

- Patch (`x.y.z`): formatting fixes only, no breaking field removals or meaning changes.
- Minor (`x.y.0`): additive fields allowed, existing fields keep same meaning/type.
- Major (`x.0.0`): breaking CI contract changes allowed.

Markdown output compatibility policy:

- Flag names are stable within major versions.
- Section headings and intent stay stable.
- Exact line formatting may evolve between minor versions.

Consumer guidance for CI:

- Validate `schemaVersion` before parsing compact JSON.
- Ignore unknown extra JSON fields.
- Use Markdown outputs only for display, not strict automation logic.

## CI Integration Snippets

GitHub Actions pattern:

```yaml
- name: Build WAH
  run: npm run build

- name: Baseline + comparison
  run: |
    node dist/wah-cli.mjs examples/issues-detection-test.html --format json --output dist/out/baseline.json
    node dist/wah-cli.mjs examples/issues-detection-test.html --format json --compare-with dist/out/baseline.json --github-actions-summary-output dist/out/gha-summary.md --comparison-ci-json-output dist/out/comparison-ci.json --output dist/out/compare.json

- name: Publish step summary
  shell: bash
  run: cat dist/out/gha-summary.md >> "$GITHUB_STEP_SUMMARY"
```

GitLab CI pattern:

```yaml
wah_audit:
  script:
    - npm run build
    - node dist/wah-cli.mjs examples/issues-detection-test.html --format json --output dist/out/baseline.json
    - node dist/wah-cli.mjs examples/issues-detection-test.html --format json --compare-with dist/out/baseline.json --gitlab-summary-output dist/out/gitlab-summary.md --comparison-ci-json-output dist/out/comparison-ci.json --output dist/out/compare.json
  artifacts:
    when: always
    paths:
      - dist/out/compare.json
      - dist/out/comparison-ci.json
      - dist/out/gitlab-summary.md
```

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
