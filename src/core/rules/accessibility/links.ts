import type { AuditIssue } from "../../types";
import { getCssSelector } from "../../../utils/dom";
import { RULE_IDS } from "../../config/ruleIds";
import { shouldIgnore, hasAccessibleName } from "./helpers";

export function checkVagueLinks(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const bad = ["click aquí", "click here", "aquí", "here", "ver más", "leer más",
        "more", "read more", "más", "more info", "info"];

    document.querySelectorAll("a").forEach((a) => {
        if (shouldIgnore(a)) return;
        const text = (a.textContent || "").trim().toLowerCase();
        if (bad.includes(text)) {
            issues.push({
                rule: RULE_IDS.accessibility.vagueLinkText,
                message: `Link text is vague: "${(a.textContent || "").trim()}"`,
                severity: "warning",
                category: "accessibility",
                element: a as HTMLElement,
                selector: getCssSelector(a)
            });
        }
    });

    return issues;
}

export function checkLinksWithoutHref(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    document.querySelectorAll("a").forEach((a) => {
        if (shouldIgnore(a)) return;
        if (!a.getAttribute("href")) {
            issues.push({
                rule: RULE_IDS.accessibility.linkMissingHref,
                message: "Link missing href attribute",
                severity: "warning",
                category: "accessibility",
                element: a as HTMLElement,
                selector: getCssSelector(a)
            });
        }
    });
    return issues;
}

export function checkLinksWithoutAccessibleName(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("a").forEach((a) => {
        if (shouldIgnore(a)) return;
        if (hasAccessibleName(a)) return;

        issues.push({
            rule: RULE_IDS.accessibility.linkMissingAccessibleName,
            message: "Link is missing an accessible name",
            severity: "warning",
            category: "accessibility",
            element: a as HTMLElement,
            selector: getCssSelector(a)
        });
    });

    return issues;
}