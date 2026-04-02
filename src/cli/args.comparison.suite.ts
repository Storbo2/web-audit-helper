import { describe, expect, it } from "vitest";
import { parseCliArgs } from "./args";

describe("parseCliArgs comparison options", () => {
    it("parses --compare-with", () => {
        expect(parseCliArgs(["index.html", "--compare-with", "baseline.json"]))
            .toMatchObject({ compareWith: "baseline.json" });
    });

    it("parses --comparison-output when compare-with is present", () => {
        expect(parseCliArgs([
            "index.html",
            "--compare-with", "baseline.json",
            "--comparison-output", "comparison.json"
        ])).toMatchObject({
            compareWith: "baseline.json",
            comparisonOutput: "comparison.json"
        });
    });

    it("parses --comparison-summary-output when compare-with is present", () => {
        expect(parseCliArgs([
            "index.html",
            "--compare-with", "baseline.json",
            "--comparison-summary-output", "comparison-summary.md"
        ])).toMatchObject({
            compareWith: "baseline.json",
            comparisonSummaryOutput: "comparison-summary.md"
        });
    });

    it("parses --github-actions-summary-output when compare-with is present", () => {
        expect(parseCliArgs([
            "index.html",
            "--compare-with", "baseline.json",
            "--github-actions-summary-output", "gha-summary.md"
        ])).toMatchObject({
            compareWith: "baseline.json",
            githubActionsSummaryOutput: "gha-summary.md"
        });
    });

    it("parses --gitlab-summary-output when compare-with is present", () => {
        expect(parseCliArgs([
            "index.html",
            "--compare-with", "baseline.json",
            "--gitlab-summary-output", "gitlab-summary.md"
        ])).toMatchObject({
            compareWith: "baseline.json",
            gitlabSummaryOutput: "gitlab-summary.md"
        });
    });

    it("parses --comparison-ci-json-output when compare-with is present", () => {
        expect(parseCliArgs([
            "index.html",
            "--compare-with", "baseline.json",
            "--comparison-ci-json-output", "comparison-ci.json"
        ])).toMatchObject({
            compareWith: "baseline.json",
            comparisonCiJsonOutput: "comparison-ci.json"
        });
    });

    it("parses delta gate flags", () => {
        expect(parseCliArgs([
            "index.html",
            "--compare-with", "baseline.json",
            "--min-score-delta=-5",
            "--max-critical-increase", "0",
            "--max-warning-increase", "2",
            "--max-recommendation-increase", "4"
        ])).toMatchObject({
            compareWith: "baseline.json",
            minScoreDelta: -5,
            maxCriticalIncrease: 0,
            maxWarningIncrease: 2,
            maxRecommendationIncrease: 4,
        });
    });
});