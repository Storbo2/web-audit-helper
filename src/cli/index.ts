#!/usr/bin/env node

import { parseCliArgs, HELP_TEXT } from "./args";
import { emitCliComparisonOutputs, createCliComparisonContext } from "./comparisonOutput";
import { executeCliAudit } from "./execution";
import {
    emitSerializedReport,
    serializeReport,
    type CliOutputFormat,
} from "./output";
import {
    exitSuccess,
    failAndExit,
    failFatal,
    failOnScoreThreshold,
    failWithUsage,
} from "./termination";
import { buildAuditReport } from "../reporters/auditReport";

async function main(): Promise<void> {
    const args = parseCliArgs();

    if (args === "help") {
        console.log(HELP_TEXT);
        exitSuccess();
    }

    if ("error" in args) {
        failWithUsage(args.error);
    }

    const {
        target,
        format,
        output,
        failOn,
        locale,
        scoringMode,
        browser,
        waitFor,
        compareWith,
        comparisonOutput,
        comparisonSummaryOutput,
        githubActionsSummaryOutput,
        gitlabSummaryOutput,
        comparisonCiJsonOutput,
        minScoreDelta,
        maxCriticalIncrease,
        maxWarningIncrease,
        maxRecommendationIncrease,
    } = args;

    let execution;
    try {
        execution = await executeCliAudit({
            target,
            browser,
            waitFor,
            locale,
            scoringMode,
        });
    } catch (err) {
        failAndExit(`[wah] Could not audit target: ${err instanceof Error ? err.message : String(err)}`);
    }

    const report = buildAuditReport(execution.result, execution.config);
    const { baselineReport, comparison } = createCliComparisonContext(report, compareWith);

    const serialized = serializeReport(report, format as CliOutputFormat, baselineReport, comparison);
    emitSerializedReport(serialized, output, report.score.overall);

    failOnScoreThreshold(report.score.overall, failOn);

    emitCliComparisonOutputs(comparison, {
        compareWith,
        comparisonOutput,
        comparisonSummaryOutput,
        githubActionsSummaryOutput,
        gitlabSummaryOutput,
        comparisonCiJsonOutput,
        minScoreDelta,
        maxCriticalIncrease,
        maxWarningIncrease,
        maxRecommendationIncrease,
    });

    execution.dom.window.close();
}

main().catch((err) => {
    failFatal(err);
});