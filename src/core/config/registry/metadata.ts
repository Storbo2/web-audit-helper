import type { RegisteredRuleMetadataOverride } from "./types";
import { accessibilityMetadataOverrides } from "./metadata/accessibility";
import { seoMetadataOverrides } from "./metadata/seo";
import { securityMetadataOverrides } from "./metadata/security";
import { semanticMetadataOverrides } from "./metadata/semantic";
import { responsiveMetadataOverrides } from "./metadata/responsive";
import { qualityMetadataOverrides } from "./metadata/quality";
import { performanceMetadataOverrides } from "./metadata/performance";
import { formMetadataOverrides } from "./metadata/form";

export const REGISTRY_METADATA_OVERRIDES: Record<string, RegisteredRuleMetadataOverride> = {
    ...accessibilityMetadataOverrides,
    ...seoMetadataOverrides,
    ...securityMetadataOverrides,
    ...semanticMetadataOverrides,
    ...responsiveMetadataOverrides,
    ...qualityMetadataOverrides,
    ...performanceMetadataOverrides,
    ...formMetadataOverrides
};

export function hasRegistryMetadataOverride(ruleId: string): boolean {
    return !!REGISTRY_METADATA_OVERRIDES[ruleId];
}