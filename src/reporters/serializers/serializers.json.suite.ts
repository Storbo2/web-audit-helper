import { describe, expect, it, vi } from "vitest";
import type { AuditReport, AuditReportComparison } from "../../core/types";
import { serializeReportToJSON } from "./index";
import { createJsonComparisonReports, mockReport } from "./serializers.testUtils";
import * as comparisonModule from "../comparison";

describe("serializeReportToJSON", () => {
    it("should return valid JSON", () => {
        const json = serializeReportToJSON(mockReport);
        const parsed = JSON.parse(json);
        expect(parsed.score.overall).toBe(75);
        expect(parsed.score.grade).toBe("C");
    });

    it("should include all expected properties", () => {
        const json = serializeReportToJSON(mockReport);
        const parsed = JSON.parse(json);
        expect(parsed.meta).toBeDefined();
        expect(parsed.score).toBeDefined();
        expect(parsed.categories).toBeDefined();
        expect(parsed.stats).toBeDefined();
    });

    it("should preserve metadata", () => {
        const json = serializeReportToJSON(mockReport);
        const parsed = JSON.parse(json);
        expect(parsed.meta.contractVersion).toBe("1.0.0");
        expect(parsed.meta.url).toBe("https://example.com");
        expect(parsed.meta.version).toBe("1.0.0");
    });

    it("should preserve stats information", () => {
        const json = serializeReportToJSON(mockReport);
        const parsed = JSON.parse(json);
        expect(parsed.stats.recommendations).toBe(2);
        expect(parsed.stats.warnings).toBe(3);
        expect(parsed.stats.failed).toBe(1);
    });

    it("should handle different grade values", () => {
        const reportA: AuditReport = { ...mockReport, score: { ...mockReport.score, grade: "A", overall: 90 } };
        const reportF: AuditReport = { ...mockReport, score: { ...mockReport.score, grade: "F", overall: 10 } };

        const jsonA = JSON.parse(serializeReportToJSON(reportA));
        const jsonF = JSON.parse(serializeReportToJSON(reportF));

        expect(jsonA.score.grade).toBe("A");
        expect(jsonF.score.grade).toBe("F");
    });

    it("should stringify valid JSON without errors", () => {
        const json = serializeReportToJSON(mockReport);
        expect(() => JSON.parse(json)).not.toThrow();
    });

    it("should handle category breakdown", () => {
        const json = serializeReportToJSON(mockReport);
        const parsed = JSON.parse(json);
        expect(parsed.score.byCategory).toBeDefined();
        expect(parsed.score.byCategory.accessibility).toBe(80);
    });

    it("should include comparison block when previous report is provided", () => {
        const { previousReport, currentReport } = createJsonComparisonReports();

        const json = serializeReportToJSON(currentReport, previousReport);
        const parsed = JSON.parse(json);

        expect(parsed.comparison).toBeDefined();
        expect(parsed.comparison.overallScoreDelta).toBe(5);
        expect(parsed.comparison.addedRuleIds).toContain("ACC-13");
        expect(parsed.comparison.removedRuleIds).toContain("ACC-01");
    });

    it("uses precomputed comparison payload when provided", () => {
        const { previousReport, currentReport } = createJsonComparisonReports();
        const precomputed: AuditReportComparison = {
            contractVersion: "1.0.0",
            baseline: {
                runId: "precomputed-run",
                executedAt: previousReport.meta.executedAt,
                targetUrl: previousReport.meta.targetUrl
            },
            overallScoreDelta: 999,
            severityDelta: {
                critical: 2,
                warning: -1,
                recommendation: 0
            },
            addedRuleIds: ["CUSTOM-ADDED"],
            removedRuleIds: ["CUSTOM-REMOVED"],
            categoryScoreDelta: {
                accessibility: 12
            }
        };
        const compareSpy = vi.spyOn(comparisonModule, "buildAuditReportComparison");
        compareSpy.mockClear();

        const json = serializeReportToJSON(currentReport, undefined, precomputed);
        const parsed = JSON.parse(json);

        expect(parsed.comparison).toEqual(precomputed);
        expect(compareSpy).not.toHaveBeenCalled();
    });

    it("should throw a contract error when required fields are missing", () => {
        const malformed: AuditReport = {
            ...mockReport,
            meta: {
                ...mockReport.meta,
                runId: ""
            }
        };

        expect(() => serializeReportToJSON(malformed)).toThrowError(/WAH:REPORT_CONTRACT/);
    });
});