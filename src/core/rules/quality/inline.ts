import type { AuditIssue } from "../../types";
import { RULE_IDS } from "../../config/ruleIds";
import { shouldIgnore } from "../helpers";
import { getInlineStyleSelector } from "./helpers";

export function checkExcessiveInlineStyles(threshold = 10): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const elementsWithStyle = Array.from(document.querySelectorAll("[style]"))
        .filter((el) => !shouldIgnore(el));

    if (elementsWithStyle.length >= threshold) {
        const first = elementsWithStyle[0] as HTMLElement | undefined;

        issues.push({
            rule: RULE_IDS.quality.excessiveInlineStyles,
            message: `Excessive use of inline styles (${elementsWithStyle.length} elements)`,
            severity: "recommendation",
            category: "quality",
            element: first,
            selector: first ? getInlineStyleSelector(first) : undefined,
        });
    }

    return issues;
}