import type { AuditIssue } from "../../types";
import { getCssSelector } from "../../../utils/dom";
import { RULE_IDS } from "../../config/ruleIds";
import { shouldIgnore, hasAccessibleName } from "./helpers";

export function checkButtonsWithoutAccessibleName(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("button").forEach((button) => {
        if (shouldIgnore(button)) return;
        if (hasAccessibleName(button)) return;

        issues.push({
            rule: RULE_IDS.accessibility.buttonMissingAccessibleName,
            message: "Button is missing an accessible name",
            severity: "warning",
            category: "accessibility",
            element: button as HTMLElement,
            selector: getCssSelector(button)
        });
    });

    return issues;
}