import type { AuditIssue } from "../types";
import { getCssSelector, isWahIgnored } from "../../utils/dom";
import { RULE_IDS } from "./ruleIds";

function shouldIgnore(el: Element): boolean {
    return isWahIgnored(el);
}

export function checkTargetBlankWithoutNoopener(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll('a[target="_blank"]').forEach((link) => {
        if (shouldIgnore(link)) return;
        const rel = (link.getAttribute("rel") || "").toLowerCase();
        const hasNoopener = rel.includes("noopener");
        const hasNoreferrer = rel.includes("noreferrer");

        if (!hasNoopener && !hasNoreferrer) {
            issues.push({
                rule: RULE_IDS.security.targetBlankWithoutNoopener,
                message: 'Link with target="_blank" is missing rel="noopener noreferrer"',
                severity: "warning",
                category: "security",
                element: link as HTMLElement,
                selector: getCssSelector(link)
            });
        }
    });

    return issues;
}

export function checkDummyLinks(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("a[href]").forEach((link) => {
        if (shouldIgnore(link)) return;
        const href = (link.getAttribute("href") || "").trim();

        if (href === "#" || href === "javascript:void(0)" || href === "javascript:;") {
            issues.push({
                rule: RULE_IDS.security.dummyLink,
                message: `Link has dummy href: "${href}"`,
                severity: "recommendation",
                category: "quality",
                element: link as HTMLElement,
                selector: getCssSelector(link)
            });
        }
    });

    return issues;
}
