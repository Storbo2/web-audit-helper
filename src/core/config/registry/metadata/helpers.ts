import type {
    RegisteredRuleMetadataOverride,
    RuleStandardType,
} from "../types";
import type { Severity } from "../../../types";

export interface MetadataOverrideDefinition {
    defaultSeverity: Severity;
    title: string;
    fix: string;
    standardType: RuleStandardType;
    standardLabel: string;
    docsSlug?: string;
}

export function defineMetadataOverride(
    ruleId: string,
    definition: MetadataOverrideDefinition
): RegisteredRuleMetadataOverride {
    return {
        ...definition,
        docsSlug: definition.docsSlug ?? ruleId,
    };
}

export function defineMetadataOverrides(
    entries: Array<[string, MetadataOverrideDefinition]>
): Record<string, RegisteredRuleMetadataOverride> {
    return Object.fromEntries(
        entries.map(([ruleId, definition]) => [ruleId, defineMetadataOverride(ruleId, definition)])
    ) as Record<string, RegisteredRuleMetadataOverride>;
}