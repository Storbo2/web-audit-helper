import { RULE_DEFINITIONS } from "./rule-definitions";

export const RULE_FIXES: Record<string, string> = Object.fromEntries(
    Object.entries(RULE_DEFINITIONS).flatMap(([ruleId, definition]) =>
        definition.fix === undefined ? [] : [[ruleId, definition.fix]]
    )
);