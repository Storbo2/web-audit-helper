import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import { afterEach, beforeEach, vi } from "vitest";

import type { AuditReportComparison } from "../core/types";
import type { ComparisonGateEvaluation } from "./comparisonGate";

export function createComparison(overrides: Partial<AuditReportComparison> = {}): AuditReportComparison {
    return {
        contractVersion: "1.0.0",
        baseline: {
            runId: "baseline-run",
            executedAt: "2026-04-01T10:00:00.000Z",
            targetUrl: "https://example.com",
            ...overrides.baseline,
        },
        overallScoreDelta: 0,
        severityDelta: {
            critical: 0,
            warning: 0,
            recommendation: 0,
            ...overrides.severityDelta,
        },
        addedRuleIds: overrides.addedRuleIds ?? [],
        removedRuleIds: overrides.removedRuleIds ?? [],
        categoryScoreDelta: overrides.categoryScoreDelta ?? {},
        ...overrides,
    };
}

export function createGateEvaluation(
    overrides: Partial<ComparisonGateEvaluation> = {}
): ComparisonGateEvaluation {
    return {
        passed: true,
        reasons: [],
        baselineLine: "",
        deltaLine: "",
        ...overrides,
    };
}

export function registerCliOutputTestEnvironment(): {
    getTempDir: () => string;
    getErrorSpy: () => ReturnType<typeof vi.spyOn>;
    resolveOutputPath: (outputPath: string) => string;
    readOutput: (outputPath: string) => string;
} {
    const originalCwd = process.cwd();
    let tempDir = "";
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

    return {
        getTempDir: () => tempDir,
        getErrorSpy: () => errorSpy,
        resolveOutputPath: (outputPath: string) => resolve(tempDir, outputPath),
        readOutput: (outputPath: string) => readFileSync(resolve(tempDir, outputPath), "utf-8"),
    };
}