import { RULE_IDS } from "../../ruleIds";
import type { RegisteredRuleMetadataOverride } from "../types";

export const formMetadataOverrides: Record<string, RegisteredRuleMetadataOverride> = {
    [RULE_IDS.form.submitButtonOutsideForm]: {
        defaultSeverity: "warning",
        title: "Submit button outside form",
        fix: "Place submit controls inside the target form or bind them with the form attribute.",
        docsSlug: "FORM-01",
        standardType: "html-spec",
        standardLabel: "HTML spec - form submission"
    },
    [RULE_IDS.form.requiredWithoutIndicator]: {
        defaultSeverity: "recommendation",
        title: "Required field without visual indicator",
        fix: "Mark required fields clearly in labels or helper text.",
        docsSlug: "FORM-02",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 3.3.2 Labels or Instructions"
    },
    [RULE_IDS.form.emailTelWithoutType]: {
        defaultSeverity: "recommendation",
        title: "Email/tel input without proper type",
        fix: "Use input types that match user data (for example, email and tel).",
        docsSlug: "FORM-03",
        standardType: "html-spec",
        standardLabel: "HTML spec - input types"
    },
    [RULE_IDS.form.missingAutocomplete]: {
        defaultSeverity: "recommendation",
        title: "Autocomplete attribute missing",
        fix: "Set autocomplete attributes for common personal and contact fields.",
        docsSlug: "FORM-04",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 1.3.5 Identify Input Purpose"
    }
};