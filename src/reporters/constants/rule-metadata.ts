import { RULE_DEFINITIONS, type RuleDefinition, type RuleStandardType } from "./rule-definitions";

function toOptionalFieldMap<T>(pick: (definition: RuleDefinition) => T | undefined): Partial<Record<string, T>> {
    return Object.fromEntries(
        Object.entries(RULE_DEFINITIONS).flatMap(([ruleId, definition]) => {
            const value = pick(definition);
            return value === undefined ? [] : [[ruleId, value]];
        })
    );
}

export const RULE_DESCRIPTIONS: Partial<Record<string, string>> = toOptionalFieldMap((definition) => definition.description);

export const RULE_WHY: Partial<Record<string, string>> = toOptionalFieldMap((definition) => definition.why);

export const RULE_STANDARD_TYPE: Partial<Record<string, RuleStandardType>> = toOptionalFieldMap((definition) => definition.standardType);

export const RULE_STANDARD_LABEL: Partial<Record<string, string>> = toOptionalFieldMap((definition) => definition.standardLabel);

export const RULE_DOCS_SLUG: Partial<Record<string, string>> = toOptionalFieldMap((definition) => definition.docsSlug);