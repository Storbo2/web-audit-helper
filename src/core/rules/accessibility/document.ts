import type { AuditIssue } from "../../types";
import { RULE_IDS } from "../../config/ruleIds";
import { shouldIgnore } from "./helpers";

export function checkHtmlLangMissing(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const lang = (document.documentElement.lang || "").trim();

    if (!lang) {
        issues.push({
            rule: RULE_IDS.accessibility.htmlMissingLang,
            message: "<html> is missing a valid lang attribute",
            severity: "warning",
            category: "accessibility",
            element: document.documentElement,
            selector: "html"
        });
    }

    return issues;
}

export function checkMissingH1(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const h1 = Array.from(document.querySelectorAll("h1")).find((el) => !shouldIgnore(el));

    if (!h1) {
        issues.push({
            rule: RULE_IDS.accessibility.missingH1,
            message: "No H1 heading found",
            severity: "warning",
            category: "accessibility"
        });
    }

    return issues;
}

export function checkMissingSkipLink(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    const skipLink = document.querySelector("a[href='#main'], a[href='#content'], a[href='#main-content']");

    if (!skipLink) {
        issues.push({
            rule: RULE_IDS.accessibility.missingSkipLink,
            message: "Missing skip link to main content",
            severity: "recommendation",
            category: "accessibility"
        });
    }

    return issues;
}