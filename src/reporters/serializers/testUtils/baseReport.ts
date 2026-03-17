import type { AuditReport } from "../../../core/types";

export const mockReport: AuditReport = {
    meta: {
        runId: "run-test-1",
        targetUrl: "https://example.com?token=[redacted]",
        executedAt: new Date().toISOString(),
        runtimeMode: "embedded",
        wahVersion: "1.0.0",
        url: "https://example.com",
        date: new Date().toISOString(),
        viewport: { width: 1280, height: 720 },
        userAgent: "Test Agent",
        version: "1.0.0",
        mode: "ci",
        issueCountBySeverity: {
            critical: 1,
            warning: 3,
            recommendation: 2
        },
        categoryScores: { accessibility: 80 },
        rulesExecuted: 50,
        rulesSkipped: 0,
        totalAuditMs: 0
    },
    score: {
        overall: 75,
        grade: "C",
        byCategory: { accessibility: 80 }
    },
    categories: [],
    stats: {
        recommendations: 2,
        warnings: 3,
        failed: 1,
        totalRules: 50,
        totalRulesTriggered: 10,
        totalRulesAvailable: 50
    },
    metrics: undefined
};
