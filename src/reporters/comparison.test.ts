import { describe, expect, it } from "vitest";
import type { AuditReport } from "../core/types";
import { buildAuditReportComparison } from "./comparison";

function createBaseReport(runId: string): AuditReport {
    return {
        meta: {
            runId,
            targetUrl: "https://example.com",
            executedAt: "2026-03-17T00:00:00.000Z",
            runtimeMode: "external",
            wahVersion: "1.4.5",
            url: "https://example.com",
            date: "2026-03-17T00:00:00.000Z",
            viewport: { width: 1280, height: 720 },
            userAgent: "vitest",
            version: "1.4.5",
            mode: "ci",
            issueCountBySeverity: {
                critical: 1,
                warning: 1,
                recommendation: 1
            },
            categoryScores: { accessibility: 80 },
            rulesExecuted: 50,
            rulesSkipped: 0,
            totalAuditMs: 12,
            scoringMode: "normal"
        },
        score: {
            overall: 80,
            grade: "B",
            byCategory: { accessibility: 80 }
        },
        categories: [
            {
                id: "accessibility",
                title: "Accessibility",
                score: 80,
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
        stats: {
            recommendations: 1,
            warnings: 1,
            failed: 1,
            totalRules: 3,
            totalRulesTriggered: 3,
            totalRulesAvailable: 75
        },
        metrics: {
            totalMs: 12,
            executedRules: 50,
            skippedRules: 0,
            ruleTimings: [{ rule: "ACC-01", ms: 3, issues: 1 }]
        }
    };
}

describe("buildAuditReportComparison", () => {
    it("calculates score and severity deltas", () => {
        const previous = createBaseReport("run-prev");
        const current: AuditReport = {
            ...createBaseReport("run-current"),
            score: {
                overall: 85,
                grade: "B",
                byCategory: { accessibility: 88 }
            },
            meta: {
                ...createBaseReport("run-current").meta,
                issueCountBySeverity: {
                    critical: 0,
                    warning: 2,
                    recommendation: 1
                },
                totalAuditMs: 10
            }
        };

        const comparison = buildAuditReportComparison(current, previous);
        expect(comparison.overallScoreDelta).toBe(5);
        expect(comparison.severityDelta.critical).toBe(-1);
        expect(comparison.severityDelta.warning).toBe(1);
        expect(comparison.categoryScoreDelta.accessibility).toBe(8);
        expect(comparison.timing?.totalAuditMsDelta).toBe(-2);
    });

    it("detects added and removed rules", () => {
        const previous = createBaseReport("run-prev");
        const current: AuditReport = {
            ...createBaseReport("run-current"),
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
                totalMs: 11,
                executedRules: 50,
                skippedRules: 0,
                ruleTimings: [{ rule: "ACC-13", ms: 2, issues: 1 }]
            }
        };

        const comparison = buildAuditReportComparison(current, previous);
        expect(comparison.addedRuleIds).toEqual(["ACC-13"]);
        expect(comparison.removedRuleIds).toEqual(["ACC-01"]);
        expect(comparison.timing?.ruleTimingDelta.length).toBeGreaterThan(0);
    });
});