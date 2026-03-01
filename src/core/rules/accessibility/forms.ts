import type { AuditIssue } from "../../types";
import { getCssSelector } from "../../../utils/dom";
import { RULE_IDS } from "../../config/ruleIds";
import { shouldIgnore } from "./helpers";

export function checkInputsWithoutLabel(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    const inputs = Array.from(document.querySelectorAll("input, select, textarea"))
        .filter((el) => !shouldIgnore(el));

    for (const el of inputs) {
        const input = el as HTMLInputElement;
        const id = input.id;
        const hasLabelByFor = id ? !!document.querySelector(`label[for="${CSS.escape(id)}"]`) : false;
        const wrappedByLabel = !!input.closest("label");
        const hasAria = !!(input.getAttribute("aria-label") || input.getAttribute("aria-labelledby"));

        if (!hasLabelByFor && !wrappedByLabel && !hasAria) {
            issues.push({
                rule: RULE_IDS.accessibility.controlMissingLabel,
                message: "Form control missing accessible label",
                severity: "critical",
                category: "accessibility",
                element: input,
                selector: getCssSelector(input)
            });
        }
    }

    return issues;
}

export function checkControlsWithoutIdOrName(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("input, select, textarea").forEach((el) => {
        if (shouldIgnore(el)) return;
        const control = el as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
        const id = (control.id || "").trim();
        const name = (control.getAttribute("name") || "").trim();

        if (id || name) return;

        issues.push({
            rule: RULE_IDS.accessibility.controlMissingIdOrName,
            message: "Form control is missing both id and name",
            severity: "critical",
            category: "accessibility",
            element: control as HTMLElement,
            selector: getCssSelector(control)
        });
    });

    return issues;
}

export function checkLabelsWithoutFor(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("label").forEach((label) => {
        if (shouldIgnore(label)) return;
        const hasFor = (label.getAttribute("for") || "").trim().length > 0;
        const hasControlChild = !!label.querySelector("input, select, textarea");

        if (hasFor || hasControlChild) return;

        issues.push({
            rule: RULE_IDS.accessibility.labelMissingFor,
            message: "Label is missing a for attribute and does not wrap a control",
            severity: "warning",
            category: "accessibility",
            element: label as HTMLElement,
            selector: getCssSelector(label)
        });
    });

    return issues;
}