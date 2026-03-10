import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AuditResult, CategoryResult } from "../core/types";

vi.mock("../overlay/config/settings", () => ({
    getSettings: vi.fn(),
    getActiveFilters: vi.fn(),
    getActiveCategories: vi.fn()
}));

vi.mock("../utils/breakpoints", () => ({
    getBreakpointInfo: () => ({
        name: "xl",
        label: "Extra Large",
        devices: "laptops, desktops"
    })
}));

vi.mock("../utils/i18n", () => ({
    translateCategory: (category: string) => `Category:${category}`,
    translateIssueMessage: (_ruleId: string, message: string) => `Translated:${message}`,
    translateRuleLabel: (_ruleId: string, fallback: string) => fallback,
    translateRuleFix: (_ruleId: string, fallback?: string) => fallback
}));

import { getActiveCategories, getActiveFilters, getSettings } from "../overlay/config/settings";
import {
    buildCategories,
    buildReportMeta,
    buildReportScore,
    buildReportStatsFromCategories,
    calculateRuleSummary
} from "./builder";

describe("report builder", () => {
    beforeEach(() => {
        vi.mocked(getSettings).mockReturnValue({
            logLevel: "full",
            highlightMs: 750,
            scoringMode: "normal",
            consoleOutput: "standard"
        });
        vi.mocked(getActiveFilters).mockReturnValue(new Set(["critical", "warning"]));
        vi.mocked(getActiveCategories).mockReturnValue(new Set(["accessibility", "seo"]));
    });

    it("builds report meta without applied filters in non-custom scoring mode", () => {
        const meta = buildReportMeta();

        expect(meta.viewport.width).toBeGreaterThan(0);
        expect(meta.breakpoint?.name).toBe("xl");
        expect(meta.scoringMode).toBe("normal");
        expect(meta.appliedFilters).toBeUndefined();
    });

    it("builds report meta with applied filters in custom scoring mode", () => {
        vi.mocked(getSettings).mockReturnValue({
            logLevel: "full",
            highlightMs: 750,
            scoringMode: "custom",
            consoleOutput: "standard"
        });

        const meta = buildReportMeta();

        expect(meta.scoringMode).toBe("custom");
        expect(meta.appliedFilters?.severities).toContain("critical");
        expect(meta.appliedFilters?.categories).toContain("accessibility");
    });

    it("builds score and stats from category results", () => {
        const categories: CategoryResult[] = [
            {
                id: "accessibility",
                title: "Accessibility",
                score: 70,
                rules: [
                    { id: "ACC-01", title: "a", description: "d", status: "critical", message: "m" },
                    { id: "ACC-02", title: "a", description: "d", status: "warning", message: "m" },
                    { id: "ACC-03", title: "a", description: "d", status: "recommendation", message: "m" }
                ],
                summary: { critical: 1, warning: 1, recommendation: 1 }
            }
        ];

        const score = buildReportScore(categories, 72);
        const stats = buildReportStatsFromCategories(categories);

        expect(score.overall).toBe(72);
        expect(score.byCategory.accessibility).toBe(70);
        expect(stats.failed).toBe(1);
        expect(stats.warnings).toBe(1);
        expect(stats.recommendations).toBe(1);
    });

    it("calculates rule summary counts", () => {
        const summary = calculateRuleSummary([
            { id: "A", title: "a", description: "d", status: "critical", message: "m" },
            { id: "B", title: "b", description: "d", status: "warning", message: "m" },
            { id: "C", title: "c", description: "d", status: "recommendation", message: "m" }
        ]);

        expect(summary).toEqual({ critical: 1, warning: 1, recommendation: 1 });
    });

    it("builds categories with deduplicated selectors and omitted elements", () => {
        const issues: AuditResult["issues"] = [];
        for (let i = 0; i < 25; i++) {
            issues.push({
                rule: "ACC-01",
                message: "html missing lang",
                severity: "critical",
                category: "accessibility",
                selector: `#node-${i}`
            });
        }
        issues.push({
            rule: "ACC-13",
            message: "positive tabindex",
            severity: "warning",
            selector: "[tabindex]"
        });

        const categories = buildCategories({ score: 55, issues }, { accessibility: 88 });
        const accessibility = categories.find((c) => c.id === "accessibility");

        expect(accessibility).toBeDefined();
        expect(accessibility?.score).toBe(88);
        expect(accessibility?.rules.length).toBe(2);

        const langRule = accessibility?.rules.find((r) => r.id === "ACC-01");
        expect(langRule?.elements?.length).toBe(20);
        expect(langRule?.elementsOmitted).toBe(5);
        expect(langRule?.fix).toBeDefined();

        const tabindexRule = accessibility?.rules.find((r) => r.id === "ACC-13");
        expect(tabindexRule?.status).toBe("warning");
    });
});