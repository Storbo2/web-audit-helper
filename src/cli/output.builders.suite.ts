import { describe, expect, it } from "vitest";

import {
    buildComparisonCiJsonSummary,
    buildComparisonSummaryMarkdown,
    buildGitHubActionsComparisonSummaryMarkdown,
    buildGitLabComparisonSummaryMarkdown,
} from "./output";
import { createComparison, createGateEvaluation } from "./output.testUtils";

describe("cli output builders", () => {
    it("builds markdown summary for comparison", () => {
        const comparison = createComparison({
            baseline: {
                runId: "run-2",
                executedAt: "2026-04-01T10:01:00.000Z",
                targetUrl: "https://example.org",
            },
            overallScoreDelta: 3,
            severityDelta: {
                critical: -1,
                warning: 0,
                recommendation: 2,
            },
            addedRuleIds: ["ACC-02"],
            removedRuleIds: ["SEO-03"],
            categoryScoreDelta: {
                accessibility: 4,
            },
        });

        const markdown = buildComparisonSummaryMarkdown(comparison);

        expect(markdown).toContain("# WAH Comparison Summary");
        expect(markdown).toContain("Baseline run: run-2");
        expect(markdown).toContain("Overall score delta: 3");
        expect(markdown).toContain("Added: ACC-02");
        expect(markdown).toContain("Removed: SEO-03");
    });

    it("builds GitHub Actions markdown summary", () => {
        const comparison = createComparison({
            baseline: {
                runId: "run-github",
                executedAt: "2026-04-01T10:03:00.000Z",
                targetUrl: "https://example.dev",
            },
            overallScoreDelta: -2,
            severityDelta: {
                critical: 1,
                warning: 0,
                recommendation: 1,
            },
            addedRuleIds: ["ACC-10"],
            removedRuleIds: ["SEO-02"],
            categoryScoreDelta: {
                accessibility: -3,
            },
        });

        const markdown = buildGitHubActionsComparisonSummaryMarkdown(
            comparison,
            createGateEvaluation({
                passed: false,
                reasons: ["critical delta +1 exceeds maximum 0"],
            })
        );

        expect(markdown).toContain("## WAH Comparison (GitHub Actions)");
        expect(markdown).toContain("Status: ❌ FAIL");
        expect(markdown).toContain("Gate Violations");
        expect(markdown).toContain("critical delta +1 exceeds maximum 0");
    });

    it("builds compact CI JSON summary", () => {
        const comparison = createComparison({
            baseline: {
                runId: "run-ci",
                executedAt: "2026-04-01T10:05:00.000Z",
                targetUrl: "https://example.ci",
            },
            overallScoreDelta: -1,
            severityDelta: {
                critical: 1,
                warning: 0,
                recommendation: 0,
            },
            addedRuleIds: ["ACC-99"],
        });

        const summary = buildComparisonCiJsonSummary(
            comparison,
            createGateEvaluation({
                passed: false,
                reasons: ["critical delta +1 exceeds maximum 0"],
            })
        );

        expect(summary.schemaVersion).toBe("1.0.0");
        expect(summary.status).toBe("fail");
        expect(summary.delta.overallScore).toBe(-1);
        expect(summary.gate.reasons).toContain("critical delta +1 exceeds maximum 0");
    });

    it("builds GitLab markdown summary", () => {
        const comparison = createComparison({
            baseline: {
                runId: "run-gitlab",
                executedAt: "2026-04-01T10:07:00.000Z",
                targetUrl: "https://example.gitlab",
            },
            overallScoreDelta: -3,
            severityDelta: {
                critical: 1,
                warning: 1,
                recommendation: 0,
            },
            addedRuleIds: ["SEO-10"],
        });

        const markdown = buildGitLabComparisonSummaryMarkdown(
            comparison,
            createGateEvaluation({
                passed: false,
                reasons: ["overallScoreDelta -3 is below minimum -1"],
            })
        );

        expect(markdown).toContain("## WAH Comparison (GitLab CI)");
        expect(markdown).toContain("Status: FAIL");
        expect(markdown).toContain("Gate Violations");
    });
});