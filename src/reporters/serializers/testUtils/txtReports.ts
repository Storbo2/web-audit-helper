import type { AuditReport } from "../../../core/types";
import { mockReport } from "./baseReport";

export function createTxtRichReport(): AuditReport {
    return {
        ...mockReport,
        meta: {
            ...mockReport.meta,
            scoringMode: "custom",
            appliedFilters: {
                severities: ["critical", "warning"],
                categories: ["accessibility"]
            }
        },
        categories: [
            {
                id: "accessibility",
                title: "Accessibility",
                score: 70,
                summary: { critical: 1, warning: 1, recommendation: 1 },
                rules: [
                    {
                        id: "ACC-01",
                        title: "Missing lang",
                        description: "desc",
                        status: "critical",
                        message: "critical issue",
                        fix: "set lang",
                        help: "use html lang",
                        elements: [
                            { selector: "html", note: "missing lang" },
                            { selector: "body", note: "missing lang" },
                            { selector: "main", note: "missing lang" },
                            { selector: "p", note: "missing lang" },
                            { selector: "a", note: "missing lang" },
                            { selector: "button", note: "missing lang" }
                        ],
                        elementsOmitted: 1
                    },
                    {
                        id: "ACC-13",
                        title: "Positive tabindex",
                        description: "desc",
                        status: "warning",
                        message: "tabindex",
                        elements: [{ selector: "[tabindex]" }]
                    },
                    {
                        id: "ACC-24",
                        title: "Skip link",
                        description: "desc",
                        status: "recommendation",
                        message: "missing skip link"
                    }
                ]
            }
        ],
        metrics: {
            totalMs: 9.1,
            executedRules: 8,
            skippedRules: 1,
            ruleTimings: [
                { rule: "ACC-01", ms: 4.5, issues: 2 }
            ]
        },
        highlights: ["Fix lang", "Add skip link"]
    };
}

export function createTxtMinimalReport(): AuditReport {
    return {
        ...mockReport,
        categories: [],
        metrics: undefined,
        highlights: []
    };
}