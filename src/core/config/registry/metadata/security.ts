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
    [RULE_IDS.security.mixedContent]: {
        defaultSeverity: "warning",
        title: "Mixed content over HTTP in HTTPS page",
        fix: "Load embedded resources over HTTPS to avoid browser blocking and security downgrade.",
        docsSlug: "SEC-03",
        standardType: "owasp",
        standardLabel: "OWASP - Transport layer protection"
    },
};