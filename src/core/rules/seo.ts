import type { AuditIssue } from "../types";
import { RULE_IDS } from "./ruleIds";

export function checkMissingTitle(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const title = document.querySelector("head > title");

    if (!title || !(title.textContent || "").trim()) {
        issues.push({
            rule: RULE_IDS.seo.missingTitle,
            message: "Missing or empty <title>",
            severity: "critical",
            category: "seo"
        });
    }

    return issues;
}

export function checkMissingMetaDescription(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;

    if (!meta || !(meta.content || "").trim()) {
        issues.push({
            rule: RULE_IDS.seo.weakOrMissingDescription,
            message: "Missing meta description",
            severity: "warning",
            category: "seo"
        });
    }

    return issues;
}

export function checkMissingMetaCharset(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const charset = document.querySelector("meta[charset]") as HTMLMetaElement | null;

    if (!charset) {
        issues.push({
            rule: RULE_IDS.seo.missingCharset,
            message: "Missing meta charset",
            severity: "warning",
            category: "seo"
        });
    }

    return issues;
}