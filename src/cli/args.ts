import { parseArgs } from "node:util";
import type { ScoringMode } from "../core/types";
import { VALID_BROWSERS, VALID_FORMATS, VALID_LOCALES, VALID_SCORING_MODES } from "./args/constants";
import type { CliArgs, CliBrowserName, CliParseError } from "./args/types";
import { isHttpTarget, parseOptionalNumber } from "./args/validation";

export type { CliArgs, CliBrowserName } from "./args/types";
export { HELP_TEXT } from "./args/helpText";

export function parseCliArgs(argv: string[] = process.argv.slice(2)): CliArgs | "help" | CliParseError {
    let parsed: ReturnType<typeof parseArgs>;
    try {
        parsed = parseArgs({
            args: argv,
            options: {
                format: { type: "string", short: "f", default: "json" },
                output: { type: "string", short: "o" },
                "fail-on": { type: "string" },
                locale: { type: "string", default: "en" },
                "scoring-mode": { type: "string", default: "normal" },
                browser: { type: "string" },
                "wait-for": { type: "string" },
                "compare-with": { type: "string" },
                "comparison-output": { type: "string" },
                "comparison-summary-output": { type: "string" },
                "github-actions-summary-output": { type: "string" },
                "gitlab-summary-output": { type: "string" },
                "comparison-ci-json-output": { type: "string" },
                "min-score-delta": { type: "string" },
                "max-critical-increase": { type: "string" },
                "max-warning-increase": { type: "string" },
                "max-recommendation-increase": { type: "string" },
                help: { type: "boolean", short: "h", default: false },
            },
            allowPositionals: true,
        });
    } catch (err) {
        return { error: err instanceof Error ? err.message : String(err) };
    }

    const { values, positionals } = parsed;

    if (values.help || positionals.length === 0) return "help";

    const format = values["format"] as string;
    if (!VALID_FORMATS.includes(format as typeof VALID_FORMATS[number])) {
        return { error: `Invalid --format "${format}". Valid values: json, html, txt` };
    }

    const locale = values["locale"] as string;
    if (!VALID_LOCALES.includes(locale as typeof VALID_LOCALES[number])) {
        return { error: `Invalid --locale "${locale}". Valid values: en, es` };
    }

    const scoringMode = values["scoring-mode"] as string;
    if (!VALID_SCORING_MODES.includes(scoringMode as typeof VALID_SCORING_MODES[number])) {
        return { error: `Invalid --scoring-mode "${scoringMode}". Valid values: ${VALID_SCORING_MODES.join(", ")}` };
    }

    const browser = values["browser"] as string | undefined;
    if (browser !== undefined && !VALID_BROWSERS.includes(browser as typeof VALID_BROWSERS[number])) {
        return { error: `Invalid --browser "${browser}". Valid values: ${VALID_BROWSERS.join(", ")}` };
    }

    const waitFor = values["wait-for"] as string | undefined;
    if (waitFor !== undefined && browser === undefined) {
        return { error: `--wait-for requires --browser.` };
    }

    const target = positionals[0]!;
    if (browser !== undefined && !isHttpTarget(target)) {
        return { error: `--browser requires an http:// or https:// target.` };
    }

    const failOnStr = values["fail-on"] as string | undefined;
    let failOn: number | undefined;
    if (failOnStr !== undefined) {
        failOn = Number(failOnStr);
        if (!Number.isFinite(failOn) || failOn < 0 || failOn > 100) {
            return { error: `Invalid --fail-on "${failOnStr}". Must be a number between 0 and 100.` };
        }
    }

    const compareWith = values["compare-with"] as string | undefined;
    const comparisonOutput = values["comparison-output"] as string | undefined;
    const comparisonSummaryOutput = values["comparison-summary-output"] as string | undefined;
    const githubActionsSummaryOutput = values["github-actions-summary-output"] as string | undefined;
    const gitlabSummaryOutput = values["gitlab-summary-output"] as string | undefined;
    const comparisonCiJsonOutput = values["comparison-ci-json-output"] as string | undefined;

    const minScoreDelta = parseOptionalNumber(values["min-score-delta"] as string | undefined, "--min-score-delta");
    if (typeof minScoreDelta === "object") return minScoreDelta;

    const maxCriticalIncrease = parseOptionalNumber(
        values["max-critical-increase"] as string | undefined,
        "--max-critical-increase"
    );
    if (typeof maxCriticalIncrease === "object") return maxCriticalIncrease;

    const maxWarningIncrease = parseOptionalNumber(
        values["max-warning-increase"] as string | undefined,
        "--max-warning-increase"
    );
    if (typeof maxWarningIncrease === "object") return maxWarningIncrease;

    const maxRecommendationIncrease = parseOptionalNumber(
        values["max-recommendation-increase"] as string | undefined,
        "--max-recommendation-increase"
    );
    if (typeof maxRecommendationIncrease === "object") return maxRecommendationIncrease;

    const hasDeltaGates =
        minScoreDelta !== undefined
        || maxCriticalIncrease !== undefined
        || maxWarningIncrease !== undefined
        || maxRecommendationIncrease !== undefined;

    if (hasDeltaGates && compareWith === undefined) {
        return { error: "Delta gates require --compare-with <baseline-report.json>." };
    }

    if (comparisonOutput !== undefined && compareWith === undefined) {
        return { error: "--comparison-output requires --compare-with <baseline-report.json>." };
    }

    if (comparisonSummaryOutput !== undefined && compareWith === undefined) {
        return { error: "--comparison-summary-output requires --compare-with <baseline-report.json>." };
    }

    if (githubActionsSummaryOutput !== undefined && compareWith === undefined) {
        return { error: "--github-actions-summary-output requires --compare-with <baseline-report.json>." };
    }

    if (gitlabSummaryOutput !== undefined && compareWith === undefined) {
        return { error: "--gitlab-summary-output requires --compare-with <baseline-report.json>." };
    }

    if (comparisonCiJsonOutput !== undefined && compareWith === undefined) {
        return { error: "--comparison-ci-json-output requires --compare-with <baseline-report.json>." };
    }

    return {
        target,
        format: format as "json" | "html" | "txt",
        output: values["output"] as string | undefined,
        failOn,
        locale: locale as "en" | "es",
        scoringMode: scoringMode as ScoringMode,
        browser: browser as CliBrowserName | undefined,
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
    };
}