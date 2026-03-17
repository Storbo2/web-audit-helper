import { describe, expect, it } from "vitest";
import type { AuditReport } from "../../core/types";
import {
    escapeHtml,
    formatAppliedFiltersText,
    formatDateISOToDDMMYYYY,
    formatScoringModeLabel
} from "./helpers";

describe("report serializer helpers", () => {
    const baseReport: AuditReport = {
        meta: {
            runId: "run-test-1",
            targetUrl: "https://example.com",
            executedAt: "2026-03-10T22:00:00.000Z",
            runtimeMode: "embedded",
            wahVersion: "1.2.0",
            date: "2026-03-10T22:00:00.000Z",
            viewport: { width: 1280, height: 720 },
            userAgent: "vitest",
            version: "1.2.0",
            mode: "dev",
            issueCountBySeverity: {
                critical: 0,
                warning: 0,
                recommendation: 0
            },
            categoryScores: {},
            rulesExecuted: 0,
            rulesSkipped: 0,
            totalAuditMs: 0
        },
        score: {
            overall: 100,
            grade: "A",
            byCategory: {}
        },
        categories: [],
        stats: {
            recommendations: 0,
            warnings: 0,
            failed: 0,
            totalRules: 0,
            totalRulesTriggered: 0,
            totalRulesAvailable: 0
        }
    };

    it("formats ISO date as dd-mm-yyyy", () => {
        expect(formatDateISOToDDMMYYYY("2026-03-10T22:00:00.000Z")).toBe("10-03-2026");
    });

    it("escapes unsafe html characters", () => {
        expect(escapeHtml("<a href='x'>&\"</a>")).toBe("&lt;a href=&#39;x&#39;&gt;&amp;&quot;&lt;/a&gt;");
    });

    it("returns normal when scoring mode is undefined", () => {
        expect(formatScoringModeLabel(undefined)).toBe("normal");
        expect(formatScoringModeLabel("custom")).toBe("custom");
    });

    it("returns empty applied filters text when scoring mode is not custom", () => {
        const report: AuditReport = {
            ...baseReport,
            meta: {
                ...baseReport.meta,
                scoringMode: "normal"
            }
        };

        expect(formatAppliedFiltersText(report)).toBe("");
    });

    it("formats applied filters and falls back to notAvailable for empty lists", () => {
        const report: AuditReport = {
            ...baseReport,
            meta: {
                ...baseReport.meta,
                scoringMode: "custom",
                appliedFilters: {
                    severities: [],
                    categories: []
                }
            }
        };

        const text = formatAppliedFiltersText(report);
        expect(text).toContain("severities:");
        expect(text).toContain("categories:");
    });
});