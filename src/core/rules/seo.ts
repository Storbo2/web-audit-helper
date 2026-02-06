import type { AuditIssue } from "../types";

export function checkMissingTitle(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const title = document.querySelector("head > title");

    if (!title || !(title.textContent || "").trim()) {
        issues.push({
            rule: "seo-title",
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
            rule: "seo-description",
            message: "Missing meta description",
            severity: "warning",
            category: "seo"
        });
    }

    return issues;
}