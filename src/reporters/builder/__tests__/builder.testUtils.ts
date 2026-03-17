import type { AuditResult, CategoryResult } from "../../../core/types";

export function createSampleCategoryResults(): CategoryResult[] {
    return [
        {
            id: "accessibility",
            title: "Accessibility",
            score: 70,
            rules: [
                { id: "ACC-01", title: "a", description: "d", status: "critical", message: "m" },
                { id: "ACC-02", title: "a", description: "d", status: "warning", message: "m" },
                { id: "ACC-03", title: "a", description: "d", status: "recommendation", message: "m" }
            ],
            summary: { critical: 1, warning: 1, recommendation: 1 }
        }
    ];
}

export function createIssuesForCategoryBuilder(): AuditResult["issues"] {
    const issues: AuditResult["issues"] = [];
    for (let i = 0; i < 25; i++) {
        issues.push({
            rule: "ACC-01",
            message: "html missing lang",
            severity: "critical",
            category: "accessibility",
            selector: `#node-${i}`
        });
    }
    issues.push({
        rule: "ACC-13",
        message: "positive tabindex",
        severity: "warning",
        selector: "[tabindex]"
    });
    return issues;
}