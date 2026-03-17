import type { AuditReport } from "../../../core/types";
import { mockReport } from "./baseReport";

export function createHtmlMetricsReport(): AuditReport {
    return {
        ...mockReport,
        meta: {
            ...mockReport.meta,
            scoringMode: "custom",
            appliedFilters: {
                severities: ["critical", "warning"],
                categories: ["accessibility", "seo"]
            },
            breakpoint: {
                name: "xl",
                label: "Extra Large",
                devices: "laptops, desktops"
            }
        },
        categories: [
            {
                id: "accessibility",
                title: "Accessibility",
                score: 60,
                summary: { critical: 1, warning: 1, recommendation: 1 },
                rules: [
                    {
                        id: "ACC-01",
                        title: "Missing lang",
                        description: "desc",
                        status: "critical",
                        message: "critical issue",
                        fix: "set lang",
                        elements: [
                            { selector: "html", note: "missing lang" },
                            { selector: "body", note: "missing lang" }
                        ],
                        elementsOmitted: 2
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
            totalMs: 12.3,
            executedRules: 10,
            skippedRules: 2,
            ruleTimings: [
                { rule: "ACC-01", ms: 5, issues: 1 },
                { rule: "ACC-13", ms: 2, issues: 1 }
            ]
        }
    };
}

export function createHtmlEmptyReport(): AuditReport {
    return {
        ...mockReport,
        categories: [
            {
                id: "seo",
                title: "SEO",
                score: 100,
                rules: [],
                summary: { critical: 0, warning: 0, recommendation: 0 }
            }
        ],
        metrics: undefined
    };
}

export function createHtmlComparisonReports(): { previousReport: AuditReport; currentReport: AuditReport } {
    const previousReport: AuditReport = {
        ...mockReport,
        meta: {
            ...mockReport.meta,
            runId: "run-prev",
            executedAt: "2026-03-16T00:00:00.000Z",
            issueCountBySeverity: {
                critical: 2,
                warning: 3,
                recommendation: 2
            },
            totalAuditMs: 40
        },
        score: {
            ...mockReport.score,
            overall: 70,
            byCategory: { accessibility: 70 }
        },
        categories: [
            {
                id: "accessibility",
                title: "Accessibility",
                score: 70,
                summary: { critical: 1, warning: 0, recommendation: 0 },
                rules: [
                    {
                        id: "ACC-01",
                        title: "Missing lang",
                        description: "desc",
                        status: "critical",
                        message: "critical issue"
                    }
                ]
            }
        ]
    };

    const currentReport: AuditReport = {
        ...mockReport,
        score: {
            ...mockReport.score,
            overall: 75,
            byCategory: { accessibility: 80 }
        },
        categories: [
            {
                id: "accessibility",
                title: "Accessibility",
                score: 80,
                summary: { critical: 0, warning: 1, recommendation: 0 },
                rules: [
                    {
                        id: "ACC-13",
                        title: "Positive tabindex",
                        description: "desc",
                        status: "warning",
                        message: "tabindex"
                    }
                ]
            }
        ]
    };

    return { previousReport, currentReport };
}