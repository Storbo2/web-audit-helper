import type { AuditIssue } from "../../types";
import { getCssSelector } from "../../../utils/dom";
import { RULE_IDS } from "../../config/ruleIds";
import { shouldIgnore } from "../helpers";

export function checkEmailTelWithoutType(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("input[type='text']").forEach((input) => {
        if (shouldIgnore(input)) return;
        const name = (input.getAttribute("name") || "").toLowerCase();
        const id = (input.getAttribute("id") || "").toLowerCase();
        const placeholder = (input.getAttribute("placeholder") || "").toLowerCase();

        const isEmailField = name.includes("email") || id.includes("email") || placeholder.includes("email");
        const isTelField = name.includes("phone") || name.includes("tel") || id.includes("phone") || id.includes("tel") || placeholder.includes("phone") || placeholder.includes("tel");

        if (isEmailField) {
            issues.push({
                rule: RULE_IDS.form.emailTelWithoutType,
                message: "Email input should use type='email' instead of type='text'",
                severity: "warning",
                category: "form",
                element: input as HTMLElement,
                selector: getCssSelector(input)
            });
        }

        if (isTelField) {
            issues.push({
                rule: RULE_IDS.form.emailTelWithoutType,
                message: "Phone input should use type='tel' instead of type='text'",
                severity: "warning",
                category: "form",
                element: input as HTMLElement,
                selector: getCssSelector(input)
            });
        }
    });

    return issues;
}

export function checkMissingAutocomplete(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    const commonAutoCompleteFields = [
        { selector: "input[type='email']", autocompleteValue: "email" },
        { selector: "input[type='tel']", autocompleteValue: "tel" },
        { selector: "input[type='password']", autocompleteValue: "current-password" },
        { selector: "input[type='text'][name*='first'], input[type='text'][name*='given']", autocompleteValue: "given-name" },
        { selector: "input[type='text'][name*='last'], input[type='text'][name*='family']", autocompleteValue: "family-name" },
        { selector: "input[type='text'][name*='address']", autocompleteValue: "street-address" },
        { selector: "input[type='text'][name*='city']", autocompleteValue: "address-level2" },
        { selector: "input[type='text'][name*='country']", autocompleteValue: "country-name" }
    ];

    commonAutoCompleteFields.forEach(({ selector, autocompleteValue }) => {
        document.querySelectorAll(selector).forEach((input) => {
            if (shouldIgnore(input)) return;
            const hasAutocomplete = input.hasAttribute("autocomplete");

            if (!hasAutocomplete) {
                issues.push({
                    rule: RULE_IDS.form.missingAutocomplete,
                    message: `Input field should have autocomplete="${autocompleteValue}" attribute`,
                    severity: "recommendation",
                    category: "form",
                    element: input as HTMLElement,
                    selector: getCssSelector(input)
                });
            }
        });
    });

    return issues;
}