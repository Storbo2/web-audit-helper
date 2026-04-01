import { RULE_DEFINITIONS } from "./rule-definitions";

export const RULE_TOKENS_COMPACT: Record<string, string> = Object.fromEntries(
    Object.entries(RULE_DEFINITIONS).flatMap(([ruleId, definition]) =>
        definition.token === undefined ? [] : [[ruleId, definition.token]]
    )
);