import { describe, expect, it } from "vitest";
import { buildAuditReport } from "./auditReport";
import type { AuditResult, WAHConfig } from "../core/types";

const RESULT_WITH_METRICS: AuditResult = {
    score: 90,
    issues: [{
        rule: "ACC-01",
        message: "html missing lang",
        severity: "critical",
        category: "accessibility",
        selector: "html"
    }],
    metrics: {
        totalMs: 42,
        executedRules: 1,
        skippedRules: 0,
        ruleTimings: [{ rule: "ACC-01", ms: 3, issues: 1 }]
    }
};

describe("audit report metrics inclusion", () => {
    it("includes metrics when includeInReports is true", () => {
        const report = buildAuditReport(RESULT_WITH_METRICS, {
            auditMetrics: { includeInReports: true }
        } as WAHConfig);

        expect(report.metrics).toBeDefined();
        expect(report.metrics?.totalMs).toBe(42);
    });

    it("omits metrics when includeInReports is false", () => {
        const report = buildAuditReport(RESULT_WITH_METRICS, {
            auditMetrics: { includeInReports: false }
        } as WAHConfig);

        expect(report.metrics).toBeUndefined();
    });

    it("sets runtimeMode=external when provided by config", () => {
        const report = buildAuditReport(RESULT_WITH_METRICS, {
            runtimeMode: "external",
            auditMetrics: { includeInReports: true }
        } as WAHConfig);

        expect(report.meta.runtimeMode).toBe("external");
        expect(report.meta.wahVersion).toBeTruthy();
        expect(report.meta.runId).toBeTruthy();
        expect(report.meta.targetUrl.length).toBeGreaterThan(0);
    });
});