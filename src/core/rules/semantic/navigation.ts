import type { AuditIssue } from "../../types";
import { getCssSelector } from "../../../utils/dom";
import { RULE_IDS } from "../../config/ruleIds";
import { shouldIgnore } from "../helpers";

export function checkMissingNav(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("nav").forEach((nav) => {
        if (shouldIgnore(nav)) return;
        const hasUl = !!nav.querySelector("ul");
        const hasOl = !!nav.querySelector("ol");
        const hasList = hasUl || hasOl;

        if (!hasList) {
            issues.push({
                rule: RULE_IDS.semantic.missingNav,
                message: "Navigation element should contain a list",
                severity: "recommendation",
                category: "semantic",
                element: nav as HTMLElement,
                selector: getCssSelector(nav)
            });
        }
    });

    return issues;
}

export function checkFalseLists(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("ul, ol").forEach((list) => {
        if (shouldIgnore(list)) return;
        const divs = list.querySelectorAll(":scope > div");
        if (divs.length === 0) return;

        const children = Array.from(list.children).filter((el) => !shouldIgnore(el));
        const divCount = Array.from(divs).length;

        if (divCount / children.length > 0.5) {
            issues.push({
                rule: RULE_IDS.semantic.falseLists,
                message: `List contains divs instead of proper list items (${divCount} divs out of ${children.length} children)`,
                severity: "warning",
                category: "semantic",
                element: list as HTMLElement,
                selector: getCssSelector(list)
            });
        }
    });

    return issues;
}