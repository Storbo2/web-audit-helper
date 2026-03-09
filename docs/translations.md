# Translations Guide

This project currently ships with two built-in locales:
- `en`
- `es`

## What is translated

- User-facing messages
- Overlay UI
- Console output
- TXT/HTML reports
- Documentation (English + Spanish)

## What is not translated

- Rule IDs (`ACC-22`, `SEO-01`, etc.)
- Internal keys/config/code identifiers
- JSON report schema/content labels used for machine integrations

## Community translation model

The repository includes a contribution-friendly `locales/` structure:

```text
locales/
  en/
    common.json
  es/
    common.json
```

Additional languages (for example `pt`, `zh`) can be proposed via PR.

Runtime now reads locale payloads directly from JSON:

- `locales/en/common.json`
- `locales/es/common.json`

Each payload includes:

- `dictionary`: UI/console/report strings
- `ruleLabels`: friendly rule names by ID
- `ruleFixes`: localized fix messages by rule ID
- `issueMessages.exact` + `issueMessages.patterns`: localized issue text mappings

## Contribution checklist

1. Keep rule IDs and internal keys untouched.
2. Translate only user-facing text.
3. Preserve placeholders (examples: `{count}`, `{score}`, `{minutes}`).
4. Keep technical terms consistent across overlay, console and docs.
5. Add tests or snapshots when behavior changes.

## PR recommendation

When proposing a new language:

1. Add `locales/<lang>/common.json` based on existing locale schema.
2. Register new locale support in `src/core/types.ts` and `src/utils/i18n.ts`.
3. Add docs in `docs/<lang>/`.
4. Verify `npm run typecheck && npm run build && npm run test`.