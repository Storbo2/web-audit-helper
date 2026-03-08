import type { AuditIssue } from "../types";
import { isWahIgnored } from "../../utils/dom";
import { RULE_IDS } from "../config/ruleIds";

function shouldIgnore(el: Element): boolean {
    return isWahIgnored(el);
}

function getInlineStyleSelector(el: Element): string {
    const node = el as HTMLElement;
    if (node.id) return `#${node.id}`;

    const tag = el.tagName.toLowerCase();
    const firstClass = (node.className || "").toString().trim().split(/\s+/)[0];
    return firstClass ? `${tag}.${firstClass}` : tag;
}

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