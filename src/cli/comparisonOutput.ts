import { compareReports } from "../comparison";
import type { AuditReport, AuditReportComparison } from "../core/types";
import { loadBaselineReport } from "./baseline";
import { evaluateCliComparisonGate } from "./comparisonGate";
import {
    emitComparisonCiJsonSummary,
    emitComparisonPayload,
    emitComparisonSummaryMarkdown,
    emitGitHubActionsComparisonSummaryMarkdown,
    emitGitLabComparisonSummaryMarkdown,
} from "./output";
import { failAndExit, failComparisonGate } from "./termination";

export interface CliComparisonOptions {
    compareWith: string | undefined;
    comparisonOutput: string | undefined;
    comparisonSummaryOutput: string | undefined;
    githubActionsSummaryOutput: string | undefined;
    gitlabSummaryOutput: string | undefined;
    comparisonCiJsonOutput: string | undefined;
    minScoreDelta: number | undefined;
    maxCriticalIncrease: number | undefined;
    maxWarningIncrease: number | undefined;
    maxRecommendationIncrease: number | undefined;
}

export interface CliComparisonContext {
    baselineReport: AuditReport | undefined;
    comparison: AuditReportComparison | undefined;
}

export function createCliComparisonContext(
    report: AuditReport,
    compareWith: string | undefined
): CliComparisonContext {
    let baselineReport: AuditReport | undefined;

    if (compareWith) {
        try {
            baselineReport = loadBaselineReport(compareWith);
        } catch (err) {
            failAndExit(`[wah] Could not load baseline report: ${err instanceof Error ? err.message : String(err)}`);
        }
    }

    return {
        baselineReport,
        comparison: baselineReport ? compareReports(report, baselineReport) : undefined,
    };
}

export function emitCliComparisonOutputs(
    comparison: AuditReportComparison | undefined,
    options: CliComparisonOptions
): void {
    if (!comparison) {
        return;
    }

    if (options.comparisonOutput) {
        emitComparisonPayload(comparison, options.comparisonOutput);
    }

    if (options.comparisonSummaryOutput) {
        emitComparisonSummaryMarkdown(comparison, options.comparisonSummaryOutput);
    }

    const gate = evaluateCliComparisonGate(comparison, {
        minScoreDelta: options.minScoreDelta,
        maxCriticalIncrease: options.maxCriticalIncrease,
        maxWarningIncrease: options.maxWarningIncrease,
        maxRecommendationIncrease: options.maxRecommendationIncrease,
    });

    if (options.githubActionsSummaryOutput) {
        emitGitHubActionsComparisonSummaryMarkdown(comparison, gate, options.githubActionsSummaryOutput);
    }

    if (options.gitlabSummaryOutput) {
        emitGitLabComparisonSummaryMarkdown(comparison, gate, options.gitlabSummaryOutput);
    }

    if (options.comparisonCiJsonOutput) {
        emitComparisonCiJsonSummary(comparison, gate, options.comparisonCiJsonOutput);
    }

    if (!gate.passed) {
        failComparisonGate(gate.reasons);
    }

    console.error(gate.baselineLine);
    console.error(gate.deltaLine);
}