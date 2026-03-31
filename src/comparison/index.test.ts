import { describe, expect, it } from "vitest";

import type { AuditReport } from "../core/types";
import { COMPARISON_CONTRACT_VERSION, compareReports, evaluateComparisonGate } from "./index";

function createBaseReport(runId: string): AuditReport {
    return {
        meta: {
            runId,
            targetUrl: "https://example.com",
            executedAt: "2026-03-30T00:00:00.000Z",
            runtimeMode: "headless",
            wahVersion: "1.5.3",
            url: "https://example.com",
            date: "2026-03-30T00:00:00.000Z",
            viewport: { width: 1280, height: 720 },
            userAgent: "vitest",
            version: "1.5.3",
            mode: "ci",
            issueCountBySeverity: {
                critical: 1,
                warning: 2,
                recommendation: 3
            },
            categoryScores: { accessibility: 80 },
            rulesExecuted: 50,
            rulesSkipped: 0,
            totalAuditMs: 20,
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
            recommendations: 3,
            warnings: 2,
            failed: 1,
            totalRules: 6,
            totalRulesTriggered: 6,
            totalRulesAvailable: 77
        },
        metrics: {
            totalMs: 20,
            executedRules: 50,
            skippedRules: 0,
            ruleTimings: [{ rule: "ACC-01", ms: 5, issues: 1 }]
        }
    };
}

describe("comparison engine", () => {
    it("adds contract version and computes report deltas", () => {
        const previous = createBaseReport("run-prev");
        const current: AuditReport = {
            ...createBaseReport("run-current"),
            score: {
                overall: 75,
                grade: "C",
                byCategory: { accessibility: 70 }
            },
            meta: {
                ...createBaseReport("run-current").meta,
                issueCountBySeverity: {
                    critical: 3,
                    warning: 2,
                    recommendation: 2
                },
                totalAuditMs: 26
            },
            metrics: {
                totalMs: 26,
                executedRules: 50,
                skippedRules: 0,
                ruleTimings: [{ rule: "ACC-01", ms: 8, issues: 1 }]
            }
        };

        const comparison = compareReports(current, previous);
        expect(comparison.contractVersion).toBe(COMPARISON_CONTRACT_VERSION);
        expect(comparison.overallScoreDelta).toBe(-5);
        expect(comparison.severityDelta.critical).toBe(2);
        expect(comparison.categoryScoreDelta.accessibility).toBe(-10);
        expect(comparison.timing?.totalAuditMsDelta).toBe(6);
    });

    it("evaluates CI gates from comparison payload", () => {
        const comparison = compareReports(createBaseReport("current"), createBaseReport("previous"));

        const passing = evaluateComparisonGate(comparison, {
            minScoreDelta: -1,
            maxCriticalIncrease: 0
        });
        expect(passing.passed).toBe(true);
        expect(passing.reasons).toEqual([]);

        const failing = evaluateComparisonGate(
            {
                ...comparison,
                overallScoreDelta: -9,
                severityDelta: {
                    ...comparison.severityDelta,
                    critical: 2
                }
            },
            {
                minScoreDelta: -5,
                maxCriticalIncrease: 1
            }
        );

        expect(failing.passed).toBe(false);
        expect(failing.reasons).toContain("overallScoreDelta -9 is below minimum -5");
        expect(failing.reasons).toContain("critical delta +2 exceeds maximum 1");
    });
});