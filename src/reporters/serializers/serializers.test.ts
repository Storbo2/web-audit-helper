import { describe, it, expect } from "vitest";
import { serializeReportToHTML, serializeReportToJSON, serializeReportToTXT } from "./index";
import type { AuditReport } from "../../core/types";

const mockReport: AuditReport = {
    meta: {
        url: "https://example.com",
        date: new Date().toISOString(),
        viewport: { width: 1280, height: 720 },
        userAgent: "Test Agent",
        version: "1.0.0",
        mode: "ci"
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

describe("Report Serializers", () => {
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
    });

    describe("serializeReportToHTML", () => {
        it("renders HTML report with metrics and grouped statuses", () => {
            const report: AuditReport = {
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

            const html = serializeReportToHTML(report);
            expect(html).toContain("<!doctype html>");
            expect(html).toContain("Audit Metrics");
            expect(html).toContain("ACC-01");
            expect(html).toContain("status-fail");
            expect(html).toContain("status-warn");
            expect(html).toContain("status-recommendation");
            expect(html).toContain("... and 2 more");
            expect(html).toContain("Applied Filters");
        });

        it("renders empty state when category has no findings and no metrics", () => {
            const report: AuditReport = {
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

            const html = serializeReportToHTML(report);
            expect(html).toContain("No findings in this category");
            expect(html).not.toContain("Audit Metrics");
        });
    });

    describe("serializeReportToTXT", () => {
        it("renders TXT report with metrics, grouped statuses, and highlights", () => {
            const report: AuditReport = {
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

            const txt = serializeReportToTXT(report);
            expect(txt).toContain("Audit Metrics:");
            expect(txt).toContain("CRITICAL:");
            expect(txt).toContain("WARNING:");
            expect(txt).toContain("RECOMMENDATION:");
            expect(txt).toContain("... and 4 more");
            expect(txt).toContain("Key Suggestions");
            expect(txt).toContain("Applied Filters");
        });

        it("omits optional sections when no metrics and no highlights", () => {
            const report: AuditReport = {
                ...mockReport,
                categories: [],
                metrics: undefined,
                highlights: []
            };

            const txt = serializeReportToTXT(report);
            expect(txt).not.toContain("Audit Metrics:");
            expect(txt).not.toContain("Key Suggestions");
        });
    });
});