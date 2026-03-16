import { RULE_IDS } from "../../ruleIds";
import type { RegisteredRuleMetadataOverride } from "../types";

export const securityMetadataOverrides: Record<string, RegisteredRuleMetadataOverride> = {
    [RULE_IDS.security.targetBlankWithoutNoopener]: {
        defaultSeverity: "warning",
        title: "target=_blank without noopener/noreferrer",
        fix: "Add rel=\"noopener noreferrer\" to links that use target=\"_blank\".",
        docsSlug: "SEC-01",
        standardType: "owasp",
        standardLabel: "OWASP - Reverse tabnabbing"
    },
};