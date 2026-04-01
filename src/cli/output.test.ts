import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { AuditReportComparison } from "../core/types";
import {
    buildComparisonCiJsonSummary,
    buildComparisonSummaryMarkdown,
    buildGitHubActionsComparisonSummaryMarkdown,
    buildGitLabComparisonSummaryMarkdown,
    emitComparisonCiJsonSummary,
    emitComparisonPayload,
    emitComparisonSummaryMarkdown,
    emitGitHubActionsComparisonSummaryMarkdown,
    emitGitLabComparisonSummaryMarkdown,
} from "./output";

describe("cli output helpers", () => {
    const originalCwd = process.cwd();
    let tempDir: string;
    let errorSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        tempDir = mkdtempSync(join(tmpdir(), "wah-output-"));
        process.chdir(tempDir);
        errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    });

    afterEach(() => {
        process.chdir(originalCwd);
        rmSync(tempDir, { recursive: true, force: true });
        vi.restoreAllMocks();
    });

    it("writes standalone comparison payload JSON", () => {
        const comparison: AuditReportComparison = {
            contractVersion: "1.0.0",
            baseline: {
                runId: "run-1",
                executedAt: "2026-04-01T10:00:00.000Z",
                targetUrl: "https://example.com"
            },
            overallScoreDelta: -2,
            severityDelta: {
                critical: 1,
                warning: 0,
                recommendation: -1
            },
            addedRuleIds: ["SEO-01"],
            removedRuleIds: [],
            categoryScoreDelta: {
                seo: -5
            }
        };

        emitComparisonPayload(comparison, "out/comparison.json");

        const outPath = resolve(tempDir, "out/comparison.json");
        const saved = JSON.parse(readFileSync(outPath, "utf-8"));

        expect(saved).toEqual(comparison);
        expect(errorSpy).toHaveBeenCalledWith(`[wah] Comparison payload saved to ${outPath}`);
    });

    it("builds markdown summary for comparison", () => {
        const comparison: AuditReportComparison = {
            contractVersion: "1.0.0",
            baseline: {
                runId: "run-2",
                executedAt: "2026-04-01T10:01:00.000Z",
                targetUrl: "https://example.org"
            },
            overallScoreDelta: 3,
            severityDelta: {
                critical: -1,
                warning: 0,
                recommendation: 2
            },
            addedRuleIds: ["ACC-02"],
            removedRuleIds: ["SEO-03"],
            categoryScoreDelta: {
                accessibility: 4
            }
        };

        const markdown = buildComparisonSummaryMarkdown(comparison);

        expect(markdown).toContain("# WAH Comparison Summary");
        expect(markdown).toContain("Baseline run: run-2");
        expect(markdown).toContain("Overall score delta: 3");
        expect(markdown).toContain("Added: ACC-02");
        expect(markdown).toContain("Removed: SEO-03");
    });

    it("writes markdown summary for comparison", () => {
        const comparison: AuditReportComparison = {
            contractVersion: "1.0.0",
            baseline: {
                runId: "run-3",
                executedAt: "2026-04-01T10:02:00.000Z",
                targetUrl: "https://example.net"
            },
            overallScoreDelta: 0,
            severityDelta: {
                critical: 0,
                warning: 0,
                recommendation: 0
            },
            addedRuleIds: [],
            removedRuleIds: [],
            categoryScoreDelta: {}
        };

        emitComparisonSummaryMarkdown(comparison, "out/comparison-summary.md");

        const outPath = resolve(tempDir, "out/comparison-summary.md");
        const saved = readFileSync(outPath, "utf-8");

        expect(saved).toContain("# WAH Comparison Summary");
        expect(saved).toContain("Baseline run: run-3");
        expect(errorSpy).toHaveBeenCalledWith(`[wah] Comparison summary saved to ${outPath}`);
    });

    it("builds GitHub Actions markdown summary", () => {
        const comparison: AuditReportComparison = {
            contractVersion: "1.0.0",
            baseline: {
                runId: "run-github",
                executedAt: "2026-04-01T10:03:00.000Z",
                targetUrl: "https://example.dev"
            },
            overallScoreDelta: -2,
            severityDelta: {
                critical: 1,
                warning: 0,
                recommendation: 1
            },
            addedRuleIds: ["ACC-10"],
            removedRuleIds: ["SEO-02"],
            categoryScoreDelta: {
                accessibility: -3
            }
        };

        const markdown = buildGitHubActionsComparisonSummaryMarkdown(comparison, {
            passed: false,
            reasons: ["critical delta +1 exceeds maximum 0"],
            baselineLine: "",
            deltaLine: ""
        });

        expect(markdown).toContain("## WAH Comparison (GitHub Actions)");
        expect(markdown).toContain("Status: ❌ FAIL");
        expect(markdown).toContain("Gate Violations");
        expect(markdown).toContain("critical delta +1 exceeds maximum 0");
    });

    it("writes GitHub Actions markdown summary", () => {
        const comparison: AuditReportComparison = {
            contractVersion: "1.0.0",
            baseline: {
                runId: "run-github-2",
                executedAt: "2026-04-01T10:04:00.000Z",
                targetUrl: "https://example.dev"
            },
            overallScoreDelta: 1,
            severityDelta: {
                critical: 0,
                warning: 0,
                recommendation: 0
            },
            addedRuleIds: [],
            removedRuleIds: [],
            categoryScoreDelta: {}
        };

        emitGitHubActionsComparisonSummaryMarkdown(comparison, {
            passed: true,
            reasons: [],
            baselineLine: "",
            deltaLine: ""
        }, "out/gha-summary.md");

        const outPath = resolve(tempDir, "out/gha-summary.md");
        const saved = readFileSync(outPath, "utf-8");

        expect(saved).toContain("## WAH Comparison (GitHub Actions)");
        expect(saved).toContain("Status: ✅ PASS");
        expect(errorSpy).toHaveBeenCalledWith(`[wah] GitHub Actions summary saved to ${outPath}`);
    });

    it("builds compact CI JSON summary", () => {
        const comparison: AuditReportComparison = {
            contractVersion: "1.0.0",
            baseline: {
                runId: "run-ci",
                executedAt: "2026-04-01T10:05:00.000Z",
                targetUrl: "https://example.ci"
            },
            overallScoreDelta: -1,
            severityDelta: {
                critical: 1,
                warning: 0,
                recommendation: 0
            },
            addedRuleIds: ["ACC-99"],
            removedRuleIds: [],
            categoryScoreDelta: {}
        };

        const summary = buildComparisonCiJsonSummary(comparison, {
            passed: false,
            reasons: ["critical delta +1 exceeds maximum 0"],
            baselineLine: "",
            deltaLine: ""
        });

        expect(summary.schemaVersion).toBe("1.0.0");
        expect(summary.status).toBe("fail");
        expect(summary.delta.overallScore).toBe(-1);
        expect(summary.gate.reasons).toContain("critical delta +1 exceeds maximum 0");
    });

    it("writes compact CI JSON summary", () => {
        const comparison: AuditReportComparison = {
            contractVersion: "1.0.0",
            baseline: {
                runId: "run-ci-2",
                executedAt: "2026-04-01T10:06:00.000Z",
                targetUrl: "https://example.ci"
            },
            overallScoreDelta: 2,
            severityDelta: {
                critical: 0,
                warning: 0,
                recommendation: 0
            },
            addedRuleIds: [],
            removedRuleIds: [],
            categoryScoreDelta: {}
        };

        emitComparisonCiJsonSummary(comparison, {
            passed: true,
            reasons: [],
            baselineLine: "",
            deltaLine: ""
        }, "out/comparison-ci.json");

        const outPath = resolve(tempDir, "out/comparison-ci.json");
        const saved = JSON.parse(readFileSync(outPath, "utf-8"));

        expect(saved.status).toBe("pass");
        expect(saved.schemaVersion).toBe("1.0.0");
        expect(errorSpy).toHaveBeenCalledWith(`[wah] CI JSON summary saved to ${outPath}`);
    });

    it("builds GitLab markdown summary", () => {
        const comparison: AuditReportComparison = {
            contractVersion: "1.0.0",
            baseline: {
                runId: "run-gitlab",
                executedAt: "2026-04-01T10:07:00.000Z",
                targetUrl: "https://example.gitlab"
            },
            overallScoreDelta: -3,
            severityDelta: {
                critical: 1,
                warning: 1,
                recommendation: 0
            },
            addedRuleIds: ["SEO-10"],
            removedRuleIds: [],
            categoryScoreDelta: {}
        };

        const markdown = buildGitLabComparisonSummaryMarkdown(comparison, {
            passed: false,
            reasons: ["overallScoreDelta -3 is below minimum -1"],
            baselineLine: "",
            deltaLine: ""
        });

        expect(markdown).toContain("## WAH Comparison (GitLab CI)");
        expect(markdown).toContain("Status: FAIL");
        expect(markdown).toContain("Gate Violations");
    });

    it("writes GitLab markdown summary", () => {
        const comparison: AuditReportComparison = {
            contractVersion: "1.0.0",
            baseline: {
                runId: "run-gitlab-2",
                executedAt: "2026-04-01T10:08:00.000Z",
                targetUrl: "https://example.gitlab"
            },
            overallScoreDelta: 1,
            severityDelta: {
                critical: 0,
                warning: 0,
                recommendation: 0
            },
            addedRuleIds: [],
            removedRuleIds: [],
            categoryScoreDelta: {}
        };

        emitGitLabComparisonSummaryMarkdown(comparison, {
            passed: true,
            reasons: [],
            baselineLine: "",
            deltaLine: ""
        }, "out/gitlab-summary.md");

        const outPath = resolve(tempDir, "out/gitlab-summary.md");
        const saved = readFileSync(outPath, "utf-8");

        expect(saved).toContain("## WAH Comparison (GitLab CI)");
        expect(saved).toContain("Status: PASS");
        expect(errorSpy).toHaveBeenCalledWith(`[wah] GitLab summary saved to ${outPath}`);
    });
});