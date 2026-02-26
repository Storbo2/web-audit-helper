import type { AuditIssue } from "../types";
import { isWahIgnored } from "../../utils/dom";
import { RULE_IDS } from "../config/ruleIds";

function shouldIgnore(el: Element): boolean {
    return isWahIgnored(el);
}

export function checkExcessiveInlineStyles(threshold = 10): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const elementsWithStyle = Array.from(document.querySelectorAll("[style]"))
        .filter((el) => !shouldIgnore(el));

    if (elementsWithStyle.length >= threshold) {
        issues.push({
            rule: RULE_IDS.quality.excessiveInlineStyles,
            message: `Excessive use of inline styles (${elementsWithStyle.length} elements)`,
            severity: "recommendation",
            category: "quality",
        });
    }

    return issues;
}