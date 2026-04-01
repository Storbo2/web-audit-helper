import type { ScoringMode } from "../../core/types";

export type CliBrowserName = "chromium" | "firefox" | "webkit";

export interface CliArgs {
    target: string;
    format: "json" | "html" | "txt";
    output: string | undefined;
    failOn: number | undefined;
    locale: "en" | "es";
    scoringMode: ScoringMode;
    browser: CliBrowserName | undefined;
    waitFor: string | undefined;
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

export type CliParseError = { error: string };