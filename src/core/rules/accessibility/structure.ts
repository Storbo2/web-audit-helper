import type { AuditIssue } from "../../types";
import { getCssSelector } from "../../../utils/dom";
import { RULE_IDS } from "../../config/ruleIds";
import { shouldIgnore } from "./helpers";

export function checkHeadingOrder(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const headings = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6"))
        .filter((el) => !shouldIgnore(el));

    let lastLevel = 0;
    for (const el of headings) {
        const level = parseInt(el.tagName.replace("H", ""), 10);
        if (!Number.isFinite(level)) continue;

        if (lastLevel > 0 && level > lastLevel + 1) {
            issues.push({
                rule: RULE_IDS.accessibility.headingOrder,
                message: `Heading level jumps from H${lastLevel} to H${level}`,
                severity: "warning",
                category: "accessibility",
                element: el as HTMLElement,
                selector: getCssSelector(el)
            });
        }

        lastLevel = level;
    }

    return issues;
}

export function checkDuplicateIds(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const seen = new Map<string, Element>();

    document.querySelectorAll("[id]").forEach((el) => {
        if (shouldIgnore(el)) return;
        const id = (el.getAttribute("id") || "").trim();
        if (!id) return;

        const first = seen.get(id);
        if (!first) {
            seen.set(id, el);
            return;
        }

        issues.push({
            rule: RULE_IDS.accessibility.duplicateIds,
            message: `Duplicate id detected: "${id}"`,
            severity: "critical",
            category: "accessibility",
            element: el as HTMLElement,
            selector: getCssSelector(el)
        });
    });

    return issues;
}