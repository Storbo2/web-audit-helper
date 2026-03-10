import { describe, it, expect, beforeEach, vi } from "vitest";
import "./scoring.mockSetup";
import { computeScoreDebug } from "./scoring";
import type { AuditIssue } from "./types";
import * as settingsModule from "../overlay/config/settings";

describe("Score Debugging", () => {
    beforeEach(() => {
        vi.mocked(settingsModule.loadSettings).mockReturnValue({
            scoringMode: "normal",
            logLevel: "full",
            highlightMs: 750
        });
        vi.mocked(settingsModule.getActiveFilters).mockReturnValue(new Set(["critical", "warning", "recommendation"]));
        vi.mocked(settingsModule.getActiveCategories).mockReturnValue(new Set(["accessibility", "seo"]));
    });

    it("should return complete score breakdown with multipliers", () => {
        const issues: AuditIssue[] = [
            { rule: "ACC-01", message: "Missing lang", severity: "critical", category: "accessibility" },
            { rule: "ACC-02", message: "Missing alt", severity: "warning", category: "accessibility" },
            { rule: "SEO-01", message: "Missing title", severity: "critical", category: "seo" }
        ];

        const debug = computeScoreDebug(issues);

        expect(debug.scoringMode).toBe("normal");
        expect(debug.multipliers).toEqual({ critical: 20, warning: 8, recommendation: 4 });
        expect(debug.categories.length).toBeGreaterThan(0);
        expect(debug.finalScore).toBeGreaterThanOrEqual(0);
        expect(debug.finalScore).toBeLessThanOrEqual(100);
    });

    it("should calculate category breakdown correctly", () => {
        const issues: AuditIssue[] = [
            { rule: "ACC-01", message: "Test", severity: "critical", category: "accessibility" },
            { rule: "ACC-02", message: "Test", severity: "warning", category: "accessibility" }
        ];

        const debug = computeScoreDebug(issues);

        const accCategory = debug.categories.find(c => c.category === "accessibility");
        expect(accCategory).toBeDefined();
        expect(accCategory!.criticalCount).toBe(1);
        expect(accCategory!.warningCount).toBe(1);
        expect(accCategory!.recommendationCount).toBe(0);
        expect(accCategory!.score).toBe(100 - 20 - 8);
        expect(accCategory!.weight).toBe(0.25);
        expect(accCategory!.weightedScore).toBe(72 * 0.25);
    });

    it("should handle multiple categories", () => {
        const issues: AuditIssue[] = [
            { rule: "ACC-01", message: "Test", severity: "critical", category: "accessibility" },
            { rule: "SEO-01", message: "Test", severity: "warning", category: "seo" },
            { rule: "SEM-01", message: "Test", severity: "recommendation", category: "semantic" }
        ];

        const debug = computeScoreDebug(issues);

        expect(debug.categories.length).toBe(3);
        expect(debug.categories.map(c => c.category)).toContain("accessibility");
        expect(debug.categories.map(c => c.category)).toContain("seo");
        expect(debug.categories.map(c => c.category)).toContain("semantic");
    });

    it("should handle no issues gracefully", () => {
        const issues: AuditIssue[] = [];

        const debug = computeScoreDebug(issues);

        expect(debug.categories.length).toBe(0);
        expect(debug.finalScore).toBe(100);
    });
});