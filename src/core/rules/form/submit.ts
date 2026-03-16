import type { AuditIssue } from "../../types";
import { getCssSelector } from "../../../utils/dom";
import { RULE_IDS } from "../../config/ruleIds";
import { shouldIgnore } from "../helpers";

export function checkSubmitButtonOutsideForm(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("button[type='submit'], input[type='submit']").forEach((button) => {
        if (shouldIgnore(button)) return;
        const form = button.closest("form");

        if (!form) {
            issues.push({
                rule: RULE_IDS.form.submitButtonOutsideForm,
                message: "Submit button is not inside a form element",
                severity: "critical",
                category: "form",
                element: button as HTMLElement,
                selector: getCssSelector(button)
            });
        }
    });

    return issues;
}

export function checkRequiredWithoutIndicator(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("input[required], select[required], textarea[required]").forEach((input) => {
        if (shouldIgnore(input)) return;
        const label = document.querySelector(`label[for="${input.id}"]`);

        if (!label) return;

        const labelText = (label.textContent || "").trim().toLowerCase();
        const hasIndicator = labelText.includes("*") || labelText.includes("required");

        if (!hasIndicator) {
            issues.push({
                rule: RULE_IDS.form.requiredWithoutIndicator,
                message: "Required input field label doesn't indicate it's required",
                severity: "recommendation",
                category: "form",
                element: input as HTMLElement,
                selector: getCssSelector(input)
            });
        }
    });

    return issues;
}