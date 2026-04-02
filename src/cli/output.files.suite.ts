import { describe, expect, it } from "vitest";

import {
    emitComparisonCiJsonSummary,
    emitComparisonPayload,
    emitComparisonSummaryMarkdown,
    emitGitHubActionsComparisonSummaryMarkdown,
    emitGitLabComparisonSummaryMarkdown,
} from "./output";
import {
    createComparison,
    createGateEvaluation,
    registerCliOutputTestEnvironment,
} from "./output.testUtils";

const env = registerCliOutputTestEnvironment();

describe("cli output file emitters", () => {
    it("writes standalone comparison payload JSON", () => {
        const comparison = createComparison({
            baseline: {
                runId: "run-1",
                executedAt: "2026-04-01T10:00:00.000Z",
                targetUrl: "https://example.com",
            },
            overallScoreDelta: -2,
            severityDelta: {
                critical: 1,
                warning: 0,
                recommendation: -1,
            },
            addedRuleIds: ["SEO-01"],
            categoryScoreDelta: {
                seo: -5,
            },
        });

        emitComparisonPayload(comparison, "out/comparison.json");

        const outPath = env.resolveOutputPath("out/comparison.json");
        const saved = JSON.parse(env.readOutput("out/comparison.json"));

        expect(saved).toEqual(comparison);
        expect(env.getErrorSpy()).toHaveBeenCalledWith(`[wah] Comparison payload saved to ${outPath}`);
    });

    it("writes markdown summary for comparison", () => {
        const comparison = createComparison({
            baseline: {
                runId: "run-3",
                executedAt: "2026-04-01T10:02:00.000Z",
                targetUrl: "https://example.net",
            },
        });

        emitComparisonSummaryMarkdown(comparison, "out/comparison-summary.md");

        const outPath = env.resolveOutputPath("out/comparison-summary.md");
        const saved = env.readOutput("out/comparison-summary.md");

        expect(saved).toContain("# WAH Comparison Summary");
        expect(saved).toContain("Baseline run: run-3");
        expect(env.getErrorSpy()).toHaveBeenCalledWith(`[wah] Comparison summary saved to ${outPath}`);
    });

    it("writes GitHub Actions markdown summary", () => {
        const comparison = createComparison({
            baseline: {
                runId: "run-github-2",
                executedAt: "2026-04-01T10:04:00.000Z",
                targetUrl: "https://example.dev",
            },
            overallScoreDelta: 1,
        });

        emitGitHubActionsComparisonSummaryMarkdown(
            comparison,
            createGateEvaluation(),
            "out/gha-summary.md"
        );

        const outPath = env.resolveOutputPath("out/gha-summary.md");
        const saved = env.readOutput("out/gha-summary.md");

        expect(saved).toContain("## WAH Comparison (GitHub Actions)");
        expect(saved).toContain("Status: ✅ PASS");
        expect(env.getErrorSpy()).toHaveBeenCalledWith(`[wah] GitHub Actions summary saved to ${outPath}`);
    });

    it("writes compact CI JSON summary", () => {
        const comparison = createComparison({
            baseline: {
                runId: "run-ci-2",
                executedAt: "2026-04-01T10:06:00.000Z",
                targetUrl: "https://example.ci",
            },
            overallScoreDelta: 2,
        });

        emitComparisonCiJsonSummary(
            comparison,
            createGateEvaluation(),
            "out/comparison-ci.json"
        );

        const outPath = env.resolveOutputPath("out/comparison-ci.json");
        const saved = JSON.parse(env.readOutput("out/comparison-ci.json"));

        expect(saved.status).toBe("pass");
        expect(saved.schemaVersion).toBe("1.0.0");
        expect(env.getErrorSpy()).toHaveBeenCalledWith(`[wah] CI JSON summary saved to ${outPath}`);
    });

    it("writes GitLab markdown summary", () => {
        const comparison = createComparison({
            baseline: {
                runId: "run-gitlab-2",
                executedAt: "2026-04-01T10:08:00.000Z",
                targetUrl: "https://example.gitlab",
            },
            overallScoreDelta: 1,
        });

        emitGitLabComparisonSummaryMarkdown(
            comparison,
            createGateEvaluation(),
            "out/gitlab-summary.md"
        );

        const outPath = env.resolveOutputPath("out/gitlab-summary.md");
        const saved = env.readOutput("out/gitlab-summary.md");

        expect(saved).toContain("## WAH Comparison (GitLab CI)");
        expect(saved).toContain("Status: PASS");
        expect(env.getErrorSpy()).toHaveBeenCalledWith(`[wah] GitLab summary saved to ${outPath}`);
    });
});