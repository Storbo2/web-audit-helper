import type { EnrichedRegisteredRule, RegisteredRule } from "./types";
import { enrichRegisteredRule } from "./types";
import { accessibilityRules } from "./accessibility";
import { semanticRules } from "./semantic";
import { seoRules } from "./seo";
import { responsiveRules } from "./responsive";
import { securityRules } from "./security";
import { qualityRules } from "./quality";
import { performanceRules } from "./performance";
import { formRules } from "./form";
import { REGISTRY_METADATA_OVERRIDES } from "./metadata";
import { assertRegistryContracts } from "./validation";

export type { EnrichedRegisteredRule, RegisteredRule, RegisteredRuleMetadata } from "./types";
export { assertRegistryContracts, validateRegistryContracts } from "./validation";

function enrichRules(category: EnrichedRegisteredRule["category"], rules: RegisteredRule[]): EnrichedRegisteredRule[] {
    return rules.map((rule) => enrichRegisteredRule(rule, category, REGISTRY_METADATA_OVERRIDES[rule.id]));
}

const ENRICHED_CORE_RULES_REGISTRY: EnrichedRegisteredRule[] = [
    ...enrichRules("accessibility", accessibilityRules),
    ...enrichRules("semantic", semanticRules),
    ...enrichRules("seo", seoRules),
    ...enrichRules("responsive", responsiveRules),
    ...enrichRules("security", securityRules),
    ...enrichRules("quality", qualityRules),
    ...enrichRules("performance", performanceRules),
    ...enrichRules("form", formRules)
];

assertRegistryContracts(ENRICHED_CORE_RULES_REGISTRY);

export const CORE_RULES_REGISTRY: RegisteredRule[] = ENRICHED_CORE_RULES_REGISTRY;

const RULE_REGISTRY_MAP = new Map(ENRICHED_CORE_RULES_REGISTRY.map((rule) => [rule.id, rule]));

export function getRegisteredRuleById(ruleId: string): EnrichedRegisteredRule | undefined {
    return RULE_REGISTRY_MAP.get(ruleId);
}