import type { EnrichedRegisteredRule, ExtendRuleRegistryOptions, RegisteredRule, RulePlugin } from "./types";
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

export type {
    EnrichedRegisteredRule,
    ExtendRuleRegistryOptions,
    RegisteredRule,
    RegisteredRuleMetadata,
    RulePlugin
} from "./types";
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

function cloneRegistryEntry(rule: EnrichedRegisteredRule): EnrichedRegisteredRule {
    return { ...rule };
}

function isEnrichedRegisteredRule(rule: RegisteredRule | EnrichedRegisteredRule): rule is EnrichedRegisteredRule {
    return "category" in rule
        && "defaultSeverity" in rule
        && "title" in rule
        && "fix" in rule
        && "docsSlug" in rule
        && "standardType" in rule
        && "standardLabel" in rule;
}

function flattenPluginRules(plugins: ReadonlyArray<RulePlugin>): EnrichedRegisteredRule[] {
    return plugins.flatMap((plugin) => plugin.rules.map((rule) => ({ ...rule })));
}

export function createRuleRegistry(rules: ReadonlyArray<EnrichedRegisteredRule>): EnrichedRegisteredRule[] {
    const nextRegistry = rules.map(cloneRegistryEntry);
    assertRegistryContracts(nextRegistry);
    return nextRegistry;
}

export function createCoreRuleRegistry(): EnrichedRegisteredRule[] {
    return createRuleRegistry(ENRICHED_CORE_RULES_REGISTRY);
}

export function createRulePlugin(plugin: RulePlugin): RulePlugin {
    return {
        ...plugin,
        rules: createRuleRegistry(plugin.rules)
    };
}

export function extendRuleRegistry(
    baseRegistry: ReadonlyArray<EnrichedRegisteredRule> = ENRICHED_CORE_RULES_REGISTRY,
    options: ExtendRuleRegistryOptions = {}
): EnrichedRegisteredRule[] {
    const appendedRules = options.rules ? options.rules.map(cloneRegistryEntry) : [];
    const pluginRules = options.plugins ? flattenPluginRules(options.plugins) : [];

    return createRuleRegistry([
        ...baseRegistry.map(cloneRegistryEntry),
        ...appendedRules,
        ...pluginRules
    ]);
}

export function getRegisteredRuleById(
    ruleId: string,
    registry: ReadonlyArray<RegisteredRule | EnrichedRegisteredRule> = CORE_RULES_REGISTRY
): EnrichedRegisteredRule | undefined {
    if (registry === CORE_RULES_REGISTRY) {
        return RULE_REGISTRY_MAP.get(ruleId);
    }

    const rule = registry.find((candidate) => candidate.id === ruleId);
    return rule && isEnrichedRegisteredRule(rule) ? rule : undefined;
}