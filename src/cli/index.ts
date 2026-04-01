#!/usr/bin/env node

import { JSDOM } from "jsdom";

import { parseCliArgs, HELP_TEXT } from "./args";
import { loadBaselineReport } from "./baseline";
import { evaluateCliComparisonGate } from "./comparisonGate";
import { createCliConfig } from "./config";
import { initializeCliEnvironment } from "./jsdom";
import {
    emitComparisonCiJsonSummary,
    emitComparisonPayload,
    emitGitHubActionsComparisonSummaryMarkdown,
    emitGitLabComparisonSummaryMarkdown,
    emitComparisonSummaryMarkdown,
    emitSerializedReport,
    serializeReport,
    type CliOutputFormat,
} from "./output";
import { resolveHtmlSource } from "./paths";
import { runPlaywrightAudit } from "./playwright";
import {
    exitSuccess,
    failAndExit,
    failComparisonGate,
    failFatal,
    failOnScoreThreshold,
    failWithUsage,
} from "./termination";
import { runCoreAudit } from "../core/index";
import { compareReports } from "../comparison";
import { buildAuditReport } from "../reporters/auditReport";
import type { AuditResult, WAHConfig } from "../core/types";
import type { AuditReport, AuditReportComparison } from "../core/types";

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

    let dom: JSDOM | undefined;
    let result: AuditResult;
    let config: WAHConfig;
    try {
        if (browser) {
            dom = initializeCliEnvironment(target);
            config = createCliConfig(locale, scoringMode);
            result = await runPlaywrightAudit({
                target,
                browser,
                waitFor,
                locale,
                scoringMode,
            });
        } else {
            const source = await resolveHtmlSource(target);
            dom = initializeCliEnvironment(source.url, source.html);
            config = createCliConfig(locale, scoringMode);
            result = runCoreAudit(config);
        }
    } catch (err) {
        failAndExit(`[wah] Could not audit target: ${err instanceof Error ? err.message : String(err)}`);
    }

    const report = buildAuditReport(result, config);

    let baselineReport: AuditReport | undefined;
    if (compareWith) {
        try {
            baselineReport = loadBaselineReport(compareWith);
        } catch (err) {
            failAndExit(`[wah] Could not load baseline report: ${err instanceof Error ? err.message : String(err)}`);
        }
    }

    const comparison: AuditReportComparison | undefined = baselineReport
        ? compareReports(report, baselineReport)
        : undefined;

    const serialized = serializeReport(report, format as CliOutputFormat, baselineReport, comparison);
    emitSerializedReport(serialized, output, report.score.overall);

    failOnScoreThreshold(report.score.overall, failOn);

    if (comparison) {
        if (comparisonOutput) {
            emitComparisonPayload(comparison, comparisonOutput);
        }

        if (comparisonSummaryOutput) {
            emitComparisonSummaryMarkdown(comparison, comparisonSummaryOutput);
        }

        const gate = evaluateCliComparisonGate(comparison, {
            minScoreDelta,
            maxCriticalIncrease,
            maxWarningIncrease,
            maxRecommendationIncrease,
        });

        if (githubActionsSummaryOutput) {
            emitGitHubActionsComparisonSummaryMarkdown(comparison, gate, githubActionsSummaryOutput);
        }

        if (gitlabSummaryOutput) {
            emitGitLabComparisonSummaryMarkdown(comparison, gate, gitlabSummaryOutput);
        }

        if (comparisonCiJsonOutput) {
            emitComparisonCiJsonSummary(comparison, gate, comparisonCiJsonOutput);
        }

        if (!gate.passed) {
            failComparisonGate(gate.reasons);
        }

        console.error(gate.baselineLine);
        console.error(gate.deltaLine);
    }

    dom?.window.close();
}

main().catch((err) => {
    failFatal(err);
});