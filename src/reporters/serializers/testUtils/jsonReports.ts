import type { AuditReport } from "../../../core/types";
import { mockReport } from "./baseReport";

export function createJsonComparisonReports(): { previousReport: AuditReport; currentReport: AuditReport } {
    const previousReport: AuditReport = {
        ...mockReport,
        meta: {
            ...mockReport.meta,
            runId: "run-prev",
            executedAt: "2026-03-16T00:00:00.000Z",
            issueCountBySeverity: {
                critical: 2,
                warning: 1,
                recommendation: 1
            },
            totalAuditMs: 20
        },
        score: {
            ...mockReport.score,
            overall: 70,
            byCategory: { accessibility: 72 }
        },
        categories: [
            {
                id: "accessibility",
                title: "Accessibility",
                score: 72,
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
        ],
        metrics: {
            totalMs: 20,
            executedRules: 45,
            skippedRules: 5,
            ruleTimings: [{ rule: "ACC-01", ms: 3, issues: 1 }]
        }
    };

    const currentReport: AuditReport = {
        ...mockReport,
        meta: {
            ...mockReport.meta,
            issueCountBySeverity: {
                critical: 1,
                warning: 3,
                recommendation: 2
            },
            totalAuditMs: 12
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
        ],
        metrics: {
            totalMs: 12,
            executedRules: 50,
            skippedRules: 0,
            ruleTimings: [{ rule: "ACC-13", ms: 2, issues: 1 }]
        }
    };

    return { previousReport, currentReport };
}