import type { CliParseError } from "./types";

export interface CliComparisonOutputs {
    comparisonOutput: string | undefined;
    comparisonSummaryOutput: string | undefined;
    githubActionsSummaryOutput: string | undefined;
    gitlabSummaryOutput: string | undefined;
    comparisonCiJsonOutput: string | undefined;
}

export function extractComparisonOutputs(values: Record<string, unknown>): CliComparisonOutputs {
    return {
        comparisonOutput: values["comparison-output"] as string | undefined,
        comparisonSummaryOutput: values["comparison-summary-output"] as string | undefined,
        githubActionsSummaryOutput: values["github-actions-summary-output"] as string | undefined,
        gitlabSummaryOutput: values["gitlab-summary-output"] as string | undefined,
        comparisonCiJsonOutput: values["comparison-ci-json-output"] as string | undefined,
    };
}

export function validateComparisonRequirements(
    compareWith: string | undefined,
    outputs: CliComparisonOutputs,
    hasDeltaGates: boolean
): CliParseError | undefined {
    if (hasDeltaGates && compareWith === undefined) {
        return { error: "Delta gates require --compare-with <baseline-report.json>." };
    }

    if (outputs.comparisonOutput !== undefined && compareWith === undefined) {
        return { error: "--comparison-output requires --compare-with <baseline-report.json>." };
    }

    if (outputs.comparisonSummaryOutput !== undefined && compareWith === undefined) {
        return { error: "--comparison-summary-output requires --compare-with <baseline-report.json>." };
    }

    if (outputs.githubActionsSummaryOutput !== undefined && compareWith === undefined) {
        return { error: "--github-actions-summary-output requires --compare-with <baseline-report.json>." };
    }

    if (outputs.gitlabSummaryOutput !== undefined && compareWith === undefined) {
        return { error: "--gitlab-summary-output requires --compare-with <baseline-report.json>." };
    }

    if (outputs.comparisonCiJsonOutput !== undefined && compareWith === undefined) {
        return { error: "--comparison-ci-json-output requires --compare-with <baseline-report.json>." };
    }

    return undefined;
}