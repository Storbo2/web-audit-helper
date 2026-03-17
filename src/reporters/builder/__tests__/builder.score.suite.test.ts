import { describe, expect, it } from "vitest";
import { buildReportScore, buildReportStatsFromCategories, calculateRuleSummary } from "../../builder";
import { createSampleCategoryResults } from "./builder.testUtils";

describe("score and stats", () => {
    it("builds score and stats from category results", () => {
        const categories = createSampleCategoryResults();

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
});